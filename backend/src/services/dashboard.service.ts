import prisma from '../prisma/client.js';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../middleware/errorHandler.js';
import { UserRole } from '@prisma/client';

/**
 * Fetches job seeker dashboard data for a specific user
 * @param userId The ID of the job seeker
 * @returns Dashboard data including stats, applications, saved jobs and activity
 */
export const fetchJobSeekerDashboardData = async (userId: string) => {
  // Verify user exists and is a job seeker
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true }
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  if (user.role !== UserRole.JOBSEEKER) {
    throw new UnauthorizedError('User is not a job seeker');
  }

  // Get applications
  const applications = await prisma.jobApplication.findMany({
    where: { applicantId: userId },
    select: {
      id: true,
      status: true,
      createdAt: true,
      job: {
        select: {
          id: true,
          title: true,
          company: {
            select: {
              id: true,
              name: true,
              logo: true
            }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  // Get saved jobs
  const savedJobs = await prisma.savedJob.findMany({
    where: { userId },
    select: {
      id: true,
      createdAt: true,
      job: {
        select: {
          id: true,
          title: true,
          location: true,
          company: {
            select: {
              id: true,
              name: true,
              logo: true
            }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  // Get recent activity
  const recentActivity = await getJobSeekerActivity(userId);

  // Calculate stats
  const interviewCount = applications.filter(app =>
    app.status === 'INTERVIEW'
  ).length;

  const offersCount = applications.filter(app =>
    app.status === 'ACCEPTED'
  ).length;

  // Calculate profile completion percentage
  const profile = await prisma.profile.findUnique({
    where: { userId }
  });

  let profileCompletion = 0;
  if (profile) {
    // Base completion for having a profile
    profileCompletion += 20;
    
    // Has education entries
    if (profile.education && Array.isArray(JSON.parse(JSON.stringify(profile.education))) && 
        JSON.parse(JSON.stringify(profile.education)).length > 0) {
      profileCompletion += 20;
    }
    
    // Has experience entries
    if (profile.experience && Array.isArray(JSON.parse(JSON.stringify(profile.experience))) && 
        JSON.parse(JSON.stringify(profile.experience)).length > 0) {
      profileCompletion += 20;
    }
    
    // Has skills
    if (profile.skills && profile.skills.length > 0) profileCompletion += 20;
    
    // Has resume
    if (profile.resumeUrl) profileCompletion += 20;
  }

  // Format the data according to frontend expectations
  return {
    stats: {
      totalApplications: applications.length,
      interviews: interviewCount,
      offers: offersCount,
      savedJobs: savedJobs.length,
      profileCompletion
    },
    applications: applications.map(app => ({
      id: app.id,
      jobTitle: app.job.title,
      companyName: app.job.company.name,
      jobId: app.job.id,
      applied: app.createdAt.toISOString(),
      status: app.status,
      logo: app.job.company.logo
    })),
    savedJobs: savedJobs.map(saved => ({
      id: saved.id,
      title: saved.job.title,
      companyName: saved.job.company.name,
      location: saved.job.location,
      jobId: saved.job.id,
      savedAt: saved.createdAt.toISOString(),
      logo: saved.job.company.logo
    })),
    recentActivity
  };
};

/**
 * Removes a saved job for a user
 * @param jobId The saved job ID to remove
 * @param userId The user ID
 */
export const removeSavedJobForUser = async (savedJobId: string, userId: string) => {
  const savedJob = await prisma.savedJob.findUnique({
    where: { id: savedJobId },
    select: { userId: true }
  });

  if (!savedJob) {
    throw new NotFoundError('Saved job not found');
  }

  if (savedJob.userId !== userId) {
    throw new UnauthorizedError('Not authorized to remove this saved job');
  }

  return prisma.savedJob.delete({
    where: { id: savedJobId }
  });
};

/**
 * Withdraws a job application
 * @param applicationId The application ID to withdraw
 * @param userId The user ID
 */
export const withdrawApplicationForUser = async (applicationId: string, userId: string) => {
  const application = await prisma.jobApplication.findUnique({
    where: { id: applicationId },
    select: { applicantId: true }
  });

  if (!application) {
    throw new NotFoundError('Application not found');
  }

  if (application.applicantId !== userId) {
    throw new UnauthorizedError('Not authorized to withdraw this application');
  }

  return prisma.application.delete({
    where: { id: applicationId }
  });
};

/**
 * Gets recent activity for a job seeker
 * @param userId The job seeker user ID
 */
export const getJobSeekerActivity = async (userId: string) => {
  // Get recent job views
  const views = await prisma.jobView.findMany({
    where: { userId },
    select: {
      id: true,
      createdAt: true,
      job: {
        select: {
          id: true,
          title: true,
          company: {
            select: { name: true }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  // Get recent applications
  const applications = await prisma.jobApplication.findMany({
    where: { applicantId: userId },
    select: {
      id: true,
      createdAt: true,
      job: {
        select: {
          id: true,
          title: true,
          company: {
            select: { name: true }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  // Get recent saved jobs
  const saves = await prisma.savedJob.findMany({
    where: { userId },
    select: {
      id: true,
      createdAt: true,
      job: {
        select: {
          id: true,
          title: true,
          company: {
            select: { name: true }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  // Combine and sort all activities
  const allActivities = [
    ...views.map(view => ({
      id: view.id,
      type: 'VIEW' as const,
      timestamp: view.createdAt,
      title: `Viewed job: ${view.job.title}`,
      relatedEntity: view.job.company.name,
      entityId: view.job.id
    })),
    ...applications.map(app => ({
      id: app.id,
      type: 'APPLY' as const,
      timestamp: app.createdAt,
      title: `Applied to: ${app.job.title}`,
      relatedEntity: app.job.company.name,
      entityId: app.job.id
    })),
    ...saves.map(save => ({
      id: save.id,
      type: 'SAVE' as const,
      timestamp: save.createdAt,
      title: `Saved job: ${save.job.title}`,
      relatedEntity: save.job.company.name,
      entityId: save.job.id
    }))
  ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  // Return only the latest 10 activities
  return allActivities.slice(0, 10).map(activity => ({
    ...activity,
    timestamp: activity.timestamp.toISOString()
  }));
};

/**
 * Fetches employer dashboard data for a specific user
 * @param userId The ID of the employer
 * @returns Dashboard data including stats, jobs, applications and activity
 */
export const fetchEmployerDashboardData = async (userId: string) => {
  // Verify user exists and is an employer
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true }
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  if (user.role !== UserRole.EMPLOYER) {
    throw new UnauthorizedError('User is not an employer');
  }

  // Get company for the employer
  const company = await prisma.company.findFirst({
    where: { ownerId: userId }
  });

  if (!company) {
    throw new NotFoundError('Company not found for this user');
  }

  // Get jobs posted by the company
  const jobs = await prisma.job.findMany({
    where: { companyId: company.id },
    select: {
      id: true,
      title: true,
      location: true,
      type: true,
      status: true,
      createdAt: true,
      expiresAt: true,
      applications: {
        select: { id: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  // Get applications for the company's jobs
  const jobIds = jobs.map(job => job.id);
  const applications = await prisma.application.findMany({
    where: {
      jobId: { in: jobIds }
    },
    select: {
      id: true,
      status: true,
      createdAt: true,
      applicant: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true
        }
      },
      job: {
        select: {
          id: true,
          title: true
        }
      },
      resume: true
    },
    orderBy: { createdAt: 'desc' }
  });

  // Get company activity
  const recentActivity = await getEmployerActivity(company.id);

  // Calculate company profile completion
  const companyProfileCompletion = calculateCompanyProfileCompletion(company);

  // Format the data according to frontend expectations
  return {
    stats: {
      activeJobs: jobs.filter(job => job.status === 'ACTIVE').length,
      totalApplications: applications.length,
      reviewingApplications: applications.filter(app => app.status === 'REVIEWING').length,
      interviewInvitations: applications.filter(app => app.status === 'INTERVIEW').length
    },
    postedJobs: jobs.map(job => ({
      id: job.id,
      title: job.title,
      location: job.location,
      type: job.type,
      status: job.status,
      postedAt: job.createdAt.toISOString(),
      expiresAt: job.expiresAt ? job.expiresAt.toISOString() : null,
      applicationsCount: job.applications.length
    })),
    applications: applications.map(app => ({
      id: app.id,
      jobId: app.job.id,
      jobTitle: app.job.title,
      applicantId: app.applicant.id,
      applicantName: `${app.applicant.firstName} ${app.applicant.lastName}`,
      status: app.status,
      appliedAt: app.createdAt.toISOString(),
      applicantEmail: app.applicant.email,
      applicantPhone: app.applicant.phone,
      resumeUrl: app.resume
    })),
    recentActivity,
    companyProfileComplete: companyProfileCompletion.complete,
    companyProfilePercentage: companyProfileCompletion.percentage
  };
};

/**
 * Updates the status of a job application
 * @param applicationId The application ID to update
 * @param status The new status
 * @param userId The user ID (employer)
 * @param notes Optional notes about the status change
 */
export const updateApplicationStatus = async (
  applicationId: string,
  status: string,
  userId: string,
  notes?: string
) => {
  // Verify the user is an employer
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true }
  });

  if (!user || user.role !== UserRole.EMPLOYER) {
    throw new UnauthorizedError('Not authorized to update application status');
  }

  // Find the application
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    select: {
      id: true,
      job: {
        select: {
          companyId: true,
          company: {
            select: {
              ownerId: true
            }
          }
        }
      }
    }
  });

  if (!application) {
    throw new NotFoundError('Application not found');
  }

  // Verify the employer owns the company that posted the job
  if (application.job.company.ownerId !== userId) {
    throw new UnauthorizedError('Not authorized to update this application');
  }

  // Validate status
  const validStatuses = ['PENDING', 'REVIEWING', 'INTERVIEW', 'REJECTED', 'ACCEPTED'];
  if (!validStatuses.includes(status)) {
    throw new BadRequestError('Invalid application status');
  }

  // Update the application
  return prisma.application.update({
    where: { id: applicationId },
    data: {
      status: status as any,  // Cast to any since we validated the enum values
      notes: notes
    }
  });
};

/**
 * Deletes a job posting
 * @param jobId The job ID to delete
 * @param userId The user ID (employer)
 */
export const deletePostedJob = async (jobId: string, userId: string) => {
  // Verify the user is an employer
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true }
  });

  if (!user || user.role !== UserRole.EMPLOYER) {
    throw new UnauthorizedError('Not authorized to delete job postings');
  }

  // Find the job
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: {
      id: true,
      company: {
        select: {
          ownerId: true
        }
      }
    }
  });

  if (!job) {
    throw new NotFoundError('Job not found');
  }

  // Verify the employer owns the company that posted the job
  if (job.company.ownerId !== userId) {
    throw new UnauthorizedError('Not authorized to delete this job');
  }

  // Delete the job
  return prisma.job.delete({
    where: { id: jobId }
  });
};

/**
 * Gets recent activity for an employer
 * @param companyId The company ID
 */
export const getEmployerActivity = async (companyId: string) => {
  // Get job postings
  const jobPostings = await prisma.job.findMany({
    where: {
      companyId,
      createdAt: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
      }
    },
    select: {
      id: true,
      title: true,
      createdAt: true
    },
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  // Get job expirations
  const expiredJobs = await prisma.job.findMany({
    where: {
      companyId,
      status: 'EXPIRED',
      updatedAt: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
      }
    },
    select: {
      id: true,
      title: true,
      updatedAt: true
    },
    orderBy: { updatedAt: 'desc' },
    take: 5
  });

  // Get new applications
  const newApplications = await prisma.application.findMany({
    where: {
      job: { companyId },
      createdAt: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
      }
    },
    select: {
      id: true,
      createdAt: true,
      applicant: {
        select: {
          firstName: true,
          lastName: true
        }
      },
      job: {
        select: {
          id: true,
          title: true
        }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  // Get interview scheduled
  const interviews = await prisma.application.findMany({
    where: {
      job: { companyId },
      status: 'INTERVIEW',
      updatedAt: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
      }
    },
    select: {
      id: true,
      updatedAt: true,
      applicant: {
        select: {
          firstName: true,
          lastName: true
        }
      },
      job: {
        select: {
          id: true,
          title: true
        }
      }
    },
    orderBy: { updatedAt: 'desc' },
    take: 5
  });

  // Combine and sort all activities
  const allActivities = [
    ...jobPostings.map(job => ({
      id: job.id,
      type: 'JOB_POSTED' as const,
      timestamp: job.createdAt,
      title: `Job posted: ${job.title}`,
      relatedEntity: 'Your company',
      entityId: job.id
    })),
    ...expiredJobs.map(job => ({
      id: job.id,
      type: 'JOB_EXPIRED' as const,
      timestamp: job.updatedAt,
      title: `Job expired: ${job.title}`,
      relatedEntity: 'Your company',
      entityId: job.id
    })),
    ...newApplications.map(app => ({
      id: app.id,
      type: 'NEW_APPLICATION' as const,
      timestamp: app.createdAt,
      title: `New application from ${app.applicant.firstName} ${app.applicant.lastName}`,
      relatedEntity: app.job.title,
      entityId: app.job.id
    })),
    ...interviews.map(app => ({
      id: app.id,
      type: 'INTERVIEW_SCHEDULED' as const,
      timestamp: app.updatedAt,
      title: `Interview scheduled with ${app.applicant.firstName} ${app.applicant.lastName}`,
      relatedEntity: app.job.title,
      entityId: app.job.id
    }))
  ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  // Return only the latest 10 activities
  return allActivities.slice(0, 10).map(activity => ({
    ...activity,
    timestamp: activity.timestamp.toISOString()
  }));
};

/**
 * Calculates company profile completion status
 * @param company The company object
 * @returns Completion percentage and whether the profile is complete
 */
export const calculateCompanyProfileCompletion = (company: any) => {
  let percentage = 0;
  let requiredFieldsCount = 0;
  let completedFieldsCount = 0;

  // Basic info
  const requiredFields = [
    'name',
    'website',
    'industry',
    'size',
    'location',
    'description'
  ];

  requiredFieldsCount += requiredFields.length;

  for (const field of requiredFields) {
    if (company[field]) {
      completedFieldsCount++;
    }
  }

  // Company logo
  requiredFieldsCount++;
  if (company.logo) {
    completedFieldsCount++;
  }

  // Calculate percentage
  percentage = Math.round((completedFieldsCount / requiredFieldsCount) * 100);

  // Mark as complete if 80% or more is complete
  return {
    percentage,
    complete: percentage >= 80
  };
};

/**
 * Gets company profile completion information for an employer
 * @param userId The user ID (employer)
 */
export const getCompanyProfileCompletion = async (userId: string) => {
  // Verify the user is an employer
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true }
  });

  if (!user || user.role !== UserRole.EMPLOYER) {
    throw new UnauthorizedError('User is not an employer');
  }

  // Get the company for this employer
  const company = await prisma.company.findFirst({
    where: { ownerId: userId }
  });

  if (!company) {
    return { complete: false, percentage: 0 };
  }

  return calculateCompanyProfileCompletion(company);
};

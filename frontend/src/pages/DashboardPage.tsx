import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import JobSeekerDashboard from '../components/jobseeker/JobSeekerDashboard';
import EmployerDashboard from '../components/employer/EmployerDashboard';

// Job seeker types
interface JobApplication {
  id: string;
  jobTitle: string;
  companyName: string;
  status: 'PENDING' | 'INTERVIEW' | 'REJECTED' | 'ACCEPTED';
  applied: string; // ISO date string
  logo?: string;
}

interface SavedJob {
  id: string;
  title: string;
  companyName: string;
  location: string;
  savedAt: string; // ISO date string
  logo?: string;
}

interface RecentActivity {
  id: string;
  type: 'VIEW' | 'APPLY' | 'SAVE' | 'MESSAGE';
  title: string;
  timestamp: string; // ISO date string
  relatedEntity: string;
}

// Employer types
interface PostedJob {
  id: string;
  title: string;
  location: string;
  type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT';
  applicationsCount: number;
  status: 'ACTIVE' | 'EXPIRED' | 'DRAFT';
  postedAt: string; // ISO date string
  expiresAt: string; // ISO date string
}

interface ReceivedApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  applicantName: string;
  applicantId: string;
  status: 'PENDING' | 'REVIEWING' | 'INTERVIEW' | 'REJECTED' | 'ACCEPTED';
  appliedAt: string; // ISO date string
}

interface EmployerActivity {
  id: string;
  type: 'NEW_APPLICATION' | 'APPLICATION_VIEWED' | 'JOB_POSTED' | 'JOB_EXPIRED' | 'INTERVIEW_SCHEDULED';
  title: string;
  timestamp: string; // ISO date string
  relatedEntity: string;
}

const DashboardPage = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  // Job seeker state
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [stats, setStats] = useState({
    totalApplications: 0,
    interviews: 0,
    offers: 0,
    savedJobs: 0
  });

  // Employer state
  const [postedJobs, setPostedJobs] = useState<PostedJob[]>([]);
  const [receivedApplications, setReceivedApplications] = useState<ReceivedApplication[]>([]);
  const [employerActivity, setEmployerActivity] = useState<EmployerActivity[]>([]);
  const [employerStats, setEmployerStats] = useState({
    activeJobs: 0,
    totalApplications: 0,
    reviewingApplications: 0,
    interviewInvitations: 0
  });
  const [companyProfileComplete, setCompanyProfileComplete] = useState(false);

  useEffect(() => {
    // This would be fetched from your API in a real implementation
    const fetchDashboardData = async () => {
      try {
        // Simulate API call with timeout
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (currentUser?.role === 'JOBSEEKER') {
          // Fetch job seeker dashboard data
          fetchJobSeekerData();
        } else if (currentUser?.role === 'EMPLOYER') {
          // Fetch employer dashboard data
          fetchEmployerData();
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAuthenticated, currentUser, navigate]);

  // Function to fetch job seeker data
  const fetchJobSeekerData = () => {
    // Mock data for demonstration purposes
    setApplications([
      {
        id: '1',
        jobTitle: 'Frontend Developer',
        companyName: 'TechCorp',
        status: 'INTERVIEW',
        applied: '2025-03-20T09:30:00.000Z'
      },
      {
        id: '2',
        jobTitle: 'UI/UX Designer',
        companyName: 'Design Studio',
        status: 'PENDING',
        applied: '2025-03-18T14:20:00.000Z'
      },
      {
        id: '3',
        jobTitle: 'Full Stack Developer',
        companyName: 'Startup Inc',
        status: 'REJECTED',
        applied: '2025-03-15T11:45:00.000Z'
      },
      {
        id: '4',
        jobTitle: 'React Developer',
        companyName: 'WebSolutions',
        status: 'ACCEPTED',
        applied: '2025-03-10T08:15:00.000Z'
      }
    ]);

    setSavedJobs([
      {
        id: '1',
        title: 'Backend Engineer',
        companyName: 'Cloud Systems',
        location: 'Remote',
        savedAt: '2025-03-22T16:30:00.000Z'
      },
      {
        id: '2',
        title: 'DevOps Engineer',
        companyName: 'InfraTech',
        location: 'New York, NY',
        savedAt: '2025-03-21T10:15:00.000Z'
      },
      {
        id: '3',
        title: 'Mobile Developer',
        companyName: 'AppWorks',
        location: 'San Francisco, CA',
        savedAt: '2025-03-19T14:45:00.000Z'
      }
    ]);

    setRecentActivity([
      {
        id: '1',
        type: 'APPLY',
        title: 'Applied to Frontend Developer',
        timestamp: '2025-03-20T09:30:00.000Z',
        relatedEntity: 'TechCorp'
      },
      {
        id: '2',
        type: 'VIEW',
        title: 'Viewed Backend Engineer job',
        timestamp: '2025-03-22T16:30:00.000Z',
        relatedEntity: 'Cloud Systems'
      },
      {
        id: '3',
        type: 'SAVE',
        title: 'Saved DevOps Engineer job',
        timestamp: '2025-03-21T10:15:00.000Z',
        relatedEntity: 'InfraTech'
      },
      {
        id: '4',
        type: 'MESSAGE',
        title: 'Received message regarding your application',
        timestamp: '2025-03-21T15:20:00.000Z',
        relatedEntity: 'TechCorp'
      }
    ]);

    setStats({
      totalApplications: 4,
      interviews: 1,
      offers: 1,
      savedJobs: 3
    });
  };

  // Function to fetch employer data
  const fetchEmployerData = () => {
    // Mock data for employer dashboard
    setPostedJobs([
      {
        id: '1',
        title: 'Senior Frontend Developer',
        location: 'New York, NY',
        type: 'FULL_TIME',
        applicationsCount: 12,
        status: 'ACTIVE',
        postedAt: '2025-03-15T10:00:00.000Z',
        expiresAt: '2025-04-15T10:00:00.000Z'
      },
      {
        id: '2',
        title: 'UX/UI Designer',
        location: 'Remote',
        type: 'FULL_TIME',
        applicationsCount: 8,
        status: 'ACTIVE',
        postedAt: '2025-03-18T11:30:00.000Z',
        expiresAt: '2025-04-18T11:30:00.000Z'
      },
      {
        id: '3',
        title: 'Junior Backend Developer',
        location: 'San Francisco, CA',
        type: 'FULL_TIME',
        applicationsCount: 5,
        status: 'ACTIVE',
        postedAt: '2025-03-20T09:15:00.000Z',
        expiresAt: '2025-04-20T09:15:00.000Z'
      },
      {
        id: '4',
        title: 'DevOps Engineer',
        location: 'Chicago, IL',
        type: 'CONTRACT',
        applicationsCount: 3,
        status: 'EXPIRED',
        postedAt: '2025-02-10T14:00:00.000Z',
        expiresAt: '2025-03-10T14:00:00.000Z'
      }
    ]);

    setReceivedApplications([
      {
        id: '1',
        jobId: '1',
        jobTitle: 'Senior Frontend Developer',
        applicantName: 'John Smith',
        applicantId: 'user-123',
        status: 'REVIEWING',
        appliedAt: '2025-03-16T11:30:00.000Z'
      },
      {
        id: '2',
        jobId: '1',
        jobTitle: 'Senior Frontend Developer',
        applicantName: 'Sarah Johnson',
        applicantId: 'user-124',
        status: 'INTERVIEW',
        appliedAt: '2025-03-17T09:45:00.000Z'
      },
      {
        id: '3',
        jobId: '2',
        jobTitle: 'UX/UI Designer',
        applicantName: 'Michael Brown',
        applicantId: 'user-125',
        status: 'PENDING',
        appliedAt: '2025-03-19T14:20:00.000Z'
      },
      {
        id: '4',
        jobId: '3',
        jobTitle: 'Junior Backend Developer',
        applicantName: 'Emily Davis',
        applicantId: 'user-126',
        status: 'REVIEWING',
        appliedAt: '2025-03-21T16:10:00.000Z'
      }
    ]);

    setEmployerActivity([
      {
        id: '1',
        type: 'NEW_APPLICATION',
        title: 'New application for Senior Frontend Developer',
        timestamp: '2025-03-21T16:10:00.000Z',
        relatedEntity: 'Emily Davis'
      },
      {
        id: '2',
        type: 'INTERVIEW_SCHEDULED',
        title: 'Interview scheduled with Sarah Johnson',
        timestamp: '2025-03-20T10:30:00.000Z',
        relatedEntity: 'Senior Frontend Developer'
      },
      {
        id: '3',
        type: 'JOB_POSTED',
        title: 'Posted Junior Backend Developer job',
        timestamp: '2025-03-20T09:15:00.000Z',
        relatedEntity: 'Your Company'
      },
      {
        id: '4',
        type: 'APPLICATION_VIEWED',
        title: 'Reviewed Michael Brown\'s application',
        timestamp: '2025-03-19T15:45:00.000Z',
        relatedEntity: 'UX/UI Designer'
      },
      {
        id: '5',
        type: 'JOB_EXPIRED',
        title: 'DevOps Engineer job posting expired',
        timestamp: '2025-03-10T14:00:00.000Z',
        relatedEntity: 'Your Company'
      }
    ]);

    setEmployerStats({
      activeJobs: 3,
      totalApplications: 28,
      reviewingApplications: 5,
      interviewInvitations: 2
    });

    // Check if company profile is complete - this would come from an API in a real implementation
    setCompanyProfileComplete(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl py-10 px-4 sm:px-6">
      <h1 className="text-3xl font-bold mb-8 text-jobboard-darkblue">Dashboard</h1>

      {currentUser?.role === 'JOBSEEKER' ? (
        <JobSeekerDashboard 
          stats={stats}
          applications={applications}
          savedJobs={savedJobs}
          recentActivity={recentActivity}
        />
      ) : currentUser?.role === 'EMPLOYER' ? (
        <EmployerDashboard 
          stats={employerStats}
          postedJobs={postedJobs}
          applications={receivedApplications}
          recentActivity={employerActivity}
          companyProfileComplete={companyProfileComplete}
        />
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Welcome to Job Board</h2>
          <p className="text-gray-500 mb-6">
            Your dashboard features will appear based on your account type.
          </p>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;

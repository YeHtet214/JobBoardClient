export type ApplicationStatus = 'PENDING' | 'REVIEWING' | 'INTERVIEW' | 'REJECTED' | 'ACCEPTED';

export interface Application {
  id: string;
  jobId: string;
  applicantId: string;
  coverLetter?: string;
  resumeUrl?: string;
  status: ApplicationStatus;
  appliedAt: string;
  updatedAt: string;
  job?: any; // The job details will be populated when needed
  applicant?: any; // The applicant details will be populated when needed
}

export interface CreateApplicationDto {
  jobId: string;
  coverLetter?: string;
  resumeUrl?: string;
}

export interface UpdateApplicationDto {
  status?: ApplicationStatus;
  notes?: string;
}

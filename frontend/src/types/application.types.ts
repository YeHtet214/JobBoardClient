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

export interface UpdateApplicationDto extends Partial<Application> {
  status: ApplicationStatus;
}

export interface ApplicationFormValues {
    // Personal info
    fullName: string;
    email: string;
    phone: string;

    // Resume
    resume: File | null;
    useExistingResume: boolean;

    // Cover letter
    coverLetter: string;

    // Additional questions
    availability: string;
    expectedSalary: string;
    additionalInfo: string;

    // Terms
    acceptTerms: boolean;
}
export type JobType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT';

export interface Job {
  id: string;
  title: string;
  description: string;
  companyId: string;
  postedById: string;
  location: string;
  type: JobType;
  salaryMin: number;
  salaryMax: number;
  requiredSkills: string[];
  experienceLevel: string;
  expiresAt?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  company?: any;
  postedBy?: any;
}

export interface CreateJobDto {
  title: string;
  description: string;
  location: string;
  type: JobType;
  salaryMin: number;
  salaryMax: number;
  requiredSkills: string[];
  experienceLevel: string;
  expiresAt?: string;
}

export interface UpdateJobDto extends Partial<CreateJobDto> {
  isActive?: boolean;
}

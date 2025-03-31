import { ApiService } from '@/services/api.service';
import { Job, CreateJobDto, UpdateJobDto, JobsResponse } from '@/types/job.types';

export interface JobSearchParams {
  keyword?: string;
  location?: string;
  jobTypes?: string[];
  experienceLevel?: string;
  page?: number;
  limit?: number;
}

class JobService extends ApiService {
  private endpoints = {
    ALL: '/jobs',
    COMPANY_JOBS: '/jobs/company',
    DETAIL: (id: string) => `/jobs/${id}`,
    SEARCH: '/jobs/search',
    COMPANY: (companyId: string) => `/jobs/company/${companyId}`,
  };

  public async getAllJobs(params?: JobSearchParams): Promise<JobsResponse> {
    const queryParams = this.createQueryParams(params || {});
    const url = `${this.endpoints.ALL}?${queryParams.toString()}`;
    const response = await this.get<JobsResponse>(url);
    return response.data.data;
  }

  public async searchJobs(params: JobSearchParams): Promise<JobsResponse> {
    const queryParams = this.createQueryParams(params);
    const url = `${this.endpoints.SEARCH}?${queryParams.toString()}`;
    const response = await this.get<JobsResponse>(url);
    return response.data.data;
  }

  public async getJobById(id: string): Promise<Job> {
    const response = await this.get<Job>(this.endpoints.DETAIL(id));
    return response.data.data;
  }

  public async getCompanyJobs(params?: JobSearchParams): Promise<JobsResponse> {
    const queryParams = this.createQueryParams(params || {});
    const url = `${this.endpoints.COMPANY_JOBS}?${queryParams.toString()}`;
    const response = await this.get<JobsResponse>(url);
    return response.data.data;
  }

  public async getJobsByCompany(companyId: string, params?: JobSearchParams): Promise<JobsResponse> {
    const queryParams = this.createQueryParams(params || {});
    const url = `${this.endpoints.COMPANY(companyId)}?${queryParams.toString()}`;
    const response = await this.get<JobsResponse>(url);
    return response.data.data;
  }

  public async createJob(job: CreateJobDto): Promise<Job> {
    const response = await this.post<Job>(this.endpoints.ALL, job);
    return response.data.data;
  }

  public async updateJob(id: string, job: UpdateJobDto): Promise<Job> {
    const response = await this.put<Job>(this.endpoints.DETAIL(id), job);
    return response.data.data;
  }

  public async deleteJob(id: string): Promise<void> {
    await this.delete<void>(this.endpoints.DETAIL(id));
  }

  private createQueryParams(params: JobSearchParams): URLSearchParams {
    const queryParams = new URLSearchParams();
    
    if (params && Object.keys(params).length > 0) {
      for (const [key, value] of Object.entries(params)) {
        if (key === 'jobTypes' && Array.isArray(value)) {
          value.forEach(type => queryParams.append('jobTypes', type));
        } else {
          if (value !== undefined && value !== null && value !== '') 
            queryParams.append(key, String(value));
        }
      }
    }
    
    return queryParams;
  }
}

export default new JobService();

import { ApiService } from '@/services/api.service';
import { Job, CreateJobDto, UpdateJobDto } from '@/types/job.types';

class JobService extends ApiService {
  private endpoints = {
    ALL: '/jobs',
    COMPANY_JOBS: '/jobs/company',
    DETAIL: (id: string) => `/jobs/${id}`,
  };

  public async getAllJobs(): Promise<Job[]> {
    const response = await this.get<Job[]>(this.endpoints.ALL);
    return response.data.data;
  }

  public async getJobById(id: string): Promise<Job> {
    const response = await this.get<Job>(this.endpoints.DETAIL(id));
    return response.data.data;
  }

  public async getCompanyJobs(): Promise<Job[]> {
    const response = await this.get<Job[]>(this.endpoints.COMPANY_JOBS);
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
}

export default new JobService();

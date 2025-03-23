import { ApiService } from './api.service';
import { Job, CreateJobDto, UpdateJobDto } from '../types/job.types';

class JobService extends ApiService {
  private baseUrl = 'http://localhost:3000/api/jobs';

  public async getAllJobs(): Promise<Job[]> {
    const response = await this.get<Job[]>(this.baseUrl);
    return response.data.data;
  }

  public async getJobById(id: string): Promise<Job> {
    const response = await this.get<Job>(`${this.baseUrl}/${id}`);
    return response.data.data;
  }

  public async getJobsByCompany(companyId: string): Promise<Job[]> {
    const response = await this.get<Job[]>(`${this.baseUrl}/by-company/${companyId}`);
    return response.data.data;
  }

  public async createJob(job: CreateJobDto): Promise<Job> {
    const response = await this.post<Job>(this.baseUrl, job);
    return response.data.data;
  }

  public async updateJob(id: string, job: UpdateJobDto): Promise<Job> {
    const response = await this.put<Job>(`${this.baseUrl}/${id}`, job);
    return response.data.data;
  }

  public async deleteJob(id: string): Promise<Job> {
    const response = await this.delete<Job>(`${this.baseUrl}/${id}`);
    return response.data.data;
  }
}

export default new JobService();

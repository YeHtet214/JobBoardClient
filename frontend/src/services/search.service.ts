import { ApiService } from './api.service';
import { Job } from '../types/job.types';

export interface JobSearchParams {
  keyword?: string;
  location?: string;
  jobType?: string[];
  experienceLevel?: string;
  salaryMin?: number;
  salaryMax?: number;
  skills?: string[];
  page?: number;
  limit?: number;
}

class SearchService extends ApiService {
  private baseUrl = '/api/jobs/search';

  public async searchJobs(params: JobSearchParams): Promise<{ jobs: Job[]; total: number; page: number; limit: number }> {
    // Convert params to query string
    const queryParams = new URLSearchParams();
    
    // Add all non-empty params to query string
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(item => queryParams.append(key, item));
        } else {
          queryParams.append(key, value.toString());
        }
      }
    });
    
    const queryString = queryParams.toString();
    const url = queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl;
    
    const response = await this.get<{ jobs: Job[]; total: number; page: number; limit: number }>(url);
    return response.data.data;
  }

  public async getSuggestedJobs(): Promise<Job[]> {
    const response = await this.get<Job[]>('/api/jobs/suggested');
    return response.data.data;
  }

  public async getPopularKeywords(): Promise<string[]> {
    const response = await this.get<string[]>('/api/jobs/popular-keywords');
    return response.data.data;
  }
}

export default new SearchService();

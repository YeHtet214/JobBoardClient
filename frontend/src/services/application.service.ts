import { ApiService } from './api.service';
import { Application, CreateApplicationDto, UpdateApplicationDto } from '../types/application.types';

class ApplicationService extends ApiService {
  private endpoints = {
    ALL: '/applications',
    DETAIL: (id: string) => `/applications/${id}`,
    MY_APPLICATIONS: '/applications/me',
    JOB_APPLICATIONS: (jobId: string) => `/applications/job/${jobId}`
  };

  public async getMyApplications(): Promise<Application[]> {
    const response = await this.get<Application[]>(this.endpoints.MY_APPLICATIONS);
    return response.data.data;
  }

  public async getApplicationById(id: string): Promise<Application> {
    const response = await this.get<Application>(this.endpoints.DETAIL(id));
    return response.data.data;
  }

  public async getApplicationsByJobId(jobId: string): Promise<Application[]> {
    const response = await this.get<Application[]>(this.endpoints.JOB_APPLICATIONS(jobId));
    return response.data.data;
  }

  public async createApplication(applicationData: CreateApplicationDto): Promise<Application> {
    const response = await this.post<Application>(this.endpoints.ALL, applicationData);
    return response.data.data;
  }

  public async updateApplication(id: string, updateData: UpdateApplicationDto): Promise<Application> {
    const response = await this.put<Application>(this.endpoints.DETAIL(id), updateData);
    return response.data.data;
  }

  public async withdrawApplication(id: string): Promise<void> {
    await this.delete<void>(this.endpoints.DETAIL(id));
  }
}

export default new ApplicationService();

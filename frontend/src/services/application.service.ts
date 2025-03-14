import { ApiService } from './api.service';
import { Application, CreateApplicationDto, UpdateApplicationDto } from '../types/application.types';

class ApplicationService extends ApiService {
  private baseUrl = '/api/applications';

  public async getMyApplications(): Promise<Application[]> {
    const response = await this.get<Application[]>(`${this.baseUrl}/me`);
    return response.data.data;
  }

  public async getApplicationById(id: string): Promise<Application> {
    const response = await this.get<Application>(`${this.baseUrl}/${id}`);
    return response.data.data;
  }

  public async getApplicationsForJob(jobId: string): Promise<Application[]> {
    const response = await this.get<Application[]>(`${this.baseUrl}/job/${jobId}`);
    return response.data.data;
  }

  public async createApplication(applicationData: CreateApplicationDto): Promise<Application> {
    const response = await this.post<Application>(this.baseUrl, applicationData);
    return response.data.data;
  }

  public async updateApplicationStatus(id: string, updateData: UpdateApplicationDto): Promise<Application> {
    const response = await this.put<Application>(`${this.baseUrl}/${id}`, updateData);
    return response.data.data;
  }

  public async withdrawApplication(id: string): Promise<void> {
    await this.delete<void>(`${this.baseUrl}/${id}`);
  }
}

export default new ApplicationService();

import { ApiService } from './api.service';
import { Profile, CreateProfileDto, UpdateProfileDto } from '../types/profile.types';

class ProfileService extends ApiService {
  private baseUrl = '/api/profiles';

  public async getMyProfile(): Promise<Profile> {
    const response = await this.get<Profile>(`${this.baseUrl}/me`);
    return response.data.data;
  }

  public async getProfileById(id: string): Promise<Profile> {
    const response = await this.get<Profile>(`${this.baseUrl}/${id}`);
    return response.data.data;
  }

  public async createProfile(profileData: CreateProfileDto): Promise<Profile> {
    const response = await this.post<Profile>(`${this.baseUrl}/me`, profileData);
    return response.data.data;
  }

  public async updateProfile(profileData: UpdateProfileDto): Promise<Profile> {
    const response = await this.put<Profile>(`${this.baseUrl}/me`, profileData);
    return response.data.data;
  }

  public async uploadResume(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('resume', file);
    
    // Set the content type to undefined to let the browser set the correct multipart boundary
    const response = await this.post<{ url: string }>(`${this.baseUrl}/upload-resume`, formData);
    
    return response.data.data.url;
  }
}

export const profileService = new ProfileService();

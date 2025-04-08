import { ApiService } from '@/services/api.service';
import { Profile, CreateProfileDto, UpdateProfileDto } from '@/types/profile.types';

class ProfileService extends ApiService {
  private endpoints = {
    ALL: '/profiles',
    MY_PROFILE: '/profiles/me',
    DETAIL: (id: string) => `/profiles/${id}`,
    UPLOAD_RESUME: '/profiles/upload-resume'
  };

  public async getMyProfile(): Promise<Profile> {
    const response = await this.get<Profile>(this.endpoints.MY_PROFILE);
    return response.data.data;
  }

  public async getProfileById(id: string): Promise<Profile> {
    const response = await this.get<Profile>(this.endpoints.DETAIL(id));
    return response.data.data;
  }

  public async createProfile(profileData: CreateProfileDto): Promise<Profile> {
    const response = await this.post<Profile>(this.endpoints.MY_PROFILE, profileData);
    return response.data.data;
  }

  public async updateProfile(profileData: UpdateProfileDto): Promise<Profile> {
    const response = await this.put<Profile>(this.endpoints.MY_PROFILE, profileData);
    return response.data.data;
  }

  public async uploadResume(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('resume', file);
    
    // Set the content type to undefined to let the browser set the correct multipart boundary
    const response = await this.post<{ url: string }>(this.endpoints.UPLOAD_RESUME, formData);
    
    return response.data.data.url;
  }
}

export const profileService = new ProfileService();

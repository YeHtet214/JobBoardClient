import { ApiService } from './api.service';
import { User } from '../types/auth.types';

class UserService extends ApiService {
  private baseUrl = '/users';

  public async getUserById(id: string): Promise<User> {
    const response = await this.get<User>(`${this.baseUrl}/${id}`);
    return response.data.data;
  }

  public async updateUserInfo(userData: {
    firstName?: string;
    lastName?: string;
    email?: string;
  }): Promise<User> {
    const response = await this.put<User>(`${this.baseUrl}/me`, userData);
    return response.data.data;
  }

  public async changePassword(passwordData: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<{ message: string }> {
    const response = await this.put<{ message: string }>(`${this.baseUrl}/change-password`, passwordData);
    return response.data.data;
  }
}

export default new UserService();

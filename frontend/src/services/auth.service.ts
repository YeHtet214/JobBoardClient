import { ApiService } from './api.service';
import { User, LoginRequest, RegisterRequest, AuthResponse, VerifiedEmailResponse } from '../types/auth.types';

class AuthService extends ApiService {
  private baseUrl = 'http://localhost:3000/api/auth';

  public async login(credentials: LoginRequest): Promise<User> {
    const response = await this.post<AuthResponse>(`${this.baseUrl}/signin`, credentials);
    const data = response.data.data;

    if (data.accessToken && data.refreshToken) {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
    }
    
    return data.user;
  }

  public async register(userData: RegisterRequest): Promise<User> {
    const response = await this.post<AuthResponse>(`${this.baseUrl}/signup`, userData);
    const data = response.data.data;
    
    if (data.accessToken && data.refreshToken) {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
    }
    
    return data.user;
  }

  public async googleLogin(): Promise<void> {
    // Redirect to Google OAuth endpoint
    window.location.href = `${this.baseUrl}/google`;
  }

  public async handleGoogleCallback(code: string): Promise<User> {
    const response = await this.post<AuthResponse>(`${this.baseUrl}/google/callback`, { code });
    const data = response.data.data;
    
    if (data.accessToken && data.refreshToken) {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
    }
    
    return data.user;
  }

  public async logout(): Promise<void> {
    try {
      // The token will be automatically included in the Authorization header
      // by the axios interceptor in index.ts
      await this.post<void>(`${this.baseUrl}/logout`, {});
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }

  public async getCurrentUser(): Promise<User> {
    const response = await this.get<User>(`${this.baseUrl}/me`);
    return response.data.data;
  }

  public getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  public isAuthenticated(): boolean {
    return !!this.getToken();
  }

  public async verifyEmail(token: string): Promise<VerifiedEmailResponse> {
    const response = await this.get<VerifiedEmailResponse>(`${this.baseUrl}/verify-email/${token}`);
    return response.data.data;
  }
}

export default new AuthService();

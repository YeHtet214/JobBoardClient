import { ApiService } from './api.service';
import { User, LoginRequest, RegisterRequest, AuthResponse, VerifiedEmailResponse } from '../types/auth.types';
import { isTokenExpired } from '../utils/jwt';

class AuthService extends ApiService {
  private baseUrl = 'http://localhost:3000/api';

  public async login(credentials: LoginRequest): Promise<User> {
    const response = await this.post<AuthResponse>(`${this.baseUrl}/auth/signin`, credentials);
    const data = response.data.data;

    if (data.accessToken && data.refreshToken) {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
    }
    
    return data.user;
  }

  public async register(userData: RegisterRequest): Promise<User> {
    const response = await this.post<AuthResponse>(`${this.baseUrl}/auth/signup`, userData);
    const data = response.data.data;
    
    if (data.accessToken && data.refreshToken) {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
    }
    
    return data.user;
  }

  public async googleLogin(): Promise<void> {
    // Redirect to Google OAuth endpoint
    window.location.href = `${this.baseUrl}/auth/google`;
  }

  public async handleGoogleCallback(code: string): Promise<User> {
    const response = await this.post<AuthResponse>(`${this.baseUrl}/auth/google/callback`, { code });
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
      await this.post<void>(`${this.baseUrl}/auth/logout`, {});
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }

  public async getCurrentUser(): Promise<User> {
    // Use the new user endpoint instead of the profile endpoint
    const response = await this.get<User>(`${this.baseUrl}/user/me`);
    return response.data.data;
  }

  public async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const response = await this.post<AuthResponse>(`${this.baseUrl}/auth/refresh-token`, { refreshToken });
    const data = response.data.data;
    
    if (data.accessToken && data.refreshToken) {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      return {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken
      };
    }
    
    throw new Error('Failed to refresh token');
  }

  public getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  public getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  public isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && !isTokenExpired(token);
  }

  public async verifyEmail(token: string): Promise<VerifiedEmailResponse> {
    const response = await this.get<VerifiedEmailResponse>(`${this.baseUrl}/auth/verify-email/${token}`);
    return response.data.data;
  }
}

export default new AuthService();

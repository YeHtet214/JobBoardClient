import { ApiService } from './api.service';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../types/auth.types';

class AuthService extends ApiService {
  private baseUrl = '/api/auth';
  private tokenKey = 'token';

  public async login(credentials: LoginRequest): Promise<User> {
    const response = await this.post<AuthResponse>(`${this.baseUrl}/login`, credentials);
    const data = response.data.data;
    
    if (data.token) {
      localStorage.setItem(this.tokenKey, data.token);
    }
    
    return data.user;
  }

  public async register(userData: RegisterRequest): Promise<User> {
    const response = await this.post<AuthResponse>(`${this.baseUrl}/register`, userData);
    const data = response.data.data;
    
    if (data.token) {
      localStorage.setItem(this.tokenKey, data.token);
    }
    
    return data.user;
  }

  public async logout(): Promise<void> {
    try {
      await this.post<void>(`${this.baseUrl}/logout`, {});
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem(this.tokenKey);
    }
  }

  public async getCurrentUser(): Promise<User> {
    const response = await this.get<User>(`${this.baseUrl}/me`);
    return response.data.data;
  }

  public getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  public isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export default new AuthService();

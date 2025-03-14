// api.service.ts
import { AxiosInstance, AxiosResponse } from 'axios';
import axios from './index';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export class ApiService {
  protected api: AxiosInstance;

  constructor() {
    this.api = axios;
  }

  protected get<T>(url: string): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.api.get<ApiResponse<T>>(url);
  }

  protected post<T>(url: string, data: any): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.api.post<ApiResponse<T>>(url, data);
  }

  protected put<T>(url: string, data: any): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.api.put<ApiResponse<T>>(url, data);
  }

  protected delete<T>(url: string): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.api.delete<ApiResponse<T>>(url);
  }
}
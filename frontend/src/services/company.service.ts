import { ApiService } from './api.service';
import { Company, CreateCompanyDto, UpdateCompanyDto } from '../types/company.types';

class CompanyService extends ApiService {
  private baseUrl = '/companies';

  public async getAllCompanies(): Promise<Company[]> {
    const response = await this.get<Company[]>(this.baseUrl);
    return response.data.data;
  }

  public async getCompanyById(id: string): Promise<Company> {
    const response = await this.get<Company>(`${this.baseUrl}/${id}`);
    return response.data.data;
  }

  public async getMyCompany(): Promise<Company> {
    const response = await this.get<Company>(`${this.baseUrl}/my-company`);
    return response.data.data;
  }

  public async createCompany(companyData: CreateCompanyDto): Promise<Company> {
    const response = await this.post<Company>(this.baseUrl, companyData);
    return response.data.data;
  }

  public async updateCompany(id: string, companyData: UpdateCompanyDto): Promise<Company> {
    const response = await this.put<Company>(`${this.baseUrl}/${id}`, companyData);
    return response.data.data;
  }

  public async deleteCompany(id: string): Promise<void> {
    await this.delete<void>(`${this.baseUrl}/${id}`);
  }
}

export default new CompanyService();

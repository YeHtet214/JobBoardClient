export interface CreateCompanyDto {
  name: string;
  description?: string;
  logo?: string;
  website?: string;
  location?: string;
  industry?: string;
  ownerId: string;
}

export interface UpdateCompanyDto {
  name?: string;
  description?: string;
  logo?: string;
  website?: string;
  location?: string;
  industry?: string;
}

export interface CompanyResponse {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  website?: string;
  location?: string;
  industry?: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

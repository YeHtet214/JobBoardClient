import prisma from "../prisma/client.js";
import { CustomError } from "../types/error.type.js";
import { CreateCompanyDto, UpdateCompanyDto } from "../types/company.type.js";

export const fetchAllCompanies = async () => {
    const companies = await prisma.company.findMany();
    return companies;
}

export const getExistingCompany = async (id: string) => {
    const company = await prisma.company.findUnique({ where: { id } });
    if (!company) {
        const error = new Error('Company not found') as CustomError;
        error.status = 404;
        throw error;
    }
    return company;
}

export const getCompanyByOwnerId = async (ownerId: string) => {
    const company = await prisma.company.findFirst({ 
        where: { ownerId } 
    });
    
    if (!company) {
        const error = new Error('Company not found') as CustomError;
        error.status = 404;
        throw error;
    }
    
    return company;
}

export const createNewCompany = async (companyData: CreateCompanyDto) => {
    const company = await prisma.company.create({
        data: companyData
    });
    return company;
}

export const updateExistingCompany = async (id: string, data: UpdateCompanyDto) => {
    const company = await prisma.company.update({
        where: { id },
        data
    });
    return company;
}

export const deleteExistingCompany = async (id: string) => {
    const company = await prisma.company.delete({ where: { id } });
    return company;
}

import { Request, Response, NextFunction } from 'express';
import { RequestWithUser } from '../types/users.type.js';
import { 
  getAllCompanies,
  getExistingCompany, 
  createNewCompany, 
  updateExistingCompany, 
  deleteExistingCompany 
} from '../services/company.service.js';
import prisma from '../prisma/client.js';

export const getAllCompanies = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const companies = await getAllCompanies();

    return res.status(200).json({ success: true, message: 'Companies fetched successfully', data: companies });
  } catch (error) {
    next(error);
  }
}

export const getCompanyById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const company = await getExistingCompany(id);

    return res.status(200).json({ success: true, message: 'Company fetched successfully', data: company });
  } catch (error) {
    next(error);
  }
};

export const createCompany = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const { name, description, logo, website, location, industry } = req.body;
    const company = await createNewCompany({
      name, 
      description, 
      logo, 
      website, 
      location,
      industry,
      ownerId: req.user.userId
    });
    
    res.status(201).json({ success: true, message: 'Company created successfully', data: company });
  } catch (error) {
    next(error);
  }
};

export const updateCompany = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, description, logo, website, location, industry } = req.body;
    
    // First check if the company exists and if the user is the owner
    const existingCompany = await getExistingCompany(id);
    
    if (existingCompany.ownerId !== req.user.userId) {
      return res.status(403).json({ 
        success: false, 
        message: "You don't have permission to update this company" 
      });
    }
    
    const company = await updateExistingCompany(id, { 
      name, 
      description, 
      logo, 
      website, 
      location, 
      industry 
    });
    
    res.status(200).json({ success: true, message: 'Company updated successfully', data: company });
  } catch (error) {
    next(error);
  }
};

export const deleteCompany = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    // First check if the company exists and if the user is the owner
    const existingCompany = await getExistingCompany(id);
    
    if (existingCompany.ownerId !== req.user.userId) {
      return res.status(403).json({ 
        success: false, 
        message: "You don't have permission to delete this company" 
      });
    }
    
    const company = await deleteExistingCompany(id);
    
    res.status(200).json({ success: true, message: 'Company deleted successfully', data: company });
  } catch (error) {
    next(error);
  }
};
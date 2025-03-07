import { Router } from "express";
import { 
    getCompanyById, 
    createCompany, 
    updateCompany, 
    deleteCompany
} from "../controllers/company.controller.js";
import authorize from "../middleware/auth.middleware.js";
import { employerOnly } from "../middleware/role.middleware.js";

const companyRouter = Router();

// Public route - anyone can view company details
companyRouter.get('/:id', getCompanyById);

// Protected routes - only authenticated employers can perform these actions
companyRouter.post('/', authorize, employerOnly, createCompany);

companyRouter.put('/:id', authorize, employerOnly, updateCompany);

companyRouter.delete('/:id', authorize, employerOnly, deleteCompany);

export default companyRouter;

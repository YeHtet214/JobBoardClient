import { NextFunction, Response } from "express";
import { RequestWithUser } from "../types/users.type.js";
import { createApplicationDto, updateApplicationDto } from "../types/application.type.js";
import { 
  fetchAllApplicationsByJobId, 
  fetchApplicationById, 
  postNewApplication, 
  updateApplicationById, 
  deleteExistingApplication 
} from "../services/application.service.js";
import { matchedData } from "express-validator";

export const getAllApplicationsByJobId = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
        const validatedData = matchedData(req, { locations: ['params', 'body'] });
        const jobId = validatedData.jobId;

        const applications = await fetchAllApplicationsByJobId(jobId);

        res.status(200).json({
            success: true,
            message: "Applications fetched successfully",
            data: applications
        });
    } catch (error) {
        next(error);
    }
}

export const getApplicationById = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
        // Get validated data
        const validatedData = matchedData(req);
        const id = validatedData.id;
        
        const application = await fetchApplicationById(id);

        res.status(200).json({
            success: true,
            message: "Application fetched successfully",
            data: application
        });
    } catch (error) {
        next(error);
    }
}

export const createNewApplication = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
        // Get validated data
        const validatedData = matchedData(req, { locations: ['params', 'body'] });
        
        const applicationData: createApplicationDto = {
            jobId: validatedData.jobId,
            resumeUrl: validatedData.resumeUrl,
            coverLetter: validatedData.coverLetter,
            applicantId: req.user.userId
        }
        
        const application = await postNewApplication(applicationData);

        res.status(201).json({
            success: true,
            message: "Application created successfully",
            data: application
        });
    } catch (error) {
        next(error);
    }
}

export const updateApplication = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
        // Get validated data
        const validatedData = matchedData(req, { locations: ['params', 'body'] });
        
        const applicationData: updateApplicationDto = {
            id: validatedData.id,
            resumeUrl: validatedData.resumeUrl,
            coverLetter: validatedData.coverLetter
        }
        
        const application = await updateApplicationById(applicationData);

        res.status(200).json({
            success: true,
            message: "Application updated successfully",
            data: application
        });
    } catch (error) {
        next(error);
    }
}

export const deleteApplication = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
        // Get validated data
        const validatedData = matchedData(req);
        const id = validatedData.id;

        const deletedApplication = await deleteExistingApplication(id);

        res.status(200).json({
            success: true,
            message: 'Application deleted successfully',
            data: deletedApplication
        })
    } catch (error) {
        next(error);
    }
}
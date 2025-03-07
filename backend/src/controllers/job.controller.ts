import { Request, Response, NextFunction } from 'express';
import { 
    fetchAllJobs, 
    fetchJobById, 
    fetchJobsByCompanyId, 
    createJob, 
    updateJob, 
    deleteExistingJob
} from '../services/job.service.js';
import { RequestWithUser } from '../types/users.type.js';
import prisma from '../prisma/client.js';

export const getAllJobs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const jobs = await fetchAllJobs();
        
        res.status(200).json({
            success: true,
            message: "Jobs fetched successfully",
            data: jobs
        });
    } catch (error) {
        next(error);
    }
}

export const getJobById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        const job = await fetchJobById(id);
        
        res.status(200).json({
            success: true,
            message: "Job fetched successfully",
            data: job
        });
    } catch (error) {
        next(error);
    }
}

export const getJobsByCompanyId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const companyId = req.params.companyId;
        const jobs = await fetchJobsByCompanyId(companyId);
        
        res.status(200).json({
            success: true,
            message: "Jobs fetched successfully",
            data: jobs
        });
    } catch (error) {
        next(error);
    }
}

export const createJobHandler = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
        const userId = req.user.userId;
        
        // Fetch the user's company
        const userCompany = await prisma.company.findFirst({
            where: { ownerId: userId },
            select: { id: true }
        });
        
        if (!userCompany) {
            return res.status(400).json({
                success: false,
                message: "You need to create a company before posting a job"
            });
        }

        console.log("User Id: ", userId);
        console.log("Create Job: ", req.body);
        
        // Pass request body, user ID, and company ID to the service
        const newJob = await createJob({
            ...req.body,
            postedById: userId,
            companyId: userCompany.id
        });
        
        res.status(201).json({
            success: true,
            message: "Job created successfully",
            data: newJob
        });
    } catch (error) {
        next(error);
    }
}

export const updateJobHandler = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
        const jobId = req.params.id;
        
        // Pass job ID, update data, and user ID to the service
        const updatedJob = await updateJob(jobId, req.body, req.user.userId);
        
        res.status(200).json({
            success: true,
            message: "Job updated successfully",
            data: updatedJob
        });
    } catch (error) {
        next(error);
    }
}

export const deleteJobHandler = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;

        const deletedJob = await deleteExistingJob(id, req.user.userId);

        res.status(200).json({
            success: true,
            message: "Job deleted successfully",
            data: deletedJob
        })
    } catch (error) {
        next(error);
    }
}
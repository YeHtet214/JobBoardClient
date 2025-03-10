import prisma from "../prisma/client.js";
import { CustomError } from "../types/users.type.js";
import { CreateJobDto, JobType } from "../types/job.type.js";
import { fetchUserById } from "./users.service.js";

// Basic data access functions
export const fetchAllJobs = async () => {
    const jobs = await prisma.job.findMany();
    if (!jobs || jobs.length === 0) {
        const error = new Error('Jobs not found') as CustomError;
        error.status = 404;
        throw error;
    }

    return jobs;
}

export const fetchJobById = async (id: string) => {
    const job = await prisma.job.findUnique({ where: { id }});
    if (!job) {
        const error = new Error('No job found') as CustomError;
        error.status = 404;
        throw error;
    }

    return job;
}

export const fetchJobsByCompanyId = async (companyId: string) => {
    const jobs = await prisma.job.findMany({ where: { companyId }});
    if (!jobs || jobs.length === 0) {
        const error = new Error('No job found') as CustomError;
        error.status = 404;
        throw error;
    }

    return jobs;
}

// Define the type for job create parameters
export type JobCreateData = {
    title: string;
    description: string;
    companyId: string;
    postedById: string;
    location?: string;
    type: JobType;
    salaryMin?: number;
    salaryMax?: number;
    requiredSkills: string[];
    experienceLevel?: string;
    expiresAt?: Date | string;
};

// Define the type for job update parameters
export type UpdateJobDto = Partial<Omit<CreateJobDto, 'companyId'>> & {
    isActive?: boolean;
};

// Business logic functions
/**
 * Validates and processes job data before creation
 */
export const createJob = async (jobData: Partial<CreateJobDto> & { postedById: string }) => {
    // Validate required fields
    if (!jobData.title || !jobData.description || !jobData.companyId || !jobData.type) {
        const error = new Error('Missing required fields: title, description, companyId, and type are required') as CustomError;
        error.status = 400;
        throw error;
    }
    
    // Validate job type
    if (!['FULL_TIME', 'PART_TIME', 'CONTRACT'].includes(jobData.type)) {
        const error = new Error('Invalid job type. Must be one of: FULL_TIME, PART_TIME, CONTRACT') as CustomError;
        error.status = 400;
        throw error;
    }
    
    // Process and transform the data
    const processedData: JobCreateData = {
        title: jobData.title,
        description: jobData.description,
        companyId: jobData.companyId,
        postedById: jobData.postedById,
        location: jobData.location,
        type: jobData.type as JobType,
        salaryMin: jobData.salaryMin ? Number(jobData.salaryMin) : undefined,
        salaryMax: jobData.salaryMax ? Number(jobData.salaryMax) : undefined,
        requiredSkills: Array.isArray(jobData.requiredSkills) ? jobData.requiredSkills : [],
        experienceLevel: jobData.experienceLevel,
        expiresAt: jobData.expiresAt
    };
    
    // Create the job in the database
    return createNewJob(processedData);
}

/**
 * Validates and processes job update data
 */
export const updateJob = async (jobId: string, updateData: Partial<UpdateJobDto>, userId: string) => {
    // Check if job exists and user has permission
    const existingJob = await fetchJobById(jobId);

    const userRole = (await fetchUserById(userId))?.role;
    
    // Verify ownership
    if (existingJob.postedById !== userId || userRole !== 'EMPLOYER') {
        const error = new Error('You don\'t have permission to update this job') as CustomError;
        error.status = 403;
        throw error;
    }
    
    // Validate job type if provided
    if (updateData.type && !['FULL_TIME', 'PART_TIME', 'CONTRACT'].includes(updateData.type)) {
        const error = new Error('Invalid job type. Must be one of: FULL_TIME, PART_TIME, CONTRACT') as CustomError;
        error.status = 400;
        throw error;
    }
    
    // Process and transform the update data
    const processedUpdateData: UpdateJobDto = {};
    
    // Only include fields that were provided
    if (updateData.title !== undefined) processedUpdateData.title = updateData.title;
    if (updateData.description !== undefined) processedUpdateData.description = updateData.description;
    if (updateData.location !== undefined) processedUpdateData.location = updateData.location;
    if (updateData.type !== undefined) processedUpdateData.type = updateData.type as JobType;
    if (updateData.salaryMin !== undefined) processedUpdateData.salaryMin = Number(updateData.salaryMin);
    if (updateData.salaryMax !== undefined) processedUpdateData.salaryMax = Number(updateData.salaryMax);
    if (updateData.requiredSkills !== undefined) {
        processedUpdateData.requiredSkills = Array.isArray(updateData.requiredSkills) 
            ? updateData.requiredSkills 
            : [];
    }
    if (updateData.experienceLevel !== undefined) processedUpdateData.experienceLevel = updateData.experienceLevel;
    if (updateData.expiresAt !== undefined) processedUpdateData.expiresAt = updateData.expiresAt;
    if (updateData.isActive !== undefined) processedUpdateData.isActive = updateData.isActive;
    
    // Update the job in the database
    return updateExistingJob(jobId, processedUpdateData);
}

// Database operation functions (private to the service)
/**
 * Creates a new job in the database
 * @private Should only be called from within the service
 */
const createNewJob = async (jobData: JobCreateData) => {
    const job = await prisma.job.create({
        data: {
            ...jobData,
            expiresAt: jobData.expiresAt ? new Date(jobData.expiresAt) : undefined
        }
    });
    
    return job;
}

/**
 * Updates an existing job in the database
 * @private Should only be called from within the service
 */
const updateExistingJob = async (id: string, data: UpdateJobDto) => {
    // Update the job
    const updatedJob = await prisma.job.update({
        where: { id },
        data: {
            ...data,
            expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined
        }
    });

    return updatedJob;
}

export const deleteExistingJob = async (id: string, userId: string) => {
    const existingJob = await fetchJobById(id);
    
    if (!existingJob) {
        const error = new Error('Job not found') as CustomError;
        error.status = 404;
        throw error;
    }

    const userRole = (await fetchUserById(userId))?.role;

    if (existingJob.postedById !== userId || userRole !== 'EMPLOYER') {
        const error = new Error('You don\'t have permission to update this job') as CustomError;
        error.status = 403;
        throw error;
    }
    
    return prisma.job.delete({ where: { id } });
}
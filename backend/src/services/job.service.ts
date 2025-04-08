import prisma from "../prisma/client.js";
import { CustomError } from "../types/error.type.js";
import { CreateJobDto, JobType } from "../types/job.type.js";
import { fetchUserById } from "./user.service.js";

// Define search params interface to match frontend
export interface JobSearchParams {
    keyword?: string;
    location?: string;
    jobTypes?: string[];
    experienceLevel?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
}

// Basic data access functions
export const fetchAllJobs = async (params?: JobSearchParams) => {
    const {
        keyword = '',
        location = '',
        jobTypes = [],
        experienceLevel = '',
        page = 1,
        limit = 10,
        sortBy = 'date_desc' // Default to newest first
    } = params || {};

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build the where clause for filtering
    const where: any = {
        isActive: true,
    };

    // Add keyword search (search in title and description)
    if (keyword) {
        where.OR = [
            { title: { contains: keyword, mode: 'insensitive' } },
            { description: { contains: keyword, mode: 'insensitive' } },
        ];
    }

    // Add location filter
    if (location) {
        where.location = { contains: location, mode: 'insensitive' };
    }

    // Add job types filter
    if (jobTypes.length > 0) {
        where.type = { in: jobTypes };
    }

    // Add experience level filter
    if (experienceLevel) {
        where.experienceLevel = experienceLevel;
    }

    // Determine sort order based on sortBy parameter
    let orderBy: any = {};
    switch (sortBy) {
        case 'date_desc':
            orderBy = { createdAt: 'desc' };
            break;
        case 'date_asc':
            orderBy = { createdAt: 'asc' };
            break;
        case 'salary_desc':
            orderBy = { salaryMax: 'desc' };
            break;
        case 'salary_asc':
            orderBy = { salaryMin: 'asc' };
            break;
        case 'relevance':
            // For relevance, we'll keep the default ordering
            // In a real implementation, this would use a more sophisticated
            // relevance algorithm based on the search term
            orderBy = { createdAt: 'desc' };
            break;
        default:
            orderBy = { createdAt: 'desc' };
    }

    // Get total count for pagination
    const totalCount = await prisma.job.count({ where });

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / limit);

    // Fetch jobs with pagination, sorting, and filtering
    const jobs = await prisma.job.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
            company: {
                select: {
                    name: true,
                    logo: true,
                    industry: true,
                }
            },
            postedBy: {
                select: {
                    firstName: true,
                    lastName: true,
                    email: true,
                }
            }
        }
    });

    // Return in the format expected by the frontend
    return {
        jobs,
        totalPages,
        totalCount,
        currentPage: page
    };
}

export const fetchJobById = async (id: string) => {
    const job = await prisma.job.findUnique({
        where: { id },
        include: {
            company: {
                select: {
                    name: true,
                    logo: true,
                    industry: true,
                }
            },
            postedBy: {
                select: {
                    firstName: true,
                    lastName: true,
                    email: true,
                }
            }
        }
    });

    if (!job) {
        const error = new Error('No job found') as CustomError;
        error.status = 404;
        throw error;
    }

    return job;
}

export const fetchJobsByCompanyId = async (companyId: string, params?: JobSearchParams) => {
    const {
        page = 1,
        limit = 10,
        sortBy = 'date_desc'
    } = params || {};

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Determine sort order
    let orderBy: any = {};
    switch (sortBy) {
        case 'date_desc':
            orderBy = { createdAt: 'desc' };
            break;
        case 'date_asc':
            orderBy = { createdAt: 'asc' };
            break;
        default:
            orderBy = { createdAt: 'desc' };
    }

    // Get total count
    const totalCount = await prisma.job.count({
        where: { companyId, isActive: true }
    });

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / limit);

    const jobs = await prisma.job.findMany({
        where: { companyId, isActive: true },
        orderBy,
        skip,
        take: limit,
        include: {
            company: {
                select: {
                    name: true,
                    logo: true,
                    industry: true,
                }
            },
            postedBy: {
                select: {
                    firstName: true,
                    lastName: true,
                    email: true,
                }
            }
        }
    });

    console.log("Company jobs: ", jobs);

    if (!jobs || jobs.length === 0) {
        const error = new Error('No jobs found for this company') as CustomError;
        error.status = 404;
        throw error;
    }

    // Return in the format expected by the frontend
    return {
        jobs,
        totalPages,
        totalCount,
        currentPage: page
    };
}

/**
 * Get search suggestions for autocomplete
 * @param term The search term to get suggestions for
 * @param type The type of suggestions (keyword, location, or all)
 * @param limit Maximum number of suggestions to return
 * @returns Array of suggestion strings
 */
export const getSearchSuggestions = async (
    term: string,
    type: 'keyword' | 'location' | 'all' = 'all',
    limit: number = 5
): Promise<string[]> => {
    if (!term || term.length < 2) {
        return [];
    }

    try {
        let suggestions: string[] = [];

        if (type === 'keyword' || type === 'all') {
            // Get title suggestions
            const titleSuggestions = await prisma.job.findMany({
                where: {
                    title: {
                        contains: term,
                        mode: 'insensitive'
                    },
                    isActive: true
                },
                select: {
                    title: true
                },
                distinct: ['title'],
                take: limit
            });

            suggestions = [...suggestions, ...titleSuggestions.map(job => job.title)];
        }

        if (type === 'location' || type === 'all') {
            // Get location suggestions
            const locationSuggestions = await prisma.job.findMany({
                where: {
                    location: {
                        contains: term,
                        mode: 'insensitive'
                    },
                    isActive: true
                },
                select: {
                    location: true
                },
                distinct: ['location'],
                take: limit
            });

            suggestions = [...suggestions, ...locationSuggestions.map(job => job.location)];
        }

        // Remove duplicates and limit results
        const uniqueSuggestions = [...new Set(suggestions)];
        return uniqueSuggestions.slice(0, limit);
    } catch (error) {
        console.error('Error fetching search suggestions:', error);
        return [];
    }
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
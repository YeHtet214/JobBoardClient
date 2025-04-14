import { Request, Response, NextFunction } from 'express';
import { RequestWithUser } from '../types/users.type.js';
import {
  fetchJobSeekerDashboardData,
  fetchEmployerDashboardData,
  removeSavedJobForUser,
  withdrawApplicationForUser,
  updateApplicationStatus,
  deletePostedJob,
  getCompanyProfileCompletion
} from '../services/dashboard.service.js';

/**
 * Gets dashboard data for a job seeker
 */
export const getJobSeekerDashboard = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.userId;
    const dashboardData = await fetchJobSeekerDashboardData(userId);
    
    res.status(200).json({
      success: true,
      message: "Job seeker dashboard data fetched successfully",
      data: dashboardData
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Gets dashboard data for an employer
 */
export const getEmployerDashboard = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.userId;
    const dashboardData = await fetchEmployerDashboardData(userId);
    
    res.status(200).json({
      success: true,
      message: "Employer dashboard data fetched successfully",
      data: dashboardData
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Removes a saved job for the authenticated user
 */
export const removeSavedJob = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const savedJobId = req.params.id;
    const userId = req.user.userId;
    
    await removeSavedJobForUser(savedJobId, userId);
    
    res.status(200).json({
      success: true,
      message: "Saved job removed successfully"
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Withdraws a job application for the authenticated user
 */
export const withdrawApplication = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const applicationId = req.params.id;
    const userId = req.user.userId;
    
    await withdrawApplicationForUser(applicationId, userId);
    
    res.status(200).json({
      success: true,
      message: "Application withdrawn successfully"
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Updates the status of a job application (employer only)
 */
export const updateApplicationStatusHandler = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const applicationId = req.params.id;
    const { status, notes } = req.body;
    const userId = req.user.userId;
    
    const updatedApplication = await updateApplicationStatus(applicationId, status, userId, notes);
    
    res.status(200).json({
      success: true,
      message: "Application status updated successfully",
      data: updatedApplication
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Deletes a job posting (employer only)
 */
export const deleteJob = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const jobId = req.params.id;
    const userId = req.user.userId;
    
    await deletePostedJob(jobId, userId);
    
    res.status(200).json({
      success: true,
      message: "Job deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Gets company profile completion status (employer only)
 */
export const getCompanyProfile = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.userId;
    const profileCompletion = await getCompanyProfileCompletion(userId);
    
    res.status(200).json({
      success: true,
      message: "Company profile completion status fetched successfully",
      data: profileCompletion
    });
  } catch (error) {
    next(error);
  }
};

import { Router } from 'express';
import authorize from '../middleware/auth.middleware.js';
import { checkRole } from '../middleware/role.middleware.js';
import { UserRole } from '@prisma/client';
import { 
  getJobSeekerDashboard,
  getEmployerDashboard,
  removeSavedJob,
  withdrawApplication,
  updateApplicationStatusHandler,
  deleteJob,
  getCompanyProfile
} from '../controllers/dashboard.controller.js';

const dashboardRouter = Router();

// Job seeker routes
dashboardRouter.get('/jobseeker', authorize, checkRole([UserRole.JOBSEEKER]), getJobSeekerDashboard);
dashboardRouter.delete('/saved-jobs/:id', authorize, checkRole([UserRole.JOBSEEKER]), removeSavedJob);
dashboardRouter.delete('/applications/:id', authorize, checkRole([UserRole.JOBSEEKER]), withdrawApplication);

// Employer routes
dashboardRouter.get('/employer', authorize, checkRole([UserRole.EMPLOYER]), getEmployerDashboard);
dashboardRouter.put('/applications/:id', authorize, checkRole([UserRole.EMPLOYER]), updateApplicationStatusHandler);
dashboardRouter.delete('/jobs/:id', authorize, checkRole([UserRole.EMPLOYER]), deleteJob);
dashboardRouter.get('/employer/profile-completion', authorize, checkRole([UserRole.EMPLOYER]), getCompanyProfile);

export default dashboardRouter;

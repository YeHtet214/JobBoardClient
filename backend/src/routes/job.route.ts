import { Router } from "express";
import { getAllJobs, getJobById, getJobsByCompanyId, createJobHandler, updateJobHandler, deleteJobHandler } from "../controllers/job.controller.js";
import { employerOnly } from "../middleware/role.middleware.js";
import authorize from "../middleware/auth.middleware.js";

const jobRouter = Router();

// Public routes - anyone can view jobs
jobRouter.get('/', getAllJobs);
jobRouter.get('/:id', getJobById);
jobRouter.get('/by-company/:companyId', getJobsByCompanyId);

// Protected routes - only authenticated employers can create/update/delete jobs
jobRouter.post('/', authorize, employerOnly, createJobHandler);
jobRouter.put('/:id', authorize, employerOnly, updateJobHandler);
jobRouter.delete('/:id', authorize, employerOnly, deleteJobHandler);

export default jobRouter;
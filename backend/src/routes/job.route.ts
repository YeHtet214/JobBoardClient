import { Router, RequestHandler } from "express";
import {
    getAllJobs,
    getJobById,
    getJobsByCompanyId,
    createJobHandler,
    updateJobHandler,
    deleteJobHandler,
    getSearchSuggestionsHandler
} from "../controllers/job.controller.js";
import { employerOnly } from "../middleware/role.middleware.js";
import authorize from "../middleware/auth.middleware.js";

const jobRouter = Router();

// Public routes - anyone can view jobs
jobRouter.get('/', getAllJobs as RequestHandler);
// The suggestions route must come before the :id route to avoid being treated as an ID parameter
jobRouter.get('/suggestions', getSearchSuggestionsHandler as RequestHandler);
jobRouter.get('/company/:companyId', getJobsByCompanyId as RequestHandler);
// This route should be last among the GET routes with path parameters to avoid conflicts
jobRouter.get('/:id', getJobById as RequestHandler);

// Protected routes - only authenticated employers can create/update/delete jobs
jobRouter.post('/', authorize, employerOnly, createJobHandler as RequestHandler);
jobRouter.put('/:id', authorize, employerOnly, updateJobHandler as RequestHandler);
jobRouter.delete('/:id', authorize, employerOnly, deleteJobHandler as RequestHandler);

export default jobRouter;
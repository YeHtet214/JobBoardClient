import { Router } from "express";
import authorize from "../middleware/auth.middleware.js";
import { createNewApplication, deleteApplication, getAllApplicationsByJobId, getAllApplicationsByUserId, getApplicationById, updateApplication } from "../controllers/application.controller.js";
import { applicationValidation } from "../middleware/validation/application.validation.js";

const applicationRouter = Router();

applicationRouter.get('/users/:userId', authorize, getAllApplicationsByUserId);

applicationRouter.get('/:id', authorize, applicationValidation.getById, getApplicationById);

applicationRouter.post('/jobs/:jobId', authorize, applicationValidation.create, createNewApplication);

applicationRouter.put('/:id', authorize, applicationValidation.update, updateApplication);

applicationRouter.delete('/:id', authorize, applicationValidation.delete, deleteApplication);

export default applicationRouter;
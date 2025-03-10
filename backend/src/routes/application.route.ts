import { Router } from "express";
import authorize from "../middleware/auth.middleware.js";
import { createNewApplication, deleteApplication, getAllApplicationsByJobId, getApplicationById, updateApplication } from "../controllers/application.controller.js";
import { applicationValidation } from "../middleware/validation/application.validation.js";
import { validate } from "../middleware/validation/index.js";

const applicationRouter = Router();

applicationRouter.get('/:jobId', authorize, applicationValidation.getByJobId, validate, getAllApplicationsByJobId);

applicationRouter.get('/:id', authorize, applicationValidation.getById, validate, getApplicationById);

applicationRouter.post('/:jobId', authorize, applicationValidation.create, validate, createNewApplication);

applicationRouter.put('/:id', authorize, applicationValidation.update, validate, updateApplication);

applicationRouter.delete('/:id', authorize, applicationValidation.delete, validate, deleteApplication);

export default applicationRouter;
import { Router } from "express";
import authorize from "../middleware/auth.middleware.js";
import { createProfile, deleteProfile, getProfile, updateProfile } from "../controllers/profile.controller.js";

const profileRouter = Router();

profileRouter.get('/me', authorize, getProfile);

profileRouter.post('/me', authorize, createProfile);

profileRouter.put('/me', authorize, updateProfile);

profileRouter.delete('/me', authorize, deleteProfile);

export default profileRouter;
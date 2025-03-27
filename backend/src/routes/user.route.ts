import { Router } from "express";
import authorize from "../middleware/auth.middleware.js";
import { getCurrentUser } from "../controllers/user.controller.js";

const userRouter = Router();

// User routes
userRouter.get('/me', authorize, getCurrentUser);

export default userRouter;

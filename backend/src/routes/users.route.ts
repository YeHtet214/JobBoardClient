import { getAllUsers, getUserById } from '../controllers/users.controller.js';
import { Router } from "express";
import authenticate from '../middleware/auth.middleware.js';

const userRouter = Router();

userRouter.get('/', getAllUsers);

userRouter.get('/:id', authenticate, getUserById);

export default userRouter;
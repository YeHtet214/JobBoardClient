import { getAllUsers } from '../controllers/users.controller.js';
import { Router } from "express";

const userRouter = Router();

userRouter.get('/', getAllUsers);

export default userRouter;
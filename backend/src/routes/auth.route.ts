import { Router } from 'express';
import { logout, signIn, signUp } from '../controllers/auth.controller.js';

const authRouter = Router();

authRouter.post('/signUp', signUp);

authRouter.post('/signIn', signIn);

authRouter.post('/logout', logout);

export default authRouter;
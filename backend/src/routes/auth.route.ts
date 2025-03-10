import { Router } from "express";
import passport from 'passport';
import { signUp, signIn, logout, refresh, verifyEmailToken } from "../controllers/auth.controller.js";
import authorize from "../middleware/auth.middleware.js";

const authRouter = Router();

authRouter.post('/signup', signUp);
authRouter.post('/signin', signIn);
authRouter.post('/refresh', refresh);
authRouter.get('/verify-email/:token', verifyEmailToken);
authRouter.post('/logout', authorize, logout);

// Google OAuth routes
authRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
authRouter.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }));

export default authRouter;
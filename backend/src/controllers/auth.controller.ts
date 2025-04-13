import { NextFunction, Request, Response } from 'express';
import { userSignIn, userSignUp, refreshAccessToken, verifyEmail, userLogout, resendVerificationEmail, requestPasswordReset, resetPassword } from "../services/auth.service.js";
import { CustomError } from "../types/error.type.js";
import { RequestWithUser } from '../types/users.type.js';

/**
 * Handles user sign-up.
 * @param req - Express request object, expects body with firstName, lastName, email, password, and role.
 * @param res - Express response object.
 * @returns A promise that resolves to sending a JSON response.
 */

export const signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    const { accessToken, refreshToken, user } = await userSignUp(firstName, lastName, email, password, role);

    res.status(201).json({
      success: true,
      message: "Successfully signed up. Please check your email for verification.",
      data: { accessToken, refreshToken, user }
    });
  } catch (error) {
    next(error)
  }
}

export const signIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const error = new Error("Please enter required fields") as CustomError;
      error.status = 400;
      next(error);
    }

    const { user, accessToken, refreshToken } = await userSignIn(email, password);

    if (!user.isEmailVerified) {
      const error = new Error("Please verify your email before signing in") as CustomError;
      error.status = 403;
      next(error);
    }

    res.status(200).json({
      success: true,
      message: "Successfully signed in",
      data: { user, accessToken, refreshToken }
    });
  } catch (error) {
    next(error);
  }
}

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      const error = new Error("Refresh token is required") as CustomError;
      error.status = 400;
      next(error);
    }

    const { accessToken } = await refreshAccessToken(refreshToken);

    res.status(200).json({
      success: true,
      message: "Access token refreshed successfully",
      data: { accessToken }
    });
  } catch (error) {
    next(error);
  }
}

export const verifyEmailToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.params;

    if (!token) {
      const error = new Error("Verification token is required") as CustomError;
      error.status = 400;
      throw error;
    }

    const result = await verifyEmail(token);

    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    next(error);
  }
}

export const logout = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    // Get token from authorization header
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
      const error = new Error("Token required") as CustomError;
      error.status = 400;
      return next(error);
    }

    const result = await userLogout(token);
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    next(error);
  }
}

/**
 * Resends verification email to the user
 */
export const resendVerification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    if (!email) {
      const error = new Error("Email is required") as CustomError;
      error.status = 400;
      return next(error);
    }

    const result = await resendVerificationEmail(email);
    
    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    next(error);
  }
}

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    if (!email) {
      const error = new Error("Email is required") as CustomError;
      error.status = 400;
      return next(error);
    }

    const result = await requestPasswordReset(email);
    
    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    next(error);
  }
}

export const resetPasswordHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      const error = new Error("Token and new password are required") as CustomError;
      error.status = 400;
      return next(error);
    }

    const result = await resetPassword(token, newPassword);
    
    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    next(error);
  }
}

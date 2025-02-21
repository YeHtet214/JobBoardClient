import prisma from "../prisma/client.js";

import { NextFunction, Request, Response } from 'express';
import { userSignIn, userSignUp } from "../services/auth.service.js";
import { CustomError, RequestWithUser } from "../types/users.type.js";

import jwt from "jsonwebtoken";

/**
 * Handles user sign-up.
 * @param req - Express request object, expects body with firstName, lastName, email, password, and role.
 * @param res - Express response object.
 * @returns A promise that resolves to sending a JSON response.
 */
export const signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    const { token, user } = await userSignUp(firstName, lastName, email, password, role);

    res.status(201).json({ success: true, message: "Successfully Sign Up", data: { token, user } });
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
      throw error;
    }

    const { user, token } = await userSignIn(email, password);

    res.status(200).json({ success: true, message: "Successfully Sign In", data: { user, token } });
  } catch (error) {
    next(error);
  }
}

export const logout = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
      const error = new Error("Token required") as CustomError;
      error.status = 400;
      next(error);
    }

    const decoded = jwt.decode(token);

    console.log("Decoded: ", decoded);

    if (typeof decoded === 'object' && decoded !== null) {
      if (!decoded || (decoded.exp && decoded.exp < Date.now().valueOf() / 1000)) {
        const error = new Error("Invalid token") as CustomError;
        error.status = 401;
        next(error);
      }
    }
    
    await prisma.blacklistedToken.create({
      data: {
        token,
        expiresAt: new Date(decoded?.exp * 1000)
      }
    })
  
    res.status(200).json({ success: true, message: "Successfully Logged Out" });
  } catch (error) {
    next(error);
  }
}

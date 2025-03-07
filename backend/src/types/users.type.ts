import { Request } from 'express';

export interface CustomError extends Error {
  status: number;
}

// Update the interface to use proper generic parameters from Express Request
export interface RequestWithUser extends Request {
  user: {
    userId: string;
    [key: string]: any;
  };
}

export type UserRole = 'EMPLOYER' | 'JOBSEEKER';
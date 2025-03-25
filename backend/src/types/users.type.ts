import { Request } from 'express';

export interface CustomError extends Error {
  status: number;
  data?: Record<string, any>;
}

// Define the file interface to match our UploadedFile type
export interface UploadedFile {
  originalname: string;
  buffer: Buffer;
  mimetype: string;
  size: number;
}

// Update the interface to use proper generic parameters from Express Request
export interface RequestWithUser extends Request {
  user: {
    userId: string;
    [key: string]: any;
  };
  file?: any; // For single file uploads
  files?: any[]; // For multiple file uploads
}

export type UserRole = 'EMPLOYER' | 'JOBSEEKER' | 'ADMIN';
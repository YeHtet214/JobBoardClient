import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../types/users.type.js';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  try {
    let error = { ...err };
    error.message = err.message;

    if (err.name === 'CastError') {
      const message = 'Invalid data type';

      error = new Error(message) as CustomError;
      error.status = 400;
    } 
    
    if (err.name === 'ValidationError') {
      const message = 'Validation failed';
      error = new Error(message) as CustomError;
      error.status = 400;
    }
    
    if (err.name === 'NotFoundError') {
      const message = 'Resource not found';
      error = new Error(message) as CustomError;
      error.status = 404;
    }
    
    if (err.name === 'UnauthorizedError') {
      const message = 'Unauthorized access';
      error = new Error(message) as CustomError;
      error.status = 401;
    } 
    
    if (err.name === 'ForbiddenError') {
      const message = 'Forbidden access';
      error = new Error(message) as CustomError;
      error.status = 403;
    } 

    res.status(err.status || 500).json({ message: error.message || 'Internal server error' });
  } catch (error) {
      next(error);
  }
};

export default errorHandler;

export interface CustomError extends Error {
  status: number;
}

export interface RequestWithUser extends Request {
  user: any;
}

export type UserRole = 'EMPLOYER' | 'JOBSEEKER';
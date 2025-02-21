import { NextFunction, Request, Response } from 'express';
import { fetchUserById, fetchUsers } from '../services/users.service.js';

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await fetchUsers();

    res.status(200).json({ success: true, message: "Successfully fetched all users", data: users });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = await fetchUserById(id);

    res.status(200).json({ success: true, message: "Successfully fetched user by id", data: user });
  } catch (error) {
    next(error);
  }
};


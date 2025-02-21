import prisma from "../prisma/client.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

import { UserRole, CustomError } from './../types/users.type.js';
import { JWT_SECRET } from "../config/env.config.js";

const checkUserExists = async (email: string) => {
  console.log(email);
  const user = await prisma.user.findUnique({
    where: {
      email
    }
  });

  return !!user;
}

// const validateUserBy = async (password: string, )

export const userSignUp = async (firstName: string, lastName: string, email: string, password: string, role: UserRole) => {

  // check email if the user already exist
  const isExisting = await checkUserExists(email);

  if (isExisting) {
    const error = new Error('User already exists') as CustomError;
    error.status = 409;
    throw error;
  }
  
  // hash the password
  const SALT = 10;
  const hashedPassword = await bcrypt.hash(password, SALT);

  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      passwordHash: hashedPassword,
      role
    }
  });

  // generate token
  const secret = JWT_SECRET as string;
  const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '1d' });

  return { token, user };
}

export const userSignIn = async (email: string, password: string) => {
  // find the user by email
  const user = await prisma.user.findUnique({
    where: {
      email
    }
  });

  if (!user) {
    const error = new Error('User not found') as CustomError;
    error.status = 404;
    throw error;
  }

  // compare the password
  const isPasswordMatch = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordMatch) {
    const error = new Error('Invalid password') as CustomError;
    error.status = 401;
    throw error;
  }

  // generate token
  const secret = JWT_SECRET as string;
  const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '1d' });

  return { token, user };
}

export const userLogout = async (token: string) => {      
  try {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
      const error = new Error("Token required") as CustomError;
      error.status = 400;
      next(error);
    }

    const decode = jwt

  
    res.status(200).json({ success: true, message: "Successfully Logged Out" });
  } catch (error) {
    next(error);
  }
}
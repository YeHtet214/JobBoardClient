import prisma from "../prisma/client.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import crypto from 'crypto';
import nodemailer from 'nodemailer';

import { UserRole } from '../types/users.type.js';
import { CustomError } from '../types/error.type.js';
import { JWT_SECRET, REFRESH_TOKEN_SECRET, SMTP_CONFIG, SMTP_FROM_EMAIL, FRONTEND_URL } from "../config/env.config.js";

const SALT_ROUNDS = 10;
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

const transporter = nodemailer.createTransport(SMTP_CONFIG);

const checkUserExists = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email }
  });

  console.log("user", user);
  return user;
}

const generateTokens = (userId: string) => {
  const accessToken = jwt.sign(
    { userId },
    JWT_SECRET as string,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );

  const refreshToken = jwt.sign(
    { userId },
    REFRESH_TOKEN_SECRET as string,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );

  return { accessToken, refreshToken };
}

const storeRefreshToken = async (userId: string, refreshToken: string) => {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId,
      expiresAt
    }
  });
}

const sendVerificationEmail = async (email: string, token: string) => {
  const verificationLink = `${FRONTEND_URL}/verify-email/${token}`;

  await transporter.sendMail({
    from: SMTP_FROM_EMAIL,
    to: email,
    subject: 'Verify your email address',
    html: `
      <h1>Email Verification</h1>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationLink}">${verificationLink}</a>
    `
  });
}

export const userSignUp = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  role: UserRole
) => {
  const existingUser = await checkUserExists(email);

  if (existingUser) {
    const error = new Error('User already exists') as CustomError;
    error.status = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const emailVerificationToken = crypto.randomBytes(32).toString('hex');

  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      passwordHash: hashedPassword,
      role,
      emailVerificationToken,
      isEmailVerified: false
    }
  });

  const { accessToken, refreshToken } = generateTokens(user.id);
  await storeRefreshToken(user.id, refreshToken);
  await sendVerificationEmail(email, emailVerificationToken);

  return { accessToken, refreshToken, user };
}

export const userSignIn = async (email: string, password: string) => {
  const user = await checkUserExists(email);

  if (!user) {
    const error = new Error('Email not Found') as CustomError;
    error.status = 401;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    const error = new Error('Invalid Password') as CustomError;
    error.status = 401;
    throw error;
  }

  if (!user.isEmailVerified) {
    const error = new Error('Please verify your email before signing in. Or use another email address') as CustomError;
    error.status = 403;
    throw error;
  }

  const { accessToken, refreshToken } = generateTokens(user.id);
  await storeRefreshToken(user.id, refreshToken);

  return { accessToken, refreshToken, user };
}

export const refreshAccessToken = async (refreshToken: string) => {
  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET as string) as { userId: string };

    // Check if refresh token exists and is valid
    const storedToken = await prisma.refreshToken.findFirst({
      where: {
        token: refreshToken,
        userId: decoded.userId,
        expiresAt: {
          gt: new Date()
        }
      }
    });

    if (!storedToken) {
      const error = new Error('Invalid refresh token') as CustomError;
      error.status = 401;
      throw error;
    }

    // Generate new access token
    const accessToken = jwt.sign(
      { userId: decoded.userId },
      JWT_SECRET as string,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    return { accessToken };
  } catch (error) {
    const customError = new Error('Invalid refresh token') as CustomError;
    customError.status = 401;
    throw customError;
  }
}

export const userLogout = async (token: string) => {
  if (!token) {
    console.log("Logout Token not inlcude")
    const error = new Error('Token required') as CustomError;
    error.status = 400;
    throw error;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET as string) as { userId: string };

    // Delete all refresh tokens for the user
    await prisma.refreshToken.deleteMany({
      where: { userId: decoded.userId }
    });

    // Add token to blacklist
    await prisma.blacklistedToken.create({
      data: {
        token,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      }
    });

    return { message: 'Successfully logged out' };
  } catch (error) {
    const customError = new Error('Invalid token') as CustomError;
    customError.status = 401;
    throw customError;
  }
}

export const verifyEmail = async (token: string) => {
  const user = await prisma.user.findFirst({
    where: { emailVerificationToken: token }
  });

  if (!user) {
    const error = new Error('Invalid verification token') as CustomError;
    error.status = 400;
    throw error;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      isEmailVerified: true,
      emailVerificationToken: null
    }
  });

  return { message: 'Email verified successfully' };
}

export const requestPasswordReset = async (email: string) => {
  const user = await checkUserExists(email);

  if (!user) {
    const error = new Error('User not found') as CustomError;
    error.status = 404;
    throw error;
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetPasswordToken: resetToken,
      resetPasswordExpiry: resetTokenExpiry
    }
  });

  const resetLink = `${FRONTEND_URL}/reset-password/${resetToken}`;

  await transporter.sendMail({
    from: SMTP_FROM_EMAIL,
    to: email,
    subject: 'Reset Your Password',
    html: `
      <h1>Password Reset Request</h1>
      <p>Please click the link below to reset your password:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>This link will expire in 1 hour.</p>
    `
  });

  return { message: 'Password reset email sent successfully' };
}

export const resetPassword = async (token: string, newPassword: string) => {
  const user = await prisma.user.findFirst({
    where: {
      resetPasswordToken: token,
      resetPasswordExpiry: {
        gt: new Date()
      }
    }
  });

  if (!user) {
    const error = new Error('Invalid or expired reset token') as CustomError;
    error.status = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpiry: null
    }
  });

  return { message: 'Password reset successful' };
}
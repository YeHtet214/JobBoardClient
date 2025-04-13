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

  return user;
}

export const generateTokens = (userId: string) => {
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

export const storeRefreshToken = async (userId: string, refreshToken: string) => {
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
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 5px;">
        <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #211951;">
          <h1 style="color: #211951; margin: 0;">Job Board</h1>
          <p style="color: #666; font-size: 14px; margin-top: 5px;">Connect with opportunities</p>
        </div>
        
        <div style="padding: 20px 0;">
          <h2 style="color: #333;">Email Verification</h2>
          <p style="color: #555; font-size: 16px; line-height: 1.5;">Thank you for creating an account! To get started, please verify your email address by clicking the button below.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}" style="display: inline-block; padding: 12px 24px; background-color: #211951; color: white; text-decoration: none; font-weight: bold; border-radius: 4px; font-size: 16px;">Verify Email Address</a>
          </div>
          
          <p style="color: #555; font-size: 14px; line-height: 1.5;">If the button doesn't work, you can also copy and paste the following link into your browser:</p>
          <p style="background-color: #f5f5f5; padding: 10px; border-radius: 4px; font-size: 12px; word-break: break-all; color: #333;">${verificationLink}</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e1e1e1; color: #777; font-size: 14px;">
            <p><strong>Note:</strong> This verification link will expire in 24 hours.</p>
            <p>If you didn't create an account, you can safely ignore this email.</p>
          </div>
        </div>
        
        <div style="background-color: #f7f7f7; padding: 15px; border-radius: 4px; margin-top: 20px; text-align: center; font-size: 12px; color: #666;">
          <p>Need help? Contact our support team at <a href="mailto:support@jobboard.com" style="color: #211951;">support@jobboard.com</a></p>
          <p>&copy; ${new Date().getFullYear()} Job Board. All rights reserved.</p>
        </div>
      </div>
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
  try {
    // First, try to find a user with this verification token
    const user = await prisma.user.findFirst({
      where: { emailVerificationToken: token }
    });

    // If we found a user with this token, verify them
    if (user) {
      console.log("Found user with verification token:", user.email);
      
      // If already verified, just return success
      if (user.isEmailVerified) {
        return { message: 'Your email has already been verified. You can now log in to your account.' };
      }

      // Verify the user
      await prisma.user.update({
        where: { id: user.id },
        data: {
          isEmailVerified: true,
          emailVerificationToken: null
        }
      });

      // Store the used token in a table for future reference
      await prisma.blacklistedToken.create({
        data: {
          token,
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year (or however long you want to remember it)
        }
      });

      return { message: 'Email verified successfully' };
    }

    // If no user has this token, check if it's a previously used token
    const usedToken = await prisma.blacklistedToken.findFirst({
      where: { token }
    });

    if (usedToken) {
      // This was a valid token that was already used
      return { message: 'Your email has already been verified. You can now log in to your account.' };
    }

    // Token is invalid (never existed or expired)
    throw new Error('Invalid verification token');
  } catch (error: any) {
    console.log("Verification error:", error.message);
    const customError = new Error(error.message || 'Invalid verification token') as CustomError;
    customError.status = 400;
    throw customError;
  }
};

export const resendVerificationEmail = async (email: string) => {
  const user = await checkUserExists(email);

  if (!user) {
    const error = new Error('User not found') as CustomError;
    error.status = 404;
    throw error;
  }

  // Check if the user is already verified
  if (user.isEmailVerified) {
    const error = new Error('Email already verified') as CustomError;
    error.status = 400;
    throw error;
  }

  // Generate a new verification token
  const verificationToken = crypto.randomBytes(32).toString('hex');

  // Update the user with the new token
  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerificationToken: verificationToken,
      updatedAt: new Date() // Update the timestamp
    }
  });

  // Send the verification email with the new token
  await sendVerificationEmail(email, verificationToken);

  return { message: 'Verification email has been resent successfully. Please check your inbox.' };
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
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 5px;">
        <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #211951;">
          <h1 style="color: #211951; margin: 0;">Job Board</h1>
          <p style="color: #666; font-size: 14px; margin-top: 5px;">Connect with opportunities</p>
        </div>
        
        <div style="padding: 20px 0;">
          <h2 style="color: #333;">Reset Password</h2>
          <p style="color: #555; font-size: 16px; line-height: 1.5;">To get access to your account back, reset password by clicking the button below.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background-color: #211951; color: white; text-decoration: none; font-weight: bold; border-radius: 4px; font-size: 16px;">Reset Password</a>
          </div>
          
          <p style="color: #555; font-size: 14px; line-height: 1.5;">If the button doesn't work, you can also copy and paste the following link into your browser:</p>
          <p style="background-color: #f5f5f5; padding: 10px; border-radius: 4px; font-size: 12px; word-break: break-all; color: #333;">${resetLink}</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e1e1e1; color: #777; font-size: 14px;">
            <p>If you didn't create an account, you can safely ignore this email.</p>
          </div>
        </div>
        
        <div style="background-color: #f7f7f7; padding: 15px; border-radius: 4px; margin-top: 20px; text-align: center; font-size: 12px; color: #666;">
          <p>Need help? Contact our support team at <a href="mailto:support@jobboard.com" style="color: #211951;">support@jobboard.com</a></p>
          <p>&copy; ${new Date().getFullYear()} Job Board. All rights reserved.</p>
        </div>
      </div>
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
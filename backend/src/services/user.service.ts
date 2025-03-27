import { PrismaClient } from '@prisma/client';
import { CustomError } from "../types/users.type.js";

const prisma = new PrismaClient();

/**
 * Get user by ID without sensitive information
 * @param userId User ID to fetch
 * @returns User data without sensitive fields
 */
export const getUserById = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            phone: true,
            isEmailVerified: true,
            createdAt: true,
            updatedAt: true,
            // Exclude sensitive fields like passwordHash, tokens, etc.
        }
    });

    return user;
};

/**
 * Get all users without sensitive information
 * @returns Array of user data without sensitive fields
 */
export const fetchUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      phone: true,
      isEmailVerified: true,
      createdAt: true,
      updatedAt: true,
      // Exclude sensitive fields like passwordHash, tokens, etc.
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return users;
}
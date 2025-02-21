import prisma from "../prisma/client.js"
import { CustomError } from "../types/users.type.js";

export const fetchUsers = async () => {
  const users = await prisma.user.findMany({
    omit: { passwordHash: true }
  })

  if (!users || users.length === 0) {
    const error = new Error('Users not found') as CustomError;
    error.status = 404;
    throw error;
  }

  return users;
}

export const fetchUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id
    },
    omit: { passwordHash: true }
  });

  if (!user) {
    const error = new Error('User not found') as CustomError;
    error.status = 404;
    throw error;
  }

  return user;
}
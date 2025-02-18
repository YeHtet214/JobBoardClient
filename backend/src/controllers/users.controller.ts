import prisma from '../prisma/client.js';

export const getAllUsers = async (req: Request, res: any) => {
  try {
    const newUser = await prisma.user.create({
      data: {
        firstName: 'Alice',
        lastName: 'Doe',
        email: 'bLs3o@example.com',
        passwordHash: 'password123',
        role: 'EMPLOYER'
      }
    });

    res.status(200).json(newUser);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
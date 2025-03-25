import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { CreateProfileDto, UpdateProfileDto } from '../types/profile.type.js';
import { CustomError } from "../types/users.type.js";

const prisma = new PrismaClient();

// Define a simple file interface that matches the properties we need
interface UploadedFile {
    originalname: string;
    buffer: Buffer;
    mimetype: string;
    size: number;
}

export const fetchProfile = async (userId: string) => {
    const profile = await prisma.profile.findUnique({ where: { userId } });

    return profile;
}

export const createNewProfile = async (profileData: CreateProfileDto) => {
    const existingProfile = await fetchProfile(profileData.userId);

    if (existingProfile) {
        return updateExistingProfile(profileData.userId, profileData);
    }

    const profile = await prisma.profile.create({ data: { ...profileData } });
    return profile;
}

export const updateExistingProfile = async (userId: string, data: UpdateProfileDto) => {
    const existingProfile = await fetchProfile(userId);

    if (!existingProfile) {
        const error = new Error("Profile not found") as CustomError;
        error.status = 404;
        throw error;
    }
    const profile = await prisma.profile.update({ where: { userId }, data });
    return profile;
}

export const deleteExistingProfile = async (userId: string) => {
    const existingProfile = await fetchProfile(userId);

    if (!existingProfile) {
        const error = new Error("Profile not found") as CustomError;
        error.status = 404;
        throw error;
    }

    const profile = await prisma.profile.delete({ where: { userId } });
    return profile;
}

export const uploadResume = async (userId: string, file: any): Promise<string> => {
    // Check if profile exists
    const existingProfile = await fetchProfile(userId);
    if (!existingProfile) {
        const error = new Error("Profile not found") as CustomError;
        error.status = 404;
        throw error;
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(__dirname, '../../uploads');
    const userUploadsDir = path.join(uploadsDir, 'resumes', userId);
    
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    if (!fs.existsSync(path.join(uploadsDir, 'resumes'))) {
        fs.mkdirSync(path.join(uploadsDir, 'resumes'), { recursive: true });
    }
    
    if (!fs.existsSync(userUploadsDir)) {
        fs.mkdirSync(userUploadsDir, { recursive: true });
    }
    
    // Generate unique filename using crypto instead of uuid
    const fileExtension = path.extname(file.originalname);
    const fileName = `${crypto.randomUUID()}${fileExtension}`;
    const filePath = path.join(userUploadsDir, fileName);
    
    // Write file to disk
    fs.writeFileSync(filePath, file.buffer);
    
    // Generate URL for the file
    const resumeUrl = `/uploads/resumes/${userId}/${fileName}`;
    
    // Update user profile with resume URL - using Prisma's update with data as any to bypass type checking
    await prisma.profile.update({
        where: { userId },
        data: { resumeUrl } as any
    });
    
    return resumeUrl;
}
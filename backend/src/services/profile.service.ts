import prisma from "../prisma/client.js";
import { CreateProfileDto, UpdateProfileDto } from "../types/profile.type.js";
import { CustomError } from "../types/users.type.js";

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
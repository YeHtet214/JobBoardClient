import { NextFunction, Response } from "express";
import { createNewProfile, deleteExistingProfile, fetchProfile, updateExistingProfile } from "../services/profile.service.js";
import { RequestWithUser } from "../types/users.type.js";

export const getProfile = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
        const userId = req.user.userId;
        const profile = await fetchProfile(userId);
        
        res.status(200).json({
            success: true,
            message: "Profile fetched successfully",
            data: profile
        });
    } catch (error) {
        next(error);
    }
}

export const createProfile = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
        const userId = req.user.userId;
        const profileData = req.body;
        console.log("userid: ", userId, "Profile Data: ", profileData);
        const profile = await createNewProfile({ ...profileData, userId});
        
        res.status(201).json({
            success: true,
            message: "Profile created successfully",
            data: profile
        });
    } catch (error) {
        next(error);
    }
}

export const updateProfile = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
        const userId = req.user.userId;
        const profileData = req.body;
        const profile = await updateExistingProfile(userId, profileData);
        
        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: profile
        });
    } catch (error) {
        next(error);
    }
}

export const deleteProfile = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
        const userId = req.user.userId;
        const profile = await deleteExistingProfile(userId);
        
        res.status(200).json({
            success: true,
            message: "Profile deleted successfully",
            data: profile
        });
    } catch (error) {
        next(error);
    }
}
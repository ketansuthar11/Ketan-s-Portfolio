import type { Request, Response } from 'express';
import { getProfile, updateProfile } from '../services/profile.service.js'
export const getProfileController = async (req: Request, res: Response) => {
    try {
        const profile = await getProfile();
        if (!profile) {
            return res.status(404).json({ success: false, message: "Profile Not Found" });
        }
        return res.status(200).json({ success: true, data: profile });
    }
    catch (err) {
        console.error("Get profile error", err);
        return res.status(500).json({ success: false, message: "Failed to fetch profile", });
    }
}


export const updateProfileController = async (req: Request, res: Response) => {
    try {
        const { name, bio, email, phone, location } = req.body;
        if (!name || typeof name !== "string") {
            return res.status(400).json({
                success: false,
                message: "Name is required",
            });
        }
        const profile = await updateProfile({ name, bio, email, phone, location });
        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data:profile
        });
    }
    catch (err) {
        console.error("Update profile error ",err);
        return res.status(500).json({
                success: false,
                message: "Failed to fetch profile",
            });
    }
}
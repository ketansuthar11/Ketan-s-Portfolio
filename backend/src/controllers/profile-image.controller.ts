import type { Request, Response } from "express";
import {
    getProfileImages,
    addProfileImage,
    removeProfileImage,
    makeProfileImageDefault
} from "../services/profile-image.service.js";

export const getProfileImagesController = async (
    req: Request,
    res: Response
) => {
    try {
        const { profileId } = req.query;

        if (typeof profileId !== "string" || !profileId.trim()) {
            return res.status(400).json({
                success: false,
                message: "profileId is required",
            });
        }

        const images = await getProfileImages(profileId);

        return res.status(200).json({
            success: true,
            data: images,
        });
    } catch (error: any) {
        if (error.message === "PROFILE_NOT_FOUND") {
            return res.status(404).json({
                success: false,
                message: "Profile not found",
            });
        }

        console.error("Get profile images error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch profile images",
        });
    }
};

export const uploadProfileImageController = async (
    req: Request,
    res: Response
) => {
    try {
        const { profileId, isDefault } = req.body;

        if (!profileId) {
            return res.status(400).json({
                success: false,
                message: "profileId is required",
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Image file is required",
            });
        }

        const image = await addProfileImage({
            profileId,
            buffer: req.file.buffer,
            contentType: req.file.mimetype,
            originalName: req.file.originalname,
            isDefault: isDefault === "true" || isDefault === true,
        });

        return res.status(201).json({
            success: true,
            message: "Profile image uploaded successfully",
            data: image,
        });
    } catch (error: any) {
        if (error.message === "PROFILE_NOT_FOUND") {
            return res.status(404).json({
                success: false,
                message: "Profile not found",
            });
        }

        if (error.message === "ONLY_JPEG_PNG_WEBP_ALLOWED") {
            return res.status(400).json({
                success: false,
                message: "Only JPEG, PNG and WebP images are allowed",
            });
        }

        console.error("Upload profile image error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to upload profile image",
        });
    }
};

export const deleteProfileImageController = async (
    req: Request,
    res: Response
) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Image id is required",
            });
        }
        if (typeof id !== "string") throw new Error("Id must be a string");

        await removeProfileImage(id);

        return res.status(200).json({
            success: true,
            message: "Profile image deleted successfully",
        });
    } catch (error: any) {
        if (error.message === "IMAGE_NOT_FOUND") {
            return res.status(404).json({
                success: false,
                message: "Profile image not found",
            });
        }

        console.error("Delete profile image error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete profile image",
        });
    }
};


export const setDefaultProfileImageController = async (
    req: Request,
    res: Response
) => {
    try {
        const { id } = req.params;

        if (typeof id !== "string") throw new Error("Id must be a string");

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Image id is required",
            });
        }

        const image = await makeProfileImageDefault(id);

        return res.status(200).json({
            success: true,
            message: "Default profile image updated successfully",
            data: image,
        });
    } catch (error: any) {
        if (error.message === "IMAGE_NOT_FOUND") {
            return res.status(404).json({
                success: false,
                message: "Profile image not found",
            });
        }

        if (error.message === "IMAGE_ID_REQUIRED") {
            return res.status(400).json({
                success: false,
                message: "Image id is required",
            });
        }

        console.error("Set default profile image error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to set default profile image",
        });
    }
};
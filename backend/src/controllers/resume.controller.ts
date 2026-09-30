import type { Request, Response } from "express";
import {
    addResume,
    getResumes,
    makeResumeDefault,
    removeResume,
} from "../services/resume.service.js";

import {
    neonStorageService,
} from "../storage/neon-storage.service.js";


import prisma from "../config/prisma.js";


export const getResumesController = async (
    req: Request,
    res: Response
) => {
    try {
        const profileId = req.query.profileId as string;

        if (!profileId) {
            return res.status(400).json({
                success: false,
                message: "profileId is required",
            });
        }

        const resumes = await getResumes(profileId);

        return res.status(200).json({
            success: true,
            data: resumes,
        });
    } catch (error) {
        console.error(error);

        if (error instanceof Error && error.message === "PROFILE_NOT_FOUND") {
            return res.status(404).json({
                success: false,
                message: "Profile not found",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to fetch resumes",
        });
    }
};

export const uploadResumeController = async (
    req: Request,
    res: Response
) => {
    try {
        const profileId = req.body.profileId;
        const name = req.body.name;
        const isDefault = req.body.isDefault === "true";

        if (!profileId) {
            return res.status(400).json({
                success: false,
                message: "profileId is required",
            });
        }

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Resume name is required",
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Resume file is required",
            });
        }

        const resume = await addResume({
            profileId,
            name,
            buffer: req.file.buffer,
            contentType: req.file.mimetype,
            originalName: req.file.originalname,
            isDefault,
        });

        return res.status(201).json({
            success: true,
            data: resume,
        });
    } catch (error) {
        console.error(error);

        if (error instanceof Error && error.message === "PROFILE_NOT_FOUND") {
            return res.status(404).json({
                success: false,
                message: "Profile not found",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to upload resume",
        });
    }
};

export const deleteResumeController = async (
    req: Request,
    res: Response
) => {
    try {
        const { id } = req.params;
        if(typeof id !=="string") throw new Error("Id must be a string");
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Resume ID is required",
            });
        }

        await removeResume(id);

        return res.status(200).json({
            success: true,
            message: "Resume deleted successfully",
        });
    } catch (error) {
        console.error(error);

        if (error instanceof Error && error.message === "RESUME_NOT_FOUND") {
            return res.status(404).json({
                success: false,
                message: "Resume not found",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to delete resume",
        });
    }
};

export const setDefaultResumeController = async (
    req: Request,
    res: Response
) => {
    try {
        const { id } = req.params;
        if(typeof id !=="string") throw new Error("Id must be a string");
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Resume ID is required",
            });
        }

        const resume = await makeResumeDefault(id);

        return res.status(200).json({
            success: true,
            data: resume,
        });
    } catch (error) {
        console.error(error);

        if (error instanceof Error && error.message === "RESUME_NOT_FOUND") {
            return res.status(404).json({
                success: false,
                message: "Resume not found",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to set default resume",
        });
    }
};

export const getPublicResumeController =
    async (_req: Request, res: Response) => {
        const resume =
            await prisma.resume.findFirst({
                where: {
                    isDefault: true,
                },
            });

        if (!resume) {
            throw new Error("RESUME_NOT_FOUND");
        }

        const url =
            await neonStorageService.getSignedUrl(
                resume.objectKey,
                3600
            );

        return res.status(200).json({
            success: true,
            data: {
                name: resume.name,
                url,
            },
        });
    };
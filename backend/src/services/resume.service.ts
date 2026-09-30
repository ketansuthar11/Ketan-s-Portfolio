import crypto from "node:crypto";
import prisma from "../config/prisma.js";
import * as resumeRepository from "../repository/resume.repository.js";
import { neonStorageService } from "../storage/neon-storage.service.js";

const bucket = process.env.AWS_S3_BUCKET;

if (!bucket) {
    throw new Error("AWS_S3_BUCKET is not configured");
}

export const getResumes = async (profileId: string) => {
    const profile = await prisma.profile.findUnique({
        where: {
            id: profileId,
        },
    });

    if (!profile) {
        throw new Error("PROFILE_NOT_FOUND");
    }

    return resumeRepository.findResumesByProfileId(profileId);
};

export const addResume = async (data: {
    profileId: string;
    buffer: Buffer;
    contentType: string;
    originalName: string;
    name: string;
    isDefault?: boolean;
}) => {
    const profile = await prisma.profile.findUnique({
        where: {
            id: data.profileId,
        },
    });

    if (!profile) {
        throw new Error("PROFILE_NOT_FOUND");
    }

    const objectKey = `profiles/${data.profileId}/resumes/${crypto.randomUUID()}.pdf`;

    const isDefault = data.isDefault ?? false;

    // 1. Upload file to Object Storage
    await neonStorageService.upload(
        objectKey,
        data.buffer,
        data.contentType
    );

    try {
        // 2. Store metadata in PostgreSQL
        const resume = await prisma.$transaction(async (tx) => {
            if (isDefault) {
                await tx.resume.updateMany({
                    where: {
                        profileId: data.profileId,
                    },
                    data: {
                        isDefault: false,
                    },
                });
            }

            return tx.resume.create({
                data: {
                    profileId: data.profileId,
                    name: data.name,
                    bucket,
                    objectKey,
                    isDefault,
                },
            });
        });

        return resume;
    } catch (error) {
        // DB failed → remove uploaded file
        await neonStorageService.delete(objectKey);

        throw error;
    }
};

export const removeResume = async (id: string) => {
    const resume = await resumeRepository.findResumeById(id);

    if (!resume) {
        throw new Error("RESUME_NOT_FOUND");
    }

    // Delete from Object Storage
    await neonStorageService.delete(resume.objectKey);

    // Delete metadata from DB
    return resumeRepository.deleteResume(id);
};

export const makeResumeDefault = async (id: string) => {
    if (!id || id.trim().length === 0) {
        throw new Error("RESUME_ID_REQUIRED");
    }

    const resume = await resumeRepository.findResumeById(id);

    if (!resume) {
        throw new Error("RESUME_NOT_FOUND");
    }

    return prisma.$transaction(async (tx) => {
        await tx.resume.updateMany({
            where: {
                profileId: resume.profileId,
            },
            data: {
                isDefault: false,
            },
        });

        return tx.resume.update({
            where: {
                id,
            },
            data: {
                isDefault: true,
            },
        });
    });
}; 
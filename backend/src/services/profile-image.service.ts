import * as profileImageRepository from "../repository/profile-image.repository.js";
import prisma from "../config/prisma.js";
import { neonStorageService } from "../storage/neon-storage.service.js";
import { Prisma } from "@prisma/client"
const bucket = process.env.AWS_S3_BUCKET;

if (!bucket) {
    throw new Error("AWS_S3_BUCKET is not configured");
}

export const getProfileImages = async (profileId: string) => {
    const profile = await prisma.profile.findUnique({
        where: {
            id: profileId,
        },
    });

    if (!profile) {
        throw new Error("PROFILE_NOT_FOUND");
    }

    return profileImageRepository.findImagesByProfileId(profileId);
};

export const addProfileImage = async (data: {
    profileId: string;
    buffer: Buffer;
    contentType: string;
    originalName: string;
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

    const extension =
        data.originalName.split(".").pop()?.toLowerCase() || "jpg";

    const fileName = `${crypto.randomUUID()}.${extension}`;

    const objectKey = `profiles/${data.profileId}/images/${fileName}`;

    const isDefault = data.isDefault ?? false;

    // Upload actual file to Neon Object Storage
    await neonStorageService.upload(
        objectKey,
        data.buffer,
        data.contentType
    );

    try {
        const image = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            // If new image is default, remove default from existing images
            if (isDefault) {
                await tx.profileImage.updateMany({
                    where: {
                        profileId: data.profileId,
                    },
                    data: {
                        isDefault: false,
                    },
                });
            }

            return tx.profileImage.create({
                data: {
                    profileId: data.profileId,
                    bucket,
                    objectKey,
                    isDefault,
                },
            });
        });

        return image;
    } catch (error) {
        // DB failed after storage upload → cleanup uploaded file
        await neonStorageService.delete(objectKey);

        throw error;
    }
};

export const removeProfileImage = async (id: string) => {
    const image = await profileImageRepository.findImageById(id);

    if (!image) {
        throw new Error("IMAGE_NOT_FOUND");
    }

    // First delete actual file from Object Storage
    await neonStorageService.delete(image.objectKey);

    // Then delete DB metadata
    return profileImageRepository.deleteProfileImage(id);
};

export const makeProfileImageDefault = async (id: string) => {
    if (!id || id.trim().length === 0) {
        throw new Error("IMAGE_ID_REQUIRED");
    }

    return profileImageRepository.setDefaultProfileImage(id);
};
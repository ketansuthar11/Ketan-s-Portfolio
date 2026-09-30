import prisma from "../config/prisma.js";
import {Prisma} from "@prisma/client"

export const findImagesByProfileId = async (profileId: string) => {
    return prisma.profileImage.findMany({
        where: {
            profileId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};

export const findImageById = async (id: string) => {
    return prisma.profileImage.findUnique({
        where: {
            id,
        },
    });
};

export const createProfileImage = async (data: {
    profileId: string;
    bucket: string;
    objectKey: string;
    isDefault?: boolean;
}) => {
    return prisma.profileImage.create({
        data: {
            profileId: data.profileId,
            bucket: data.bucket,
            objectKey: data.objectKey,
            isDefault: data.isDefault ?? false,
        },
    });
};

export const deleteProfileImage = async (id: string) => {
    return prisma.profileImage.delete({
        where: {
            id,
        },
    });
};

export const setDefaultProfileImage = async (id: string) => {
    return prisma.$transaction(async (tx:Prisma.TransactionClient) => {
        const image = await tx.profileImage.findUnique({
            where: {
                id,
            },
        });

        if (!image) {
            throw new Error("IMAGE_NOT_FOUND");
        }

        await tx.profileImage.updateMany({
            where: {
                profileId: image.profileId,
            },
            data: {
                isDefault: false,
            },
        });

        return tx.profileImage.update({
            where: {
                id: image.id,
            },
            data: {
                isDefault: true,
            },
        });
    });
};
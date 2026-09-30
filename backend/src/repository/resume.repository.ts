import prisma from "../config/prisma.js";

export const findResumesByProfileId = async (profileId: string) => {
    return prisma.resume.findMany({
        where: {
            profileId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};

export const findResumeById = async (id: string) => {
    return prisma.resume.findUnique({
        where: {
            id,
        },
    });
};

export const createResume = async (data: {
    profileId: string;
    name: string;
    bucket: string;
    objectKey: string;
    isDefault?: boolean;
}) => {
    return prisma.resume.create({
        data: {
            profileId: data.profileId,
            name: data.name,
            bucket: data.bucket,
            objectKey: data.objectKey,
            isDefault: data.isDefault ?? false,
        },
    });
};

export const deleteResume = async (id: string) => {
    return prisma.resume.delete({
        where: {
            id,
        },
    });
};
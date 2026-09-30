import prisma from "../config/prisma.js";
import type { Prisma } from "@prisma/client";

export const findAllExperiences = async () => {
    return prisma.experience.findMany({
        orderBy: {
            order: "asc",
        },
    });
};

export const findExperienceById = async (id: string) => {
    return prisma.experience.findUnique({
        where: {
            id,
        },
    });
};

export const createExperience = async (data: {
    company: string;
    role: string;
    location?: string;
    startDate: Date;
    endDate?: Date;
    isCurrent?: boolean;
    description?: string;
    responsibilities?: Prisma.InputJsonValue;
    isVisible?: boolean;
    order?: number;
}) => {
    return prisma.experience.create({
        data: {
            company: data.company,
            role: data.role,
            startDate: data.startDate,

            ...(data.location !== undefined && {
                location: data.location,
            }),

            ...(data.endDate !== undefined && {
                endDate: data.endDate,
            }),

            isCurrent: data.isCurrent ?? false,

            ...(data.description !== undefined && {
                description: data.description,
            }),

            ...(data.responsibilities !== undefined && {
                responsibilities: data.responsibilities,
            }),

            isVisible: data.isVisible ?? true,
            order: data.order ?? 0,
        },
    });
};

export const updateExperience = async (
    id: string,
    data: {
        company?: string;
        role?: string;
        location?: string;
        startDate?: Date;
        endDate?: Date | null;
        isCurrent?: boolean;
        description?: string;
        responsibilities?: Prisma.InputJsonValue;
        isVisible?: boolean;
        order?: number;
    }
) => {
    return prisma.experience.update({
        where: {
            id,
        },
        data: {
            ...(data.company !== undefined && {
                company: data.company,
            }),

            ...(data.role !== undefined && {
                role: data.role,
            }),

            ...(data.location !== undefined && {
                location: data.location,
            }),

            ...(data.startDate !== undefined && {
                startDate: data.startDate,
            }),

            ...(data.endDate !== undefined && {
                endDate: data.endDate,
            }),

            ...(data.isCurrent !== undefined && {
                isCurrent: data.isCurrent,
            }),

            ...(data.description !== undefined && {
                description: data.description,
            }),

            ...(data.responsibilities !== undefined && {
                responsibilities: data.responsibilities,
            }),

            ...(data.isVisible !== undefined && {
                isVisible: data.isVisible,
            }),

            ...(data.order !== undefined && {
                order: data.order,
            }),
        },
    });
};

export const deleteExperience = async (id: string) => {
    return prisma.experience.delete({
        where: {
            id,
        },
    });
};

export const updateExperienceVisibility = async (
    id: string,
    isVisible: boolean
) => {
    return prisma.experience.update({
        where: {
            id,
        },
        data: {
            isVisible,
        },
    });
};
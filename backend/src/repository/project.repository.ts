import prisma from "../config/prisma.js";
import type { Prisma } from "@prisma/client";

export const findAllProjects = async () => {
    return prisma.project.findMany({
        orderBy: {
            order: "asc",
        },
    });
};

export const findProjectById = async (id: string) => {
    return prisma.project.findUnique({
        where: {
            id,
        },
    });
};

export const createProject = async (data: {
    title: string;
    slug: string;
    description?: string;
    startDate?: Date;
    endDate?: Date;
    githubUrl?: string;
    liveUrl?: string;
    imageUrl?: string;
    technologies?: Prisma.InputJsonValue;
    features?: Prisma.InputJsonValue;
    isFeatured?: boolean;
    isVisible?: boolean;
    order?: number;
}) => {
    return prisma.project.create({
        data: {
            title: data.title,
            slug: data.slug,

            ...(data.description !== undefined && {
                description: data.description,
            }),

            ...(data.startDate !== undefined && {
                startDate: data.startDate,
            }),

            ...(data.endDate !== undefined && {
                endDate: data.endDate,
            }),

            ...(data.githubUrl !== undefined && {
                githubUrl: data.githubUrl,
            }),

            ...(data.liveUrl !== undefined && {
                liveUrl: data.liveUrl,
            }),

            ...(data.imageUrl !== undefined && {
                imageUrl: data.imageUrl,
            }),

            ...(data.technologies !== undefined && {
                technologies: data.technologies,
            }),

            ...(data.features !== undefined && {
                features: data.features,
            }),

            isFeatured: data.isFeatured ?? false,
            isVisible: data.isVisible ?? true,
            order: data.order ?? 0,
        },
    });
};

export const updateProject = async (
    id: string,
    data: {
        title?: string;
        slug?: string;
        description?: string | null;
        startDate?: Date | null;
        endDate?: Date | null;
        githubUrl?: string | null;
        liveUrl?: string | null;
        imageUrl?: string | null;
        technologies?: Prisma.InputJsonValue;
        features?: Prisma.InputJsonValue;
        isFeatured?: boolean;
        isVisible?: boolean;
        order?: number;
    }
) => {
    return prisma.project.update({
        where: {
            id,
        },
        data: {
            ...(data.title !== undefined && {
                title: data.title,
            }),

            ...(data.slug !== undefined && {
                slug: data.slug,
            }),

            ...(data.description !== undefined && {
                description: data.description,
            }),

            ...(data.startDate !== undefined && {
                startDate: data.startDate,
            }),

            ...(data.endDate !== undefined && {
                endDate: data.endDate,
            }),

            ...(data.githubUrl !== undefined && {
                githubUrl: data.githubUrl,
            }),

            ...(data.liveUrl !== undefined && {
                liveUrl: data.liveUrl,
            }),

            ...(data.imageUrl !== undefined && {
                imageUrl: data.imageUrl,
            }),

            ...(data.technologies !== undefined && {
                technologies: data.technologies,
            }),

            ...(data.features !== undefined && {
                features: data.features,
            }),

            ...(data.isFeatured !== undefined && {
                isFeatured: data.isFeatured,
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

export const deleteProject = async (id: string) => {
    return prisma.project.delete({
        where: {
            id,
        },
    });
};

export const updateProjectVisibility = async (
    id: string,
    isVisible: boolean
) => {
    return prisma.project.update({
        where: {
            id,
        },
        data: {
            isVisible,
        },
    });
};

export const updateProjectFeatured = async (
    id: string,
    isFeatured: boolean
) => {
    return prisma.project.update({
        where: {
            id,
        },
        data: {
            isFeatured,
        },
    });
};
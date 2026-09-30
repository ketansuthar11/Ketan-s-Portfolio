import prisma from "../config/prisma.js";
import type { SectionType } from "@prisma/client";

export const findAllSections = async () => {
    return prisma.portfolioSection.findMany({
        orderBy: {
            order: "asc",
        },
    });
};

export const findSectionById = async (id: string) => {
    return prisma.portfolioSection.findUnique({
        where: {
            id,
        },
    });
};

export const createSection = async (data: {
    name: string;
    slug: string;
    type: SectionType;
    isVisible?: boolean;
    order?: number;
}) => {
    return prisma.portfolioSection.create({
        data: {
            name: data.name,
            slug: data.slug,
            type: data.type,
            isVisible: data.isVisible ?? true,
            order: data.order ?? 0,
        },
    });
};

export const updateSection = async (
    id: string,
    data: {
        name?: string;
        slug?: string;
        type?: SectionType;
        isVisible?: boolean;
        order?: number;
    }
) => {
    return prisma.portfolioSection.update({
        where: {
            id,
        },
        data: {
            ...(data.name !== undefined && {
                name: data.name,
            }),
            ...(data.slug !== undefined && {
                slug: data.slug,
            }),
            ...(data.type !== undefined && {
                type: data.type,
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

export const deleteSection = async (id: string) => {
    return prisma.portfolioSection.delete({
        where: {
            id,
        },
    });
};

export const updateSectionVisibility = async (
    id: string,
    isVisible: boolean
) => {
    return prisma.portfolioSection.update({
        where: {
            id,
        },
        data: {
            isVisible,
        },
    });
};

export const updateSectionOrder = async (
    id: string,
    order: number
) => {
    return prisma.portfolioSection.update({
        where: {
            id,
        },
        data: {
            order,
        },
    });
};
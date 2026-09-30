import prisma from "../config/prisma.js";

export const findAllSkills = async () => {
    return prisma.skill.findMany({
        orderBy: {
            order: "asc",
        },
    });
};

export const findSkillById = async (id: string) => {
    return prisma.skill.findUnique({
        where: {
            id,
        },
    });
};

export const createSkill = async (data: {
    category: string;
    name: string;
    icon?: string;
    level?: number;
    isVisible?: boolean;
    order?: number;
}) => {
    return prisma.skill.create({
        data: {
            category: data.category,
            name: data.name,

            ...(data.icon !== undefined && {
                icon: data.icon,
            }),

            ...(data.level !== undefined && {
                level: data.level,
            }),

            isVisible: data.isVisible ?? true,
            order: data.order ?? 0,
        },
    });
};

export const updateSkill = async (
    id: string,
    data: {
        category?: string;
        name?: string;
        icon?: string;
        level?: number;
        isVisible?: boolean;
        order?: number;
    }
) => {
    return prisma.skill.update({
        where: {
            id,
        },
        data: {
            ...(data.category !== undefined && {
                category: data.category,
            }),

            ...(data.name !== undefined && {
                name: data.name,
            }),

            ...(data.icon !== undefined && {
                icon: data.icon,
            }),

            ...(data.level !== undefined && {
                level: data.level,
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

export const deleteSkill = async (id: string) => {
    return prisma.skill.delete({
        where: {
            id,
        },
    });
};

export const updateSkillVisibility = async (
    id: string,
    isVisible: boolean
) => {
    return prisma.skill.update({
        where: {
            id,
        },
        data: {
            isVisible,
        },
    });
};
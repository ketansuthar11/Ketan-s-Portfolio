import prisma from "../config/prisma.js";

export const findAllEducation = async () => {
    return prisma.education.findMany({
        orderBy: {
            order: "asc",
        },
    });
};

export const findEducationById = async (id: string) => {
    return prisma.education.findUnique({
        where: {
            id,
        },
    });
};

export const createEducation = async (data: {
    level: "TENTH" | "TWELFTH" | "DIPLOMA" | "BACHELOR" | "MASTER" | "PHD";
    institutionType: "SCHOOL" | "COLLEGE" | "UNIVERSITY" | "INSTITUTE";
    institutionName: string;
    field?: string;
    boardOrUniversity?: string;
    startDate?: Date;
    endDate?: Date;
    scoreType?: "CGPA" | "PERCENTAGE";
    score?: number;
    description?: string;
    isVisible?: boolean;
    order?: number;
}) => {
    return prisma.education.create({
        data: {
            level: data.level,
            institutionType: data.institutionType,
            institutionName: data.institutionName,

            ...(data.field !== undefined && {
                field: data.field,
            }),

            ...(data.boardOrUniversity !== undefined && {
                boardOrUniversity: data.boardOrUniversity,
            }),

            ...(data.startDate !== undefined && {
                startDate: data.startDate,
            }),

            ...(data.endDate !== undefined && {
                endDate: data.endDate,
            }),

            ...(data.scoreType !== undefined && {
                scoreType: data.scoreType,
            }),

            ...(data.score !== undefined && {
                score: data.score,
            }),

            ...(data.description !== undefined && {
                description: data.description,
            }),

            isVisible: data.isVisible ?? true,
            order: data.order ?? 0,
        },
    });
};

export const updateEducation = async (
    id: string,
    data: {
        level?: "TENTH" | "TWELFTH" | "DIPLOMA" | "BACHELOR" | "MASTER" | "PHD";
        institutionType?: "SCHOOL" | "COLLEGE" | "UNIVERSITY" | "INSTITUTE";
        institutionName?: string;
        field?: string;
        boardOrUniversity?: string;
        startDate?: Date;
        endDate?: Date;
        scoreType?: "CGPA" | "PERCENTAGE";
        score?: number;
        description?: string;
        isVisible?: boolean;
        order?: number;
    }
) => {
    return prisma.education.update({
        where: {
            id,
        },
        data: {
            ...(data.level !== undefined && {
                level: data.level,
            }),

            ...(data.institutionType !== undefined && {
                institutionType: data.institutionType,
            }),

            ...(data.institutionName !== undefined && {
                institutionName: data.institutionName,
            }),

            ...(data.field !== undefined && {
                field: data.field,
            }),

            ...(data.boardOrUniversity !== undefined && {
                boardOrUniversity: data.boardOrUniversity,
            }),

            ...(data.startDate !== undefined && {
                startDate: data.startDate,
            }),

            ...(data.endDate !== undefined && {
                endDate: data.endDate,
            }),

            ...(data.scoreType !== undefined && {
                scoreType: data.scoreType,
            }),

            ...(data.score !== undefined && {
                score: data.score,
            }),

            ...(data.description !== undefined && {
                description: data.description,
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

export const deleteEducation = async (id: string) => {
    return prisma.education.delete({
        where: {
            id,
        },
    });
};

export const updateEducationVisibility = async (
    id: string,
    isVisible: boolean
) => {
    return prisma.education.update({
        where: {
            id,
        },
        data: {
            isVisible,
        },
    });
};
import prisma from "../config/prisma.js";

export const getTotalViews = async () => {
    return prisma.portfolioView.count();
};

export const getViewsByDate = async (
    startDate: Date,
    endDate: Date
) => {
    return prisma.portfolioView.findMany({
        where: {
            createdAt: {
                gte: startDate,
                lt: endDate,
            },
        },
        orderBy: {
            createdAt: "asc",
        },
    });
};

export const getProjectStats = async () => {
    const [
        total,
        visible,
        featured,
    ] = await Promise.all([
        prisma.project.count(),
        prisma.project.count({
            where: {
                isVisible: true,
            },
        }),
        prisma.project.count({
            where: {
                isFeatured: true,
            },
        }),
    ]);

    return {
        total,
        visible,
        featured,
    };
};
import prisma from "../config/prisma.js";

export const getDashboardData = async () => {
    const [
        profile,
        projects,
        skills,
        experiences,
        education,
        messages,
        views,
    ] = await Promise.all([
        prisma.profile.findFirst(),

        prisma.project.count(),

        prisma.skill.count(),

        prisma.experience.count(),

        prisma.education.count(),

        prisma.contactMessage.count({
            where: {
                status: "UNREAD",
            },
        }),

        prisma.portfolioView.count(),
    ]);

    return {
        profile,
        statistics: {
            projects,
            skills,
            experiences,
            education,
            unreadMessages: messages,
            totalViews: views,
        },
    };
};
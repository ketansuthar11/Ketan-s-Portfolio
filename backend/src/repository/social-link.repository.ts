import prisma from "../config/prisma.js";

export const findSocialLinksByProfileId = async (profileId: string) => {
    return prisma.socialLink.findMany({
        where: {
            profileId,
        },
        orderBy: {
            order: "asc",
        },
    });
};

export const findSocialLinkById = async (id: string) => {
    return prisma.socialLink.findUnique({
        where: {
            id,
        },
    });
};

export const createSocialLink = async (data: {
    profileId: string;
    platform: string;
    url: string;
    icon?: string;
    isVisible?: boolean;
    order?: number;
}) => {
    return prisma.socialLink.create({
        data: {
            profileId: data.profileId,
            platform: data.platform,
            url: data.url,

            ...(data.icon !== undefined && {
                icon: data.icon,
            }),

            isVisible: data.isVisible ?? true,
            order: data.order ?? 0,
        },
    });
};

export const updateSocialLink = async (
    id: string,
    data: {
        platform?: string;
        url?: string;
        icon?: string;
        isVisible?: boolean;
        order?: number;
    }
) => {
    return prisma.socialLink.update({
        where: {
            id,
        },
        data,
    });
};

export const deleteSocialLink = async (id: string) => {
    return prisma.socialLink.delete({
        where: {
            id,
        },
    });
};
import prisma from "../config/prisma.js";
import {
    getCache,
    setCache,
} from "./cache.service.js";
import {
    neonStorageService,
} from "../storage/neon-storage.service.js";

const PORTFOLIO_CACHE_KEY =
    "portfolio:public";

type CachedPortfolio = {
    profile: {
        images: Array<{
            objectKey: string;
        }>;
    } | null;
    skills: unknown;
    experience: unknown;
    education: unknown;
    projects: unknown;
    sections: unknown;
};

const addProfileImageUrls = async <
    T extends CachedPortfolio,
>(portfolio: T) => {
    if (!portfolio.profile) {
        return portfolio;
    }

    const images = await Promise.all(
        portfolio.profile.images.map(async (image) => {
            try {
                return {
                    ...image,
                    url: await neonStorageService.getSignedUrl(
                        image.objectKey,
                        3600
                    ),
                };
            } catch {
                return {
                    ...image,
                    url: null,
                };
            }
        })
    );

    return {
        ...portfolio,
        profile: {
            ...portfolio.profile,
            images,
        },
    };
};

export const getPublicPortfolio = async () => {
    const cached =
        await getCache<CachedPortfolio>(
            PORTFOLIO_CACHE_KEY
        );

    if (cached) {
        return addProfileImageUrls(cached);
    }

    const [
        profile,
        skills,
        experience,
        education,
        projects,
        sections,
    ] = await Promise.all([
        prisma.profile.findFirst({
            include: {
                roles: {
                    orderBy: {
                        order: "asc",
                    },
                },
                images: {
                    where: {
                        isDefault: true,
                    },
                    take: 1,
                },
                resumes: {
                    where: {
                        isDefault: true,
                    },
                    take: 1,
                },
                socialLinks: {
                    where: {
                        isVisible: true,
                    },
                    orderBy: {
                        order: "asc",
                    },
                },
            },
        }),

        prisma.skill.findMany({
            where: {
                isVisible: true,
            },
            orderBy: {
                order: "asc",
            },
        }),

        prisma.experience.findMany({
            where: {
                isVisible: true,
            },
            orderBy: {
                order: "asc",
            },
        }),

        prisma.education.findMany({
            where: {
                isVisible: true,
            },
            orderBy: {
                order: "asc",
            },
        }),

        prisma.project.findMany({
            where: {
                isVisible: true,
            },
            orderBy: {
                order: "asc",
            },
        }),

        prisma.portfolioSection.findMany({
            where: {
                isVisible: true,
            },
            orderBy: {
                order: "asc",
            },
        }),
    ]);

    if (!profile) {
        throw new Error(
            "PROFILE_NOT_FOUND"
        );
    }

    const portfolio = {
        profile,
        skills,
        experience,
        education,
        projects,
        sections,
    };

    await setCache(
        PORTFOLIO_CACHE_KEY,
        portfolio,
        300
    );

    return addProfileImageUrls(portfolio);
};

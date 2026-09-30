import type { Request, Response } from "express";
import {
    getSocialLinks,
    addSocialLink,
    updateSocialLink,
    removeSocialLink,
} from "../services/social-link.service.js";


export const getSocialLinksController = async (
    req: Request,
    res: Response
) => {
    try {
        const profileId = req.query.profileId as string;

        if (!profileId) {
            return res.status(400).json({
                success: false,
                message: "profileId is required",
            });
        }

        const socialLinks = await getSocialLinks(profileId);

        return res.status(200).json({
            success: true,
            data: socialLinks,
        });
    } catch (error) {
        console.error(error);

        if (
            error instanceof Error &&
            error.message === "PROFILE_NOT_FOUND"
        ) {
            return res.status(404).json({
                success: false,
                message: "Profile not found",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to fetch social links",
        });
    }
};

export const createSocialLinkController = async (
    req: Request,
    res: Response
) => {
    try {
        const {
            profileId,
            platform,
            url,
            icon,
            isVisible,
            order,
        } = req.body;

        if (!profileId) {
            return res.status(400).json({
                success: false,
                message: "profileId is required",
            });
        }

        if (!platform) {
            return res.status(400).json({
                success: false,
                message: "platform is required",
            });
        }

        if (!url) {
            return res.status(400).json({
                success: false,
                message: "url is required",
            });
        }

        const socialLink = await addSocialLink({
            profileId,
            platform,
            url,
            ...(icon !== undefined && { icon }),
            ...(isVisible !== undefined && {
                isVisible:
                    isVisible === true ||
                    isVisible === "true",
            }),
            ...(order !== undefined && {
                order: Number(order),
            }),
        });

        return res.status(201).json({
            success: true,
            data: socialLink,
        });
    } catch (error) {
        console.error(error);

        if (
            error instanceof Error &&
            error.message === "PROFILE_NOT_FOUND"
        ) {
            return res.status(404).json({
                success: false,
                message: "Profile not found",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to create social link",
        });
    }
};

export const updateSocialLinkController = async (
    req: Request,
    res: Response
) => {
    try {
        const { id } = req.params;
        if (typeof id !== "string") throw new Error("Id must be a string");
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Social link ID is required",
            });
        }

        const {
            platform,
            url,
            icon,
            isVisible,
            order,
        } = req.body;

        const socialLink = await updateSocialLink(id, {
            ...(platform !== undefined && { platform }),
            ...(url !== undefined && { url }),
            ...(icon !== undefined && { icon }),
            ...(isVisible !== undefined && {
                isVisible:
                    isVisible === true ||
                    isVisible === "true",
            }),
            ...(order !== undefined && {
                order: Number(order),
            }),
        });

        return res.status(200).json({
            success: true,
            data: socialLink,
        });
    } catch (error) {
        console.error(error);

        if (
            error instanceof Error &&
            error.message === "SOCIAL_LINK_NOT_FOUND"
        ) {
            return res.status(404).json({
                success: false,
                message: "Social link not found",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to update social link",
        });
    }
};

export const deleteSocialLinkController = async (
    req: Request,
    res: Response
) => {
    try {
        const { id } = req.params;
        if (typeof id !== "string") throw new Error("Id must be a string");
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Social link ID is required",
            });
        }

        await removeSocialLink(id);

        return res.status(200).json({
            success: true,
            message: "Social link deleted successfully",
        });
    } catch (error) {
        console.error(error);

        if (
            error instanceof Error &&
            error.message === "SOCIAL_LINK_NOT_FOUND"
        ) {
            return res.status(404).json({
                success: false,
                message: "Social link not found",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to delete social link",
        });
    }
};
import type { Request, Response } from "express";
import crypto from "crypto";
import prisma from "../config/prisma.js";

export const recordPortfolioViewController = async (
    req: Request,
    res: Response
) => {
    try {
        const ip = req.ip || req.socket.remoteAddress || "";

        const ipHash = crypto
            .createHash("sha256")
            .update(ip)
            .digest("hex");

        await prisma.portfolioView.create({
            data: {
                ipHash,
                ...(req.headers["user-agent"] !== undefined && {
                    userAgent: req.headers["user-agent"],
                }),
            },
        });

        return res.status(201).json({
            success: true,
            message: "VIEW_RECORDED",
        });
    } catch (error) {
        console.error("Record portfolio view error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to record portfolio view",
        });
    }
};

export const getViewStatsController = async (
    req: Request,
    res: Response
) => {
    try {
        const now = new Date();

        // Start of today
        const startOfToday = new Date(now);
        startOfToday.setHours(0, 0, 0, 0);

        // Start of week (Monday)
        const startOfWeek = new Date(startOfToday);
        const day = startOfWeek.getDay();
        const diff = day === 0 ? 6 : day - 1;
        startOfWeek.setDate(startOfWeek.getDate() - diff);

        // Start of month
        const startOfMonth = new Date(
            now.getFullYear(),
            now.getMonth(),
            1
        );

        const [total, today, thisWeek, thisMonth] = await Promise.all([
            prisma.portfolioView.count(),

            prisma.portfolioView.count({
                where: {
                    createdAt: {
                        gte: startOfToday,
                    },
                },
            }),

            prisma.portfolioView.count({
                where: {
                    createdAt: {
                        gte: startOfWeek,
                    },
                },
            }),

            prisma.portfolioView.count({
                where: {
                    createdAt: {
                        gte: startOfMonth,
                    },
                },
            }),
        ]);

        return res.status(200).json({
            success: true,
            data: {
                total,
                today,
                thisWeek,
                thisMonth,
            },
        });
    } catch (error) {
        console.error("Get view stats error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch view stats",
        });
    }
};

export const getViewCountController = async (
    _req: Request,
    res: Response
) => {
    try {
        const views = await prisma.portfolioView.count();

        return res.status(200).json({
            success: true,
            data: {
                views,
            },
        });
    } catch (error) {
        console.error("Get view count error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch view count",
        });
    }
};
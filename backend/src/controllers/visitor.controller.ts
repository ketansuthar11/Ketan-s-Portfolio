import type { Request, Response } from "express";
import prisma from "../config/prisma.js";

export const registerVisitorController = async (
    req: Request,
    res: Response
) => {
    try {
        const { visitorId } = req.body;

        if (!visitorId || typeof visitorId !== "string") {
            return res.status(400).json({
                success: false,
                message: "visitorId is required",
            });
        }

        const userAgent = req.headers["user-agent"];

        const existingVisitor = await prisma.portfolioVisitor.findUnique({
            where: {
                visitorId,
            },
        });

        if (existingVisitor) {
            const visitor = await prisma.portfolioVisitor.update({
                where: {
                    visitorId,
                },
                data: {
                    lastSeenAt: new Date(),
                    visitCount: {
                        increment: 1,
                    },
                    ...(userAgent !== undefined && {
                        userAgent,
                    }),
                },
            });

            return res.status(200).json({
                success: true,
                data: {
                    isNewVisitor: false,
                    visitorId: visitor.visitorId,
                    visitCount: visitor.visitCount,
                },
            });
        }

        const visitor = await prisma.portfolioVisitor.create({
            data: {
                visitorId,
                ...(userAgent !== undefined && {
                    userAgent,
                }),
            },
        });

        return res.status(201).json({
            success: true,
            data: {
                isNewVisitor: true,
                visitorId: visitor.visitorId,
                visitCount: visitor.visitCount,
            },
        });
    } catch (error) {
        console.error("Register visitor error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to register visitor",
        });
    }
};

export const getUniqueVisitorCountController = async (
    _req: Request,
    res: Response
) => {
    try {
        const uniqueVisitors = await prisma.portfolioVisitor.count();

        return res.status(200).json({
            success: true,
            data: {
                uniqueVisitors,
            },
        });
    } catch (error) {
        console.error("Get unique visitor count error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch unique visitor count",
        });
    }
};
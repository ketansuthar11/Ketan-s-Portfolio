import type { Request, Response } from "express";
import crypto from "crypto";
import prisma from "../config/prisma.js";


export const recordPortfolioViewController =
    async (req: Request, res: Response) => {
        const ip =
            req.ip ||
            req.socket.remoteAddress ||
            "";

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
    };
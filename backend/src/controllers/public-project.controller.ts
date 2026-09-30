import type { Request, Response } from "express";
import prisma from "../config/prisma.js";

export const getPublicProjectController =
    async (req: Request, res: Response) => {
        const slug = req.params.slug;
        if(typeof slug !=="string") throw new Error("Slug must be a string");
        const project =
            await prisma.project.findFirst({
                where: {
                    slug: slug,
                    isVisible: true,
                },
            });

        if (!project) {
            throw new Error("PROJECT_NOT_FOUND");
        }

        return res.status(200).json({
            success: true,
            data: project,
        });
    };
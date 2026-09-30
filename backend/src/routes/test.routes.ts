import { Router } from "express";
import prisma from "../config/prisma.js";

const router = Router();

router.get("/db", async (req, res) => {
    try {
        const profileCount = await prisma.profile.count();

        res.json({
            success: true,
            message: "Database connected successfully",
            profileCount,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Database connection failed",
        });
    }
});

export default router;
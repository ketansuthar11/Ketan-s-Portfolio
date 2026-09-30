import type { Request, Response } from "express";

import {
    getDashboardData,
} from "../services/dashboard.service.js";

export const getDashboardController = async (
    _req: Request,
    res: Response
) => {
    const dashboard =
        await getDashboardData();

    return res.status(200).json({
        success: true,
        data: dashboard,
    });
};
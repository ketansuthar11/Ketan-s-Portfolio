import type { Request, Response } from "express";

import {
    getAnalyticsSummary,
    getProjectAnalytics,
    getViewAnalytics,
} from "../services/analytics.service.js";

export const getAnalyticsController = async (
    _req: Request,
    res: Response
) => {
    const analytics = await getAnalyticsSummary();

    return res.status(200).json({
        success: true,
        data: analytics,
    });
};

export const getViewAnalyticsController = async (
    req: Request,
    res: Response
) => {
    const startDate = req.query.startDate
        ? new Date(String(req.query.startDate))
        : undefined;

    const endDate = req.query.endDate
        ? new Date(String(req.query.endDate))
        : undefined;

    const analytics = await getViewAnalytics(
        startDate,
        endDate
    );

    return res.status(200).json({
        success: true,
        data: analytics,
    });
};

export const getProjectAnalyticsController =
    async (_req: Request, res: Response) => {
        const analytics =
            await getProjectAnalytics();

        return res.status(200).json({
            success: true,
            data: analytics,
        });
    };
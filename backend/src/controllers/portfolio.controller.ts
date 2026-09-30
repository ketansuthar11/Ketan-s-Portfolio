import type { Request, Response } from "express";

import {
    getPublicPortfolio,
} from "../services/portfolio.service.js";

export const getPublicPortfolioController =
    async (_req: Request, res: Response) => {
        const portfolio =
            await getPublicPortfolio();

        return res.status(200).json({
            success: true,
            data: portfolio,
        });
    };
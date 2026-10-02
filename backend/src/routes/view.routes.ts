import { Router } from "express";

import {
    recordPortfolioViewController,
    getViewStatsController,
} from "../controllers/view.controller.js";

const router = Router();

router.post("/", recordPortfolioViewController);

router.get("/stats", getViewStatsController);

export default router;
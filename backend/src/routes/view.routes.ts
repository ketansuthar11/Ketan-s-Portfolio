import { Router } from "express";
import {
    recordPortfolioViewController,
    getViewCountController,
    getViewStatsController,
} from "../controllers/view.controller.js";

const router = Router();

router.post("/", recordPortfolioViewController);
router.get("/", getViewCountController);
router.get("/stats", getViewStatsController);

export default router;
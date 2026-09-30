import { Router } from "express";

import {
    getAnalyticsController,
    getProjectAnalyticsController,
    getViewAnalyticsController,
} from "../controllers/analytics.controller.js";
import {authMiddleware} from '../middleware/auth.middleware.js'

const router = Router();

router.get("/", getAnalyticsController);

router.get(
    "/views",
    authMiddleware,
    getViewAnalyticsController
);

router.get(
    "/projects",
    authMiddleware,
    getProjectAnalyticsController
);

export default router;
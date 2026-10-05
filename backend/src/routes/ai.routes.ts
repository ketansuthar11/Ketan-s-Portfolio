import { Router } from "express";

import {
    portfolioAIChatController,
} from "../controllers/ai.controller.js";

const router = Router();

router.post(
    "/chat",
    portfolioAIChatController
);

export default router;
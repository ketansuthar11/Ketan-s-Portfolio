import { Router } from "express";

import {
    recordPortfolioViewController,
} from "../controllers/view.controller.js";

const router = Router();

router.post(
    "/",
    recordPortfolioViewController
);

export default router;
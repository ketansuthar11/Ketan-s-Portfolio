import { Router } from "express";

import {
    getPublicPortfolioController,
} from "../controllers/portfolio.controller.js";
import {
    getPublicProjectController,
} from "../controllers/public-project.controller.js";

const router = Router();

router.get(
    "/",
    getPublicPortfolioController
);

router.get(
    "/projects/:slug",
    getPublicProjectController
);

export default router;
import { Router } from "express";

import {
    getPublicResumeController,
} from "../controllers/resume.controller.js";

const router = Router();

router.get(
    "/",
    getPublicResumeController
);

export default router;
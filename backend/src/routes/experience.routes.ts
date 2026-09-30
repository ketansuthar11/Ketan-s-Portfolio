import { Router } from "express";

import {
    getAllExperiencesController,
    getExperienceByIdController,
    createExperienceController,
    updateExperienceController,
    deleteExperienceController,
    updateExperienceVisibilityController,
} from "../controllers/experience.controller.js";
import {authMiddleware} from '../middleware/auth.middleware.js';

const router = Router();

router.get("/", authMiddleware, getAllExperiencesController);

router.get("/:id", authMiddleware, getExperienceByIdController);

router.post("/", authMiddleware, createExperienceController);

router.put("/:id", authMiddleware, updateExperienceController);

router.delete("/:id", authMiddleware, deleteExperienceController);

router.patch(
    "/:id/visibility",
    authMiddleware,
    updateExperienceVisibilityController
);

export default router;
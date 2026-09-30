import { Router } from "express";

import {
    getAllProjectsController,
    getProjectByIdController,
    createProjectController,
    updateProjectController,
    deleteProjectController,
    updateProjectVisibilityController,
    updateProjectFeaturedController,
} from "../controllers/project.controller.js";
import {authMiddleware} from '../middleware/auth.middleware.js'

const router = Router();

router.get("/", authMiddleware, getAllProjectsController);

router.get("/:id", authMiddleware, getProjectByIdController);

router.post("/", createProjectController);

router.put("/:id", authMiddleware, updateProjectController);

router.delete("/:id", authMiddleware, deleteProjectController);

router.patch(
    "/:id/visibility",
    authMiddleware,
    updateProjectVisibilityController
);

router.patch(
    "/:id/featured",
    authMiddleware,
    updateProjectFeaturedController
);

export default router;
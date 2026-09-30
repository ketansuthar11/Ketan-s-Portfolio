import { Router } from "express";
import {
    getAllEducationController,
    getEducationByIdController,
    createEducationController,
    updateEducationController,
    deleteEducationController,
    updateEducationVisibilityController,
} from "../controllers/education.controller.js";
import {authMiddleware} from '../middleware/auth.middleware.js';

const router = Router();

router.get("/", authMiddleware, getAllEducationController);

router.get("/:id", authMiddleware, getEducationByIdController);

router.post("/",authMiddleware, createEducationController);

router.put("/:id", authMiddleware, updateEducationController);

router.delete("/:id", authMiddleware, deleteEducationController);

router.patch(
    "/:id/visibility",
    authMiddleware,
    updateEducationVisibilityController
);

export default router;
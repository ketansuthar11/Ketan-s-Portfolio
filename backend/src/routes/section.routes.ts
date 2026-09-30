import { Router } from "express";

import {
    createSectionController,
    deleteSectionController,
    getAllSectionsController,
    getSectionByIdController,
    updateSectionController,
    updateSectionOrderController,
    updateSectionVisibilityController,
} from "../controllers/section.controller.js";
import {authMiddleware} from '../middleware/auth.middleware.js'

const router = Router();

router.get("/", authMiddleware, getAllSectionsController);

router.get("/:id", authMiddleware, getSectionByIdController);

router.post("/", authMiddleware, createSectionController);

router.put("/:id", authMiddleware, updateSectionController);

router.delete("/:id", authMiddleware, deleteSectionController);

router.patch("/:id/visibility", authMiddleware, updateSectionVisibilityController);

router.patch(
    "/:id/order",
    authMiddleware,
    updateSectionOrderController
);

export default router;
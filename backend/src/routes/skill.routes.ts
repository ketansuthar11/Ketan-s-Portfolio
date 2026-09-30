import { Router } from "express";
import {
    getAllSkillsController,
    getSkillByIdController,
    createSkillController,
    updateSkillController,
    deleteSkillController,
    updateSkillVisibilityController,
} from "../controllers/skill.controller.js";
import {
    authMiddleware,
} from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", authMiddleware, getAllSkillsController);

router.get("/:id", authMiddleware, getSkillByIdController);

router.post("/", authMiddleware, createSkillController);

router.put("/:id", authMiddleware, updateSkillController);

router.delete("/:id", authMiddleware, deleteSkillController);

router.patch(
    "/:id/visibility",
    updateSkillVisibilityController
);

export default router;
import { Router } from "express";
import {
    getResumesController,
    uploadResumeController,
    deleteResumeController,
    setDefaultResumeController,
} from "../controllers/resume.controller.js";
import { uploadResume } from "../middleware/upload.middleware.js";
import {authMiddleware} from '../middleware/auth.middleware.js';

const router = Router();

router.get("/", authMiddleware, getResumesController);

router.post("/", authMiddleware, uploadResume.single("resume"),uploadResumeController);

router.delete("/:id", authMiddleware, deleteResumeController);

router.patch("/:id/default", authMiddleware, setDefaultResumeController);

export default router;


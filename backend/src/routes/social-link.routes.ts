import { Router } from "express";
import {
    getSocialLinksController,
    createSocialLinkController,
    updateSocialLinkController,
    deleteSocialLinkController,
} from "../controllers/social-link.controller.js";
import {authMiddleware} from '../middleware/auth.middleware.js';
const router = Router();

router.get("/", authMiddleware, getSocialLinksController);

router.post("/", authMiddleware, createSocialLinkController);

router.put("/:id", authMiddleware, updateSocialLinkController);

router.delete("/:id", authMiddleware, deleteSocialLinkController);

export default router;
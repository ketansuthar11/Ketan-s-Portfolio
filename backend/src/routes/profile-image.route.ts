import { Router } from "express";

import {
    getProfileImagesController,
    uploadProfileImageController,
    deleteProfileImageController,
    setDefaultProfileImageController
} from "../controllers/profile-image.controller.js";

import {authMiddleware} from '../middleware/auth.middleware.js'

import { uploadImage } from "../middleware/upload.middleware.js";

const router = Router();

router.get("/", authMiddleware, getProfileImagesController);

router.post("/", authMiddleware, uploadImage.single("image"),uploadProfileImageController);

router.delete("/:id",  authMiddleware, deleteProfileImageController);
router.patch("/:id/default", authMiddleware, setDefaultProfileImageController);
export default router;
import { Router } from "express";

import {
    deleteMessageController,
    getAllMessagesController,
    getMessageByIdController,
    markMessageReadController,
} from "../controllers/message.controller.js";
import {authMiddleware} from '../middleware/auth.middleware.js'

const router = Router();

router.get("/", authMiddleware, getAllMessagesController);

router.get("/:id", authMiddleware, getMessageByIdController);

router.patch("/:id/read", authMiddleware, markMessageReadController);

router.delete("/:id", authMiddleware, deleteMessageController);

export default router;
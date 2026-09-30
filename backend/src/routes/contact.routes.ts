import { Router } from "express";

import {
    createContactMessageController,
} from "../controllers/message.controller.js";

const router = Router();

router.post("/", createContactMessageController);

export default router;
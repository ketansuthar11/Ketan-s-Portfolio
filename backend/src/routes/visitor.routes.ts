import { Router } from "express";
import {
    registerVisitorController,
    getUniqueVisitorCountController,
} from "../controllers/visitor.controller.js";

const router = Router();

router.post("/", registerVisitorController);
router.get("/", getUniqueVisitorCountController);

export default router;
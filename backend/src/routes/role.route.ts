import * as roleController from "../controllers/role.controller.js";
import Router from "express";
import {authMiddleware} from '../middleware/auth.middleware.js'
const router = Router();

router.get("/", authMiddleware, roleController.getRolesController);

router.post("/", authMiddleware, roleController.createRoleController);

router.put("/:id", authMiddleware, roleController.updateRoleController);

router.delete("/:id", authMiddleware, roleController.deleteRoleController);

router.patch("/:id/default", authMiddleware, roleController.setDefaultRoleController);

export default router;
import {getProfileController, updateProfileController} from '../controllers/profile.controller.js';
import {Router} from 'express';
import {authMiddleware} from '../middleware/auth.middleware.js'
const router = Router();

router.get('/', authMiddleware, getProfileController);
router.put('/', authMiddleware, updateProfileController);

export default router
import { Router } from 'express';
import { protect, allow } from '../middleware/auth.js';
import { loginActivity, users } from '../controllers/adminController.js';
const router = Router();
router.get('/users', protect, allow('Admin'), users);
router.get('/login-activity', protect, allow('Admin'), loginActivity);
export default router;

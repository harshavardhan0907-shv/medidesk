import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { update } from '../controllers/profileController.js';
const router = Router();
router.patch('/', protect, update);
export default router;

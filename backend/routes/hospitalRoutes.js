import { Router } from 'express';
import { authRequired } from '../middleware/authMiddleware.js';
import { submitReport, getMyReports } from '../controllers/hospitalController.js';

const router = Router();

router.post('/report', authRequired, submitReport);
router.get('/my-reports', authRequired, getMyReports);

export default router;


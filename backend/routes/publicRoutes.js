import { Router } from 'express';
import { getPublicSummary, getPublicRegions, getPublicTrends } from '../controllers/publicController.js';

const router = Router();

router.get('/summary', getPublicSummary);
router.get('/regions', getPublicRegions);
router.get('/trends', getPublicTrends);

export default router;


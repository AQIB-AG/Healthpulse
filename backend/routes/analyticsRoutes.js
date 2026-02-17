import { Router } from 'express';
import { getHighRisk, getSpikes, getComparison } from '../controllers/analyticsController.js';

const router = Router();

router.get('/high-risk', getHighRisk);
router.get('/spikes', getSpikes);
router.get('/compare', getComparison);

export default router;


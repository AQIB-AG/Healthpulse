import { getHighRiskRegions, getRegionComparison, getWeeklySpikes } from '../services/analyticsService.js';

export async function getHighRisk(req, res, next) {
  try {
    const regions = await getHighRiskRegions();
    res.json({ regions });
  } catch (err) {
    next(err);
  }
}

export async function getSpikes(req, res, next) {
  try {
    const spikes = await getWeeklySpikes();
    res.json({ spikes });
  } catch (err) {
    next(err);
  }
}

export async function getComparison(req, res, next) {
  try {
    const regionsParam = req.query.regions;
    const regions =
      typeof regionsParam === 'string' && regionsParam.length > 0
        ? regionsParam.split(',').map((r) => r.trim())
        : [];

    const result = await getRegionComparison(regions);
    res.json(result);
  } catch (err) {
    next(err);
  }
}


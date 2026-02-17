import { DiseaseReport } from '../models/DiseaseReport.js';

export async function getPublicSummary(req, res, next) {
  try {
    const [agg] = await DiseaseReport.aggregate([
      {
        $group: {
          _id: null,
          totalCases: { $sum: '$cases' },
          regions: { $addToSet: '$region' },
          diseases: { $addToSet: '$diseaseName' },
          latestReport: { $max: '$reportedAt' },
        },
      },
    ]);

    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(now.getDate() - 7);

    const [recent] = await DiseaseReport.aggregate([
      { $match: { reportedAt: { $gte: weekAgo } } },
      { $group: { _id: null, recentCases: { $sum: '$cases' }, regions: { $addToSet: '$region' } } },
    ]);

    const [prev] = await DiseaseReport.aggregate([
      {
        $match: {
          reportedAt: { $lt: weekAgo, $gte: new Date(weekAgo.getTime() - 7 * 24 * 60 * 60 * 1000) },
        },
      },
      { $group: { _id: null, previousCases: { $sum: '$cases' } } },
    ]);

    const totalCases = agg?.totalCases ?? 0;
    const totalRegions = agg?.regions?.length ?? 0;
    const totalDiseases = agg?.diseases?.length ?? 0;
    const latestReport = agg?.latestReport ?? null;
    const recentCases = recent?.recentCases ?? 0;
    const previousCases = prev?.previousCases ?? 0;
    const change =
      previousCases === 0 ? null : ((recentCases - previousCases) / previousCases) * 100.0;

    const highRiskRegionsAgg = await DiseaseReport.aggregate([
      {
        $group: {
          _id: { region: '$region', week: { $isoWeek: '$reportedAt' } },
          totalCases: { $sum: '$cases' },
        },
      },
      {
        $group: {
          _id: '$_id.region',
          weeks: {
            $push: {
              week: '$_id.week',
              totalCases: '$totalCases',
            },
          },
        },
      },
    ]);

    const highRiskRegions = highRiskRegionsAgg
      .map((entry) => {
        const weeks = entry.weeks.sort((a, b) => a.week - b.week);
        if (weeks.length < 2) return null;
        const last = weeks[weeks.length - 1];
        const prevWeek = weeks[weeks.length - 2];
        const pct =
          prevWeek.totalCases === 0
            ? 0
            : ((last.totalCases - prevWeek.totalCases) / prevWeek.totalCases) * 100.0;
        return pct > 30 ? entry._id : null;
      })
      .filter(Boolean);

    res.json({
      totalCases,
      totalRegions,
      totalDiseases,
      latestReport,
      recentCases,
      previousCases,
      weeklyChangePercent: change,
      highRiskRegionCount: highRiskRegions.length,
    });
  } catch (err) {
    next(err);
  }
}

export async function getPublicRegions(req, res, next) {
  try {
    const regions = await DiseaseReport.aggregate([
      {
        $group: {
          _id: '$region',
          totalCases: { $sum: '$cases' },
          latestReport: { $max: '$reportedAt' },
          diseases: { $addToSet: '$diseaseName' },
        },
      },
      {
        $project: {
          _id: 0,
          region: '$_id',
          totalCases: 1,
          latestReport: 1,
          diseases: 1,
        },
      },
      { $sort: { totalCases: -1 } },
    ]);

    res.json({ regions });
  } catch (err) {
    next(err);
  }
}

export async function getPublicTrends(req, res, next) {
  try {
    const { region, diseaseName } = req.query;
    const match = {};

    if (region) match.region = region;
    if (diseaseName) match.diseaseName = diseaseName;

    const trends = await DiseaseReport.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            day: { $dateToString: { format: '%Y-%m-%d', date: '$reportedAt' } },
          },
          totalCases: { $sum: '$cases' },
        },
      },
      {
        $project: {
          _id: 0,
          date: '$_id.day',
          totalCases: 1,
        },
      },
      { $sort: { date: 1 } },
    ]);

    res.json({ trends });
  } catch (err) {
    next(err);
  }
}


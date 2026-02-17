import { DiseaseReport } from '../models/DiseaseReport.js';

function buildWeekKey(doc) {
  const { year, week } = doc;
  const paddedWeek = String(week).padStart(2, '0');
  return `${year}-W${paddedWeek}`;
}

async function aggregateWeeklyByRegionAndDisease(match = {}) {
  const pipeline = [
    { $match: match },
    {
      $project: {
        region: 1,
        diseaseName: 1,
        cases: 1,
        year: { $isoWeekYear: '$reportedAt' },
        week: { $isoWeek: '$reportedAt' },
      },
    },
    {
      $group: {
        _id: {
          region: '$region',
          diseaseName: '$diseaseName',
          year: '$year',
          week: '$week',
        },
        totalCases: { $sum: '$cases' },
      },
    },
    {
      $project: {
        _id: 0,
        region: '$_id.region',
        diseaseName: '$_id.diseaseName',
        year: '$_id.year',
        week: '$_id.week',
        totalCases: 1,
      },
    },
  ];

  return DiseaseReport.aggregate(pipeline);
}

async function aggregateWeeklyByRegion(match = {}) {
  const pipeline = [
    { $match: match },
    {
      $project: {
        region: 1,
        cases: 1,
        year: { $isoWeekYear: '$reportedAt' },
        week: { $isoWeek: '$reportedAt' },
      },
    },
    {
      $group: {
        _id: {
          region: '$region',
          year: '$year',
          week: '$week',
        },
        totalCases: { $sum: '$cases' },
      },
    },
    {
      $project: {
        _id: 0,
        region: '$_id.region',
        year: '$_id.year',
        week: '$_id.week',
        totalCases: 1,
      },
    },
    { $sort: { region: 1, year: 1, week: 1 } },
  ];

  return DiseaseReport.aggregate(pipeline);
}

export async function getWeeklySpikes() {
  const weeklyDocs = await aggregateWeeklyByRegionAndDisease();

  const byRegionDisease = new Map();
  weeklyDocs.forEach((doc) => {
    const key = `${doc.region}::${doc.diseaseName}`;
    if (!byRegionDisease.has(key)) {
      byRegionDisease.set(key, []);
    }
    byRegionDisease.get(key).push(doc);
  });

  const spikes = [];

  for (const [key, rows] of byRegionDisease.entries()) {
    rows.sort((a, b) => (a.year - b.year) || (a.week - b.week));
    if (rows.length < 2) continue;
    const current = rows[rows.length - 1];
    const previous = rows[rows.length - 2];
    if (previous.totalCases === 0) continue;

    const growthRate = ((current.totalCases - previous.totalCases) / previous.totalCases) * 100;

    if (growthRate > 30 && current.totalCases >= 20) {
      const [region, diseaseName] = key.split('::');
      spikes.push({
        region,
        diseaseName,
        growthRate,
        currentWeekCases: current.totalCases,
        previousWeekCases: previous.totalCases,
        year: current.year,
        week: current.week,
        weekLabel: buildWeekKey(current),
      });
    }
  }

  return spikes;
}

export async function getHighRiskRegions() {
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 7);

  const regions = await DiseaseReport.aggregate([
    { $match: { reportedAt: { $gte: sevenDaysAgo } } },
    {
      $group: {
        _id: '$region',
        totalCases: { $sum: '$cases' },
      },
    },
    {
      $project: {
        _id: 0,
        region: '$_id',
        totalCases: 1,
      },
    },
    { $sort: { totalCases: -1 } },
    { $limit: 5 },
  ]);

  return regions;
}

export async function getRegionComparison(regions) {
  const match = {};
  const cleanedRegions =
    Array.isArray(regions) && regions.length > 0
      ? regions.filter((r) => typeof r === 'string' && r.trim().length > 0)
      : [];

  if (cleanedRegions.length > 0) {
    match.region = { $in: cleanedRegions };
  }

  const weeklyDocs = await aggregateWeeklyByRegion(match);

  const seriesMap = new Map();

  weeklyDocs.forEach((doc) => {
    const label = buildWeekKey(doc);
    if (!seriesMap.has(doc.region)) {
      seriesMap.set(doc.region, []);
    }
    seriesMap.get(doc.region).push({
      year: doc.year,
      week: doc.week,
      label,
      totalCases: doc.totalCases,
    });
  });

  const series = Array.from(seriesMap.entries()).map(([region, points]) => ({
    region,
    points: points.sort((a, b) => (a.year - b.year) || (a.week - b.week)),
  }));

  return { series };
}


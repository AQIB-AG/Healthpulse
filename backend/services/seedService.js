import { DiseaseReport } from '../models/DiseaseReport.js';

const REGIONS = ['North District', 'Coastal Belt', 'River Valley', 'Metro Zone'];
const DISEASES = ['Respiratory', 'Dengue', 'Gastro', 'Influenza'];

export async function ensureSeedData() {
  const count = await DiseaseReport.estimatedDocumentCount();
  if (count > 0) {
    return;
  }

  const now = new Date();
  const weeksBack = 8;
  const docs = [];

  for (let week = 0; week < weeksBack; week += 1) {
    const weekDate = new Date(now);
    weekDate.setDate(now.getDate() - week * 7);

    for (const region of REGIONS) {
      for (const disease of DISEASES) {
        const seasonalBoost = disease === 'Dengue' && region === 'Coastal Belt' ? 1.3 : 1;
        const base = 50 + week * 5;
        const randomJitter = Math.round(Math.random() * 20);
        const spikeMultiplier = week === 1 && region === 'Metro Zone' ? 1.6 : 1;

        const cases = Math.round(base * seasonalBoost * spikeMultiplier + randomJitter);

        docs.push({
          diseaseName: disease,
          region,
          cases,
          reportedAt: new Date(weekDate),
        });
      }
    }
  }

  await DiseaseReport.insertMany(docs);
  // eslint-disable-next-line no-console
  console.log(`Seeded ${docs.length} DiseaseReport documents`);
}


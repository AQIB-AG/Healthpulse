import { DiseaseReport } from '../models/DiseaseReport.js';

export async function submitReport(req, res, next) {
  try {
    const { diseaseName, cases, region } = req.body;
    const hospital = req.user?.hospital;

    if (!hospital) {
      return res.status(401).json({ message: 'Unauthenticated' });
    }

    if (!diseaseName || typeof cases !== 'number') {
      return res
        .status(400)
        .json({ message: 'diseaseName and numeric cases are required for a report.' });
    }

    const effectiveRegion = region || hospital.region;

    const report = await DiseaseReport.create({
      hospitalId: hospital._id,
      diseaseName,
      region: effectiveRegion,
      cases,
      reportedAt: new Date(),
    });

    return res.status(201).json({ report });
  } catch (err) {
    return next(err);
  }
}

export async function getMyReports(req, res, next) {
  try {
    const hospitalId = req.user?.id;
    if (!hospitalId) {
      return res.status(401).json({ message: 'Unauthenticated' });
    }

    const reports = await DiseaseReport.find({ hospitalId })
      .sort({ reportedAt: -1 })
      .limit(100)
      .lean();

    return res.json({ reports });
  } catch (err) {
    return next(err);
  }
}


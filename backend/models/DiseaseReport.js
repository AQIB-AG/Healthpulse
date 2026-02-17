import mongoose from 'mongoose';

const diseaseReportSchema = new mongoose.Schema(
  {
    hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', index: true },
    diseaseName: { type: String, required: true, index: true },
    region: { type: String, required: true, index: true },
    cases: { type: Number, required: true, min: 0 },
    reportedAt: { type: Date, required: true, index: true },
  },
  {
    timestamps: true,
  },
);

export const DiseaseReport = mongoose.model('DiseaseReport', diseaseReportSchema);


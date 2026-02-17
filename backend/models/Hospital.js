import mongoose from 'mongoose';

const hospitalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    password: { type: String, required: true },
    region: { type: String, required: true },
    role: { type: String, enum: ['hospital', 'admin'], default: 'hospital' },
  },
  {
    timestamps: true,
  },
);

export const Hospital = mongoose.model('Hospital', hospitalSchema);


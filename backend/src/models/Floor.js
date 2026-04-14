import mongoose from 'mongoose';

const floorSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    level: { type: Number, required: true },
    building: { type: String, default: 'Main', trim: true },
  },
  { timestamps: true }
);

floorSchema.index({ building: 1, level: 1 }, { unique: true });

export const Floor = mongoose.model('Floor', floorSchema);

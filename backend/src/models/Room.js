import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    floor: { type: mongoose.Schema.Types.ObjectId, ref: 'Floor', required: true, index: true },
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

roomSchema.index({ floor: 1, code: 1 }, { unique: true });

export const Room = mongoose.model('Room', roomSchema);

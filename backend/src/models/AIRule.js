import mongoose from 'mongoose';

const aiRuleSchema = new mongoose.Schema(
  {
    incidentType: { type: String, required: true, unique: true, trim: true, index: true },
    label: { type: String, required: true, trim: true },
    responseSteps: [{ type: String, trim: true }],
    escalationHints: [{ type: String, trim: true }],
    priorityWeight: { type: Number, default: 1, min: 0.1, max: 10 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const AIRule = mongoose.model('AIRule', aiRuleSchema);

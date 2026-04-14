import mongoose from 'mongoose';

export const EMERGENCY_TYPES = ['Fire', 'Medical', 'Theft', 'Violence'];
export const INCIDENT_STATUSES = ['Pending', 'In Progress', 'Resolved'];

const noteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true, trim: true, maxlength: 4000 },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const incidentSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, default: '' },
    description: { type: String, trim: true, default: '' },
    emergencyType: { type: String, enum: EMERGENCY_TYPES, required: true, index: true },
    priority: { type: Number, required: true, min: 1, max: 100, index: true },
    status: {
      type: String,
      enum: INCIDENT_STATUSES,
      default: 'Pending',
      index: true,
    },
    floor: { type: mongoose.Schema.Types.ObjectId, ref: 'Floor', required: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    triggeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    sosSource: { type: String, default: 'sos_panel', trim: true },
    notes: [noteSchema],
    firstResponseAt: { type: Date, default: null },
    resolvedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

incidentSchema.index({ createdAt: -1 });
incidentSchema.index({ status: 1, emergencyType: 1 });

export const Incident = mongoose.model('Incident', incidentSchema);

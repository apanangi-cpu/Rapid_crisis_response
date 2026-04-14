import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDb } from '../config/db.js';
import { User } from '../models/User.js';
import { Floor } from '../models/Floor.js';
import { Room } from '../models/Room.js';
import { AIRule } from '../models/AIRule.js';
import { hashPassword } from '../utils/password.js';

const rules = [
  {
    incidentType: 'Fire',
    label: 'Fire response playbook',
    priorityWeight: 1.05,
    responseSteps: [
      'Pull the nearest fire alarm and call emergency services.',
      'Evacuate guests and staff using nearest safe exits; do not use elevators.',
      'Close doors behind you to contain smoke; assist anyone needing mobility help.',
      'Rally at the designated assembly point; account for staff on floor.',
    ],
    escalationHints: ['If smoke is heavy or spreading, abandon rescue attempts beyond your training.', 'Transfer command to arriving fire department.'],
  },
  {
    incidentType: 'Medical',
    label: 'Medical emergency playbook',
    priorityWeight: 1.02,
    responseSteps: [
      'Ensure scene safety; send someone to meet EMS at the entrance.',
      'If unconscious and not breathing normally, begin CPR and retrieve AED if available.',
      'Gather allergies, medications, and event timeline for responders.',
      'Clear a path and reduce crowd pressure around the patient.',
    ],
    escalationHints: ['If airway compromise or severe bleeding, prioritize immediate EMS handoff.'],
  },
  {
    incidentType: 'Theft',
    label: 'Theft / loss playbook',
    priorityWeight: 1,
    responseSteps: [
      'Preserve CCTV pointers and access logs (internal retention).',
      'Do not confront aggressively; observe and discreetly notify security.',
      'Document items, time window, and witnesses; secure the affected area.',
    ],
    escalationHints: ['If threat of violence emerges, reclassify and escalate as Violence.'],
  },
  {
    incidentType: 'Violence',
    label: 'Violence / disturbance playbook',
    priorityWeight: 1.08,
    responseSteps: [
      'Maintain distance; prioritize de-escalation and guest/staff safety.',
      'Summon security and local authorities if weapons or injuries are present.',
      'Isolate the area; prevent bystander recording from escalating tensions.',
    ],
    escalationHints: ['If injuries occur, trigger Medical workflow in parallel.'],
  },
];

async function run() {
  await connectDb();
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@crisissync.local';
  const password = process.env.SEED_ADMIN_PASSWORD || 'ChangeMe123!';
  const existing = await User.findOne({ email });
  if (!existing) {
    await User.create({
      name: 'System Admin',
      email,
      passwordHash: await hashPassword(password),
      role: 'Admin',
    });
    console.log('Created admin:', email, '/', password);
  } else {
    console.log('Admin already exists:', email);
  }

  let floor = await Floor.findOne({ building: 'Main', level: 3 });
  if (!floor) {
    floor = await Floor.create({ label: 'Level 3 - Guest Rooms', level: 3, building: 'Main' });
    await Room.create([
      { floor: floor._id, name: 'Corridor A', code: 'L3-A' },
      { floor: floor._id, name: 'Suite 301', code: 'L3-301' },
      { floor: floor._id, name: 'Banquet East', code: 'L3-BE' },
    ]);
    console.log('Seeded floor + rooms');
  } else {
    console.log('Floor seed skipped (exists)');
  }

  for (const r of rules) {
    await AIRule.findOneAndUpdate(
      { incidentType: r.incidentType },
      { $set: { ...r, active: true } },
      { upsert: true }
    );
  }
  console.log('AI rules upserted');

  await mongoose.disconnect();
  console.log('Seed complete');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

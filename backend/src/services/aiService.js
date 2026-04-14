import { AIRule } from '../models/AIRule.js';

export async function getSuggestionsForType(incidentType) {
  const key = String(incidentType || '').trim();
  const rule = await AIRule.findOne({ incidentType: key, active: true });
  if (!rule) {
    return {
      incidentType: key,
      found: false,
      label: 'Generic response',
      responseSteps: ['Assess the scene for safety.', 'Notify on-site security and management.', 'Follow local emergency protocols.'],
      escalationHints: ['Escalate to emergency services if life safety is at risk.'],
      priorityWeight: 1,
    };
  }
  return {
    incidentType: rule.incidentType,
    found: true,
    label: rule.label,
    responseSteps: rule.responseSteps,
    escalationHints: rule.escalationHints,
    priorityWeight: rule.priorityWeight,
  };
}

export async function listRules() {
  return AIRule.find({ active: true }).sort({ incidentType: 1 }).lean();
}

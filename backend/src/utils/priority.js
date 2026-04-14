import { EMERGENCY_TYPES } from '../models/Incident.js';

const BASE = { Fire: 90, Medical: 85, Violence: 88, Theft: 70 };

/**
 * Rule-based priority score (1-100) for triage.
 * Integrates with AI rule priorityWeight when available.
 */
export function computeIncidentPriority(emergencyType, aiRuleWeight = 1) {
  if (!EMERGENCY_TYPES.includes(emergencyType)) {
    throw new Error(`Invalid emergency type: ${emergencyType}`);
  }
  const base = BASE[emergencyType] ?? 50;
  const scaled = Math.min(100, Math.max(1, Math.round(base * Number(aiRuleWeight))));
  return scaled;
}

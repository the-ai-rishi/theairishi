export interface JourneySkill {
  id: string;
  name: string;
  plain: string;
  icon: string;
  href: string;
  group: string;
  phases: string[];
  focusDay: number | null;
}

export interface JourneyGate {
  id: string;
  name: string;
  around: string;
  day: number | null;
  evidence: string;
}

export interface JourneyDay {
  day: number;
  id: string;
  title: string;
  goal: string;
  concepts: string[];
  phaseId: string;
  capstoneConnection: string;
  previousDay: number | null;
  nextDay: number | null;
  gateId: string | null;
  skillIds: string[];
}

export interface JourneyPhase {
  id: string;
  number: number;
  name: string;
  daysLabel: string;
  startDay: number;
  endDay: number;
  summary: string;
  plain: string;
  icon: string;
  accent: string;
  gateId: string | null;
  skillIds: string[];
}

export interface JourneySpan {
  id: string;
  name: string;
  from: number;
  to: number;
  plain: string;
}

export interface JourneyModel {
  hours: string;
  days: JourneyDay[];
  phases: JourneyPhase[];
  gates: JourneyGate[];
  skills: JourneySkill[];
  spans: JourneySpan[];
  errors: string[];
}

export interface JourneyQuery {
  phaseId?: string;
  skillId?: string;
  gateId?: string;
  concept?: string;
  from?: number;
  to?: number;
  day?: number;
}

export function collectJourneyErrors(forge: unknown, experience: unknown): string[];
export function normalizeJourney(forge: unknown, experience: unknown): JourneyModel;
export function queryDays(journey: JourneyModel, query?: JourneyQuery): JourneyDay[];

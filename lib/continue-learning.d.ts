export interface LearnerDay {
  day: number;
  slug: string;
  title: string;
  summary: string;
  published: boolean;
  href: string | null;
  phaseId: string;
  phaseName: string;
  phaseNumber: number;
}

export interface LearnerPhase {
  id: string;
  number: number;
  name: string;
  daysLabel: string;
  startDay: number;
  endDay: number;
  summary: string;
  current: boolean;
  publishedCount: number;
  totalDays: number;
}

export interface LearnerCatalog {
  programId: string;
  programSlug: string;
  title: string;
  durationLabel: string;
  description: string;
  outcome?: string;
  capstone?: string;
  mapTitle?: string;
  currentPhaseId: string;
  totalDays: number;
  startHref: string;
  startDay: number | null;
  startTitle: string | null;
  days: LearnerDay[];
  phases: LearnerPhase[];
}

export type ContinueKind = "start" | "continue" | "wait";

export interface ContinueTarget {
  kind: ContinueKind;
  href: string | null;
  slug: string | null;
  day: number | null;
  title: string | null;
  phaseName: string | null;
  phaseNumber: number | null;
  ctaLabel: string;
  completedCount: number;
  startedCount: number;
  totalDays: number;
  waitTitle: string | null;
  waitDay: number | null;
}

export interface PhaseProgress extends LearnerPhase {
  completedCount: number;
}

export function resolveContinue(
  progress: { completed?: string[]; started?: string[]; lastVisited?: string | null } | null | undefined,
  catalog: LearnerCatalog | { days?: LearnerDay[]; totalDays?: number } | null | undefined
): ContinueTarget;

export function phaseProgress(
  catalog: LearnerCatalog | { days?: LearnerDay[]; phases?: LearnerPhase[] } | null | undefined,
  progress: { completed?: string[] } | null | undefined
): PhaseProgress[];

export function publishedDays(catalog: { days?: LearnerDay[] } | null | undefined): LearnerDay[];
export function formatDayLabel(day: number): string;

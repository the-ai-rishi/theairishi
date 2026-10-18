import type { JourneyModel } from "./journey";

export interface ProgramExperiencePhase {
  plain: string;
  icon: string;
  accent: string;
}

export interface ProgramExperienceItem {
  id: string;
  name: string;
  plain: string;
  icon?: string;
  href?: string;
  phases?: string[];
  days?: number[];
  kind?: "skill" | "tool";
  focusDay?: number;
  accent?: string;
}

export interface ProgramExperienceGroup {
  id: string;
  title: string;
  accent: string;
  items: ProgramExperienceItem[];
}

export interface ProgramExperience {
  programSource?: string;
  hero: { lead: string; detail: string; because: string };
  fixtureLabel?: string;
  phases: Record<string, ProgramExperiencePhase>;
  skills: ProgramExperienceGroup[];
  order: ProgramExperienceItem[];
  days: ProgramExperienceItem[];
  retrieval: ProgramExperienceItem[];
  control: ProgramExperienceItem[];
  spans: Array<{ id: string; name: string; from: number; to: number; plain: string }>;
}

export interface ProgramModel {
  program: { id: string; source?: string; title?: string } | null;
  experience: ProgramExperience;
  journey: JourneyModel;
  curriculum: unknown;
  sourceId: string | null;
}

export function getProgramModel(programId?: string): ProgramModel;
export function collectAlignmentErrors(program: unknown, curriculum: unknown, experience: unknown): string[];

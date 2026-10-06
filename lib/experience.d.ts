export interface ExperienceItem {
  id: string;
  name: string;
  plain: string;
  icon?: string;
  href?: string;
  accent?: string;
}

export interface SkillGroup {
  id: string;
  title: string;
  accent: string;
  items: ExperienceItem[];
}

export interface PhaseNote {
  plain: string;
  icon: string;
  accent: "ochre" | "cobalt" | "teal" | "plum" | "ink";
}

export interface ExperienceConfig {
  hero: { lead: string; detail: string; because: string };
  phases: Record<string, PhaseNote>;
  skills: SkillGroup[];
  order: ExperienceItem[];
  days: ExperienceItem[];
  retrieval: ExperienceItem[];
  control: ExperienceItem[];
  fixtureLabel: string;
}

export function loadExperience(rootDir?: string): ExperienceConfig;
export function normalizeExperience(
  raw: ExperienceConfig,
  allowedIcons?: string[]
): { experience: ExperienceConfig; errors: string[] };
export const iconKeys: string[];

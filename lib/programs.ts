import programsJson from "../content/config/programs.json";
import { getAllLessonSummaries, type LessonSummary } from "./lessons";

export interface ProgramPhase {
  id: string;
  number: number;
  name: string;
  daysLabel: string;
  startDay: number;
  endDay: number;
  summary: string;
}

export interface ProgramDay {
  day: number;
  phaseId: string;
  slug: string;
  title: string;
  summary: string;
}

export interface ProgramConfig {
  id: string;
  slug: string;
  title: string;
  durationLabel: string;
  currentPhaseId: string;
  repoUrl: string;
  status: string;
  enabled: boolean;
  description: string;
  startHref: string;
  capstone: string;
  phases: ProgramPhase[];
  days: ProgramDay[];
}

export interface HydratedDay extends ProgramDay {
  published: boolean;
  href: string | null;
  lesson: LessonSummary | null;
}

export interface HydratedPhase extends ProgramPhase {
  current: boolean;
  days: HydratedDay[];
  publishedCount: number;
}

function asProgram(raw: unknown): ProgramConfig {
  const cfg = raw as ProgramConfig;
  if (!cfg?.id || !cfg.title || !Array.isArray(cfg.phases) || !Array.isArray(cfg.days)) {
    throw new Error("[programs] content/config/programs.json is missing id, title, phases, or days");
  }
  return cfg;
}

export function getProgram(): ProgramConfig {
  return asProgram(programsJson);
}

export function getPhase(phaseId: string): ProgramPhase | null {
  return getProgram().phases.find((phase) => phase.id === phaseId) || null;
}

export function getProgramDay(day: number): ProgramDay | null {
  return getProgram().days.find((item) => item.day === day) || null;
}

function lessonForDay(day: ProgramDay, lessons: LessonSummary[]): LessonSummary | null {
  return (
    lessons.find((lesson) => lesson.metadata.day === day.day) ||
    lessons.find((lesson) => lesson.slug === day.slug) ||
    null
  );
}

export function getHydratedDays(): HydratedDay[] {
  const program = getProgram();
  const lessons = getAllLessonSummaries().filter(
    (lesson) =>
      lesson.metadata.program === program.id ||
      typeof lesson.metadata.day === "number" ||
      lesson.slug.startsWith("day-")
  );
  return program.days.map((day) => {
    const lesson = lessonForDay(day, lessons);
    return {
      ...day,
      published: Boolean(lesson),
      href: lesson ? `/learn/${lesson.slug}` : null,
      lesson,
    };
  });
}

export function getHydratedPhases(): HydratedPhase[] {
  const program = getProgram();
  const days = getHydratedDays();
  return program.phases.map((phase) => {
    const phaseDays = days.filter((day) => day.phaseId === phase.id);
    return {
      ...phase,
      current: phase.id === program.currentPhaseId,
      days: phaseDays,
      publishedCount: phaseDays.filter((day) => day.published).length,
    };
  });
}

export function getPublishedProgramDays(): HydratedDay[] {
  return getHydratedDays().filter((day) => day.published);
}

export function getNextUnpublishedDay(): HydratedDay | null {
  return getHydratedDays().find((day) => !day.published) || null;
}

export function getStartDay(): HydratedDay | null {
  const published = getPublishedProgramDays();
  return published[0] || null;
}

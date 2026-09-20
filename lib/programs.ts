import programsJson from "../content/config/programs.json";
import {
  parseProgramCatalog,
  parseProgramConfig,
  asProgramCatalog,
  featuredProgramFrom,
} from "./program-schema";
import { getAllLessonSummaries, type LessonSummary } from "./lessons";
import { normalizeStatus } from "./visibility-core";
import type { LearnerCatalog, LearnerDay, LearnerPhase } from "./continue-learning";

/** Featured DevOps program also answers /programs/devops. */
const PROGRAM_SLUG_ALIASES: Record<string, string> = {
  devops: "devops-engineer-mastery",
};

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
  status: string;
  enabled: boolean;
  featured?: boolean;
  mapTitle?: string;
  description: string;
  startHref: string;
  capstone: string;
  outcome?: string;
  phases: ProgramPhase[];
  days: ProgramDay[];
}

export interface ProgramCatalog {
  featuredProgramId: string;
  programs: ProgramConfig[];
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

/**
 * Runtime program catalog.
 * `lib/program-schema.js` is the only validator. Do not add a second TypeScript schema.
 */
export function getProgramCatalog(): ProgramCatalog {
  return parseProgramCatalog(programsJson) as unknown as ProgramCatalog;
}

/** The featured current program. Homepage, /learn, and Start Day 1 use this. */
export function getProgram(): ProgramConfig {
  return parseProgramConfig(programsJson) as ProgramConfig;
}

export function getProgramById(id: string): ProgramConfig | null {
  const catalog = asProgramCatalog(programsJson);
  if (!catalog) return null;
  const found = catalog.programs.find((program) => program && program.id === id) as ProgramConfig | undefined;
  return found || null;
}

export function getProgramBySlug(slug: string): ProgramConfig | null {
  const catalog = asProgramCatalog(programsJson);
  if (!catalog) return null;
  const requested = String(slug || "").trim().toLowerCase();
  const aliased = PROGRAM_SLUG_ALIASES[requested] || requested;
  const found = catalog.programs.find((program) => {
    if (!program) return false;
    const id = String(program.id || "").toLowerCase();
    const programSlug = String(program.slug || "").toLowerCase();
    return id === aliased || programSlug === aliased || id === requested || programSlug === requested;
  }) as ProgramConfig | undefined;
  return found || null;
}

export function isProgramPublic(program: ProgramConfig | null | undefined): boolean {
  if (!program || program.enabled === false) return false;
  return normalizeStatus(program.status) === "active";
}

export function getPublicPrograms(): ProgramConfig[] {
  const catalog = asProgramCatalog(programsJson);
  if (!catalog) return [];
  return (catalog.programs as unknown as ProgramConfig[]).filter((program) => isProgramPublic(program));
}

export function getFeaturedProgramId(): string {
  const catalog = asProgramCatalog(programsJson);
  const featured = featuredProgramFrom(catalog);
  return String((featured && featured.id) || getProgram().id);
}

export function resolveProgram(programId?: string | null): ProgramConfig {
  if (!programId) return getProgram();
  const found = getProgramById(programId) || getProgramBySlug(programId);
  return found || getProgram();
}

export function getPhase(phaseId: string, programId?: string): ProgramPhase | null {
  return resolveProgram(programId).phases.find((phase) => phase.id === phaseId) || null;
}

export function getProgramDay(day: number, programId?: string): ProgramDay | null {
  return resolveProgram(programId).days.find((item) => item.day === day) || null;
}

function lessonForDay(day: ProgramDay, lessons: LessonSummary[], program: ProgramConfig): LessonSummary | null {
  return (
    lessons.find(
      (lesson) => lesson.metadata.program === program.id && lesson.metadata.day === day.day
    ) ||
    lessons.find((lesson) => lesson.slug === day.slug) ||
    null
  );
}

export function getHydratedDays(programId?: string): HydratedDay[] {
  const program = resolveProgram(programId);
  const lessons = getAllLessonSummaries();
  return program.days.map((day) => {
    const lesson = lessonForDay(day, lessons, program);
    return {
      ...day,
      published: Boolean(lesson),
      href: lesson ? `/learn/${lesson.slug}` : null,
      lesson,
    };
  });
}

export function getHydratedPhases(programId?: string): HydratedPhase[] {
  const program = resolveProgram(programId);
  const days = getHydratedDays(program.id);
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

export function getPublishedProgramDays(programId?: string): HydratedDay[] {
  return getHydratedDays(programId).filter((day) => day.published);
}

export function getNextUnpublishedDay(programId?: string): HydratedDay | null {
  return getHydratedDays(programId).find((day) => !day.published) || null;
}

export function getStartDay(programId?: string): HydratedDay | null {
  const published = getPublishedProgramDays(programId);
  return published[0] || null;
}

export function programHref(program: ProgramConfig): string {
  if (program.id === getFeaturedProgramId()) return "/learn";
  return `/programs/${program.slug || program.id}`;
}

export function getLearnerCatalog(programId?: string): LearnerCatalog {
  const program = resolveProgram(programId);
  const phases = getHydratedPhases(program.id);
  const days: LearnerDay[] = [];
  const learnerPhases: LearnerPhase[] = phases.map((phase) => {
    for (const day of phase.days) {
      days.push({
        day: day.day,
        slug: day.slug,
        title: day.title,
        summary: day.summary,
        published: day.published,
        href: day.href,
        phaseId: phase.id,
        phaseName: phase.name,
        phaseNumber: phase.number,
        outcomes: day.lesson?.metadata.outcomes || [],
        estimatedMinutes: day.lesson?.metadata.estimatedMinutes,
      });
    }
    return {
      id: phase.id,
      number: phase.number,
      name: phase.name,
      daysLabel: phase.daysLabel,
      startDay: phase.startDay,
      endDay: phase.endDay,
      summary: phase.summary,
      current: phase.current,
      publishedCount: phase.publishedCount,
      totalDays: phase.days.length,
    };
  });
  const start = getStartDay(program.id);
  return {
    programId: program.id,
    programSlug: program.slug || program.id,
    title: program.title,
    durationLabel: program.durationLabel,
    description: program.description,
    outcome: program.outcome,
    capstone: program.capstone,
    mapTitle: program.mapTitle,
    currentPhaseId: program.currentPhaseId,
    totalDays: program.days.length,
    startHref: start?.href || program.startHref || "/learn/day-01",
    startDay: start?.day ?? null,
    startTitle: start?.title ?? null,
    days,
    phases: learnerPhases,
  };
}

export function getPublishedAdjacent(slug: string, programId?: string): {
  previous: LearnerDay | null;
  next: LearnerDay | null;
  current: LearnerDay | null;
} {
  const catalog = getLearnerCatalog(programId);
  const published = catalog.days.filter((day) => day.published && day.href);
  const index = published.findIndex((day) => day.slug === slug);
  if (index === -1) {
    return { previous: null, next: null, current: null };
  }
  return {
    current: published[index],
    previous: published[index - 1] || null,
    next: published[index + 1] || null,
  };
}

export { PROGRAM_SLUG_ALIASES };

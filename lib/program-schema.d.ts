/**
 * Canonical program validator. Runtime (lib/programs.ts) and
 * scripts/validate.js both use this file. Do not add another schema.
 */
export function collectProgramErrors(raw: unknown): string[];
export function collectSingleProgramErrors(
  program: unknown,
  options?: { requireComplete?: boolean }
): string[];
export function collectProgramErrorsFor(raw: unknown, programId: string): string[];
export function parseProgramConfig<T = unknown>(raw: unknown): T;
export function parseProgramCatalog(raw: unknown): {
  featuredProgramId: string;
  programs: Array<Record<string, unknown>>;
};
export function asProgramCatalog(raw: unknown): {
  featuredProgramId?: string;
  programs: Array<Record<string, unknown>>;
} | null;
export function featuredProgramFrom(catalog: {
  featuredProgramId?: string;
  programs?: Array<Record<string, unknown>>;
} | null): Record<string, unknown> | null;
export const VALID_STATUS: Set<string>;

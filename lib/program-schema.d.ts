/**
 * Canonical program validator. Runtime (lib/programs.ts) and
 * scripts/validate.js both use this file. Do not add another schema.
 */
export function collectProgramErrors(raw: unknown): string[];
export function parseProgramConfig<T = unknown>(raw: T): T;

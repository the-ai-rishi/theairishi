export const CONFIG_REL: string;
export function loadLearnerSurface(rootDir?: string): Record<string, unknown>;
export function collectLearnerSurfaceErrors(
  text: string,
  relPath: string,
  config?: Record<string, unknown>
): string[];
export function duplicateConceptIds(config: unknown): string[];
export function conceptBySourcePath(
  config: unknown,
  sourcePath: string
): Record<string, unknown> | null;
export const AUTHOR_ONLY_DEFAULT: string[];
export const FORBIDDEN_RAW_DEFAULT: string[];

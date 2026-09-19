export interface RhythmKind {
  id: string;
  label: string;
  nav: string;
  kicker: string;
}

export const KINDS: Record<string, RhythmKind>;
export const NAV_ORDER: string[];

export function kindForHeading(text: string): RhythmKind | null;
export function decorateHeadings(html: string): string;
export function navFromHeadings(
  headings: Array<{ id: string; text: string; level: number }>
): Array<{ nav: string; kind: string; href: string; label: string }>;
export function firstPracticeHeading(
  headings: Array<{ id: string; text: string; level: number }>
): { id: string; text: string; level: number } | null;
export function firstContentHeading(
  headings: Array<{ id: string; text: string; level: number }>
): { id: string; text: string; level: number } | null;

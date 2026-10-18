/**
 * Mineral pigments for FORGE-120.
 * Ink is dark enough for strokes and for #efe8dc type on a fill.
 * Wash is the only transparent use. No glow.
 */
export type PhasePigment = {
  pigment: string;
  ink: string;
  wash: string;
};

export const PHASE_PIGMENTS: readonly PhasePigment[] = [
  { pigment: "#8a5a2b", ink: "#5c3b1c", wash: "rgba(138, 90, 43, 0.16)" },
  { pigment: "#2c5d8a", ink: "#1d4468", wash: "rgba(44, 93, 138, 0.14)" },
  { pigment: "#9a4e1c", ink: "#6e3814", wash: "rgba(154, 78, 28, 0.16)" },
  { pigment: "#8a4638", ink: "#653228", wash: "rgba(138, 70, 56, 0.16)" },
  { pigment: "#1c6b62", ink: "#124e48", wash: "rgba(28, 107, 98, 0.14)" },
  { pigment: "#3d6fa3", ink: "#2a527a", wash: "rgba(61, 111, 163, 0.14)" },
  { pigment: "#74602e", ink: "#53441f", wash: "rgba(116, 96, 46, 0.16)" },
  { pigment: "#0e5c62", ink: "#0a4449", wash: "rgba(14, 92, 98, 0.14)" },
  { pigment: "#6b4578", ink: "#4e3158", wash: "rgba(107, 69, 120, 0.14)" },
  { pigment: "#4c4658", ink: "#322e3c", wash: "rgba(76, 70, 88, 0.14)" },
];

/** Roles that are not phases: a boundary, a pass, a citation, writing, a lab. */
export const ROLE = {
  policy: "#6d2c2c",
  pass: "#1e4c31",
  cite: "#0e5c62",
  guide: "#7a3b48",
  lab: "#653228",
} as const;

/** Five fields. Phases share a field so the map is not ten unrelated colors. */
export const FIELDS = [
  { pigment: "#b8884a", ink: "#5c3b1c" },
  { pigment: "#4f7ea8", ink: "#1d4468" },
  { pigment: "#b86a4e", ink: "#6e3814" },
  { pigment: "#3d8f86", ink: "#124e48" },
  { pigment: "#8d6a96", ink: "#4e3158" },
] as const;

const FIELD_OF_PHASE = [0, 1, 2, 2, 3, 1, 2, 3, 4, 4] as const;

export function fieldOf(phaseNumber: number) {
  const slot = Math.min(FIELD_OF_PHASE.length, Math.max(1, phaseNumber)) - 1;
  return FIELDS[FIELD_OF_PHASE[slot]];
}

export function phaseColor(number: number): PhasePigment {
  return PHASE_PIGMENTS[Math.min(PHASE_PIGMENTS.length, Math.max(1, number)) - 1];
}


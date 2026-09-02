export type TopicToneName = "gold" | "circuit" | "lotus" | "signal";

export interface TopicTone {
  accent: string;
  accentBright: string;
  wash: string;
  name: TopicToneName;
}

const GOLD: TopicTone = {
  accent: "#d4b46a",
  accentBright: "#f0d090",
  wash: "rgba(212,180,106,0.10)",
  name: "gold",
};

const CIRCUIT: TopicTone = {
  accent: "#8b7cff",
  accentBright: "#6ea8ff",
  wash: "rgba(139,124,255,0.10)",
  name: "circuit",
};

const LOTUS: TopicTone = {
  accent: "#c084fc",
  accentBright: "#d4b46a",
  wash: "rgba(192,132,252,0.10)",
  name: "lotus",
};

const SIGNAL: TopicTone = {
  accent: "#67e8f9",
  accentBright: "#6ea8ff",
  wash: "rgba(103,232,249,0.08)",
  name: "signal",
};

const COLOR_MAP: Record<string, TopicTone> = {
  purple: GOLD,
  amber: GOLD,
  yellow: GOLD,
  gold: GOLD,
  emerald: CIRCUIT,
  green: CIRCUIT,
  blue: CIRCUIT,
  indigo: CIRCUIT,
  violet: CIRCUIT,
  pink: LOTUS,
  lotus: LOTUS,
  teal: SIGNAL,
  cyan: SIGNAL,
};

/**
 * Map a topic.color string onto the Rishi Field palette.
 * With 1–2 topics, enforce gold/circuit duality like the mark.
 */
export function topicTone(color?: string, index = 0, total = 1): TopicTone {
  const mapped = COLOR_MAP[String(color || "").toLowerCase()];
  if (total <= 2) {
    if (index === 0) return mapped && mapped.name !== "circuit" ? mapped : GOLD;
    return mapped && mapped.name !== "gold" ? mapped : CIRCUIT;
  }
  if (mapped) return mapped;
  return index % 2 === 0 ? GOLD : CIRCUIT;
}

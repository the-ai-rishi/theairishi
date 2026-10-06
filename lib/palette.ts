export type TopicToneName = "gold" | "circuit" | "lotus" | "signal";

export interface TopicTone {
  accent: string;
  accentBright: string;
  wash: string;
  name: TopicToneName;
}

const GOLD: TopicTone = {
  accent: "#5c3b1c",
  accentBright: "#8a5a2b",
  wash: "rgba(138, 90, 43, 0.12)",
  name: "gold",
};

const CIRCUIT: TopicTone = {
  accent: "#1d4468",
  accentBright: "#2c5d8a",
  wash: "rgba(44, 93, 138, 0.12)",
  name: "circuit",
};

const LOTUS: TopicTone = {
  accent: "#4e3158",
  accentBright: "#6b4578",
  wash: "rgba(107, 69, 120, 0.12)",
  name: "lotus",
};

const SIGNAL: TopicTone = {
  accent: "#0a4449",
  accentBright: "#0e5c62",
  wash: "rgba(14, 92, 98, 0.12)",
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

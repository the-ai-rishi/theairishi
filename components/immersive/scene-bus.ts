/** Mutable scene inputs. Written by DOM listeners, read inside the WebGL frame loop. */
export const sceneBus = {
  scroll: 0,
  px: 0,
  py: 0,
  boot: 0,
  /** Completed days / total. 0 until the progress store hydrates. */
  mastery: 0,
  /** Discrete world index. CSS and the header read this. The frame loop reads `scroll`. */
  world: 0,
  visible: true,
  mobile: false,
};

export const WORLD_IDS = [
  "void",
  "awaken",
  "wisdom",
  "foundation",
  "engineering",
  "intelligence",
  "signal",
] as const;

export const WORLD_LABELS = [
  "Void",
  "Awaken",
  "Wisdom",
  "Foundation",
  "Engineering",
  "Intelligence",
  "Signal",
] as const;

export function worldIndex(progress: number, boot: number) {
  if (boot < 0.25 && progress < 0.02) return 0;
  if (progress < 0.08) return 1;
  if (progress < 0.22) return 2;
  if (progress < 0.4) return 3;
  if (progress < 0.58) return 4;
  if (progress < 0.78) return 5;
  return 6;
}

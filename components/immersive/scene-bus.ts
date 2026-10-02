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
  "foundations",
  "azure",
  "delivery",
  "application",
  "kubernetes",
  "aks",
  "infrastructure",
  "reliability",
  "retrieval",
  "defence",
] as const;

export const WORLD_LABELS = [
  "Foundations",
  "Azure networking and identity",
  "CI and delivery",
  "Terraform and application",
  "Kubernetes",
  "AKS",
  "Infrastructure delivery",
  "Reliability",
  "RAG and controlled tool use",
  "Design and defence",
] as const;

export const WORLD_RANGES = [
  "1–12",
  "13–18",
  "19–26",
  "27–36",
  "37–60",
  "61–74",
  "75–88",
  "89–96",
  "97–105",
  "106–120",
] as const;

export function worldIndex(progress: number) {
  const clamped = Math.min(0.999, Math.max(0, progress));
  return Math.min(WORLD_IDS.length - 1, Math.floor(clamped * WORLD_IDS.length));
}

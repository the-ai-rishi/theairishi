"use client";

import { useCallback, useMemo, useState, useSyncExternalStore } from "react";

const STORAGE_KEY = "theairishi_starting_assessment";

const SKILLS = [
  { id: "linux-shell", label: "Linux / Shell" },
  { id: "git", label: "Git" },
  { id: "http", label: "HTTP" },
  { id: "networking", label: "Networking" },
] as const;

type SkillId = (typeof SKILLS)[number]["id"];

type Assessment = {
  scores: Record<SkillId, number | null>;
  noAiRule: string;
  operatedVsAuthored: string;
  savedAt: string | null;
};

const EMPTY: Assessment = {
  scores: {
    "linux-shell": null,
    git: null,
    http: null,
    networking: null,
  },
  noAiRule: "",
  operatedVsAuthored: "",
  savedAt: null,
};

function readStored(): Assessment {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<Assessment>;
    return {
      scores: { ...EMPTY.scores, ...(parsed.scores || {}) },
      noAiRule: typeof parsed.noAiRule === "string" ? parsed.noAiRule : "",
      operatedVsAuthored:
        typeof parsed.operatedVsAuthored === "string" ? parsed.operatedVsAuthored : "",
      savedAt: typeof parsed.savedAt === "string" ? parsed.savedAt : null,
    };
  } catch {
    return EMPTY;
  }
}

const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY && event.key !== null) return;
    cached = readStored();
    emit();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", onStorage);
  };
}

function emit() {
  listeners.forEach((fn) => fn());
}

function writeStored(next: Assessment): boolean {
  const stamped = { ...next, savedAt: new Date().toISOString() };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stamped));
    cached = stamped;
    emit();
    return true;
  } catch {
    // Keep edits in memory but never claim they persisted to the device.
    cached = { ...next, savedAt: null };
    emit();
    return false;
  }
}

let cached: Assessment | null = null;

function getSnapshot(): Assessment {
  if (cached) return cached;
  cached = readStored();
  return cached;
}

function getServerSnapshot(): Assessment {
  return EMPTY;
}

function asMarkdown(data: Assessment): string {
  const lines = [
    "# My starting assessment",
    "",
    "0 = I've barely encountered it",
    "5 = I can confidently explain and troubleshoot it",
    "",
  ];
  for (const skill of SKILLS) {
    const score = data.scores[skill.id];
    lines.push(`- ${skill.label}: ${score == null ? "__" : score} / 5`);
  }
  lines.push("", "## No-AI rule", "", data.noAiRule.trim() || "(write this in your own words)", "");
  lines.push(
    "## Operated vs authored",
    "",
    data.operatedVsAuthored.trim() || "(what you have run vs what you have written)",
    ""
  );
  return lines.join("\n");
}

export default function StartingAssessment() {
  const data = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const [saveUnavailable, setSaveUnavailable] = useState(false);

  const persist = useCallback((next: Assessment) => {
    setSaveUnavailable(!writeStored(next));
  }, []);

  const template = useMemo(() => asMarkdown(data), [data]);

  function setScore(id: SkillId, value: number) {
    persist({
      ...data,
      scores: { ...data.scores, [id]: value },
    });
  }

  async function copyTemplate() {
    setCopyFailed(false);
    try {
      await navigator.clipboard.writeText(template);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
      setCopyFailed(true);
    }
  }

  function downloadTemplate() {
    const blob = new Blob([template], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "starting-assessment.md";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  const ratedCount = SKILLS.filter((skill) => data.scores[skill.id] != null).length;

  return (
    <section className="baseline-board">
      <p className="kicker text-gold/80">Step 1</p>
      <h2 className="mt-3 font-serif text-3xl text-cream sm:text-4xl">Know your starting point</h2>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-cream/55">
        Honest scores. This stays in your browser on this device. It is not uploaded.
        It is your baseline, not a published author file.
      </p>
      <p className="mt-2 font-mono text-[12px] leading-relaxed text-cream/40">
        0 = barely encountered it. 5 = I can explain and troubleshoot it.
        Chat is not a 5.
      </p>

      <div className="baseline-progress mt-5 font-mono text-[12px]" aria-live="polite">
        {ratedCount} of {SKILLS.length} skills rated
      </div>
      <div className="mt-6 space-y-1">
        {SKILLS.map((skill) => (
          <div key={skill.id} className="baseline-skill-row sm:flex sm:items-center sm:justify-between sm:gap-6">
            <p className="font-mono text-[13px] tracking-[0.08em] text-cream/80">{skill.label}</p>
            <div className="mt-2 flex flex-wrap gap-1.5 sm:mt-0" role="group" aria-label={`${skill.label} score`}>
              {[0, 1, 2, 3, 4, 5].map((n) => {
                const selected = data.scores[skill.id] === n;
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setScore(skill.id, n)}
                    className={`baseline-score-button inline-flex h-11 w-11 items-center justify-center font-mono text-[13px] ${
                      selected
                        ? "bg-gold text-ink"
                        : "border border-hairline text-cream/70 hover:border-gold/50 hover:text-cream"
                    }`}
                    aria-pressed={selected}
                  >
                    {n}
                  </button>
                );
              })}
              <span className="self-center font-mono text-[12px] text-cream/35">/ 5</span>
            </div>
          </div>
        ))}
      </div>

      <label className="mt-8 block">
        <span className="font-mono text-[12px] tracking-[0.14em] uppercase text-cream/45">
          No-AI rule (your words)
        </span>
        <textarea
          value={data.noAiRule}
          onChange={(event) => persist({ ...data, noAiRule: event.target.value })}
          rows={4}
          className="baseline-input mt-2 w-full border border-hairline bg-ink px-3 py-3 text-[15px] leading-relaxed text-cream placeholder:text-cream/25 focus:border-gold/50 focus:outline-none"
          placeholder="On write days, my first version is mine. AI may review later. AI does not author the first file."
        />
      </label>

      <label className="mt-6 block">
        <span className="font-mono text-[12px] tracking-[0.14em] uppercase text-cream/45">
          Operated vs authored
        </span>
        <textarea
          value={data.operatedVsAuthored}
          onChange={(event) => persist({ ...data, operatedVsAuthored: event.target.value })}
          rows={3}
          className="baseline-input mt-2 w-full border border-hairline bg-ink px-3 py-3 text-[15px] leading-relaxed text-cream placeholder:text-cream/25 focus:border-gold/50 focus:outline-none"
          placeholder="What have you run or approved, versus a file you wrote from a blank buffer?"
        />
      </label>

      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" onClick={() => persist(data)} className="btn-primary">
          Save my baseline
        </button>
        <button
          type="button"
          onClick={copyTemplate}
          className="inline-flex min-h-11 items-center border border-hairline px-4 font-mono text-[12px] tracking-[0.12em] text-cream/70 hover:text-gold"
        >
          {copied ? "Copied" : copyFailed ? "Copy unavailable" : "Copy baseline template"}
        </button>
        <button
          type="button"
          onClick={downloadTemplate}
          className="inline-flex min-h-11 items-center border border-hairline px-4 font-mono text-[12px] tracking-[0.12em] text-cream/70 hover:text-gold"
        >
          Download baseline template
        </button>
      </div>
      <p role="status" aria-live="polite" className="mt-4 font-mono text-[12px] leading-relaxed text-cream/55">
        {saveUnavailable
          ? "Browser storage is unavailable. Your edits are only in this tab; copy or download your baseline before leaving."
          : data.savedAt
            ? "Saved on this device. Your baseline stays in this browser; GitHub is not required."
            : "Nothing saved yet. Your baseline stays on this device, not on a server."}
        {copyFailed ? " Clipboard access was denied; use Download baseline template." : ""}
      </p>
    </section>
  );
}

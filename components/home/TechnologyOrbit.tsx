"use client";

import Link from "next/link";
import type { TopicConfig } from "@/lib/topics";
import { topicTone } from "@/lib/palette";

function nodeAngle(index: number, total: number): number {
  if (total <= 1) return -90;
  if (total === 2) return index === 0 ? 180 : 0;
  return -90 + (360 / total) * index;
}

export default function TechnologyOrbit({
  topics,
  brandName,
}: {
  topics: TopicConfig[];
  brandName?: string;
}) {
  const displayNodes = topics.slice(0, 6);
  const count = displayNodes.length;

  return (
    <div
      role="region"
      aria-label="Topics currently available"
      className="relative mx-auto flex aspect-square w-full max-w-[420px] items-center justify-center select-none sm:max-w-[480px] lg:max-w-[520px]"
    >
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 600 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="rishi-orbit-gold" x1="0%" y1="50%" x2="50%" y2="50%">
            <stop offset="0%" stopColor="#d4b46a" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#d4b46a" stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id="rishi-orbit-circuit" x1="50%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#8b7cff" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#6ea8ff" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {/* Duality split — gold west, circuit east */}
        <path
          d="M300 48 A252 252 0 0 0 300 552"
          stroke="url(#rishi-orbit-gold)"
          strokeWidth="1.25"
        />
        <path
          d="M300 48 A252 252 0 0 1 300 552"
          stroke="url(#rishi-orbit-circuit)"
          strokeWidth="1.25"
        />

        <circle
          cx="300"
          cy="300"
          r="252"
          stroke="rgba(244,239,228,0.08)"
          strokeWidth="1"
          strokeDasharray="2 10"
          className="origin-center animate-spin-slow motion-reduce:animate-none"
        />
        <circle
          cx="300"
          cy="300"
          r="186"
          stroke="rgba(139,124,255,0.28)"
          strokeWidth="1"
          strokeDasharray="4 14"
          className="origin-center animate-spin-reverse motion-reduce:animate-none"
        />
        <circle
          cx="300"
          cy="300"
          r="118"
          stroke="rgba(212,180,106,0.32)"
          strokeWidth="1"
        />

        {/* Axis like the mark */}
        <line x1="300" y1="86" x2="300" y2="514" stroke="#d4b46a" strokeOpacity="0.35" strokeWidth="1" />
        <circle cx="300" cy="300" r="3.5" fill="#f3eee4" />
      </svg>

      <div className="relative z-20 flex h-28 w-28 flex-col items-center justify-center rounded-full border border-hairline bg-ink/90 sm:h-32 sm:w-32">
        <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-cream/35">
          Field
        </span>
        <span className="mt-1 font-serif text-lg tracking-[0.04em] text-cream sm:text-xl">
          {brandName || ""}
        </span>
        <span className="mt-2 h-px w-10 bg-gradient-to-r from-gold via-cream/40 to-circuit" />
      </div>

      {displayNodes.map((topic, idx) => {
        const angle = nodeAngle(idx, count);
        const rad = (angle * Math.PI) / 180;
        const radius = 42;
        const x = 50 + radius * Math.cos(rad);
        const y = 50 + radius * Math.sin(rad);
        const tone = topicTone(topic.color, idx, count);
        return (
          <Link
            key={topic.id}
            href={`/topics/${topic.slug}`}
            aria-label={`Explore topic: ${topic.name}`}
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: "translate(-50%, -50%)",
              borderColor: `${tone.accent}55`,
            }}
            className="absolute z-30 max-w-[9.5rem] border bg-ink/85 px-3 py-1.5 text-center backdrop-blur-sm transition hover:border-gold/50 focus:outline-none focus-visible:ring-1 focus-visible:ring-gold"
          >
            <span
              className="mb-1 inline-block h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: tone.accent }}
            />
            <span className="block font-mono text-[11px] tracking-[0.12em] text-cream/90">
              {topic.shortName || topic.badge}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import type { TopicConfig } from "@/lib/topics";

export default function TechnologyOrbit({ topics }: { topics: TopicConfig[] }) {

  // Position nodes radially around the central orbital system
  const nodePositions = [
    { top: "8%", left: "50%", transform: "translate(-50%, 0)" },
    { top: "24%", right: "2%", transform: "translate(0, 0)" },
    { bottom: "24%", right: "2%", transform: "translate(0, 0)" },
    { bottom: "8%", left: "50%", transform: "translate(-50%, 0)" },
    { bottom: "24%", left: "2%", transform: "translate(0, 0)" },
    { top: "24%", left: "2%", transform: "translate(0, 0)" },
  ];

  // Pick primary topics for the orbital nodes
  const displayNodes = topics.slice(0, 6);

  return (
    <div
      role="region"
      aria-label="Interactive Technology Orbit Ecosystem"
      className="relative flex items-center justify-center w-full max-w-[550px] lg:max-w-[620px] aspect-square mx-auto select-none pointer-events-auto"
    >
      {/* 1. Atmospheric Multi-Layer Radial Glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-violet-600/25 via-indigo-500/15 to-amber-500/20 blur-[100px] motion-reduce:blur-[50px] animate-pulse" />

      {/* 2. Concentric Code-Generated SVG Orbital Rings */}
      <svg
        className="absolute inset-0 h-full w-full opacity-40 text-violet-400/30 pointer-events-none"
        viewBox="0 0 600 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Ring */}
        <circle
          cx="300"
          cy="300"
          r="260"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="8 16"
          className="animate-spin-slow motion-reduce:animate-none origin-center"
        />

        {/* Middle Ring */}
        <circle
          cx="300"
          cy="300"
          r="190"
          stroke="url(#orbit-grad-mid)"
          strokeWidth="1.5"
          strokeDasharray="4 12"
          className="animate-spin-reverse motion-reduce:animate-none origin-center"
        />

        {/* Inner Ring */}
        <circle
          cx="300"
          cy="300"
          r="120"
          stroke="url(#orbit-grad-inner)"
          strokeWidth="1"
          strokeDasharray="6 14"
          className="animate-pulse motion-reduce:animate-none"
        />

        <defs>
          <linearGradient
            id="orbit-grad-mid"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#c084fc" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#818cf8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#fef08a" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient
            id="orbit-grad-inner"
            x1="0%"
            y1="100%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.6" />
          </linearGradient>
        </defs>
      </svg>

      {/* 3. Central Futuristic Emblem Node ("AI RISHI") */}
      <div className="relative z-20 flex flex-col items-center justify-center h-32 w-32 sm:h-40 sm:w-40 rounded-full border border-white/20 bg-gradient-to-b from-white/10 via-black/85 to-black/95 shadow-[0_0_50px_rgba(124,58,237,0.35)] backdrop-blur-xl animate-float motion-reduce:animate-none">
        <Sparkles className="h-6 w-6 text-amber-300 animate-pulse mb-1" />
        <span className="text-xs font-mono uppercase tracking-[0.25em] text-white/40">
          Platform
        </span>
        <span className="text-base sm:text-lg font-semibold tracking-wider text-white">
          AI RISHI
        </span>
        <span className="h-1 w-8 rounded-full bg-gradient-to-r from-violet-400 to-amber-300 mt-1.5" />
      </div>

      {/* 4. Interactive Floating Topic Nodes */}
      {displayNodes.map((topic, idx) => {
        const pos = nodePositions[idx % nodePositions.length];
        return (
          <Link
            key={topic.id}
            href={`/topics/${topic.slug}`}
            aria-label={`Explore topic: ${topic.name}`}
            style={{
              top: pos.top,
              bottom: pos.bottom,
              left: pos.left,
              right: pos.right,
              transform: pos.transform,
            }}
            className="absolute z-30 group flex items-center gap-2 rounded-full border border-white/15 bg-black/75 px-3.5 py-1.5 text-xs text-white/90 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-violet-400/50 hover:bg-white/[0.08] hover:shadow-violet-500/20 focus:outline-none focus:ring-2 focus:ring-violet-400"
          >
            <span className="h-2 w-2 rounded-full bg-violet-400 group-hover:bg-amber-300 transition-colors animate-pulse" />
            <span className="font-medium text-[11px] sm:text-xs text-white/90 group-hover:text-white font-mono">
              {topic.badge}
            </span>
          </Link>
        );
      })}

      {/* 5. Subtle Floating Orbit Particle Accents */}
      <div className="absolute top-12 left-16 h-2 w-2 rounded-full bg-violet-400/80 shadow-[0_0_10px_#c084fc] animate-ping motion-reduce:animate-none" />
      <div className="absolute bottom-16 right-16 h-2 w-2 rounded-full bg-amber-300/80 shadow-[0_0_10px_#fef08a] animate-pulse motion-reduce:animate-none" />
      <div className="absolute bottom-20 left-20 h-1.5 w-1.5 rounded-full bg-blue-400/80 shadow-[0_0_8px_#60a5fa] animate-ping motion-reduce:animate-none" />
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { phaseProgress, resolveContinue, type LearnerCatalog, type PhaseProgress } from "@/lib/continue-learning";
import { formatPhaseLabel } from "@/lib/labels";
import { useLessonProgress } from "@/components/learning/useLessonProgress";

function DayDots({
  days,
  currentSlug,
  isCompleted,
  hasHydrated,
}: {
  days: LearnerCatalog["days"];
  currentSlug: string | null;
  isCompleted: (slug: string) => boolean;
  hasHydrated: boolean;
}) {
  return (
    <div className="mt-2.5 flex max-w-full flex-wrap gap-1.5" role="list">
      {days.map((day) => {
        const done = hasHydrated && isCompleted(day.slug);
        const current = currentSlug === day.slug;
        const cls = done
          ? "day-dot-done"
          : current
            ? "day-dot-now"
            : day.published
              ? "day-dot-live"
              : "day-dot-plan";
        const label = `Day ${day.day} - ${day.title}${done ? ", complete" : day.published ? ", available" : ", planned"}`;
        const inner = <span className={`day-dot ${cls}`} aria-hidden="true" />;
        return (
          <span key={day.slug} role="listitem">
            {day.published && day.href ? (
              <Link
                href={day.href}
                className="inline-flex min-h-8 min-w-8 items-center justify-center"
                title={label}
                aria-label={label}
                aria-current={current ? "true" : undefined}
              >
                {inner}
              </Link>
            ) : (
              <span className="inline-flex min-h-8 min-w-8 items-center justify-center" title={label} aria-label={label}>
                {inner}
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}

function TitleList({
  days,
  currentSlug,
  isCompleted,
  hasHydrated,
}: {
  days: LearnerCatalog["days"];
  currentSlug: string | null;
  isCompleted: (slug: string) => boolean;
  hasHydrated: boolean;
}) {
  return (
    <ol className="mt-3 divide-y divide-hairline border-y border-hairline">
      {days.map((day) => {
        const done = hasHydrated && isCompleted(day.slug);
        const current = currentSlug === day.slug;
        const row = (
          <span className="grid gap-1 py-3 sm:grid-cols-[4.5rem_1fr_auto] sm:items-baseline">
            <span className="font-mono text-[12px] text-cream/45">
              Day {String(day.day).padStart(2, "0")}
            </span>
            <span>
              <span className={`font-serif text-lg ${day.published ? "text-cream" : "text-cream/50"}`}>
                {day.title}
              </span>
              <span className="mt-0.5 block text-[13px] leading-relaxed text-cream/40">{day.summary}</span>
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-cream/40">
              {done ? "Complete" : current ? "Now" : day.published ? "Available" : "Planned"}
            </span>
          </span>
        );
        return (
          <li key={day.slug}>
            {day.published && day.href ? (
              <Link
                href={day.href}
                className="block hover:bg-cream/[0.02]"
                aria-current={current ? "true" : undefined}
              >
                {row}
              </Link>
            ) : (
              <div>
                {row}
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}

function layoutPoint(index: number, count: number) {
  const angle = -Math.PI / 2 + (index / Math.max(1, count)) * Math.PI * 2;
  return {
    x: Number((50 + Math.cos(angle) * 38).toFixed(2)),
    y: Number((50 + Math.sin(angle) * 36).toFixed(2)),
  };
}

function dayPoint(index: number, count: number) {
  const angle = -Math.PI / 2 + ((index + 0.5) / Math.max(1, count)) * Math.PI * 2;
  return {
    x: Number((400 + Math.cos(angle) * 248).toFixed(2)),
    y: Number((210 + Math.sin(angle) * 128).toFixed(2)),
  };
}

function Constellation({
  phases,
  days,
  activeId,
  currentSlug,
  isCompleted,
  hasHydrated,
  onSelect,
}: {
  phases: PhaseProgress[];
  days: LearnerCatalog["days"];
  activeId?: string;
  currentSlug: string | null;
  isCompleted: (slug: string) => boolean;
  hasHydrated: boolean;
  onSelect: (id: string) => void;
}) {
  const path = phases
    .map((phase, index) => {
      const point = layoutPoint(index, phases.length);
      const x = (point.x / 100) * 800;
      const y = (point.y / 100) * 420;
      return `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <div className="constellation">
      <svg className="constellation-svg" viewBox="0 0 800 420" aria-hidden="true">
        <ellipse cx="400" cy="210" rx="304" ry="151" fill="none" stroke="rgba(212,180,106,0.22)" />
        <ellipse cx="400" cy="210" rx="220" ry="104" fill="none" stroke="rgba(139,124,255,0.2)" transform="rotate(-16 400 210)" />
        <ellipse cx="400" cy="210" rx="248" ry="128" fill="none" stroke="rgba(103,232,249,0.16)" />
        {days.map((day, index) => {
          const point = dayPoint(index, days.length);
          const done = hasHydrated && isCompleted(day.slug);
          const now = currentSlug === day.slug;
          return (
            <circle
              key={day.slug}
              className={now ? "constellation-day is-now" : "constellation-day"}
              cx={point.x}
              cy={point.y}
              r={now ? 3.4 : done ? 2.3 : 1.45}
              fill={done ? "#f0d090" : now ? "#f3eee4" : day.published ? "rgba(212,180,106,0.72)" : "rgba(243,238,228,0.22)"}
            />
          );
        })}
        <path className="constellation-path" pathLength={1} d={`${path} Z`} />
      </svg>
      <div className="constellation-core">
        {phases.filter((phase) => phase.id === activeId).map((phase) => (
          <div key={phase.id}>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold/80">
              Phase {String(phase.number).padStart(2, "0")}
            </p>
            <p className="mt-1 font-serif text-xl text-cream sm:text-2xl">{phase.name}</p>
            <p className="mt-2 hidden text-[13px] leading-relaxed text-cream/50 sm:block">{phase.summary}</p>
            <p className="mt-2 font-mono text-[11px] text-cream/40">
              {phase.completedCount}/{phase.totalDays} · days {phase.daysLabel}
            </p>
          </div>
        ))}
      </div>
      {phases.map((phase, index) => {
        const point = layoutPoint(index, phases.length);
        const active = phase.id === activeId;
        const tone =
          phase.totalDays > 0 && phase.completedCount >= phase.totalDays
            ? "is-done"
            : phase.current
              ? "is-now"
              : phase.publishedCount === 0
                ? "is-plan"
                : "is-live";
        const label = `${formatPhaseLabel(phase.number)} ${phase.name}, ${phase.completedCount} of ${phase.totalDays} complete`;
        return (
          <button
            key={phase.id}
            type="button"
            className={`constellation-node ${tone} ${active ? "is-focus" : ""}`}
            style={{ left: `${point.x}%`, top: `${point.y}%` }}
            aria-pressed={active}
            aria-label={label}
            data-cursor="node"
            onClick={() => onSelect(phase.id)}
          >
            <span>{String(phase.number).padStart(2, "0")}</span>
          </button>
        );
      })}
    </div>
  );
}

function PhaseRing({ percent, active }: { percent: number; active: boolean }) {
  const radius = 15;
  const circumference = 2 * Math.PI * radius;
  const dash = (Math.max(0, Math.min(100, percent)) / 100) * circumference;
  return (
    <svg viewBox="0 0 40 40" className={`progress-ring ${active ? "text-gold" : "text-cream/45"}`} aria-hidden="true">
      <circle cx="20" cy="20" r={radius} fill="none" stroke="rgba(243,238,228,0.12)" strokeWidth="1.5" />
      <circle
        cx="20"
        cy="20"
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circumference}`}
        transform="rotate(-90 20 20)"
      />
    </svg>
  );
}

export default function JourneyMap({
  catalog,
  showTitles = false,
  compact = false,
}: {
  catalog: LearnerCatalog;
  showTitles?: boolean;
  compact?: boolean;
}) {
  const { state, hasHydrated, isCompleted } = useLessonProgress();
  const target = resolveContinue(hasHydrated ? state : null, catalog);
  const phases = phaseProgress(catalog, hasHydrated ? state : null);
  const [openId, setOpenId] = useState<string | null>(null);
  const implied =
    phases.find((phase) => target.phaseNumber === phase.number || phase.id === catalog.currentPhaseId) ||
    phases[0];
  const active = phases.find((phase) => phase.id === openId) || implied;
  const activeDays = catalog.days.filter((day) => day.phaseId === active?.id);

  const selectPhase = (id: string) => {
    setOpenId(id);
    if (!showTitles) return;
    const node = document.getElementById(id);
    if (node) node.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const map = (
    <div className="constellation-block">
      <Constellation
        phases={phases}
        days={catalog.days}
        activeId={active?.id}
        currentSlug={target.slug}
        isCompleted={isCompleted}
        hasHydrated={hasHydrated}
        onSelect={selectPhase}
      />
      {active ? (
        <div className="constellation-detail">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-gold/80">
            {active.id === implied?.id ? "You are here" : "Phase focus"} · {active.name}
          </p>
          <DayDots
            days={activeDays}
            currentSlug={target.slug}
            isCompleted={isCompleted}
            hasHydrated={hasHydrated}
          />
        </div>
      ) : null}
    </div>
  );

  if (compact && !showTitles) return map;

  return (
    <div>
      {map}
      <ol className="knowledge-map mt-8" aria-label="120-day path by phase">
      {phases.map((phase) => {
        const days = catalog.days.filter((day) => day.phaseId === phase.id);
        const isCurrentPhase = target.phaseNumber === phase.number || phase.id === catalog.currentPhaseId;
        const fill = phase.totalDays > 0 ? Math.round((phase.completedCount / phase.totalDays) * 100) : 0;
        const station = (
          <div className="min-w-0 pt-1">
            <div className="spine-meta">
              <p className={`font-mono text-[11px] uppercase tracking-[0.16em] ${isCurrentPhase ? "text-gold" : "text-cream/45"}`}>
                {formatPhaseLabel(phase.number).replace(/Phase (\d+)/, (_, n) => `Phase ${String(n).padStart(2, "0")}`)}
                <span className={`ml-2 tracking-[0.06em] normal-case ${isCurrentPhase ? "text-cream" : "text-cream/55"}`}>
                  {phase.name}
                </span>
              </p>
              <p className="font-mono text-[11px] tabular-nums text-cream/35">
                Days {phase.daysLabel}
                <span className="ml-2">
                  {phase.completedCount}/{phase.totalDays}
                </span>
                {isCurrentPhase ? <span className="ml-2 text-gold/80">you are here</span> : null}
              </p>
            </div>
          </div>
        );
        const orb = (
          <div className="station-orb">
            <PhaseRing percent={isCurrentPhase && fill === 0 ? 8 : fill} active={isCurrentPhase || fill > 0} />
          </div>
        );

        const dots = (
          <div className="node-river">
            <DayDots
              days={days}
              currentSlug={target.slug}
              isCompleted={isCompleted}
              hasHydrated={hasHydrated}
            />
          </div>
        );

        const body = showTitles ? (
          isCurrentPhase ? (
            dots
          ) : (
            <TitleList
              days={days}
              currentSlug={target.slug}
              isCompleted={isCompleted}
              hasHydrated={hasHydrated}
            />
          )
        ) : isCurrentPhase || !compact ? (
          dots
        ) : null;

        if (compact && !isCurrentPhase) {
          return (
            <li key={phase.id} className="station">
              {orb}
              {station}
            </li>
          );
        }

        if (showTitles && !isCurrentPhase) {
          return (
            <li key={phase.id} id={phase.id} className="scroll-mt-24">
              <details>
                <summary className="station list-none [&::-webkit-details-marker]:hidden">
                  {orb}
                  {station}
                </summary>
                <div className="station-fold">{body}</div>
              </details>
            </li>
          );
        }

        return (
          <li key={phase.id} id={showTitles ? phase.id : undefined} className={`station ${isCurrentPhase ? "station-now" : ""}`}>
            {orb}
            <div className="min-w-0">
              {station}
              {body}
            </div>
          </li>
        );
      })}
    </ol>
    </div>
  );
}

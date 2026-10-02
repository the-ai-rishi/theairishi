"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { resolveContinue, type LearnerCatalog, type LearnerPhase } from "@/lib/continue-learning";
import { formatDayLabel } from "@/lib/labels";
import { useLessonProgress } from "./useLessonProgress";
import { phaseColor } from "@/lib/phase-color";

function Chapter({
  phase,
  catalog,
  targetSlug,
  hasHydrated,
  isCompleted,
}: {
  phase: LearnerPhase;
  catalog: LearnerCatalog;
  targetSlug: string | null;
  hasHydrated: boolean;
  isCompleted: (slug: string) => boolean;
}) {
  const days = catalog.days.filter((day) => day.phaseId === phase.id);
  const retrieval = phase.number === 9;
  const tone = phaseColor(phase.number);
  return (
    <section
      className="path-chapter"
      id={phase.id}
      data-mode={retrieval ? "retrieval" : undefined}
      aria-labelledby={`${phase.id}-title`}
      style={{ ["--phase" as string]: tone.ink, ["--phase-wash" as string]: tone.wash }}
    >
      <p className="field-kicker">
        Phase {String(phase.number).padStart(2, "0")}
        <span> {phase.daysLabel}</span>
      </p>
      <h2 id={`${phase.id}-title`} className="path-stage-title">
        {phase.name}
      </h2>
      {phase.summary ? <p className="path-meta">{phase.summary}</p> : null}
      {retrieval ? (
        <p className="path-meta">
          <Link href="/#control">Open the instruments</Link>
        </p>
      ) : null}
      <ol className="path-nodes">
        {days.map((day) => {
          const done = hasHydrated && isCompleted(day.slug);
          const current = targetSlug === day.slug;
          const state = done ? "Complete" : current ? "Now" : day.published ? "Open" : "Planned";
          const inner = (
            <>
              <span className="node-day">{formatDayLabel(day.day)}</span>
              <span className="node-title">{day.title}</span>
              <span className="node-state">{state}</span>
            </>
          );
          return (
            <li key={day.slug}>
              {day.published && day.href ? (
                <Link href={day.href} className={done ? "is-done" : ""} aria-current={current ? "true" : undefined}>
                  {inner}
                </Link>
              ) : (
                <span className="node">{inner}</span>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export default function ProgramCommandCenter({ catalog }: { catalog: LearnerCatalog }) {
  const { state, hasHydrated, isCompleted } = useLessonProgress();
  const target = resolveContinue(hasHydrated ? state : null, catalog);
  const current =
    catalog.phases.find((phase) => phase.number === target.phaseNumber) || catalog.phases[0];
  const [phaseId, setPhaseId] = useState(current?.id || catalog.phases[0]?.id || "");

  useEffect(() => {
    const fromHash = () => {
      const id = window.location.hash.replace("#", "");
      if (id && catalog.phases.some((phase) => phase.id === id)) setPhaseId(id);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [catalog.phases]);

  function choosePhase(id: string) {
    setPhaseId(id);
    const next = `${window.location.pathname}${window.location.search}#${id}`;
    window.history.replaceState(null, "", next);
  }

  return (
    <div className="path-board">
      <nav className="path-index" aria-label="Phases">
        {catalog.phases.map((phase) => (
          <button
            key={phase.id}
            type="button"
            className={phase.id === phaseId ? "is-on" : ""}
            aria-current={phase.id === phaseId ? "true" : undefined}
            style={{ ["--swatch" as string]: phaseColor(phase.number).ink }}
            onClick={() => choosePhase(phase.id)}
          >
            <i className="phase-swatch" aria-hidden="true" />
            <span>{String(phase.number).padStart(2, "0")}</span>
            {phase.name}
          </button>
        ))}
      </nav>
      <div className="path-reel">
        <p className="path-now field-kicker">
          {catalog.title}
          <span>
            {" "}
            {target.completedCount} / {target.totalDays} claimed on this device
          </span>
        </p>
        {catalog.phases.map((phase) => (
          <div key={phase.id} className={phase.id === phaseId ? "path-chapter is-on" : "path-chapter"}>
            <Chapter
              phase={phase}
              catalog={catalog}
              targetSlug={target.slug}
              hasHydrated={hasHydrated}
              isCompleted={isCompleted}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

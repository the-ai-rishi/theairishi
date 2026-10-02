"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { WORLD_IDS } from "./scene-bus";
import type { LearnerCatalog } from "@/lib/continue-learning";

function focusPhase(index: number) {
  const track = document.querySelector<HTMLElement>(".universe-track");
  if (!track) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const total = Math.max(1, track.offsetHeight - window.innerHeight);
  const current = Math.min(total, Math.max(0, -track.getBoundingClientRect().top));
  const desired = Math.min(total - 1, ((index + 0.5) / WORLD_IDS.length) * total);
  window.scrollBy({ top: desired - current, behavior: reduced ? "auto" : "smooth" });
}

export default function SystemDesk({
  catalog,
  children,
}: {
  catalog: LearnerCatalog;
  children?: ReactNode;
}) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onPhase = (event: Event) => {
      const next = (event as CustomEvent<number>).detail;
      if (typeof next === "number") setIndex(next);
    };
    window.addEventListener("forge-phase", onPhase);
    return () => window.removeEventListener("forge-phase", onPhase);
  }, []);

  const phase = catalog.phases[index] || catalog.phases[0];
  if (!phase) return null;
  const days = catalog.days.filter((day) => day.phaseId === phase.id);
  const instrument = phase.number >= 8;

  return (
    <div className="system-desk">
      <nav className="phase-rail" aria-label="Phases">
        {catalog.phases.map((item, itemIndex) => (
          <button
            key={item.id}
            type="button"
            className={`phase-rail-btn ${itemIndex === index ? "is-on" : ""}`}
            aria-current={itemIndex === index ? "true" : undefined}
            onClick={() => focusPhase(itemIndex)}
          >
            <span>{String(item.number).padStart(2, "0")}</span>
            <span>{item.name}</span>
          </button>
        ))}
      </nav>

      <aside className={`phase-panel ${open ? "is-open" : ""}`} aria-label={phase.name}>
        <button type="button" className="phase-toggle" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
          <span>{String(phase.number).padStart(2, "0")}</span>
          <span>{phase.name}</span>
          <span>Days {phase.daysLabel}</span>
        </button>
        <div className="phase-body">
          <p className="phase-kicker">Days {phase.daysLabel}</p>
          <h2 className="phase-name">{phase.name}</h2>
          <p className="phase-summary">{phase.summary}</p>
          {children}
          <ol className="phase-days">
            {days.map((day) => (
              <li key={day.slug}>
                {day.published && day.href ? (
                  <Link href={day.href}>
                    <span>Day {String(day.day).padStart(2, "0")}</span>
                    <span>{day.title}</span>
                  </Link>
                ) : (
                  <span className="is-planned">
                    <span>Day {String(day.day).padStart(2, "0")}</span>
                    <span>{day.title}</span>
                    <em>Planned</em>
                  </span>
                )}
              </li>
            ))}
          </ol>
          <a className="phase-open" href={instrument ? "#control" : `/learn#${phase.id}`}>
            {instrument ? "Open the instruments" : "Open on the plan"}
          </a>
        </div>
      </aside>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import brandLanguage from "@/content/config/brand-language.json";
import type { LearnerCatalog } from "@/lib/continue-learning";
import { resolveContinue } from "@/lib/continue-learning";
import { useLessonProgress } from "@/components/learning/useLessonProgress";
import { phaseColor } from "@/lib/phase-color";

export type DayFact = {
  day: number;
  phaseId: string;
  goal: string;
  concepts: string[];
};

const W = 1200;
const H = 680;
const GROUND = 628;
/** Shared seam heights so neighboring territories meet. */
const SEAMS = [0.16, 0.08, 0.24, 0.1, 0.3, 0.06, 0.2, 0.28, 0.12, 0.26, 0.14];

function skyY(seam: number) {
  return 56 + seam * 280;
}

function territoryPath(index: number, x0: number, x1: number) {
  const y0 = skyY(SEAMS[index] ?? 0.2);
  const y1 = skyY(SEAMS[index + 1] ?? 0.2);
  const mid = (x0 + x1) / 2;
  const peak = Math.min(y0, y1) - 36 - (index % 3) * 18;
  return `M ${x0.toFixed(1)} ${GROUND} L ${x0.toFixed(1)} ${y0.toFixed(1)} Q ${mid.toFixed(1)} ${peak.toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)} L ${x1.toFixed(1)} ${GROUND} Z`;
}

function Landmark({ n }: { n: number }) {
  const fill = "#efe8dc";
  switch (n) {
    case 1:
      return (
        <svg viewBox="0 0 64 40" aria-hidden="true">
          <rect x="2" y="24" width="14" height="14" fill={fill} />
          <rect x="22" y="14" width="14" height="24" fill={fill} />
          <rect x="42" y="4" width="14" height="34" fill={fill} />
        </svg>
      );
    case 2:
      return (
        <svg viewBox="0 0 64 40" aria-hidden="true">
          <circle cx="32" cy="20" r="14" fill="none" stroke={fill} strokeWidth="4" />
          <circle cx="32" cy="20" r="4" fill={fill} />
        </svg>
      );
    case 3:
      return (
        <svg viewBox="0 0 64 40" aria-hidden="true">
          <path d="M4 28 H40 L52 20 H28 L16 12 H4 Z" fill={fill} />
        </svg>
      );
    case 4:
      return (
        <svg viewBox="0 0 64 40" aria-hidden="true">
          <rect x="6" y="6" width="52" height="8" fill={fill} />
          <rect x="10" y="16" width="44" height="8" fill={fill} opacity="0.75" />
          <rect x="14" y="26" width="36" height="8" fill={fill} opacity="0.5" />
        </svg>
      );
    case 5:
      return (
        <svg viewBox="0 0 64 40" aria-hidden="true">
          <circle cx="16" cy="14" r="7" fill={fill} />
          <circle cx="34" cy="12" r="7" fill={fill} opacity="0.8" />
          <circle cx="48" cy="22" r="7" fill={fill} />
          <circle cx="26" cy="26" r="6" fill={fill} opacity="0.65" />
        </svg>
      );
    case 6:
      return (
        <svg viewBox="0 0 64 40" aria-hidden="true">
          <rect x="4" y="16" width="56" height="10" fill={fill} />
          <rect x="24" y="6" width="10" height="28" fill={fill} />
        </svg>
      );
    case 7:
      return (
        <svg viewBox="0 0 64 40" aria-hidden="true">
          <path d="M4 32 H18 V22 H32 V14 H46 V6 H60 V32 Z" fill={fill} />
        </svg>
      );
    case 8:
      return (
        <svg viewBox="0 0 64 40" aria-hidden="true">
          <path d="M4 26 H60" stroke={fill} strokeWidth="3" />
          <path d="M4 30 C 16 18, 28 18, 40 28 C 48 34, 54 12, 60 8" fill="none" stroke={fill} strokeWidth="3" />
        </svg>
      );
    case 9:
      return (
        <svg viewBox="0 0 64 40" aria-hidden="true">
          <rect x="4" y="16" width="8" height="18" fill={fill} opacity="0.55" />
          <rect x="16" y="8" width="8" height="26" fill={fill} />
          <rect x="28" y="18" width="8" height="16" fill={fill} opacity="0.45" />
          <rect x="40" y="6" width="18" height="12" fill="#efe8dc" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 64 40" aria-hidden="true">
          <rect x="4" y="8" width="56" height="24" fill={fill} opacity="0.35" />
          <rect x="24" y="8" width="16" height="24" fill={fill} />
        </svg>
      );
  }
}

export default function ForgeWorld({
  catalog,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  facts,
}: {
  catalog: LearnerCatalog;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
  facts: DayFact[];
}) {
  const phases = catalog.phases;
  const [pickedIndex, setPickedIndex] = useState<number | null>(null);
  const [activeDay, setActiveDay] = useState<number | null>(null);
  const [focusConcept, setFocusConcept] = useState<string | null>(null);
  const { state, hasHydrated } = useLessonProgress();
  const continueTarget = resolveContinue(hasHydrated ? state : null, catalog);
  const followed =
    continueTarget.phaseNumber != null
      ? phases.findIndex((item) => item.number === continueTarget.phaseNumber)
      : 0;
  const index = pickedIndex ?? (followed >= 0 ? followed : 0);
  const phase = phases[index] || phases[0];

  const days = useMemo(
    () => (phase ? catalog.days.filter((day) => day.phaseId === phase.id) : []),
    [catalog.days, phase],
  );

  useEffect(() => {
    const readout = document.getElementById("world-readout");
    if (!readout || !phase) return;
    readout.hidden = false;
    readout.textContent = phase.name;
    readout.setAttribute("aria-hidden", "false");
    return () => {
      readout.hidden = true;
      readout.textContent = "";
      readout.setAttribute("aria-hidden", "true");
    };
  }, [phase]);

  function selectPhase(next: number) {
    const clamped = Math.max(0, Math.min(phases.length - 1, next));
    setPickedIndex(clamped);
    setFocusConcept(null);
    const chosen = phases[clamped];
    const phaseDays = chosen ? catalog.days.filter((day) => day.phaseId === chosen.id) : [];
    const open = phaseDays.find((day) => day.published) || phaseDays[0];
    setActiveDay(open?.day ?? null);
  }

  if (!phase) return null;

  const tone = phaseColor(phase.number);
  const preferredDay = activeDay ?? (pickedIndex == null ? continueTarget.day : null);
  const shown = days.find((day) => day.day === preferredDay) || days.find((day) => day.published) || days[0];
  const fact = facts.find((item) => item.day === shown?.day);
  const lit = new Set(
    focusConcept
      ? facts
          .filter((item) => item.phaseId === phase.id && item.concepts.includes(focusConcept))
          .map((item) => item.day)
      : [],
  );
  const startHref = hasHydrated && continueTarget.href ? continueTarget.href : primaryHref;
  const startLabel = hasHydrated ? continueTarget.ctaLabel : primaryLabel;
  const openCount = days.filter((day) => day.published).length;

  const spans = phases.map((item) => {
    const count = Math.max(1, item.endDay - item.startDay + 1);
    const x0 = ((item.startDay - 1) / 120) * W;
    const x1 = (item.endDay / 120) * W;
    return { item, count, x0, x1 };
  });

  return (
    <section
      className="forge-world"
      aria-label={`${brandLanguage.displayName}. ${brandLanguage.programmeName}`}
      style={{
        ["--phase-ink" as string]: tone.ink,
        ["--phase-pigment" as string]: tone.pigment,
      }}
    >
      <div className="forge-identity">
        <p className="forge-brand">{brandLanguage.displayName}</p>
        <h1>{brandLanguage.programmeName}</h1>
        <p className="forge-lead">{brandLanguage.programmeDescription}</p>
        <p className="forge-actions">
          <Link className="forge-start" href={startHref}>
            {startLabel}
          </Link>
          <Link className="forge-plan" href={`${secondaryHref}#${phase.id}`}>
            {secondaryLabel}
          </Link>
        </p>
        <div className="forge-now">
          <p className="forge-kicker">
            <span>{String(phase.number).padStart(2, "0")}</span>
            {phase.daysLabel}
            <span>
              {openCount} of {days.length} open
            </span>
          </p>
          <h2>{phase.name}</h2>
          {phase.summary ? <p>{phase.summary}</p> : null}
          <p className="forge-live" aria-live="polite">
            {shown
              ? `Day ${String(shown.day).padStart(3, "0")} ${shown.title}. ${shown.published ? "Open." : "Planned."} ${fact?.goal || ""}`
              : ""}
          </p>
          {fact && fact.concepts.length > 0 ? (
            <div className="forge-concepts" role="group" aria-label="What this day teaches">
              {fact.concepts.map((concept) => (
                <button
                  key={concept}
                  type="button"
                  className={focusConcept === concept ? "is-on" : ""}
                  aria-pressed={focusConcept === concept}
                  onClick={() => setFocusConcept((current) => (current === concept ? null : concept))}
                >
                  {concept}
                </button>
              ))}
            </div>
          ) : null}
          <div className="forge-step">
            <button type="button" onClick={() => selectPhase(index - 1)} disabled={index === 0}>
              Previous phase
            </button>
            <button type="button" onClick={() => selectPhase(index + 1)} disabled={index === phases.length - 1}>
              Next phase
            </button>
          </div>
          <ol className="forge-daylist">
            {days.map((day) => {
              const label = `${String(day.day).padStart(3, "0")} ${day.title}`;
              const className = `${day.published ? "is-open" : "is-planned"}${shown?.day === day.day ? " is-focus" : ""}${lit.has(day.day) ? " is-lit" : ""}`;
              return (
                <li key={day.slug}>
                  {day.published && day.href ? (
                    <Link
                      href={day.href}
                      className={className}
                      aria-current={shown?.day === day.day ? "true" : undefined}
                      onFocus={() => setActiveDay(day.day)}
                      onMouseEnter={() => setActiveDay(day.day)}
                    >
                      <span>{String(day.day).padStart(2, "0")}</span>
                      {day.title}
                    </Link>
                  ) : (
                    <button type="button" className={className} onClick={() => setActiveDay(day.day)}>
                      <span>{String(day.day).padStart(2, "0")}</span>
                      {day.title}
                      <span className="forge-planned">Planned</span>
                      <span className="sr-only">{label}, planned</span>
                    </button>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      <div className="forge-map">
        <svg className="forge-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
          <defs>
            {spans.map(({ item }) => {
              const color = phaseColor(item.number);
              return (
                <linearGradient key={item.id} id={`forge-fill-${item.number}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor={color.pigment} />
                  <stop offset="1" stopColor={color.ink} />
                </linearGradient>
              );
            })}
          </defs>
          <rect width={W} height={H} fill="#f3eadc" />
          <rect y={GROUND - 8} width={W} height={H - GROUND + 8} fill="#241c16" />
          {spans.map(({ item, x0, x1 }, itemIndex) => (
            <path
              key={item.id}
              d={territoryPath(itemIndex, x0, x1)}
              fill={`url(#forge-fill-${item.number})`}
            />
          ))}
          <path d={`M 8 460 H ${W - 8}`} fill="none" stroke="#efe8dc" strokeOpacity="0.55" strokeWidth="3" />
          {catalog.days.map((day) => {
            const cx = ((day.day - 0.5) / 120) * W;
            const here = shown?.day === day.day;
            return (
              <circle
                key={day.slug}
                cx={cx}
                cy={460}
                r={here ? 9 : 4.2}
                fill={day.published ? "#efe8dc" : "none"}
                stroke="#efe8dc"
                strokeWidth={day.published ? 0 : 1.6}
              />
            );
          })}
        </svg>
        <div className="forge-cols">
          {spans.map(({ item, x0, x1 }, itemIndex) => {
            const color = phaseColor(item.number);
            const left = (x0 / W) * 100;
            const width = ((x1 - x0) / W) * 100;
            const phaseDays = catalog.days.filter((day) => day.phaseId === item.id);
            const published = phaseDays.filter((day) => day.published).length;
            return (
              <div
                key={item.id}
                className={itemIndex === index ? "forge-col is-on" : "forge-col"}
                style={{
                  left: `${left}%`,
                  width: `${width}%`,
                  ["--ink" as string]: color.ink,
                  ["--pigment" as string]: color.pigment,
                }}
              >
                <button
                  type="button"
                  className="forge-pick"
                  aria-pressed={itemIndex === index}
                  onClick={() => selectPhase(itemIndex)}
                >
                  <span className="forge-label-chip">
                    <span className="forge-num">{String(item.number).padStart(2, "0")}</span>
                    <span className="forge-name">{item.name}</span>
                  </span>
                </button>
                <span className="forge-mark" aria-hidden="true">
                  <Landmark n={item.number} />
                </span>
                <span className="forge-meter" aria-hidden="true">
                  <i style={{ width: `${phaseDays.length ? (published / phaseDays.length) * 100 : 0}%` }} />
                </span>
                {itemIndex === index ? (
                  <div className="forge-dots">
                    {phaseDays.map((day) => {
                      const spot = (((day.day - 0.5) / 120) * 100 - left) / width * 100;
                      const className = `${day.published ? "is-open" : "is-planned"}${shown?.day === day.day ? " is-focus" : ""}`;
                      const style = { left: `${spot}%` };
                      if (day.published && day.href) {
                        return (
                          <Link
                            key={day.slug}
                            href={day.href}
                            className={className}
                            style={style}
                            aria-label={`Day ${day.day} ${day.title}, open`}
                            onFocus={() => setActiveDay(day.day)}
                            onMouseEnter={() => setActiveDay(day.day)}
                          />
                        );
                      }
                      return (
                        <button
                          key={day.slug}
                          type="button"
                          className={className}
                          style={style}
                          aria-label={`Day ${day.day} ${day.title}, planned`}
                          onClick={() => setActiveDay(day.day)}
                        />
                      );
                    })}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      <ol className="forge-stack">
        {phases.map((item, itemIndex) => {
          const color = phaseColor(item.number);
          const phaseDays = catalog.days.filter((day) => day.phaseId === item.id);
          const published = phaseDays.filter((day) => day.published).length;
          const on = itemIndex === index;
          return (
            <li
              key={item.id}
              className={on ? "is-on" : ""}
              style={{
                ["--ink" as string]: color.ink,
                ["--pigment" as string]: color.pigment,
              }}
            >
              <button type="button" aria-expanded={on} onClick={() => selectPhase(itemIndex)}>
                <span>{String(item.number).padStart(2, "0")}</span>
                <span>
                  <strong>{item.name}</strong>
                  <em>
                    {item.daysLabel} · {published} of {phaseDays.length} open
                  </em>
                </span>
                <Landmark n={item.number} />
              </button>
              {on ? (
                <>
                  {item.summary ? <p className="forge-stack-summary">{item.summary}</p> : null}
                  {fact && fact.concepts.length > 0 ? (
                    <div className="forge-concepts forge-concepts-stack" role="group" aria-label="What this day teaches">
                      {fact.concepts.map((concept) => (
                        <button
                          key={concept}
                          type="button"
                          className={focusConcept === concept ? "is-on" : ""}
                          aria-pressed={focusConcept === concept}
                          onClick={() => setFocusConcept((current) => (current === concept ? null : concept))}
                        >
                          {concept}
                        </button>
                      ))}
                    </div>
                  ) : null}
                  <ol className="forge-daygrid">
                  {phaseDays.map((day) => {
                    const className = `${day.published ? "is-open" : "is-planned"}${shown?.day === day.day ? " is-focus" : ""}${lit.has(day.day) ? " is-lit" : ""}`;
                    return (
                      <li key={day.slug}>
                        {day.published && day.href ? (
                          <Link href={day.href} className={className} onFocus={() => setActiveDay(day.day)}>
                            {String(day.day).padStart(2, "0")} {day.title}
                          </Link>
                        ) : (
                          <button type="button" className={className} onClick={() => setActiveDay(day.day)}>
                            {String(day.day).padStart(2, "0")} {day.title}
                            <span>Planned</span>
                          </button>
                        )}
                      </li>
                    );
                  })}
                  </ol>
                </>
              ) : null}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

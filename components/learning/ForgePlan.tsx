"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import forge from "@/data/curriculum/forge-120.json";
import experience from "@/content/config/experience.json";
import brandLanguage from "@/content/config/brand-language.json";
import { normalizeJourney, queryDays, type JourneyModel } from "@/lib/journey";
import { resolveContinue, type LearnerCatalog } from "@/lib/continue-learning";
import { useLessonProgress } from "@/components/learning/useLessonProgress";
import RegistryIcon from "@/components/icons/RegistryIcon";

const journey: JourneyModel = normalizeJourney(forge, experience);

function dayState(published: boolean, done: boolean, current: boolean) {
  if (done) return "Completed on this device";
  if (current) return "Current";
  if (published) return "Published";
  return "Planned";
}

export default function ForgePlan({ catalog }: { catalog: LearnerCatalog }) {
  const { state, hasHydrated, toggleSaved } = useLessonProgress();
  const target = resolveContinue(hasHydrated ? state : null, catalog);
  const [phaseId, setPhaseId] = useState<string | null>(null);
  const [dayNumber, setDayNumber] = useState<number | null>(null);
  const [skillId, setSkillId] = useState<string | null>(null);
  const [jumpValue, setJumpValue] = useState("");
  const [jumpError, setJumpError] = useState("");

  const catalogDay = (day: number) => catalog.days.find((item) => item.day === day);
  const record = (day: number) => journey.days.find((item) => item.day === day);

  useEffect(() => {
    function readHash() {
      const hash = window.location.hash;
      const dayMatch = /day-(\d+)/.exec(hash);
      const phaseMatch = /phase-(\d+)/.exec(hash);
      if (dayMatch) {
        const day = Number(dayMatch[1]);
        const owner = record(day);
        if (owner) {
          setDayNumber(day);
          setPhaseId(owner.phaseId);
          return;
        }
      }
      if (phaseMatch) {
        const phase = journey.phases.find((item) => item.number === Number(phaseMatch[1]));
        if (phase) {
          setPhaseId(phase.id);
          setDayNumber(phase.startDay);
        }
      }
    }
    readHash();
    window.addEventListener("hashchange", readHash);
    return () => window.removeEventListener("hashchange", readHash);
  }, []);

  const phase =
    journey.phases.find((item) => item.id === phaseId) ||
    journey.phases.find((item) => item.number === target.phaseNumber) ||
    journey.phases[0];
  const shownNumber = dayNumber ?? (phaseId ? phase?.startDay : target.day) ?? phase?.startDay ?? 1;
  const shown = record(shownNumber) || journey.days[0];
  const live = shown ? catalogDay(shown.day) : undefined;
  const done = Boolean(hasHydrated && live && state.completed.includes(live.slug));
  const saved = Boolean(hasHydrated && live && state.saved.includes(live.slug));
  const current = Boolean(live && target.slug === live.slug);

  const skill = journey.skills.find((item) => item.id === skillId) || null;
  const matched = useMemo(() => (skillId ? new Set(queryDays(journey, { skillId }).map((day) => day.day)) : null), [skillId]);

  function selectDay(day: number, hash = "day") {
    const owner = record(day);
    if (!owner) return;
    setDayNumber(day);
    setPhaseId(owner.phaseId);
    const next = hash === "phase" ? `#${owner.phaseId}` : `#day-${day}`;
    window.history.replaceState(null, "", next);
  }

  function selectPhase(id: string) {
    const owner = journey.phases.find((item) => item.id === id);
    if (!owner) return;
    setPhaseId(id);
    setDayNumber(owner.startDay);
    window.history.replaceState(null, "", `#${id}`);
  }

  function selectSkill(id: string) {
    const next = skillId === id ? null : id;
    setSkillId(next);
    if (!next) return;
    const item = journey.skills.find((skillItem) => skillItem.id === next);
    const focus = item?.focusDay || queryDays(journey, { skillId: next })[0]?.day;
    if (focus) selectDay(focus);
  }

  function jump(raw: string) {
    const day = Number(String(raw).replace(/\D/g, ""));
    if (!Number.isInteger(day) || day < 1 || day > catalog.totalDays) {
      setJumpError(`Enter a day from 1 to ${catalog.totalDays}.`);
      return;
    }
    setJumpError("");
    setJumpValue(String(day));
    selectDay(day);
    document.getElementById("plan-detail")?.scrollIntoView({ block: "nearest" });
  }

  if (!shown || !phase) return null;
  const phaseLive = catalog.phases.find((item) => item.id === phase.id);
  const phaseDone = hasHydrated && phaseLive
    ? catalog.days.filter((day) => day.phaseId === phase.id && state.completed.includes(day.slug)).length
    : 0;
  const gate = journey.gates.find((item) => item.id === phase.gateId) || journey.gates.find((item) => item.day === shown.day);
  const skills = journey.skills.filter((item) => shown.skillIds.includes(item.id));
  const previous = shown.previousDay ? record(shown.previousDay) : null;
  const next = shown.nextDay ? record(shown.nextDay) : null;
  const stateLabel = dayState(Boolean(live?.published), done, current && !done);

  return (
    <div className="plan">
      <header className="plan-identity">
        <p className="rail-brand">{brandLanguage.displayName}</p>
        <h1>{catalog.title}</h1>
        <p>
          {catalog.phases.length} phases · {catalog.durationLabel}
        </p>
        <p>{catalog.description}</p>
        <p className="rail-status">
          <span>{catalog.days.filter((day) => day.published).length} published</span>
          {hasHydrated ? <span>{target.completedCount} completed on this device</span> : null}
          {hasHydrated ? <span>{target.ctaLabel}</span> : null}
        </p>
        {target.href ? (
          <p className="rail-actions">
            <Link className="rail-start" href={target.href}>
              {hasHydrated ? target.ctaLabel : "Start Day 1"}
            </Link>
          </p>
        ) : null}
      </header>

      <form
        className="plan-jump"
        onSubmit={(event) => {
          event.preventDefault();
          jump(jumpValue);
        }}
      >
        <label htmlFor="jump-day">Jump to day</label>
        <input
          id="jump-day"
          inputMode="numeric"
          value={jumpValue}
          placeholder="Day 59"
          onChange={(event) => setJumpValue(event.target.value)}
        />
        <button type="submit">Go</button>
        {jumpError ? <p role="alert">{jumpError}</p> : null}
      </form>

      <section aria-label="All 120 days">
        <ol className="plan-year">
          {journey.days.map((day) => {
            const item = catalogDay(day.day);
            const isDone = Boolean(hasHydrated && item && state.completed.includes(item.slug));
            const isNow = item?.slug === target.slug;
            const on = day.day === shown.day;
            const dim = matched ? !matched.has(day.day) : false;
            const label = `Day ${day.day}, ${day.title}. ${item?.published ? "Published" : "Planned"}${isDone ? ". Completed on this device" : ""}`;
            return (
              <li key={day.id}>
                <button
                  type="button"
                  className={`plan-day${item?.published ? " is-open" : ""}${isDone ? " is-done" : ""}${isNow ? " is-now" : ""}${on ? " is-on" : ""}${day.gateId ? " is-gate" : ""}${dim ? " is-dim" : ""}`}
                  aria-label={label}
                  aria-pressed={on}
                  onClick={() => selectDay(day.day)}
                >
                  {day.day}
                </button>
              </li>
            );
          })}
        </ol>
      </section>

      <div className="plan-split">
        <ol
          className="plan-phases"
          aria-label="Ten phases"
          onKeyDown={(event) => {
            if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
            const currentId = (event.target as HTMLElement).closest("li")?.getAttribute("data-phase");
            const index = journey.phases.findIndex((item) => item.id === currentId);
            if (index < 0) return;
            event.preventDefault();
            const next = journey.phases[index + (event.key === "ArrowDown" ? 1 : -1)];
            if (!next) return;
            selectPhase(next.id);
            window.requestAnimationFrame(() => {
              document.getElementById(`phase-btn-${next.id}`)?.focus();
            });
          }}
        >
          {journey.phases.map((item) => {
            const livePhase = catalog.phases.find((phaseItem) => phaseItem.id === item.id);
            const completed = hasHydrated
              ? catalog.days.filter((day) => day.phaseId === item.id && state.completed.includes(day.slug)).length
              : 0;
            const itemGate = journey.gates.find((gateItem) => gateItem.id === item.gateId);
            return (
              <li key={item.id} data-phase={item.id} data-accent={item.accent}>
                <button
                  id={`phase-btn-${item.id}`}
                  type="button"
                  className={item.id === phase.id ? "is-on" : ""}
                  aria-current={item.id === phase.id ? "true" : undefined}
                  onClick={() => selectPhase(item.id)}
                >
                  <span>{String(item.number).padStart(2, "0")}</span>
                  <strong>{item.name}</strong>
                  <span>Days {item.daysLabel}</span>
                  <span>{item.plain}</span>
                  <span>
                    {livePhase?.publishedCount || 0} published
                    {hasHydrated ? ` · ${completed} completed on this device` : ""}
                    {itemGate ? ` · Gate ${itemGate.around}` : ""}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <article className="plan-detail" id="plan-detail" aria-live="polite">
          <p className="rail-num">
            Day {shown.day}
            <span> · {phase.name}</span>
          </p>
          <h2>{shown.title}</h2>
          <p className="plan-state">{stateLabel}</p>
          {shown.goal ? <p>{shown.goal}</p> : null}
          {shown.concepts.length > 0 ? (
            <ul className="plan-concepts">
              {shown.concepts.map((concept) => (
                <li key={concept}>{concept}</li>
              ))}
            </ul>
          ) : null}
          {skills.length > 0 ? (
            <p>
              Skills and tools: {skills.map((item) => item.name).join(", ")}
            </p>
          ) : null}
          {shown.capstoneConnection ? <p>{shown.capstoneConnection}</p> : null}
          {shown.capstoneConnection.toLowerCase().includes("forge-api") ? (
            <p>
              <Link href="/projects/forge-api">Related project: forge-api</Link>
            </p>
          ) : null}
          {gate && gate.day === shown.day ? (
            <p>
              <strong>Gate {gate.around}. {gate.name}.</strong> {gate.evidence}
            </p>
          ) : null}
          <p className="plan-actions">
            {live?.published && live.href ? (
              <Link className="rail-start" href={live.href}>
                Open lesson
              </Link>
            ) : (
              <span>Planned. The lesson is not published.</span>
            )}
            {live ? (
              <button type="button" aria-pressed={saved} onClick={() => toggleSaved(live.slug)}>
                {saved ? "Saved on this device" : "Save on this device"}
              </button>
            ) : null}
          </p>
          <p className="plan-neighbors">
            {previous ? (
              <button type="button" onClick={() => selectDay(previous.day)}>
                Previous · Day {previous.day}
              </button>
            ) : null}
            {next ? (
              <button type="button" onClick={() => selectDay(next.day)}>
                Next · Day {next.day}
              </button>
            ) : null}
          </p>
          <p className="plan-phase-note">
            {phase.plain} {phaseDone ? `${phaseDone} completed in this phase on this device.` : ""}
          </p>
        </article>
      </div>

      <section className="plan-tools" aria-label="Skills and tools">
        <h2>Look by skill</h2>
        <div className="stage-row">
          {journey.skills.map((item) => (
            <button
              key={item.id}
              type="button"
              className={item.id === skillId ? "is-on" : ""}
              aria-pressed={item.id === skillId}
              onClick={() => selectSkill(item.id)}
            >
              <RegistryIcon name={item.icon} className="skill-icon" />
              {item.name}
            </button>
          ))}
        </div>
        {skill ? <p>{skill.plain}</p> : <p>Choose a skill to mark the days that use it.</p>}
      </section>

      <section className="plan-gates" aria-label="Gates">
        <h2>Gates</h2>
        <div className="stage-row">
          {journey.gates.map((item) => (
            <button key={item.id} type="button" aria-pressed={shown.gateId === item.id} onClick={() => item.day && selectDay(item.day)}>
              {item.around} {item.name}
            </button>
          ))}
        </div>
        {shown.gateId ? null : <p>A gate is a checkpoint in the curriculum. It is not a score.</p>}
      </section>
    </div>
  );
}

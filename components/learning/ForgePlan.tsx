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
  const phaseIndex = journey.phases.findIndex((item) => item.id === phase.id);
  const prepares = journey.phases[phaseIndex + 1];
  const phaseSkills = journey.skills.filter((item) => phase.skillIds.includes(item.id));
  const phaseGate = journey.gates.find((item) => item.id === phase.gateId) || null;
  const dayGate = journey.gates.find((item) => item.day === shown.day) || null;
  const skills = journey.skills.filter((item) => shown.skillIds.includes(item.id));
  const previous = shown.previousDay ? record(shown.previousDay) : null;
  const nextDay = shown.nextDay ? record(shown.nextDay) : null;
  const stateLabel = dayState(Boolean(live?.published), done, current && !done);
  const publishedTotal = catalog.days.filter((day) => day.published).length;

  return (
    <div className="plan">
      <header className="plan-bar">
        <div>
          <p className="rail-brand">{brandLanguage.displayName}</p>
          <h1>{catalog.title}</h1>
          <p className="rail-status">
            <span>{catalog.totalDays} days</span>
            <span>{catalog.phases.length} phases</span>
            <span>{publishedTotal} published</span>
            {hasHydrated ? <span>{target.completedCount} completed on this device</span> : null}
          </p>
        </div>
        <div className="plan-bar-actions">
          {target.href ? (
            <Link className="rail-start" href={target.href}>
              {hasHydrated ? target.ctaLabel : "Start Day 1"}
            </Link>
          ) : null}
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
        </div>
      </header>

      <section className="plan-tools" aria-label="Skills and tools">
        <div className="tool-strip">
          <span>Skill</span>
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
          {skillId ? (
            <button type="button" onClick={() => setSkillId(null)}>
              Clear skill
            </button>
          ) : null}
        </div>
        <p>{skill ? skill.plain : "Choose a skill to mark the days that use it."}</p>
      </section>

      <ol className="span-key" aria-label="Journey boundaries">
        {journey.spans.map((span) => (
          <li key={span.id} data-span={span.id}>
            <span>
              D{span.from}–{span.to}
            </span>
            {span.name}
          </li>
        ))}
      </ol>

      <section aria-label="All 120 days">
        <ol
          className="map"
          onKeyDown={(event) => {
            if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
            if (!(event.target as HTMLElement).classList.contains("map-phase")) return;
            const currentId = (event.target as HTMLElement).closest("li[data-phase]")?.getAttribute("data-phase");
            const index = journey.phases.findIndex((item) => item.id === currentId);
            if (index < 0) return;
            event.preventDefault();
            const nextPhase = journey.phases[index + (event.key === "ArrowDown" ? 1 : -1)];
            if (!nextPhase) return;
            selectPhase(nextPhase.id);
            window.requestAnimationFrame(() => {
              document.getElementById(`phase-btn-${nextPhase.id}`)?.focus();
            });
          }}
        >
          {journey.phases.map((item) => {
            const span = journey.spans.find((entry) => item.startDay >= entry.from && item.endDay <= entry.to);
            const bandDays = journey.days.filter((day) => day.phaseId === item.id);
            return (
              <li
                key={item.id}
                data-phase={item.id}
                data-accent={item.accent}
                data-span={span?.id || "system"}
                className={item.id === phase.id ? "is-on" : ""}
              >
                <button
                  id={`phase-btn-${item.id}`}
                  type="button"
                  className="map-phase"
                  aria-current={item.id === phase.id ? "true" : undefined}
                  onClick={() => selectPhase(item.id)}
                >
                  <span>{String(item.number).padStart(2, "0")}</span>
                  <strong>{item.name}</strong>
                  <span>Days {item.daysLabel}</span>
                </button>
                <ol className="map-days">
                  {bandDays.map((day) => {
                    const itemDay = catalogDay(day.day);
                    const isDone = Boolean(hasHydrated && itemDay && state.completed.includes(itemDay.slug));
                    const isNow = itemDay?.slug === target.slug;
                    const on = day.day === shown.day;
                    const dim = matched ? !matched.has(day.day) : false;
                    const label = `Day ${day.day}, ${day.title}. ${itemDay?.published ? "Published" : "Planned"}${isDone ? ". Completed on this device" : ""}`;
                    return (
                      <li key={day.id}>
                        <button
                          type="button"
                          className={`plan-day${itemDay?.published ? " is-open" : ""}${isDone ? " is-done" : ""}${isNow ? " is-now" : ""}${on ? " is-on" : ""}${day.gateId ? " is-gate" : ""}${dim ? " is-dim" : ""}`}
                          aria-label={label}
                          aria-pressed={on}
                          onClick={() => selectDay(day.day)}
                        >
                          {String(day.day).padStart(2, "0")}
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </li>
            );
          })}
        </ol>
      </section>

      <div className="plan-focus">
        <article key={phase.id} className="plan-card" data-accent={phase.accent} aria-label="This phase">
          <p className="phase-mark">
            <RegistryIcon name={phase.icon} className="skill-icon" />
            <span>{String(phase.number).padStart(2, "0")}</span>
          </p>
          <h2>{phase.name}</h2>
          <p className="phase-range">Days {phase.daysLabel}</p>
          <p>{phase.plain}</p>
          <dl>
            <div>
              <dt>Published</dt>
              <dd>{phaseLive?.publishedCount || 0}</dd>
            </div>
            <div>
              <dt>Planned</dt>
              <dd>{(phaseLive?.totalDays || 0) - (phaseLive?.publishedCount || 0)}</dd>
            </div>
            {hasHydrated ? (
              <div>
                <dt>Completed on this device</dt>
                <dd>{phaseDone}</dd>
              </div>
            ) : null}
          </dl>
          {phaseSkills.length > 0 ? <p>Skills and tools: {phaseSkills.map((item) => item.name).join(", ")}</p> : null}
          {phaseGate ? (
            <p>
              Gate {phaseGate.around}. {phaseGate.name}.
            </p>
          ) : null}
          {prepares ? <p>Prepares you for {prepares.name}.</p> : <p>This is the last phase.</p>}
        </article>

        <article key={shown.day} className="plan-card" id="plan-detail" aria-live="polite">
          <p className="rail-num">Day {String(shown.day).padStart(2, "0")}</p>
          <h2>{shown.title}</h2>
          <dl>
            <div>
              <dt>Status</dt>
              <dd>{stateLabel}</dd>
            </div>
            <div>
              <dt>Phase</dt>
              <dd>{phase.name}</dd>
            </div>
            {shown.goal ? (
              <div>
                <dt>Goal</dt>
                <dd>{shown.goal}</dd>
              </div>
            ) : null}
            {shown.concepts.length > 0 ? (
              <div>
                <dt>Concepts</dt>
                <dd>{shown.concepts.join(" · ")}</dd>
              </div>
            ) : null}
            {skills.length > 0 ? (
              <div>
                <dt>Skills and tools</dt>
                <dd>{skills.map((item) => item.name).join(", ")}</dd>
              </div>
            ) : null}
            {dayGate ? (
              <div>
                <dt>Gate</dt>
                <dd>
                  <strong>
                    Gate {dayGate.around}. {dayGate.name}.
                  </strong>{" "}
                  {dayGate.evidence}
                </dd>
              </div>
            ) : null}
            {shown.capstoneConnection ? (
              <div>
                <dt>Capstone</dt>
                <dd>
                  {shown.capstoneConnection}{" "}
                  {shown.capstoneConnection.toLowerCase().includes("forge-api") ? (
                    <Link href="/projects/forge-api">Related project: forge-api</Link>
                  ) : null}
                </dd>
              </div>
            ) : null}
          </dl>
          <p className="plan-actions">
            {live?.published && live.href ? (
              <Link className="rail-start" href={live.href}>
                Open lesson
              </Link>
            ) : (
              <span>Planned. The lesson is not published.</span>
            )}
            {previous ? (
              <button type="button" onClick={() => selectDay(previous.day)}>
                Previous
              </button>
            ) : null}
            {nextDay ? (
              <button type="button" onClick={() => selectDay(nextDay.day)}>
                Next
              </button>
            ) : null}
            {live ? (
              <button type="button" aria-pressed={saved} onClick={() => toggleSaved(live.slug)}>
                {saved ? "Saved on this device" : "Save on this device"}
              </button>
            ) : null}
          </p>
        </article>
      </div>

      <section className="plan-gates" aria-label="Gates">
        <h2>Gates</h2>
        <ol className="gate-rail">
          {journey.gates.map((item, index) => (
            <li key={item.id}>
              {index > 0 ? <span aria-hidden="true">→</span> : null}
              <button type="button" aria-pressed={shown.day === item.day} onClick={() => item.day && selectDay(item.day)}>
                {item.around}
                <span>{item.name}</span>
              </button>
            </li>
          ))}
        </ol>
        <p>A gate is a checkpoint, not a score.</p>
      </section>
    </div>
  );
}

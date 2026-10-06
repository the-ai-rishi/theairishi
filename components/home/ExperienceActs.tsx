"use client";

import { useState } from "react";
import Link from "next/link";
import experience from "@/content/config/experience.json";
import RegistryIcon from "@/components/icons/RegistryIcon";

export function SkillsBand() {
  return (
    <section className="act" aria-labelledby="skills-title">
      <div className="act-wrap">
        <h2 id="skills-title">What you will practise</h2>
        {experience.skills.map((group) => (
          <div key={group.id} className="skill-group" data-accent={group.accent}>
            <h3>{group.title}</h3>
            <ul>
              {group.items.map((item) => {
                const body = (
                  <>
                    <RegistryIcon name={item.icon} className="skill-icon" />
                    <span>
                      <strong>{item.name}</strong>
                      <span>{item.plain}</span>
                    </span>
                  </>
                );
                return (
                  <li key={item.id}>
                    {item.href ? <Link href={item.href}>{body}</Link> : <div>{body}</div>}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

export function OrderStory() {
  return (
    <section className="act" aria-labelledby="order-title">
      <div className="act-wrap">
        <h2 id="order-title">Why this order</h2>
        <ol className="order-line">
          {experience.order.map((item) => (
            <li key={item.id} data-accent={item.accent || "ink"}>
              <RegistryIcon name={item.icon} className="skill-icon" />
              <span>
                <strong>{item.name}</strong>
                <span>{item.plain}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function DayFlow() {
  return (
    <section className="act" aria-labelledby="day-title">
      <div className="act-wrap">
        <h2 id="day-title">How one day works</h2>
        <ol className="day-flow">
          {experience.days.map((item, index) => (
            <li key={item.id}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{item.name}</strong>
              <span>{item.plain}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function ControlPrimer() {
  const [retrieval, setRetrieval] = useState(experience.retrieval[2]?.id || experience.retrieval[0].id);
  const [control, setControl] = useState(experience.control[2]?.id || experience.control[0].id);
  const retrievalItem = experience.retrieval.find((item) => item.id === retrieval) || experience.retrieval[0];
  const controlItem = experience.control.find((item) => item.id === control) || experience.control[0];

  return (
    <section className="act" aria-labelledby="control-title">
      <div className="act-wrap">
        <h2 id="control-title">Where AI enters</h2>
        <p className="act-fixture">{experience.fixtureLabel}</p>
        <h3>Retrieval</h3>
        <div className="stage-row" role="group" aria-label="Retrieval">
          {experience.retrieval.map((item) => (
            <button
              key={item.id}
              type="button"
              className={item.id === retrieval ? "is-on" : ""}
              aria-pressed={item.id === retrieval}
              onClick={() => setRetrieval(item.id)}
            >
              {item.name}
            </button>
          ))}
        </div>
        <p className="stage-plain">
          <strong>{retrievalItem.name}.</strong> {retrievalItem.plain}
        </p>
        <h3>Controlled tool use</h3>
        <div className="stage-row" role="group" aria-label="Controlled tool use">
          {experience.control.map((item) => (
            <button
              key={item.id}
              type="button"
              className={item.id === control ? "is-on" : ""}
              data-accent={item.id === "policy" ? "policy" : undefined}
              aria-pressed={item.id === control}
              onClick={() => setControl(item.id)}
            >
              {item.name}
            </button>
          ))}
        </div>
        <p className="stage-plain">
          <strong>{controlItem.name}.</strong> {controlItem.plain}
        </p>
      </div>
    </section>
  );
}

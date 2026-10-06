"use client";

import { useState } from "react";
import Link from "next/link";
import experience from "@/content/config/experience.json";
import RegistryIcon from "@/components/icons/RegistryIcon";

export function SkillsBand() {
  return (
    <div className="toolkit">
      {experience.skills.map((group) => (
        <div key={group.id} className="skill-group" data-accent={group.accent}>
          <h3>{group.title}</h3>
          <ul>
            {group.items.map((item) => {
              const phases = (item.phases || []).map((id) => id.replace("phase-", "")).join(" and ");
              const body = (
                <>
                  <RegistryIcon name={item.icon} className="skill-icon" />
                  <span>
                    <strong>{item.name}</strong>
                    <span>{item.plain}</span>
                    {phases ? <span className="skill-where">Phase {phases}</span> : null}
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
  );
}

export function OrderStory() {
  const [current, setCurrent] = useState(experience.order[0]?.id || "");
  const selected = experience.order.find((item) => item.id === current) || experience.order[0];

  return (
    <div>
      <ol className="order-line">
        {experience.order.map((item, index) => (
          <li key={item.id} data-accent={item.accent || "ink"}>
            {index > 0 ? <span className="order-join" aria-hidden="true">→</span> : null}
            <button
              type="button"
              className={item.id === selected?.id ? "is-on" : ""}
              aria-pressed={item.id === selected?.id}
              onClick={() => setCurrent(item.id)}
            >
              <RegistryIcon name={item.icon} className="skill-icon" />
              <strong>{item.name}</strong>
              <span>{item.plain}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function DayFlow() {
  const [current, setCurrent] = useState(experience.days[0]?.id || "");
  const selected = experience.days.find((item) => item.id === current) || experience.days[0];

  return (
    <div>
      <ol className="day-flow">
        {experience.days.map((item, index) => (
          <li key={item.id}>
            {index > 0 ? <span className="flow-join" aria-hidden="true">→</span> : null}
            <button
              type="button"
              className={item.id === selected?.id ? "is-on" : ""}
              aria-pressed={item.id === selected?.id}
              onClick={() => setCurrent(item.id)}
              onMouseEnter={() => setCurrent(item.id)}
              onFocus={() => setCurrent(item.id)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <RegistryIcon name={item.icon} className="skill-icon" />
              <strong>{item.name}</strong>
            </button>
          </li>
        ))}
      </ol>
      {selected ? <p key={selected.id} className="flow-plain">{selected.plain}</p> : null}
    </div>
  );
}

function StageFlow({
  label,
  items,
  current,
  onSelect,
}: {
  label: string;
  items: { id: string; name: string; plain: string }[];
  current: string;
  onSelect: (id: string) => void;
}) {
  const selected = items.find((item) => item.id === current) || items[0];
  return (
    <div className="flow-block">
      <h3>{label}</h3>
      <div className="flow" role="group" aria-label={label}>
        {items.map((item, index) => (
          <span key={item.id} className="flow-step">
            {index > 0 ? <span className="flow-join" aria-hidden="true">→</span> : null}
            <button
              type="button"
              className={item.id === current ? "is-on" : ""}
              data-accent={item.id === "policy" ? "policy" : undefined}
              aria-pressed={item.id === current}
              onClick={() => onSelect(item.id)}
            >
              {item.name}
            </button>
          </span>
        ))}
      </div>
      {selected ? (
        <p key={selected.id} className="flow-plain">
          <strong>{selected.name}.</strong> {selected.plain}
        </p>
      ) : null}
    </div>
  );
}

export function ControlPrimer() {
  const [retrieval, setRetrieval] = useState(experience.retrieval[2]?.id || experience.retrieval[0].id);
  const [control, setControl] = useState(experience.control[2]?.id || experience.control[0].id);

  return (
    <div>
      <p className="act-fixture">{experience.fixtureLabel}</p>
      <ol className="span-line">
        {experience.spans.map((span) => (
          <li key={span.id} data-accent={span.id === "controlled" ? "plum" : "ink"}>
            <span>
              D{span.from}–{span.to}
            </span>
            <strong>{span.name}</strong>
          </li>
        ))}
      </ol>
      <StageFlow label="Retrieval" items={experience.retrieval} current={retrieval} onSelect={setRetrieval} />
      <StageFlow label="Controlled tool use" items={experience.control} current={control} onSelect={setControl} />
    </div>
  );
}

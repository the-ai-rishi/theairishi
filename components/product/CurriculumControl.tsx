"use client";

import { useState } from "react";

type DayRef = { day: number; title: string };
type Gate = { id: string; name: string; around: string; evidence: string };

const LOOP = [
  { id: "request", label: "Request", detail: "A person asks for something the service can actually do." },
  { id: "model", label: "Model", detail: "The model proposes. It does not get to skip the boundary." },
  { id: "policy", label: "Policy", detail: "A deterministic check, not a hopeful prompt." },
  { id: "validation", label: "Validation", detail: "Schema and allowlist. Unknown tools do not run." },
  { id: "tool", label: "Tool", detail: "Only the tool the policy allowed." },
  { id: "result", label: "Result", detail: "The tool returns evidence. The model does not invent the evidence." },
  { id: "evaluation", label: "Evaluation", detail: "Compare the output to a golden expectation. Pass or fail." },
  { id: "audit", label: "Audit", detail: "Pin the path. A kill switch can stop it. The trace stays." },
] as const;

export default function CurriculumControl({
  days,
  gates,
  touchpoints,
}: {
  days: DayRef[];
  gates: Gate[];
  touchpoints: { day12: string; day59: string; awarenessLimit: string };
}) {
  const [step, setStep] = useState<(typeof LOOP)[number]["id"]>("policy");
  const [injection, setInjection] = useState<"clean" | "poison">("clean");
  const active = LOOP.find((item) => item.id === step) || LOOP[2];
  const byDay = (day: number) => days.find((item) => item.day === day);

  return (
    <section id="control" className="control-stage" aria-labelledby="control-title">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="kicker text-gold/80">Days 97–105</p>
        <h2 id="control-title" className="mt-3 max-w-3xl font-serif text-[1.75rem] leading-tight text-cream sm:text-4xl">
          Retrieval, then a boundary. The model is not trusted.
        </h2>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-cream/70">
          Day 12 is {touchpoints.day12}. Day 59 is {touchpoints.day59}. The control layer is this block, not the first week.{" "}
          {touchpoints.awarenessLimit}
        </p>

        <ol className="rag-flow mt-8" aria-label="Retrieval path">
          {["Documents", "Chunks", "Retrieval", "Context", "Citation", "Answer"].map((label) => (
            <li key={label}>{label}</li>
          ))}
        </ol>
        <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-cream/45">
          {byDay(97)?.title || "RAG terms and chunking"} · {byDay(98)?.title || "Retrieve, cite, poison test"}
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(16rem,0.9fr)]">
          <div>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-cream/50">Review-only loop</h3>
            <div className="mt-3 flex flex-wrap gap-2" role="tablist" aria-label="Control steps">
              {LOOP.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={step === item.id}
                  className={`control-step ${step === item.id ? "is-on" : ""}`}
                  onClick={() => setStep(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-cream/80" role="tabpanel">
              {active.detail}
            </p>
          </div>

          <div className="control-panel">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-gold/80">
              Day {byDay(103)?.day || 103} · {byDay(103)?.title || "Injection lab"}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-cream/70">
              Teaching fixture. Not a live model. Untrusted text tries to cross the boundary.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" className={`control-step ${injection === "clean" ? "is-on" : ""}`} onClick={() => setInjection("clean")}>
                Ordinary question
              </button>
              <button type="button" className={`control-step ${injection === "poison" ? "is-on" : ""}`} onClick={() => setInjection("poison")}>
                Hidden instruction
              </button>
            </div>
            <p className={`control-verdict mt-4 ${injection === "poison" ? "is-block" : "is-allow"}`}>
              {injection === "clean" ? "Policy allows the cited answer." : "Policy blocks the instruction found in retrieved text."}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <article className="control-panel">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-gold/80">
              Day {byDay(102)?.day || 102} · {byDay(102)?.title || "Golden eval harness"}
            </h3>
            <dl className="eval-grid mt-4">
              <div>
                <dt>Input</dt>
                <dd>Ask for the health endpoint, with a citation.</dd>
              </div>
              <div>
                <dt>Expected</dt>
                <dd>The answer names the endpoint and the source chunk.</dd>
              </div>
              <div>
                <dt>Output</dt>
                <dd>A fluent paragraph with no source.</dd>
              </div>
              <div>
                <dt>Assertion</dt>
                <dd className="is-fail">Fail. Citation missing.</dd>
              </div>
            </dl>
          </article>
          <article className="control-panel">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-gold/80">
              Day {byDay(101)?.day || 101} · {byDay(101)?.title || "MCP protocol and tool boundary"}
            </h3>
            <ul className="mcp-tree mt-4">
              <li>Model</li>
              <li>
                MCP boundary
                <ul>
                  <li>Tool A — allowed</li>
                  <li>Tool B — blocked</li>
                  <li>Resource — returned as evidence</li>
                </ul>
              </li>
            </ul>
            <p className="mt-3 text-sm leading-relaxed text-cream/60">
              {byDay(100)?.title}. {byDay(104)?.title}. The disable path is part of the design.
            </p>
          </article>
        </div>

        <h3 className="mt-12 font-mono text-[11px] uppercase tracking-[0.16em] text-cream/50">Capability gates</h3>
        <ol className="gate-list mt-4">
          {gates.map((gate) => (
            <li key={gate.id}>
              <span>{gate.around}</span>
              <strong>{gate.name}</strong>
              <em>{gate.evidence}</em>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

import Link from "next/link";
import type { ResolvedHomepageSection } from "@/lib/homepage";
import { getHydratedPhases, getProgram, getPublishedProgramDays } from "@/lib/programs";

export default function ProgramHighlight({ section }: { section: ResolvedHomepageSection }) {
  const program = getProgram();
  if (!program.enabled) return null;
  const phases = getHydratedPhases();
  const current = phases.find((phase) => phase.current) || phases[0];
  const published = getPublishedProgramDays();

  const facts = [
    { label: "Length", value: program.durationLabel },
    { label: "Phases", value: String(phases.length) },
    {
      label: "Current",
      value: current ? `${String(current.number).padStart(2, "0")} · ${current.name}` : "—",
    },
    {
      label: "Ready",
      value: published.length
        ? `${published.length} day${published.length === 1 ? "" : "s"}`
        : "None yet",
    },
  ];

  return (
    <section className="scroll-mt-24 py-8 sm:py-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <dl className="grid grid-cols-2 gap-px bg-hairline sm:grid-cols-4">
          {facts.map((fact) => (
            <div key={fact.label} className="bg-ink px-4 py-5 sm:px-5 sm:py-6">
              <dt className="font-mono text-[11px] tracking-[0.16em] uppercase text-cream/40">
                {fact.label}
              </dt>
              <dd className="mt-2 font-serif text-lg leading-snug text-cream sm:text-xl">{fact.value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-6 flex flex-wrap items-center gap-5">
          <Link
            href={section.ctaHref || "/learn"}
            className="link-editorial font-mono text-[13px] tracking-[0.12em] text-cream/55 hover:text-gold"
          >
            {section.ctaLabel || "Full plan"} →
          </Link>
        </div>
      </div>
    </section>
  );
}

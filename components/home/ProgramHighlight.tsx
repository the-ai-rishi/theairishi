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
      value: current ? `${current.number} · ${current.name}` : "-",
    },
    {
      label: "Ready",
      value: published.length
        ? `${published.length} day${published.length === 1 ? "" : "s"}`
        : "None yet",
    },
  ];

  return (
    <section className="scroll-mt-24 py-6 sm:py-8" aria-label="Program snapshot" data-section={section.id}>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <dl className="grid grid-cols-2 gap-px bg-hairline sm:grid-cols-4">
          {facts.map((fact) => (
            <div key={fact.label} className="bg-ink px-4 py-4 sm:px-5 sm:py-5">
              <dt className="font-mono text-[11px] tracking-[0.16em] uppercase text-cream/40">
                {fact.label}
              </dt>
              <dd className="mt-2 font-serif text-lg leading-snug text-cream sm:text-xl">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

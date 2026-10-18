import type { ReactNode } from "react";

export default function Chapter({
  index,
  id,
  kicker,
  title,
  surface = "base",
  accent = "ink",
  layout = "prose",
  children,
}: {
  index: number;
  id: string;
  kicker?: string;
  title?: string;
  surface?: string;
  accent?: string;
  layout?: string;
  children: ReactNode;
}) {
  return (
    <section
      className="chapter"
      data-surface={surface}
      data-accent={accent}
      data-layout={layout}
      aria-labelledby={title ? `${id}-title` : undefined}
      aria-label={title ? undefined : kicker || undefined}
    >
      <div className="chapter-wrap">
        <header className="chapter-head">
          <p className="chapter-index">{String(index).padStart(2, "0")}</p>
          {kicker ? <p className="chapter-kicker">{kicker}</p> : null}
          {title ? <h2 id={`${id}-title`}>{title}</h2> : null}
        </header>
        {children}
      </div>
    </section>
  );
}

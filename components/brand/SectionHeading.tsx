import Link from "next/link";

interface SectionHeadingProps {
  kicker?: string;
  title?: string;
  actionLabel?: string;
  actionHref?: string;
}

export default function SectionHeading({
  kicker,
  title,
  actionLabel,
  actionHref,
}: SectionHeadingProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-hairline pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {kicker ? <p className="kicker text-gold/80">{kicker}</p> : null}
        {title ? (
          <h2 className="mt-2 font-serif text-[2.25rem] leading-[1.05] tracking-[0.012em] text-cream sm:text-5xl">
            {title}
          </h2>
        ) : null}
      </div>
      {actionLabel && actionHref ? (
        <Link
          href={actionHref}
          className="link-editorial font-mono text-[13px] tracking-[0.14em] text-cream/55 hover:text-gold"
        >
          {actionLabel} →
        </Link>
      ) : null}
    </div>
  );
}

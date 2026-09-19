export default function OptionalSourceNote({
  href,
  title = "DevOps Engineer Mastery repository",
}: {
  href: string;
  title?: string;
}) {
  if (!href) return null;
  return (
    <p className="max-w-xl text-[13px] leading-relaxed text-cream/35">
      Want the full source repository?{" "}
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="link-editorial text-cream/50 hover:text-gold"
      >
        View the {title}
      </a>
      . Optional. Not required to finish the day.
    </p>
  );
}

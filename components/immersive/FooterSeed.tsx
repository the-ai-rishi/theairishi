/** Closing mark: the same baseline and closed frame, not a symbol. */
export default function FooterSeed() {
  return (
    <div className="footer-seed" aria-hidden="true">
      <svg viewBox="0 0 240 80">
        <rect x="86" y="8" width="68" height="36" fill="none" stroke="rgba(103,232,249,0.7)" strokeWidth="1" />
        <line x1="16" y1="62" x2="224" y2="62" stroke="rgba(243,238,228,0.35)" strokeWidth="1" />
        <line x1="16" y1="62" x2="150" y2="62" stroke="rgba(212,180,106,0.85)" strokeWidth="1.4" />
        {Array.from({ length: 10 }, (_, index) => {
          const x = 20 + index * 22;
          return (
            <line
              key={index}
              x1={x}
              y1="56"
              x2={x}
              y2="68"
              stroke={index === 0 ? "#d4b46a" : "rgba(243,238,228,0.35)"}
              strokeWidth="1"
            />
          );
        })}
      </svg>
    </div>
  );
}

/** Static sacred geometry used before WebGL boots and when motion is reduced. */
export default function StillCore() {
  return (
    <svg className="still-core" viewBox="0 0 200 200" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="still-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f0d090" stopOpacity="0.85" />
          <stop offset="42%" stopColor="#d4b46a" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#08080b" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="28" fill="url(#still-glow)" />
      <g fill="none" strokeLinejoin="round">
        <circle cx="100" cy="100" r="92" stroke="rgba(212,180,106,0.35)" strokeWidth="0.6" />
        <ellipse cx="100" cy="100" rx="78" ry="28" stroke="rgba(103,232,249,0.35)" strokeWidth="0.6" transform="rotate(28 100 100)" />
        <ellipse cx="100" cy="100" rx="78" ry="28" stroke="rgba(139,124,255,0.4)" strokeWidth="0.6" transform="rotate(-36 100 100)" />
        <ellipse cx="100" cy="100" rx="64" ry="64" stroke="rgba(243,238,228,0.16)" strokeWidth="0.5" strokeDasharray="1.5 4" />
        <g transform="translate(100 100) scale(4.35) translate(-16 -16)">
          {Array.from({ length: 8 }, (_, i) => (
            <path
              key={i}
              d="M16 3.2C19.4 8.2 19.7 12.6 16 16C12.3 12.6 12.6 8.2 16 3.2Z"
              transform={`rotate(${i * 45} 16 16)`}
              stroke={i % 2 === 0 ? "rgba(212,180,106,0.9)" : "rgba(192,132,252,0.45)"}
              strokeWidth="0.65"
            />
          ))}
        </g>
        <circle cx="100" cy="100" r="3" fill="#f3eee4" stroke="none" />
      </g>
    </svg>
  );
}

interface BrandMarkProps {
  className?: string;
}

/** Geometric lotus + circuit node. Reads at 24px. Gold via currentColor. */
export default function BrandMark({ className = "h-7 w-7" }: BrandMarkProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <g
        stroke="currentColor"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
      >
        <g strokeWidth="1.15">
          {Array.from({ length: 8 }, (_, i) => (
            <path
              key={i}
              d="M16 3.4C19.15 8.15 19.55 12.55 16 16C12.45 12.55 12.85 8.15 16 3.4Z"
              transform={`rotate(${i * 45} 16 16)`}
            />
          ))}
        </g>
        <circle cx="16" cy="16" r="2.15" strokeWidth="1.15" />
        <path
          d="M16 12.35V9.7M16 19.65V22.3M12.35 16H9.7M19.65 16H22.3"
          strokeWidth="1.05"
        />
      </g>
    </svg>
  );
}

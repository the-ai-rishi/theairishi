interface BrandMarkProps {
  className?: string;
}

/** Structural mark: a column, a beam, a record. Not a botanical icon. */
export default function BrandMark({ className = "h-7 w-7" }: BrandMarkProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true" focusable="false">
      <g stroke="currentColor" fill="none" strokeWidth="1.4">
        <line x1="11" y1="5" x2="11" y2="27" />
        <line x1="6" y1="11" x2="24" y2="11" />
        <rect x="6" y="5" width="5" height="5" />
      </g>
    </svg>
  );
}

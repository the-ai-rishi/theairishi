import { useId } from "react";
import { fieldOf } from "@/lib/phase-color";

type PhaseSlice = {
  number: number;
  totalDays: number;
  daysLabel: string;
};

function polar(cx: number, cy: number, radius: number, degrees: number) {
  const radians = ((degrees - 90) * Math.PI) / 180;
  return [cx + radius * Math.cos(radians), cy + radius * Math.sin(radians)] as const;
}

function arc(cx: number, cy: number, radius: number, start: number, end: number) {
  const large = end - start > 180 ? 1 : 0;
  const [x0, y0] = polar(cx, cy, radius, start);
  const [x1, y1] = polar(cx, cy, radius, end);
  return `M ${x0} ${y0} A ${radius} ${radius} 0 ${large} 1 ${x1} ${y1}`;
}

function ringSlice(cx: number, cy: number, outer: number, inner: number, start: number, end: number) {
  const large = end - start > 180 ? 1 : 0;
  const [x0, y0] = polar(cx, cy, outer, start);
  const [x1, y1] = polar(cx, cy, outer, end);
  const [x2, y2] = polar(cx, cy, inner, end);
  const [x3, y3] = polar(cx, cy, inner, start);
  return `M ${x0} ${y0} A ${outer} ${outer} 0 ${large} 1 ${x1} ${y1} L ${x2} ${y2} A ${inner} ${inner} 0 ${large} 0 ${x3} ${y3} Z`;
}

/** Crystal instrument for the 120-day path. Not a stock image and not a metric dashboard. */
export default function ForgeSchematic({
  phases,
  activeIndex,
  publishedDays,
}: {
  phases: PhaseSlice[];
  activeIndex: number;
  publishedDays: number[];
}) {
  const rawId = useId().replace(/:/g, "");
  const sheenId = `forge-sheen-${rawId}`;
  const washId = `forge-wash-${rawId}`;
  const discId = `forge-disc-${rawId}`;
  const total = phases.reduce((sum, phase) => sum + phase.totalDays, 0) || 120;
  const published = new Set(publishedDays);
  const cx = 280;
  const cy = 268;
  const slices = phases.reduce<{ phase: PhaseSlice; index: number; start: number; end: number; cursor: number }[]>(
    (list, phase, index) => {
      const cursor = list.length ? list[list.length - 1].cursor : -8;
      const sweep = (phase.totalDays / total) * 360;
      return [
        ...list,
        { phase, index, start: cursor + 0.85, end: cursor + sweep - 0.85, cursor: cursor + sweep },
      ];
    },
    [],
  );
  const active = slices[Math.min(slices.length - 1, Math.max(0, activeIndex))] || slices[0];

  return (
    <svg className="forge-schematic" viewBox="0 0 560 540" role="presentation">
      <defs>
        <radialGradient id={sheenId} cx="28%" cy="18%" r="68%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="38%" stopColor="#d5def8" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={washId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="42%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="100%" stopColor="#e2b57a" stopOpacity="0.4" />
        </linearGradient>
        <radialGradient id={discId} cx="32%" cy="26%" r="75%">
          <stop offset="0%" stopColor="#3a3458" stopOpacity="0.2" />
          <stop offset="58%" stopColor="#100e18" stopOpacity="0.72" />
          <stop offset="100%" stopColor="#07060c" stopOpacity="0.88" />
        </radialGradient>
      </defs>

      <ellipse cx="292" cy="498" rx="168" ry="18" fill="rgba(8, 6, 16, 0.45)" />
      <circle cx={cx} cy={cy} r="210" fill="rgba(120, 96, 210, 0.16)" />

      <circle cx={cx} cy={cy} r="232" fill="none" stroke="rgba(226, 181, 122, 0.45)" strokeWidth="1" />
      <circle cx={cx} cy={cy} r="214" fill="none" stroke="rgba(210, 224, 255, 0.28)" strokeDasharray="2 7" />

      {slices.map(({ phase, index, start, end }) => {
        const mid = (start + end) / 2;
        const [x0, y0] = polar(cx, cy, 196, mid);
        const [x1, y1] = polar(cx, cy, 232, mid);
        const lit = index === activeIndex;
        return (
          <g key={`node-${phase.number}`}>
            <line x1={x0} y1={y0} x2={x1} y2={y1} stroke={lit ? "#e2b57a" : "rgba(232, 224, 214, 0.4)"} strokeWidth={lit ? 1.6 : 1} />
            <circle cx={x1} cy={y1} r={lit ? 8 : 4.5} fill={fieldOf(phase.number).pigment} stroke={lit ? "#f4efe6" : "rgba(255,255,255,0.7)"} strokeWidth={lit ? 2 : 1} />
          </g>
        );
      })}

      <g transform="translate(14 16)" opacity="0.38">
        {slices.map(({ phase, start, end }) => (
          <path key={`back-${phase.number}`} d={ringSlice(cx, cy, 186, 124, start, end)} fill={fieldOf(phase.number).ink} />
        ))}
      </g>

      {slices.map(({ phase, index, start, end }) => {
        const lifted = index === activeIndex;
        return (
          <path
            key={phase.number}
            d={ringSlice(cx, cy, lifted ? 198 : 186, lifted ? 118 : 128, start, end)}
            fill={fieldOf(phase.number).pigment}
            stroke="rgba(255,255,255,0.38)"
            strokeWidth="1"
          />
        );
      })}
      <path d={ringSlice(cx, cy, 186, 128, -8, 351)} fill={`url(#${washId})`} />
      <path d={arc(cx, cy, 192, 206, 332)} fill="none" stroke="rgba(255,255,255,0.82)" strokeWidth="7" strokeLinecap="round" />
      <path d={arc(cx, cy, 176, 214, 300)} fill="none" stroke="rgba(226,181,122,0.75)" strokeWidth="2.5" strokeLinecap="round" />

      {Array.from({ length: total }, (_, offset) => {
        const day = offset + 1;
        const angle = (offset + 0.5) * (360 / total) - 8;
        const [x1, y1] = polar(cx, cy, 202, angle);
        const [x2, y2] = polar(cx, cy, published.has(day) ? 216 : 209, angle);
        return (
          <line
            key={day}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={published.has(day) ? "#e2b57a" : "rgba(244,239,230,0.38)"}
            strokeWidth={published.has(day) ? 2.1 : 1}
          />
        );
      })}

      <circle cx={cx} cy={cy} r="104" fill={`url(#${discId})`} />
      <circle cx={cx} cy={cy} r="104" fill={`url(#${sheenId})`} />
      <circle cx={cx} cy={cy} r="104" fill="none" stroke="rgba(255,255,255,0.62)" strokeWidth="1.5" />
      <circle cx={cx} cy={cy} r="96" fill="none" stroke="rgba(226,181,122,0.35)" strokeWidth="1" />

      {active ? (
        <>
          <text x={cx} y={cy - 22} textAnchor="middle" fill="#e2b57a" fontFamily="ui-monospace, monospace" fontSize="13" letterSpacing="3">
            {String(active.phase.number).padStart(2, "0")}
          </text>
          <text x={cx} y={cy + 26} textAnchor="middle" fill="#f4efe6" fontFamily="ui-serif, Georgia, serif" fontSize="52">
            {active.phase.totalDays}
          </text>
          <text x={cx} y={cy + 50} textAnchor="middle" fill="#d9cbb8" fontFamily="ui-monospace, monospace" fontSize="11" letterSpacing="1.6">
            DAYS {active.phase.daysLabel}
          </text>
        </>
      ) : null}
    </svg>
  );
}

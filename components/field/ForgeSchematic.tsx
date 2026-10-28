import { useId } from "react";
import { phaseColor } from "@/lib/phase-color";

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

/** Authored instrument for the 120-day path. Not a stock image and not a metric dashboard. */
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
  const lightId = `forge-light-${rawId}`;
  const total = phases.reduce((sum, phase) => sum + phase.totalDays, 0) || 120;
  const published = new Set(publishedDays);
  const cx = 260;
  const cy = 248;
  const slices = phases.reduce<{ phase: PhaseSlice; index: number; start: number; end: number; cursor: number }[]>(
    (list, phase, index) => {
      const cursor = list.length ? list[list.length - 1].cursor : -8;
      const sweep = (phase.totalDays / total) * 360;
      return [
        ...list,
        { phase, index, start: cursor + 0.7, end: cursor + sweep - 0.7, cursor: cursor + sweep },
      ];
    },
    [],
  );
  const active = slices[Math.min(slices.length - 1, Math.max(0, activeIndex))] || slices[0];

  return (
    <svg className="forge-schematic" viewBox="0 0 520 500" role="presentation">
      <defs>
        <radialGradient id={lightId} cx="32%" cy="28%" r="70%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="46%" stopColor="#f7f1e6" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#f7f1e6" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="268" cy="452" rx="168" ry="16" fill="rgba(22, 16, 36, 0.22)" />
      <g transform="translate(12 14)" opacity="0.28">
        {slices.map(({ phase, start, end }) => (
          <path
            key={`back-${phase.number}`}
            d={ringSlice(cx, cy, 196, 132, start, end)}
            fill={phaseColor(phase.number).ink}
          />
        ))}
      </g>
      {slices.map(({ phase, index, start, end }) => {
        const pigment = phaseColor(phase.number);
        const lifted = index === activeIndex;
        return (
          <path
            key={phase.number}
            d={ringSlice(cx, cy, lifted ? 208 : 196, lifted ? 128 : 136, start, end)}
            fill={pigment.pigment}
          />
        );
      })}
      <path d={arc(cx, cy, 206, 208, 328)} fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="8" strokeLinecap="round" />
      {Array.from({ length: total }, (_, offset) => {
        const day = offset + 1;
        const angle = (offset + 0.5) * (360 / total) - 8;
        const [x1, y1] = polar(cx, cy, 214, angle);
        const [x2, y2] = polar(cx, cy, published.has(day) ? 226 : 220, angle);
        return (
          <line
            key={day}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={published.has(day) ? "#6d4520" : "rgba(26,23,20,0.28)"}
            strokeWidth={published.has(day) ? 2.2 : 1}
          />
        );
      })}
      <circle cx={cx} cy={cy} r="112" fill="#f7f3ea" />
      <circle cx={cx} cy={cy} r="112" fill={`url(#${lightId})`} />
      <circle cx={cx} cy={cy} r="112" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2" />
      {active ? (
        <>
          <text
            x={cx}
            y={cy - 18}
            textAnchor="middle"
            fill={phaseColor(active.phase.number).ink}
            fontFamily="ui-monospace, monospace"
            fontSize="15"
            letterSpacing="3"
          >
            {String(active.phase.number).padStart(2, "0")}
          </text>
          <text
            x={cx}
            y={cy + 28}
            textAnchor="middle"
            fill="#1a1714"
            fontFamily="ui-serif, Georgia, serif"
            fontSize="54"
          >
            {active.phase.totalDays}
          </text>
          <text
            x={cx}
            y={cy + 52}
            textAnchor="middle"
            fill="#3f3a34"
            fontFamily="ui-monospace, monospace"
            fontSize="12"
            letterSpacing="1.5"
          >
            DAYS {active.phase.daysLabel}
          </text>
        </>
      ) : null}
    </svg>
  );
}

"use client";

import { forwardRef } from "react";

/**
 * One elevation for the ten phases.
 * Cream is structure. Gold is a path. Signal colour is a measured line or a closed boundary.
 * Nothing in this drawing is a count, a user, or a live system.
 */
const PhaseSheet = forwardRef<SVGSVGElement>(function PhaseSheet(_props, ref) {
  return (
    <svg
      ref={ref}
      className="phase-sheet"
      viewBox="0 0 1200 640"
      data-phase="foundations"
      aria-hidden="true"
      focusable="false"
    >
      <g className="sheet-measure" fill="none">
        <line className="measure-track" x1="72" y1="588" x2="1128" y2="588" />
        <line className="measure-fill" x1="72" y1="588" x2="1128" y2="588" pathLength={1} strokeDasharray="1" strokeDashoffset="1" />
        {Array.from({ length: 10 }, (_, index) => {
          const x = 72 + (index + 0.5) * (1056 / 10);
          return <line key={index} className={`tick tick-${index}`} x1={x} y1="576" x2={x} y2="600" />;
        })}
      </g>

      <g className="phase-draw draw-foundations">
        <line className="ink" x1="280" y1="56" x2="280" y2="520" />
        <rect className="ink" x="168" y="72" width="48" height="48" />
        <line className="gold" x1="168" y1="168" x2="820" y2="168" />
        <line className="ink" x1="280" y1="248" x2="640" y2="248" />
      </g>

      <g className="phase-draw draw-azure">
        <line className="ink" x1="240" y1="88" x2="240" y2="500" />
        <line className="ink" x1="900" y1="88" x2="900" y2="500" />
        <line className="gold" x1="240" y1="250" x2="900" y2="250" />
        <rect className="ink" x="876" y="88" width="48" height="48" />
        <text className="sheet-label" x="200" y="72">network</text>
        <text className="sheet-label" x="860" y="72">identity</text>
      </g>

      <g className="phase-draw draw-delivery">
        <rect className="ink" x="120" y="200" width="200" height="110" />
        <rect className="ink" x="500" y="200" width="200" height="110" />
        <rect className="ink" x="880" y="200" width="200" height="110" />
        <line className="gold" x1="320" y1="255" x2="490" y2="255" />
        <polyline className="gold" points="476,248 500,255 476,262" />
        <line className="gold" x1="700" y1="255" x2="870" y2="255" />
        <polyline className="gold" points="856,248 880,255 856,262" />
        <text className="sheet-label" x="168" y="262">source</text>
        <text className="sheet-label" x="572" y="262">CI</text>
        <text className="sheet-label" x="918" y="262">artifact</text>
      </g>

      <g className="phase-draw draw-application">
        <rect className="ink" x="220" y="110" width="760" height="360" />
        <line className="gold" x1="80" y1="290" x2="1120" y2="290" />
        <rect className="ink" x="470" y="210" width="260" height="160" />
        <text className="sheet-label" x="244" y="144">module</text>
      </g>

      <g className="phase-draw draw-kubernetes">
        <rect className="ink" x="140" y="70" width="920" height="450" />
        <rect className="ink" x="190" y="140" width="360" height="320" />
        <rect className="ink" x="620" y="140" width="380" height="160" />
        <rect className="gold" x="230" y="190" width="270" height="80" />
        <rect className="gold" x="230" y="310" width="270" height="80" />
        <line className="gold" x1="500" y1="230" x2="620" y2="220" />
        <text className="sheet-label" x="160" y="100">cluster</text>
        <text className="sheet-label" x="206" y="168">node</text>
        <text className="sheet-label" x="250" y="236">workload</text>
      </g>

      <g className="phase-draw draw-aks">
        <rect className="ink" x="200" y="90" width="760" height="340" />
        <rect className="gold" x="250" y="180" width="200" height="90" />
        <rect className="gold" x="500" y="180" width="200" height="90" />
        <line className="gold" x1="450" y1="225" x2="500" y2="225" />
        <rect className="ink" x="160" y="450" width="880" height="28" />
        <rect className="signal" x="1000" y="150" width="52" height="52" />
        <line className="signal" x1="960" y1="176" x2="1000" y2="176" />
        <text className="sheet-label" x="220" y="124">AKS</text>
        <text className="sheet-label" x="980" y="230">identity</text>
      </g>

      <g className="phase-draw draw-infrastructure">
        <rect className="ink" x="140" y="160" width="300" height="180" />
        <rect className="ink" x="760" y="160" width="300" height="180" />
        <line className="gold" x1="440" y1="220" x2="750" y2="220" />
        <polyline className="gold" points="734,212 760,220 734,228" />
        <line className="signal" x1="760" y1="300" x2="450" y2="300" />
        <polyline className="signal" points="466,292 440,300 466,308" />
        <text className="sheet-label" x="520" y="200">promotion</text>
        <text className="sheet-label" x="520" y="340">rollback</text>
      </g>

      <g className="phase-draw draw-reliability">
        <line className="dim" x1="120" y1="300" x2="1080" y2="300" />
        <polyline className="signal" points="140,420 300,400 460,380 620,160 780,390 960,370" />
        <rect className="signal" x="604" y="144" width="32" height="32" />
        <text className="sheet-label" x="120" y="284">threshold</text>
      </g>

      <g className="phase-draw draw-retrieval">
        <rect className="ink" x="100" y="140" width="150" height="200" />
        <rect className="gold" x="290" y="140" width="150" height="200" />
        <rect className="ink" x="480" y="140" width="150" height="200" />
        <line className="gold" x1="440" y1="240" x2="760" y2="240" />
        <rect className="ink" x="760" y="160" width="280" height="160" />
        <line className="signal cite" x1="900" y1="320" x2="365" y2="360" />
        <text className="sheet-label" x="318" y="250">chunk</text>
        <text className="sheet-label" x="820" y="248">context</text>
        <text className="sheet-label" x="620" y="370">cite</text>
      </g>

      <g className="phase-draw draw-defence">
        <rect className="signal" x="120" y="56" width="960" height="480" />
        <line className="ink" x1="220" y1="120" x2="220" y2="460" />
        <rect className="ink" x="320" y="160" width="280" height="200" />
        <polyline className="gold" points="680,400 780,400 860,180 960,390" />
        <rect className="ink" x="700" y="140" width="90" height="120" />
      </g>
    </svg>
  );
});

export default PhaseSheet;

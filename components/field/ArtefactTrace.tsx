"use client";

import { useState } from "react";

/** Stations are the lab's recorded technologies. Not an invented architecture. */
export default function ArtefactTrace({
  technologies,
  status,
}: {
  technologies: string[];
  status: string;
}) {
  const stations = technologies.length ? technologies : [status];
  const [index, setIndex] = useState(0);
  const current = stations[index] || stations[0];

  return (
    <div className="trace-wrap">
      <p className="field-kicker">Recorded on this lab</p>
      <div className="trace" role="tablist" aria-label="Recorded technologies">
        {stations.map((station, stationIndex) => (
          <button
            key={station}
            type="button"
            role="tab"
            aria-selected={stationIndex === index}
            className={stationIndex === index ? "is-on" : ""}
            onClick={() => setIndex(stationIndex)}
          >
            {station}
          </button>
        ))}
      </div>
      <p className="trace-note" aria-live="polite">
        {current}. Status: {status}.
      </p>
    </div>
  );
}

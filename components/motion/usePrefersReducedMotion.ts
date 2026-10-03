"use client";

import { useEffect, useState } from "react";

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(media.matches);
    media.addEventListener("change", apply);
    const id = window.requestAnimationFrame(() => apply());
    return () => {
      window.cancelAnimationFrame(id);
      media.removeEventListener("change", apply);
    };
  }, []);

  return reduced;
}

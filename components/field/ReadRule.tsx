"use client";

import { useEffect, useState } from "react";

export default function ReadRule() {
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const root = document.documentElement;
      const max = root.scrollHeight - root.clientHeight;
      setScale(max > 0 ? root.scrollTop / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return <div className="read-rule" style={{ transform: `scaleX(${scale})` }} aria-hidden="true" />;
}

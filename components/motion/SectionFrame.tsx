import type { ReactNode } from "react";
import Reveal from "@/components/motion/Reveal";

/** Editorial frame: a quiet chapter numeral plus a shared entrance. */
export default function SectionFrame({
  index,
  children,
}: {
  index: string;
  children: ReactNode;
}) {
  return (
    <Reveal>
      <div className="section-frame">
        <span className="chapter-watermark" aria-hidden="true">
          {index}
        </span>
        {children}
      </div>
    </Reveal>
  );
}

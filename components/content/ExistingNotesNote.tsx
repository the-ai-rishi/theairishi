import Link from "next/link";
import { getTopicRecord } from "@/lib/config";

export default function ExistingNotesNote({ topicKey }: { topicKey?: string | null }) {
  if (!topicKey) return null;
  const topic = getTopicRecord(topicKey);
  const note = topic?.discoveryNote;
  if (!note) return null;

  return (
    <p className="border border-hairline bg-cream/[0.03] px-4 py-3 font-mono text-[12px] leading-relaxed tracking-[0.04em] text-cream/55">
      {note}{" "}
      <Link href="/learn" className="text-gold hover:text-gold-bright">
        Current program →
      </Link>
    </p>
  );
}

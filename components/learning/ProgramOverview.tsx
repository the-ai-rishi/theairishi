import ProgramCommandCenter from "@/components/learning/ProgramCommandCenter";
import { getLearnerCatalog, type ProgramConfig } from "@/lib/programs";

export default function ProgramOverview({ program }: { program: ProgramConfig }) {
  const catalog = getLearnerCatalog(program.id);
  return <ProgramCommandCenter catalog={catalog} />;
}

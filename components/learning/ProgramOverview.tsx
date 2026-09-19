import ProgramCommandCenter from "@/components/learning/ProgramCommandCenter";
import { getHydratedPhases, getLearnerCatalog, type ProgramConfig } from "@/lib/programs";

export default function ProgramOverview({ program }: { program: ProgramConfig }) {
  const catalog = getLearnerCatalog(program.id);
  const phases = getHydratedPhases(program.id);
  return <ProgramCommandCenter catalog={catalog} phases={phases} />;
}

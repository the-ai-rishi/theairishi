import ForgePlan from "@/components/learning/ForgePlan";
import { getProgramModel } from "@/lib/program-model";
import { getLearnerCatalog, type ProgramConfig } from "@/lib/programs";

export default function ProgramOverview({ program }: { program: ProgramConfig }) {
  const catalog = getLearnerCatalog(program.id);
  const model = getProgramModel(program.id);
  return <ForgePlan catalog={catalog} journey={model.journey} />;
}
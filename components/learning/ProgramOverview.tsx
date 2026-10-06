import ForgePlan from "@/components/learning/ForgePlan";
import { getLearnerCatalog, type ProgramConfig } from "@/lib/programs";

export default function ProgramOverview({ program }: { program: ProgramConfig }) {
  const catalog = getLearnerCatalog(program.id);
  return <ForgePlan catalog={catalog} />;
}

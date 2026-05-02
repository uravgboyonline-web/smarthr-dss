import { getIndicators } from "@/app/actions/indicator";
import { IndicatorTable } from "./indicator-table";

export const dynamic = "force-dynamic";

export default async function IndicatorsPage() {
  const indicators = await getIndicators();
  return <IndicatorTable initialIndicators={indicators} />;
}

import { getReportData } from "@/app/actions/report";
import { ReportTable } from "./report-table";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const { reports, periods } = await getReportData();
  return <ReportTable reports={reports} periods={periods} />;
}

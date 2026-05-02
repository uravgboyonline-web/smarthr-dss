import { getDashboardStats } from "@/app/actions/dashboard";
import { DashboardClient } from "./dashboard-client";

export const dynamic = "force-dynamic";

export default async function DashboardPage({ searchParams }: { searchParams: { year?: string } }) {
  const selectedYear = searchParams.year ? parseInt(searchParams.year) : new Date().getFullYear();
  const stats = await getDashboardStats(selectedYear);

  return (
    <DashboardClient 
      totalEmployees={stats.totalEmployees}
      totalCriteria={stats.totalCriteria}
      totalEvaluated={stats.totalEvaluated}
      topEmployees={stats.topEmployees}
      departmentScores={stats.departmentScores}
      year={stats.year}
    />
  );
}

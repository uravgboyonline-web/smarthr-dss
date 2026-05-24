import { getDashboardStats, getEmployeeDashboardStats } from "@/app/actions/dashboard";
import { DashboardClient } from "./dashboard-client";
import { EmployeeDashboardClient } from "./employee-dashboard-client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const dynamic = "force-dynamic";

export default async function DashboardPage({ searchParams }: { searchParams: { year?: string } }) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role || "employee";
  const userId = session?.user?.id as string;
  
  const selectedYear = searchParams.year ? parseInt(searchParams.year) : new Date().getFullYear();

  if (role === "employee") {
    const empStats = await getEmployeeDashboardStats(userId, selectedYear);
    return (
      <EmployeeDashboardClient 
        employee={empStats.employee}
        topEmployees={empStats.topEmployees}
        evaluations={empStats.evaluations}
        year={empStats.year}
        averageScore={empStats.averageScore}
        recommendation={empStats.recommendation}
      />
    );
  }

  const stats = await getDashboardStats(selectedYear);

  return (
    <DashboardClient 
      stats={stats}
      userRole={role}
    />
  );
}

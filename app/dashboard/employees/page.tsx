import { getEmployees } from "@/app/actions/employee";
import { EmployeeTable } from "./employee-table";

export const dynamic = "force-dynamic";

export default async function EmployeesPage() {
  const employees = await getEmployees();
  return <EmployeeTable initialEmployees={employees} />;
}

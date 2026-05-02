"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { createAuditLog } from "./audit";

export async function getEmployees() {
  return await prisma.employee.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function createEmployee(formData: FormData) {
  const employeeCode = formData.get("employeeCode") as string;
  const name = formData.get("name") as string;
  const position = formData.get("position") as string;
  const department = formData.get("department") as string;
  const status = formData.get("status") as string;

  const employee = await prisma.employee.create({
    data: {
      employeeCode: employeeCode || `EMP-${Date.now()}`,
      name,
      position,
      department,
      status,
      joinDate: new Date(),
    },
  });

  const session = await getServerSession(authOptions);
  if (session?.user?.id) {
    await createAuditLog({
      userId: session.user.id,
      action: "CREATE",
      entity: "Employee",
      entityId: employee.id,
      details: `Menambah karyawan baru: ${name}`,
    });
  }

  revalidatePath("/dashboard/employees");
}

export async function updateEmployee(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const position = formData.get("position") as string;
  const department = formData.get("department") as string;
  const status = formData.get("status") as string;

  const employee = await prisma.employee.update({
    where: { id },
    data: { name, position, department, status },
  });

  const session = await getServerSession(authOptions);
  if (session?.user?.id) {
    await createAuditLog({
      userId: session.user.id,
      action: "UPDATE",
      entity: "Employee",
      entityId: id,
      details: `Mengubah data karyawan: ${name}`,
    });
  }

  revalidatePath("/dashboard/employees");
}

export async function deleteEmployee(id: string) {
  const employee = await prisma.employee.delete({
    where: { id },
  });

  const session = await getServerSession(authOptions);
  if (session?.user?.id) {
    await createAuditLog({
      userId: session.user.id,
      action: "DELETE",
      entity: "Employee",
      entityId: id,
      details: `Menghapus karyawan: ${employee.name}`,
    });
  }

  revalidatePath("/dashboard/employees");
}

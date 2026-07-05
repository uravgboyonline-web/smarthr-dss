"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { createAuditLog } from "./audit";

export async function getIndicators() {
  return await prisma.indicator.findMany({
    orderBy: { type: "asc" },
  });
}

export async function createIndicator(formData: FormData) {
  const name = formData.get("name") as string;
  const type = formData.get("type") as string;
  const weight = parseFloat(formData.get("weight") as string);
  const minTarget = parseFloat(formData.get("minTarget") as string) || 0;
  const description = formData.get("description") as string;
  const subIndicatorsRaw = formData.get("subIndicators") as string;

  const indicator = await prisma.indicator.create({
    data: {
      name,
      type,
      weight,
      minTarget,
      description,
      subIndicators: subIndicatorsRaw || null,
    },
  });

  const session = await getServerSession(authOptions);
  if (session?.user?.id) {
    await createAuditLog({
      userId: session.user.id,
      action: "CREATE",
      entity: "Indicator",
      entityId: indicator.id,
      details: `Menambah indikator baru: ${name} (${type})`,
    });
  }

  revalidatePath("/dashboard/indicators");
}

export async function updateIndicatorSubIndicators(id: string, subIndicators: string) {
  await prisma.indicator.update({
    where: { id },
    data: { subIndicators },
  });
  revalidatePath("/dashboard/indicators");
}

export async function deleteIndicator(id: string) {
  const indicator = await prisma.indicator.delete({
    where: { id },
  });

  const session = await getServerSession(authOptions);
  if (session?.user?.id) {
    await createAuditLog({
      userId: session.user.id,
      action: "DELETE",
      entity: "Indicator",
      entityId: id,
      details: `Menghapus indikator: ${indicator.name}`,
    });
  }

  revalidatePath("/dashboard/indicators");
}

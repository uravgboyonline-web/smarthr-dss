"use server";

import { prisma } from "@/lib/prisma";

export async function createAuditLog(data: {
  userId: string;
  action: string;
  entity: string;
  entityId?: string;
  details?: string;
}) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: data.userId,
        action: data.action,
        entity: data.entity,
        entityId: data.entityId,
        details: data.details,
      },
    });
  } catch (error) {
    console.error("Failed to create audit log:", error);
  }
}

export async function getAuditLogs() {
  return await prisma.auditLog.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 100,
  });
}

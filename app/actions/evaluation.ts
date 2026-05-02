"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createAuditLog } from "./audit";

export async function createEvaluation(data: {
  employeeId: string;
  evaluatorEmail: string;
  year: number;
  month: number;
  notes: string;
  scores: Record<string, number>;
}) {
  // Look up evaluator by email to avoid stale session ID issues
  const evaluator = await prisma.user.findUnique({
    where: { email: data.evaluatorEmail },
  });

  if (!evaluator) {
    throw new Error("Evaluator tidak ditemukan. Silakan login ulang.");
  }

  // Find or Create the Evaluation Period for the given Year and Month
  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  const periodName = `Periode ${monthNames[data.month - 1]} ${data.year}`;
  
  let period = await prisma.evaluationPeriod.findFirst({
    where: { periodName }
  });

  if (!period) {
    period = await prisma.evaluationPeriod.create({
      data: {
        periodName,
        startDate: new Date(data.year, data.month - 1, 1),
        endDate: new Date(data.year, data.month, 0),
        status: "aktif"
      }
    });
  }

  const indicators = await prisma.indicator.findMany();
  
  let totalWeightedScore = 0;
  const detailsData = [];

  for (const indicator of indicators) {
    const rawScore = data.scores[indicator.id] || 0;
    const weightedScore = (rawScore * indicator.weight) / 100;
    totalWeightedScore += weightedScore;

    detailsData.push({
      indicatorId: indicator.id,
      score: rawScore,
      weightedScore,
    });
  }

  let recommendation = "Perlu Perbaikan";
  if (totalWeightedScore >= 85) recommendation = "Promosi";
  else if (totalWeightedScore >= 70) recommendation = "Reward";
  else if (totalWeightedScore >= 55) recommendation = "Pertahankan";
  else recommendation = "Pelatihan / Evaluasi Ulang";

  const evaluation = await prisma.evaluation.create({
    data: {
      employeeId: data.employeeId,
      evaluatorId: evaluator.id,
      periodId: period.id,
      notes: data.notes,
      totalScore: totalWeightedScore,
      recommendation,
      details: {
        create: detailsData,
      },
    },
    include: {
      employee: true,
    }
  });

  await createAuditLog({
    userId: evaluator.id,
    action: "CREATE",
    entity: "Evaluation",
    entityId: evaluation.id,
    details: `Melakukan penilaian untuk karyawan: ${evaluation.employee.name} dengan skor ${totalWeightedScore.toFixed(1)}`,
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/evaluations");
  revalidatePath("/dashboard/reports");
}

export async function getEvaluationData() {
  const employees = await prisma.employee.findMany({ where: { status: "Aktif" } });
  const indicators = await prisma.indicator.findMany();
  return { employees, indicators };
}

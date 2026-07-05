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
  subScoresData?: Record<string, string>;
  method?: string;
}) {
  const evaluator = await prisma.user.findUnique({
    where: { email: data.evaluatorEmail },
  });

  if (!evaluator) {
    throw new Error("Evaluator tidak ditemukan. Silakan login ulang.");
  }

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
  const detailsData: any[] = [];
  const weakIndicators: string[] = [];
  const strongIndicators: string[] = [];

  for (const indicator of indicators) {
    const rawScore = data.scores[indicator.id] || 0;
    const weightedScore = (rawScore * indicator.weight) / 100;
    totalWeightedScore += weightedScore;

    detailsData.push({
      indicatorId: indicator.id,
      score: rawScore,
      weightedScore,
      subScores: data.subScoresData?.[indicator.id] || null,
    });

    const isWeak = indicator.minTarget > 0 
      ? (weightedScore < indicator.minTarget) 
      : (rawScore < 70);

    if (isWeak) {
      weakIndicators.push(indicator.name);
    } else if (rawScore >= 85) {
      strongIndicators.push(indicator.name);
    }
  }

  let recommendation = "Evaluasi Ulang";
  if (totalWeightedScore >= 85) recommendation = "Reward / Promosi";
  else if (totalWeightedScore >= 70) recommendation = "Dipertahankan";
  else if (totalWeightedScore >= 50) recommendation = "Pelatihan";

  // Downgrade recommendation if they failed to meet minimal targets on specific indicators
  if (weakIndicators.length > 0 && (recommendation === "Reward / Promosi" || recommendation === "Dipertahankan")) {
    recommendation = "Pelatihan";
  }

  // Build automated analysis
  let automatedAnalysis = "";
  if (strongIndicators.length > 0) {
    automatedAnalysis += `Karyawan menunjukkan performa yang sangat baik pada aspek: ${strongIndicators.join(", ")}.\n`;
  }
  if (weakIndicators.length > 0) {
    automatedAnalysis += `Namun, nilai pada aspek ${weakIndicators.join(", ")} berada di bawah standar.\n\nRekomendasi:\n- Mengikuti pelatihan dan pembinaan khusus untuk aspek ${weakIndicators.join(", ")}\n- Melakukan evaluasi berkala dan monitoring selama 3 bulan ke depan`;
  }
  if (!automatedAnalysis) {
    automatedAnalysis = "Performa karyawan cukup stabil dan memenuhi standar minimal di seluruh aspek.";
  }
  const finalAiAnalysis = automatedAnalysis.trim();

  const existingEval = await prisma.evaluation.findUnique({
    where: { employeeId_periodId: { employeeId: data.employeeId, periodId: period.id } }
  });

  let evaluation;
  if (existingEval) {
    await prisma.evaluationDetail.deleteMany({ where: { evaluationId: existingEval.id } });
    
    evaluation = await prisma.evaluation.update({
      where: { id: existingEval.id },
      data: {
        evaluatorId: evaluator.id,
        notes: data.notes,
        totalScore: totalWeightedScore,
        recommendation,
        method: data.method || "Manual",
        aiAnalysis: finalAiAnalysis,
        details: { create: detailsData },
      },
      include: { employee: true }
    });

    await createAuditLog({
      userId: evaluator.id,
      action: "UPDATE",
      entity: "Evaluation",
      entityId: evaluation.id,
      details: `Mengubah penilaian untuk karyawan: ${evaluation.employee.name} menjadi skor ${totalWeightedScore.toFixed(1)}`,
    });
  } else {
    evaluation = await prisma.evaluation.create({
      data: {
        employeeId: data.employeeId,
        evaluatorId: evaluator.id,
        periodId: period.id,
        notes: data.notes,
        totalScore: totalWeightedScore,
        recommendation,
        method: data.method || "Manual",
        aiAnalysis: finalAiAnalysis,
        details: { create: detailsData },
      },
      include: { employee: true }
    });

    await createAuditLog({
      userId: evaluator.id,
      action: "CREATE",
      entity: "Evaluation",
      entityId: evaluation.id,
      details: `Melakukan penilaian untuk karyawan: ${evaluation.employee.name} dengan skor ${totalWeightedScore.toFixed(1)}`,
    });
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/evaluations");
  revalidatePath("/dashboard/reports");
}

export async function checkExistingEvaluation(employeeId: string, year: number, month: number) {
  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  const periodName = `Periode ${monthNames[month - 1]} ${year}`;
  
  const period = await prisma.evaluationPeriod.findFirst({
    where: { periodName }
  });

  if (!period) return null;

  const existing = await prisma.evaluation.findUnique({
    where: { employeeId_periodId: { employeeId, periodId: period.id } },
    include: { details: true }
  });

  return existing;
}

export async function getEvaluationData() {
  const employees = await prisma.employee.findMany({ where: { status: "Aktif" } });
  const indicators = await prisma.indicator.findMany();
  return { employees, indicators };
}

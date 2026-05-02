"use server";

import { prisma } from "@/lib/prisma";

export async function getReportData() {
  const evaluations = await prisma.evaluation.findMany({
    include: {
      employee: true,
      evaluator: true,
      period: true,
      details: {
        include: {
          indicator: true,
        },
      },
    },
    orderBy: { totalScore: "desc" },
  });

  const periods = await prisma.evaluationPeriod.findMany();

  const reports = evaluations.map((ev, idx) => ({
    id: ev.id,
    rank: idx + 1,
    employeeName: ev.employee.name,
    employeeCode: ev.employee.employeeCode,
    department: ev.employee.department,
    position: ev.employee.position,
    evaluatorName: ev.evaluator.name,
    periodName: ev.period.periodName,
    periodId: ev.periodId,
    totalScore: ev.totalScore.toFixed(1),
    recommendation: ev.recommendation || "-",
    notes: ev.notes || "-",
    createdAt: ev.createdAt.toISOString().split("T")[0],
    details: ev.details.map((d) => ({
      indicatorName: d.indicator.name,
      indicatorType: d.indicator.type,
      weight: d.indicator.weight,
      score: d.score,
      weightedScore: d.weightedScore.toFixed(1),
    })),
  }));

  return { reports, periods };
}

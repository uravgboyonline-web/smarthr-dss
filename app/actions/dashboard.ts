"use server";

import { prisma } from "@/lib/prisma";

export async function getDashboardStats(year: number = new Date().getFullYear()) {
  const totalEmployees = await prisma.employee.count({
    where: { status: "Aktif" }
  });

  const totalCriteria = await prisma.indicator.count();

  const allEmployeesList = await prisma.employee.findMany({
    where: { status: "Aktif" },
    select: { id: true, name: true, department: true, position: true }
  });

  // Filter evaluations by year based on the period's startDate
  const evaluations = await prisma.evaluation.findMany({
    where: {
      period: {
        startDate: {
          gte: new Date(`${year}-01-01`),
          lte: new Date(`${year}-12-31`),
        }
      }
    },
    include: {
      employee: true,
      period: true,
      details: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
  
  const evaluatedEmployeeIds = new Set(evaluations.map(e => e.employeeId));
  const totalEvaluated = evaluatedEmployeeIds.size;

  // Aggregate scores per employee for the top list in the selected year
  const employeeAggregates: Record<string, { name: string, totalScore: number, count: number, initials: string }> = {};
  
  evaluations.forEach(ev => {
    const empId = ev.employeeId;
    if (!employeeAggregates[empId]) {
      employeeAggregates[empId] = { 
        name: ev.employee.name, 
        totalScore: 0, 
        count: 0,
        initials: ev.employee.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()
      };
    }
    employeeAggregates[empId].totalScore += ev.totalScore;
    employeeAggregates[empId].count += 1;
  });

  const topEmployees = Object.entries(employeeAggregates)
    .map(([id, stats]) => ({
      id,
      name: stats.name,
      score: (stats.totalScore / stats.count).toFixed(1),
      initials: stats.initials
    }))
    .sort((a, b) => parseFloat(b.score) - parseFloat(a.score))
    .slice(0, 5)
    .map((emp, index) => ({
      ...emp,
      rank: index + 1,
    }));

  // Score per department for the selected year
  const deptStats: Record<string, { totalScore: number, count: number }> = {};
  evaluations.forEach(ev => {
    const dept = ev.employee.department;
    if (!deptStats[dept]) {
      deptStats[dept] = { totalScore: 0, count: 0 };
    }
    deptStats[dept].totalScore += ev.totalScore;
    deptStats[dept].count += 1;
  });

  // Aggregate recommendation stats and total scores
  let totalCompanyScore = 0;
  let promotionCount = 0;
  let trainingCount = 0;
  const promotedEmployeesMap = new Map();
  const trainingEmployeesMap = new Map();

  // Since we ordered by createdAt desc, the first evaluation seen per employee is their latest.
  evaluations.forEach(ev => {
    totalCompanyScore += ev.totalScore;
    if (ev.recommendation === "Reward / Promosi" || ev.recommendation === "Promosi") {
      promotionCount++;
      if (!promotedEmployeesMap.has(ev.employeeId)) promotedEmployeesMap.set(ev.employeeId, { ...ev.employee, latestEvaluation: ev });
    }
    if (ev.recommendation === "Pelatihan" || ev.recommendation === "Evaluasi Ulang" || ev.recommendation?.includes("Pelatihan") || ev.recommendation?.includes("Evaluasi")) {
      trainingCount++;
      if (!trainingEmployeesMap.has(ev.employeeId)) trainingEmployeesMap.set(ev.employeeId, { ...ev.employee, latestEvaluation: ev });
    }
  });

  const promotedEmployeesList = Array.from(promotedEmployeesMap.values());
  const trainingEmployeesList = Array.from(trainingEmployeesMap.values());

  const averageCompanyScore = evaluations.length > 0 ? (totalCompanyScore / evaluations.length).toFixed(1) : "0.0";

  const departmentScores = Object.entries(deptStats).map(([dept, stats]) => ({
    name: dept,
    count: stats.count,
    averageScore: (stats.totalScore / stats.count).toFixed(1)
  })).sort((a, b) => parseFloat(b.averageScore) - parseFloat(a.averageScore));

  const recentActivities = await prisma.auditLog.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { user: true }
  });

  return {
    totalEmployees,
    totalCriteria,
    totalEvaluated,
    averageCompanyScore,
    promotionCount,
    trainingCount,
    topEmployees,
    departmentScores,
    recentActivities,
    year,
    allEmployeesList,
    promotedEmployeesList,
    trainingEmployeesList
  };
}

export async function getEmployeeDashboardStats(userId: string, year: number = new Date().getFullYear()) {
  const employee = await prisma.employee.findUnique({
    where: { userId: userId },
  });

  if (!employee) {
    return {
      employee: null,
      topEmployees: [],
      evaluations: [],
      year,
      averageScore: 0,
      recommendation: "Tidak ada data"
    };
  }

  // Get employee's evaluations for the year
  const evaluations = await prisma.evaluation.findMany({
    where: {
      employeeId: employee.id,
      period: {
        startDate: {
          gte: new Date(`${year}-01-01`),
          lte: new Date(`${year}-12-31`),
        }
      }
    },
    include: {
      period: true,
      details: {
        include: { indicator: true }
      }
    },
    orderBy: { period: { startDate: 'desc' } }
  });

  const totalScore = evaluations.reduce((sum, ev) => sum + ev.totalScore, 0);
  const averageScore = evaluations.length > 0 ? totalScore / evaluations.length : 0;

  let recommendation = "Belum Ada Penilaian";
  if (evaluations.length > 0) {
    if (averageScore >= 85) recommendation = "REWARD / PROMOSI";
    else if (averageScore >= 70) recommendation = "DIPERTAHANKAN";
    else if (averageScore >= 50) recommendation = "PELATIHAN";
    else recommendation = "EVALUASI ULANG";
  }

  // Get Top Employees
  const allEvaluations = await prisma.evaluation.findMany({
    where: {
      period: {
        startDate: {
          gte: new Date(`${year}-01-01`),
          lte: new Date(`${year}-12-31`),
        }
      }
    },
    include: { employee: true }
  });

  const employeeAggregates: Record<string, { name: string, totalScore: number, count: number, initials: string }> = {};
  allEvaluations.forEach(ev => {
    const empId = ev.employeeId;
    if (!employeeAggregates[empId]) {
      employeeAggregates[empId] = { 
        name: ev.employee.name, 
        totalScore: 0, 
        count: 0,
        initials: ev.employee.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()
      };
    }
    employeeAggregates[empId].totalScore += ev.totalScore;
    employeeAggregates[empId].count += 1;
  });

  const topEmployees = Object.entries(employeeAggregates)
    .map(([id, stats]) => ({
      id,
      name: stats.name,
      score: (stats.totalScore / stats.count).toFixed(1),
      initials: stats.initials
    }))
    .sort((a, b) => parseFloat(b.score) - parseFloat(a.score))
    .slice(0, 5)
    .map((emp, index) => ({
      ...emp,
      rank: index + 1,
    }));

  return {
    employee,
    topEmployees,
    evaluations,
    year,
    averageScore,
    recommendation
  };
}

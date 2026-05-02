"use client";

import { Users, ListChecks, CheckSquare, Trophy, TrendingUp, Calendar } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

const DEPT_COLORS = [
  "bg-blue-500",
  "bg-pink-500",
  "bg-amber-500",
  "bg-emerald-500",
  "bg-purple-500",
  "bg-cyan-500",
  "bg-rose-500",
];

const DEPT_DOT_COLORS = [
  "bg-blue-400",
  "bg-pink-400",
  "bg-amber-400",
  "bg-emerald-400",
  "bg-purple-400",
  "bg-cyan-400",
  "bg-rose-400",
];

const AVATAR_COLORS = [
  "bg-emerald-600",
  "bg-pink-600",
  "bg-amber-600",
  "bg-blue-600",
  "bg-purple-600",
];

export function DashboardClient({
  totalEmployees,
  totalCriteria,
  totalEvaluated,
  topEmployees,
  departmentScores,
  year,
}: {
  totalEmployees: number;
  totalCriteria: number;
  totalEvaluated: number;
  topEmployees: any[];
  departmentScores: any[];
  year: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleYearChange = (newYear: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("year", newYear);
    router.push(`${pathname}?${params.toString()}`);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2000 + 2 }, (_, i) => (2000 + i).toString()).reverse();

  const kpis = [
    {
      title: "Total Karyawan",
      value: totalEmployees.toString(),
      icon: Users,
      iconBg: "bg-blue-500/20",
      iconColor: "text-blue-400",
    },
    {
      title: "Total Indikator",
      value: totalCriteria.toString(),
      icon: ListChecks,
      iconBg: "bg-purple-500/20",
      iconColor: "text-purple-400",
    },
    {
      title: "Sudah Dinilai",
      value: `${totalEvaluated}/${totalEmployees}`,
      icon: CheckSquare,
      iconBg: "bg-emerald-500/20",
      iconColor: "text-emerald-400",
    },
  ];

  const getStatusStyle = (score: number) => {
    if (score >= 75)
      return { label: "Baik", bg: "bg-emerald-500/20", text: "text-emerald-400" };
    if (score >= 55)
      return { label: "Cukup", bg: "bg-amber-500/20", text: "text-amber-400" };
    return { label: "Kurang", bg: "bg-red-500/20", text: "text-red-400" };
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Ringkasan sistem penilaian kinerja DSS.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-3 py-2 shadow-sm">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground mr-2">Tahun:</span>
          <select 
            value={year.toString()}
            onChange={(e) => handleYearChange(e.target.value)}
            className="bg-transparent border-none text-sm font-bold text-primary focus:ring-0 cursor-pointer outline-none"
          >
            {years.map(y => (
              <option key={y} value={y} className="bg-card text-foreground">{y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.title}
              className="bg-card border border-border rounded-2xl p-4 md:p-6 flex items-center gap-4 md:gap-5 shadow-lg shadow-black/10 transition-transform hover:scale-[1.02]"
            >
              <div
                className={`p-3.5 rounded-xl ${kpi.iconBg} flex items-center justify-center`}
              >
                <Icon className={`w-7 h-7 ${kpi.iconColor}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">
                  {kpi.title}
                </p>
                <p className="text-3xl font-bold text-foreground mt-0.5">
                  {kpi.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Karyawan Terbaik */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-4 md:p-6 shadow-lg shadow-black/10">
          <div className="flex items-center gap-2 mb-6">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-foreground">
              Karyawan Terbaik ({year})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-muted-foreground text-xs uppercase tracking-wider">
                  <th className="text-left pb-4 font-medium pl-2">Rank</th>
                  <th className="text-left pb-4 font-medium">Nama</th>
                  <th className="text-left pb-4 font-medium">Skor</th>
                  <th className="text-left pb-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {topEmployees.length > 0 ? (
                  topEmployees.map((emp, idx) => {
                    const scoreNum = parseFloat(emp.score);
                    const status = getStatusStyle(scoreNum);
                    return (
                      <tr
                        key={emp.id}
                        className="hover:bg-accent/30 transition-colors"
                      >
                        <td className="py-4 pl-2">
                          <span className="text-primary font-bold text-lg">
                            {emp.rank}
                          </span>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs ${AVATAR_COLORS[idx % AVATAR_COLORS.length]}`}
                            >
                              {emp.initials}
                            </div>
                            <span className="font-medium text-foreground">
                              {emp.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className="text-primary font-bold text-lg">
                            {emp.score}
                          </span>
                        </td>
                        <td className="py-4">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}
                          >
                            {status.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-12 text-center text-muted-foreground"
                    >
                      Belum ada data evaluasi untuk tahun {year}.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Skor per Departemen */}
        <div className="bg-card border border-border rounded-2xl p-4 md:p-6 shadow-lg shadow-black/10">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">
              Skor per Departemen ({year})
            </h2>
          </div>

          {departmentScores.length > 0 ? (
            <div className="space-y-5">
              {departmentScores.map((dept, idx) => (
                <div key={dept.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${DEPT_DOT_COLORS[idx % DEPT_DOT_COLORS.length]}`}
                      ></div>
                      <span className="text-sm font-medium text-foreground">
                        {dept.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({dept.count} org)
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-muted-foreground">
                      {dept.averageScore}
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${DEPT_COLORS[idx % DEPT_COLORS.length]} transition-all duration-500`}
                      style={{
                        width: `${Math.min(parseFloat(dept.averageScore), 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
              Belum ada data evaluasi per departemen untuk tahun {year}.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

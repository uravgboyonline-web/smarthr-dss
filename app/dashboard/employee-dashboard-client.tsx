"use client";

import { Trophy, TrendingUp, Calendar, AlertCircle, CheckCircle2, User, ListChecks } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export function EmployeeDashboardClient({
  employee,
  topEmployees,
  evaluations,
  year,
  averageScore,
  recommendation,
}: {
  employee: any;
  topEmployees: any[];
  evaluations: any[];
  year: number;
  averageScore: number;
  recommendation: string;
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

  const getRecommendationStyle = () => {
    if (averageScore >= 85) return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    if (averageScore >= 70) return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    return "bg-amber-500/10 text-amber-500 border-amber-500/20";
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard Karyawan</h1>
          <p className="text-muted-foreground mt-1">
            Halo {employee?.name}, berikut adalah ringkasan kinerja Anda.
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profil Singkat */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-lg shadow-black/10 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
            <User className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-bold text-foreground">{employee?.name}</h2>
          <p className="text-muted-foreground">{employee?.position}</p>
          <span className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
            {employee?.department}
          </span>
        </div>

        {/* Rata-Rata Skor */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-lg shadow-black/10 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-muted-foreground">Skor Rata-Rata ({year})</h3>
          </div>
          <div className="text-4xl font-black text-foreground">{averageScore.toFixed(1)}</div>
          <p className="text-sm text-muted-foreground mt-2">Dari total {evaluations.length} penilaian bulan ini.</p>
        </div>

        {/* Rekomendasi */}
        <div className={`bg-card border-2 rounded-2xl p-6 shadow-lg shadow-black/10 flex flex-col justify-center ${getRecommendationStyle()}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              {averageScore >= 70 ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
            </div>
            <h3 className="font-semibold opacity-90">Rekomendasi Karir</h3>
          </div>
          <div className="text-xl font-bold uppercase tracking-wide leading-tight">{recommendation}</div>
        </div>
      </div>

      {/* Karyawan Terbaik & History Penilaian */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Karyawan Terbaik */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-lg shadow-black/10">
          <div className="flex items-center gap-2 mb-6">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-foreground">Top 5 Karyawan Terbaik ({year})</h2>
          </div>
          <div className="space-y-4">
            {topEmployees.length > 0 ? topEmployees.map((emp) => (
              <div key={emp.id} className={`flex items-center justify-between p-3 rounded-xl border ${emp.id === employee?.id ? 'bg-primary/5 border-primary/20' : 'bg-background/50 border-border'}`}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                    {emp.rank}
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground">{emp.name}</p>
                    {emp.id === employee?.id && <span className="text-[10px] text-primary font-semibold">Anda</span>}
                  </div>
                </div>
                <div className="font-bold text-primary">{emp.score}</div>
              </div>
            )) : (
              <p className="text-sm text-muted-foreground">Belum ada data evaluasi tahun ini.</p>
            )}
          </div>
        </div>

        {/* History Penilaian */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-lg shadow-black/10">
          <div className="flex items-center gap-2 mb-6">
            <ListChecks className="w-5 h-5 text-emerald-500" />
            <h2 className="text-lg font-bold text-foreground">Riwayat Penilaian ({year})</h2>
          </div>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {evaluations.length > 0 ? evaluations.map((ev) => (
              <div key={ev.id} className="p-4 rounded-xl border border-border bg-background/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm text-foreground">{ev.period.periodName}</span>
                  <span className="font-bold text-primary">{ev.totalScore}</span>
                </div>
                <div className="space-y-1 mt-3">
                  {ev.details.slice(0,3).map((d: any) => (
                    <div key={d.id} className="flex justify-between text-xs">
                      <span className="text-muted-foreground truncate w-3/4">{d.indicator.name}</span>
                      <span className="font-medium">{d.score}</span>
                    </div>
                  ))}
                  {ev.details.length > 3 && (
                    <div className="text-xs text-primary mt-1 italic">+ {ev.details.length - 3} indikator lainnya</div>
                  )}
                </div>
              </div>
            )) : (
              <p className="text-sm text-muted-foreground">Anda belum menerima penilaian tahun ini.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

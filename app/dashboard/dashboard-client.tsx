"use client";

import { Users, Target, CheckSquare, BarChart, Trophy, TrendingUp, AlertTriangle, ArrowRight, Shield, Award, Activity } from "lucide-react";

export function DashboardClient({ 
  stats, 
  userRole 
}: { 
  stats: any;
  userRole: string;
}) {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 rounded-[2.5rem] p-8 md:p-10 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[150%] bg-white/10 blur-3xl rounded-full transform rotate-12 pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-6 h-6 text-indigo-200" />
            <span className="text-sm font-bold tracking-widest text-indigo-200 uppercase">DSS Analytics Panel</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-4">
            Dashboard Utama
          </h1>
          <p className="text-indigo-100 max-w-2xl text-lg leading-relaxed">
            Pantau aktivitas evaluasi dan performa perusahaan secara real-time. SmartHR DSS membantu Anda membuat keputusan yang lebih cepat, adil, dan berbasis data.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Karyawan", value: stats.totalEmployees, icon: Users, color: "blue" },
          { label: "Rata-Rata Skor Perusahaan", value: stats.averageCompanyScore, icon: BarChart, color: "indigo" },
          { label: "Karyawan Direkomendasikan Promosi", value: stats.promotionCount, icon: Award, color: "emerald" },
          { label: "Karyawan Perlu Pelatihan", value: stats.trainingCount, icon: AlertTriangle, color: "amber" },
        ].map((item, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm shadow-indigo-900/5 hover:shadow-md transition-all">
            <div className={`w-12 h-12 rounded-2xl bg-${item.color}-50 text-${item.color}-600 flex items-center justify-center mb-4`}>
              <item.icon className="w-6 h-6" />
            </div>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">{item.label}</p>
            <h3 className={`text-3xl font-black text-${item.color}-600 mt-1`}>{item.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Employees */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm shadow-indigo-900/5 overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Trophy className="w-6 h-6 text-amber-500" />
                Top Karyawan Terbaik
              </h2>
              <p className="text-sm text-slate-500 mt-1">Berdasarkan akumulasi nilai tertinggi</p>
            </div>
          </div>
          <div className="p-4">
            {stats.topEmployees.length > 0 ? (
              <div className="space-y-2">
                {stats.topEmployees.map((emp: any) => (
                  <div key={emp.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg
                        ${emp.rank === 1 ? "bg-amber-100 text-amber-700" : 
                          emp.rank === 2 ? "bg-slate-200 text-slate-700" : 
                          emp.rank === 3 ? "bg-orange-100 text-orange-700" : 
                          "bg-indigo-50 text-indigo-600"}`}>
                        #{emp.rank}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-lg">{emp.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-500 mb-1">Skor Rata-Rata</p>
                      <div className="text-2xl font-black text-indigo-600">{emp.score}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-10 text-center text-slate-400">Belum ada data evaluasi.</div>
            )}
          </div>
        </div>

        {/* Dept Perform & Activities */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm shadow-indigo-900/5 p-8">
            <h2 className="text-xl font-black text-slate-900 mb-2 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" /> Performa Departemen
            </h2>
            <p className="text-sm text-slate-500 mb-6">Grafik rata-rata skor per departemen</p>
            <div className="space-y-5">
              {stats.departmentScores.length > 0 ? (
                stats.departmentScores.map((dept: any) => (
                  <div key={dept.name}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-bold text-slate-700">{dept.name}</span>
                      <span className="font-black text-indigo-600">{dept.averageScore}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-indigo-500 to-blue-400 h-3 rounded-full transition-all" 
                        style={{ width: `${Math.min(100, parseFloat(dept.averageScore))}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-slate-400 py-4 text-sm">Belum ada data.</div>
              )}
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm shadow-indigo-900/5 p-8">
            <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-600" /> Aktivitas Terbaru
            </h2>
            <div className="space-y-4">
              {stats.recentActivities && stats.recentActivities.length > 0 ? (
                stats.recentActivities.map((log: any) => (
                  <div key={log.id} className="flex gap-3">
                    <div className="w-2 h-2 mt-2 rounded-full bg-indigo-500 shrink-0"></div>
                    <div>
                      <p className="text-sm text-slate-700 leading-relaxed">{log.details}</p>
                      <p className="text-xs font-bold text-slate-400 mt-1" suppressHydrationWarning>
                        Oleh {log.user?.name} · {new Date(log.createdAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-400">Belum ada aktivitas tercatat.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

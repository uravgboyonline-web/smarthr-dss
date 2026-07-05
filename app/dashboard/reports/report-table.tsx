"use client";

import React, { useState } from "react";
import { Search, FileText, ChevronDown, ChevronUp, Printer, Download } from "lucide-react";
import * as XLSX from "xlsx";

const REC_STYLES: Record<string, string> = {
  "Reward / Promosi": "bg-emerald-50 text-emerald-700 border border-emerald-200",
  "Promosi": "bg-emerald-50 text-emerald-700 border border-emerald-200",
  "Reward": "bg-blue-50 text-blue-700 border border-blue-200",
  "Dipertahankan": "bg-blue-50 text-blue-700 border border-blue-200",
  "Pertahankan": "bg-amber-50 text-amber-700 border border-amber-200",
  "Pelatihan": "bg-amber-50 text-amber-700 border border-amber-200",
  "Pelatihan / Evaluasi Ulang": "bg-red-50 text-red-700 border border-red-200",
  "Evaluasi Ulang": "bg-red-50 text-red-700 border border-red-200",
};

export function ReportTable({ reports, periods }: { reports: any[], periods: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPeriod, setFilterPeriod] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const departments = Array.from(new Set(reports.map((r: any) => r.department)));

  const filtered = reports.filter((r: any) => {
    const matchSearch =
      r.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchPeriod = filterPeriod ? r.periodId === filterPeriod : true;
    const matchDept = filterDept ? r.department === filterDept : true;
    return matchSearch && matchPeriod && matchDept;
  });

  const groupedReports = Object.values(
    filtered.reduce((acc: any, r: any) => {
      if (!acc[r.employeeCode]) {
        acc[r.employeeCode] = {
          employeeCode: r.employeeCode,
          employeeName: r.employeeName,
          department: r.department,
          evaluations: []
        };
      }
      acc[r.employeeCode].evaluations.push(r);
      return acc;
    }, {})
  ).map((group: any) => {
    // Sort evaluations by date descending (latest first)
    group.evaluations.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    // Compute average score
    const total = group.evaluations.reduce((sum: number, ev: any) => sum + parseFloat(ev.totalScore), 0);
    group.averageScore = (total / group.evaluations.length).toFixed(1);
    group.latest = group.evaluations[0];
    
    return group;
  }).sort((a: any, b: any) => parseFloat(b.averageScore) - parseFloat(a.averageScore))
    .map((group: any, idx: number) => ({ ...group, rank: idx + 1 }));

  const handlePrint = () => window.print();

  const handleExportExcel = () => {
    // 1. Prepare data with better structure and explanation
    const dataToExport: any[] = [];
    groupedReports.forEach((g: any) => {
      g.evaluations.forEach((r: any) => {
        // Filter human notes (ignore raw AI text)
        let humanNote = r.notes && r.notes !== "-" && !r.notes.startsWith("[ANALISIS AI OTOMATIS]") ? r.notes : "-";

        // Generate explanation based on score and recommendation
        let explanation = "";
        const score = parseFloat(r.totalScore);
        if (score >= 85) explanation = "Sangat Memuaskan (85-100). Melampaui target di sebagian besar/semua aspek.";
        else if (score >= 70) explanation = "Baik (70-84). Kinerja stabil dan memenuhi standar.";
        else if (score >= 50) explanation = "Perlu Perbaikan (50-69). Beberapa aspek belum optimal / di bawah target minimal.";
        else explanation = "Di Bawah Standar (<50). Kinerja tidak memenuhi ekspektasi.";

        dataToExport.push({
          "Kode Karyawan": r.employeeCode,
          "Nama Karyawan": r.employeeName,
          "Departemen": r.department,
          "Periode Evaluasi": r.periodName,
          "Skor Akhir": r.totalScore,
          "Rekomendasi": r.recommendation,
          "Penjelasan Rekomendasi": explanation,
          "Penilai": r.evaluatorName,
          "Catatan Penilai": humanNote
        });
      });
    });

    // 2. Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);

    // 3. Set column widths for better readability
    worksheet["!cols"] = [
      { wch: 15 }, // Kode
      { wch: 25 }, // Nama
      { wch: 18 }, // Dept
      { wch: 20 }, // Periode
      { wch: 12 }, // Skor
      { wch: 20 }, // Rekomendasi
      { wch: 60 }, // Penjelasan (Lebar)
      { wch: 20 }, // Penilai
      { wch: 40 }, // Catatan
    ];

    // 4. Export
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Evaluasi");
    XLSX.writeFile(workbook, `Laporan_Evaluasi_Kinerja_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Laporan Penilaian</h1>
          <p className="text-sm text-slate-500 mt-1">Rekap performa karyawan berdasarkan riwayat evaluasi.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={handleExportExcel}
            className="flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 px-5 py-2.5 rounded-2xl text-sm font-bold hover:bg-emerald-100 transition-all shadow-sm">
            <Download className="w-4 h-4" /> Export Excel
          </button>
          <button onClick={handlePrint}
            className="flex items-center gap-2 bg-slate-50 text-slate-700 border border-slate-200 px-5 py-2.5 rounded-2xl text-sm font-bold hover:bg-slate-100 transition-all shadow-sm">
            <Printer className="w-4 h-4" /> Cetak (PDF)
          </button>
        </div>
      </div>

      <div className="hidden print:block mb-8 text-center">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">Laporan Evaluasi Kinerja</h1>
        <p className="text-slate-500 mt-2">Dicetak pada: {new Date().toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>

      {/* Kriteria Rekomendasi */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-6 print:border-none print:shadow-none print:p-0 print:mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
            <span className="text-indigo-600 text-xs font-black">?</span>
          </div>
          <h3 className="font-black text-slate-800">Dasar Penentuan Rekomendasi</h3>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Rekomendasi ditentukan otomatis berdasarkan <strong>Total Skor Terbobot Akhir</strong> — 
          yaitu penjumlahan (Nilai Indikator × Bobot%) dari semua indikator. 
          Jika ada indikator di bawah <em>Target Minimal</em>, rekomendasi diturunkan ke &quot;Pelatihan&quot; meskipun total skor tinggi.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { rec: "Promosi / Reward", range: "85 – 100", color: "bg-emerald-50 border-emerald-200 text-emerald-800", badge: "bg-emerald-100 text-emerald-700", desc: "Kinerja sangat baik di semua indikator & melampaui target. Layak promosi jabatan atau reward.", icon: "🏆" },
            { rec: "Dipertahankan", range: "70 – 84", color: "bg-blue-50 border-blue-200 text-blue-800", badge: "bg-blue-100 text-blue-700", desc: "Kinerja baik dan stabil. Memenuhi standar, direkomendasikan tetap di posisi saat ini.", icon: "✅" },
            { rec: "Pelatihan", range: "50 – 69", color: "bg-amber-50 border-amber-200 text-amber-800", badge: "bg-amber-100 text-amber-700", desc: "Ada aspek yang belum optimal atau tidak memenuhi target minimal. Perlu program pelatihan.", icon: "📚" },
            { rec: "Evaluasi Ulang", range: "0 – 49", color: "bg-red-50 border-red-200 text-red-800", badge: "bg-red-100 text-red-700", desc: "Kinerja di bawah standar minimum. Perlu evaluasi menyeluruh dan tindak lanjut manajemen.", icon: "⚠️" },
          ].map((item) => (
            <div key={item.rec} className={`rounded-2xl border p-4 ${item.color}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{item.icon}</span>
                <span className={`text-xs font-black px-2 py-0.5 rounded-lg ${item.badge}`}>{item.rec}</span>
              </div>
              <div className="text-xl font-black mb-1">{item.range}</div>
              <p className="text-[11px] leading-relaxed opacity-80">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
          <strong>Catatan:</strong> Jika karyawan gagal memenuhi Target Minimal salah satu indikator 
          (contoh: Bobot 30%, Target Min 20%, capaian hanya 12%), status otomatis turun ke <strong>&quot;Pelatihan&quot;</strong> meskipun total skor akhirnya tinggi.
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden print:border-none print:shadow-none print:overflow-visible">
        {/* Filters */}
        <div className="p-5 border-b border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 bg-slate-50/50 print:hidden">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Cari nama / departemen..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 pr-4 py-3 w-full border border-slate-200 bg-white rounded-2xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <select value={filterPeriod} onChange={(e) => setFilterPeriod(e.target.value)}
            className="px-4 py-3 border border-slate-200 bg-white rounded-2xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="">Semua Periode (Pencarian)</option>
            {periods.map((p: any) => <option key={p.id} value={p.id}>{p.periodName}</option>)}
          </select>
          <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)}
            className="px-4 py-3 border border-slate-200 bg-white rounded-2xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="">Semua Departemen</option>
            {departments.map((d: string) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto print:overflow-visible">
          <table className="w-full text-sm text-left print:text-xs">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider w-16">Rank</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Karyawan</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Rata-Rata Skor</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Penilaian Terakhir</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Rekomendasi Terkini</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center print:hidden">Riwayat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {groupedReports.map((g: any) => (
                <React.Fragment key={g.employeeCode}>
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-black text-slate-400 text-lg text-center">{g.rank}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{g.employeeName}</div>
                      <div className="text-xs text-slate-500">{g.department}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-indigo-600 font-black text-xl">{g.averageScore}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">
                      {g.latest?.periodName}
                      <div className="text-xs text-slate-400 font-normal">Skor: {g.latest?.totalScore}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold ${REC_STYLES[g.latest?.recommendation] || "bg-slate-100 text-slate-500"}`}>
                        {g.latest?.recommendation}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center print:hidden">
                      <button onClick={() => setExpandedRow(expandedRow === g.employeeCode ? null : g.employeeCode)}
                        className="flex items-center justify-center w-full gap-2 px-3 py-2 text-indigo-600 font-bold bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-all">
                        {g.evaluations.length} Data {expandedRow === g.employeeCode ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </td>
                  </tr>
                  
                  {expandedRow === g.employeeCode && (
                    <tr className="bg-slate-50 border-t border-slate-100 shadow-inner">
                      <td colSpan={6} className="px-8 py-8">
                        <div className="max-w-5xl mx-auto space-y-6">
                          <h4 className="text-sm font-black text-slate-800 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-indigo-500" /> Riwayat Evaluasi: {g.employeeName}
                          </h4>
                          
                          {g.evaluations.map((ev: any) => (
                            <div key={ev.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                              <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
                                <div>
                                  <div className="font-bold text-slate-800 text-base">{ev.periodName}</div>
                                  <div className="text-xs text-slate-500 mt-1">Penilai: <span className="font-semibold text-slate-600">{ev.evaluatorName}</span></div>
                                </div>
                                <div className="flex items-center gap-4">
                                  <div className="text-right">
                                    <div className="text-xs font-bold text-slate-400 uppercase">Skor</div>
                                    <div className="text-2xl font-black text-indigo-600 leading-none">{ev.totalScore}</div>
                                  </div>
                                  <div className={`px-4 py-2 rounded-xl text-xs font-bold ${REC_STYLES[ev.recommendation]}`}>
                                    {ev.recommendation}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="p-5">
                                <table className="w-full text-xs">
                                  <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                      <th className="px-4 py-3 text-left font-bold text-slate-500">Indikator</th>
                                      <th className="px-4 py-3 text-left font-bold text-slate-500">Kategori</th>
                                      <th className="px-4 py-3 text-center font-bold text-slate-500">Bobot</th>
                                      <th className="px-4 py-3 text-center font-bold text-slate-500">Skor Mentah</th>
                                      <th className="px-4 py-3 text-center font-bold text-slate-500">Nilai Terbobot</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100">
                                    {ev.details.map((d: any, i: number) => {
                                      let subs: any[] = [];
                                      try { if (d.subScores) subs = JSON.parse(d.subScores); } catch {}
                                      return (
                                        <React.Fragment key={i}>
                                          <tr className={`hover:bg-slate-50/50 ${d.score < 70 ? "bg-red-50/30" : ""}`}>
                                            <td className="px-4 py-3 font-semibold text-slate-700">
                                              {d.indicatorName}
                                              {d.score < 70 && <span className="ml-2 text-[10px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded">⚠ Rendah</span>}
                                            </td>
                                            <td className="px-4 py-3">
                                              <span className={`px-2 py-1 rounded-lg font-bold text-[10px] ${d.indicatorType === "Kinerja" ? "bg-blue-50 text-blue-600" : d.indicatorType === "Leadership" ? "bg-amber-50 text-amber-600" : "bg-purple-50 text-purple-600"}`}>
                                                {d.indicatorType}
                                              </span>
                                            </td>
                                            <td className="px-4 py-3 text-center text-slate-500 font-medium">{d.weight}%</td>
                                            <td className="px-4 py-3 text-center font-bold text-slate-800">{d.score}</td>
                                            <td className="px-4 py-3 text-center font-black text-indigo-600">{d.weightedScore}</td>
                                          </tr>
                                          {subs.length > 0 && (
                                            <tr className="bg-indigo-50/20">
                                              <td colSpan={5} className="px-6 py-3">
                                                <div className="ml-2 space-y-1.5">
                                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Sub-Indikator:</p>
                                                  {subs.map((s: any, si: number) => {
                                                    const perc = s.weight > 0 ? (s.score / s.weight) * 100 : 0;
                                                    return (
                                                      <div key={si} className="flex items-center gap-3">
                                                        <span className="text-[10px] text-slate-400 w-4 font-bold">{si + 1}.</span>
                                                        <span className="text-[11px] text-slate-600 flex-1 font-medium">{s.name}</span>
                                                        <div className="flex items-center gap-2">
                                                          <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                                            <div className={`h-full rounded-full ${perc >= 80 ? "bg-emerald-500" : perc >= 60 ? "bg-blue-500" : "bg-red-400"}`} style={{ width: `${Math.min(perc, 100)}%` }} />
                                                          </div>
                                                          <span className={`text-[10px] font-black ${perc >= 80 ? "text-emerald-600" : perc >= 60 ? "text-blue-600" : "text-red-500"}`}>{s.score}/{s.weight || "?"}</span>
                                                        </div>
                                                      </div>
                                                    );
                                                  })}
                                                </div>
                                              </td>
                                            </tr>
                                          )}
                                        </React.Fragment>
                                      );
                                    })}
                                  </tbody>
                                </table>
                                
                                {/* Only show Catatan Penilai if it's a real human note, not AI-generated text */}
                                {ev.notes && ev.notes !== "-" && !ev.notes.startsWith("[ANALISIS AI OTOMATIS]") && (
                                  <div className="mt-4 pt-4 border-t border-slate-100">
                                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Catatan Penilai</h4>
                                    <p className="text-sm text-slate-600 bg-slate-50 rounded-xl p-4 border border-slate-100">
                                      {ev.notes}
                                    </p>
                                  </div>
                                )}

                                {/* Recommendation Rationale Panel */}
                                <div className="mt-4 pt-4 border-t border-slate-100">
                                  <h4 className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider mb-3">📊 Mengapa Rekomendasi &quot;{ev.recommendation}&quot;?</h4>
                                  <div className={`rounded-2xl p-4 border text-sm leading-relaxed ${REC_STYLES[ev.recommendation] || "bg-slate-50 border-slate-200 text-slate-700"}`}>
                                    {/* Summary */}
                                    <p className="font-semibold mb-3">
                                      Berdasarkan evaluasi periode <strong>{ev.periodName}</strong>, karyawan ini memperoleh total skor terbobot <strong>{ev.totalScore}</strong> dari 100.
                                      {ev.recommendation === "Promosi" || ev.recommendation === "Reward / Promosi" ? " Skor ini berada di rentang 85–100, menandakan kinerja yang sangat memuaskan dan melampaui target di seluruh aspek penilaian." : ""}
                                      {ev.recommendation === "Dipertahankan" || ev.recommendation === "Reward" ? " Skor ini berada di rentang 70–84, menandakan kinerja yang baik dan stabil." : ""}
                                      {ev.recommendation === "Pelatihan" ? " Skor ini berada di rentang 50–69, atau terdapat indikator yang tidak memenuhi target minimal." : ""}
                                      {ev.recommendation === "Evaluasi Ulang" ? " Skor ini berada di bawah 50, menandakan kinerja yang perlu perhatian serius dari manajemen." : ""}
                                    </p>
                                    {/* Per-indicator highlights */}
                                    <div className="space-y-1.5">
                                      {ev.details.map((d: any, di: number) => {
                                        const ws = parseFloat(d.weightedScore);
                                        const pct = d.weight > 0 ? (ws / d.weight) * 100 : 0;
                                        const statusText = pct >= 85 ? "✅ Sangat Baik" : pct >= 70 ? "✔ Baik" : pct >= 50 ? "⚠ Perlu Ditingkatkan" : "❌ Di Bawah Standar";
                                        return (
                                          <div key={di} className="flex items-center justify-between gap-2 text-xs">
                                            <span className="font-semibold">{d.indicatorName}</span>
                                            <span className="flex items-center gap-2">
                                              <span className="opacity-70">{d.weightedScore}/{d.weight} terbobot</span>
                                              <span className="font-bold">{statusText}</span>
                                            </span>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                </div>

                                {/* Analisis Sistem raw text is intentionally hidden — info already shown in the rationale panel above */}
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {groupedReports.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-slate-400 text-sm">Tidak ada data laporan ditemukan.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-5 border-t border-slate-100 text-sm font-medium text-slate-500">
          Menampilkan {groupedReports.length} karyawan terdaftar dari {reports.length} total riwayat evaluasi.
        </div>
      </div>
    </div>
  );
}

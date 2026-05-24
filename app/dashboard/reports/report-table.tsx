"use client";

import React, { useState } from "react";
import { Search, FileText, ChevronDown, ChevronUp, Printer, Download } from "lucide-react";
import * as XLSX from "xlsx";

const REC_STYLES: Record<string, string> = {
  Promosi: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Reward: "bg-blue-50 text-blue-700 border border-blue-200",
  Pertahankan: "bg-amber-50 text-amber-700 border border-amber-200",
  "Pelatihan / Evaluasi Ulang": "bg-red-50 text-red-700 border border-red-200",
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
    const dataToExport: any[] = [];
    groupedReports.forEach((g: any) => {
      g.evaluations.forEach((r: any) => {
        dataToExport.push({
          "Kode Karyawan": r.employeeCode,
          "Nama Karyawan": r.employeeName,
          "Departemen": r.department,
          "Periode Evaluasi": r.periodName,
          "Skor Mentah Total": r.totalScore,
          "Rekomendasi": r.recommendation,
          "Penilai": r.evaluatorName,
          "Catatan": r.notes
        });
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Penilaian");
    XLSX.writeFile(workbook, `Laporan_Penilaian_SmartHR_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
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

      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
        {/* Filters */}
        <div className="p-5 border-b border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 bg-slate-50/50">
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
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider w-16">Rank</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Karyawan</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Rata-Rata Skor</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Penilaian Terakhir</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Rekomendasi Terkini</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Riwayat</th>
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
                    <td className="px-6 py-4 text-center">
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
                                    {ev.details.map((d: any, i: number) => (
                                      <tr key={i} className="hover:bg-slate-50/50">
                                        <td className="px-4 py-3 font-semibold text-slate-700">{d.indicatorName}</td>
                                        <td className="px-4 py-3">
                                          <span className={`px-2 py-1 rounded-lg font-bold text-[10px] ${d.indicatorType === "Kinerja" ? "bg-blue-50 text-blue-600" : d.indicatorType === "Leadership" ? "bg-amber-50 text-amber-600" : "bg-purple-50 text-purple-600"}`}>
                                            {d.indicatorType}
                                          </span>
                                        </td>
                                        <td className="px-4 py-3 text-center text-slate-500 font-medium">{d.weight}%</td>
                                        <td className="px-4 py-3 text-center font-bold text-slate-800">{d.score}</td>
                                        <td className="px-4 py-3 text-center font-black text-indigo-600">{d.weightedScore}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                                
                                {ev.notes && ev.notes !== "-" && (
                                  <div className="mt-4 pt-4 border-t border-slate-100">
                                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Catatan Penilai</h4>
                                    <p className="text-sm text-slate-600 bg-slate-50 rounded-xl p-4 border border-slate-100">
                                      {ev.notes}
                                    </p>
                                  </div>
                                )}
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

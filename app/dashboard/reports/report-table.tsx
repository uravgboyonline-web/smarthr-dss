"use client";

import { useState } from "react";
import { Search, FileText, ChevronDown, ChevronUp, Printer } from "lucide-react";

const REC_STYLES: Record<string, string> = {
  Promosi: "bg-emerald-500/20 text-emerald-400",
  Reward: "bg-blue-500/20 text-blue-400",
  Pertahankan: "bg-amber-500/20 text-amber-400",
  "Pelatihan / Evaluasi Ulang": "bg-red-500/20 text-red-400",
};

export function ReportTable({
  reports,
  periods,
}: {
  reports: any[];
  periods: any[];
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPeriod, setFilterPeriod] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const departments = [...new Set(reports.map((r: any) => r.department))];

  const filtered = reports.filter((r: any) => {
    const matchSearch =
      r.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchPeriod = filterPeriod ? r.periodId === filterPeriod : true;
    const matchDept = filterDept ? r.department === filterDept : true;
    return matchSearch && matchPeriod && matchDept;
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Laporan Penilaian
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Rekap hasil evaluasi kinerja dan perilaku karyawan.
          </p>
        </div>
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Printer className="w-4 h-4" />
          Cetak Laporan
        </button>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-lg shadow-black/10 overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-3 items-center">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari nama / departemen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 w-full border border-border bg-background rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <select
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value)}
            className="border border-border bg-background rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="">Semua Periode</option>
            {periods.map((p: any) => (
              <option key={p.id} value={p.id}>
                {p.periodName}
              </option>
            ))}
          </select>
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="border border-border bg-background rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="">Semua Departemen</option>
            {departments.map((d: string) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase border-b border-border">
              <tr>
                <th className="px-5 py-4 font-medium">#</th>
                <th className="px-5 py-4 font-medium">Karyawan</th>
                <th className="px-5 py-4 font-medium">Departemen</th>
                <th className="px-5 py-4 font-medium">Periode</th>
                <th className="px-5 py-4 font-medium">Skor</th>
                <th className="px-5 py-4 font-medium">Rekomendasi</th>
                <th className="px-5 py-4 font-medium">Penilai</th>
                <th className="px-5 py-4 font-medium text-center">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((r: any) => (
                <>
                  <tr
                    key={r.id}
                    className="hover:bg-accent/30 transition-colors"
                  >
                    <td className="px-5 py-4 text-muted-foreground">
                      {r.rank}
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-medium text-foreground">
                        {r.employeeName}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {r.employeeCode}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-foreground">
                      {r.department}
                    </td>
                    <td className="px-5 py-4 text-foreground">
                      {r.periodName}
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-primary font-bold text-base">
                        {r.totalScore}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${REC_STYLES[r.recommendation] || "bg-muted text-muted-foreground"}`}
                      >
                        {r.recommendation}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground text-xs">
                      {r.evaluatorName}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={() =>
                          setExpandedRow(
                            expandedRow === r.id ? null : r.id
                          )
                        }
                        className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
                      >
                        {expandedRow === r.id ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                  {expandedRow === r.id && (
                    <tr key={`${r.id}-detail`}>
                      <td
                        colSpan={8}
                        className="px-5 py-4 bg-background/50"
                      >
                        <div className="max-w-xl">
                          <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-3 font-medium">
                            Rincian Skor per Indikator
                          </h4>
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="text-muted-foreground">
                                <th className="text-left pb-2">Indikator</th>
                                <th className="text-left pb-2">Jenis</th>
                                <th className="text-center pb-2">Bobot</th>
                                <th className="text-center pb-2">Skor</th>
                                <th className="text-center pb-2">
                                  Nilai Terbobot
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                              {r.details.map((d: any, i: number) => (
                                <tr key={i}>
                                  <td className="py-2 text-foreground">
                                    {d.indicatorName}
                                  </td>
                                  <td className="py-2">
                                    <span
                                      className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${d.indicatorType === "Kinerja" ? "bg-blue-500/20 text-blue-400" : "bg-purple-500/20 text-purple-400"}`}
                                    >
                                      {d.indicatorType}
                                    </span>
                                  </td>
                                  <td className="py-2 text-center text-muted-foreground">
                                    {d.weight}%
                                  </td>
                                  <td className="py-2 text-center text-foreground font-medium">
                                    {d.score}
                                  </td>
                                  <td className="py-2 text-center text-primary font-bold">
                                    {d.weightedScore}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          {r.notes !== "-" && (
                            <div className="mt-3 pt-3 border-t border-border">
                              <span className="text-muted-foreground text-xs">
                                Catatan:{" "}
                              </span>
                              <span className="text-foreground text-xs">
                                {r.notes}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-12 text-center text-muted-foreground"
                  >
                    Tidak ada data laporan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border text-sm text-muted-foreground">
          Menampilkan {filtered.length} dari {reports.length} data evaluasi.
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Search, Plus, Trash2, Target, CheckCircle2, Info, BrainCircuit, Pencil } from "lucide-react";
import { createIndicator, deleteIndicator } from "@/app/actions/indicator";

const TYPE_CONFIG: Record<string, { color: string; label: string }> = {
  "Kinerja":    { color: "bg-blue-100 text-blue-700 border-blue-200",       label: "Kinerja" },
  "Perilaku":   { color: "bg-purple-100 text-purple-700 border-purple-200",  label: "Perilaku" }
};

const METHOD_CONFIG: Record<string, { color: string }> = {
  "Manual": { color: "bg-slate-100 text-slate-600 border-slate-200" },
  "AI":     { color: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  "Hybrid": { color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
};

export function IndicatorTable({ initialIndicators }: { initialIndicators: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [indicators, setIndicators] = useState(initialIndicators);

  const totalWeight = indicators.filter(i => i.status !== "Nonaktif").reduce((s, i) => s + i.weight, 0);

  const filtered = indicators.filter(ind => {
    const matchSearch = ind.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ind.description || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterType ? ind.type === filterType : true;
    return matchSearch && matchType;
  });

  const kinerjaSummary = indicators.filter(i => i.type === "Kinerja").map(i => i.name);
  const perilakuSummary = indicators.filter(i => i.type === "Perilaku").map(i => i.name);

  async function handleAdd(formData: FormData) {
    await createIndicator(formData);
    setIsModalOpen(false);
    window.location.reload();
  }

  async function handleDelete(id: string) {
    if (confirm("Yakin hapus indikator ini?")) {
      await deleteIndicator(id);
      setIndicators(prev => prev.filter(i => i.id !== id));
    }
  }

  return (
    <div className="space-y-6">
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 border border-slate-100">
            <h2 className="text-xl font-black text-slate-900 mb-1">Tambah Indikator Baru</h2>
            <p className="text-sm text-slate-500 mb-6">Lengkapi data indikator penilaian karyawan.</p>
            <form action={handleAdd} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Nama Indikator</label>
                <input name="name" type="text" required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Contoh: Pencapaian Target" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Kategori</label>
                  <select name="type"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="Kinerja">Kinerja</option>
                    <option value="Perilaku">Perilaku</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Metode</label>
                  <select name="evaluationMethod"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="Manual">Manual</option>
                    <option value="AI">AI</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Bobot (%)</label>
                  <input name="weight" type="number" min="1" max="100" required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="20" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Status</label>
                  <select name="status"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="Aktif">Aktif</option>
                    <option value="Nonaktif">Nonaktif</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Deskripsi Indikator</label>
                <textarea name="description" rows={3}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  placeholder="Jelaskan secara detail apa yang dinilai dari indikator ini..." />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-slate-200 rounded-2xl text-slate-600 font-semibold hover:bg-slate-50 transition-all">
                  Batal
                </button>
                <button type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-bold rounded-2xl shadow-lg hover:scale-[1.02] transition-all">
                  Simpan Indikator
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Manajemen Indikator Penilaian</h1>
          <p className="text-sm text-slate-500 mt-1">Kelola indikator evaluasi untuk kategori Kinerja dan Perilaku.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-5 py-3 rounded-2xl text-sm font-bold shadow-lg shadow-indigo-200 hover:scale-[1.02] transition-all whitespace-nowrap">
          <Plus className="w-4 h-4" /> Tambah Indikator
        </button>
      </div>

      {/* Bobot Monitor */}
      <div className={`p-5 rounded-2xl border-2 flex items-center justify-between ${totalWeight === 100 ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200"}`}>
        <div className="flex items-center gap-3">
          {totalWeight === 100
            ? <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            : <Info className="w-5 h-5 text-amber-600" />}
          <div>
            <div className={`font-bold text-sm ${totalWeight === 100 ? "text-emerald-700" : "text-amber-700"}`}>
              {totalWeight === 100 ? "Total bobot sudah tepat 100%" : `Total bobot saat ini: ${totalWeight}% (harus = 100%)`}
            </div>
            <div className="text-xs text-slate-500">Aturan: Total bobot seluruh indikator aktif harus = 100%</div>
          </div>
        </div>
        <div className={`text-3xl font-black ${totalWeight === 100 ? "text-emerald-600" : "text-amber-600"}`}>{totalWeight}%</div>
      </div>

      {/* Kategori Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { label: "Kinerja", items: kinerjaSummary, color: "blue", icon: Target },
          { label: "Perilaku", items: perilakuSummary, color: "purple", icon: CheckCircle2 },
        ].map(cat => (
          <div key={cat.label} className={`bg-${cat.color}-50 border border-${cat.color}-100 rounded-2xl p-5`}>
            <div className="flex items-center gap-2 mb-3">
              <cat.icon className={`w-4 h-4 text-${cat.color}-600`} />
              <span className={`font-bold text-sm text-${cat.color}-700`}>Indikator {cat.label}</span>
              <span className={`ml-auto text-xs font-bold bg-${cat.color}-100 text-${cat.color}-700 px-2 py-0.5 rounded-full`}>{cat.items.length}</span>
            </div>
            {cat.items.length === 0 ? (
              <p className="text-xs text-slate-400 italic">Belum ada indikator</p>
            ) : (
              <ul className="space-y-1">
                {cat.items.map(item => (
                  <li key={item} className="text-xs text-slate-600 flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full bg-${cat.color}-400`}></span>{item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Cari indikator..."
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              className="pl-11 pr-4 py-3 w-full bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <select value={filterType} onChange={e => setFilterType(e.target.value)}
            className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="">Semua Kategori</option>
            <option value="Kinerja">Kinerja</option>
            <option value="Perilaku">Perilaku</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Nama Indikator</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Kategori</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Metode</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Bobot</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((ind) => {
                const typeConf = TYPE_CONFIG[ind.type] || { color: "bg-slate-100 text-slate-600", label: ind.type };
                const methodConf = METHOD_CONFIG[ind.evaluationMethod || "Manual"] || METHOD_CONFIG["Manual"];
                return (
                  <tr key={ind.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-5">
                      <div className="font-bold text-slate-800">{ind.name}</div>
                      {ind.description && (
                        <div className="text-xs text-slate-500 mt-1 max-w-sm leading-relaxed">{ind.description}</div>
                      )}
                      <div className="text-xs text-slate-400 mt-1">Skala: 0 – 100</div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-bold ${typeConf.color}`}>
                        <Target className="w-3 h-3" /> {typeConf.label}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-xl border text-xs font-bold ${methodConf.color}`}>
                        {ind.evaluationMethod || "Manual"}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="font-black text-indigo-600 text-lg">{ind.weight}%</div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-bold ${ind.status === "Nonaktif" ? "bg-red-50 text-red-600 border-red-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${ind.status === "Nonaktif" ? "bg-red-500" : "bg-emerald-500"}`}></span>
                        {ind.status || "Aktif"}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button onClick={() => handleDelete(ind.id)}
                        className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-slate-400 text-sm">
                    Tidak ada data indikator ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-slate-100 text-xs text-slate-400">
          Menampilkan {filtered.length} dari {indicators.length} indikator
        </div>
      </div>

      {/* Rumus DSS */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
        <h3 className="font-black text-slate-800 mb-4">Rumus Perhitungan DSS</h3>
        <div className="bg-indigo-50 rounded-2xl p-5 border border-indigo-100 mb-4">
          <div className="font-mono text-indigo-700 font-bold text-center text-lg">
            Skor Akhir = Σ (Nilai Indikator × Bobot)
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase">Range Nilai</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase">Rekomendasi</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { range: "85 – 100", rec: "Promosi", desc: "Karyawan menunjukkan performa sangat baik", color: "text-emerald-600 bg-emerald-50" },
                { range: "70 – 84", rec: "Reward", desc: "Karyawan berprestasi dan layak mendapat reward", color: "text-blue-600 bg-blue-50" },
                { range: "55 – 69", rec: "Evaluasi Ulang", desc: "Karyawan perlu ditinjau lebih lanjut", color: "text-amber-600 bg-amber-50" },
                { range: "< 55", rec: "Pelatihan", desc: "Karyawan memerlukan program pelatihan tambahan", color: "text-red-600 bg-red-50" },
              ].map(row => (
                <tr key={row.rec}>
                  <td className="px-4 py-3 font-mono font-bold text-slate-700">{row.range}</td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold ${row.color}`}>{row.rec}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{row.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

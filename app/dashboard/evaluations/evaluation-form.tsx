"use client";

import { useState, useEffect } from "react";
import { createEvaluation, checkExistingEvaluation } from "@/app/actions/evaluation";
import { useSession } from "next-auth/react";
import { AlertCircle } from "lucide-react";

export function EvaluationForm({ 
  employees, 
  indicators
}: { 
  employees: any[], 
  indicators: any[]
}) {
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString());
  const [notes, setNotes] = useState("");
  const [scores, setScores] = useState<Record<string, number>>({});

  const years = Array.from({ length: new Date().getFullYear() - 2000 + 2 }, (_, i) => (2000 + i).toString()).reverse();
  const months = [
    { value: "1", label: "Januari" },
    { value: "2", label: "Februari" },
    { value: "3", label: "Maret" },
    { value: "4", label: "April" },
    { value: "5", label: "Mei" },
    { value: "6", label: "Juni" },
    { value: "7", label: "Juli" },
    { value: "8", label: "Agustus" },
    { value: "9", label: "September" },
    { value: "10", label: "Oktober" },
    { value: "11", label: "November" },
    { value: "12", label: "Desember" },
  ];

  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    async function loadExisting() {
      if (!selectedEmployee || !selectedYear || !selectedMonth) {
        setIsEdit(false);
        setScores({});
        setNotes("");
        return;
      }
      
      const existing = await checkExistingEvaluation(selectedEmployee, parseInt(selectedYear), parseInt(selectedMonth));
      if (existing) {
        setIsEdit(true);
        setNotes(existing.notes || "");
        const loadedScores: Record<string, number> = {};
        existing.details.forEach((d: any) => {
          loadedScores[d.indicatorId] = d.score;
        });
        setScores(loadedScores);
      } else {
        setIsEdit(false);
        setScores({});
        setNotes("");
      }
    }
    loadExisting();
  }, [selectedEmployee, selectedYear, selectedMonth]);

  const handleScoreChange = (indicatorId: string, value: string) => {
    const numValue = parseInt(value);
    setScores(prev => ({
      ...prev,
      [indicatorId]: isNaN(numValue) ? 0 : numValue
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee) return alert("Pilih Karyawan!");
    if (!session?.user?.email) return alert("Silakan login ulang!");

    setIsSubmitting(true);
    try {
      await createEvaluation({
        employeeId: selectedEmployee,
        evaluatorEmail: session.user.email,
        year: parseInt(selectedYear),
        month: parseInt(selectedMonth),
        notes,
        scores
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setScores({});
      setNotes("");
      setSelectedEmployee("");
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat menyimpan penilaian.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculatePreviewScore = () => {
    let total = 0;
    indicators.forEach(ind => {
      const score = scores[ind.id] || 0;
      total += (score * ind.weight) / 100;
    });
    return total.toFixed(2);
  };

  const previewScore = parseFloat(calculatePreviewScore());
  const getRecommendation = () => {
    if (previewScore >= 85) return { label: "Promosi", color: "text-emerald-700 bg-emerald-50 border-emerald-200" };
    if (previewScore >= 70) return { label: "Reward", color: "text-blue-700 bg-blue-50 border-blue-200" };
    if (previewScore >= 55) return { label: "Pertahankan", color: "text-amber-700 bg-amber-50 border-amber-200" };
    return { label: "Pelatihan", color: "text-red-700 bg-red-50 border-red-200" };
  };

  const activeIndicators = indicators.filter(i => i.status !== "Nonaktif");
  const kinerjaInd = activeIndicators.filter(i => i.type === "Kinerja");
  const perilakuInd = activeIndicators.filter(i => i.type === "Perilaku");

  return (
    <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm shadow-indigo-900/5 p-6 md:p-10">
      <div className="mb-8 border-b border-slate-100 pb-6">
        <h2 className="text-2xl font-black text-slate-900">Input Penilaian Manual</h2>
        <p className="text-slate-500 mt-2">Formulir evaluasi kinerja, perilaku, dan leadership karyawan secara manual.</p>
      </div>

      {success && (
        <div className="mb-8 p-5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl font-bold flex items-center gap-3 animate-fade-in">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">✓</div>
          Penilaian berhasil disimpan ke database!
        </div>
      )}

      {isEdit && !success && (
        <div className="mb-8 p-5 bg-amber-50 border border-amber-200 text-amber-700 rounded-2xl text-sm font-semibold flex items-center gap-3 animate-fade-in">
          <AlertCircle className="w-5 h-5 text-amber-600" />
          Karyawan ini sudah dinilai pada periode tersebut. Menyimpan akan menimpa data lama.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block ml-1">Karyawan</label>
            <select required value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-inner"
            >
              <option value="">Pilih Karyawan...</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name} ({emp.department})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block ml-1">Bulan</label>
            <select required value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-inner"
            >
              {months.map(m => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block ml-1">Tahun</label>
            <select required value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-inner"
            >
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100">
          <h3 className="text-lg font-black text-slate-800 mb-6">Input Skor Indikator (0-100)</h3>
          
          <div className="space-y-8">
            {kinerjaInd.length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span> Indikator Kinerja
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {kinerjaInd.map(ind => (
                    <div key={ind.id} className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                      <div className="flex-1">
                        <div className="font-bold text-slate-800">{ind.name}</div>
                        {ind.description && <div className="text-xs text-slate-500 mt-1">{ind.description}</div>}
                        <div className="text-xs font-bold text-indigo-600 mt-2 bg-indigo-50 inline-block px-2 py-0.5 rounded-md">Bobot: {ind.weight}%</div>
                      </div>
                      <input type="number" min="0" max="100" required
                        value={scores[ind.id] ?? ""}
                        onChange={(e) => handleScoreChange(ind.id, e.target.value)}
                        className="w-24 px-4 py-3 border border-slate-200 bg-slate-50 rounded-xl text-center font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="0" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {perilakuInd.length > 0 && (
              <div className="pt-4">
                <h4 className="text-sm font-bold text-purple-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span> Indikator Perilaku
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {perilakuInd.map(ind => (
                    <div key={ind.id} className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                      <div className="flex-1">
                        <div className="font-bold text-slate-800">{ind.name}</div>
                        {ind.description && <div className="text-xs text-slate-500 mt-1">{ind.description}</div>}
                        <div className="text-xs font-bold text-indigo-600 mt-2 bg-indigo-50 inline-block px-2 py-0.5 rounded-md">Bobot: {ind.weight}%</div>
                      </div>
                      <input type="number" min="0" max="100" required
                        value={scores[ind.id] ?? ""}
                        onChange={(e) => handleScoreChange(ind.id, e.target.value)}
                        className="w-24 px-4 py-3 border border-slate-200 bg-slate-50 rounded-xl text-center font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="0" />
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

        <div className="pt-8 border-t border-slate-100">
          <div className="bg-slate-50 border border-slate-200 p-8 rounded-[2rem] flex flex-col md:flex-row items-center justify-between mb-8 shadow-inner">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <div className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Estimasi Skor Akhir</div>
              <div className={`inline-flex items-center px-4 py-2 rounded-xl border-2 text-sm font-bold ${getRecommendation().color}`}>
                Rekomendasi: {getRecommendation().label}
              </div>
            </div>
            <div className="text-6xl font-black text-indigo-600 drop-shadow-sm">
              {calculatePreviewScore()}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block ml-1">Catatan Penilai (Opsional)</label>
            <textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none shadow-inner" 
              placeholder="Berikan feedback atau alasan spesifik untuk penilaian karyawan ini..."
            />
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <button type="submit" disabled={isSubmitting}
            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-2xl font-bold shadow-xl shadow-indigo-500/25 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100 text-lg"
          >
            {isSubmitting ? "Menyimpan..." : (isEdit ? "Update Penilaian" : "Simpan Penilaian Final")}
          </button>
        </div>
      </form>
    </div>
  );
}

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
  // subScores: { [indicatorId]: { [subIndex]: number } }
  const [subScores, setSubScores] = useState<Record<string, Record<number, number>>>({});

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
        setSubScores({});
        setNotes("");
        return;
      }
      
      const existing = await checkExistingEvaluation(selectedEmployee, parseInt(selectedYear), parseInt(selectedMonth));
      if (existing) {
        setIsEdit(true);
        setNotes(existing.notes || "");
        const loadedScores: Record<string, number> = {};
        const loadedSubScores: Record<string, Record<number, number>> = {};
        existing.details.forEach((d: any) => {
          loadedScores[d.indicatorId] = d.score;
          if (d.subScores) {
            try {
              const parsed = JSON.parse(d.subScores);
              const subMap: Record<number, number> = {};
              parsed.forEach((s: any, idx: number) => { subMap[idx] = s.score; });
              loadedSubScores[d.indicatorId] = subMap;
            } catch {}
          }
        });
        setScores(loadedScores);
        setSubScores(loadedSubScores);
      } else {
        setIsEdit(false);
        setScores({});
        setSubScores({});
        setNotes("");
      }
    }
    loadExisting();
  }, [selectedEmployee, selectedYear, selectedMonth]);

  // Parse sub-indicators for each indicator
  const getSubIndicators = (ind: any): { name: string }[] => {
    if (!ind.subIndicators) return [];
    try { return JSON.parse(ind.subIndicators); } catch { return []; }
  };

  // Calculate score for an indicator from its sub-scores
  const calculateIndicatorScore = (ind: any): number => {
    const subs = getSubIndicators(ind);
    if (subs.length === 0) return scores[ind.id] || 0;
    const indSubScores = subScores[ind.id] || {};
    const totalSub = Object.values(indSubScores).reduce((s, v) => s + v, 0);
    // Scale to 0-100 based on the parent indicator's weight
    return ind.weight > 0 ? Math.round((totalSub / ind.weight) * 100) : 0;
  };

  const handleSubScoreChange = (indicatorId: string, subIndex: number, value: string, maxWeight: number) => {
    const numValue = parseFloat(value);
    const clamped = isNaN(numValue) ? 0 : Math.min(maxWeight, Math.max(0, numValue));
    setSubScores(prev => ({
      ...prev,
      [indicatorId]: { ...(prev[indicatorId] || {}), [subIndex]: clamped }
    }));
  };

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

    // Build final scores (from sub-indicators or direct)
    const finalScores: Record<string, number> = {};
    const finalSubScores: Record<string, string> = {};
    
    for (const ind of activeIndicators) {
      const subs = getSubIndicators(ind);
      if (subs.length > 0) {
        finalScores[ind.id] = calculateIndicatorScore(ind);
        const indSubScores = subScores[ind.id] || {};
        finalSubScores[ind.id] = JSON.stringify(subs.map((s, idx) => ({ name: s.name, weight: s.weight || 0, score: indSubScores[idx] || 0 })));
      } else {
        finalScores[ind.id] = scores[ind.id] || 0;
      }
    }

    setIsSubmitting(true);
    try {
      await createEvaluation({
        employeeId: selectedEmployee,
        evaluatorEmail: session.user.email,
        year: parseInt(selectedYear),
        month: parseInt(selectedMonth),
        notes,
        scores: finalScores,
        subScoresData: finalSubScores
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setScores({});
      setSubScores({});
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
    activeIndicators.forEach(ind => {
      const score = calculateIndicatorScore(ind);
      total += (score * ind.weight) / 100;
    });
    return total.toFixed(2);
  };

  const activeIndicators = indicators.filter(i => i.status !== "Nonaktif");
  const kinerjaInd = activeIndicators.filter(i => i.type === "Kinerja");
  const perilakuInd = activeIndicators.filter(i => i.type === "Perilaku");

  const previewScore = parseFloat(calculatePreviewScore());
  const getRecommendation = () => {
    if (previewScore >= 85) return { label: "Reward / Promosi", color: "text-emerald-700 bg-emerald-50 border-emerald-200" };
    if (previewScore >= 70) return { label: "Dipertahankan", color: "text-blue-700 bg-blue-50 border-blue-200" };
    if (previewScore >= 50) return { label: "Pelatihan", color: "text-amber-700 bg-amber-50 border-amber-200" };
    return { label: "Evaluasi Ulang", color: "text-red-700 bg-red-50 border-red-200" };
  };

  // Render indicator card with sub-indicators
  const renderIndicatorCard = (ind: any) => {
    const subs = getSubIndicators(ind);
    const indSubScores = subScores[ind.id] || {};
    const computedScore = calculateIndicatorScore(ind);
    const weightedScore = ((computedScore * ind.weight) / 100).toFixed(1);

    if (subs.length > 0) {
      return (
        <div key={ind.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="font-bold text-slate-800">{ind.name}</div>
              {ind.description && <div className="text-xs text-slate-500 mt-0.5">{ind.description}</div>}
            </div>
            <div className="text-right">
              <div className="flex flex-col gap-1 items-end">
                <div className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">Bobot: {ind.weight}%</div>
                {ind.minTarget > 0 && <div className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">Target Min: {ind.minTarget}%</div>}
              </div>
              <div className="text-xs text-slate-500 mt-1">Skor: <span className="font-bold text-slate-800">{computedScore}</span>/100 → <span className="font-bold text-indigo-600">{weightedScore}</span></div>
            </div>
          </div>
          <div className="space-y-2 mt-3 pt-3 border-t border-slate-100">
            {subs.map((sub: any, idx: number) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="text-xs text-slate-400 w-5 font-bold">{idx + 1}.</span>
                <span className="flex-1 text-sm text-slate-700">{sub.name} <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded ml-1">Max: {sub.weight || 0}%</span></span>
                <div className="flex items-center gap-2">
                  <input type="number" min="0" max={sub.weight || 100} step="0.1" required
                    value={indSubScores[idx] ?? ""}
                    onChange={(e) => handleSubScoreChange(ind.id, idx, e.target.value, sub.weight || 100)}
                    className="w-20 px-3 py-2 border border-slate-200 bg-slate-50 rounded-lg text-center font-bold text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="0" />
                  <span className="text-xs text-slate-400 font-bold">%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Fallback: direct score input (no sub-indicators)
    return (
      <div key={ind.id} className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex-1">
          <div className="font-bold text-slate-800">{ind.name}</div>
          {ind.description && <div className="text-xs text-slate-500 mt-1">{ind.description}</div>}
          <div className="flex gap-2 mt-2">
            <div className="text-xs font-bold text-indigo-600 bg-indigo-50 inline-block px-2 py-0.5 rounded-md">Bobot: {ind.weight}%</div>
            {ind.minTarget > 0 && <div className="text-[10px] font-bold text-amber-600 bg-amber-50 inline-block px-2 py-0.5 rounded-md">Target Min: {ind.minTarget}%</div>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input type="number" min="0" max="100" required
            value={scores[ind.id] ?? ""}
            onChange={(e) => handleScoreChange(ind.id, e.target.value)}
            className="w-24 px-4 py-3 border border-slate-200 bg-slate-50 rounded-xl text-center font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="0" />
          <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">Maks: 100</span>
        </div>
      </div>
    );
  };

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
          <h3 className="text-lg font-black text-slate-800 mb-2">Input Skor Indikator</h3>
          <p className="text-sm text-slate-500 mb-6">Untuk indikator yang memiliki sub-indikator, masukkan skor sesuai bobot masing-masing (maksimal sesuai % sub-indikator).</p>
          
          <div className="space-y-8">
            {kinerjaInd.length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span> Indikator Kinerja
                </h4>
                <div className="grid grid-cols-1 gap-4">
                  {kinerjaInd.map(ind => renderIndicatorCard(ind))}
                </div>
              </div>
            )}

            {perilakuInd.length > 0 && (
              <div className="pt-4">
                <h4 className="text-sm font-bold text-purple-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span> Indikator Perilaku
                </h4>
                <div className="grid grid-cols-1 gap-4">
                  {perilakuInd.map(ind => renderIndicatorCard(ind))}
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

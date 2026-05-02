"use client";

import { useState } from "react";
import { createEvaluation } from "@/app/actions/evaluation";
import { useSession } from "next-auth/react";

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
    if (previewScore >= 85) return { label: "Promosi", color: "text-emerald-400" };
    if (previewScore >= 70) return { label: "Reward", color: "text-blue-400" };
    if (previewScore >= 55) return { label: "Pertahankan", color: "text-amber-400" };
    return { label: "Pelatihan", color: "text-red-400" };
  };

  return (
    <div className="bg-card border border-border rounded-2xl shadow-lg shadow-black/10 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground">Input Penilaian Baru</h2>
        <p className="text-sm text-muted-foreground mt-1">Formulir evaluasi kinerja dan perilaku karyawan.</p>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg text-sm font-medium">
          ✓ Penilaian berhasil disimpan!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-foreground mb-1">Karyawan</label>
            <select 
              required
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="w-full border border-border bg-background rounded-lg px-3 py-2 text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary"
            >
              <option value="">Pilih Karyawan...</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name} ({emp.department})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Bulan</label>
            <select 
              required
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full border border-border bg-background rounded-lg px-3 py-2 text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary"
            >
              {months.map(m => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Tahun</label>
            <select 
              required
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full border border-border bg-background rounded-lg px-3 py-2 text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary"
            >
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <h3 className="font-semibold text-foreground mb-4">Input Skor Indikator (0-100)</h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-blue-400 uppercase tracking-wider mb-3">Indikator Kinerja</h4>
              <div className="grid grid-cols-1 gap-4">
                {indicators.filter(i => i.type === "Kinerja").map(ind => (
                  <div key={ind.id} className="flex items-center gap-4 bg-background/50 p-3 rounded-lg border border-border">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-foreground">{ind.name}</div>
                      <div className="text-xs text-muted-foreground">Bobot: {ind.weight}%</div>
                    </div>
                    <input 
                      type="number" 
                      min="0" max="100" required
                      value={scores[ind.id] || ""}
                      onChange={(e) => handleScoreChange(ind.id, e.target.value)}
                      className="w-24 border border-border bg-background rounded-lg px-3 py-2 text-center text-foreground focus:ring-2 focus:ring-primary/50" 
                      placeholder="0"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-purple-400 uppercase tracking-wider mb-3">Indikator Perilaku</h4>
              <div className="grid grid-cols-1 gap-4">
                {indicators.filter(i => i.type === "Perilaku").map(ind => (
                  <div key={ind.id} className="flex items-center gap-4 bg-background/50 p-3 rounded-lg border border-border">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-foreground">{ind.name}</div>
                      <div className="text-xs text-muted-foreground">Bobot: {ind.weight}%</div>
                    </div>
                    <input 
                      type="number" 
                      min="0" max="100" required
                      value={scores[ind.id] || ""}
                      onChange={(e) => handleScoreChange(ind.id, e.target.value)}
                      className="w-24 border border-border bg-background rounded-lg px-3 py-2 text-center text-foreground focus:ring-2 focus:ring-primary/50" 
                      placeholder="0"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <div className="bg-background/80 border border-border p-5 rounded-xl flex items-center justify-between mb-6">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Estimasi Skor Akhir</div>
              <div className="text-xs text-muted-foreground mt-0.5">Rekomendasi: <span className={`font-semibold ${getRecommendation().color}`}>{getRecommendation().label}</span></div>
            </div>
            <div className="text-4xl font-bold text-primary">
              {calculatePreviewScore()}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Catatan Penilai (Opsional)</label>
            <textarea 
              rows={3} 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border border-border bg-background rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary" 
              placeholder="Berikan feedback khusus untuk karyawan..."
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
          >
            {isSubmitting ? "Menyimpan..." : "Simpan Penilaian"}
          </button>
        </div>
      </form>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Search, Plus, Trash2, Target } from "lucide-react";
import { createIndicator, deleteIndicator } from "@/app/actions/indicator";

export function IndicatorTable({ initialIndicators }: { initialIndicators: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredIndicators = initialIndicators.filter(ind => 
    ind.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    ind.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  async function handleAdd(formData: FormData) {
    await createIndicator(formData);
    setIsModalOpen(false);
  }

  async function handleDelete(id: string) {
    if(confirm('Yakin hapus indikator?')) {
      await deleteIndicator(id);
    }
  }

  return (
    <div className="space-y-6">
      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">Tambah Indikator</h2>
            <form action={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Nama Indikator</label>
                <input name="name" type="text" required className="w-full border border-border bg-background rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="Misal: Kerja Sama" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Jenis</label>
                <select name="type" className="w-full border border-border bg-background rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                  <option value="Kinerja">Kinerja</option>
                  <option value="Perilaku">Perilaku</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Bobot (%)</label>
                <input name="weight" type="number" required className="w-full border border-border bg-background rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Deskripsi</label>
                <textarea name="description" rows={3} className="w-full border border-border bg-background rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="Keterangan..." />
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent">Batal</button>
                <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Manajemen Indikator</h1>
          <p className="text-sm text-muted-foreground mt-1">Kelola indikator penilaian Kinerja dan Perilaku.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Tambah Indikator
        </button>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-lg shadow-black/10 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Cari indikator..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 w-full border border-border bg-background rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Nama Indikator</th>
                <th className="px-6 py-4 font-medium">Jenis</th>
                <th className="px-6 py-4 font-medium">Bobot</th>
                <th className="px-6 py-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredIndicators.map((ind) => (
                <tr key={ind.id} className="hover:bg-accent/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">{ind.name}</div>
                    <div className="text-muted-foreground text-xs mt-0.5 max-w-xs truncate">{ind.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                      ind.type === 'Kinerja' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                    }`}>
                      <Target className="w-3 h-3 mr-1" />
                      {ind.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-foreground">{ind.weight}%</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDelete(ind.id)} className="p-1.5 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredIndicators.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                    Tidak ada data indikator yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

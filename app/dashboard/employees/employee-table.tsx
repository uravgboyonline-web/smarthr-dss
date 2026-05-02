"use client";

import { useState } from "react";
import { Search, Plus, Trash2, Edit2 } from "lucide-react";
import { createEmployee, deleteEmployee, updateEmployee } from "@/app/actions/employee";

export function EmployeeTable({ initialEmployees }: { initialEmployees: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);

  const filteredEmployees = initialEmployees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  async function handleAdd(formData: FormData) {
    await createEmployee(formData);
    setIsModalOpen(false);
  }

  async function handleEdit(formData: FormData) {
    if (!editingEmployee) return;
    await updateEmployee(editingEmployee.id, formData);
    setEditingEmployee(null);
  }

  async function handleDelete(id: string) {
    if(confirm('Yakin hapus karyawan ini?')) {
      await deleteEmployee(id);
    }
  }

  function openEdit(emp: any) {
    setEditingEmployee(emp);
  }

  return (
    <div className="space-y-6">
      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">Tambah Karyawan</h2>
            <form action={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Kode Karyawan</label>
                <input name="employeeCode" type="text" className="w-full border border-border bg-background rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="EMP-XXX" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Nama Lengkap</label>
                <input name="name" type="text" required className="w-full border border-border bg-background rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="Masukkan nama..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Posisi</label>
                <input name="position" type="text" required className="w-full border border-border bg-background rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="Jabatan..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Divisi</label>
                <input name="department" type="text" required className="w-full border border-border bg-background rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="IT, HR, dll" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Status</label>
                <select name="status" className="w-full border border-border bg-background rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                  <option value="Aktif">Aktif</option>
                  <option value="Nonaktif">Nonaktif</option>
                </select>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent">Batal</button>
                <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">Edit Karyawan</h2>
            <form action={handleEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Nama Lengkap</label>
                <input name="name" type="text" required defaultValue={editingEmployee.name} className="w-full border border-border bg-background rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Posisi</label>
                <input name="position" type="text" required defaultValue={editingEmployee.position} className="w-full border border-border bg-background rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Divisi</label>
                <input name="department" type="text" required defaultValue={editingEmployee.department} className="w-full border border-border bg-background rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Status</label>
                <select name="status" defaultValue={editingEmployee.status} className="w-full border border-border bg-background rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                  <option value="Aktif">Aktif</option>
                  <option value="Nonaktif">Nonaktif</option>
                </select>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button type="button" onClick={() => setEditingEmployee(null)} className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent">Batal</button>
                <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">Update</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Manajemen Karyawan</h1>
          <p className="text-sm text-muted-foreground mt-1">Kelola data karyawan untuk penilaian.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Tambah Karyawan
        </button>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-lg shadow-black/10 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Cari nama atau divisi..." 
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
                <th className="px-6 py-4 font-medium">Kode / Nama</th>
                <th className="px-6 py-4 font-medium">Posisi & Divisi</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-accent/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">{emp.name}</div>
                    <div className="text-muted-foreground text-xs mt-0.5">{emp.employeeCode}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-foreground">{emp.position}</div>
                    <div className="text-muted-foreground text-xs mt-0.5">{emp.department}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                      emp.status === 'Aktif' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-muted text-muted-foreground'
                    }`}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(emp)} className="p-1.5 text-muted-foreground hover:text-blue-400 hover:bg-blue-500/10 rounded-md transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(emp.id)} className="p-1.5 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredEmployees.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                    Tidak ada data karyawan yang ditemukan.
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

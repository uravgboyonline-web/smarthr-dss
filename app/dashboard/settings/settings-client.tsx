"use client";

import { useState } from "react";
import { User, Shield, Activity, Clock, UserCheck } from "lucide-react";

export function SettingsClient({ 
  auditLogs, 
  user 
}: { 
  auditLogs: any[], 
  user: any 
}) {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Pengaturan</h1>
        <p className="text-sm text-muted-foreground mt-1">Kelola profil dan pantau aktivitas sistem.</p>
      </div>

      <div className="flex border-b border-border gap-6">
        <button 
          onClick={() => setActiveTab("profile")}
          className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === "profile" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
        >
          Profil Saya
          {activeTab === "profile" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"></div>}
        </button>
        <button 
          onClick={() => setActiveTab("logs")}
          className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === "logs" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
        >
          Log Aktivitas
          {activeTab === "logs" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"></div>}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {activeTab === "profile" && (
          <div className="bg-card border border-border rounded-2xl p-6 shadow-lg shadow-black/10 max-w-2xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center border border-primary/20">
                <User className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">{user?.name}</h2>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-background/50 border border-border rounded-xl">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Shield className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase">Role</span>
                  </div>
                  <div className="text-foreground font-semibold capitalize">{user?.role}</div>
                </div>
                <div className="p-4 bg-background/50 border border-border rounded-xl">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <UserCheck className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase">Status Akun</span>
                  </div>
                  <div className="text-emerald-400 font-semibold">Aktif</div>
                </div>
              </div>

              <div className="pt-6">
                <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors">
                  Ubah Kata Sandi
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "logs" && (
          <div className="bg-card border border-border rounded-2xl shadow-lg shadow-black/10 overflow-hidden">
            <div className="p-4 border-b border-border bg-accent/10">
              <div className="flex items-center gap-2 text-foreground font-semibold">
                <Activity className="w-4 h-4 text-primary" />
                Riwayat Aktivitas Sistem
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase border-b border-border">
                  <tr>
                    <th className="px-6 py-4 font-medium">Waktu</th>
                    <th className="px-6 py-4 font-medium">User</th>
                    <th className="px-6 py-4 font-medium">Aksi</th>
                    <th className="px-6 py-4 font-medium">Detail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {auditLogs.length > 0 ? (
                    auditLogs.map((log: any) => (
                      <tr key={log.id} className="hover:bg-accent/30 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-muted-foreground text-xs">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3 h-3" />
                            {new Date(log.createdAt).toLocaleString('id-ID')}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-foreground font-medium">{log.user.name}</div>
                          <div className="text-[10px] text-muted-foreground">{log.user.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            log.action === 'CREATE' ? 'bg-emerald-500/20 text-emerald-400' :
                            log.action === 'UPDATE' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {log.action}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {log.details}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                        Belum ada riwayat aktivitas.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

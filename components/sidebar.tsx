"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { 
  LayoutDashboard, 
  Users, 
  Target, 
  ClipboardCheck, 
  BarChart3, 
  Settings,
  LogOut
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = session?.user?.role || "employee";

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["admin", "hr", "manager", "leader", "employee"] },
    { name: "Karyawan", href: "/dashboard/employees", icon: Users, roles: ["admin", "hr", "manager"] },
    { name: "Indikator", href: "/dashboard/indicators", icon: Target, roles: ["admin", "hr"] },
    { name: "Penilaian", href: "/dashboard/evaluations", icon: ClipboardCheck, roles: ["admin", "hr", "manager"] },
    { name: "Laporan", href: "/dashboard/reports", icon: BarChart3, roles: ["admin", "hr", "manager", "leader"] },
    { name: "Pengaturan", href: "/dashboard/settings", icon: Settings, roles: ["admin"] },
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(role));

  return (
    <div className="flex h-full w-64 flex-col border-r bg-card text-card-foreground">
      <div className="flex h-16 items-center px-6 border-b">
        <div className="flex items-center gap-2 font-bold text-xl text-primary">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
          SmartHR
        </div>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {filteredMenu.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                  isActive 
                    ? "bg-primary/20 text-primary font-medium" 
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="border-t p-4">
        <button 
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="w-5 h-5 text-muted-foreground group-hover:text-destructive" />
          <span>Keluar</span>
        </button>
      </div>
    </div>
  );
}

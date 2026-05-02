"use client";

import { useSession } from "next-auth/react";
import { Bell, Menu, User as UserIcon } from "lucide-react";

export function Navbar() {
  const { data: session } = useSession();
  const role = session?.user?.role || "employee";
  const name = session?.user?.name || "User";

  const roleNameDisplay: Record<string, string> = {
    admin: "Administrator",
    hr: "HR / Personalia",
    manager: "Manager",
    leader: "Pimpinan",
    employee: "Karyawan"
  };

  return (
    <header className="h-16 border-b bg-card flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button className="md:hidden p-2 -ml-2 text-muted-foreground hover:bg-accent rounded-lg">
          <Menu className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-muted-foreground hover:bg-accent rounded-lg relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-card"></span>
        </button>
        <div className="h-8 w-px bg-border mx-1"></div>
        <div className="flex items-center gap-3">
          <div className="hidden md:block text-right">
            <div className="text-sm font-medium text-foreground">{name}</div>
            <div className="text-xs text-muted-foreground capitalize">{roleNameDisplay[role] || "User"}</div>
          </div>
          <div className="w-9 h-9 bg-primary/10 text-primary rounded-full flex items-center justify-center border border-primary/20">
            <UserIcon className="w-5 h-5" />
          </div>
        </div>
      </div>
    </header>
  );
}

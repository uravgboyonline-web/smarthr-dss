"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Menu, User as UserIcon, X } from "lucide-react";
import { Sidebar } from "./sidebar";

export function Navbar() {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
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
    <>
      <header className="h-16 border-b bg-card flex items-center justify-between px-4 md:px-6 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 -ml-2 text-muted-foreground hover:bg-accent rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="md:hidden font-bold text-lg text-primary">SmartHR</div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <div className="text-sm font-medium text-foreground">{name}</div>
              <div className="text-xs text-muted-foreground capitalize">{roleNameDisplay[role] || "User"}</div>
            </div>
            <div className="w-9 h-9 bg-primary/10 text-primary rounded-full flex items-center justify-center border border-primary/20">
              <UserIcon className="w-5 h-5" />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Drawer */}
          <div className="fixed inset-y-0 left-0 w-72 bg-card shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="flex flex-col h-full">
              <div className="flex h-16 items-center justify-between px-6 border-b">
                <div className="font-bold text-xl text-primary">SmartHR</div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 -mr-2 text-muted-foreground hover:bg-accent rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto" onClick={() => setIsMobileMenuOpen(false)}>
                <Sidebar />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

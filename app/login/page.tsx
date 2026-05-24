"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Shield } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Email atau Password salah");
      setIsLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative flex items-center justify-center overflow-hidden font-sans">
      {/* Background Ornaments (Dynamic UI - Light Theme) */}
      <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-400/20 blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-pink-400/20 blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-[20%] right-[10%] w-[25%] h-[25%] rounded-full bg-indigo-400/20 blur-[90px] animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="w-full max-w-5xl mx-auto p-4 md:p-8 relative z-10 flex flex-col md:flex-row shadow-2xl shadow-indigo-900/10 rounded-[2.5rem] overflow-hidden bg-white/80 backdrop-blur-2xl border border-white">
        
        {/* Left Side - Branding */}
        <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center bg-gradient-to-br from-indigo-50 to-white border-b md:border-b-0 md:border-r border-slate-100">
          <div className="mb-8">
            <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-8 animate-fade-up">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight animate-fade-up" style={{ animationDelay: '0.1s' }}>
              SmartHR <span className="text-indigo-600">DSS</span>
            </h2>
            <p className="mt-4 text-lg text-slate-600 leading-relaxed animate-fade-up" style={{ animationDelay: '0.2s' }}>
              Sistem pendukung keputusan mutakhir untuk evaluasi kinerja dan perilaku karyawan. Akurat, adil, dan terpercaya.
            </p>
          </div>
          
          <div className="hidden md:flex gap-4 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex-1 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50">
              <div className="text-2xl font-bold text-indigo-600">100%</div>
              <div className="text-sm font-medium text-slate-500">Penilaian Objektif</div>
            </div>
            <div className="flex-1 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50">
              <div className="text-2xl font-bold text-indigo-600">DSS</div>
              <div className="text-sm font-medium text-slate-500">Sistem Cerdas</div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-1/2 p-10 md:p-16 bg-white flex flex-col justify-center">
          <div className="mb-10 text-center md:text-left animate-fade-in">
            <h3 className="text-3xl font-extrabold text-slate-900 mb-2">Selamat Datang</h3>
            <p className="text-slate-500 font-medium">Silakan masuk ke akun Anda untuk melanjutkan.</p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-semibold border border-red-100 flex items-center gap-3 animate-fade-in">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
                {error}
              </div>
            )}
            
            <div className="space-y-2 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-inner"
                placeholder="admin@smarthr.com"
              />
            </div>

            <div className="space-y-2 animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-inner"
                placeholder="••••••••"
              />
            </div>

            <div className="pt-4 animate-fade-up" style={{ animationDelay: '0.3s' }}>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 px-4 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 shadow-xl shadow-indigo-500/25 transform transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
              >
                {isLoading ? "Memverifikasi..." : "Masuk Sistem"}
              </button>
            </div>
          </form>
          
          <div className="mt-10 pt-8 border-t border-slate-100 text-center animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <p className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">Akses Demo</p>
            <div className="flex flex-wrap gap-2 justify-center text-xs font-semibold">
              <span className="px-4 py-2 bg-slate-100 rounded-xl text-slate-600">admin@smarthr.com</span>
              <span className="px-4 py-2 bg-slate-100 rounded-xl text-slate-600">hr@smarthr.com</span>
              <span className="px-4 py-2 bg-slate-100 rounded-xl text-slate-600">emp-001@smarthr.com</span>
            </div>
            <p className="text-xs font-medium text-slate-500 mt-4">Password: <span className="text-indigo-600 font-mono bg-indigo-50 px-2 py-1 rounded-md">password123</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}

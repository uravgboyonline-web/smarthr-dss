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
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center text-primary">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <Shield className="w-8 h-8" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
          SmartHR DSS
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Sistem Penilaian Kinerja Karyawan Berbasis Perilaku
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-card py-8 px-4 shadow-lg shadow-black/10 sm:rounded-2xl sm:px-10 border border-border">
          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-500/10 text-red-400 p-3 rounded-lg text-sm font-medium border border-red-500/30">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-foreground">Email</label>
              <div className="mt-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-border bg-background rounded-md shadow-sm placeholder-muted-foreground text-foreground focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="admin@smarthr.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground">Password</label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-border bg-background rounded-md shadow-sm placeholder-muted-foreground text-foreground focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="password123"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-50"
              >
                {isLoading ? "Memproses..." : "Masuk Sistem"}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              Demo: admin@smarthr.com | password123<br/>
              Demo: hr@smarthr.com | password123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

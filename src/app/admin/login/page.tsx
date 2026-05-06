"use client";
// ============================================================
// El-Ghalban | app/admin/login/page.tsx — Admin Login   
// ============================================================

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Lock, User, Zap, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router      = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin";

  const [username, setUsername]   = useState("");
  const [password, setPassword]   = useState("");
  const [showPass, setShowPass]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) { setError("يرجى ملء جميع الحقول"); return; }
    setLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("اسم المستخدم أو كلمة المرور غير صحيحة");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-sky-900
                    flex items-center justify-center p-4" dir="rtl">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 start-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 end-1/4 w-64 h-64 bg-sky-700/10 rounded-full blur-2xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-sky-500
                          rounded-2xl shadow-btn mb-4">
            <Zap size={28} className="text-white" fill="white" />
          </div>
          <h1 className="text-white font-black text-3xl">الغلبان</h1>
          <p className="text-slate-400 text-sm mt-1">لوحة تحكم المدير</p>
        </div>

        {/* Card */}
        <div className="bg-slate-800/80 backdrop-blur-xl border border-white/10
                        rounded-3xl shadow-2xl p-8">
          <h2 className="text-white font-black text-xl mb-6 text-center">تسجيل الدخول</h2>

          {/* Error Alert */}
          {error && (
            <div className="flex items-center gap-3 bg-red-500/15 border border-red-500/30
                            text-red-300 rounded-xl px-4 py-3 mb-5 text-sm font-medium">
              <AlertCircle size={17} className="flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Username */}
            <div>
              <label className="block text-slate-300 text-sm font-bold mb-1.5">
                اسم المستخدم
              </label>
              <div className="relative">
                <User size={16} className="absolute end-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  placeholder="admin"
                  className="w-full bg-slate-700/50 border-2 border-slate-600 rounded-xl
                             px-4 pe-10 py-3 text-white placeholder:text-slate-500
                             focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20
                             transition-all duration-200 text-right font-cairo"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-slate-300 text-sm font-bold mb-1.5">
                كلمة المرور
              </label>
              <div className="relative">
                <Lock size={16} className="absolute end-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full bg-slate-700/50 border-2 border-slate-600 rounded-xl
                             px-4 pe-10 py-3 text-white placeholder:text-slate-500
                             focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20
                             transition-all duration-200 font-cairo"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-500
                             hover:text-slate-300 transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sky-500 hover:bg-sky-600 disabled:bg-sky-500/50
                         text-white font-black py-3.5 rounded-xl transition-all duration-200
                         shadow-btn hover:shadow-btn-hover mt-2
                         flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  جاري الدخول...
                </>
              ) : (
                "دخول"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-500 text-xs mt-6">
          الغلبان للموبايلات © {new Date().getFullYear()} — لوحة الإدارة
        </p>
      </div>
    </div>
  );
}

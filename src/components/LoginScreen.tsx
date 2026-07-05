import React, { useState } from 'react';
import AppLogo from './AppLogo';
import { 
  Lock, 
  Mail, 
  ArrowRight,
  ShieldAlert,
  Loader2
} from 'lucide-react';
import { mockDb } from '../mockDb';
import { User } from '../types';

interface LoginScreenProps {
  onBackToLanding: () => void;
  onLoginSuccess: (user: User) => void;
}

export default function LoginScreen({ onBackToLanding, onLoginSuccess }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    // Small delay to simulate server communication
    setTimeout(() => {
      const users = mockDb.getUsers();
      const matchedUser = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

      if (matchedUser) {
        onLoginSuccess(matchedUser);
      } else {
        setErrorMsg('Email atau password salah! Silahkan periksa kembali kredensial Anda.');
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div id="view-login" className="fixed inset-0 z-50 flex items-center justify-center bg-[#020617] text-white w-full overflow-y-auto p-4 select-none font-sans">
      {/* Mesh Gradient Background for Login */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-orange-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute top-[20%] right-[5%] w-[30%] h-[30%] bg-indigo-600/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[35%] h-[35%] bg-blue-500/10 rounded-full blur-[110px]"></div>
      </div>

      <div className="w-full max-w-5xl flex flex-col md:flex-row glass-dark rounded-[2.5rem] overflow-hidden shadow-2xl relative z-10 border border-slate-800 bg-slate-950/80">
        
        {/* Left Panel: Branding & Value Proposition */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-start gap-8 md:gap-12 bg-gradient-to-tr from-orange-950 to-indigo-950 border-r border-slate-800">
          <div className="flex items-center gap-3">
            <AppLogo />
            <span className="text-2xl font-extrabold font-display tracking-tight">
              AURA<span className="text-orange-400">EXAM</span>
            </span>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-3xl md:text-4xl font-black leading-tight font-display mb-4">
              Platform Kehadiran & Akademik Terintegrasi
            </h1>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed font-medium">
              Kelola absensi cerdas menggunakan QR Code, integrasi LMS tugas harian, dan sistem ujian online interaktif dalam satu dasbor profesional.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-400 font-semibold uppercase tracking-wider">
            <span>🛡️ Secure SSL</span>
            <span>•</span>
            <span>⚡ Real-time Sync</span>
          </div>
        </div>

        {/* Right Panel: Login Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-2xl font-black font-display mb-2 text-white text-center md:text-left">
            Selamat Datang
          </h2>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-8 text-center md:text-left">
            Silahkan masuk untuk mengakses portal akademik.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMsg && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-200 rounded-2xl flex items-start gap-2.5 text-xs font-semibold animate-pulse">
                <ShieldAlert className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                Alamat Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-orange-400 transition-colors" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-sm focus:border-orange-500 focus:bg-white/10 outline-none transition-all font-medium"
                  placeholder="name@mail.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                Kata Sandi
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-orange-400 transition-colors" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-sm focus:border-orange-500 focus:bg-white/10 outline-none transition-all font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-extrabold py-4 rounded-2xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-4 cursor-pointer text-xs uppercase tracking-widest disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <span>Masuk Sekarang</span>
                  <ArrowRight className="h-4 w-4 shrink-0" />
                </>
              )}
            </button>
          </form>



          <div className="mt-6 text-center text-xs text-slate-500">
            Kemudahan dalam genggaman. Butuh bantuan? <a href="#" className="text-orange-400 hover:underline">Hubungi Admin</a>
          </div>
        </div>
      </div>
    </div>
  );
}

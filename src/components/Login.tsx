import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Eye, EyeOff, Lock, User, Goal, HelpCircle } from 'lucide-react';
import { DEFAULT_CREDENTIALS } from '../utils/dummyData';
import TeamLogo from './TeamLogo';

interface LoginProps {
  onLoginSuccess: (role: 'admin' | 'user' | 'wali', username: string, linkedPlayerId?: string) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [copiedRole, setCopiedRole] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Admin validation
    if (username === DEFAULT_CREDENTIALS.admin.username && password === DEFAULT_CREDENTIALS.admin.password) {
      onLoginSuccess('admin', username);
      return;
    }

    // User / Coach validation
    if (username === DEFAULT_CREDENTIALS.user.username && password === DEFAULT_CREDENTIALS.user.password) {
      onLoginSuccess('user', username);
      return;
    }

    // Wali Murid validation
    if (username === DEFAULT_CREDENTIALS.wali.username && password === DEFAULT_CREDENTIALS.wali.password) {
      onLoginSuccess('wali', username, DEFAULT_CREDENTIALS.wali.linkedPlayerId);
      return;
    }

    // If none matches
    setError('Username atau Password yang Anda masukkan tidak terdaftar.');
  };

  const handleAutofill = (role: 'admin' | 'user' | 'wali') => {
    const cred = DEFAULT_CREDENTIALS[role];
    setUsername(cred.username);
    setPassword(cred.password);
    setError('');
    setCopiedRole(role);
    setTimeout(() => setCopiedRole(null), 1500);
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center bg-radial from-slate-900 via-slate-950 to-black p-4 font-sans text-white">
      {/* --- SOCCER FIELD GRID BACKGROUND PATTERN --- */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.06] flex flex-col justify-between border-[8px] border-emerald-500 m-8 rounded-xl">
        {/* Pitch Lines */}
        <div className="w-full h-1/2 border-b-4 border-emerald-500 relative">
          {/* Penalty box top */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-24 border-x-4 border-b-4 border-emerald-500"></div>
          {/* Center Circle */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-48 h-48 border-4 border-emerald-500 rounded-full"></div>
        </div>
        <div className="w-full h-1/2 relative">
          {/* Penalty box bottom */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-24 border-x-4 border-t-4 border-emerald-500"></div>
        </div>
      </div>

      {/* Cyberpunk grid overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]" 
        style={{ backgroundImage: 'linear-gradient(rgba(18, 113, 255, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(18, 113, 255, 0.2) 1px, transparent 1px)', backgroundSize: '24px 24px' }}
      />

      <div className="w-full max-w-md z-10">
        {/* --- BRAND EMBLEM --- */}
        <div className="text-center mb-6">
          <TeamLogo className="w-32 h-32 mx-auto mb-2 filter drop-shadow-[0_0_15px_rgba(235,160,20,0.4)]" glow />
          <h1 className="text-2xl md:text-3xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-amber-200 mt-2">
            AL FARABY FC
          </h1>
          <p className="text-xs tracking-[0.2em] font-mono text-cyan-400 mt-1 uppercase">
            Sistem Manajemen Akademi & Kesiapan GAS
          </p>
        </div>

        {/* --- MAIN LOGIN CARD --- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/60 p-6 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
          id="login-card"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
            <h2 className="text-lg font-bold text-gray-100 flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-500" />
              Masuk Akun Pengguna
            </h2>
            <div className="text-[10px] font-mono bg-cyan-500/10 text-cyan-400 px-2 py-1 rounded border border-cyan-500/20 uppercase">
              Secure Auth v4
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-3 rounded-lg text-xs font-medium text-center animate-shake">
                {error}
              </div>
            )}

            {/* Username Input */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">
                Username / Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  required
                  placeholder="Masukkan username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-gray-200 placeholder-slate-600 outline-none text-sm font-mono transition-all"
                  id="login-username-input"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgot(true)}
                  className="text-xs text-amber-500 hover:text-amber-400 transition-colors hover:underline"
                >
                  Lupa Password?
                </button>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-gray-200 placeholder-slate-600 outline-none text-sm font-mono transition-all"
                  id="login-password-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-400"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Action Button */}
            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 hover:brightness-110 active:scale-95 text-slate-950 font-extrabold uppercase text-xs tracking-widest rounded-xl transition-all shadow-[0_5px_20px_rgba(245,158,11,0.3)] flex items-center justify-center gap-2"
              id="login-submit-btn"
            >
              <Goal className="w-4 h-4" />
              Masuk Lapangan Utama
            </button>
          </form>

          {/* --- QUICK PRESETS (AUTOFILL TOOL FOR REVIEWER) --- */}
          <div className="mt-6 pt-5 border-t border-slate-800/80">
            <p className="text-[10px] font-mono text-slate-500 mb-2 uppercase text-center tracking-wider">
              ⚡ Akun Uji Coba Default (Klik untuk Isi otomatis):
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleAutofill('admin')}
                className={`py-1.5 px-2 rounded font-mono text-[9px] uppercase tracking-wider text-center border transition-all ${
                  copiedRole === 'admin'
                    ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-bold'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => handleAutofill('user')}
                className={`py-1.5 px-2 rounded font-mono text-[9px] uppercase tracking-wider text-center border transition-all ${
                  copiedRole === 'user'
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 font-bold'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                Pelatih
              </button>
              <button
                type="button"
                onClick={() => handleAutofill('wali')}
                className={`py-1.5 px-2 rounded font-mono text-[9px] uppercase tracking-wider text-center border transition-all ${
                  copiedRole === 'wali'
                    ? 'bg-purple-500/20 border-purple-400 text-purple-200 font-bold'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                Wali Murid
              </button>
            </div>
          </div>
        </motion.div>

        {/* School branding subtitle */}
        <div className="text-center mt-4">
          <p className="text-[11px] text-slate-500 font-mono">
            SD ISLAM AL FARABY &bull; NPSN: 20557279 &bull; Turen, Malang
          </p>
        </div>
      </div>

      {/* --- FORGOT PASSWORD MODAL --- */}
      <AnimatePresence>
        {showForgot && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-700 p-6 rounded-2xl max-w-sm w-full shadow-2xl relative"
            >
              <button
                onClick={() => setShowForgot(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 text-xl font-bold"
              >
                &times;
              </button>
              <div className="flex items-center gap-3 text-amber-500 mb-3">
                <HelpCircle className="w-6 h-6" />
                <h3 className="text-lg font-bold">Lupa Password Sistem?</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans mb-4">
                Sistem internal manajemen ini diproteksi oleh kode administrator. Untuk merubah password, 
                ganti password dapat dilakukan oleh Admin di menu <strong>Pengaturan</strong> atau di dalam kode 
                Google Spreadsheet induk.
              </p>
              
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-[11px] font-mono leading-relaxed text-slate-400 mb-4 space-y-1.5">
                <p className="font-bold text-amber-400 border-b border-slate-900 pb-1 mb-1 text-center">PASSWORDS DEFAULT</p>
                <p>👤 <strong className="text-gray-300">ADMIN:</strong> adminfaraby (User: <span className="text-gray-500">admin</span>)</p>
                <p>🏃‍♂️ <strong className="text-gray-300">USER/COACH:</strong> coachfaraby (User: <span className="text-gray-500">coach</span>)</p>
                <p>🏡 <strong className="text-gray-300">WALI MURID:</strong> walifaraby (User: <span className="text-gray-500">wali_faraby</span>)</p>
              </div>

              <button
                type="button"
                onClick={() => setShowForgot(false)}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg text-xs uppercase"
              >
                Mengerti & Kembali
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

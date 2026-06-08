import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings, 
  Lock, 
  Palette, 
  School, 
  Search, 
  MapPin, 
  RotateCcw, 
  FolderSearch, 
  CheckCircle, 
  Sliders, 
  ShieldCheck, 
  Key,
  Upload
} from 'lucide-react';
import { TeamSettings } from '../types';
import { resetToDefaults } from '../utils/dummyData';
import TeamLogo from './TeamLogo';

interface PengaturanProps {
  settings: TeamSettings;
  onUpdateSettings: (settings: TeamSettings) => void;
  role: 'admin' | 'user' | 'wali';
}

const DRIVE_MOCK_LOGOS = [
  { name: 'logo_alfaraby_vintage.png', desc: 'Desain crest retro Al Faraby asli', isDefault: true },
  { name: 'logo_akademi_gold_shield.jpg', desc: 'Desain modern bernuansa emas metalik' },
  { name: 'logo_cyber_sport_cyan.png', desc: 'Gaya neon cyberpunk futuristik' }
];

export default function Pengaturan({ settings, onUpdateSettings, role }: PengaturanProps) {
  const [formData, setFormData] = useState<TeamSettings>({ ...settings });
  const [feedback, setFeedback] = useState('');
  
  // Custom logo query
  const [logoSearch, setLogoSearch] = useState('');
  const [showLogoDriveModal, setShowLogoDriveModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Password inputs
  const [adminPass, setAdminPass] = useState(settings.adminPassword || 'adminfaraby');
  const [userPass, setUserPass] = useState(settings.userPassword || 'coachfaraby');
  const [waliPass, setWaliPass] = useState(settings.waliPassword || 'walifaraby');

  const isReadOnly = role === 'wali';

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      ...formData,
      adminPassword: adminPass,
      userPassword: userPass,
      waliPassword: waliPass
    });
    setFeedback('Semua Pembaharuan Pengaturan Berhasil Disimpan!');
    setTimeout(() => setFeedback(''), 4000);
  };

  const handleSelectTheme = (theme: 'default' | 'pitch' | 'cyberpunk' | 'classic') => {
    setFormData(prev => ({ ...prev, backgroundTheme: theme }));
    onUpdateSettings({ ...settings, backgroundTheme: theme });
    setFeedback(`Tema visual berhasil diganti ke: ${theme.toUpperCase()}`);
    setTimeout(() => setFeedback(''), 1500);
  };

  // Simulated logo drive search
  const filteredLogos = useMemo(() => {
    return DRIVE_MOCK_LOGOS.filter(l => l.name.toLowerCase().includes(logoSearch.toLowerCase()));
  }, [logoSearch]);

  const selectCrestLogo = (logoName: string) => {
    const updated = { ...formData, logoUrl: logoName };
    setFormData(updated);
    onUpdateSettings(updated);
    setShowLogoDriveModal(false);
    
    // Dispatch local custom event to update active TeamLogo instances
    setTimeout(() => {
      window.dispatchEvent(new Event('localSettingsUpdate'));
    }, 50);

    setFeedback(`Logo tim Al Faraby berhasil dimutakhirkan ke: ${logoName}!`);
    setTimeout(() => setFeedback(''), 4000);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLocalLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const updated = { ...formData, logoUrl: base64String };
        setFormData(updated);
        onUpdateSettings(updated);
        
        // Dispatch local custom event to update active TeamLogo instances
        setTimeout(() => {
          window.dispatchEvent(new Event('localSettingsUpdate'));
        }, 50);

        setFeedback(`Logo tim berhasil diunggah langsung dari Disk Lokal Anda!`);
        setTimeout(() => setFeedback(''), 4000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isReadOnly) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (isReadOnly) return;
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const updated = { ...formData, logoUrl: base64String };
        setFormData(updated);
        onUpdateSettings(updated);
        
        // Dispatch local custom event to update active TeamLogo instances
        setTimeout(() => {
          window.dispatchEvent(new Event('localSettingsUpdate'));
        }, 50);

        setFeedback(`Logo tim berhasil diunggah lewat Drag & Drop dari komputer Anda!`);
        setTimeout(() => setFeedback(''), 4000);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6" id="pengaturan-view">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Settings className="text-amber-500 w-6 h-6" />
            Konfigurasi & Pengaturan Sistem
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Konfigurasi detail identitas sekolah, penyesuaian password, dan ganti tema visual dashboard.
          </p>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-lg bg-cyan-950/45 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-bold flex items-center gap-2">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          {feedback}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Form options input */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow space-y-5">
            <h3 className="text-xs font-bold font-mono text-cyan-400 tracking-widest uppercase pb-2 border-b border-slate-800 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-cyan-400" />
              IDENTITAS KLUB SEPAKBOLA
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-1">Nama Team Akademi</label>
                <input
                  type="text"
                  required
                  disabled={isReadOnly}
                  value={formData.teamName}
                  onChange={e => setFormData({ ...formData, teamName: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-1 font-bold">NPSN Sekolah asli</label>
                <input
                  type="text"
                  required
                  disabled={isReadOnly}
                  value={formData.npsn}
                  onChange={e => setFormData({ ...formData, npsn: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-amber-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-1">Alamat Markas</label>
                <input
                  type="text"
                  required
                  disabled={isReadOnly}
                  value={formData.teamAddress}
                  onChange={e => setFormData({ ...formData, teamAddress: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-1">Kepala Sekolah asli</label>
                <input
                  type="text"
                  required
                  disabled={isReadOnly}
                  value={formData.principalName}
                  onChange={e => setFormData({ ...formData, principalName: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-1">Email Resmi</label>
                <input
                  type="email"
                  required
                  disabled={isReadOnly}
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-cyan-400"
                />
              </div>
            </div>

            {/* SECURITY CREDENTIALS / MULTI PASSWORDS CONFIG (ROLE-BASED SETUP) */}
            <h3 className="text-xs font-bold font-mono text-cyan-400 tracking-widest uppercase pb-2 border-b border-slate-800 pt-3 flex items-center gap-1.5">
              <Key className="w-4 h-4 text-emerald-400" />
              MUTAKHIRKAN KREDENSIAL PASSWORD ROLE
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[9px] font-bold text-slate-500 uppercase font-mono mb-1">Pass Admin Default</label>
                <input
                  type="text"
                  required
                  disabled={isReadOnly}
                  value={adminPass}
                  onChange={e => setAdminPass(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-rose-400"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-500 uppercase font-mono mb-1">Pass Pelatih / User</label>
                <input
                  type="text"
                  required
                  disabled={isReadOnly}
                  value={userPass}
                  onChange={e => setUserPass(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-cyan-400"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-500 uppercase font-mono mb-1">Pass Wali Murid</label>
                <input
                  type="text"
                  required
                  disabled={isReadOnly}
                  value={waliPass}
                  onChange={e => setWaliPass(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-purple-400"
                />
              </div>
            </div>

            {!isReadOnly && (
              <div className="pt-3 border-t border-slate-850 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-amber-500 hover:brightness-110 text-slate-950 font-bold uppercase text-xs tracking-wider rounded-xl transition-all shadow-md"
                >
                  Simpan Konfigurasi Identifikasi
                </button>
              </div>
            )}
          </form>

          {/* BACKGROUND SELECTOR */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow space-y-4">
            <h3 className="text-xs font-bold font-mono text-cyan-400 tracking-widest uppercase pb-1.5 border-b border-slate-800 flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-purple-400" />
              SUNTING LATAR DASHBOARD (THEME PRESETS)
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'default', name: 'Ambient Slate', style: 'bg-slate-950 border-slate-800 text-slate-400' },
                { id: 'pitch', name: 'Soccer Grass Grid', style: 'bg-emerald-950/40 border-emerald-900 text-emerald-400' },
                { id: 'cyberpunk', name: 'Cyberpunk Neon', style: 'bg-[#0f172a] border-[#0c4a6e] text-cyan-400' },
                { id: 'classic', name: 'Light Minimalism', style: 'bg-slate-50 border-slate-300 text-slate-800 font-bold' }
              ].map(theme => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => handleSelectTheme(theme.id as any)}
                  className={`p-4 border text-center rounded-xl text-xs font-bold transition-all hover:scale-[1.03] ${theme.style} ${
                    formData.backgroundTheme === theme.id ? 'ring-2 ring-amber-500 ring-offset-2 ring-offset-slate-950' : ''
                  }`}
                >
                  {theme.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right side panel: Crest Customization & reset defaults option */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow flex flex-col justify-between items-center text-center">
            <h3 className="text-xs font-bold font-mono text-slate-400 uppercase pb-2 border-b border-slate-800 w-full mb-4">
              CREST LOGO MANAGER
            </h3>

            <div className="p-4 bg-slate-950/60 rounded-full border border-slate-800 shadow-inner inline-block my-2">
              <TeamLogo className="w-24 h-24 filter drop-shadow-[0_0_10px_rgba(235,160,20,0.2)]" />
            </div>

            <p className="text-[11px] text-slate-400 leading-normal font-sans py-2">
              Crest klub Al Faraby FC didesain secara adaptif dalam format Vector. Anda dapat mengunggah file gambar kustom dari local disk komputer Anda atau mencari database di Google Drive.
            </p>

            <div className="w-full space-y-2 mt-4">
              <button
                type="button"
                onClick={() => {
                  if (isReadOnly) return;
                  setShowLogoDriveModal(true);
                }}
                disabled={isReadOnly}
                className="w-full py-2 bg-slate-950 hover:bg-slate-850 text-slate-350 hover:text-white font-mono text-[10px] font-bold uppercase rounded border border-slate-850 flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FolderSearch className="w-3.5 h-3.5 text-cyan-400" />
                Cari Logo Al Faraby Di Drive
              </button>

              <label 
                className={`w-full py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 hover:text-amber-300 font-mono text-[10px] font-bold uppercase rounded border border-amber-500/35 flex items-center justify-center gap-1.5 transition-all cursor-pointer ${isReadOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Upload className="w-3.5 h-3.5 text-amber-500" />
                Upload Logo Dari Disk Lokal
                <input
                  type="file"
                  accept="image/*"
                  disabled={isReadOnly}
                  onChange={handleLocalLogoUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Reset System Database Default Panel */}
          {!isReadOnly && (
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow space-y-3">
              <h3 className="text-xs font-bold font-mono text-rose-400 uppercase tracking-wider pb-1.5 border-b border-slate-800">
                ADMIN DESTRUCTIVE AREA
              </h3>
              <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                Gunakan pengaturan berikut untuk mengembalikan seluruh database pemain, rapor, dan jadwal ke setelan bawaan pabrik (Default).
              </p>
              <button
                type="button"
                onClick={() => {
                  if (confirm("🚨 WARNING: Seluruh perubahan data pemain asli, nilai rapor harian dan detail jadwal sparring Al Faraby FC akan dihapus permanen dan kembali ke data default! Lanjutkan reset?")) {
                    resetToDefaults();
                  }
                }}
                className="w-full py-2 bg-rose-950/40 hover:bg-rose-900/40 text-rose-200 hover:text-rose-100 font-mono text-[10px] font-bold uppercase rounded-lg border border-rose-900/40 text-center transition-all flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4 text-rose-500 animate-spin" />
                Reset Ke Data Default
              </button>
            </div>
          )}
        </div>

      </div>

      {/* --- SIMULATED GOOGLE DRIVE CREST SELECTION MODAL --- */}
      <AnimatePresence>
        {showLogoDriveModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`bg-slate-900 border ${
                isDragging ? 'border-amber-550 bg-slate-950 scale-[1.02] ring-2 ring-amber-500' : 'border-slate-700/80'
              } p-5 rounded-2xl max-w-sm w-full shadow-2xl relative transition-all duration-200`}
            >
              <button
                type="button"
                onClick={() => {
                  setShowLogoDriveModal(false);
                  setIsDragging(false);
                }}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                &times;
              </button>

              <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-4">
                <FolderSearch className="text-cyan-400 w-5 h-5" />
                <div>
                  <h3 className="text-xs font-black text-slate-100 uppercase font-mono">Ganti Logo Tim Al Faraby</h3>
                  <p className="text-[9px] text-slate-500">Pilih dari Drive atau unggah dari Disk Lokal</p>
                </div>
              </div>

              {isDragging ? (
                <div className="border-2 border-dashed border-amber-500/60 p-8 rounded-xl text-center my-4 bg-amber-500/5">
                  <Upload className="w-10 h-10 text-amber-500 mx-auto animate-bounce mb-3" />
                  <p className="text-xs text-amber-400 font-bold font-mono">TARUH FILE GAMBAR DI SINI</p>
                  <p className="text-[9px] text-slate-500 mt-1">Logo akan otomatis dikonversi</p>
                </div>
              ) : (
                <>
                  <div className="relative mb-3.5">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-550 pointer-events-none">
                      <Search className="w-3.5 h-3.5" />
                    </span>
                    <input
                      type="text"
                      placeholder="Cari desain logo di drive..."
                      value={logoSearch}
                      onChange={e => setLogoSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-1.5 bg-slate-950 border border-slate-850 rounded-lg text-xs placeholder-slate-650 text-white font-mono"
                    />
                  </div>

                  <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                    {filteredLogos.length > 0 ? (
                      filteredLogos.map((logo, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => selectCrestLogo(logo.name)}
                          className="w-full bg-slate-950 hover:bg-slate-850 p-2.5 rounded-xl text-left border border-slate-850/60 transition-colors flex items-center gap-3"
                        >
                          <div className="p-1 bg-amber-500/10 rounded-lg">
                            <TeamLogo className="w-8 h-8" />
                          </div>
                          <div>
                            <h4 className="text-[11px] font-bold font-mono text-gray-200">{logo.name}</h4>
                            <p className="text-[9px] text-slate-500">{logo.desc}</p>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="text-center py-4 bg-slate-950 rounded-xl border border-dashed border-slate-850">
                        <p className="text-[10px] text-slate-400 font-mono">Desain drive tidak cocok</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 p-3 bg-slate-950 border border-slate-850 rounded-xl text-center space-y-2">
                    <p className="text-[9px] text-slate-400 font-sans leading-relaxed">
                      Atau cari, pilih, atau seret & taruh file gambar dari **Disk Lokal** Anda:
                    </p>
                    <label className="inline-flex w-full justify-center items-center gap-1.5 px-4 py-2 bg-amber-500 hover:brightness-110 text-slate-950 font-mono text-[10px] font-black uppercase rounded shadow-md cursor-pointer transition-all">
                      <Upload className="w-3.5 h-3.5" />
                      CARI FILE DARI DISK LOKAL
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          handleLocalLogoUpload(e);
                          setShowLogoDriveModal(false);
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                </>
              )}

              <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 mt-5 pt-3 border-t border-slate-800">
                <span>Dual Mode: Drive & Local Disk</span>
                <button
                  type="button"
                  onClick={() => {
                    setShowLogoDriveModal(false);
                    setIsDragging(false);
                  }}
                  className="px-3 py-1 bg-slate-950 text-slate-400 hover:text-white rounded"
                >
                  Batal
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

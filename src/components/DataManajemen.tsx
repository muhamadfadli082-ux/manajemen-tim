import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  UserCheck, 
  Award, 
  MapPin, 
  Mail, 
  ShieldCheck, 
  Edit3, 
  Save, 
  User, 
  PhoneCall, 
  BookOpen 
} from 'lucide-react';
import { TeamSettings, Player } from '../types';

interface DataManajemenProps {
  settings: TeamSettings;
  players: Player[];
  onSaveSettings: (updated: TeamSettings) => void;
  role: 'admin' | 'user' | 'wali';
}

export default function DataManajemen({ settings, players, onSaveSettings, role }: DataManajemenProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<TeamSettings>({ ...settings });

  // Counts
  const totalPlayers = players.length;
  const activeCount = players.filter(p => p.status === 'aktif').length;
  const graduatesCount = players.filter(p => p.status === 'lulus').length;
  const transfersCount = players.filter(p => p.status === 'pindah').length;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setIsEditing(false);
  };

  const isReadOnly = role === 'wali';

  return (
    <div className="space-y-6" id="data-manajemen-view">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ShieldCheck className="text-amber-500 w-6 h-6" />
            Data Manajemen Tim Al Faraby FC
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Daftar penanggung jawab, pelatih, kurator manajemen, dan ringkasan kuota atlet.
          </p>
        </div>

        {!isReadOnly && (
          <button
            onClick={() => {
              if (isEditing) {
                // reset
                setFormData({ ...settings });
                setIsEditing(false);
              } else {
                setIsEditing(true);
              }
            }}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-850 text-xs font-bold font-mono tracking-wider text-slate-300 border border-slate-800 rounded-xl transition-all flex items-center gap-2 uppercase"
          >
            <Edit3 className="w-3.5 h-3.5 text-amber-500" />
            {isEditing ? 'Batal Edit' : 'Edit Manajemen'}
          </button>
        )}
      </div>

      {isEditing ? (
        /* --- EDIT FORM --- */
        <motion.form 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSave} 
          className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4"
        >
          <h3 className="text-sm font-bold font-mono text-cyan-400 tracking-widest uppercase pb-2 border-b border-slate-800">
            Form Pembaruan Manajemen
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Team Name</label>
              <input
                type="text"
                required
                value={formData.teamName}
                onChange={e => setFormData({ ...formData, teamName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:border-amber-500 text-sm outline-none text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono font-bold">NPSN Sekolah asli</label>
              <input
                type="text"
                required
                value={formData.npsn}
                onChange={e => setFormData({ ...formData, npsn: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:border-amber-500 text-sm outline-none text-white font-mono"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Alamat Official Team</label>
              <input
                type="text"
                required
                value={formData.teamAddress}
                onChange={e => setFormData({ ...formData, teamAddress: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:border-amber-500 text-sm outline-none text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Kepala Sekolah (M1)</label>
              <input
                type="text"
                required
                value={formData.principalName}
                onChange={e => setFormData({ ...formData, principalName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:border-amber-500 text-sm outline-none text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Email Manajemen</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:border-amber-500 text-sm outline-none text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Head Coach</label>
              <input
                type="text"
                required
                value={formData.headCoach}
                onChange={e => setFormData({ ...formData, headCoach: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:border-amber-500 text-sm outline-none text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono font-bold">Trainer / Coach</label>
              <input
                type="text"
                required
                value={formData.coach}
                onChange={e => setFormData({ ...formData, coach: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:border-amber-500 text-sm outline-none text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Manajer 1</label>
              <input
                type="text"
                required
                value={formData.manager1}
                onChange={e => setFormData({ ...formData, manager1: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:border-amber-500 text-sm outline-none text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Manajer 2</label>
              <input
                type="text"
                required
                value={formData.manager2}
                onChange={e => setFormData({ ...formData, manager2: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:border-amber-500 text-sm outline-none text-white"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-amber-500 hover:brightness-110 active:scale-95 text-slate-950 font-bold uppercase text-xs tracking-wider rounded-xl transition-all shadow-[0_5px_15px_rgba(245,158,11,0.2)] flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Simpan Data Manajemen
            </button>
          </div>
        </motion.form>
      ) : (
        /* --- VIEW MODE --- */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Roster Column (Left 2 cols size) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-bold font-mono tracking-widest text-slate-400 uppercase">
              Struktur Kepengurusan Official Al Faraby FC
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Kepala Sekolah / Principal Card */}
              <div className="p-4 bg-slate-900/60 border border-slate-850 rounded-xl relative overflow-hidden flex items-start gap-3.5">
                <div className="p-3 bg-amber-550/10 text-amber-500 rounded-lg border border-amber-500/10 text-center">
                  <BookOpen className="w-5 h-5 mx-auto" />
                </div>
                <div>
                  <div className="text-[10px] font-mono tracking-wider text-slate-500 uppercase">KEPALA SEKOLAH</div>
                  <h4 className="text-sm font-bold text-gray-100">{settings.principalName}</h4>
                  <p className="text-[11px] text-slate-400 font-sans mt-0.5">Penanggung Jawab Utama</p>
                  <p className="text-[10px] font-mono text-cyan-400 mt-1">NPSN: {settings.npsn}</p>
                </div>
              </div>

              {/* Head Coach */}
              <div className="p-4 bg-slate-900/60 border border-slate-850 rounded-xl flex items-start gap-3.5">
                <div className="p-3 bg-emerald-555/10 text-emerald-400 rounded-lg border border-emerald-500/10 text-center">
                  <Award className="w-5 h-5 mx-auto" />
                </div>
                <div>
                  <div className="text-[10px] font-mono tracking-wider text-slate-500 uppercase">HEAD COACH</div>
                  <h4 className="text-sm font-bold text-gray-100">{settings.headCoach}</h4>
                  <p className="text-[11px] text-slate-400 font-sans mt-0.5">Pelatih Utama & Taktikal</p>
                </div>
              </div>

              {/* Assistant Coach */}
              <div className="p-4 bg-slate-900/60 border border-slate-850 rounded-xl flex items-start gap-3.5">
                <div className="p-3 bg-cyan-555/10 text-cyan-400 rounded-lg border border-cyan-500/10 text-center">
                  <User className="w-5 h-5 mx-auto" />
                </div>
                <div>
                  <div className="text-[10px] font-mono tracking-wider text-slate-500 uppercase">COACH / TRAINER</div>
                  <h4 className="text-sm font-bold text-gray-100">{settings.coach}</h4>
                  <p className="text-[11px] text-slate-400 font-sans mt-0.5">Pengembang Fisik & Teknik</p>
                </div>
              </div>

              {/* Manajer 1 */}
              <div className="p-4 bg-slate-900/60 border border-slate-850 rounded-xl flex items-start gap-3.5">
                <div className="p-3 bg-indigo-555/10 text-indigo-400 rounded-lg border border-indigo-500/10 text-center">
                  <UserCheck className="w-5 h-5 mx-auto" />
                </div>
                <div>
                  <div className="text-[10px] font-mono tracking-wider text-slate-500 uppercase">MANAJER 1</div>
                  <h4 className="text-sm font-bold text-gray-100">{settings.manager1}</h4>
                  <p className="text-[11px] text-slate-400 font-sans mt-0.5">Manajer Operasional & Sarana</p>
                </div>
              </div>

              {/* Manajer 2 */}
              <div className="p-4 bg-slate-900/60 border border-slate-850 rounded-xl flex items-start gap-3.5">
                <div className="p-3 bg-indigo-555/10 text-indigo-400 rounded-lg border border-indigo-500/10 text-center">
                  <UserCheck className="w-5 h-5 mx-auto" />
                </div>
                <div>
                  <div className="text-[10px] font-mono tracking-wider text-slate-500 uppercase">MANAJER 2</div>
                  <h4 className="text-sm font-bold text-gray-100">{settings.manager2}</h4>
                  <p className="text-[11px] text-slate-400 font-sans mt-0.5">Manajer Keuangan & Humas</p>
                </div>
              </div>

              {/* Sekolah NPSN and Contact detail card */}
              <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-1.5 text-xs font-sans text-slate-400">
                <div className="text-[10px] font-mono tracking-wider text-slate-500 uppercase font-black">KONTAK RESMI</div>
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>{settings.email}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>Malang, Jawa Timur</span>
                </div>
              </div>

            </div>
          </div>

          {/* Quick Player Summary Statistics Grid (Right Column) */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold font-mono tracking-widest text-slate-400 uppercase">
              Ringkasan Kuota Pendaftaran Siswa
            </h3>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-500" />
                  <span className="text-xs font-bold text-slate-200">TOTAL TERINPUT</span>
                </div>
                <span className="text-2xl font-black text-white font-mono">{totalPlayers}</span>
              </div>

              <div className="space-y-3 pt-2">
                <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                  Semua data siswa terpusat pada satu database tim dan tersinkronisasi otomatis dengan Google Spreadsheet terpadu.
                </p>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 mt-2">
                <p className="text-[11px] text-slate-400 font-sans leading-normal">
                  Rasio ketersediaan tim optimal dengan <em>depth chart</em> 4 lini posisi: Kiper, Bek, Gelandang dan Penyerang.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

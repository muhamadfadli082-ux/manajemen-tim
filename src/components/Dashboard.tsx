import React from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Calendar, 
  Award, 
  Settings as SettingsIcon, 
  ArrowRight, 
  TrendingUp, 
  ShieldCheck, 
  UserCheck, 
  MapPin, 
  Mail, 
  School 
} from 'lucide-react';
import { Player, EventSchedule, TeamSettings, PlayerGrade } from '../types';
import TeamLogo from './TeamLogo';

interface DashboardProps {
  players: Player[];
  schedules: EventSchedule[];
  settings: TeamSettings;
  setCurrentTab: (tab: string) => void;
  grades: PlayerGrade[];
}

export default function Dashboard({ players, schedules, settings, setCurrentTab, grades }: DashboardProps) {
  // Analytical metrics calculations
  const totalPlayers = players.length;
  
  // Players grouped by positions
  const positions = {
    Kiper: players.filter(p => p.position === 'Kiper').length,
    Bek: players.filter(p => p.position === 'Bek').length,
    Gelandang: players.filter(p => p.position === 'Gelandang').length,
    Penyerang: players.filter(p => p.position === 'Penyerang').length,
  };

  const getPercentage = (count: number) => {
    if (totalPlayers === 0) return '0%';
    return `${Math.round((count / totalPlayers) * 100)}%`;
  };

  // Recent grades avg
  const averageStamina = grades.length > 0 
    ? Math.round(grades.reduce((sum, g) => sum + g.stamina, 0) / grades.length) 
    : 85;
  const averageSkill = grades.length > 0 
    ? Math.round(grades.reduce((sum, g) => sum + (g.passing + g.dribbling + g.control + g.shooting) / 4, 0) / grades.length) 
    : 80;

  return (
    <div className="space-y-6" id="dashboard-tab-view">
      {/* --- TOP EMBLEM / HEADER BRAND --- */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row items-center gap-6 justify-between overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl -z-10" />
        
        {/* Crest Logo & Details Grid */}
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left z-10 w-full md:w-auto">
          <TeamLogo className="w-24 h-24 filter drop-shadow-[0_0_12px_rgba(245,158,11,0.25)] flex-shrink-0" />
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-amber-500 tracking-wider">
              {settings.teamName}
            </h1>
            <p className="text-xs text-cyan-400 font-mono tracking-widest uppercase">
              SEPAKBOLA ACADEMY UNIT &bull; SD ISLAM AL FARABY
            </p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-1.5 text-xs text-slate-400 font-sans pt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                {settings.teamAddress}
              </span>
            </div>
            <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-1 text-[11px] text-slate-500 font-mono">
              <span className="flex items-center gap-1">
                <School className="w-3.5 h-3.5 text-cyan-500" />
                Kepala Sekolah: {settings.principalName}
              </span>
              <span>•</span>
              <span>NPSN: {settings.npsn}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3 text-slate-500" />
                {settings.email}
              </span>
            </div>
          </div>
        </div>

        {/* Sync Status Badge */}
        <div className="flex flex-row md:flex-col items-center md:items-end gap-2 bg-slate-950/65 py-2.5 px-4 rounded-xl border border-slate-800 shadow-inner">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-mono tracking-wider text-emerald-400 uppercase">Spreadsheet Live</span>
          </div>
          <div className="text-[11px] font-mono text-slate-400 mt-0.5">
            ID: <span className="text-cyan-400">{settings.spreadsheetId.substring(0, 10)}...</span>
          </div>
        </div>
      </motion.div>

      {/* --- STATS GRID (Inspired by reference layout) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Metrics Column 1: Core Numbers */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between shadow-xl relative overflow-hidden"
          id="stat-box-left"
        >
          <div className="absolute -right-3 -top-3 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl" />
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-400">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2 py-1 rounded">Siswa FC</span>
          </div>
          
          <div className="space-y-1">
            <p className="text-[11px] text-slate-400 font-mono tracking-wider uppercase">SISWA TERDAFTAR</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-white tracking-tight">{totalPlayers}</span>
              <span className="text-xs font-sans text-slate-500">Siswa aktif keseluruhan</span>
            </div>
            <div className="text-[11px] text-amber-500 bg-amber-950/40 p-2 rounded-lg border border-amber-900/40 flex items-center gap-1.5 mt-4">
              <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />
              Siswa terpilih siap sparring dan pelatihan intensif.
            </div>
          </div>

          <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-850 mt-6 text-slate-400 font-sans leading-relaxed text-[10.5px]">
            Seluruh data pemain FC tersimpan terpusat dan tersinkronisasi otomatis dengan Google Spreadsheet.
          </div>
        </motion.div>

        {/* Metrics Column 2: Positions Chart & Radii (The futuristic glowing donut feeling) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl relative overflow-hidden"
          id="stat-box-middle"
        >
          <div className="absolute -right-3 -top-3 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl" />
          <h3 className="text-xs font-bold font-mono tracking-widest text-slate-400 uppercase mb-4 flex items-center justify-between">
            <span>PERSENTASE POSISI</span>
            <span className="text-cyan-400 text-[10px]">KUOTA FORMULA FIT</span>
          </h3>

          <div className="space-y-3">
            {/* Kiper */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-rose-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 inline-block"></span>
                  GK (Kiper)
                </span>
                <span className="text-slate-300">{positions.Kiper} Pemain &bull; {getPercentage(positions.Kiper)}</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-rose-500 to-red-400 h-full rounded-full" 
                  style={{ width: getPercentage(positions.Kiper) }}
                />
              </div>
            </div>

            {/* Bek */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-yellow-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-yellow-500 inline-block"></span>
                  DF (Bek)
                </span>
                <span className="text-slate-300">{positions.Bek} Pemain &bull; {getPercentage(positions.Bek)}</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-yellow-500 to-amber-400 h-full rounded-full" 
                  style={{ width: getPercentage(positions.Bek) }}
                />
              </div>
            </div>

            {/* Gelandang */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-cyan-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block"></span>
                  MF (Gelandang)
                </span>
                <span className="text-slate-300">{positions.Gelandang} Pemain &bull; {getPercentage(positions.Gelandang)}</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-cyan-500 to-blue-400 h-full rounded-full" 
                  style={{ width: getPercentage(positions.Gelandang) }}
                />
              </div>
            </div>

            {/* Penyerang */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                  FW (Penyerang)
                </span>
                <span className="text-slate-300">{positions.Penyerang} Pemain &bull; {getPercentage(positions.Penyerang)}</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full" 
                  style={{ width: getPercentage(positions.Penyerang) }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Metrics Column 3: Skill Index Levels */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between shadow-xl relative overflow-hidden"
          id="stat-box-right"
        >
          <div className="absolute -right-3 -top-3 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl" />
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold font-mono tracking-widest text-slate-400 uppercase">
              RATA-RATA EVALUASI TIM
            </h3>
            <span className="text-xs p-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-mono">
              SKOR 1-100
            </span>
          </div>

          <div className="flex items-center gap-6 my-2">
            <div className="relative flex items-center justify-center">
              {/* Fake High tech radar circle */}
              <svg className="w-20 h-20 transform -rotate-90">
                <circle cx="40" cy="40" r="34" stroke="#0f172a" strokeWidth="6" fill="transparent" />
                <circle cx="40" cy="40" r="34" stroke="#10b981" strokeWidth="6" fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 34}`} 
                  strokeDashoffset={`${2 * Math.PI * 34 * (1 - averageStamina / 100)}`}
                />
              </svg>
              <div className="absolute text-center space-y-0.5">
                <span className="text-lg font-black text-gray-100">{averageStamina}</span>
                <p className="text-[8px] text-slate-500 font-mono uppercase">STAMINA</p>
              </div>
            </div>

            <div className="flex-1 space-y-2">
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-850">
                <div className="text-[9px] text-slate-500 font-mono uppercase">Indeks Teknik Bola</div>
                <div className="text-sm font-bold text-slate-200">{averageSkill} / 100</div>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-850">
                <div className="text-[9px] text-slate-500 font-mono uppercase">Evaluasi Ternilai</div>
                <div className="text-sm font-bold text-slate-200">{grades.length} Penilaian</div>
              </div>
            </div>
          </div>

          <button 
            type="button"
            onClick={() => setCurrentTab('penilaian')}
            className="w-full mt-4 py-2 bg-slate-950 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-800 text-[11px] font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-all"
          >
            Siswa Penilaian Rapor
            <ArrowRight className="w-3 h-3" />
          </button>
        </motion.div>
      </div>

      {/* --- QUICK ACCESS ACTION ROW --- */}
      <h3 className="text-xs font-bold font-mono tracking-widest text-slate-400 uppercase mt-4">
        AKSES CEPAT NAVIGASI UTAMA
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { tabId: 'datamanajemen', title: 'Data Manajemen', desc: 'Detail coach & manajer', icon: ShieldCheck, color: 'border-yellow-500/20 text-yellow-500 hover:bg-yellow-500/10' },
          { tabId: 'datapemain', title: 'Siswa Murid', desc: 'Cari, edit & tambah siswa', icon: UserCheck, color: 'border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/10' },
          { tabId: 'jadwal', title: 'Jadwal Kursus', desc: 'Atur sparring & latihan', icon: Calendar, color: 'border-rose-500/20 text-rose-400 hover:bg-rose-500/10' },
          { tabId: 'penilaian', title: 'Nilai Kategori', desc: 'Keterampilan & mental', icon: Award, color: 'border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10' },
        ].map((item, index) => (
          <button
            key={index}
            onClick={() => setCurrentTab(item.tabId)}
            className={`p-4 bg-slate-900 border text-left rounded-xl transition-all hover:scale-[1.02] shadow ${item.color}`}
          >
            <item.icon className="w-5 h-5 mb-2" />
            <div className="text-xs font-bold text-gray-100">{item.title}</div>
            <div className="text-[10px] text-slate-400 leading-normal mt-0.5">{item.desc}</div>
          </button>
        ))}
      </div>

      {/* --- TIMELINE SCHEDULE PANEL AND FOOTBALL FIELD BANNER --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        
        {/* Playfield Event Calendar */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-xs font-bold font-mono tracking-widest text-slate-400 uppercase flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400" />
                Daftar Agenda Rutin & Sparring
              </h3>
              <span className="text-[10px] bg-slate-950 font-mono px-2 py-0.5 rounded text-cyan-400 uppercase">
                {schedules.length} Event
              </span>
            </div>

            <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
              {schedules.map((sch) => (
                <div 
                  key={sch.id}
                  className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                    sch.type === 'sparring' 
                      ? 'bg-rose-950/20 border-rose-900/30' 
                      : 'bg-emerald-950/20 border-emerald-900/30'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded font-black ${
                      sch.type === 'sparring' 
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/20' 
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {sch.type}
                    </span>
                    <h4 className="text-xs font-bold text-white mt-1.5">{sch.title}</h4>
                    <p className="text-[11px] text-slate-400 font-sans flex items-center gap-1 pt-0.5">
                      <MapPin className="w-3 h-3 text-slate-500 flex-shrink-0" />
                      {sch.location}
                    </p>
                  </div>
                  <div className="text-left sm:text-right flex-shrink-0 font-mono text-[11px] space-y-0.5">
                    <div className="text-amber-400 font-bold">{sch.date}</div>
                    <div className="text-slate-400 text-[10px]">{sch.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setCurrentTab('jadwal')}
            className="w-full mt-4 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] font-bold uppercase text-slate-300 rounded-lg text-center"
          >
            Lihat Semua Jadwal & Tambah Agenda
          </button>
        </div>

        {/* Informational pitch illustration wrapper */}
        <div className="bg-gradient-to-br from-emerald-900/20 to-slate-950 border border-emerald-900/30 p-5 rounded-2xl shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute right-0 bottom-0 top-0 w-1/2 opacity-[0.14] pointer-events-none">
            {/* Minimal soccer pitch SVG drawing */}
            <svg viewBox="0 0 100 100" className="w-full h-full stroke-emerald-500 fill-none" strokeWidth="2">
              <rect x="10" y="10" width="80" height="80" rx="3" />
              <circle cx="50" cy="50" r="15" />
              <line x1="10" y1="50" x2="90" y2="50" />
              <path d="M 10,35 Q 25,35 25,50 Q 25,65 10,65" />
              <path d="M 90,35 Q 75,35 75,50 Q 75,65 90,65" />
            </svg>
          </div>

          <div className="space-y-4">
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 p-1.5 rounded uppercase border border-emerald-800/40">
              Visi Dan Misi FC
            </span>
            <blockquote className="text-sm italic text-slate-200 font-sans leading-relaxed pt-2">
              &ldquo;Mendidik talenta muda sejak usia belia dengan pondasi akhlaqul karimah, ketekunan spiritual, olahraga fisik taktis, serta kepemimpinan tim yang luar biasa di lapangan hijau.&rdquo;
            </blockquote>
            <p className="text-[11px] text-slate-400 leading-normal">
              Program sepakbola terintegrasi SD ISLAM AL FARABY FC melatih pemahaman taktik sepakbola, 
              passing, dribbling, control, shooting, kerjasama, dan daya tahan tubuh yang kokoh.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-900/80 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Sesi Latihan Berikutnya:</span>
            <span className="text-emerald-400 font-bold">Senin, 15:30 WIB</span>
          </div>
        </div>

      </div>
    </div>
  );
}

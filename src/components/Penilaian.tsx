import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Award, 
  Plus, 
  Users, 
  Printer, 
  MapPin, 
  UserCheck, 
  Sparkle, 
  BrainCircuit, 
  Compass, 
  Dribbble, 
  Flame, 
  Heart 
} from 'lucide-react';
import { Player, PlayerGrade } from '../types';
import TeamLogo from './TeamLogo';

interface PenilaianProps {
  players: Player[];
  grades: PlayerGrade[];
  onAddGrade: (grade: PlayerGrade) => void;
  role: 'admin' | 'user' | 'wali';
}

export default function Penilaian({ players, grades, onAddGrade, role }: PenilaianProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState('');
  const [evalDate, setEvalDate] = useState('2026-06-06');
  const [evaluatorName, setEvaluatorName] = useState('Ustadz Ahmad Fauzi');
  
  // Scores states
  const [rulesKnowledge, setRulesKnowledge] = useState(85);
  const [passing, setPassing] = useState(80);
  const [dribbling, setDribbling] = useState(80);
  const [control, setControl] = useState(80);
  const [shooting, setShooting] = useState(75);
  const [individualSkill, setIndividualSkill] = useState(75);
  const [vision, setVision] = useState(75);
  const [response, setResponse] = useState(80);
  const [jump, setJump] = useState(70);
  const [teamwork, setTeamwork] = useState(80);
  const [mental, setMental] = useState(80);
  const [spirit, setSpirit] = useState(85);
  const [stamina, setStamina] = useState(80);
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');

  // Viewed student report card
  const [viewingGrade, setViewingGrade] = useState<PlayerGrade | null>(grades[0] || null);

  const isReadOnly = role === 'wali';

  // Filters candidates
  const activeSiswa = useMemo(() => {
    return players;
  }, [players]);

  const handleAddGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlayerId) return;

    const player = players.find(p => p.id === selectedPlayerId);
    if (!player) return;

    const newGrade: PlayerGrade = {
      id: `grade-${Date.now()}`,
      playerId: selectedPlayerId,
      playerName: player.name,
      evalDate,
      evaluatorName,
      rulesKnowledge,
      passing,
      dribbling,
      control,
      shooting,
      individualSkill,
      vision,
      response,
      jump,
      teamwork,
      mental,
      spirit,
      stamina,
      description,
      notes
    };

    onAddGrade(newGrade);
    setViewingGrade(newGrade);
    setIsAdding(false);
    
    // Reset values
    setSelectedPlayerId('');
    setRulesKnowledge(85);
    setPassing(80);
    setDribbling(80);
    setControl(80);
    setShooting(75);
    setIndividualSkill(75);
    setVision(75);
    setResponse(80);
    setJump(70);
    setTeamwork(80);
    setMental(80);
    setSpirit(85);
    setStamina(80);
    setDescription('');
    setNotes('');
  };

  // Printable window creator for PDF Export
  const handlePrintPDF = (grade: PlayerGrade) => {
    const player = players.find(p => p.id === viewingGrade?.playerId);
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Popup terblokir! Izinkan popup untuk mencetak laporan PDF.");
      return;
    }

    const htmlContent = `
      <html>
      <head>
        <title>Rapor Nilai Evaluasi - ${grade.playerName}</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        <style>
          @media print {
            body { background: white; color: black; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body class="bg-white text-black p-8 font-sans">
        <div class="max-w-2xl mx-auto border-4 border-double border-gray-400 p-6 rounded-lg">
          
          <!-- Report Header -->
          <div class="text-center border-b-2 border-slate-350 pb-5 mb-6">
            <h1 class="text-2xl font-black tracking-wider text-gray-800">RAPOR EVALUASI AKADEMI BOLA</h1>
            <h2 class="text-xl font-bold text-gray-700">AL FARABY FC TUREN</h2>
            <p class="text-xs text-gray-500 mt-1">Jl Mayor Damar no 44 Bokor Pagedangan Kec. Turen, Malang</p>
            <p class="text-xs text-gray-500">NPSN: 20557279 &bull; sdialfaraby238@gmail.com</p>
          </div>

          <!-- Student Profile details -->
          <div class="grid grid-cols-2 gap-4 text-xs font-mono mb-6 bg-gray-50 p-3 rounded">
            <div>
              <p><strong>Nama Pemain:</strong> ${grade.playerName}</p>
              <p><strong>Posisi:</strong> ${player?.position || 'Gelandang'}</p>
              <p><strong>Nomor Punggung:</strong> #${player?.number || '99'}</p>
            </div>
            <div>
              <p><strong>Tanggal Evaluasi:</strong> ${grade.evalDate}</p>
              <p><strong>Evaluator / Coach:</strong> ${grade.evaluatorName}</p>
              <p><strong>Nama Wali:</strong> ${player?.parentName || '-'}</p>
            </div>
          </div>

          <!-- Grades Table -->
          <table class="w-full text-left text-xs border border-gray-300 mb-6">
            <thead>
              <tr class="bg-gray-100 border-b border-gray-300">
                <th class="p-2 border-r border-gray-300">Kategori Penilaian</th>
                <th class="p-2 text-center w-24 border-r border-gray-300">Skor (1-100)</th>
                <th class="p-2 text-center w-24">Predikat</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="p-2 border-b border-r border-gray-300 font-bold">A. PENGETAHUAN PERATURAN BOLA</td>
                <td class="p-2 border-b border-r border-gray-300 text-center font-bold font-mono">${grade.rulesKnowledge}</td>
                <td class="p-2 border-b text-center font-mono">${grade.rulesKnowledge >= 85 ? 'Sangat Baik' : grade.rulesKnowledge >= 75 ? 'Baik' : 'Cukup'}</td>
              </tr>
              <tr class="bg-gray-50">
                <td class="p-2 border-b border-r border-gray-300" style="padding-left: 20px;">1. Akurasi Passing pendek/panjang</td>
                <td class="p-2 border-b border-r border-gray-300 text-center font-mono">${grade.passing}</td>
                <td class="p-2 border-b text-center font-mono">${grade.passing >= 85 ? 'A' : grade.passing >= 75 ? 'B' : 'C'}</td>
              </tr>
              <tr>
                <td class="p-2 border-b border-r border-gray-300" style="padding-left: 20px;">2. Kecepatan Dribbling bola</td>
                <td class="p-2 border-b border-r border-gray-300 text-center font-mono">${grade.dribbling}</td>
                <td class="p-2 border-b text-center font-mono">${grade.dribbling >= 85 ? 'A' : grade.dribbling >= 75 ? 'B' : 'C'}</td>
              </tr>
              <tr class="bg-gray-50">
                <td class="p-2 border-b border-r border-gray-300" style="padding-left: 20px;">3. Control / Sentuhan bola pertama</td>
                <td class="p-2 border-b border-r border-gray-300 text-center font-mono">${grade.control}</td>
                <td class="p-2 border-b text-center font-mono">${grade.control >= 85 ? 'A' : grade.control >= 75 ? 'B' : 'C'}</td>
              </tr>
              <tr>
                <td class="p-2 border-b border-r border-gray-300 font-bold">B. TEKNIK DAN KETRAMPILAN LANJUTAN</td>
                <td class="p-2 border-b border-r border-gray-300 text-center font-bold font-mono">${Math.round((grade.shooting + grade.individualSkill + grade.vision + grade.response + grade.jump) / 5)}</td>
                <td class="p-2 border-b text-center font-mono">${grade.shooting >= 85 ? 'Sangat Baik' : 'Baik'}</td>
              </tr>
              <tr class="bg-gray-50">
                <td class="p-2 border-b border-r border-gray-300" style="padding-left: 20px;">1. Akurasi Shooting ke gawang</td>
                <td class="p-2 border-b border-r border-gray-305 text-center font-mono">${grade.shooting}</td>
                <td class="p-2 border-b text-center font-mono">${grade.shooting >= 85 ? 'A' : 'B'}</td>
              </tr>
              <tr>
                <td class="p-2 border-b border-r border-gray-300" style="padding-left: 20px;">2. Skill Individu & Olah Bola</td>
                <td class="p-2 border-b border-r border-gray-305 text-center font-mono">${grade.individualSkill}</td>
                <td class="p-2 border-b text-center font-mono">${grade.individualSkill >= 85 ? 'A' : 'B'}</td>
              </tr>
              <tr class="bg-gray-50">
                <td class="p-2 border-b border-r border-gray-300" style="padding-left: 20px;">3. Visi & Misi bermain cerdas</td>
                <td class="p-2 border-b border-r border-gray-305 text-center font-mono">${grade.vision}</td>
                <td class="p-2 border-b text-center font-mono">${grade.vision >= 85 ? 'A' : 'B'}</td>
              </tr>
              <tr>
                <td class="p-2 border-b border-r border-gray-300 font-bold">C. ATTITUDE, TEAMPLAY, DAN FISIK</td>
                <td class="p-2 border-b border-r border-gray-300 text-center font-bold font-mono">${Math.round((grade.teamwork + grade.mental + grade.spirit + grade.stamina) / 4)}</td>
                <td class="p-2 border-b text-center font-mono">Sangat Baik</td>
              </tr>
              <tr class="bg-gray-50">
                <td class="p-2 border-b border-r border-gray-300" style="padding-left: 20px;">1. Kerjasama Tim & Komunikasi</td>
                <td class="p-2 border-b border-r border-gray-305 text-center font-mono">${grade.teamwork}</td>
                <td class="p-2 border-b text-center font-mono">Sangat Baik</td>
              </tr>
              <tr>
                <td class="p-2 border-b border-r border-gray-300" style="padding-left: 20px;">2. Semangat Bermain (Fisik luar biasa)</td>
                <td class="p-2 border-b border-r border-gray-305 text-center font-mono">${grade.spirit}</td>
                <td class="p-2 border-b text-center font-mono">Sangat Baik</td>
              </tr>
              <tr class="bg-gray-50">
                <td class="p-2 border-b border-r border-gray-300" style="padding-left: 20px;">3. Daya Tahan / Stamina 2 babak</td>
                <td class="p-2 border-b border-r border-gray-305 text-center font-mono">${grade.stamina}</td>
                <td class="p-2 border-b text-center font-mono">Baik</td>
              </tr>
            </tbody>
          </table>

          <!-- Deskripsi & Catatan -->
          <div class="grid grid-cols-1 gap-3.5 text-xs font-sans mb-6">
            <div class="border border-gray-300 p-3 rounded">
              <h3 class="font-bold text-gray-800 mb-1 text-xs uppercase tracking-wider">Deskripsi Kemajuan Siswa</h3>
              <p class="text-gray-700 leading-relaxed font-mono text-[11px]">${grade.description || 'Siswa menunjukkan disiplin yang stabil serta keaktifan positif dalam memahami taktik dasar sepakbola dan kerjasama tim.'}</p>
            </div>
            <div class="border border-gray-300 p-3 rounded">
              <h3 class="font-bold text-gray-800 mb-1 text-xs uppercase tracking-wider">Catatan Khusus Pelatih</h3>
              <p class="text-gray-700 leading-relaxed font-mono text-[11px]">${grade.notes || 'Rekomendasi untuk terus mengasah keterampilan penguasaan bola (ball-control) secara konsisten dan menjaga stamina fisik mandiri.'}</p>
            </div>
          </div>

          <!-- Footer/Signatures -->
          <div class="grid grid-cols-2 gap-8 text-center text-xs mt-12 font-sans pt-6 border-t border-gray-200">
            <div>
              <p>Mengetahui,</p>
              <p class="font-bold mt-12">Krismawan, S.Pd.I</p>
              <p class="text-[10px] text-gray-500">Kepala Sekolah SD ISLAM AL FARABY</p>
            </div>
            <div>
              <p>Evaluator,</p>
              <p class="font-bold mt-12">${grade.evaluatorName}</p>
              <p class="text-[10px] text-gray-500">Seksi Pelatihan Akademi AF-FC</p>
            </div>
          </div>

          <!-- Utility panel for printable saving -->
          <div class="no-print mt-8 flex justify-center gap-4 bg-gray-100 p-4 rounded-lg">
            <button onclick="window.print()" class="px-5 py-2 bg-blue-600 text-white font-bold text-xs rounded shadow">
              Cetak Rapor / Save PDF
            </button>
            <button onclick="window.close()" class="px-5 py-2 bg-gray-300 text-gray-800 text-xs rounded">
              Tutup Jendela
            </button>
          </div>

        </div>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6" id="penilaian-view">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Award className="text-emerald-400 w-6 h-6" />
            Evaluasi Penilaian Rapor Siswa
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Rinci penguasaan taktis pengetahuan, keterampilan dasar, lanjutan, mentalitas olahraga dan daya tahan fisik.
          </p>
        </div>

        {!isReadOnly && !isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 hover:brightness-110 active:scale-95 text-xs font-bold font-mono tracking-wider text-slate-950 rounded-xl transition-all flex items-center gap-2 uppercase shadow-[0_4px_15px_rgba(16,185,129,0.3)]"
          >
            <Plus className="w-4 h-4 text-slate-950" />
            Beri Penilaian Siswa
          </button>
        )}
      </div>

      {/* --- ADD GRADE FORM --- */}
      <AnimatePresence>
        {isAdding && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAddGrade}
            className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4 overflow-hidden"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-black font-mono tracking-widest text-emerald-405 uppercase flex items-center gap-1.5">
                <Sparkle className="w-4 h-4 text-amber-500 animate-spin" />
                Input Formulir Penilaian Murid Baru
              </span>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="text-slate-400 hover:text-slate-205 text-xs font-mono uppercase"
              >
                Batal
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-2 border-b border-slate-800/40">
              {/* Select Player */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 font-mono">Pilih Nama Siswa</label>
                <select
                  required
                  value={selectedPlayerId}
                  onChange={(e) => setSelectedPlayerId(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-820 rounded-lg text-xs text-white"
                >
                  <option value="">-- Pilih Siswa FC --</option>
                  {activeSiswa.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (#{p.number})</option>
                  ))}
                </select>
              </div>

              {/* Evaluator name */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 font-mono">Nama Coach Evaluator</label>
                <input
                  type="text"
                  required
                  value={evaluatorName}
                  onChange={e => setEvaluatorName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-820 rounded-lg text-xs"
                />
              </div>

              {/* Eval Date */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 font-mono">Tanggal Uji</label>
                <input
                  type="date"
                  required
                  value={evalDate}
                  onChange={e => setEvalDate(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-820 rounded-lg text-xs font-mono text-cyan-400"
                />
              </div>
            </div>

            {/* SLIDERS PARAMETERS SECTION */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              
              {/* Category A: Knowledge / Pengetahuan */}
              <div className="space-y-4 bg-slate-950/60 p-4 rounded-xl border border-slate-850">
                <h4 className="text-xs font-bold text-amber-500 font-mono tracking-wider border-b border-slate-900 pb-1.5 uppercase flex items-center gap-1">
                  <BrainCircuit className="w-3.5 h-3.5" />
                  KATEGORI PENGETAHUAN
                </h4>
                <div>
                  <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                    <span>Aturan Sepakbola</span>
                    <span className="text-amber-400 font-bold">{rulesKnowledge}</span>
                  </div>
                  <input
                    type="range" min="40" max="100" value={rulesKnowledge}
                    onChange={e => setRulesKnowledge(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>
              </div>

              {/* Category B: Basic skills / Teknik Dasar */}
              <div className="space-y-4 bg-slate-950/60 p-4 rounded-xl border border-slate-850">
                <h4 className="text-xs font-bold text-cyan-400 font-mono tracking-wider border-b border-slate-900 pb-1.5 uppercase flex items-center gap-1">
                  <Dribbble className="w-3.5 h-3.5" />
                  KATEGORI TEKNIK DASAR
                </h4>
                
                <div>
                  <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                    <span>Passing Pendek & Jauh</span>
                    <span className="text-cyan-400 font-bold">{passing}</span>
                  </div>
                  <input
                    type="range" min="40" max="100" value={passing}
                    onChange={e => setPassing(Number(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                    <span>Dribbling (Giring Bola)</span>
                    <span className="text-cyan-400 font-bold">{dribbling}</span>
                  </div>
                  <input
                    type="range" min="40" max="100" value={dribbling}
                    onChange={e => setDribbling(Number(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                    <span>Control (Kontrol Sentuhan)</span>
                    <span className="text-cyan-400 font-bold">{control}</span>
                  </div>
                  <input
                    type="range" min="40" max="100" value={control}
                    onChange={e => setControl(Number(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                </div>
              </div>

              {/* Category C: Expert and Advance Skills */}
              <div className="space-y-4 bg-slate-955/60 p-4 rounded-xl border border-slate-850">
                <h4 className="text-xs font-bold text-rose-450 font-mono tracking-wider border-b border-slate-900 pb-1.5 uppercase flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5" />
                  TEKNIK LANJUTAN
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-3.5">
                  <div>
                    <span className="block text-[9px] font-mono text-slate-400 mb-1">Shooting ({shooting})</span>
                    <input type="range" min="40" max="100" value={shooting} onChange={e => setShooting(Number(e.target.value))} className="w-full accent-rose-400" />
                  </div>
                  <div>
                    <span className="block text-[9px] font-mono text-slate-400 mb-1">Skill Individu ({individualSkill})</span>
                    <input type="range" min="40" max="100" value={individualSkill} onChange={e => setIndividualSkill(Number(e.target.value))} className="w-full accent-rose-400" />
                  </div>
                  <div>
                    <span className="block text-[9px] font-mono text-slate-400 mb-1">Visi & Misi Bermain ({vision})</span>
                    <input type="range" min="40" max="100" value={vision} onChange={e => setVision(Number(e.target.value))} className="w-full accent-rose-400" />
                  </div>
                  <div>
                    <span className="block text-[9px] font-mono text-slate-400 mb-1">Respon Gerak ({response})</span>
                    <input type="range" min="40" max="100" value={response} onChange={e => setResponse(Number(e.target.value))} className="w-full accent-rose-400" />
                  </div>
                  <div className="col-span-2">
                    <span className="block text-[9px] font-mono text-slate-400 mb-1">Jump ({jump})</span>
                    <input type="range" min="40" max="100" value={jump} onChange={e => setJump(Number(e.target.value))} className="w-full accent-rose-400" />
                  </div>
                </div>
              </div>

              {/* Category D: Physical Fitness & Attitude parameters */}
              <div className="space-y-4 bg-slate-950/60 p-4 rounded-xl border border-slate-850 md:col-span-3">
                <h4 className="text-xs font-bold text-emerald-400 font-mono tracking-wider border-b border-slate-900 pb-1.5 uppercase flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" />
                  KERJASAMA TIM, SEMANGAT, MENTAL & DAYA TAHAN
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1 font-bold">Kerjasama Tim</div>
                    <input type="range" min="40" max="100" value={teamwork} onChange={e => setTeamwork(Number(e.target.value))} className="w-full accent-emerald-500" />
                    <span className="block text-[11px] text-emerald-400 font-mono text-center font-bold mt-1">{teamwork} / 100</span>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1 font-bold">Mental Bertanding</div>
                    <input type="range" min="40" max="100" value={mental} onChange={e => setMental(Number(e.target.value))} className="w-full accent-emerald-500" />
                    <span className="block text-[11px] text-emerald-400 font-mono text-center font-bold mt-1">{mental} / 100</span>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1 font-bold">Semangat Bermain</div>
                    <input type="range" min="40" max="100" value={spirit} onChange={e => setSpirit(Number(e.target.value))} className="w-full accent-emerald-500" />
                    <span className="block text-[11px] text-emerald-400 font-mono text-center font-bold mt-1">{spirit} / 100</span>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1 font-bold">Daya Tahan (Stamina)</div>
                    <input type="range" min="40" max="100" value={stamina} onChange={e => setStamina(Number(e.target.value))} className="w-full accent-emerald-500" />
                    <span className="block text-[11px] text-emerald-400 font-mono text-center font-bold mt-1">{stamina} / 100</span>
                  </div>
                </div>
              </div>

              {/* Category E: Deskripsi Kemajuan & Catatan Pelatih */}
              <div className="space-y-4 bg-slate-950/60 p-4 rounded-xl border border-slate-850 md:col-span-3">
                <h4 className="text-xs font-bold text-cyan-450 font-mono tracking-wider border-b border-slate-900 pb-1.5 uppercase flex items-center gap-1.5">
                  <Sparkle className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                  DESKRIPSI EVALUASI & CATATAN KHUSUS PELATIH
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Deskripsi Kemajuan Siswa</label>
                    <textarea
                      placeholder="Masukkan kemajuan performa siswa secara keseluruhan selama periode evaluasi ini..."
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Catatan Khusus Pelatih</label>
                    <textarea
                      placeholder="Masukkan nasihat, fokus perbaikan latihan, dan masukan konstruktif untuk ditekuni oleh siswa..."
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>
                </div>
              </div>

            </div>

            <div className="pt-2 border-t border-slate-800/40 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-emerald-500 hover:brightness-110 text-slate-950 font-bold uppercase text-xs tracking-wider rounded-xl transition-all shadow-md"
              >
                Simpan Nilai Rapor Siswa
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* --- LIST PENILAIAN AND DETAILED REPORT SELECTOR CARD --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: List of evaluate entries */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-xs font-bold font-mono tracking-widest text-slate-400 uppercase">
            Siswa FC Terdaftar Nilai Rapor
          </h3>

          <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
            {grades.length === 0 ? (
              <p className="text-slate-500 text-xs font-mono py-4">Belum ada pemain yang dinilai.</p>
            ) : (
              grades.map((grade) => (
                <button
                  key={grade.id}
                  onClick={() => setViewingGrade(grade)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                    viewingGrade?.id === grade.id 
                      ? 'bg-emerald-950/20 border-emerald-500/50 shadow' 
                      : 'bg-slate-900 border-slate-850 hover:bg-slate-850/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-200">{grade.playerName}</h4>
                    <span className="text-[10px] font-mono text-amber-500">{grade.evalDate}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mt-2">
                    <span>Evaluator: {grade.evaluatorName.substring(0, 15)}...</span>
                    <span className="text-emerald-400 font-bold">Avg: {Math.round((grade.passing + grade.dribbling + grade.rulesKnowledge + grade.stamina) / 4)}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right column: Rapor detailed print mock card view */}
        <div className="lg:col-span-2">
          {viewingGrade ? (
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
              
              {/* Header card info */}
              <div className="pb-4 border-b border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Award className="w-10 h-10 text-amber-500" />
                  <div>
                    <h3 className="text-base font-bold text-gray-100">{viewingGrade.playerName}</h3>
                    <p className="text-xs text-slate-450 font-mono">Diuji oleh: <span className="text-slate-300">{viewingGrade.evaluatorName}</span> &bull; {viewingGrade.evalDate}</p>
                  </div>
                </div>

                <button
                  onClick={() => handlePrintPDF(viewingGrade)}
                  className="px-4 py-1.5 bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-300 font-bold font-mono text-[10px] uppercase rounded-lg flex items-center gap-1.5 transition-all shadow"
                >
                  <Printer className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                  Eksport Rapor PDF
                </button>
              </div>

              {/* Rapor Details Parameter List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 text-xs font-sans text-slate-300">
                
                {/* Pengetahuan & Dasar */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider pb-1.5 border-b border-slate-850/40">
                    A. Pengetahuan & Teknik Dasar
                  </h4>
                  
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between font-mono text-[10px] text-slate-505 mb-1">
                        <span>Pengetahuan Aturan Sepakbola</span>
                        <span className="text-amber-400 font-black">{viewingGrade.rulesKnowledge} / 100</span>
                      </div>
                      <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full rounded-full" style={{ width: `${viewingGrade.rulesKnowledge}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-mono text-[10px] text-slate-505 mb-1">
                        <span>Passing (Akurasi Umpan)</span>
                        <span className="text-cyan-440 font-black">{viewingGrade.passing} / 100</span>
                      </div>
                      <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${viewingGrade.passing}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-mono text-[10px] text-slate-505 mb-1">
                        <span>Dribbling (Kontrol Giring)</span>
                        <span className="text-cyan-440 font-black">{viewingGrade.dribbling} / 100</span>
                      </div>
                      <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${viewingGrade.dribbling}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-mono text-[10px] text-slate-505 mb-1">
                        <span>Control (Sentuhan Bola)</span>
                        <span className="text-cyan-440 font-black">{viewingGrade.control} / 100</span>
                      </div>
                      <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${viewingGrade.control}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Teknik Lanjutan & Teamwork */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold font-mono text-rose-400 uppercase tracking-wider pb-1.5 border-b border-slate-850/40">
                    B. Teknik Lanjutan & Fisika
                  </h4>

                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between font-mono text-[10px] text-slate-505 mb-1">
                        <span>Shooting (Akurasi Tembak)</span>
                        <span className="text-rose-400 font-bold">{viewingGrade.shooting} / 100</span>
                      </div>
                      <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-rose-500 h-full rounded-full" style={{ width: `${viewingGrade.shooting}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-mono text-[10px] text-slate-505 mb-1">
                        <span>Skill Individu & Trik</span>
                        <span className="text-rose-400 font-bold">{viewingGrade.individualSkill} / 100</span>
                      </div>
                      <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-rose-500 h-full rounded-full" style={{ width: `${viewingGrade.individualSkill}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-mono text-[10px] text-slate-505 mb-1">
                        <span>Kerjasama Tim (Teamplay)</span>
                        <span className="text-emerald-400 font-bold">{viewingGrade.teamwork} / 100</span>
                      </div>
                      <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${viewingGrade.teamwork}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-mono text-[10px] text-slate-505 mb-1">
                        <span>Stamina / Daya Tahan</span>
                        <span className="text-emerald-400 font-bold">{viewingGrade.stamina} / 100</span>
                      </div>
                      <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${viewingGrade.stamina}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Mentals & Spirits details */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 grid grid-cols-3 gap-3.5 mb-4 text-center">
                <div>
                  <span className="block text-[9px] text-slate-500 uppercase tracking-widest font-mono">Mental</span>
                  <span className="text-sm font-bold text-gray-200 mt-1 block">{viewingGrade.mental}</span>
                </div>
                <div>
                  <span className="block text-[9px] text-slate-500 uppercase tracking-widest font-mono">Semangat</span>
                  <span className="text-sm font-bold text-gray-200 mt-1 block">{viewingGrade.spirit}</span>
                </div>
                <div>
                  <span className="block text-[9px] text-slate-500 uppercase tracking-widest font-mono">Jump Respon</span>
                  <span className="text-sm font-bold text-gray-200 mt-1 block">{viewingGrade.jump}</span>
                </div>
              </div>

              {/* Description and notes view */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="bg-slate-950/40 border border-slate-850 p-3.5 rounded-xl">
                  <h4 className="text-[10px] font-bold font-mono text-cyan-400 uppercase tracking-wider mb-1.5 text-left">
                    ● Deskripsi Kemajuan Siswa
                  </h4>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed text-left">
                    {viewingGrade.description || 'Siswa menunjukkan disiplin yang stabil serta keaktifan positif dalam memahami taktik dasar sepakbola dan kerjasama tim.'}
                  </p>
                </div>
                <div className="bg-slate-950/40 border border-slate-850 p-3.5 rounded-xl">
                  <h4 className="text-[10px] font-bold font-mono text-amber-500 uppercase tracking-wider mb-1.5 text-left">
                    ● Catatan Khusus Pelatih
                  </h4>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed text-left">
                    {viewingGrade.notes || 'Rekomendasi untuk terus mengasah keterampilan penguasaan bola (ball-control) secara konsisten dan menjaga stamina fisik mandiri.'}
                  </p>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center text-slate-500 font-mono text-sm shadow">
              Pilih salah satu siswa di samping untuk menampilkan rapor nilai digital lengkap.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Download, 
  Upload, 
  FileSpreadsheet, 
  FileText, 
  CheckCircle, 
  HelpCircle, 
  RefreshCw, 
  Sparkle 
} from 'lucide-react';
import { Player, PlayerGrade } from '../types';

interface EksporImporProps {
  players: Player[];
  grades: PlayerGrade[];
  onImportPlayers: (imported: Player[]) => void;
  onImportGrades: (imported: PlayerGrade[]) => void;
}

export default function EksporImpor({ players, grades, onImportPlayers, onImportGrades }: EksporImporProps) {
  const [importType, setImportType] = useState<'pemain' | 'penilaian'>('pemain');
  const [importText, setImportText] = useState('');
  const [feedback, setFeedback] = useState('');

  // Generate Excel XLS XML payload dynamically
  const handleExportXLS = (type: 'pemain' | 'penilaian') => {
    let header = '';
    let rows = '';
    let filename = '';

    if (type === 'pemain') {
      header = 'ID\tNama Pemain\tPosisi\tTanggal Lahir\tNama Wali\tNo Telepon\tNomor Punggung\tAlamat Status';
      rows = players.map(p => 
        `${p.id}\t${p.name}\t${p.position}\t${p.dob}\t${p.parentName}\t${p.phone}\t${p.number}\t${p.address} (${p.status})`
      ).join('\n');
      filename = 'Al_Faraby_FC_Pemain_Data.xls';
    } else {
      header = 'ID\tID Pemain\tNama Pemain\tEvaluator\tTanggal\tRules\tPassing\tDribbling\tControl\tShooting\tSkill\tTeamwork\tStamina\tDeskripsi\tCatatan';
      rows = grades.map(g => 
        `${g.id}\t${g.playerId}\t${g.playerName}\t${g.evaluatorName}\t${g.evalDate}\t${g.rulesKnowledge}\t${g.passing}\t${g.dribbling}\t${g.control}\t${g.shooting}\t${g.individualSkill}\t${g.teamwork}\t${g.stamina}\t${g.description || ''}\t${g.notes || ''}`
      ).join('\n');
      filename = 'Al_Faraby_FC_Penilaian_Rapor.xls';
    }

    const blobContent = `${header}\n${rows}`;
    const blob = new Blob([blobContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Pre-formatted Spreadsheet Templates downloads
  const handleDownloadTemplate = () => {
    const templateHeader = importType === 'pemain'
      ? 'Nama Pemain\tPosisi\tTanggal Lahir (YYYY-MM-DD)\tNama Wali\tNo Telepon\tNomor Punggung\tAlamat'
      : 'Nama Pemain\tRules (1-100)\tPassing (1-100)\tDribbling (1-100)\tControl (1-100)\tShooting (1-100)\tStamina (1-100)\tDeskripsi\tCatatan';
    
    const mockSampleRow = importType === 'pemain'
      ? 'Ahmad Pratama Baru\tPenyerang\t2014-03-12\tHadi Pratama\t08123456789\t10\tJl. Mayor Damar Bokor'
      : 'Ahmad Pratama Baru\t85\t80\t85\t80\t90\t85\tSiswa menunjukkan disiplin stabil dalam memahami taktik dasar sepakbola.\tRekomendasi untuk terus mengasah keterampilan penguasaan bola.';

    const blobContent = `${templateHeader}\n${mockSampleRow}`;
    const blob = new Blob([blobContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Template_Excel_Al_Faraby_${importType}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setFeedback('Template Excel Spreadsheet berhasil diunduh!');
    setTimeout(() => setFeedback(''), 4000);
  };

  // Handle spreadsheet TSV parsing input
  const handleImportData = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importText.trim()) return;

    try {
      const lines = importText.trim().split('\n');
      if (lines.length <= 1) {
        setFeedback('Eror: Data tidak lengkap atau format kosong.');
        return;
      }

      // Skip the headers lines
      const headers = lines[0].split('\t');
      const importedCount = lines.length - 1;

      if (importType === 'pemain') {
        const newPlayers: Player[] = [];
        for (let i = 1; i < lines.length; i++) {
          const cells = lines[i].split('\t');
          if (cells.length < 2) continue;

          newPlayers.push({
            id: `player-${Date.now()}-${i}`,
            photoUrl: 'https://images.unsplash.com/photo-1543351611-58f69d7c1781?auto=format&fit=crop&q=80&w=200',
            name: cells[0] || 'Siswa Impor',
            position: (cells[1] as any) || 'Gelandang',
            dob: cells[2] || '2014-01-01',
            parentName: cells[3] || 'Wali Murid',
            phone: cells[4] || '0812XXXXXXXX',
            email: 'siswa@faraby.sch.id',
            status: 'aktif',
            number: cells[5] || '99',
            address: cells[6] || 'SD Islam Al Faraby'
          });
        }
        onImportPlayers(newPlayers);
        setFeedback(`Impor Berhasil: ${newPlayers.length} data Pemain baru tersinkron!`);
      } else {
        const newGrades: PlayerGrade[] = [];
        for (let i = 1; i < lines.length; i++) {
          const cells = lines[i].split('\t');
          if (cells.length < 2) continue;

          // Detect format style
          const isFullExport = cells.length >= 13 && cells[0].indexOf('grade-') === 0;
          const playerName = isFullExport ? cells[2] : cells[0];
          const rulesKnowledge = Number(isFullExport ? cells[5] : cells[1]) || 80;
          const passing = Number(isFullExport ? cells[6] : cells[2]) || 80;
          const dribbling = Number(isFullExport ? cells[7] : cells[3]) || 80;
          const control = Number(isFullExport ? cells[8] : cells[4]) || 80;
          const shooting = Number(isFullExport ? cells[9] : cells[5]) || 80;
          const individualSkill = Number(isFullExport ? cells[10] : 80) || 80;
          const teamwork = Number(isFullExport ? cells[11] : 80) || 80;
          const stamina = Number(isFullExport ? cells[12] : cells[6]) || 85;
          const description = isFullExport ? (cells[13] || '') : (cells[7] || '');
          const notes = isFullExport ? (cells[14] || '') : (cells[8] || '');

          newGrades.push({
            id: isFullExport ? cells[0] : `grade-${Date.now()}-${i}`,
            playerId: isFullExport ? cells[1] : `player-imported-${i}`,
            playerName,
            evalDate: isFullExport ? cells[4] : '2026-06-06',
            evaluatorName: isFullExport ? cells[3] : 'Ustadz Ahmad Fauzi',
            rulesKnowledge,
            passing,
            dribbling,
            control,
            shooting,
            individualSkill,
            vision: 80,
            response: 80,
            jump: 80,
            teamwork,
            mental: 80,
            spirit: 80,
            stamina,
            description,
            notes
          });
        }
        onImportGrades(newGrades);
        setFeedback(`Impor Berhasil: ${newGrades.length} data penilaian baru terintegrasi!`);
      }

      setImportText('');
    } catch (err: any) {
      setFeedback(`Eror: Gagal membaca file spreadsheet. Detail: ${err.message}`);
    }

    setTimeout(() => setFeedback(''), 4000);
  };

  return (
    <div className="space-y-6" id="ekspor-impor-view">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FileSpreadsheet className="text-cyan-400 w-6 h-6" />
            Integrasi Ekspor & Impor Cadangan Data
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Unduh berkas fisik Excel Spreadsheet (.xls atau CSV) dan simpan rapor cadangan klub dengan praktis.
          </p>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-lg bg-cyan-950/45 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-bold flex items-center gap-2 animate-pulse">
          <CheckCircle className="w-5 h-5" />
          {feedback}
        </div>
      )}

      {/* --- EXPORT CENTRE --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Export Box Left : Players */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-cyan-405 font-mono text-xs uppercase font-black">
              <Download className="w-4 h-4 text-cyan-400" />
              Ekspor Lembar Data Pemain
            </div>
            <h3 className="text-base font-bold text-gray-100">Al Faraby FC Player Roster</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Unduh cadangan seluruh siswa aktif, lulus, dan pindah sekolah. Berisi detail biodata fungsional, 
              squad number, nama orang tua, alamat dan nomor telepon.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-850/60 flex items-center justify-between mt-5">
            <span className="text-[10px] font-mono text-slate-500 uppercase">{players.length} Pemain terdata</span>
            <button
              onClick={() => handleExportXLS('pemain')}
              className="px-4 py-1.5 bg-cyan-500 hover:brightness-110 text-slate-950 font-bold font-mono text-[10px] uppercase rounded-lg flex items-center gap-1 transition-all"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-slate-950" />
              Unduh Lembar Excel
            </button>
          </div>
        </div>

        {/* Export Box Right : Grades */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-amber-505 font-mono text-xs uppercase font-black">
              <Download className="w-4 h-4 text-amber-500" />
              Ekspor Buku Penilaian Rapor
            </div>
            <h3 className="text-base font-bold text-gray-100">Al Faraby FC Performance Grades</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Unduh transkrip nilai keahlian dasar bola (passing, dribbling, control) dan lanjutan (shooting, tactic, stamina) 
              seluruh murid yang sudah di-inputkan oleh pelatih.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-850/60 flex items-center justify-between mt-5">
            <span className="text-[10px] font-mono text-slate-500 uppercase">{grades.length} Rapor Rinci</span>
            <button
              onClick={() => handleExportXLS('penilaian')}
              className="px-4 py-1.5 bg-amber-500 hover:brightness-110 text-slate-950 font-bold font-mono text-[10px] uppercase rounded-lg flex items-center gap-1 transition-all"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-slate-950" />
              Unduh Lembar Excel
            </button>
          </div>
        </div>

      </div>

      {/* --- IMPORT OR SEED PANEL --- */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-100 uppercase font-mono flex items-center gap-2">
              <Upload className="w-4 h-4 text-cyan-400" />
              Penyimpanan Impor & Pengunggah Cepat
            </h3>
            <p className="text-xs text-slate-400">
              Salin data dari berkas Excel spreadsheet (tab-separated) dan tempel di bawah untuk mengimpor massal.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={importType}
              onChange={e => setImportType(e.target.value as any)}
              className="px-3 py-1.5 bg-slate-950 border border-slate-820 rounded text-xs text-white"
            >
              <option value="pemain">Konversi Lembar Pemain</option>
              <option value="penilaian">Konversi Buku Penilaian</option>
            </select>

            <button
              onClick={handleDownloadTemplate}
              className="px-3 py-1.5 bg-slate-950 border border-slate-800 hover:border-slate-700 text-[10px] font-bold font-mono text-slate-300 uppercase rounded flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Unduh Template Excel
            </button>
          </div>
        </div>

        <form onSubmit={handleImportData} className="space-y-4">
          <textarea
            required
            rows={5}
            placeholder={
              importType === 'pemain'
                ? "Tempel baris data Excel terpisah Tab di sini.\nFormat:\nNama Pemain\tPosisi\tTanggal Lahir\tNama Wali\tNo Telepon\tNo Punggung\tAlamat"
                : "Tempel baris data penilaian terpisah Tab di sini.\nFormat:\nNama Pemain\tRules\tPassing\tDribbling\tControl\tShooting\tStamina"
            }
            value={importText}
            onChange={e => setImportText(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-lg text-xs font-mono text-cyan-300 outline-none focus:border-cyan-500 placeholder-slate-700 leading-relaxed"
          />

          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5" />
              Buku format dipisahkan dengan tombol Tab.
            </span>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-slate-950 font-bold uppercase text-xs tracking-wider rounded-lg flex items-center gap-1.5"
            >
              <RefreshCw className="w-4 h-4 text-slate-950" />
              Jalankan Analisis & Impor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

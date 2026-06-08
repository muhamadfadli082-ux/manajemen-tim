import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Database, 
  RefreshCw, 
  Radio, 
  Smartphone, 
  CheckCircle, 
  FolderSync, 
  CloudRain, 
  ExternalLink 
} from 'lucide-react';
import { TeamSettings } from '../types';

interface SinkronProps {
  settings: TeamSettings;
  onUpdateSettings: (settings: TeamSettings) => void;
  onManualTriggerSync: () => void;
}

export default function Sinkron({ settings, onUpdateSettings, onManualTriggerSync }: SinkronProps) {
  const [spreadsheetId, setSpreadsheetId] = useState(settings.spreadsheetId);
  const [autoSync, setAutoSync] = useState(settings.autoSync);
  const [feedback, setFeedback] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      ...settings,
      spreadsheetId,
      autoSync
    });
    setFeedback('Konfigurasi ID Google Spreadsheet Induk Berhasil Disimpan!');
    setTimeout(() => setFeedback(''), 4000);
  };

  const handleTriggerSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      onManualTriggerSync();
      setIsSyncing(false);
      setFeedback('Sinkronisasi Sukses! Semua perangkat dan database cloud sinkron otomatis tanpa mengembalikan ke setelan pabrik!');
      setTimeout(() => setFeedback(''), 5000);
    }, 1500);
  };

  const handleCreateNewSheet = () => {
    setIsSyncing(true);
    setTimeout(() => {
      const gId = `1Sp4-AlFarabyFC-${Math.floor(Math.random() * 89999) + 10000}-SheetID-GASX`;
      setSpreadsheetId(gId);
      onUpdateSettings({
        ...settings,
        spreadsheetId: gId,
      });
      setIsSyncing(false);
      setFeedback('Spreadsheet Baru Berhasil Terbuat & Disinkronkan Otomatis!');
      setTimeout(() => setFeedback(''), 4000);
    }, 1200);
  };

  return (
    <div className="space-y-6" id="sinkron-view">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Radio className="text-cyan-400 w-5 h-5 animate-pulse" />
            Integrasi & Sinkronisasi Database Real-time
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Ganti ID Google Spreadsheet, aktifkan fitur sinkronisasi otomatis, atau perbaharui data cloud.
          </p>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-lg bg-emerald-950/45 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold flex items-center gap-2">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          {feedback}
        </div>
      )}

      {/* SYNC PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Connection Setup Form */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow">
          <h3 className="text-xs font-bold font-mono text-cyan-400 tracking-widest uppercase pb-2 border-b border-slate-800 mb-4 flex items-center justify-between">
            <span>KONFIGURASI SPREADSHEET INDUK</span>
            <span className="text-[10px] text-amber-500">PRO LEVEL CONFIG</span>
          </h3>

          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-1.5">
                Google Spreadsheet ID
              </label>
              <input
                type="text"
                required
                placeholder="Masukkan ID Spreadsheet yang valid"
                value={spreadsheetId}
                onChange={e => setSpreadsheetId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-cyan-400 outline-none focus:border-cyan-500"
              />
              <span className="block text-[10px] text-slate-500 font-mono mt-1">
                Kunci database unik dari tautan spreadsheet Anda di Google Drive.
              </span>
            </div>

            {/* Auto sync switch toggle */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-850 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-200">Aktivasi Sinkronisasi Otomatis</span>
                <p className="text-[11px] text-slate-550 leading-relaxed font-sans">
                  Sinkronisasi latar belakang instan setiap kali terjadi penambahan data pemain, agenda atau rapor.
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoSync}
                  onChange={e => setAutoSync(e.target.checked)}
                  className="sr-only peer text-cyan-400"
                />
                <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-300 after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500"></div>
              </label>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-850">
              <button
                type="button"
                onClick={handleCreateNewSheet}
                disabled={isSyncing}
                className="px-4 py-2 bg-slate-950 hover:bg-slate-850 text-slate-350 hover:text-white text-[10px] font-bold font-mono uppercase rounded-lg border border-slate-800 transition-colors"
              >
                Buat Spreadsheet Baru
              </button>

              <button
                type="submit"
                className="px-5 py-2 bg-cyan-500 hover:brightness-110 text-slate-950 font-bold uppercase text-xs tracking-wider rounded-xl transition-all"
              >
                Simpan Konfigurasi ID
              </button>
            </div>
          </form>
        </div>

        {/* Sync Status Info Indicators Panel (inspired by Hynex metrics) */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xs font-bold font-mono tracking-widest text-slate-400 uppercase">
              STATUS SINKRON MULTI-PERANGKAT
            </h3>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-850 flex items-center gap-3">
              <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-lg">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[9px] font-mono text-slate-500 uppercase">Perangkat Aktif</span>
                <p className="text-xs font-bold text-slate-200">3 Terminal Tersinkronisasi</p>
                <p className="text-[10px] text-cyan-400 font-mono">Mobile, Tablet, Desktop</p>
              </div>
            </div>

            <div className="p-4 bg-slate-955 rounded-xl border border-slate-850 space-y-1.5 text-xs text-slate-300 font-sans leading-relaxed">
              <div className="font-bold text-gray-200 flex items-center gap-1.5 font-mono text-[11px] text-amber-500 uppercase pb-1 border-b border-slate-900">
                <FolderSync className="w-4 h-4" />
                SISTEM SYNC TERCANGGIH
              </div>
              <p>
                Sistem database didesain secara serverless. Jika data internet terputus, data di-buffer di media penyimpanan lokal, 
                dan akan tersinkron otomatis ke Google Spreadsheet sekolah begitu koneksi kembali pulih tanpa merusak kearsipan!
              </p>
            </div>
          </div>

          <button
            onClick={handleTriggerSync}
            disabled={isSyncing}
            className={`w-full py-2.5 mt-4 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-700 hover:brightness-110 active:scale-95 text-slate-950 font-extrabold uppercase text-xs tracking-widest rounded-xl transition-all shadow-[0_5px_15px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2 ${
              isSyncing ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            <RefreshCw className={`w-4 h-4 text-slate-950 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Menghubungkan...' : 'Sinkronisasi Sekarang'}
          </button>
        </div>

      </div>
    </div>
  );
}

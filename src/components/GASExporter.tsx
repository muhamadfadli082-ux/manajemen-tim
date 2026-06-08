import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  FileCode, 
  Terminal, 
  Check, 
  Copy, 
  BookOpen, 
  ExternalLink, 
  Sparkle 
} from 'lucide-react';
import { codeGS, setupGS, indexHTML } from '../utils/gasCode';

export default function GASExporter() {
  const [activeSubTab, setActiveSubTab] = useState<'code' | 'setup' | 'html'>('code');
  const [copied, setCopied] = useState(false);

  const activeCode = activeSubTab === 'code' ? codeGS : activeSubTab === 'setup' ? setupGS : indexHTML;
  const activeFileName = activeSubTab === 'code' ? 'code.gs' : activeSubTab === 'setup' ? 'setup.gs' : 'index.html';

  const handleCopy = () => {
    navigator.clipboard.writeText(activeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6" id="gas-exporter-view">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Terminal className="text-amber-500 w-5 h-5 animate-pulse" />
            Google Apps Script Developer Center
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Salin file skrip perantara fungsional untuk dideploy langsung ke akun Google Workspace SD Islam Al Faraby Anda.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Step Guide panel (1 Column wide) */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-4">
          <h3 className="text-xs font-black font-mono text-cyan-400 tracking-wider uppercase border-b border-slate-800 pb-2 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            PANDUAN 3 LANGKAH
          </h3>

          <div className="space-y-3.5 text-xs text-slate-300 font-sans leading-relaxed">
            <div className="space-y-1">
              <strong className="text-amber-500 font-mono">1. BUAT SPREADSHEET</strong>
              <p className="text-[11px] text-slate-400">
                Buka Google Spreadsheet baru, pergi ke menu <strong>Ekstensi &gt; Apps Script</strong>.
              </p>
            </div>

            <div className="space-y-1">
              <strong className="text-cyan-400 font-mono">2. SALIN SEMUA SCRIPT</strong>
              <p className="text-[11px] text-slate-400">
                Buat berkas skrip dengan nama <code>code.gs</code>, <code>setup.gs</code>, dan file HTML <code>index.html</code>, lalu paste kode dari tab kanan.
              </p>
            </div>

            <div className="space-y-1">
              <strong className="text-emerald-400 font-mono">3. JALANKAN SETUP</strong>
              <p className="text-[11px] text-slate-400">
                Klik tombol <strong>Run</strong> pada fungsi <code>setupWorkspace()</code> untuk melahirkan tabel database Al Faraby secara otomatis!
              </p>
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-850/80 mt-2 text-[10px] font-mono text-slate-500 leading-normal">
            ⚙️ Skrip terintegrasi otomatis dengan Google Calendar (training match) dan Drive (profil siswa).
          </div>
        </div>

        {/* Script Display panel (3 Columns wide) */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col justify-between">
          
          <div className="bg-slate-950 p-3 border-b border-slate-850 flex items-center justify-between gap-4">
            {/* Toggles subtabs */}
            <div className="flex items-center gap-1.5">
              {[
                { id: 'code', label: 'code.gs' },
                { id: 'setup', label: 'setup.gs' },
                { id: 'html', label: 'index.html' },
              ].map(subTab => (
                <button
                  key={subTab.id}
                  onClick={() => setActiveSubTab(subTab.id as any)}
                  className={`px-3 py-1 rounded text-xs font-mono lowercase transition-all ${
                    activeSubTab === subTab.id
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold'
                      : 'text-slate-450 hover:text-slate-200'
                  }`}
                >
                  {subTab.label}
                </button>
              ))}
            </div>

            {/* Quick copy buttons */}
            <button
              onClick={handleCopy}
              className="px-3.5 py-1 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-850 text-slate-300 font-mono text-[10px] font-bold uppercase rounded flex items-center gap-1.5 transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span className="text-emerald-400">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Salin Kode
                </>
              )}
            </button>
          </div>

          {/* Main Code Box displayer */}
          <div className="p-4 bg-slate-950 text-cyan-300 font-mono text-xs overflow-auto max-h-[360px] leading-relaxed whitespace-pre font-bold select-all">
            {activeCode}
          </div>

          {/* Bottom metadata */}
          <div className="bg-slate-950 p-3 border-t border-slate-850 flex justify-between items-center text-[10px] font-mono text-slate-500">
            <span>Berkas: {activeFileName}</span>
            <span className="flex items-center gap-1">
              <Sparkle className="w-3 h-3 text-amber-500" />
              Tingkat Keamanan Tinggi (OAuth Secured)
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}

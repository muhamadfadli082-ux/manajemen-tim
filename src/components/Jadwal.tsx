import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Plus, 
  UserPlus, 
  Users, 
  Bookmark, 
  Sparkle, 
  FileText, 
  Trophy 
} from 'lucide-react';
import { EventSchedule } from '../types';

interface JadwalProps {
  schedules: EventSchedule[];
  onAddSchedule: (schedule: EventSchedule) => void;
  role: 'admin' | 'user' | 'wali';
}

export default function Jadwal({ schedules, onAddSchedule, role }: JadwalProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'latihan' | 'sparring'>('latihan');
  const [date, setDate] = useState('2026-06-08');
  const [time, setTime] = useState('15:30 - 17:30');
  const [location, setLocation] = useState('Lapangan Al Faraby FC');
  const [opponent, setOpponent] = useState('');
  const [notes, setNotes] = useState('');

  const isReadOnly = role === 'wali';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newEvent: EventSchedule = {
      id: `sch-${Date.now()}`,
      title,
      type,
      date,
      time,
      location,
      opponent: type === 'sparring' ? opponent : undefined,
      notes
    };

    onAddSchedule(newEvent);

    // Reset fields
    setTitle('');
    setType('latihan');
    setDate('2026-06-08');
    setTime('15:30 - 17:30');
    setLocation('Lapangan Al Faraby FC');
    setOpponent('');
    setNotes('');
    setIsAdding(false);
  };

  return (
    <div className="space-y-6" id="jadwal-view">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Calendar className="text-rose-400 w-6 h-6" />
            Agenda Latihan & Pertandingan (Sparring)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Pantau rincian kursus harian, spar dan agenda persahabatan Al Faraby FC secara real time.
          </p>
        </div>

        {!isReadOnly && !isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 bg-gradient-to-r from-rose-500 to-amber-600 hover:brightness-110 active:scale-95 text-xs font-bold font-mono tracking-wider text-slate-950 rounded-xl transition-all flex items-center gap-2 uppercase shadow-[0_4px_15px_rgba(244,63,94,0.3)]"
          >
            <Plus className="w-4 h-4 text-slate-950" />
            Buat Agenda Baru
          </button>
        )}
      </div>

      {/* --- ADD SCHEDULE FORM --- */}
      <AnimatePresence>
        {isAdding && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4 overflow-hidden"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-black font-mono tracking-widest text-rose-400 uppercase flex items-center gap-1.5">
                <Sparkle className="w-4 h-4 text-amber-500 animate-spin" />
                Daftarkan Agenda Terjadwal Baru
              </span>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="text-slate-400 hover:text-slate-200 text-xs font-mono uppercase"
              >
                Batal
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Type Toggle */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 font-mono">
                  Kategori Agenda
                </label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setType('latihan')}
                    className={`py-1.5 px-3 rounded-lg text-xs font-bold uppercase transition-all ${
                      type === 'latihan'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 border font-black'
                        : 'bg-slate-950 border border-slate-850 text-slate-500'
                    }`}
                  >
                    Latihan Rutin
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('sparring')}
                    className={`py-1.5 px-3 rounded-lg text-xs font-bold uppercase transition-all ${
                      type === 'sparring'
                        ? 'bg-rose-500/20 border-rose-500 text-rose-400 border font-black'
                        : 'bg-slate-950 border border-slate-850 text-slate-500'
                    }`}
                  >
                    Sparring Match
                  </button>
                </div>
              </div>

              {/* Title Input */}
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">
                  Judul Sesi / Nama Agenda Pertandingan
                </label>
                <input
                  type="text"
                  required
                  placeholder={type === 'latihan' ? 'Contoh: Latihan Rutin Fisik & Uji Stamina' : 'Contoh: Sparring vs SD Insan Cendekia'}
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:border-rose-500 outline-none"
                />
              </div>

              {/* Date Input */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 font-mono">Tanggal Pelaksanaan</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:border-rose-500 outline-none"
                />
              </div>

              {/* Time Input */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 font-mono">Waktu / Jam Sesi</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 15:30 - 17:00 WIB"
                  value={time}
                  onChange={e => setTime(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:border-rose-500 outline-none font-mono"
                />
              </div>

              {/* Field Place/Venue Location */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 font-mono">Tempat / Lapangan</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:border-rose-500 outline-none"
                />
              </div>

              {/* Sparring Opponent Input (Visible only on Sparring matchmaking selection) */}
              {type === 'sparring' && (
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 font-mono">
                    Nama Tim Lawan
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: SD Islam Al-Hidayah"
                    value={opponent}
                    onChange={e => setOpponent(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:border-rose-500 outline-none"
                  />
                </div>
              )}

              {/* Notes Input */}
              <div className={type === 'sparring' ? 'md:col-span-2' : 'md:col-span-3'}>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">
                  Instruksi / Catatan Penting
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Wajib mengenakan jersey Merah Al Faraby FC."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:border-rose-500 outline-none"
                />
              </div>

            </div>

            <div className="pt-2 border-t border-slate-800/40 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-rose-500 hover:brightness-110 text-slate-950 font-bold uppercase text-xs tracking-wider rounded-xl transition-all shadow-md"
              >
                Simpan & Daftarkan Agenda
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* --- AGENDA TIMELINE DISPLAY CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {schedules.map((sch) => (
          <div
            key={sch.id}
            className={`p-5 rounded-2xl border flex flex-col justify-between gap-4 relative overflow-hidden transition-all hover:scale-[1.01] ${
              sch.type === 'sparring'
                ? 'bg-rose-950/15 border-rose-900/30 text-rose-350'
                : 'bg-emerald-950/10 border-emerald-900/30 text-emerald-350'
            }`}
          >
            {/* Corner Decorative Icon badge */}
            <div className="absolute right-3 top-3 opacity-[0.06] pointer-events-none">
              {sch.type === 'sparring' ? (
                <Trophy className="w-24 h-24 text-rose-500" />
              ) : (
                <Calendar className="w-24 h-24 text-emerald-500" />
              )}
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center gap-1.5">
                <span className={`text-[9px] font-mono leading-none px-2 py-1 rounded font-black uppercase ${
                  sch.type === 'sparring'
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/20'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
                }`}>
                  {sch.type}
                </span>

                {sch.opponent && (
                  <span className="text-[9px] font-mono leading-none bg-slate-950 text-amber-400 px-2 py-1 rounded border border-slate-850">
                    Lawan: {sch.opponent}
                  </span>
                )}
              </div>

              <h4 className="text-base font-extrabold text-white leading-snug">
                {sch.title}
              </h4>

              {sch.notes && (
                <p className="text-xs text-slate-400 bg-slate-950/60 p-2.5 rounded-lg border border-slate-850/40 italic">
                  &ldquo;{sch.notes}&rdquo;
                </p>
              )}
            </div>

            {/* Bottom metadata tags */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-850 font-mono text-[10px] text-slate-400">
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                <span className="font-bold text-slate-200">{sch.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                <span className="truncate">{sch.time}</span>
              </div>
              <div className="flex items-center gap-1 col-span-1">
                <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                <span className="truncate" title={sch.location}>{sch.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

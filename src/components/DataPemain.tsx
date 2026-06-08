import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Search, 
  UserPlus, 
  Trash2, 
  Edit3, 
  Check, 
  UserCheck, 
  Eye, 
  Calendar, 
  Phone, 
  ShieldAlert, 
  Filter, 
  FolderSearch, 
  Sparkle, 
  CloudLightning 
} from 'lucide-react';
import { Player } from '../types';

interface DataPemainProps {
  players: Player[];
  onAddPlayer: (player: Player) => void;
  onUpdatePlayer: (player: Player) => void;
  onDeletePlayer: (playerId: string) => void;
  role: 'admin' | 'user' | 'wali';
}

const DRIVE_MOCK_PHOTOS = [
  { name: 'atlet_muda_merah.png', url: 'https://images.unsplash.com/photo-1543351611-58f69d7c1781?auto=format&fit=crop&q=80&w=200' },
  { name: 'kiper_academy_hijau.png', url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=200' },
  { name: 'striker_pagedangan_orange.jpg', url: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&q=80&w=200' },
  { name: 'gelandang_bokor_style.jpg', url: 'https://images.unsplash.com/photo-1505156868547-9b49f4df4e04?auto=format&fit=crop&q=80&w=200' },
  { name: 'jersey_faraby_vintage.png', url: 'https://images.unsplash.com/photo-1544698310-74ea9d1c8258?auto=format&fit=crop&q=80&w=200' },
  { name: 'avatar_pemain_universal.jpg', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200' }
];

export default function DataPemain({ players, onAddPlayer, onUpdatePlayer, onDeletePlayer, role }: DataPemainProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [posFilter, setPosFilter] = useState<string>('Semua');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [driveSearch, setDriveSearch] = useState('');
  const [showDriveModal, setShowDriveModal] = useState(false);
  const [driveCallbackTarget, setDriveCallbackTarget] = useState<'add' | 'edit'>('add');

  // Addition or edit form inputs
  const [isAdding, setIsAdding] = useState(false);
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);

  // Forms state
  const [newName, setNewName] = useState('');
  const [newPosition, setNewPosition] = useState<'Kiper' | 'Bek' | 'Gelandang' | 'Penyerang'>('Gelandang');
  const [newDob, setNewDob] = useState('2014-01-01');
  const [newParent, setNewParent] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  const isReadOnly = role === 'user' || role === 'wali';

  // Sort and Filter Players
  const processedPlayers = useMemo(() => {
    return players
      .filter((p) => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              p.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              (p.number && p.number.includes(searchQuery));
        const matchesPosition = posFilter === 'Semua' || p.position === posFilter;
        return matchesSearch && matchesPosition;
      })
      // Sorted alphabetically a-z
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [players, searchQuery, posFilter]);

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const randomizedNumber = Math.floor(Math.random() * 98) + 1;
    const defaultPhoto = photoUrl || 'https://images.unsplash.com/photo-1543351611-58f69d7c1781?auto=format&fit=crop&q=80&w=200';

    const cleanPlayer: Player = {
      id: `player-${Date.now()}`,
      photoUrl: defaultPhoto,
      name: newName,
      dob: newDob || '2014-01-01',
      status: 'aktif',
      position: newPosition,
      parentName: newParent || 'Orang Tua Siswa',
      phone: newPhone || '0812XXXXXXXX',
      email: newEmail || `${newName.toLowerCase().replace(/\s+/g, '')}@faraby.sch.id`,
      number: newNumber || String(randomizedNumber),
      address: newAddress || 'Jl. Mayor Damar, Bokor'
    };

    onAddPlayer(cleanPlayer);
    
    // reset
    setNewName('');
    setNewPosition('Gelandang');
    setNewDob('2014-01-01');
    setNewParent('');
    setNewPhone('');
    setNewEmail('');
    setNewNumber('');
    setNewAddress('');
    setPhotoUrl('');
    setIsAdding(false);
  };

  const handleStartEdit = (p: Player) => {
    setEditingPlayerId(p.id);
    setNewName(p.name);
    setNewPosition(p.position);
    setNewDob(p.dob);
    setNewParent(p.parentName);
    setNewPhone(p.phone);
    setNewEmail(p.email);
    setNewNumber(p.number);
    setNewAddress(p.address);
    setPhotoUrl(p.photoUrl);
  };

  const handleUpdate = (e: React.FormEvent, playerToUpdate: Player) => {
    e.preventDefault();
    const updated: Player = {
      ...playerToUpdate,
      name: newName,
      position: newPosition,
      dob: newDob,
      parentName: newParent,
      phone: newPhone,
      email: newEmail,
      number: newNumber,
      address: newAddress,
      photoUrl: photoUrl || playerToUpdate.photoUrl
    };
    onUpdatePlayer(updated);
    setEditingPlayerId(null);
    clearFields();
  };

  const clearFields = () => {
    setNewName('');
    setNewPosition('Gelandang');
    setNewDob('2014-01-01');
    setNewParent('');
    setNewPhone('');
    setNewEmail('');
    setNewNumber('');
    setNewAddress('');
    setPhotoUrl('');
  };

  // Google Drive photo select simulation
  const filteredDriveMock = useMemo(() => {
    return DRIVE_MOCK_PHOTOS.filter(f => f.name.toLowerCase().includes(driveSearch.toLowerCase()));
  }, [driveSearch]);

  const selectDriveImage = (url: string) => {
    setPhotoUrl(url);
    setShowDriveModal(false);
  };

  return (
    <div className="space-y-6" id="data-pemain-tab-view">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-850">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Users className="text-cyan-400 w-6 h-6" />
            Manajemen Data Pemain FC
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Sistem validasi siswa SD Islam Al Faraby FC dengan posisi tim, dan biodata wali murid.
          </p>
        </div>

        {!isReadOnly && !isAdding && (
          <button
            onClick={() => {
              clearFields();
              setIsAdding(true);
            }}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 active:scale-95 text-xs font-bold font-mono tracking-wider text-slate-950 rounded-xl transition-all flex items-center gap-2 uppercase shadow-[0_4px_15px_rgba(6,182,212,0.3)]"
          >
            <UserPlus className="w-4 h-4 text-slate-950" />
            Tambah Siswa Baru
          </button>
        )}
      </div>

      {/* --- QUICK INPUT ADD FORM (Cukup 2 input saja sudah bisa save!) --- */}
      <AnimatePresence>
        {isAdding && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleQuickAdd}
            className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4 overflow-hidden"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-black font-mono tracking-widest text-cyan-400 uppercase flex items-center gap-1">
                <Sparkle className="w-4 h-4 text-amber-500 animate-spin" />
                Tambah Cepat: Hanya Perlu Nama & Posisi!
              </span>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="text-slate-400 hover:text-slate-200 text-xs font-mono uppercase"
              >
                Batal
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Nama (Wajib 1) */}
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 font-mono">
                  Nama Murid Siswa (Wajib)
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ahmad Pratama"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:border-cyan-500 outline-none text-white text-sm"
                />
              </div>

              {/* Posisi (Wajib 2) */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 font-mono">
                  Posisi Lapangan (Wajib)
                </label>
                <select
                  value={newPosition}
                  onChange={(e) => setNewPosition(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:border-cyan-500 outline-none"
                >
                  <option value="Kiper">Kiper (GK)</option>
                  <option value="Bek">Bek (DF)</option>
                  <option value="Gelandang">Gelandang (MF)</option>
                  <option value="Penyerang">Penyerang (FW)</option>
                </select>
              </div>

              {/* Optional profile search mockup button */}
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => {
                    setDriveCallbackTarget('add');
                    setShowDriveModal(true);
                  }}
                  className="w-full py-2 bg-slate-950 hover:bg-slate-850 text-slate-300 font-mono text-[11px] font-bold uppercase rounded-lg border border-slate-850 flex items-center justify-center gap-1.5 transition-all"
                >
                  <FolderSearch className="w-3.5 h-3.5 text-cyan-400" />
                  Cari Foto Google Drive
                </button>
              </div>
            </div>

            {/* Expander containing advanced details inside the form */}
            <details className="group border-t border-slate-800/60 pt-2 cursor-pointer">
              <summary className="text-[10px] font-mono text-slate-500 select-none uppercase group-open:text-cyan-500">
                + Tambah Detail Lebih Rinci (Opsional / Terisi Otomatis)
              </summary>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-3 cursor-default" onClick={(e) => e.stopPropagation()}>
                <div>
                  <label className="block text-[9px] font-bold text-slate-500 uppercase font-mono mb-1">Tanggal Lahir</label>
                  <input
                    type="date"
                    value={newDob}
                    onChange={(e) => setNewDob(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-500 uppercase font-mono mb-1">Nama Wali Murid</label>
                  <input
                    type="text"
                    placeholder="Nama Orang Tua"
                    value={newParent}
                    onChange={(e) => setNewParent(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-850 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-500 uppercase font-mono mb-1">Nomor Punggung</label>
                  <input
                    type="number"
                    placeholder="9"
                    value={newNumber}
                    onChange={(e) => setNewNumber(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-850 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-500 uppercase font-mono mb-1">No Telepon Wali</label>
                  <input
                    type="text"
                    placeholder="0812..."
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-850 rounded-lg text-xs font-mono"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[9px] font-bold text-slate-500 uppercase font-mono mb-1">Alamat Domisili Siswa</label>
                  <input
                    type="text"
                    placeholder="Alamat Lengkap"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-850 rounded-lg text-xs"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[9px] font-bold text-slate-500 uppercase font-mono mb-1">Photo URL Kustom</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-850 rounded-lg text-xs font-mono text-cyan-400"
                  />
                </div>
              </div>
            </details>

            <div className="pt-2 border-t border-slate-800/40 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:brightness-110 text-slate-950 font-bold uppercase text-xs tracking-wider rounded-xl transition-all"
                id="quick-save-btn"
              >
                Penyimpanan Instan Siswa
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* SEARCH AND FILTERS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3.5 rounded-xl">
        {/* Search input bar */}
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Cari pemain, no punggung, atau wali..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500"
          />
        </div>

        {/* Filter select list */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[11px] text-slate-400 font-mono uppercase">Posisi:</span>
          <select
            value={posFilter}
            onChange={(e) => setPosFilter(e.target.value)}
            className="bg-slate-950 text-white border border-slate-800 px-3 py-1.5 rounded-lg text-xs outline-none"
          >
            <option value="Semua">Semua Posisi</option>
            <option value="Kiper">Kiper (GK)</option>
            <option value="Bek">Bek (DF)</option>
            <option value="Gelandang">Gelandang (MF)</option>
            <option value="Penyerang">Penyerang (FW)</option>
          </select>
        </div>
      </div>

      {/* --- PLAYERS LIST TABLE HOVER GRID --- */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs border-collapse">
            <thead className="bg-slate-950 border-b border-slate-850 text-slate-400 uppercase font-mono text-[10px] tracking-wider">
              <tr>
                <th className="p-3.5 text-center w-12">Foto</th>
                <th className="p-3.5">Nama Siswa (A-Z)</th>
                <th className="p-3.5">Posisi</th>
                <th className="p-3.5">Wali Murid</th>
                <th className="p-3.5 text-center">No Punggung</th>
                <th className="p-3.5 text-right">Aksi & Biodata</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850/65">
              {processedPlayers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-8 text-slate-500 font-mono">
                    Tidak ada siswa Al Faraby FC dengan kriteria pencarian ini.
                  </td>
                </tr>
              ) : (
                processedPlayers.map((player) => (
                  <tr 
                    key={player.id} 
                    className="hover:bg-slate-850/40 transition-colors"
                  >
                    {/* Column 1: Profile photo URL with Drive search overlay */}
                    <td className="p-3 text-center">
                      <div className="relative group mx-auto w-10 h-10">
                        <img 
                          src={player.photoUrl} 
                          alt={player.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-700 mx-auto"
                          referrerPolicy="no-referrer"
                        />
                        {!isReadOnly && (
                          <button
                            type="button"
                            onClick={() => {
                              handleStartEdit(player);
                              setDriveCallbackTarget('edit');
                              setShowDriveModal(true);
                            }}
                            className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center text-cyan-400 transition-opacity"
                            title="Ganti Foto via Drive"
                          >
                            <FolderSearch className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Column 2: Name clickable card trigger */}
                    <td className="p-3 font-semibold text-gray-100">
                      {editingPlayerId === player.id ? (
                        <input
                          type="text"
                          value={newName}
                          onChange={e => setNewName(e.target.value)}
                          className="px-2 py-1 bg-slate-950 border border-slate-800 rounded outline-none"
                        />
                      ) : (
                        <button
                          type="button"
                          onClick={() => setSelectedPlayer(player)}
                          className="text-left font-bold text-gray-200 hover:text-cyan-400 transition-colors py-1 cursor-pointer"
                        >
                          {player.name}
                        </button>
                      )}
                    </td>

                    {/* Column 3: Position label */}
                    <td className="p-3">
                      {editingPlayerId === player.id ? (
                        <select
                          value={newPosition}
                          onChange={e => setNewPosition(e.target.value as any)}
                          className="px-1 py-1 bg-slate-950 border border-slate-800 rounded outline-none text-xs text-white"
                        >
                          <option value="Kiper">Kiper</option>
                          <option value="Bek">Bek</option>
                          <option value="Gelandang">Gelandang</option>
                          <option value="Penyerang">Penyerang</option>
                        </select>
                      ) : (
                        <span className={`px-2.5 py-0.5 rounded-full font-mono font-bold text-[9px] uppercase ${
                          player.position === 'Kiper' ? 'bg-rose-500/10 text-rose-450 border border-rose-500/10' :
                          player.position === 'Bek' ? 'bg-yellow-500/10 text-yellow-550 border border-yellow-500/10' :
                          player.position === 'Gelandang' ? 'bg-cyan-500/10 text-cyan-440 border border-cyan-500/10' :
                          'bg-emerald-500/10 text-emerald-450 border border-emerald-500/10'
                        }`}>
                          {player.position}
                        </span>
                      )}
                    </td>

                    {/* Column 4: Parent info */}
                    <td className="p-3 text-slate-350">
                      {editingPlayerId === player.id ? (
                        <input
                          type="text"
                          value={newParent}
                          onChange={e => setNewParent(e.target.value)}
                          className="px-2 py-1 bg-slate-950 border border-slate-800 rounded outline-none text-xs text-white"
                        />
                      ) : (
                        player.parentName || '-'
                      )}
                    </td>

                    {/* Column 5: Squad ID Number */}
                    <td className="p-3 text-center font-mono font-bold text-slate-300">
                      {editingPlayerId === player.id ? (
                        <input
                          type="text"
                          value={newNumber}
                          onChange={e => setNewNumber(e.target.value)}
                          className="w-12 px-1 py-0.5 bg-slate-950 border border-slate-800 rounded outline-none text-center"
                        />
                      ) : (
                        `#${player.number || '00'}`
                      )}
                    </td>

                    {/* Column 6: Action controllers */}
                    <td className="p-3 text-right space-x-1">
                      {editingPlayerId === player.id ? (
                        <div className="inline-flex gap-1">
                          <button
                            onClick={(e) => handleUpdate(e, player)}
                            className="p-1 px-2 bg-emerald-600 hover:bg-emerald-555 text-slate-950 text-[10px] font-bold rounded uppercase font-mono"
                          >
                            Simpan
                          </button>
                          <button
                            onClick={() => setEditingPlayerId(null)}
                            className="p-1 px-2 bg-slate-800 text-slate-300 text-[10px] rounded uppercase font-mono"
                          >
                            Batal
                          </button>
                        </div>
                      ) : (
                        <div className="inline-flex gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedPlayer(player)}
                            className="p-1.5 text-slate-400 hover:text-cyan-400 transition-colors"
                            title="Lihat Biodata Card"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {!isReadOnly && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleStartEdit(player)}
                                className="p-1.5 text-slate-400 hover:text-amber-500 transition-colors"
                                title="Edit Detail Murid"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm(`Hapus data ${player.name} dari sistem?`)) {
                                    onDeletePlayer(player.id);
                                  }
                                }}
                                className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                                title="Hapus Pemain"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- DETAIL PASSPORT CARD MODAL (Triggered by name click) --- */}
      <AnimatePresence>
        {selectedPlayer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-755/90 p-6 rounded-2xl max-w-md w-full shadow-2xl relative"
            >
              <button
                onClick={() => setSelectedPlayer(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 text-2xl font-bold cursor-pointer"
                title="Tutup & Keluar"
              >
                &times;
              </button>

              {/* FUTURISTIC PASSPORT BADGE */}
              <div className="text-center border-b border-slate-800 pb-4 mb-4">
                <span className="text-[10px] font-mono tracking-[0.2em] text-cyan-400 uppercase">
                  AL FARABY TEAM PASSPORT CARD
                </span>
                <div className="mt-3 relative inline-block">
                  <div className="absolute inset-0 bg-cyan-500/25 blur-lg rounded-full" />
                  <img
                    src={selectedPlayer.photoUrl}
                    alt={selectedPlayer.name}
                    className="w-24 h-24 rounded-full object-cover border-2 border-amber-500 scale-95 relative"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute bottom-0 right-1 px-2 py-0.5 bg-amber-500 text-slate-950 text-xs font-black rounded-full font-mono">
                    #{selectedPlayer.number || '9'}
                  </span>
                </div>

                <h3 className="text-xl font-black tracking-wide text-white mt-3">
                  {selectedPlayer.name}
                </h3>
                <span className="inline-block mt-1 px-3 py-1 bg-cyan-950/80 text-cyan-400 text-xs font-bold font-mono uppercase tracking-wider rounded-full border border-cyan-500/30">
                  {selectedPlayer.position}
                </span>
              </div>

              {/* DETAILS FIELDS GRID */}
              <div className="space-y-2.5 text-xs text-slate-300 font-sans">
                <div className="flex justify-between py-1.5 border-b border-slate-850">
                  <span className="text-slate-500 font-mono text-[10px] uppercase flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Tanggal Lahir:
                  </span>
                  <span className="font-semibold text-gray-200">{selectedPlayer.dob || '01-01-2014'}</span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-slate-850">
                  <span className="text-slate-500 font-mono text-[10px] uppercase flex items-center gap-1">
                    👥 Orang Tua / Wali:
                  </span>
                  <span className="font-semibold text-gray-200">{selectedPlayer.parentName || '-'}</span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-slate-850">
                  <span className="text-slate-500 font-mono text-[10px] uppercase flex items-center gap-1">
                    <Phone className="w-3 h-3" /> No Handphone:
                  </span>
                  <span className="font-semibold text-slate-200 font-mono">{selectedPlayer.phone || '08xx-xxxx-xxxx'}</span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-slate-850">
                  <span className="text-slate-500 font-mono text-[10px] uppercase flex items-center gap-1">
                    📧 Kontak Email:
                  </span>
                  <span className="font-semibold text-slate-300 font-mono text-[10px]">{selectedPlayer.email || '-'}</span>
                </div>

                <div className="flex flex-col py-1.5 gap-1">
                  <span className="text-slate-500 font-mono text-[10px] uppercase flex items-center gap-1">
                    🏠 Alamat Tempat Tinggal:
                  </span>
                  <p className="text-xs text-gray-200 italic leading-relaxed bg-slate-950 p-2.5 rounded-lg border border-slate-850">
                    {selectedPlayer.address || 'SD Islam Al Faraby'}
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-800 flex justify-between items-center">
                <span className="text-[10px] uppercase font-mono font-bold text-emerald-400">
                  ● Status: Terdaftar
                </span>

                <button
                  type="button"
                  onClick={() => setSelectedPlayer(null)}
                  className="px-4 py-1.5 bg-slate-950 text-white font-mono text-[10px] font-bold uppercase rounded border border-slate-800"
                >
                  Tutup Rapor
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- GOOGLE DRIVE SIMULATOR DIALOG POPUP --- */}
      <AnimatePresence>
        {showDriveModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-700/80 p-5 rounded-2xl max-w-md w-full shadow-2xl relative"
            >
              <button
                type="button"
                onClick={() => setShowDriveModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white font-bold"
              >
                &times;
              </button>

              <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-4">
                <CloudLightning className="text-cyan-400 w-5 h-5" />
                <div>
                  <h3 className="text-sm font-bold text-slate-100 uppercase font-mono">Google Drive File Search Utility</h3>
                  <p className="text-[10px] text-slate-400">Hubungan serverless langsung ke SD Al Faraby Drive Cloud</p>
                </div>
              </div>

              <div className="relative mb-4">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">
                  <Search className="w-3.5 h-3.5" />
                </span>
                <input
                  type="text"
                  placeholder="Ketik kata kunci pencarian file (contoh: atlet)..."
                  value={driveSearch}
                  onChange={(e) => setDriveSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 bg-slate-950 border border-slate-850 rounded-lg text-xs placeholder-slate-600 outline-none focus:border-cyan-500 text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 max-h-[220px] overflow-y-auto pr-1">
                {filteredDriveMock.length === 0 ? (
                  <p className="col-span-2 text-center text-slate-600 font-mono text-[10px] py-6">
                    File gambar tidak ditemukan di Google Drive Al Faraby.
                  </p>
                ) : (
                  filteredDriveMock.map((file, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => selectDriveImage(file.url)}
                      className="bg-slate-950/80 border border-slate-850/80 rounded-xl p-2 hover:border-cyan-500/40 text-left hover:bg-slate-850/20 transition-all flex items-center gap-2"
                    >
                      <img 
                        src={file.url} 
                        alt={file.name} 
                        className="w-8 h-8 rounded object-cover border border-slate-800"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 overflow-hidden">
                        <p className="text-[10px] text-gray-200 font-mono truncate">{file.name}</p>
                        <p className="text-[8px] text-amber-500 font-mono">PNG IMAGE</p>
                      </div>
                    </button>
                  ))
                )}
              </div>

              <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 mt-5 pt-3 border-t border-slate-800">
                <span>Google Drive Connected API</span>
                <button
                  type="button"
                  onClick={() => setShowDriveModal(false)}
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

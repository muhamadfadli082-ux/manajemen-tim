import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Calendar, 
  Award, 
  Settings as SettingsIcon, 
  Database, 
  Radio, 
  Terminal, 
  LogOut, 
  Menu, 
  X, 
  Home, 
  ChevronLeft, 
  ChevronRight, 
  Trophy, 
  Sparkle, 
  UserCheck 
} from 'lucide-react';

import { 
  Player, 
  EventSchedule, 
  PlayerGrade, 
  TeamSettings, 
  UserRole 
} from './types';

import { 
  loadTeamSettings, 
  saveTeamSettings, 
  loadPlayers, 
  savePlayers, 
  loadSchedules, 
  saveSchedules, 
  loadGrades, 
  saveGrades, 
  DEFAULT_CREDENTIALS 
} from './utils/dummyData';

// Subcomponents import
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import DataManajemen from './components/DataManajemen';
import DataPemain from './components/DataPemain';
import Jadwal from './components/Jadwal';
import Penilaian from './components/Penilaian';
import EksporImpor from './components/EksporImpor';
import Sinkron from './components/Sinkron';
import Pengaturan from './components/Pengaturan';
import GASExporter from './components/GASExporter';
import TeamLogo from './components/TeamLogo';

export default function App() {
  // Authentication states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('admin');
  const [currentUsername, setCurrentUsername] = useState('');
  const [linkedPlayerId, setLinkedPlayerId] = useState<string | undefined>(undefined);

  // Core Database states
  const [settings, setSettings] = useState<TeamSettings>(loadTeamSettings());
  const [players, setPlayers] = useState<Player[]>(loadPlayers());
  const [schedules, setSchedules] = useState<EventSchedule[]>(loadSchedules());
  const [grades, setGrades] = useState<PlayerGrade[]>(loadGrades());

  // Navigation states
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sync animation triggers
  const [syncFeedbackMessage, setSyncFeedbackMessage] = useState('');

  // Persist alterations automatically on state changes
  useEffect(() => {
    saveTeamSettings(settings);
  }, [settings]);

  useEffect(() => {
    savePlayers(players);
  }, [players]);

  useEffect(() => {
    saveSchedules(schedules);
  }, [schedules]);

  useEffect(() => {
    saveGrades(grades);
  }, [grades]);

  // Handle successful login callbacks
  const handleLoginSuccess = (role: UserRole, username: string, linkedId?: string) => {
    setCurrentUserRole(role);
    setCurrentUsername(username);
    setLinkedPlayerId(linkedId);
    setIsLoggedIn(true);

    // Dynamic landing page setup
    if (role === 'wali') {
      setCurrentTab('dashboard'); // custom view
    } else {
      setCurrentTab('dashboard');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUsername('');
  };

  // Database atomic state modifiers
  const handleAddPlayer = (newPlayer: Player) => {
    setPlayers(prev => [newPlayer, ...prev]);
    triggerAutoSyncNotification(`Siswa ${newPlayer.name} berhasil didaftarkan ke cloud SD Al Faraby.`);
  };

  const handleUpdatePlayer = (updatedPlayer: Player) => {
    setPlayers(prev => prev.map(p => p.id === updatedPlayer.id ? updatedPlayer : p));
    triggerAutoSyncNotification(`Data biodasi siswa ${updatedPlayer.name} berhasil diperbaharui.`);
  };

  const handleDeletePlayer = (playerId: string) => {
    const student = players.find(p => p.id === playerId);
    setPlayers(prev => prev.filter(p => p.id !== playerId));
    // Also cascades delete child grades
    setGrades(prev => prev.filter(g => g.playerId !== playerId));
    triggerAutoSyncNotification(`Pemain ${student?.name || 'Siswa'} telah dikeluarkan dari database.`);
  };

  const handleAddSchedule = (newSch: EventSchedule) => {
    setSchedules(prev => [newSch, ...prev]);
    triggerAutoSyncNotification(`Agenda "${newSch.title}" terpublikasi ke Google Calendar.`);
  };

  const handleAddGrade = (newGrade: PlayerGrade) => {
    setGrades(prev => [newGrade, ...prev]);
    triggerAutoSyncNotification(`Rapor fisik siswa ${newGrade.playerName} terunggah.`);
  };

  const handleImportPlayers = (imported: Player[]) => {
    setPlayers(prev => [...imported, ...prev]);
    triggerAutoSyncNotification(`${imported.length} pemain baru termuat via Spreadsheet.`);
  };

  const handleImportGrades = (imported: PlayerGrade[]) => {
    setGrades(prev => [...imported, ...prev]);
    triggerAutoSyncNotification(`${imported.length} nilai baru terintegrasi.`);
  };

  // Simulate Cloud Spreadsheet Syncer
  const triggerAutoSyncNotification = (text: string) => {
    if (settings.autoSync) {
      setSyncFeedbackMessage(`🔄 SINKRON: ${text}`);
      setTimeout(() => setSyncFeedbackMessage(''), 3500);
    }
  };

  const handleManualTriggerSync = () => {
    // Simply fetch current locally saved state to mimic direct live read
    setSettings(loadTeamSettings());
    setPlayers(loadPlayers());
    setSchedules(loadSchedules());
    setGrades(loadGrades());
  };

  // Menu lists based on current role permissions
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard Utama', icon: Home, roles: ['admin', 'user', 'wali'] },
    { id: 'datamanajemen', label: 'Data Hub Manajemen', icon: Users, roles: ['admin', 'user'] },
    { id: 'datapemain', label: 'Database Pemain', icon: UserCheck, roles: ['admin', 'user'] },
    { id: 'jadwal', label: 'Agenda & Latihan', icon: Calendar, roles: ['admin', 'user'] },
    { id: 'penilaian', label: 'Penilaian Rapor', icon: Award, roles: ['admin', 'user'] },
    { id: 'eksporimpor', label: 'Ekspor % Impor', icon: Database, roles: ['admin', 'user'] },
    { id: 'sinkron', label: 'Sinkronisasi Cloud', icon: Radio, roles: ['admin'] },
    { id: 'pengaturan', label: 'Pengaturan Sistem', icon: SettingsIcon, roles: ['admin', 'user'] },
    { id: 'gasdeveloper', label: 'GAS Apps Script', icon: Terminal, roles: ['admin', 'user'] },
  ];

  const allowedMenuItems = menuItems.filter(item => item.roles.includes(currentUserRole));

  // Visual themes class pairing loader
  const themeClasses = {
    default: 'bg-slate-950 text-slate-100 font-sans relative overflow-hidden',
    pitch: 'bg-slate-950 text-slate-100 font-sans relative overflow-hidden',
    cyberpunk: 'bg-[#030712] text-cyan-400 font-sans relative overflow-hidden',
    classic: 'bg-slate-50 text-slate-900 font-sans'
  };

  const cardClasses = {
    default: 'bg-slate-900/90 backdrop-blur-md border border-slate-800/80 rounded-2xl shadow-xl shadow-black/40',
    pitch: 'bg-slate-900/90 backdrop-blur-md border border-slate-800/80 rounded-2xl shadow-xl shadow-black/40',
    cyberpunk: 'bg-[#0f172a]/95 border-2 border-cyan-500/20 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.15)]',
    classic: 'bg-white border border-slate-200 rounded-2xl shadow-sm text-slate-800'
  };

  const currentTheme = settings.backgroundTheme || 'pitch';

  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className={`min-h-screen flex font-sans transition-colors duration-300 ${themeClasses[currentTheme]}`} id="main-app-shell">
      
      {/* Decorative soccer grass alignment grid overlay for pitch design */}
      {currentTheme === 'pitch' && (
        <div className="absolute inset-0 pointer-events-none opacity-[0.035] border-2 border-cyan-500 m-8 rounded-2xl">
          <div className="w-full h-1/2 border-b-2 border-cyan-500 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-16 border-x-2 border-b-2 border-cyan-500 rounded-b-xl" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-32 h-32 border-2 border-cyan-500 rounded-full" />
          </div>
          <div className="w-full h-1/2 relative">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-16 border-x-2 border-t-2 border-cyan-500 rounded-t-xl" />
          </div>
        </div>
      )}

      {/* Cyber theme style line decor */}
      {currentTheme === 'cyberpunk' && (
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.02]" 
          style={{ backgroundImage: 'linear-gradient(rgba(18, 113, 255, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(18, 113, 255, 0.2) 1px, transparent 1px)', backgroundSize: '16px 16px' }}
        />
      )}

      {/* --- DESKTOP SIDEBAR --- */}
      <aside 
        className={`hidden md:flex flex-col justify-between border-r shrink-0 transition-all duration-300 z-20 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        } ${
          currentTheme === 'classic' 
            ? 'bg-slate-100 border-slate-200 text-slate-800' 
            : 'bg-slate-950/85 border-slate-900 text-white'
        }`}
        id="desktop-sidebar-rail"
      >
        <div className="p-4 space-y-6">
          {/* Sidebar Crest Header */}
          <div className="flex items-center justify-between border-b border-dashed pb-4 border-slate-800">
            {isSidebarOpen ? (
              <div className="flex items-center gap-2.5 truncate">
                <TeamLogo className="w-10 h-10" />
                <div className="truncate">
                  <h2 className="text-xs font-black tracking-widest text-amber-500">{settings.teamName}</h2>
                  <p className="text-[9px] font-mono tracking-wider text-cyan-400 mt-0.5">AL FARABY AKADEMI</p>
                </div>
              </div>
            ) : (
              <TeamLogo className="w-12 h-12 mx-auto" />
            )}

            {/* Minimize hide toggle sidebar panel */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`hidden md:block p-1 rounded hover:bg-slate-800 transition-colors ${
                currentTheme === 'classic' ? 'hover:bg-slate-200' : ''
              }`}
              title={isSidebarOpen ? 'Sembunyikan Sidebar' : 'Tampilkan Sidebar'}
            >
              {isSidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>

          {/* Sidebar Menu Item list */}
          <nav className="space-y-1">
            {allowedMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-xs font-medium tracking-wide transition-all ${
                    isActive 
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md' 
                      : currentTheme === 'classic'
                        ? 'text-slate-650 hover:bg-slate-200 hover:text-slate-900'
                        : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-205'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {isSidebarOpen && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User profile footer info inside sidebar */}
        <div className="p-4 border-t border-slate-850 space-y-3 bg-slate-900/20">
          {isSidebarOpen ? (
            <div className="text-xs truncate">
              <div className="text-[10px] font-mono text-slate-505 uppercase">AKSES SAAT INI</div>
              <p className="font-bold text-gray-200 mt-0.5 truncate">{currentUsername}</p>
              <span className="inline-block px-1.5 py-0.5 bg-amber-500/10 text-amber-500 font-mono text-[9px] uppercase tracking-wider rounded border border-amber-500/20 mt-1">
                Role: {currentUserRole}
              </span>
            </div>
          ) : (
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mx-auto block animate-pulse" />
          )}

          <button
            onClick={handleLogout}
            className={`w-full py-1.5 text-rose-450 hover:text-rose-400 font-mono text-[10px] uppercase font-black flex items-center justify-center gap-2 rounded border border-rose-950/20 hover:bg-rose-500/10 transition-colors ${
              currentTheme === 'classic' ? 'border-rose-200' : ''
            }`}
          >
            <LogOut className="w-3.5 h-3.5" />
            {isSidebarOpen && 'Keluar Sesi'}
          </button>
        </div>
      </aside>

      {/* --- MOBILE COLLAPSIBLE SHELL MENU --- */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-950/90 border-b border-slate-900 flex items-center justify-between px-4 z-40">
        <div className="flex items-center gap-2">
          <TeamLogo className="w-8 h-8" />
          <h1 className="text-sm font-black text-amber-500 tracking-wider">AL FARABY FC</h1>
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-1.5 text-slate-300 hover:text-white"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="md:hidden fixed inset-0 top-16 bg-slate-950 z-30 p-6 flex flex-col justify-between"
          >
            <nav className="space-y-2">
              {allowedMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-4 p-3 rounded-xl text-sm font-bold uppercase tracking-wider ${
                      isActive ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:bg-slate-900'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </button>
                );
              })}
            </nav>

            <button
              onClick={handleLogout}
              className="w-full py-3 bg-rose-950/40 text-rose-300 border border-rose-900/40 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Keluar Sistem
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- MAIN PAGE VIEW PORT -- */}
      <main className="flex-1 p-6 md:p-8 pt-24 md:pt-8 overflow-y-auto z-10">
        
        {/* Real-time Spreadsheet pipeline buffer bar */}
        {syncFeedbackMessage && (
          <div className="fixed bottom-6 right-6 z-50 p-4 bg-slate-900 border-2 border-cyan-500 text-cyan-400 font-mono text-[11px] font-bold uppercase rounded-xl shadow-[0_10px_25px_rgba(6,182,212,0.4)] flex items-center gap-2.5 animate-bounce">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            {syncFeedbackMessage}
          </div>
        )}

        {/* --- DYNAMIC MOUNTED TABS VIEW WITH TRANSITIONS --- */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className={`p-6 ${cardClasses[currentTheme]}`}
          >
            {currentTab === 'dashboard' && (
              <Dashboard 
                players={players} 
                schedules={schedules} 
                settings={settings} 
                grades={grades}
                setCurrentTab={setCurrentTab} 
              />
            )}

            {currentTab === 'datamanajemen' && (
              <DataManajemen 
                settings={settings} 
                players={players} 
                role={currentUserRole}
                onSaveSettings={setSettings} 
              />
            )}

            {currentTab === 'datapemain' && (
              <DataPemain 
                players={players} 
                role={currentUserRole}
                onAddPlayer={handleAddPlayer} 
                onUpdatePlayer={handleUpdatePlayer} 
                onDeletePlayer={handleDeletePlayer} 
              />
            )}

            {currentTab === 'jadwal' && (
              <Jadwal 
                schedules={schedules} 
                role={currentUserRole}
                onAddSchedule={handleAddSchedule} 
              />
            )}

            {currentTab === 'penilaian' && (
              <Penilaian 
                players={players} 
                grades={grades} 
                role={currentUserRole}
                onAddGrade={handleAddGrade} 
              />
            )}

            {currentTab === 'eksporimpor' && (
              <EksporImpor 
                players={players} 
                grades={grades} 
                onImportPlayers={handleImportPlayers} 
                onImportGrades={handleImportGrades} 
              />
            )}

            {currentTab === 'sinkron' && (
              <Sinkron 
                settings={settings} 
                onUpdateSettings={setSettings} 
                onManualTriggerSync={handleManualTriggerSync} 
              />
            )}

            {currentTab === 'pengaturan' && (
              <Pengaturan 
                settings={settings} 
                role={currentUserRole}
                onUpdateSettings={setSettings} 
              />
            )}

            {currentTab === 'gasdeveloper' && (
              <GASExporter />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

    </div>
  );
}

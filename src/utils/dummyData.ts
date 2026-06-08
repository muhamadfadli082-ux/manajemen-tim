import { Player, EventSchedule, PlayerGrade, TeamSettings } from '../types';

export const DEFAULT_CREDENTIALS = {
  admin: { username: 'admin', password: 'adminfaraby' },
  user: { username: 'coach', password: 'coachfaraby' },
  wali: { username: 'wali_faraby', password: 'walifaraby', linkedPlayerId: 'player-1' }
};

export const INITIAL_TEAM_SETTINGS: TeamSettings = {
  teamName: 'AL FARABY FC',
  teamAddress: 'Jl Mayor Damar no 44 Bokor Pagedangan Kec. Turen',
  headCoach: 'Ustadz Ahmad Fauzi, S.Pd.',
  coach: 'Ustadz Muhammad Yusuf, S.Or.',
  manager1: 'Krismawan, S.Pd.I',
  manager2: 'Fadli Muhtar, S.E.',
  npsn: '20557279',
  email: 'sdialfaraby238@gmail.com',
  principalName: 'Krismawan, S.Pd.I',
  logoUrl: '', // uses our TeamLogo SVG component by default
  backgroundTheme: 'pitch', // 'default', 'pitch', 'cyberpunk', 'classic'
  spreadsheetId: '1Sp4-AlFarabyFC-20557279-SheetID-GASX',
  autoSync: true,
  userPassword: 'coachfaraby',
  adminPassword: 'adminfaraby',
  waliPassword: 'walifaraby'
};

export const INITIAL_PLAYERS: Player[] = [
  {
    id: 'player-1',
    photoUrl: 'https://images.unsplash.com/photo-1543351611-58f69d7c1781?auto=format&fit=crop&q=80&w=200',
    name: 'Ahmad Pratama',
    dob: '2014-03-12',
    status: 'aktif',
    position: 'Penyerang',
    parentName: 'Hadi Pratama',
    phone: '081234567890',
    email: 'hadi.pratama@gmail.com',
    number: '10',
    address: 'Jl. Raya Bokor No. 12, Pagedangan, Turen'
  },
  {
    id: 'player-2',
    photoUrl: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&q=80&w=200',
    name: 'Dimas Setiawan',
    dob: '2014-06-25',
    status: 'aktif',
    position: 'Gelandang',
    parentName: 'Budi Setiawan',
    phone: '085712345678',
    email: 'budi.setiawan@gmail.com',
    number: '8',
    address: 'Sari Bumi Indah Blok C3, Turen'
  },
  {
    id: 'player-3',
    photoUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=200',
    name: 'Rian Hidayat',
    dob: '2015-01-05',
    status: 'aktif',
    position: 'Bek',
    parentName: 'Dedi Hidayat',
    phone: '081977778888',
    email: 'dedi.hidayat@gmail.com',
    number: '4',
    address: 'Kp. Kemuning No. 17, Bokor, Pagedangan'
  },
  {
    id: 'player-4',
    photoUrl: 'https://images.unsplash.com/photo-1505156868547-9b49f4df4e04?auto=format&fit=crop&q=80&w=200',
    name: 'Faris Syahputra',
    dob: '2014-11-30',
    status: 'aktif',
    position: 'Kiper',
    parentName: 'Syahputra Adi',
    phone: '081344556677',
    email: 'syahputra.adi@yahoo.com',
    number: '1',
    address: 'Perumahan Al-Faraby Indah No. A-5, Turen'
  },
  {
    id: 'player-5',
    photoUrl: 'https://images.unsplash.com/photo-1544698310-74ea9d1c8258?auto=format&fit=crop&q=80&w=200',
    name: 'Zulham Malik',
    dob: '2013-09-18',
    status: 'lulus',
    position: 'Penyerang',
    parentName: 'Malik Ibrahim',
    phone: '082199882233',
    email: 'malik.ibrahim@outlook.com',
    number: '9',
    address: 'Jl. Mayor Damar No. 22, Bokor, Turen'
  },
  {
    id: 'player-6',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
    name: 'Noval Kurniawan',
    dob: '2015-05-14',
    status: 'pindah',
    position: 'Bek',
    parentName: 'Kurnia Sandy',
    phone: '087812123434',
    email: 'kurnia.s@gmail.com',
    number: '5',
    address: 'Jl. Gajah Mada No. 104, Dampit, Malang'
  },
  {
    id: 'player-7',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    name: 'Aris Munandar',
    dob: '2014-08-08',
    status: 'aktif',
    position: 'Gelandang',
    parentName: 'Mubarak Munandar',
    phone: '085233009911',
    email: 'mubarak.m@gmail.com',
    number: '6',
    address: 'Jl. Ahmad Yani No. 54, Bokor'
  }
];

export const INITIAL_SCHEDULES: EventSchedule[] = [
  {
    id: 'sch-1',
    title: 'Latihan Rutin: Teknik Dasar & Stamina',
    type: 'latihan',
    date: '2026-06-08',
    time: '15:30 - 17:30',
    location: 'Lapangan Al Faraby FC',
    notes: 'Fokus pada akurasi Passing pendek dan Dribbling kontrol ketat. Seluruh siswa aktif wajib mengenakan jersey merah.'
  },
  {
    id: 'sch-2',
    title: 'Sparring Match vs SD Islam Al-Hidayah',
    type: 'sparring',
    date: '2026-06-12',
    time: '14:00 - 16:30',
    location: 'Stadion Gelora Turen Kec. Turen',
    opponent: 'SD Islam Al-Hidayah',
    notes: 'Pertandingan uji coba persahabatan. Membawa pelindung tulang kering (shin guards).'
  },
  {
    id: 'sch-3',
    title: 'Latihan Taktik & Serang Balik',
    type: 'latihan',
    date: '2026-06-15',
    time: '15:30 - 17:00',
    location: 'Lapangan Al Faraby FC',
    notes: 'Strategi bertahan rapat dan melakukan transisi cepat ke penyerangan.'
  }
];

export const INITIAL_GRADES: PlayerGrade[] = [
  {
    id: 'grade-1',
    playerId: 'player-1',
    playerName: 'Ahmad Pratama',
    evalDate: '2026-06-01',
    evaluatorName: 'Ustadz Ahmad Fauzi',
    rulesKnowledge: 88,
    passing: 85,
    dribbling: 90,
    control: 87,
    shooting: 92,
    individualSkill: 89,
    vision: 84,
    response: 86,
    jump: 80,
    teamwork: 85,
    mental: 90,
    spirit: 95,
    stamina: 88,
    description: 'Ahmad menunjukkan perkembangan luar biasa di sektor tengah penyerangan, memiliki akurasi passing yang mumpuni.',
    notes: 'Pertahankan kedisiplinan murni dan latih kelincahan kaki kiri agar variasi tendangan lebih variatif.'
  },
  {
    id: 'grade-2',
    playerId: 'player-2',
    playerName: 'Dimas Setiawan',
    evalDate: '2026-06-01',
    evaluatorName: 'Ustadz Ahmad Fauzi',
    rulesKnowledge: 90,
    passing: 92,
    dribbling: 84,
    control: 88,
    shooting: 78,
    individualSkill: 83,
    vision: 92,
    response: 89,
    jump: 74,
    teamwork: 94,
    mental: 85,
    spirit: 90,
    stamina: 86,
    description: 'Dimas memiliki visi permainan yang matang, cerdas dalam membagi bola dan penempatan posisi bertahan.',
    notes: 'Fokus melatih tinggi lompatan (vertical jump) agar lebih tangguh dalam duel bola udara.'
  },
  {
    id: 'grade-3',
    playerId: 'player-3',
    playerName: 'Rian Hidayat',
    evalDate: '2026-06-02',
    evaluatorName: 'Ustadz Ahmad Fauzi',
    rulesKnowledge: 85,
    passing: 82,
    dribbling: 75,
    control: 80,
    shooting: 70,
    individualSkill: 72,
    vision: 80,
    response: 88,
    jump: 85,
    teamwork: 88,
    mental: 92,
    spirit: 88,
    stamina: 90,
    description: 'Rian adalah bek tangguh dengan semangat juang tinggi dan daya tahan fisik luar biasa selama 2 babak.',
    notes: 'Perlu latihan kendali emosi saat transisi bertahan, tingkatkan akurasi umpan lambung panjang.'
  }
];

// LocalStorage helpers with type safety
export const loadTeamSettings = (): TeamSettings => {
  const store = localStorage.getItem('faraby_settings');
  if (store) {
    try {
      return JSON.parse(store);
    } catch (e) {
      console.error(e);
    }
  }
  return { ...INITIAL_TEAM_SETTINGS };
};

export const saveTeamSettings = (settings: TeamSettings) => {
  localStorage.setItem('faraby_settings', JSON.stringify(settings));
};

export const loadPlayers = (): Player[] => {
  const store = localStorage.getItem('faraby_players');
  if (store) {
    try {
      return JSON.parse(store);
    } catch (e) {
      console.error(e);
    }
  }
  return [...INITIAL_PLAYERS];
};

export const savePlayers = (players: Player[]) => {
  localStorage.setItem('faraby_players', JSON.stringify(players));
};

export const loadSchedules = (): EventSchedule[] => {
  const store = localStorage.getItem('faraby_schedules');
  if (store) {
    try {
      return JSON.parse(store);
    } catch (e) {
      console.error(e);
    }
  }
  return [...INITIAL_SCHEDULES];
};

export const saveSchedules = (schedules: EventSchedule[]) => {
  localStorage.setItem('faraby_schedules', JSON.stringify(schedules));
};

export const loadGrades = (): PlayerGrade[] => {
  const store = localStorage.getItem('faraby_grades');
  if (store) {
    try {
      return JSON.parse(store);
    } catch (e) {
      console.error(e);
    }
  }
  return [...INITIAL_GRADES];
};

export const saveGrades = (grades: PlayerGrade[]) => {
  localStorage.setItem('faraby_grades', JSON.stringify(grades));
};

export const resetToDefaults = () => {
  localStorage.removeItem('faraby_settings');
  localStorage.removeItem('faraby_players');
  localStorage.removeItem('faraby_schedules');
  localStorage.removeItem('faraby_grades');
  window.location.reload();
};

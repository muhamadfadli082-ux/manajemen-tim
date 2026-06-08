export type UserRole = 'admin' | 'user' | 'wali';

export interface Player {
  id: string;
  photoUrl: string;
  name: string;
  dob: string;
  status: 'aktif' | 'pindah' | 'lulus';
  position: 'Kiper' | 'Bek' | 'Gelandang' | 'Penyerang';
  parentName: string;
  phone: string;
  email: string;
  number: string;
  address: string;
}

export interface TeamSettings {
  teamName: string;
  teamAddress: string;
  headCoach: string;
  coach: string;
  manager1: string;
  manager2: string;
  npsn: string;
  email: string;
  principalName: string;
  logoUrl: string;
  backgroundTheme: 'default' | 'pitch' | 'cyberpunk' | 'classic';
  spreadsheetId: string;
  autoSync: boolean;
  userPassword?: string;
  adminPassword?: string;
  waliPassword?: string;
}

export interface EventSchedule {
  id: string;
  title: string;
  type: 'latihan' | 'sparring';
  date: string;
  time: string;
  location: string;
  opponent?: string;
  notes?: string;
}

export interface PlayerGrade {
  id: string;
  playerId: string;
  playerName: string;
  evalDate: string;
  evaluatorName: string;
  
  // Pengetahuan tentang peraturan sepakbola
  rulesKnowledge: number; // 1-100
  
  // Teknik Dasar
  passing: number;
  dribbling: number;
  control: number;
  
  // Teknik Lanjutan
  shooting: number;
  individualSkill: number;
  vision: number;
  response: number;
  jump: number;
  
  // Others
  teamwork: number;
  mental: number;
  spirit: number;
  stamina: number;
  description?: string;
  notes?: string;
}

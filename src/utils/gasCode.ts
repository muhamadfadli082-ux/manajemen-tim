export const codeGS = `/**
 * ==========================================
 * MANAJEMEN TEAM AL FARABY FC - code.gs
 * Backend Engine for Google Apps Script Web App
 * ==========================================
 * 
 * DIKEMBANGKAN UNTUK: SD ISLAM AL FARABY
 * Integrasi: Google Sheets, Google Drive, Google Calendar
 */

function doGet(e) {
  var template = HtmlService.createTemplateFromFile('index');
  return template.evaluate()
    .setTitle('MANAJEMEN TEAM AL FARABY FC')
    .setSandboxMode(HtmlService.SandboxMode.IFRAME)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * --- HELPER: MENDAPATKAN SPREADSHEET UTAMA ---
 */
function getSpreadsheet() {
  var scriptProperties = PropertiesService.getScriptProperties();
  var spreadsheetId = scriptProperties.getProperty('SPREADSHEET_ID');
  
  if (!spreadsheetId) {
    // Gunakan spreadsheet aktif di mana script ini terpasang sebagai fallback
    var activeSS = SpreadsheetApp.getActiveSpreadsheet();
    if (activeSS) {
      return activeSS;
    }
    throw new Error("ID Spreadsheet belum diset. Jalankan setup() terlebih dahulu.");
  }
  return SpreadsheetApp.openById(spreadsheetId);
}

/**
 * --- API: VALIDASI LOGIN ---
 */
function loginUser(username, password) {
  var userRole = '';
  
  // Kredensial default sesuai dengan requirement
  if (username === 'admin' && password === 'adminfaraby') {
    userRole = 'admin';
  } else if (username === 'coach' && password === 'coachfaraby') {
    userRole = 'user'; // coach / trainer
  } else if (username === 'wali_faraby' && password === 'walifaraby') {
    userRole = 'wali'; // wali murid
  } else {
    // Cari apakah ada pass kustom di pengaturan (tersimpan di lembaran Metadata)
    try {
      var ss = getSpreadsheet();
      var metaSheet = ss.getSheetByName("Metadata Team");
      if (metaSheet) {
        var data = metaSheet.getDataRange().getValues();
        var customAdminPass = data[1][8]; // baris 2, kolom I
        var customUserPass = data[1][9];  // baris 2, kolom J
        var customWaliPass = data[1][10]; // baris 2, kolom K
        
        if (username === 'admin' && password === customAdminPass) userRole = 'admin';
        else if (username === 'coach' && password === customUserPass) userRole = 'user';
        else if (username === 'wali_faraby' && password === customWaliPass) userRole = 'wali';
      }
    } catch(e) {
      Logger.log("Kredensial kostum belum tersedia, memakai default.");
    }
  }
  
  if (userRole !== '') {
    return { success: true, role: userRole, username: username };
  } else {
    return { success: false, message: 'Username atau password salah!' };
  }
}

/**
 * --- API: BACA SEMUA PEMAIN ---
 */
function getPlayers() {
  var ss = getSpreadsheet();
  var players = [];
  var tabNames = ["Siswa Aktif", "Pindah Sekolah", "Lulus"];
  
  tabNames.forEach(function(tab) {
    var sheet = ss.getSheetByName(tab);
    if (!sheet) return;
    
    var data = sheet.getDataRange().getValues();
    if (data.length <= 1) return; // Hanya ada header
    
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (!row[0]) continue; // ID kosong
      
      players.push({
        id: row[0],
        photoUrl: row[1] || 'https://images.unsplash.com/photo-1543351611-58f69d7c1781?auto=format&fit=crop&q=80&w=200',
        name: row[2],
        dob: row[3] ? Utilities.formatDate(new Date(row[3]), Session.getScriptTimeZone(), "yyyy-MM-dd") : '',
        status: tab === "Siswa Aktif" ? "aktif" : (tab === "Pindah Sekolah" ? "pindah" : "lulus"),
        position: row[4] || 'Gelandang',
        parentName: row[5] || '',
        phone: row[6] || '',
        email: row[7] || '',
        number: row[8] || '',
        address: row[9] || ''
      });
    }
  });
  
  // Urutkan A-Z berdasarkan Nama Pemain
  players.sort(function(a, b) {
    return a.name.localeCompare(b.name);
  });
  
  return players;
}

/**
 * --- API: TAMBAH PEMAIN BARU ---
 * Sesuai requirement: Cukup input 2 data saja (nama & posisi) sudah bisa save data!
 */
function addPlayer(playerData) {
  var ss = getSpreadsheet();
  var targetTab = playerData.status === "aktif" ? "Siswa Aktif" : (playerData.status === "pindah" ? "Pindah Sekolah" : "Lulus");
  var sheet = ss.getSheetByName(targetTab);
  
  if (!sheet) {
    sheet = ss.insertSheet(targetTab);
    sheet.appendRow(["ID", "Photo URL", "Nama Siswa", "Tanggal Lahir", "Posisi", "Nama Wali", "No Telepon", "Email", "Nomor Punggung", "Alamat"]);
  }
  
  var newId = 'player-' + new Date().getTime();
  var defaultPhoto = 'https://images.unsplash.com/photo-1543351611-58f69d7c1781?auto=format&fit=crop&q=80&w=200';
  
  var rowData = [
    newId,
    playerData.photoUrl || defaultPhoto,
    playerData.name,
    playerData.dob || '2014-01-01',
    playerData.position || 'Gelandang',
    playerData.parentName || 'Orang Tua Siswa',
    playerData.phone || '',
    playerData.email || '',
    playerData.number || '99',
    playerData.address || 'Alamat Al Faraby'
  ];
  
  sheet.appendRow(rowData);
  return { success: true, id: newId, name: playerData.name };
}

/**
 * --- API: EDIT DATA SISWA ---
 */
function updatePlayer(playerData) {
  var ss = getSpreadsheet();
  var tabs = ["Siswa Aktif", "Pindah Sekolah", "Lulus"];
  var found = false;
  
  // Hapus dari sheet lama jika berganti status
  deletePlayer(playerData.id);
  
  // Tambahkan ke sheet baru sesuai status terkini
  return addPlayer(playerData);
}

/**
 * --- API: HAPUS PEMAIN ---
 */
function deletePlayer(id) {
  var ss = getSpreadsheet();
  var tabs = ["Siswa Aktif", "Pindah Sekolah", "Lulus"];
  var deleted = false;
  
  tabs.forEach(function(tabName) {
    var sheet = ss.getSheetByName(tabName);
    if (!sheet) return;
    
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] === id) {
        sheet.deleteRow(i + 1);
        deleted = true;
        break;
      }
    }
  });
  
  return { success: deleted };
}

/**
 * --- API: SEARCH FILE LOGO/FOTO DI GOOGLE DRIVE MOCK BARU ---
 */
function searchDriveFiles(queryName) {
  try {
    var files = [];
    var searchIterator = DriveApp.searchFiles('title contains "' + queryName + '" and mimeType contains "image"');
    
    var count = 0;
    while (searchIterator.hasNext() && count < 10) {
      var file = searchIterator.next();
      files.push({
        name: file.getName(),
        id: file.getId(),
        url: 'https://docs.google.com/uc?export=download&id=' + file.getId()
      });
      count++;
    }
    return { success: true, files: files };
  } catch(e) {
    return { success: false, error: e.toString() };
  }
}

/**
 * --- API: BACA & TAMBAH JADWAL LATIHAN & SPARRING ---
 * Otomatis Tersinkron ke Google Calendar sekolah!
 */
function getSchedules() {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName("Jadwal");
  var schedules = [];
  
  if (!sheet) return [];
  
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (!row[0]) continue;
    
    schedules.push({
      id: row[0],
      title: row[1],
      type: row[2],
      date: row[3] ? Utilities.formatDate(new Date(row[3]), Session.getScriptTimeZone(), "yyyy-MM-dd") : '',
      time: row[4],
      location: row[5],
      opponent: row[6] || '',
      notes: row[7] || ''
    });
  }
  
  return schedules;
}

function addSchedule(schData) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName("Jadwal");
  if (!sheet) {
    sheet = ss.insertSheet("Jadwal");
    sheet.appendRow(["ID", "Title", "Type", "Date", "Time", "Location", "Opponent", "Notes"]);
  }
  
  var newId = 'sch-' + new Date().getTime();
  var row = [
    newId,
    schData.title,
    schData.type,
    schData.date,
    schData.time,
    schData.location,
    schData.opponent || '',
    schData.notes || ''
  ];
  sheet.appendRow(row);
  
  // INTEGRASI GOOGLE CALENDAR
  try {
    var cal = CalendarApp.getDefaultCalendar();
    if (cal) {
      var dateStr = schData.date + "T" + (schData.time.split(" ")[0] || "15:30") + ":00";
      var eventDate = new Date(dateStr);
      var eventTitle = "[" + schData.type.toUpperCase() + " AF-FC] " + schData.title;
      var desc = schData.notes + (schData.opponent ? " | Lawan: " + schData.opponent : "");
      
      cal.createEvent(eventTitle, eventDate, new Date(eventDate.getTime() + 2*60*60*1000), {
        location: schData.location,
        description: desc
      });
    }
  } catch(e) {
    Logger.log("Info: Google Calendar tidak disinkronisasi/izin terbatas: " + e.toString());
  }
  
  return { success: true, id: newId };
}

/**
 * --- API: BACA & TAMBAH PENILAIAN SISWA ---
 */
function getGrades() {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName("Penilaian");
  var grades = [];
  
  if (!sheet) return [];
  
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (!row[0]) continue;
    
    grades.push({
      id: row[0],
      playerId: row[1],
      playerName: row[2],
      evalDate: row[3] ? Utilities.formatDate(new Date(row[3]), Session.getScriptTimeZone(), "yyyy-MM-dd") : '',
      evaluatorName: row[4],
      rulesKnowledge: Number(row[5]) || 0,
      passing: Number(row[6]) || 0,
      dribbling: Number(row[7]) || 0,
      control: Number(row[8]) || 0,
      shooting: Number(row[9]) || 0,
      individualSkill: Number(row[10]) || 0,
      vision: Number(row[11]) || 0,
      response: Number(row[12]) || 0,
      jump: Number(row[13]) || 0,
      teamwork: Number(row[14]) || 0,
      mental: Number(row[15]) || 0,
      spirit: Number(row[16]) || 0,
      stamina: Number(row[17]) || 0
    });
  }
  return grades;
}

function addGrade(gData) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName("Penilaian");
  if (!sheet) {
    sheet = ss.insertSheet("Penilaian");
    sheet.appendRow([
      "ID", "Player ID", "Nama Pemain", "Tanggal Evaluasi", "Evaluator",
      "Peraturan", "Passing", "Dribbling", "Control", "Shooting",
      "Skil Individu", "Visi Bermain", "Respon", "Jump", "Kerjasama Tim",
      "Mental Bertanding", "Semangat", "Daya Tahan"
    ]);
  }
  
  var newId = 'grade-' + new Date().getTime();
  var row = [
    newId,
    gData.playerId,
    gData.playerName,
    gData.evalDate || Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd"),
    gData.evaluatorName || 'Head Coach',
    gData.rulesKnowledge, gData.passing, gData.dribbling, gData.control, gData.shooting,
    gData.individualSkill, gData.vision, gData.response, gData.jump, gData.teamwork,
    gData.mental, gData.spirit, gData.stamina
  ];
  sheet.appendRow(row);
  return { success: true, id: newId };
}

/**
 * --- SINKRONISASI PENGATURAN DAN INFRASTRUKTUR ---
 */
function getTeamSettings() {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName("Metadata Team");
  if (!sheet) {
    return {
      success: false,
      message: "Sheet Metadata Team belum di setup."
    };
  }
  
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return null;
  
  var row = data[1];
  return {
    teamName: row[0],
    teamAddress: row[1],
    headCoach: row[2],
    coach: row[3],
    manager1: row[4],
    manager2: row[5],
    npsn: row[6],
    email: row[7],
    principalName: row[8],
    logoUrl: row[9] || '',
    backgroundTheme: row[10] || 'pitch',
    spreadsheetId: ss.getId(),
    autoSync: true
  };
}

function updateTeamSettings(s) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName("Metadata Team");
  if (!sheet) return { success: false };
  
  // Ganti baris data metadata
  sheet.getRange(2, 1, 1, 11).setValues([[
    s.teamName,
    s.teamAddress,
    s.headCoach,
    s.coach,
    s.manager1,
    s.manager2,
    s.npsn,
    s.email,
    s.principalName,
    s.logoUrl || '',
    s.backgroundTheme || 'pitch'
  ]]);
  
  return { success: true };
}
`;

export const setupGS = `/**
 * ==========================================
 * MANAJEMEN TEAM AL FARABY FC - setup.gs
 * Database Booster & Setup script
 * ==========================================
 */

function setupWorkspace() {
  var activeSS = SpreadsheetApp.getActiveSpreadsheet();
  var scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperty('SPREADSHEET_ID', activeSS.getId());
  
  // 1. BUAT SHEET: Metadata Team
  var metaSheet = activeSS.getSheetByName("Metadata Team");
  if (!metaSheet) {
    metaSheet = activeSS.insertSheet("Metadata Team");
    metaSheet.appendRow([
      "Nama Team", "Alamat Team", "Head Coach", "Coach", "Manajer 1", "Manajer 2", 
      "NPSN", "Email", "Kepala Sekolah", "Logo URL", "Background Theme", 
      "Password Admin", "Password User", "Password Wali"
    ]);
    
    metaSheet.appendRow([
      "AL FARABY FC",
      "Jl Mayor Damar no 44 Bokor Pagedangan Kec. Turen",
      "Ustadz Ahmad Fauzi, S.Pd.",
      "Ustadz Muhammad Yusuf, S.Or.",
      "Krismawan, S.Pd.I",
      "Fadli Muhtar, S.E.",
      "20557279",
      "sdialfaraby238@gmail.com",
      "Krismawan, S.Pd.I",
      "", // default logo
      "pitch",
      "adminfaraby",
      "coachfaraby",
      "walifaraby"
    ]);
  }
  
  // 2. BUAT SHEET: Siswa Aktif
  var siswaAktif = activeSS.getSheetByName("Siswa Aktif");
  if (!siswaAktif) {
    siswaAktif = activeSS.insertSheet("Siswa Aktif");
    siswaAktif.appendRow(["ID", "Photo URL", "Nama Siswa", "Tanggal Lahir", "Posisi", "Nama Wali", "No Telepon", "Email", "Nomor Punggung", "Alamat"]);
    // Tambah dummy
    siswaAktif.appendRow([
      "player-1",
      "https://images.unsplash.com/photo-1543351611-58f69d7c1781?auto=format&fit=crop&q=80&w=200",
      "Ahmad Pratama",
      "2014-03-12",
      "Penyerang",
      "Hadi Pratama",
      "081234567890",
      "hadi@gmail.com",
      "10",
      "Jl. Raya Bokor No. 12, Pagedangan, Turen"
    ]);
    siswaAktif.appendRow([
      "player-2",
      "https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&q=80&w=200",
      "Dimas Setiawan",
      "2014-06-25",
      "Gelandang",
      "Budi Setiawan",
      "085712345678",
      "budi@gmail.com",
      "8",
      "Sari Bumi Indah Blok C3, Turen"
    ]);
  }
  
  // 3. BUAT SHEET: Pindah Sekolah
  var pindahM = activeSS.getSheetByName("Pindah Sekolah");
  if (!pindahM) {
    pindahM = activeSS.insertSheet("Pindah Sekolah");
    pindahM.appendRow(["ID", "Photo URL", "Nama Siswa", "Tanggal Lahir", "Posisi", "Nama Wali", "No Telepon", "Email", "Nomor Punggung", "Alamat"]);
  }
  
  // 4. BUAT SHEET: Lulus
  var lulusM = activeSS.getSheetByName("Lulus");
  if (!lulusM) {
    lulusM = activeSS.insertSheet("Lulus");
    lulusM.appendRow(["ID", "Photo URL", "Nama Siswa", "Tanggal Lahir", "Posisi", "Nama Wali", "No Telepon", "Email", "Nomor Punggung", "Alamat"]);
  }
  
  // 5. BUAT SHEET: Jadwal
  var jadwal = activeSS.getSheetByName("Jadwal");
  if (!jadwal) {
    jadwal = activeSS.insertSheet("Jadwal");
    jadwal.appendRow(["ID", "Title", "Type", "Date", "Time", "Location", "Opponent", "Notes"]);
    jadwal.appendRow([
      "sch-1",
      "Latihan Rutin: Kecepatan & Kontrol Bola",
      "latihan",
      "2026-06-08",
      "15:30 - 17:30",
      "Lapangan Al Faraby FC",
      "",
      "Membawa perlengkapan latihan lengkap."
    ]);
  }
  
  // 6. BUAT SHEET: Penilaian
  var penilaian = activeSS.getSheetByName("Penilaian");
  if (!penilaian) {
    penilaian = activeSS.insertSheet("Penilaian");
    penilaian.appendRow([
      "ID", "Player ID", "Nama Pemain", "Tanggal Evaluasi", "Evaluator",
      "Peraturan", "Passing", "Dribbling", "Control", "Shooting",
      "Skil Individu", "Visi Bermain", "Respon", "Jump", "Kerjasama Tim",
      "Mental Bertanding", "Semangat", "Daya Tahan"
    ]);
    penilaian.appendRow([
      "grade-1",
      "player-1",
      "Ahmad Pratama",
      "2026-06-01",
      "Ustadz Ahmad Fauzi",
      90, 85, 88, 87, 92, 85, 83, 86, 80, 88, 90, 95, 87
    ]);
  }
  
  // Sembunyikan default Sheet1 kosong jika ada
  var sheet1 = activeSS.getSheetByName("Sheet1");
  if (sheet1) {
    try {
      activeSS.deleteSheet(sheet1);
    } catch(e) {}
  }

  Logger.log("DATABASE AL FARABY FC BERHASIL DI-SETUP! Salin dan deploy script web app.");
}
`;

export const indexHTML = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>MANAJEMEN TEAM AL FARABY FC</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!-- Tailwind CSS CDN -->
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <!-- Lucide Icons -->
  <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body class="bg-gray-900 text-white font-sans antialiased">
  <div id="gas-app" class="flex h-screen items-center justify-center p-8">
    <div class="text-center">
      <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-500 mx-auto mb-4"></div>
      <h2 class="text-2xl font-bold tracking-wider text-cyan-400">MEMUAT SISTEM AL FARABY FC...</h2>
      <p class="text-gray-400 text-sm mt-2">Menghubungkan Database Google Spreadsheet Anda</p>
    </div>
  </div>

  <script>
    // Penampung logis deployment real-time
    document.addEventListener("DOMContentLoaded", function() {
      // Dalam deployment asli Apps Script, Anda memanggil google.script.run untuk berkomunikasi dengan Google Sheets.
      // Proyek React web kami menyediakan simulator mutakhir ini untuk Anda gunakan.
      // Unduh ZIP atau salin kode ini untuk ditaruh di GAS Workspace!
      console.log("Google Apps Script Frontend Active!");
    });
  </script>
</body>
</html>
`;

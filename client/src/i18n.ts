import { useState } from 'react';

export type Language = 'en' | 'id' | 'th';

const translations: Record<Language, any> = {
  en: {
    common: {
      back: "Back",
      cancel: "Cancel",
      confirm: "Confirm",
      loading: "Loading...",
      session: "Session",
      delegate: "Delegate",
      exit: "Exit",
      restart: "Restart",
      room_code: "Room Code",
      full_name: "Full Name",
      country: "Country",
      start: "Start",
      next: "Next",
      continue: "Continue",
    },
    landing: {
      badge: "GOVERNANCE WORKSHOP SIMULATION",
      title: "The People's Assembly",
      subtitle: "The People's Assembly\ndiscuss, vote, and see\nthe impact on your city.",
      create_title: "Create a Session",
      create_desc: "For hosts, teachers, and workshop facilitators. Launch a new room code and coordinate the gameplay, scenarios, and results exports.",
      create_btn: "Create room (facilitator)",
      join_title: "Join a Session",
      join_desc: "For assembly participants and stakeholders. Enter the room code shared by your facilitator to play your secret role and cast your votes.",
      join_btn: "Join Room (Player)",
      select_language: "Select Your Language",
      no_account: "No account or login needed",
      choose_language: "Choose your preferred language to continue",
      tip_change_later: "Tip: you can change this later",
    },
    join: {
      title: "Join Assembly Session",
      back_home: "Back to Home",
      room_placeholder: "e.g. GOV-4821",
      name_placeholder: "Your Name (max 100 chars)",
      country_label: "Country / Delegate of",
      specify_country: "Specify Country",
      btn_joining: "Joining Session...",
      btn_join: "Join Session",
      error_fill_all: "Please fill in all fields.",
    },
    lobby: {
      badge: "Session Lobby",
      title: "Waiting Room",
      share_code: "Share Room Code",
      joined_delegates: "Joined Delegates",
      min_players_warn: "Game requires between 8 and 12 players to start. Please wait for more participants to join.",
      valid_players: "Player count is valid! You can now start the assembly session.",
      btn_start: "Start Assembly",
      waiting_facil: "Waiting for facilitator to start...",
      session_cancelled: "Session cancelled by facilitator",
      directory: "Delegate Directory",
      no_delegates: "No delegates have connected yet.",
      cancel_session: "Cancel Session",
      load_more: "Load More",
    },
    create: {
      title: "Create Room Session",
      desc: "This will generate a unique room code. Share it with your players (8 to 12 participants) so they can connect using their name.",
      btn_creating: "Generating Room...",
      btn_create: "Create New Session",
      error_connect: "Could not connect to the server. Please check if backend is running.",
    }
  },
  id: {
    common: {
      back: "Kembali",
      cancel: "Batal",
      confirm: "Konfirmasi",
      loading: "Memuat...",
      session: "Sesi",
      delegate: "Delegasi",
      exit: "Keluar",
      restart: "Ulangi",
      room_code: "Kode Ruangan",
      full_name: "Nama Lengkap",
      country: "Negara",
      start: "Mulai",
      next: "Lanjut",
      continue: "Lanjutkan",
    },
    landing: {
      badge: "Simulasi Lokakarya Tata Kelola",
      title: "Majelis Rakyat",
      subtitle: "Simulasi tata kelola kota\ndiskusikan, pilih, dan lihat\ndampaknya pada kota Anda.",
      create_title: "Buat Sesi Baru",
      create_desc: "Untuk host, pengajar, dan fasilitator lokakarya. Luncurkan kode ruangan baru dan koordinasikan gameplay, skenario, serta ekspor hasil.",
      create_btn: "Buat Ruangan (Fasilitator)",
      join_title: "Gabung Sesi",
      join_desc: "Untuk peserta majelis dan pemangku kepentingan. Masukkan kode ruangan yang dibagikan oleh fasilitator Anda untuk memainkan peran rahasia.",
      join_btn: "Gabung Ruangan (Pemain)",
      select_language: "Pilih Bahasa Anda",
      no_account: "Tidak perlu akun atau login",
      choose_language: "Pilih bahasa yang Anda inginkan untuk melanjutkan",
      tip_change_later: "Tips: Anda dapat mengubah bahasa ini nanti",
    },
    join: {
      title: "Gabung Sidang Majelis",
      back_home: "Kembali ke Beranda",
      room_placeholder: "misal: GOV-4821",
      name_placeholder: "Nama Anda (maks 100 karakter)",
      country_label: "Negara / Delegasi",
      specify_country: "Tentukan Negara",
      btn_joining: "Bergabung ke Sesi...",
      btn_join: "Gabung Sesi",
      error_fill_all: "Harap isi semua kolom.",
    },
    lobby: {
      badge: "Lobi Sesi",
      title: "Ruang Tunggu",
      share_code: "Bagikan Kode Ruangan",
      joined_delegates: "Delegasi Bergabung",
      min_players_warn: "Permainan membutuhkan antara 8 hingga 12 pemain untuk dimulai. Harap tunggu peserta lain bergabung.",
      valid_players: "Jumlah pemain valid! Anda sekarang dapat memulai sesi majelis.",
      btn_start: "Mulai Sidang",
      waiting_facil: "Menunggu fasilitator memulai...",
      session_cancelled: "Sesi dibatalkan oleh fasilitator",
      directory: "Direktori Delegasi",
      no_delegates: "Belum ada delegasi yang terhubung.",
      cancel_session: "Batalkan Sesi",
      load_more: "Muat Lebih Banyak",
    },
    create: {
      title: "Buat Sesi Ruangan",
      desc: "Ini akan menghasilkan kode ruangan unik. Bagikan kode ini kepada pemain Anda (8 hingga 12 peserta) agar mereka dapat terhubung menggunakan nama mereka.",
      btn_creating: "Menghasilkan Ruangan...",
      btn_create: "Buat Sesi Baru",
      error_connect: "Tidak dapat terhubung ke server. Silakan periksa apakah backend sudah berjalan.",
    }
  },
  th: {
    common: {
      back: "ย้อนกลับ",
      cancel: "ยกเลิก",
      confirm: "ยืนยัน",
      loading: "กำลังโหลด...",
      session: "เซสชัน",
      delegate: "ผู้แทน",
      exit: "ออกจากเกม",
      restart: "เริ่มใหม่",
      room_code: "รหัสห้อง",
      full_name: "ชื่อ-นามสกุล",
      country: "ประเทศ",
      start: "เริ่ม",
      next: "ถัดไป",
      continue: "ดำเนินการต่อ",
    },
    landing: {
      badge: "การจำลองการประชุมเชิงปฏิบัติการการบริหารจัดการ",
      title: "สภาประชาชน (The People's Assembly)",
      subtitle: "การจำลองการบริหารจัดการเมือง\nอภิปราย ลงมติ และดูผลกระทบ\nที่มีต่อเมืองของคุณ",
      create_title: "สร้างเซสชันใหม่",
      create_desc: "สำหรับผู้ดำเนินรายการ ครู และวิทยากร เปิดรหัสห้องใหม่เพื่อควบคุมการเล่น สถารการณ์ และส่งออกผลลัพธ์",
      create_btn: "สร้างห้อง (ผู้ดำเนินรายการ)",
      join_title: "เข้าร่วมเซสชัน",
      join_desc: "สำหรับผู้เข้าร่วมสภาและผู้มีส่วนได้ส่วนเสีย กรอกรหัสห้องที่ได้รับจากผู้ดำเนินรายการเพื่อรับบทบาทลับและลงมติ",
      join_btn: "เข้าร่วมห้อง (ผู้เล่น)",
      select_language: "เลือกภาษาของคุณ",
      no_account: "ไม่ต้องมีบัญชีหรือเข้าสู่ระบบ",
      choose_language: "เลือกภาษาที่คุณต้องการเพื่อดำเนินการต่อ",
      tip_change_later: "เคล็ดลับ: คุณสามารถเปลี่ยนภาษาได้ในภายหลัง",
    },
    join: {
      title: "เข้าร่วมเซสชันสภา",
      back_home: "กลับสู่หน้าหลัก",
      room_placeholder: "ตัวอย่าง: GOV-4821",
      name_placeholder: "ชื่อของคุณ (สูงสุด 100 ตัวอักษร)",
      country_label: "ประเทศ / ผู้แทนจาก",
      specify_country: "ระบุประเทศ",
      btn_joining: "กำลังเข้าร่วมเซสชัน...",
      btn_join: "เข้าร่วมเซสชัน",
      error_fill_all: "กรุณากรอกข้อมูลให้ครบทุกช่อง",
    },
    lobby: {
      badge: "ล็อบบี้เซสชัน",
      title: "ห้องพักรอ",
      share_code: "แชร์รหัสห้อง",
      joined_delegates: "ผู้แทนที่เข้าร่วมแล้ว",
      min_players_warn: "เกมต้องใช้ผู้เล่นระหว่าง 8 ถึง 12 คนเพื่อเริ่มเกม กรุณารอผู้เข้าร่วมคนอื่นเข้าร่วม",
      valid_players: "จำนวนผู้เล่นครบถ้วน! คุณสามารถเริ่มเซสชันสภาได้แล้ว",
      btn_start: "เริ่มการประชุมสภา",
      waiting_facil: "กำลังรอผู้ดำเนินรายการเริ่มเกม...",
      session_cancelled: "เซสชันถูกยกเลิกโดยผู้ดำเนินรายการ",
      directory: "รายชื่อผู้แทน",
      no_delegates: "ยังไม่มีผู้แทนเชื่อมต่อเข้ามา",
      cancel_session: "ยกเลิกเซสชัน",
      load_more: "โหลดเพิ่มเติม",
    },
    create: {
      title: "สร้างห้องเซสชัน",
      desc: "ระบบจะสร้างรหัสห้องที่ไม่ซ้ำกัน แชร์รหัสนี้ให้ผู้เล่นของคุณ (8 ถึง 12 คน) เพื่อให้พวกเขาสามารถเชื่อมต่อโดยใช้ชื่อของตนเอง",
      btn_creating: "กำลังสร้างห้อง...",
      btn_create: "สร้างเซสชันใหม่",
      error_connect: "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบว่าแบ็กเอนด์กำลังทำงานอยู่",
    }
  }
};

export function useI18n() {
  const [lang, setLang] = useState<Language>(
    (localStorage.getItem('tpa_lang') as Language) || 'en'
  );

  const t = (path: string) => {
    const keys = path.split('.');
    let result: any = translations[lang] || translations['en'];
    for (const key of keys) {
      if (result && result[key] !== undefined) {
        result = result[key];
      } else {
        // Fallback to English
        let fallbackResult: any = translations['en'];
        for (const fKey of keys) {
          if (fallbackResult && fallbackResult[fKey] !== undefined) {
            fallbackResult = fallbackResult[fKey];
          } else {
            return path;
          }
        }
        return fallbackResult;
      }
    }
    return result;
  };

  const changeLang = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('tpa_lang', newLang);
  };

  const toggleLang = () => {
    const nextLang: Language = lang === 'en' ? 'id' : lang === 'id' ? 'th' : 'en';
    changeLang(nextLang);
  };

  return { t, lang, setLang: changeLang, toggleLang };
}

import { useState } from 'react';

export type Language = 'en' | 'id' | 'th' | 'ph' | 'vi' | 'my';

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
    },
    landing: {
      badge: "Governance Workshop Simulation",
      title: "The People's Assembly",
      subtitle: "A real-time digital moderator for face-to-face civic decision-making workshops. Cooperate, deliberate, and decide the future of the city.",
      create_title: "Create a Session",
      create_desc: "For hosts, teachers, and workshop facilitators. Launch a new room code and coordinate the gameplay, scenarios, and results exports.",
      create_btn: "Start as Host",
      join_title: "Join a Session",
      join_desc: "For assembly participants and stakeholders. Enter the room code shared by your facilitator to play your secret role and cast your votes.",
      join_btn: "Enter Room Code",
      select_language: "Select Your Language",
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
    },
    landing: {
      badge: "Simulasi Lokakarya Tata Kelola",
      title: "Majelis Rakyat",
      subtitle: "Moderator digital real-time untuk lokakarya pengambilan keputusan sipil tatap muka. Bekerjasama, berunding, dan tentukan masa depan kota.",
      create_title: "Buat Sesi Baru",
      create_desc: "Untuk host, pengajar, dan fasilitator lokakarya. Luncurkan kode ruangan baru dan koordinasikan gameplay, skenario, serta ekspor hasil.",
      create_btn: "Mulai sebagai Host",
      join_title: "Gabung Sesi",
      join_desc: "Untuk peserta majelis dan pemangku kepentingan. Masukkan kode ruangan yang dibagikan oleh fasilitator Anda untuk memainkan peran rahasia.",
      join_btn: "Masukkan Kode Ruangan",
      select_language: "Pilih Bahasa Anda",
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
    landing: {
      select_language: "เลือกภาษาของคุณ",
    }
  },
  ph: {
    landing: {
      select_language: "Pilihin ang iyong Wika",
    }
  },
  vi: {
    landing: {
      select_language: "Chọn ngôn ngữ của bạn",
    }
  },
  my: {
    landing: {
      select_language: "သင်၏ဘာသာစကားကိုရွေးချယ်ပါ",
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

  const toggleLang = () => {
    const newLang = lang === 'en' ? 'id' : 'en';
    setLang(newLang);
    localStorage.setItem('tpa_lang', newLang);
  };

  return { t, lang, setLang, toggleLang };
}

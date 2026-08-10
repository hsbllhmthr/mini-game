export interface IndicatorChanges {
  economicGrowth: number;
  governmentBudget: number;
  peopleWelfare: number;
  publicTrust: number;
  environmentalQuality: number;
  transparency: number;
}

export interface ScenarioOption {
  label: string;
  description: string;
  advantages: string;
  risks: string;
  indicators: IndicatorChanges;
}

export interface Scenario {
  id: number;
  title: string;
  description: string;
  challengeSummary: string;
  stakeholderPositions: Record<string, string>;
  options: {
    A: ScenarioOption;
    B: ScenarioOption;
    C: ScenarioOption;
  };
  reflection: string;
}

export interface RawScenarioOption {
  label: Record<string, string>;
  description: Record<string, string>;
  advantages: Record<string, string>;
  risks: Record<string, string>;
  indicators: IndicatorChanges;
}

export interface RawScenario {
  id: number;
  title: Record<string, string>;
  description: Record<string, string>;
  challengeSummary: Record<string, string>;
  stakeholderPositions: Record<string, Record<string, string>>;
  options: {
    A: RawScenarioOption;
    B: RawScenarioOption;
    C: RawScenarioOption;
  };
  reflection: Record<string, string>;
}

export const ROLES = [
  'mayor',
  'journalist',
  'community_rep',
  'business_rep',
  'social_welfare',
  'environmental',
  'investor',
  'youth_rep',
] as const;

export type PlayerRole = typeof ROLES[number];

export const ROLE_DISTRIBUTION: Record<number, Record<PlayerRole, number>> = {
  2:  { mayor: 1, journalist: 1, community_rep: 0, business_rep: 0, social_welfare: 0, environmental: 0, investor: 0, youth_rep: 0 },
  3:  { mayor: 1, journalist: 1, community_rep: 1, business_rep: 0, social_welfare: 0, environmental: 0, investor: 0, youth_rep: 0 },
  4:  { mayor: 1, journalist: 1, community_rep: 1, business_rep: 1, social_welfare: 0, environmental: 0, investor: 0, youth_rep: 0 },
  5:  { mayor: 1, journalist: 1, community_rep: 1, business_rep: 1, social_welfare: 1, environmental: 0, investor: 0, youth_rep: 0 },
  6:  { mayor: 1, journalist: 1, community_rep: 1, business_rep: 1, social_welfare: 1, environmental: 1, investor: 0, youth_rep: 0 },
  7:  { mayor: 1, journalist: 1, community_rep: 1, business_rep: 1, social_welfare: 1, environmental: 1, investor: 1, youth_rep: 0 },
  8:  { mayor: 1, journalist: 1, community_rep: 1, business_rep: 1, social_welfare: 1, environmental: 1, investor: 1, youth_rep: 1 },
  9:  { mayor: 1, journalist: 1, community_rep: 2, business_rep: 1, social_welfare: 1, environmental: 1, investor: 1, youth_rep: 1 },
  10: { mayor: 1, journalist: 1, community_rep: 2, business_rep: 2, social_welfare: 1, environmental: 1, investor: 1, youth_rep: 1 },
  11: { mayor: 1, journalist: 1, community_rep: 2, business_rep: 2, social_welfare: 1, environmental: 1, investor: 2, youth_rep: 1 },
  12: { mayor: 1, journalist: 1, community_rep: 2, business_rep: 2, social_welfare: 2, environmental: 2, investor: 1, youth_rep: 1 },
};

export const ROLE_DESCRIPTIONS: Record<string, Record<PlayerRole, string>> = {
  en: {
    mayor: "The city's chief executive, responsible for final policy decisions.",
    journalist: "A watchdog reporter committed to transparency and calling out corruption.",
    community_rep: "A grassroots organizer representing the citizens' daily needs.",
    business_rep: "A local commerce leader advocating for growth and employment.",
    social_welfare: "An advocate for vulnerable populations, equality, and public safety nets.",
    environmental: "An activist dedicated to protecting the ecosystem and conservation.",
    investor: "A major financial backer seeking stability and attractive projects.",
    youth_rep: "A representative of the younger demographic, pushing for future-oriented policies.",
  },
  id: {
    mayor: "Kepala eksekutif kota, bertanggung jawab atas keputusan kebijakan akhir.",
    journalist: "Reporter pengawas yang berkomitmen pada transparansi dan mengungkap korupsi.",
    community_rep: "Pengorganisir akar rumput yang mewakili kebutuhan sehari-hari warga.",
    business_rep: "Pemimpin perdagangan lokal yang memperjuangkan pertumbuhan dan lapangan kerja.",
    social_welfare: "Advokat bagi populasi rentan, kesetaraan, dan jaring pengaman publik.",
    environmental: "Aktivis yang berdedikasi untuk melindungi ekosistem dan konservasi.",
    investor: "Penyokong keuangan utama yang mencari stabilitas dan proyek yang menarik.",
    youth_rep: "Perwakilan demografi muda, mendorong kebijakan yang berorientasi masa depan.",
  },
  th: {
    mayor: "ผู้บริหารสูงสุดของเมือง รับผิดชอบการตัดสินใจนโยบายขั้นสุดท้าย",
    journalist: "ผู้สื่อข่าวอิสระที่มุ่งมั่นในความโปร่งใสและตรวจสอบการทุจริต",
    community_rep: "ผู้จัดตั้งระดับฐานราก ตัวแทนความต้องการประจำวันของประชาชน",
    business_rep: "ผู้นำการค้าท้องถิ่นที่สนับสนุนการเติบโตและการจ้างงาน",
    social_welfare: "ผู้สนับสนุนกลุ่มเปราะบาง ความเท่าเทียม และตาข่ายความปลอดภัยทางสังคม",
    environmental: "นักกิจกรรมที่อุทิศตนเพื่อปกป้องระบบนิเวศและการอนุรักษ์",
    investor: "ผู้สนับสนุนทางการเงินรายใหญ่ที่แสวงหาความมั่นคงและโครงการที่น่าสนใจ",
    youth_rep: "ตัวแทนกลุ่มเยาวชน ผลักดันนโยบายที่มุ่งเน้นอนาคต",
  }
};

export const ROLE_OBJECTIVES: Record<string, Record<PlayerRole, string>> = {
  en: {
    mayor: "Maintain public trust while balancing economic development, social welfare, and sustainable governance.",
    journalist: "Promote transparency by uncovering information; decide whether to support, challenge, or stay neutral on decisions.",
    community_rep: "Ensure policies address citizens' needs and well-being; can be influenced by other stakeholders.",
    business_rep: "Promote economic growth, business opportunity, and investment stability.",
    social_welfare: "Promote fairness, inclusion, equal access, and protection of vulnerable groups.",
    environmental: "Protect natural resources and long-term environmental sustainability.",
    investor: "Maximize economic returns and attract/support growth-stimulating projects.",
    youth_rep: "Promote youth participation, innovation, and long-term/future-oriented gains.",
  },
  id: {
    mayor: "Menjaga kepercayaan publik sambil menyeimbangkan pembangunan ekonomi, kesejahteraan sosial, dan tata kelola yang berkelanjutan.",
    journalist: "Mendorong transparansi dengan mengungkap informasi; memutuskan apakah akan mendukung, menantang, atau tetap netral terhadap keputusan.",
    community_rep: "Memastikan kebijakan menjawab kebutuhan dan kesejahteraan warga; dapat dipengaruhi oleh pemangku kepentingan lain.",
    business_rep: "Mendorong pertumbuhan ekonomi, peluang bisnis, dan stabilitas investasi.",
    social_welfare: "Mendorong keadilan, inklusi, akses yang setara, dan perlindungan kelompok rentan.",
    environmental: "Melindungi sumber daya alam dan keberlanjutan lingkungan jangka panjang.",
    investor: "Memaksimalkan pengembalian ekonomi dan menarik/mendukung proyek yang merangsang pertumbuhan.",
    youth_rep: "Mendorong partisipasi pemuda, inovasi, dan keuntungan jangka panjang/berorientasi masa depan.",
  },
  th: {
    mayor: "รักษาความไว้วางใจของสาธารณชนพร้อมสร้างความสมดุลระหว่างการพัฒนาเศรษฐกิจ สวัสดิการสังคม และการบริหารจัดการที่ยั่งยืน",
    journalist: "ส่งเสริมความโปร่งใสโดยการเปิดเผยข้อมูล ตัดสินใจว่าจะสนับสนุน คัดค้าน หรือเป็นกลาง",
    community_rep: "สร้างหลักประกันว่านโยบายตอบสนองความต้องการและความเป็นอยู่ที่ดีของประชาชน",
    business_rep: "ส่งเสริมการเติบโตทางเศรษฐกิจ โอกาสทางธุรกิจ และความมั่นคงของการลงทุน",
    social_welfare: "ส่งเสริมความเป็นธรรม การมีส่วนร่วมอย่างเท่าเทียม และการคุ้มครองกลุ่มเปราะบาง",
    environmental: "ปกป้องทรัพยากรธรรมชาติและความยั่งยืนของสิ่งแวดล้อมในระยะยาว",
    investor: "สร้างผลตอบแทนทางเศรษฐกิจสูงสุดและสนับสนุนโครงการกระตุ้นการเติบโต",
    youth_rep: "ส่งเสริมการมีส่วนร่วมของเยาวชน นวัตกรรม และผลประโยชน์ระยะยาวในอนาคต",
  }
};

export const SECRET_INFO: Record<string, Record<PlayerRole, string>> = {
  en: {
    mayor: "A close ally on the city council is privately pressuring you to favor decisions aligned with their business interests. You may comply or resist.",
    journalist: "A confidential source claims possible irregularities in project approvals — information that could shift public opinion if revealed.",
    community_rep: "A local community leader has privately promised political support next election in exchange for backing a specific policy.",
    business_rep: "Your company stands to profit significantly from one particular option. Publicly you advocate economic growth, but privately you favor this specific outcome.",
    social_welfare: "You've received a confidential report that a welfare program may have been misused. You can expose it or stay silent to preserve alliances.",
    environmental: "You possess unreleased data suggesting environmental impacts may be worse than publicly acknowledged.",
    investor: "Investors are considering pulling out if major projects face delays; you've been privately told to push for the fastest possible approval.",
    youth_rep: "A media company has offered sponsorship and visibility in exchange for your support of a specific infrastructure policy benefiting their corporate partners.",
  },
  id: {
    mayor: "Seorang sekutu dekat di dewan kota secara pribadi menekan Anda untuk mendukung keputusan yang sejalan dengan kepentingan bisnis mereka. Anda dapat menurut atau melawan.",
    journalist: "Sumber rahasia mengklaim adanya kemungkinan ketidakberesan dalam persetujuan proyek — informasi yang dapat mengubah opini publik jika terungkap.",
    community_rep: "Seorang pemimpin komunitas lokal secara pribadi menjanjikan dukungan politik pada pemilihan berikutnya sebagai imbalan atas dukungan terhadap kebijakan tertentu.",
    business_rep: "Perusahaan Anda akan mendapat untung besar dari satu opsi tertentu. Secara publik Anda mendukung pertumbuhan ekonomi, tetapi secara pribadi Anda lebih menyukai hasil spesifik ini.",
    social_welfare: "Anda menerima laporan rahasia bahwa program kesejahteraan mungkin telah disalahgunakan. Anda dapat mengungkapnya atau tetap diam untuk menjaga aliansi.",
    environmental: "Anda memiliki data yang belum dirilis yang menunjukkan bahwa dampak lingkungan mungkin lebih buruk daripada yang diakui secara publik.",
    investor: "Investor sedang mempertimbangkan untuk menarik diri jika proyek-proyek besar menghadapi penundaan; Anda secara pribadi diminta untuk mendorong persetujuan secepat mungkin.",
    youth_rep: "Sebuah perusahaan media telah menawarkan sponsor dan visibilitas sebagai imbalan atas dukungan Anda terhadap kebijakan infrastruktur tertentu yang menguntungkan mitra korporasi mereka.",
  },
  th: {
    mayor: "พันธมิตรใกล้ชิดในสภาเมืองกำลังกดดันคุณเป็นการส่วนตัวให้สนับสนุนการตัดสินใจที่สอดคล้องกับผลประโยชน์ทางธุรกิจของพวกเขา คุณจะยอมตามหรือคัดค้าน",
    journalist: "แหล่งข่าวลับอ้างว่าอาจมีความไม่ชอบมาพากลในการอนุมัติโครงการ — ข้อมูลที่อาจเปลี่ยนความคิดเห็นของสาธารณชนหากถูกเปิดเผย",
    community_rep: "ผู้นำชุมชนท้องถิ่นสัญญาว่าจะสนับสนุนทางการเมืองในการเลือกตั้งครั้งถัดไป แลกกับการสนับสนุนนโยบายเฉพาะ",
    business_rep: "บริษัทของคุณจะได้กำไรอย่างมากจากตัวเลือกใดตัวเลือกหนึ่ง ต่อหน้าสาธารณะคุณสนับสนุนการเติบโตทางเศรษฐกิจ แต่เป็นการส่วนตัวคุณชอบผลลัพธ์นี้",
    social_welfare: "คุณได้รับรายงานลับว่าโครงการสวัสดิการอาจถูกนำไปใช้ในทางที่ผิด คุณสามารถเปิดเผยหรือเงียบไว้เพื่อรักษาพันธมิตร",
    environmental: "คุณมีข้อมูลที่ยังไม่ได้เปิดเผยซึ่งระบุว่าผลกระทบต่อสิ่งแวดล้อมอาจแย่กว่าที่ยอมรับต่อสาธารณะ",
    investor: "นักลงทุนกำลังพิจารณาถอนตัวหากโครงการใหญ่เผชิญความล่าช้า คุณได้รับแจ้งเป็นการส่วนตัวให้ผลักดันการอนุมัติโดยเร็วที่สุด",
    youth_rep: "บริษัทสื่อเสนอการเป็นผู้สนับสนุนและสร้างชื่อเสียงให้คุณ แลกกับการสนับสนุนนโยบายโครงสร้างพื้นฐานเฉพาะที่ให้ผลประโยชน์แก่พันธมิตรของพวกเขา",
  }
};

export interface GameStateValues {
  economicGrowth: number;
  governmentBudget: number;
  peopleWelfare: number;
  publicTrust: number;
  environmentalQuality: number;
  transparency: number;
}

export const BENEFIT_THRESHOLDS: Record<PlayerRole, (s: GameStateValues) => boolean> = {
  mayor: (s) => s.publicTrust >= 70 && ((s.publicTrust + s.transparency) / 2) >= 60,
  journalist: (s) => s.transparency >= 70,
  community_rep: (s) => s.peopleWelfare >= 70,
  business_rep: (s) => s.economicGrowth >= 70,
  social_welfare: (s) => s.peopleWelfare >= 80,
  environmental: (s) => s.environmentalQuality >= 75,
  investor: (s) => s.economicGrowth >= 75 && s.governmentBudget >= 65,
  youth_rep: (s) => (s.economicGrowth + s.environmentalQuality) / 2 >= 70,
};

export const SCENARIOS: RawScenario[] = [
  {
    id: 1,
    title: {
      en: "New Industrial Zone",
      id: "Kawasan Industri Baru",
      th: "เขตอุตสาหกรรมใหม่"
    },
    description: {
      en: "A consortium proposes a new industrial zone promising jobs, tax revenue, and investment...",
      id: "Sebuah konsorsium mengusulkan kawasan industri baru yang menjanjikan lapangan kerja, pendapatan pajak, dan investasi...",
      th: "กลุ่มคอนซอร์เทียมเสนอเขตอุตสาหกรรมใหม่ที่สัญญาว่าจะสร้างงาน รายได้ภาษี และการลงทุน..."
    },
    challengeSummary: {
      en: "A consortium proposes a new industrial zone promising jobs, tax revenue, and investment, against concerns over environmental impact, land acquisition, and transparency.",
      id: "Sebuah konsorsium mengusulkan kawasan industri baru yang menjanjikan pekerjaan dan pendapatan, namun menghadapi kekhawatiran dampak lingkungan, pembebasan lahan, dan transparansi.",
      th: "กลุ่มคอนซอร์เทียมเสนอเขตอุตสาหกรรมใหม่ที่สร้างงานและรายได้ แต่ต้องแลกกับความกังวลเรื่องสิ่งแวดล้อม การเวนคืนที่ดิน และความโปร่งใส"
    },
    stakeholderPositions: {
      en: {
        mayor: "Wants economic growth and budget surplus, but fears public trust drop.",
        journalist: "Demands full disclosure of developer ties and transparency.",
        community_rep: "Splits between jobs and fears of displacement / pollution.",
        business_rep: "Highly in favor of fast approval for local business integration.",
        social_welfare: "Concerns about worker rights and housing near the zone.",
        environmental: "Strongly against fast-track due to toxic runoff risks.",
        investor: "Wants fast approval to guarantee returns; warns of capital flight.",
        youth_rep: "Favors innovation hubs but demands clean energy standards.",
      },
      id: {
        mayor: "Menginginkan pertumbuhan ekonomi dan surplus anggaran, namun takut kepercayaan publik turun.",
        journalist: "Menuntut keterbukaan penuh atas hubungan pengembang dan transparansi.",
        community_rep: "Terbagi antara kebutuhan lapangan kerja dan ketakutan akan penggusuran/polusi.",
        business_rep: "Sangat mendukung persetujuan cepat untuk integrasi bisnis lokal.",
        social_welfare: "Khawatir tentang hak-hak pekerja dan perumahan di sekitar kawasan.",
        environmental: "Sangat menentang jalur cepat karena risiko limbah beracun.",
        investor: "Menginginkan persetujuan cepat untuk menjamin imbal hasil; memperingatkan pelarian modal.",
        youth_rep: "Mendukung pusat inovasi tetapi menuntut standar energi bersih.",
      },
      th: {
        mayor: "ต้องการการเติบโตทางเศรษฐกิจและงบประมาณเกินดุล แต่กลัวความไว้วางใจของประชาชนลดลง",
        journalist: "เรียกร้องให้เปิดเผยความเชื่อมโยงกับผู้พัฒนาอย่างเต็มที่และความโปร่งใส",
        community_rep: "แตกเป็นสองฝ่ายระหว่างความต้องการงานและการกลัวการไล่ที่/มลพิษ",
        business_rep: "สนับสนุนการอนุมัติอย่างรวดเร็วเพื่อการรวมธุรกิจท้องถิ่น",
        social_welfare: "กังวลเกี่ยวกับสิทธิของแรงงานและที่อยู่อาศัยใกล้เขตอุตสาหกรรม",
        environmental: "คัดค้านกระบวนการเร่งด่วนเนื่องจากความเสี่ยงมลพิษสารพิษ",
        investor: "ต้องการการอนุมัติที่รวดเร็วเพื่อการประกันผลตอบแทน เตือนเรื่องทุนไหลออก",
        youth_rep: "สนับสนุนศูนย์นวัตกรรมแต่เรียกร้องมาตรฐานพลังงานสะอาด",
      }
    },
    options: {
      A: {
        label: { en: "Fast-Track Approval", id: "Persetujuan Jalur Cepat", th: "การอนุมัติแบบเร่งด่วน" },
        description: { en: "Approve the zone immediately with minimal restrictions to secure maximum foreign investment.", id: "Setujui kawasan segera dengan pembatasan minimal untuk mengamankan investasi asing maksimal.", th: "อนุมัติเขตอุตสาหกรรมทันทีโดยมีข้อจำกัดน้อยที่สุดเพื่อดึงดูดการลงทุนต่างชาติสูงสุด" },
        advantages: { en: "Creates maximum jobs rapidly; provides immediate massive tax revenue.", id: "Menciptakan lapangan kerja maksimal dengan cepat; memberikan pendapatan pajak masif segera.", th: "สร้างงานสูงสุดอย่างรวดเร็ว รายได้ภาษีมหาศาลทันที" },
        risks: { en: "Severe pollution, displacement of communities, major transparency issues.", id: "Polusi parah, penggusuran komunitas, masalah transparansi utama.", th: "มลพิษรุนแรง การย้ายถิ่นฐานของชุมชน ปัญหาความโปร่งใสหลัก" },
        indicators: {
          economicGrowth: 20,
          governmentBudget: 15,
          peopleWelfare: 5,
          publicTrust: -10,
          environmentalQuality: -20,
          transparency: -15,
        },
      },
      B: {
        label: { en: "Balanced Development Plan", id: "Rencana Pembangunan Seimbang", th: "แผนการพัฒนาที่สมดุล" },
        description: { en: "Approve with strict environmental regulations and partial community ownership.", id: "Setujui dengan regulasi lingkungan yang ketat dan kepemilikan komunitas sebagian.", th: "อนุมัติพร้อมกฎระเบียบสิ่งแวดล้อมที่เข้มงวดและการมีส่วนร่วมของชุมชน" },
        advantages: { en: "Sustainable growth, positive community involvement, high transparency.", id: "Pertumbuhan berkelanjutan, keterlibatan komunitas yang positif, transparansi tinggi.", th: "การเติบโตที่ยั่งยืน การมีส่วนร่วมของชุมชน ความโปร่งใสสูง" },
        risks: { en: "Moderate budget costs for regulation enforcement; slightly slower implementation.", id: "Biaya anggaran moderat untuk penegakan regulasi; implementasi sedikit lebih lambat.", th: "งบประมาณปานกลางสำหรับการบังคับใช้กฎระเบียบ การดำเนินการช้าลงเล็กน้อย" },
        indicators: {
          economicGrowth: 12,
          governmentBudget: 8,
          peopleWelfare: 10,
          publicTrust: 15,
          environmentalQuality: -5,
          transparency: 20,
        },
      },
      C: {
        label: { en: "Environment First Policy", id: "Kebijakan Lingkungan Utama", th: "นโยบายเน้นสิ่งแวดล้อมเป็นหลัก" },
        description: { en: "Reject the heavy industrial zone in favor of small-scale eco-tourism and green agriculture.", id: "Tolak kawasan industri berat demi ekowisata skala kecil dan pertanian hijau.", th: "ปฏิเสธเขตอุตสาหกรรมหนักเพื่อสนับสนุนการท่องเที่ยวเชิงนิเวศและการเกษตรสีเขียว" },
        advantages: { en: "Improves long-term environmental quality and protects local communities.", id: "Meningkatkan kualitas lingkungan jangka panjang dan melindungi komunitas lokal.", th: "ปรับปรุงคุณภาพสิ่งแวดล้อมระยะยาวและคุ้มครองชุมชนท้องถิ่น" },
        risks: { en: "Reduces economic growth and budget revenues; investors might pull out.", id: "Mengurangi pertumbuhan ekonomi dan pendapatan anggaran; investor mungkin menarik diri.", th: "ลดการเติบโตทางเศรษฐกิจและรายได้งบประมาณ นักลงทุนอาจถอนตัว" },
        indicators: {
          economicGrowth: -15,
          governmentBudget: -10,
          peopleWelfare: -5,
          publicTrust: 10,
          environmentalQuality: 20,
          transparency: 10,
        },
      },
    },
    reflection: {
      en: "Sustainable industrialization requires balancing immediate economic gains against long-term environmental and social safeguards to avoid future \"governance debt.\"",
      id: "Industrialisasi berkelanjutan membutuhkan keseimbangan antara keuntungan ekonomi segera dengan perlindungan lingkungan dan sosial jangka panjang.",
      th: "การปรับตัวสู่เมืองอุตสาหกรรมที่ยั่งยืนต้องรักษาสมดุลระหว่างผลตอบแทนทางเศรษฐกิจกับการคุ้มครองสิ่งแวดล้อม"
    },
  },
  {
    id: 2,
    title: { en: "Universal Free Education", id: "Pendidikan Gratis Universal", th: "การศึกษาฟรีถ้วนหน้า" },
    description: { en: "A proposal to fund free education from primary school through university...", id: "Sebuah proposal untuk mendanai pendidikan gratis dari sekolah dasar hingga universitas...", th: "ข้อเสนอจัดหาทุนการศึกษาฟรีตั้งแต่ระดับประถมศึกษาจนถึงมหาวิทยาลัย..." },
    challengeSummary: { en: "A proposal to fund free education from primary school through university, weighed against fiscal burden and effects on other public services.", id: "Proposal pendidikan gratis universal, ditimbang dengan beban fiskal dan dampaknya pada layanan publik lainnya.", th: "ข้อเสนอจัดหาทุนการศึกษาฟรีถ้วนหน้า โดยชั่งน้ำหนักกับภาระทางการคลังและผลกระทบต่อบริการสาธารณะอื่น ๆ" },
    stakeholderPositions: {
      en: {
        mayor: "Values human capital but worries about budget bankruptcy.",
        journalist: "Wants strict tracking of education funds and quality metrics.",
        community_rep: "Demands access for all, seeing education as a fundamental right.",
        business_rep: "Prefers targeted schemes or shared-cost models to minimize corporate tax.",
        social_welfare: "Fully supports free access to break cycles of poverty.",
        environmental: "Neutral, but wants environmental science added to curriculum.",
        investor: "Fears government deficit will trigger higher interest rates.",
        youth_rep: "Supports full funding; demands modern tech skills curriculum.",
      },
      id: {
        mayor: "Menghargai modal manusia tetapi khawatir tentang kebangkrutan anggaran.",
        journalist: "Menginginkan pelacakan ketat dana pendidikan dan metrik kualitas.",
        community_rep: "Menuntut akses untuk semua, memandang pendidikan sebagai hak dasar.",
        business_rep: "Lebih menyukai skema terarah atau model berbagi biaya untuk meminimalkan pajak korporasi.",
        social_welfare: "Sangat mendukung akses gratis untuk memutus rantai kemiskinan.",
        environmental: "Netral, tetapi ingin ilmu lingkungan ditambahkan ke kurikulum.",
        investor: "Takut defisit pemerintah akan memicu suku bunga yang lebih tinggi.",
        youth_rep: "Mendukung pendanaan penuh; menuntut kurikulum keterampilan teknologi modern.",
      },
      th: {
        mayor: "เห็นคุณค่าของทุนมนุษย์แต่กังวลเรื่องภาวะล้มละลายทางงบประมาณ",
        journalist: "ต้องการติดตามเงินทุนการศึกษาและตัวชี้วัดคุณภาพอย่างเข้มงวด",
        community_rep: "เรียกร้องการเข้าถึงสำหรับทุกคน มองว่าการศึกษาเป็นสิทธิขั้นพื้นฐาน",
        business_rep: "ชอบรูปแบบร่วมจ่ายหรือเน้นกลุ่มเป้าหมายเพื่อลดภาษีนิติบุคคล",
        social_welfare: "สนับสนุนการเรียนฟรีอย่างเต็มที่เพื่อขจัดวงจรความยากจน",
        environmental: "เป็นกลาง แต่ต้องการให้เพิ่มวิทยาศาสตร์สิ่งแวดล้อมในหลักสูตร",
        investor: "กลัวว่าการขาดดุลงบประมาณจะทำให้เกิดอัตราดอกเบี้ยที่สูงขึ้น",
        youth_rep: "สนับสนุนงบประมาณเต็มจำนวน เรียกร้องหลักสูตรทักษะเทคโนโลยีสมัยใหม่",
      }
    },
    options: {
      A: {
        label: { en: "Universal Free Education", id: "Pendidikan Gratis Universal", th: "การศึกษาฟรีถ้วนหน้า" },
        description: { en: "Fund full tuition for all citizens from public budget.", id: "Danai biaya kuliah penuh untuk semua warga negara dari anggaran publik.", th: "อุดหนุนค่าเล่าเรียนเต็มจำนวนสำหรับพลเมืองทุกคนจากงบประมาณแผ่นดิน" },
        advantages: { en: "Major boost to people welfare and long-term public trust.", id: "Peningkatan besar bagi kesejahteraan rakyat dan kepercayaan publik jangka panjang.", th: "ส่งเสริมสวัสดิการประชาชนและความไว้วางใจระยะยาวอย่างมหาศาล" },
        risks: { en: "Huge budget deficit, forcing cuts in other public services.", id: "Defisit anggaran besar, memaksa pemotongan pada layanan publik lainnya.", th: "การขาดดุลงบประมาณมหาศาล บังคับให้ต้องลดงบประมาณบริการสาธารณะอื่น" },
        indicators: {
          economicGrowth: 5,
          governmentBudget: -30,
          peopleWelfare: 20,
          publicTrust: 15,
          environmentalQuality: 0,
          transparency: 0,
        },
      },
      B: {
        label: { en: "Targeted Free Education", id: "Pendidikan Gratis Terarah", th: "การศึกษาฟรีแบบระบุกลุ่มเป้าหมาย" },
        description: { en: "Provide free education only to low-income families based on means testing.", id: "Berikan pendidikan gratis hanya untuk keluarga berpenghasilan rendah berdasarkan tes kelayakan.", th: "ให้ทุนเรียนฟรีเฉพาะครอบครัวที่มีรายได้น้อยตามการประเมินสิทธิ์" },
        advantages: { en: "Reduces budget strain, helps those who need it most.", id: "Mengurangi ketegangan anggaran, membantu mereka yang paling membutuhkan.", th: "ลดภาระงบประมาณ และช่วยผู้ที่ต้องการอย่างแท้จริง" },
        risks: { en: "Administrative complexity, some middle-income families left behind.", id: "Kompleksitas administratif, beberapa keluarga berpenghasilan menengah tertinggal.", th: "ความซับซ้อนทางการบริหาร ครอบครัวปานกลางบางส่วนอาจตกสำรวจ" },
        indicators: {
          economicGrowth: 5,
          governmentBudget: -15,
          peopleWelfare: 10,
          publicTrust: 10,
          environmentalQuality: 0,
          transparency: 5,
        },
      },
      C: {
        label: { en: "Shared-Cost Education", id: "Pendidikan Berbagi Biaya", th: "การศึกษาร่วมจ่าย" },
        description: { en: "Implement student loans and public-private partnerships.", id: "Terapkan pinjaman mahasiswa dan kemitraan publik-swasta.", th: "ใช้ระบบเงินกู้ยืมเพื่อการศึกษาและการร่วมมือระหว่างภาครัฐและเอกชน" },
        advantages: { en: "Protects public budget; encourages private sector investment.", id: "Melindungi anggaran publik; mendorong investasi sektor swasta.", th: "รักษางบประมาณแผ่นดิน และส่งเสริมการลงทุนจากภาคเอกชน" },
        risks: { en: "Increases youth debt; decreases accessibility for poor citizens.", id: "Meningkatkan hutang pemuda; mengurangi aksesibilitas bagi warga miskin.", th: "เพิ่มภาระหนี้สินแก่เยาวชน และลดโอกาสของคนยากจน" },
        indicators: {
          economicGrowth: 20,
          governmentBudget: 10,
          peopleWelfare: -10,
          publicTrust: -5,
          environmentalQuality: 0,
          transparency: -10,
        },
      },
    },
    reflection: {
      en: "Human capital drives prosperity, but universal access needs a stable fiscal foundation to remain sustainable.",
      id: "Modal manusia mendorong kemakmuran, tetapi akses universal membutuhkan fondasi fiskal yang stabil.",
      th: "ทุนมนุษย์ขับเคลื่อนความมั่งคั่ง แต่การเข้าถึงถ้วนหน้าต้องมีฐานทางการคลังที่มั่นคง"
    },
  },
  {
    id: 3,
    title: { en: "Open Forest for Mining", id: "Buka Hutan untuk Pertambangan", th: "เปิดป่าเพื่อทำเหมืองแร่" },
    description: { en: "A mineral deposit beneath a protected forest could be opened for extraction...", id: "Deposit mineral di bawah hutan lindung dapat dibuka untuk ekstraksi...", th: "แหล่งแร่สำคัญใต้ป่าอนุรักษ์อาจถูกเปิดเพื่อการทำเหมืองแร่..." },
    challengeSummary: { en: "A mineral deposit beneath a protected forest could be opened for extraction, weighed against deforestation, biodiversity loss, and harm to local communities.", id: "Ekstraksi mineral di hutan lindung, ditimbang dengan deforestasi dan kerusakan komunitas lokal.", th: "การขุดเจาะแร่ใต้ป่าอนุรักษ์ โดยชั่งน้ำหนักระหว่างการตัดไม้ทำลายป่าและการสูญเสียความหลากหลายทางชีวภาพ" },
    stakeholderPositions: {
      en: {
        mayor: "Attracted by mineral revenues but fears massive green backlash.",
        journalist: "Watches for kickbacks in mining licenses and concessions.",
        community_rep: "Torn between high-paying mining jobs and native land destruction.",
        business_rep: "Highly favors opening to supply manufacturing chains.",
        social_welfare: "Warns of health hazards from water contamination in nearby villages.",
        environmental: "Fiercely opposes any intrusion; warns of permanent ecological loss.",
        investor: "Views this as the city's single biggest asset; demands quick approval.",
        youth_rep: "Opposes mining; advocates for protecting resource heritage.",
      },
      id: {
        mayor: "Tertarik dengan pendapatan mineral tetapi takut akan reaksi keras pecinta lingkungan.",
        journalist: "Mengawasi suap dalam lisensi pertambangan dan konsesi.",
        community_rep: "Terbelah antara pekerjaan tambang bergaji tinggi dan perusakan tanah adat.",
        business_rep: "Sangat mendukung pembukaan untuk memasok rantai manufaktur.",
        social_welfare: "Memperingatkan bahaya kesehatan dari kontaminasi air di desa-desa sekitar.",
        environmental: "Sangat menentang segala gangguan; memperingatkan kerugian ekologis permanen.",
        investor: "Memandang ini sebagai aset tunggal terbesar kota; menuntut persetujuan cepat.",
        youth_rep: "Menentang pertambangan; memperjuangkan perlindungan warisan sumber daya.",
      },
      th: {
        mayor: "ดึงดูดใจด้วยรายได้จากแร่ แต่กลัวการต่อต้านอย่างรุนแรงจากกลุ่มอนุรักษ์",
        journalist: "เฝ้าระวังการส่วยหรือผลประโยชน์ทับซ้อนในการอนุมัติประทานบัตร",
        community_rep: "ลังเลระหว่างงานทำเหมืองที่ได้ค่าตอบแทนสูงกับการทำลายที่ดินทำกินเดิม",
        business_rep: "สนับสนุนการเปิดเหมืองอย่างยิ่งเพื่อป้อนห่วงโซ่การผลิต",
        social_welfare: "เตือนถึงอันตรายต่อสุขภาพจากการปนเปื้อนของน้ำในหมู่บ้านใกล้เคียง",
        environmental: "คัดค้านการบุกรุกอย่างรุนแรง เตือนถึงการสูญเสียทางระบบนิเวศอย่างถาวร",
        investor: "มองว่านี่คือสินทรัพย์ที่ใหญ่ที่สุดของเมือง เรียกร้องให้ อนุมัติโดยเร็ว",
        youth_rep: "คัดค้านการทำเหมือง สนับสนุนการคุ้มครองมรดกทางทรัพยากร",
      }
    },
    options: {
      A: {
        label: { en: "Full Mining Approval", id: "Persetujuan Tambang Penuh", th: "อนุมัติทำเหมืองเต็มรูปแบบ" },
        description: { en: "Grant licenses to multinational mining corporations to exploit the deposits.", id: "Berikan lisensi kepada perusahaan pertambangan multinasional untuk mengeksploitasi deposit.", th: "ให้ประทานบัตรแก่บริษัทข้ามชาติเพื่อขุดเจาะแร่เต็มกำลัง" },
        advantages: { en: "Unlocks massive economic growth and budget surplus.", id: "Membuka pertumbuhan ekonomi masif dan surplus anggaran.", th: "ปลดล็อกการเติบโตทางเศรษฐกิจและงบประมาณเกินดุลมหาศาล" },
        risks: { en: "Catastrophic deforestation, water pollution, and community outcry.", id: "Deforestasi katastrofik, polusi air, dan kecaman komunitas.", th: "การตัดไม้ทำลายป่าขั้นรุนแรง มลพิษทางน้ำ และการประท้วงจากชุมชน" },
        indicators: {
          economicGrowth: 25,
          governmentBudget: 20,
          peopleWelfare: -5,
          publicTrust: -10,
          environmentalQuality: -30,
          transparency: -5,
        },
      },
      B: {
        label: { en: "Regulated Sustainable Mining", id: "Pertambangan Berkelanjutan Teratur", th: "ทำเหมืองยั่งยืนภายใต้การควบคุม" },
        description: { en: "Permit limited mining with high royalties, mandatory replanting, and local refining.", id: "Izinkan penambangan terbatas dengan royalti tinggi dan penanaman kembali wajib.", th: "อนุญาตทำเหมืองจำกัดพื้นที่ พร้อมจัดเก็บค่าภาคหลวงสูงและปลูกป่าทดแทน" },
        advantages: { en: "Good economic return with some ecological mitigation efforts.", id: "Imbal hasil ekonomi yang baik dengan beberapa upaya mitigasi ekologis.", th: "ได้ผลตอบแทนทางเศรษฐกิจดี พร้อมมาตรการบรรเทาผลกระทบสิ่งแวดล้อม" },
        risks: { en: "Enforcement is expensive; ecological damage is reduced but still occurs.", id: "Penegakan hukum mahal; kerusakan ekologis berkurang tetapi tetap terjadi.", th: "ค่าใช้จ่ายในการกำกับดูแลสูง ความเสียหายทางนิเวศลดลงแต่ยังมีอยู่" },
        indicators: {
          economicGrowth: 15,
          governmentBudget: 12,
          peopleWelfare: 5,
          publicTrust: 10,
          environmentalQuality: -15,
          transparency: 15,
        },
      },
      C: {
        label: { en: "Protect the Forest", id: "Lindungi Hutan", th: "ปกป้องผืนป่า" },
        description: { en: "Ban all mining in the forest and declare it a permanent ecological reserve.", id: "Larang semua penambangan di hutan dan jadikan cagar alam permanen.", th: "ห้ามการทำเหมืองทั้งหมดในป่า และประกาศเป็นเขตรักษาพันธุ์สัตว์ป่าและธรรมชาติถาวร" },
        advantages: { en: "Protects biodiversity, water supply, and carbon sink capacity.", id: "Melindungi keanekaragaman hayati, pasokan air, dan kapasitas penyerap karbon.", th: "ปกป้องความหลากหลายทางชีวภาพ แหล่งน้ำ และพื้นที่ดูดซับคาร์บอน" },
        risks: { en: "Misses out on huge mineral revenue and immediate job opportunities.", id: "Kehilangan pendapatan mineral masif dan peluang kerja segera.", th: "สูญเสียโอกาสทางรายได้จากแร่มหาศาลและการสร้างงานทันที" },
        indicators: {
          economicGrowth: -15,
          governmentBudget: -10,
          peopleWelfare: 5,
          publicTrust: 15,
          environmentalQuality: 25,
          transparency: 10,
        },
      },
    },
    reflection: {
      en: "Resource extraction offers quick revenue but carries permanent ecological risk; leadership means weighing finite wealth against the heritage of future generations.",
      id: "Ekstraksi sumber daya menawarkan pendapatan cepat tetapi membawa risiko ekologis permanen.",
      th: "การสกัดทรัพยากรให้รายได้รวดเร็วแต่มีความเสี่ยงทางนิเวศถาวร ภาวะผู้นำคือการชั่งน้ำหนักสมบัติที่มีจำกัดกับมรดกคนรุ่นหลัง"
    },
  },
  {
    id: 4,
    title: {
      en: "Renewable Energy Transition",
      id: "Transisi Energi Terbarukan",
      th: "การเปลี่ยนผ่านสู่พลังงานหมุนเวียน"
    },
    description: {
      en: "The city faces power grid instability and high emissions from coal plants. A proposal is introduced to transition the city's power grid to solar and wind energy...",
      id: "Kota menghadapi ketidakstabilan jaringan listrik dan emisi tinggi dari pembangkit batu bara. Proposal diajukan untuk memindahkan jaringan listrik kota ke energi surya dan angin...",
      th: "เมืองเผชิญกับความไม่มั่นคงของโครงข่ายไฟฟ้าและการปล่อยมลพิษสูงจากโรงไฟฟ้าถ่านหิน มีการเสนอข้อเสนอเพื่อเปลี่ยนโครงข่ายไฟฟ้าของเมืองไปสู่พลังงานแสงอาทิตย์และลม..."
    },
    challengeSummary: {
      en: "A proposal to shift the city's power grid from coal to solar and wind energy promises zero carbon emissions, weighed against upfront public debt and temporary electricity tariff hikes.",
      id: "Proposal untuk mengalihkan jaringan listrik kota dari batu bara ke energi surya dan angin menjanjikan nol emisi karbon, ditimbang dengan utang publik awal dan kenaikan tarif listrik sementara.",
      th: "ข้อเสนอเพื่อเปลี่ยนโครงข่ายไฟฟ้าของเมืองจากถ่านหินไปสู่พลังงานแสงอาทิตย์และลมสัญญาว่าจะปล่อยคาร์บอนเป็นศูนย์ โดยชั่งน้ำหนักกับหนี้สาธารณะเริ่มต้นและการขึ้นค่าไฟฟ้าชั่วคราว"
    },
    stakeholderPositions: {
      en: {
        mayor: "Supports clean energy legacy but worries about public anger over tariff hikes.",
        journalist: "Monitors energy contract transparency and utility company lobbying.",
        community_rep: "Demands low-income energy subsidies and tariff protections.",
        business_rep: "Fears high energy costs will reduce manufacturing competitiveness.",
        social_welfare: "Warns that energy price hikes disproportionately harm poor households.",
        environmental: "Strongly advocates for immediate 100% renewable grid transition.",
        investor: "Sees huge opportunities in green tech infrastructure contracts.",
        youth_rep: "Champions aggressive climate action for a sustainable future.",
      },
      id: {
        mayor: "Mendukung warisan energi bersih tetapi khawatir akan kemarahan publik atas kenaikan tarif.",
        journalist: "Mengawasi transparansi kontrak energi dan lobi perusahaan utilitas.",
        community_rep: "Menuntut subsidi energi bagi warga berpenghasilan rendah dan perlindungan tarif.",
        business_rep: "Khawatir biaya energi yang tinggi akan mengurangi daya saing manufaktur.",
        social_welfare: "Memperingatkan bahwa kenaikan harga energi sangat merugikan rumah tangga miskin.",
        environmental: "Sangat mendukung transisi 100% jaringan terbarukan segera.",
        investor: "Melihat peluang besar dalam kontrak infrastruktur teknologi hijau.",
        youth_rep: "Mendorong aksi iklim yang agresif demi masa depan berkelanjutan.",
      },
      th: {
        mayor: "สนับสนุนมรดกพลังงานสะอาด แต่กังวลเรื่องความไม่พอใจของสาธารณชนจากการขึ้นค่าไฟ",
        journalist: "เฝ้าระวังความโปร่งใสของสัญญาพลังงานและการวิ่งเต้นของบริษัทสาธารณูปโภค",
        community_rep: "เรียกร้องเงินอุดหนุนพลังงานสำหรับผู้มีรายได้น้อยและการคุ้มครองอัตราค่าไฟ",
        business_rep: "กลัวว่าต้นทุนพลังงานที่สูงจะลดความสามารถในการแข่งขันภาคการผลิต",
        social_welfare: "เตือนว่าการขึ้นราคาพลังงานส่งผลกระทบต่อครัวเรือนยากจนอย่างไม่เป็นธรรม",
        environmental: "สนับสนุนการเปลี่ยนผ่านสู่พลังงานหมุนเวียน 100% ทันทีอย่างเข้มแข็ง",
        investor: "เห็นโอกาสมหาศาลในโครงสร้างพื้นฐานเทคโนโลยีสีเขียว",
        youth_rep: "ผลักดันการดำเนินการด้านภูมิอากาศอย่างจริงจังเพื่ออนาคตที่ยั่งยืน",
      }
    },
    options: {
      A: {
        label: { en: "Rapid Green Transition", id: "Transisi Cepat Energi Terbarukan", th: "การเปลี่ยนผ่านสีเขียวอย่างรวดเร็ว" },
        description: { en: "Immediately phase out coal plants and fund municipal solar/wind grids with public subsidies.", id: "Segera menghentikan pembangkit batu bara dan mendanai jaringan surya/angin kota dengan subsidi publik.", th: "ยกเลิกโรงไฟฟ้าถ่านหินทันทีและจัดหาทุนโครงข่ายพลังงานแสงอาทิตย์/ลมด้วยเงินอุดหนุน" },
        advantages: { en: "Dramatic reduction in air pollution and major boost to environmental reputation.", id: "Penurunan dramatis polusi udara dan peningkatan besar pada reputasi lingkungan.", th: "ลดมลพิษทางอากาศอย่างมหาศาลและเพิ่มชื่อเสียงด้านสิ่งแวดล้อม" },
        risks: { en: "Heavy budget deficit from subsidies; short-term electricity tariff increase.", id: "Defisit anggaran yang berat dari subsidi; kenaikan tarif listrik jangka pendek.", th: "การขาดดุลงบประมาณอย่างรวดเร็วจากการอุดหนุน การขึ้นค่าไฟระยะสั้น" },
        indicators: {
          economicGrowth: -10,
          governmentBudget: -25,
          peopleWelfare: 10,
          publicTrust: 15,
          environmentalQuality: 30,
          transparency: 5,
        },
      },
      B: {
        label: { en: "Phased Hybrid Transition", id: "Transisi Campuran Bertahap", th: "การเปลี่ยนผ่านแบบผสมผสานตามขั้นตอน" },
        description: { en: "Implement a 10-year gradual transition, keeping natural gas backup while expanding solar energy.", id: "Terapkan transisi bertahap 10 tahun, mempertahankan cadangan gas alam sambil memperluas energi surya.", th: "ใช้เวลาเปลี่ยนผ่าน 10 ปี โดยรักษาแก๊สธรรมชาติไว้สำรองพร้อมขยายพลังงานแสงอาทิตย์" },
        advantages: { en: "Stable power supply, moderate costs, and steady environmental improvement.", id: "Pasokan listrik stabil, biaya moderat, dan peningkatan lingkungan yang konstan.", th: "การจ่ายไฟฟ้าที่มั่นคง ต้นทุนปานกลาง และการปรับปรุงสิ่งแวดล้อมอย่างสม่ำเสมอ" },
        risks: { en: "Slower decarbonization; requires ongoing regulatory monitoring.", id: "Dekarbonisasi lebih lambat; memerlukan pemantauan regulasi yang berkelanjutan.", th: "การลดคาร์บอนช้าลง ต้องมีการกำกับดูแลอย่างต่อเนื่อง" },
        indicators: {
          economicGrowth: 10,
          governmentBudget: -10,
          peopleWelfare: 5,
          publicTrust: 10,
          environmentalQuality: 15,
          transparency: 10,
        },
      },
      C: {
        label: { en: "Private Energy Concessions", id: "Konsesi Energi Swasta", th: "สัมปทานพลังงานภาคเอกชน" },
        description: { en: "Auction renewable energy rights to private corporations without public debt investment.", id: "Lelang hak energi terbarukan kepada korporasi swasta tanpa investasi utang publik.", th: "ประมูลสิทธิพลังงานหมุนเวียนให้บริษัทเอกชนโดยไม่ต้องกู้เงินแผ่นดิน" },
        advantages: { en: "Protects city budget and attracts foreign infrastructure investors.", id: "Melindungi anggaran kota dan menarik investor infrastruktur asing.", th: "รักษางบประมาณแผ่นดินและดึงดูดนักลงทุนโครงสร้างพื้นฐานต่างชาติ" },
        risks: { en: "High corporate tariffs for citizens; potential backroom concession deals.", id: "Tarif korporasi yang tinggi untuk warga; potensi kesepakatan konsesi belakang layar.", th: "ค่าไฟฟ้าสูงสำหรับประชาชน ความเสี่ยงจากการต่อรองผลประโยชน์ทับซ้อน" },
        indicators: {
          economicGrowth: 20,
          governmentBudget: 15,
          peopleWelfare: -10,
          publicTrust: -10,
          environmentalQuality: 10,
          transparency: -15,
        },
      },
    },
    reflection: {
      en: "Clean energy infrastructure requires balancing ecological duty against fiscal equity so energy security remains affordable for all citizens.",
      id: "Infrastruktur energi bersih membutuhkan keseimbangan antara tugas ekologis dan keadilan fiskal agar keamanan energi tetap terjangkau bagi seluruh warga.",
      th: "โครงสร้างพื้นฐานพลังงานสะอาดต้องสร้างความสมดุลระหว่างหน้าที่ทางนิเวศวิทยาและความเป็นธรรมทางการคลัง เพื่อให้ความมั่นคงทางพลังงานยังคงจับต้องได้สำหรับทุกคน"
    },
  },
  {
    id: 5,
    title: {
      en: "Smart City & Digital Surveillance",
      id: "Kota Cerdas & Pengawasan Digital",
      th: "เมืองอัจฉริยะและการสอดส่องทางดิจิทัล"
    },
    description: {
      en: "A tech consortium offers to install an AI-driven facial recognition camera network and smart traffic management system for free, in exchange for commercial data monetization rights...",
      id: "Konsorsium teknologi menawarkan untuk memasang jaringan kamera pengawas AI dan sistem manajemen lalu lintas cerdas secara gratis, sebagai imbalan atas hak monetisasi data komersial...",
      th: "กลุ่มเทคโนโลยีเสนอติดตั้งเครือข่ายกล้องตรวจจับใบหน้า AI และระบบจัดการจราจรอัจฉริยะให้ฟรี แลกกับสิทธิในการสร้างรายได้จากข้อมูลเชิงพาณิชย์..."
    },
    challengeSummary: {
      en: "A proposal to deploy citywide AI facial recognition cameras promises zero crime and smart traffic flow, weighed against civil liberties, privacy infringement, and corporate data control.",
      id: "Proposal untuk menerapkan kamera pengawas AI di seluruh kota menjanjikan penurunan kejahatan dan arus lalu lintas cerdas, ditimbang dengan kebebasan sipil, pelanggaran privasi, dan kontrol data korporasi.",
      th: "ข้อเสนอเพื่อติดตั้งกล้อง AI ตรวจจับใบพัดทั่วเมืองสัญญาว่าจะลดอาชญากรรมและเพิ่มความคล่องตัวในการจราจร โดยชั่งน้ำหนักกับสิทธิเสรีภาพ การละเมิดความเป็นส่วนตัว และการผูกขาดข้อมูลของเอกชน"
    },
    stakeholderPositions: {
      en: {
        mayor: "Attracted by instant crime reduction and modern smart city prestige.",
        journalist: "Deeply suspicious of corporate data tracking and government surveillance.",
        community_rep: "Appreciates safer neighborhoods but fears harassment of minority communities.",
        business_rep: "Strongly favors smart logistics and automated traffic management.",
        social_welfare: "Warns of algorithmic bias and wrongful police targeting of poor citizens.",
        environmental: "Neutral, but sees potential for AI-driven waste management monitoring.",
        investor: "Excited by the high-tech investment and commercial data monetization potential.",
        youth_rep: "Fiercely defends digital privacy rights and opposes mass surveillance.",
      },
      id: {
        mayor: "Tertarik dengan penurunan kejahatan instan dan gengsi kota cerdas modern.",
        journalist: "Sangat curiga terhadap pelacakan data korporasi dan pengawasan pemerintah.",
        community_rep: "Menghargai lingkungan yang lebih aman tetapi takut akan pelecehan terhadap komunitas minoritas.",
        business_rep: "Sangat mendukung logistik cerdas dan manajemen lalu lintas terotomatisasi.",
        social_welfare: "Memperingatkan tentang bias algoritma dan penargetan polisi yang salah terhadap warga miskin.",
        environmental: "Netral, namun melihat potensi untuk pemantauan manajemen sampah berbasis AI.",
        investor: "Antusias dengan investasi teknologi tinggi dan potensi monetisasi data komersial.",
        youth_rep: "Sangat membela hak privasi digital dan menentang pengawasan massal.",
      },
      th: {
        mayor: "ดึงดูดใจด้วยการลดอาชญากรรมทันทีและชื่อเสียงของเมืองอัจฉริยะที่ทันสมัย",
        journalist: "สงสัยอย่างยิ่งเกี่ยวกับการติดตามข้อมูลของเอกชนและการสอดส่องของรัฐบาล",
        community_rep: "ชื่นชอบชุมชนที่ปลอดภัยยิ่งขึ้น แต่กลัวการคุกคามชุมชนกลุ่มน้อย",
        business_rep: "สนับสนุนการขนส่งอัจฉริยะและการจัดการจราจรอัตโนมัติอย่างยิ่ง",
        social_welfare: "เตือนถึงอคติของอัลกอริทึมและการเพ่งเล็งที่ผิดพลาดของตำรวจต่อคนยากจน",
        environmental: "เป็นกลาง แต่เห็นศักยภาพในการตรวจสอบการจัดการขยะด้วย AI",
        investor: "ตื่นเต้นกับการลงทุนเทคโนโลยีสูงและศักยภาพในการสร้างรายได้จากข้อมูล",
        youth_rep: "ปกป้องสิทธิความเป็นส่วนตัวทางดิจิทัลอย่างเข้มแข็งและคัดค้านการสอดส่องมหาชน",
      }
    },
    options: {
      A: {
        label: { en: "Full Smart City Adoption", id: "Pengadopsian Penuh Smart City", th: "การใช้นวัตกรรมเมืองอัจฉริยะเต็มรูปแบบ" },
        description: { en: "Deploy citywide AI surveillance and traffic automation in partnership with private tech firms.", id: "Terapkan pengawasan AI dan otomatisasi lalu lintas di seluruh kota berkerjasama dengan firma teknologi swasta.", th: "ติดตั้งการสอดส่องด้วย AI และการจราจรอัตโนมัติทั่วเมืองร่วมกับบริษัทเทคโนโลยี" },
        advantages: { en: "Rapid drop in urban crime, optimized traffic, zero municipal capital cost.", id: "Penurunan cepat kejahatan perkotaan, lalu lintas teroptimasi, tanpa biaya modal daerah.", th: "ลดอาชญากรรมในเมืองอย่างรวดเร็ว การจราจรมีประสิทธิภาพ ไม่มีต้นทุนงบประมาณ" },
        risks: { en: "Severe public trust drop due to privacy loss; secret corporate data commercialization.", id: "Penurunan besar kepercayaan publik karena kehilangan privasi; komersialisasi data korporasi rahasia.", th: "ความไว้วางใจของประชาชนลดลงอย่างรวดเร็วเนื่องจากการสูญเสียความเป็นส่วนตัว" },
        indicators: {
          economicGrowth: 15,
          governmentBudget: 15,
          peopleWelfare: 5,
          publicTrust: -15,
          environmentalQuality: 0,
          transparency: -20,
        },
      },
      B: {
        label: { en: "Regulated Smart Governance", id: "Tata Kelola Cerdas Ber-Regulasi", th: "การบริหารจัดการอัจฉริยะภายใต้กฎหมาย" },
        description: { en: "Limit AI cameras strictly to public transit hubs with an independent citizen privacy oversight board.", id: "Batasi kamera AI hanya di pusat transit publik dengan dewan pengawas privasi warga independen.", th: "จำกัดกล้อง AI เฉพาะในศูนย์ขนส่งสาธารณะพร้อมคณะกรรมการกำกับดูแลความเป็นส่วนตัว" },
        advantages: { en: "Improves public safety while protecting civil liberties and transparency.", id: "Meningkatkan keselamatan publik sambil melindungi kebebasan sipil dan transparansi.", th: "ปรับปรุงความปลอดภัยสาธารณะพร้อมปกป้องเสรีภาพและสร้างความโปร่งใส" },
        risks: { en: "Moderate municipal budget cost for privacy auditing and board oversight.", id: "Biaya anggaran daerah moderat untuk audit privasi dan pengawasan dewan.", th: "งบประมาณปานกลางสำหรับการตรวจสอบความเป็นส่วนตัวและการกำกับดูแล" },
        indicators: {
          economicGrowth: 10,
          governmentBudget: -5,
          peopleWelfare: 10,
          publicTrust: 15,
          environmentalQuality: 0,
          transparency: 15,
        },
      },
      C: {
        label: { en: "Reject Mass Surveillance", id: "Tolak Pengawasan Massal", th: "ปฏิเสธการสอดส่องมหาชน" },
        description: { en: "Decline the tech contract to protect digital privacy and invest in community-based policing.", id: "Tolak kontrak teknologi untuk melindungi privasi digital dan berinvestasi dalam kepolisian berbasis komunitas.", th: "ปฏิเสธสัญญาเทคโนโลยีเพื่อปกป้องความเป็นส่วนตัวทางดิจิทัลและลงทุนในตำรวจชุมชน" },
        advantages: { en: "Protects fundamental civil rights, high transparency, and public trust.", id: "Melindungi hak-hak sipil mendasar, transparansi tinggi, dan kepercayaan publik.", th: "ปกป้องสิทธิขั้นพื้นฐาน ความโปร่งใสสูง และความไว้วางใจของประชาชน" },
        risks: { en: "Slower traffic optimization and missed high-tech corporate investment.", id: "Otomatisasi lalu lintas lebih lambat dan kehilangan investasi korporasi teknologi tinggi.", th: "การเพิ่มประสิทธิภาพการจราจรช้าลง และสูญเสียโอกาสการลงทุนเทคโนโลยี" },
        indicators: {
          economicGrowth: -10,
          governmentBudget: -10,
          peopleWelfare: 5,
          publicTrust: 20,
          environmentalQuality: 0,
          transparency: 10,
        },
      },
    },
    reflection: {
      en: "Technology enhances city efficiency, but true governance requires safeguarding fundamental civil liberties against intrusive surveillance.",
      id: "Teknologi meningkatkan efisiensi kota, tetapi tata kelola sejati memerlukan perlindungan kebebasan sipil mendasar dari pengawasan yang invasif.",
      th: "เทคโนโลยีช่วยเพิ่มประสิทธิภาพของเมือง แต่การบริหารจัดการที่แท้จริงต้องปกป้องเสรีภาพขั้นพื้นฐานจากการสอดส่องที่คุกคาม"
    },
  },
];

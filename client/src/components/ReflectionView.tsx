import React, { useRef, useState } from 'react';
import { LogOut, ChevronDown, ChevronUp, Activity } from 'lucide-react';
import { toPng } from 'html-to-image';
import type { Indicators } from './Dashboard.js';
import { Dashboard } from './Dashboard.js';

interface ReflectionViewProps {
  isFacilitator: boolean;
  roomCode: string;
  facilitatorToken: string;
  indicators: Indicators;
  ps: number;
  gqs: number;
  ss: number;
  fps: number;
  archetypes: string[];
  beneficiaries: string[];
  onRestartSession?: () => void;
  onExit?: () => void;
}

const REFLECTIONS: Record<string, string[]> = {
  en: [
    "Sustainable industrialization requires balancing immediate economic gains against long-term environmental and social safeguards to avoid future \"governance debt.\"",
    "Human capital drives prosperity, but universal access needs a stable fiscal foundation to remain sustainable.",
    "Resource extraction offers quick revenue but carries permanent ecological risk; leadership means weighing finite wealth against the heritage of future generations."
  ],
  id: [
    "Industrialisasi berkelanjutan membutuhkan keseimbangan antara keuntungan ekonomi jangka pendek dengan perlindungan lingkungan dan sosial jangka panjang untuk menghindari \"utang tata kelola\" di masa depan.",
    "Modal manusia mendorong kemakmuran, namun akses universal membutuhkan fondasi fiskal yang stabil agar tetap berkelanjutan.",
    "Eksploitasi sumber daya menawarkan pendapatan cepat namun membawa risiko ekologis permanen; kepemimpinan berarti menimbang kekayaan terbatas dengan warisan generasi mendatang."
  ],
  th: [
    "การอุตสาหกรรมอย่างยั่งยืนต้องสร้างสมดุลระหว่างผลประโยชน์ทางเศรษฐกิจระยะสั้นกับหลักประกันทางสิ่งแวดล้อมและสังคมระยะยาว เพื่อหลีกเลี่ยง \"หนี้ธรรมาภิบาล\" ในอนาคต",
    "ทุนมนุษย์เป็นตัวขับเคลื่อนความมั่งคั่ง แต่การเข้าถึงอย่างทั่วถึงต้องมีรากฐานทางการคลังที่มั่นคงเพื่อให้ยั่งยืน",
    "การสกัดทรัพยากรให้รายได้รวดเร็วแต่มีความเสี่ยงทางนิเวศวิทยาถาวร การผู้นำหมายถึงการชั่งน้ำหนักระหว่างความมั่งคั่งที่มีจำกัดกับมรดกของคนรุ่นหลัง"
  ]
};

const ARCHETYPE_NAMES: Record<string, Record<string, string>> = {
  "Balanced Prosperity City": {
    en: "Balanced Prosperity City",
    id: "Kota Kemakmuran Seimbang",
    th: "เมืองมั่งคั่งสมดุล"
  },
  "Governance Crisis City": {
    en: "Governance Crisis City",
    id: "Kota Krisis Tata Kelola",
    th: "เมืองวิกฤตธรรมาภิบาล"
  },
  "Prosperous but Vulnerable City": {
    en: "Prosperous but Vulnerable City",
    id: "Kota Makmur Namun Rentan",
    th: "เมืองมั่งคั่งแต่เปราะบาง"
  },
  "Economic Powerhouse": {
    en: "Economic Powerhouse",
    id: "Pusat Kekuatan Ekonomi",
    th: "เมืองมหาอำนาจเศรษฐกิจ"
  },
  "Welfare-Oriented City": {
    en: "Welfare-Oriented City",
    id: "Kota Berbasis Kesejahteraan",
    th: "เมืองเน้นสวัสดิการ"
  },
  "Green & Sustainable City": {
    en: "Green & Sustainable City",
    id: "Kota Hijau & Berkelanjutan",
    th: "เมืองเขียวและยั่งยืน"
  },
  "Good Governance City": {
    en: "Good Governance City",
    id: "Kota Tata Kelola Baik",
    th: "เมืองธรรมาภิบาลดี"
  },
  "Environmentally Protected but Economically Stagnant City": {
    en: "Environmentally Protected but Economically Stagnant City",
    id: "Kota Terlindungi Lingkungan Namun Stagnan Ekonomi",
    th: "เมืองอนุรักษ์สิ่งแวดล้อมแต่เศรษฐกิจหยุดชะงัก"
  },
  "Developing City": {
    en: "Developing City",
    id: "Kota Berkembang",
    th: "เมืองกำลังพัฒนา"
  }
};

const ARCHETYPE_PROFILES: Record<string, Record<string, string>> = {
  "Balanced Prosperity City": {
    en: "Your city has achieved a rare equilibrium. Economic growth, citizen welfare, and environmental protection are mutually reinforcing, guided by robust public trust and transparent institutions.",
    id: "Kota Anda telah mencapai keseimbangan yang langka. Pertumbuhan ekonomi, kesejahteraan warga, dan perlindungan lingkungan saling memperkuat, dipandu oleh kepercayaan publik yang kuat dan institusi yang transparan.",
    th: "เมืองของคุณบรรลุดุลยภาพที่หายาก การเติบโตทางเศรษฐกิจ สวัสดิการประชาชน และการปกป้องสิ่งแวดล้อมต่างส่งเสริมซึ่งกันและกัน โดยมีสถาบันที่โปร่งใสและความไว้วางใจของประชาชนชี้นำ"
  },
  "Governance Crisis City": {
    en: "Your city is in a fragile state. Low public trust and transparent processes have crippled policy execution, risking social stagnation and resource depletion.",
    id: "Kota Anda berada dalam kondisi yang rapuh. Rendahnya kepercayaan publik dan proses transparan yang minim melumpuhkan eksekusi kebijakan, mempertaruhkan stagnasi sosial dan terkurasnya sumber daya.",
    th: "เมืองของคุณอยู่ในภาวะเปราะบาง ความไว้วางใจต่ำและขาดกระบวนการที่โปร่งใสทำให้การดำเนินนโยบายเป็นอัมพาต เสี่ยงต่อความหยุดชะงักทางสังคม"
  },
  "Prosperous but Vulnerable City": {
    en: "While the economy thrives, critical weaknesses in governance or environmental safeguards expose the city to sudden social unrest or ecological shocks.",
    id: "Meskipun ekonomi berkembang pesat, kelemahan kritis dalam tata kelola atau perlindungan lingkungan membuat kota rentan terhadap kerusuhan sosial yang tiba-tiba atau guncangan ekologis.",
    th: "แม้เศรษฐกิจจะเติบโต แต่จุดอ่อนด้านธรรมาภิบาลหรือสิ่งแวดล้อมทำให้เมืองเสี่ยงต่อความไม่สงบหรือวิกฤตสิ่งแวดล้อมอย่างฉับพลัน"
  },
  "Economic Powerhouse": {
    en: "High economic indicators drive infrastructure and enterprise. However, care must be taken to ensure that citizen welfare and environmental health are not sacrificed for growth.",
    id: "Indikator ekonomi yang tinggi mendorong infrastruktur dan perusahaan. Namun, perhatian harus diberikan untuk memastikan bahwa kesejahteraan warga dan kesehatan lingkungan tidak dikorbankan demi pertumbuhan.",
    th: "ตัวชี้วัดทางเศรษฐกิจสูงเป็นตัวขับเคลื่อนโครงสร้างพื้นฐาน แต่ต้องระวังไม่ให้แลกด้วยสวัสดิการของประชาชนหรือสุขภาพของสิ่งแวดล้อม"
  },
  "Welfare-Oriented City": {
    en: "The administration prioritizes the health, education, and direct support of its citizens, laying down a strong social foundation for long-term development.",
    id: "Pemerintah memprioritaskan kesehatan, pendidikan, dan dukungan langsung bagi warganya, meletakkan fondasi sosial yang kuat untuk pembangunan jangka panjang.",
    th: "ผู้บริหารเมืองเน้นสุขภาพ การศึกษา และการสนับสนุนประชาชนโดยตรง วางรากฐานทางสังคมที่เข้มแข็งเพื่อการพัฒนาระยะยาว"
  },
  "Green & Sustainable City": {
    en: "Ecological preservation is the cornerstone of all policies. The city enjoys pristine environments, though future funding must be secured to maintain development.",
    id: "Pelestarian ekologis adalah batu penjuru dari semua kebijakan. Kota ini menikmati lingkungan yang asri, meskipun pendanaan masa depan harus diamankan untuk mempertahankan pembangunan.",
    th: "การอนุรักษ์ระบบนิเวศเป็นหัวใจหลักของนโยบาย เมืองมีสิ่งแวดล้อมบริสุทธิ์ แต่ต้องหางบประมาณในอนาคตเพื่อการพัฒนาต่อเนื่อง"
  },
  "Good Governance City": {
    en: "Exceptional public trust and absolute transparency ensure high civic participation and effective implementation of regulations.",
    id: "Kepercayaan publik yang luar biasa dan transparansi mutlak menjamin partisipasi sipil yang tinggi dan penerapan regulasi yang efektif.",
    th: "ความไว้วางใจของประชาชนที่โดดเด่นและความโปร่งใสสัมบูรณ์สร้างการมีส่วนร่วมของประชาชนอย่างสูงและการบังคับใช้นโยบายอย่างมีประสิทธิภาพ"
  },
  "Environmentally Protected but Economically Stagnant City": {
    en: "Natural reserves are successfully protected, but low economic growth and investment limit opportunities for job creation and citizen wealth generation.",
    id: "Cagar alam berhasil dilindungi, namun pertumbuhan ekonomi dan investasi yang rendah membatasi peluang penciptaan lapangan kerja dan peningkatan kekayaan warga.",
    th: "การปกป้องธรรมชาติประสบความสำเร็จ แต่การเติบโตทางเศรษฐกิจและการลงทุนต่ำจำกัดโอกาสในการสร้างงานและสร้างความมั่งคั่งให้ประชาชน"
  },
  "Developing City": {
    en: "Your city is actively growing and adapting. While no single policy direction dominated, foundational progress is underway across public sectors.",
    id: "Kota Anda sedang berkembang dan beradaptasi secara aktif. Meskipun tidak ada satu arah kebijakan yang mendominasi, kemajuan mendasar sedang berlangsung di berbagai sektor publik.",
    th: "เมืองของคุณกำลังเติบโตและปรับตัวอย่างมีชีวิตชีวา แม้จะไม่มีทิศทางนโยบายใดโดดเด่นเป็นพิเศษ แต่ความก้าวหน้าขั้นพื้นฐานกำลังดำเนินไปในภาคส่วนต่างๆ"
  }
};

interface ArchetypeDetail {
  strengths: Record<string, string>;
  risks: Record<string, string>;
  lesson: Record<string, string>;
}

const ARCHETYPE_EXTENDED: Record<string, ArchetypeDetail> = {
  "Balanced Prosperity City": {
    strengths: {
      en: "High public trust, stable economy, and healthy ecosystems.",
      id: "Kepercayaan publik yang tinggi, ekonomi yang stabil, dan ekosistem yang sehat.",
      th: "ความไว้วางใจของประชาชนสูง เศรษฐกิจมั่นคง และระบบนิเวศสมบูรณ์"
    },
    risks: {
      en: "Complacency and slow adaptation to global changes.",
      id: "Kepuasan diri dan lambatnya adaptasi terhadap perubahan global.",
      th: "ความชะล่าใจและการปรับตัวช้าต่อการเปลี่ยนแปลงของโลก"
    },
    lesson: {
      en: "Long-term prosperity requires equal investment in economic, social, and environmental pillars.",
      id: "Kemakmuran jangka panjang membutuhkan investasi yang setara dalam pilar ekonomi, sosial, dan lingkungan.",
      th: "ความมั่งคั่งระยะยาวต้องลงทุนอย่างเท่าเทียมในเสาหลักเศรษฐกิจ สังคม และสิ่งแวดล้อม"
    }
  },
  "Governance Crisis City": {
    strengths: {
      en: "Hard lessons learned from institutional collapse.",
      id: "Pelajaran berharga yang didapat dari keruntuhan institusional.",
      th: "บทเรียนราคาแพงจากการล่มสลายของสถาบัน"
    },
    risks: {
      en: "Bankruptcy, civil unrest, environmental degradation.",
      id: "Kebangkrutan, kerusuhan sipil, kerusakan lingkungan.",
      th: "การล้มละลาย ความไม่สงบในสังคม ความเสื่อมโทรมของสิ่งแวดล้อม"
    },
    lesson: {
      en: "Ignoring governance, social equity, or ecological limits leads to cascading systemic failure.",
      id: "Mengabaikan tata kelola, keadilan sosial, atau batas ekologis menyebabkan kegagalan sistemik yang beruntun.",
      th: "การละเลยธรรมาภิบาล ความเป็นธรรมในสังคม หรือขีดจำกัดทางนิเวศนำไปสู่ความล้มเหลวเชิงระบบ"
    }
  },
  "Prosperous but Vulnerable City": {
    strengths: {
      en: "Strong financial reserves and infrastructure.",
      id: "Cadangan keuangan dan infrastruktur yang kuat.",
      th: "ทุนสำรองทางการเงินและโครงสร้างพื้นฐานที่เข้มแข็ง"
    },
    risks: {
      en: "Sudden ecological collapse or intense social polarization.",
      id: "Keruntuhan ekologis yang tiba-tiba atau polarisasi sosial yang intens.",
      th: "การล่มสลายทางนิเวศอย่างฉับพลัน หรือการแบ่งแยกทางสังคมอย่างรุนแรง"
    },
    lesson: {
      en: "Financial wealth cannot fully compensate for fragile social or environmental foundations.",
      id: "Kekayaan finansial tidak dapat sepenuhnya mengimbangi fondasi sosial atau lingkungan yang rapuh.",
      th: "ความมั่งคั่งทางการเงินไม่สามารถทดแทนฐานทางสังคมหรือสิ่งแวดล้อมที่เปราะบางได้"
    }
  },
  "Economic Powerhouse": {
    strengths: {
      en: "Job creation, innovation hubs, and massive public revenue.",
      id: "Penciptaan lapangan kerja, pusat inovasi, dan pendapatan publik yang masif.",
      th: "การสร้างงาน ศูนย์กลางนวัตกรรม และรายได้รัฐมหาศาล"
    },
    risks: {
      en: "Overexploitation of resources and rising wealth inequality.",
      id: "Eksploitasi sumber daya yang berlebihan dan meningkatnya kesenjangan kekayaan.",
      th: "การใช้ทรัพยากรเกินขนาดและความเหลื่อมล้ำทางมั่งคั่งที่เพิ่มขึ้น"
    },
    lesson: {
      en: "Unchecked growth without social safeguards can hollow out community resilience.",
      id: "Pertumbuhan yang tidak terkendali tanpa perlindungan sosial dapat mengikis ketahanan komunitas.",
      th: "การเติบโตที่ไม่ได้รับการควบคุมโดยไม่มีสิ่งคุ้มครองทางสังคมสามารถทำลายความเข้มแข็งของชุมชน"
    }
  },
  "Welfare-Oriented City": {
    strengths: {
      en: "High quality of life, low inequality, and strong social cohesion.",
      id: "Kualitas hidup yang tinggi, kesenjangan yang rendah, dan kohesi sosial yang kuat.",
      th: "คุณภาพชีวิตสูง ความเหลื่อมล้ำต่ำ และความสามัคคีในสังคมเข้มแข็ง"
    },
    risks: {
      en: "Fiscal strain and potential lack of economic competitiveness.",
      id: "Ketegangan fiskal dan potensi kurangnya daya saing ekonomi.",
      th: "ภาระทางการคลังและการขาดขีดความสามารถในการแข่งขันทางเศรษฐกิจ"
    },
    lesson: {
      en: "Social investments create a highly productive and resilient population.",
      id: "Investasi sosial menciptakan populasi yang sangat produktif dan tangguh.",
      th: "การลงทุนทางสังคมสร้างประชากรที่มีผลิตภาพสูงและมีความยืดหยุ่น"
    }
  },
  "Green & Sustainable City": {
    strengths: {
      en: "Pristine ecosystems and high resource efficiency.",
      id: "Ekosistem yang asri dan efisiensi sumber daya yang tinggi.",
      th: "ระบบนิเวศบริสุทธิ์และการใช้ทรัพยากรอย่างมีประสิทธิภาพสูง"
    },
    risks: {
      en: "High cost of green transition and slower short-term growth.",
      id: "Biaya transisi hijau yang tinggi dan pertumbuhan jangka pendek yang lebih lambat.",
      th: "ต้นทุนการเปลี่ยนผ่านสู่ความเขียวสูงและการเติบโตระยะสั้นชะลอตัว"
    },
    lesson: {
      en: "Securing the environment protects the city against future external supply shocks.",
      id: "Mengamankan lingkungan melindungi kota dari guncangan pasokan eksternal di masa depan.",
      th: "การคุ้มครองสิ่งแวดล้อมช่วยปกป้องเมืองจากวิกฤตอุปทานภายนอกในอนาคต"
    }
  },
  "Good Governance City": {
    strengths: {
      en: "Clean governance, zero corruption, and active public participation.",
      id: "Tata kelola bersih, bebas korupsi, dan partisipasi publik yang aktif.",
      th: "ธรรมาภิบาลโปร่งใส ปลอดการทุจริต และการมีส่วนร่วมของประชาชนอย่างตื่นตัว"
    },
    risks: {
      en: "Bureaucratic deadlock and gridlock over contested policies.",
      id: "Kebuntuan birokrasi dan hambatan atas kebijakan yang diperdebatkan.",
      th: "ความล่าช้าทางระบบราชการและการหยุดชะงักของนโยบายที่มีข้อขัดแย้ง"
    },
    lesson: {
      en: "Trust is the ultimate currency of policy success and community stability.",
      id: "Kepercayaan adalah mata uang utama bagi keberhasilan kebijakan dan stabilitas komunitas.",
      th: "ความไว้วางใจคือสกุลเงินสูงสุดของความสำเร็จในการดำเนินนโยบายและความมั่นคงของชุมชน"
    }
  },
  "Environmentally Protected but Economically Stagnant City": {
    strengths: {
      en: "Excellent environmental conservation and low carbon footprint.",
      id: "Konservasi lingkungan yang sangat baik dan jejak karbon yang rendah.",
      th: "การอนุรักษ์สิ่งแวดล้อมยอดเยี่ยมและปล่อยคาร์บอนต่ำ"
    },
    risks: {
      en: "Youth brain drain and lack of public funds to maintain services.",
      id: "Migrasi intelektual muda keluar dan kurangnya dana publik untuk layanan umum.",
      th: "เยาวชนและสมองไหลออกนอกพื้นที่ ขาดแคลนงบประมาณสาธารณะเพื่อรักษาบริการ"
    },
    lesson: {
      en: "Environmental protection must align with economic opportunities to remain viable.",
      id: "Perlindungan lingkungan harus sejalan dengan peluang ekonomi agar tetap layak dipertahankan.",
      th: "การปกป้องสิ่งแวดล้อมต้องสอดคล้องกับโอกาสทางเศรษฐกิจเพื่อให้ยั่งยืนจริง"
    }
  },
  "Developing City": {
    strengths: {
      en: "Flexibility and room for multi-sectoral growth.",
      id: "Fleksibilitas dan ruang untuk pertumbuhan lintas sektor.",
      th: "ความยืดหยุ่นและพื้นที่สำหรับการเติบโตในหลายภาคส่วน"
    },
    risks: {
      en: "Unclear strategic focus if priorities remain divided.",
      id: "Fokus strategis yang kurang jelas jika prioritas tetap terbagi.",
      th: "ขาดจุดเน้นทางยุทธศาสตร์ที่ชัดเจนหากลำดับความสำคัญยังคงแตกแยก"
    },
    lesson: {
      en: "Establishing clear long-term priorities is essential to move from basic growth to sustainable prosperity.",
      id: "Menetapkan prioritas jangka panjang yang jelas sangat penting untuk beralih dari pertumbuhan dasar ke kemakmuran berkelanjutan.",
      th: "การกำหนดลำดับความสำคัญระยะยาวที่ชัดเจนเป็นสิ่งจำเป็นในการเปลี่ยนจากการเติบโตขั้นพื้นฐานไปสู่ความมั่งคั่งที่ยั่งยืน"
    }
  }
};

export const ReflectionView: React.FC<ReflectionViewProps> = ({
  isFacilitator,
  roomCode,
  facilitatorToken,
  indicators,
  ps: _ps,
  gqs,
  ss,
  fps,
  archetypes,
  beneficiaries,
  onRestartSession,
  onExit
}) => {
  const [exporting, setExporting] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [showReflections, setShowReflections] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const formatRoleName = (role: string) => {
    const roleMap: Record<string, Record<string, string>> = {
      id: {
        mayor: 'Walikota',
        journalist: 'Jurnalis',
        community_rep: 'Perwakilan Warga',
        business_rep: 'Perwakilan Bisnis',
        social_welfare: 'Kesejahteraan Sosial',
        environmental: 'Pemerhati Lingkungan',
        investor: 'Investor Utama',
        youth_rep: 'Perwakilan Pemuda',
      },
      en: {
        mayor: 'Mayor',
        journalist: 'Journalist',
        community_rep: 'Community Rep',
        business_rep: 'Business Rep',
        social_welfare: 'Social Welfare',
        environmental: 'Environmentalist',
        investor: 'Lead Investor',
        youth_rep: 'Youth Rep',
      },
      th: {
        mayor: 'นายกเทศมนตรี',
        journalist: 'ผู้สื่อข่าว',
        community_rep: 'ตัวแทนชุมชน',
        business_rep: 'ตัวแทนภาคธุรกิจ',
        social_welfare: 'สวัสดิการสังคม',
        environmental: 'นักอนุรักษ์สิ่งแวดล้อม',
        investor: 'นักลงทุนหลัก',
        youth_rep: 'ตัวแทนเยาวชน',
      }
    };
    const lang = localStorage.getItem('tpa_lang') || 'en';
    return roleMap[lang]?.[role] || role.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const baseUrl = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3000' : window.location.origin);
      const url = `${baseUrl}/api/v1/rooms/${roomCode}/export`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'x-facilitator-token': facilitatorToken
        }
      });

      if (!response.ok) {
        throw new Error('Failed to generate export');
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      
      const dateStr = new Date().toISOString().split('T')[0];
      link.setAttribute('download', `TPA_Results_${roomCode}_${dateStr}.xlsx`);
      
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error(error);
      alert('Error downloading spreadsheet. Please ensure the backend server is reachable.');
    } finally {
      setExporting(false);
    }
  };

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    
    setSharing(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        backgroundColor: '#0D2B40',
        style: {
          borderRadius: '12px'
        }
      });
      
      const link = document.createElement('a');
      link.download = `TPA_Result_${roomCode}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('oops, something went wrong!', err);
      alert('Failed to generate image. Please try again.');
    } finally {
      setSharing(false);
    }
  };

  const lang = localStorage.getItem('tpa_lang') || 'en';
  const displayArchetypes = (archetypes && archetypes.length > 0) ? archetypes : ["Developing City"];

  return (
    <div className="relative min-h-screen w-full bg-[#0D2B40] flex flex-col justify-between items-center overflow-hidden">
      
      {/* 100% Full-Width Top Header Banner */}
      <div className="w-full bg-cyan-700 flex justify-center shrink-0 z-20">
        <div className="w-full max-w-[480px] sm:max-w-[520px] h-24 px-6 flex items-center justify-between">
          <div className="flex flex-col text-left justify-center min-w-0 pr-4">
            <h1 className="text-white text-xl sm:text-2xl font-extrabold font-['Nunito'] leading-tight truncate">
              {lang === 'id' ? 'Majelis Rakyat' : lang === 'th' ? 'สภาประชาชน' : "The People's Assembly"}
            </h1>
            <span className="text-white text-sm font-semibold font-['Nunito'] leading-6 flex items-center gap-1.5 flex-wrap">
              <span>{lang === 'id' ? 'Simulasi Selesai' : lang === 'th' ? 'การจำลองเสร็จสิ้น' : 'Simulation Complete'}</span>
              {isFacilitator && roomCode && (
                <>
                  <span className="opacity-60">•</span>
                  <span>{roomCode}</span>
                </>
              )}
            </span>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setShowStatsModal(true)}
              className="w-12 h-12 bg-cyan-700 rounded-2xl shadow-[0px_2px_0px_0px_rgba(0,0,0,0.20)] border-2 border-black/20 flex items-center justify-center text-white cursor-pointer hover:opacity-90 active:scale-95 transition-all shrink-0"
              title="View Stats"
            >
              <Activity className="w-5 h-5 text-white" />
            </button>
            {onExit && (
              <button
                type="button"
                onClick={onExit}
                className="w-12 h-12 bg-cyan-700 rounded-2xl shadow-[0px_2px_0px_0px_rgba(0,0,0,0.20)] border-2 border-black/20 flex items-center justify-center text-white cursor-pointer hover:opacity-90 active:scale-95 transition-all shrink-0"
                title="Exit"
              >
                <LogOut className="w-5 h-5 text-white" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="w-full max-w-[384px] sm:max-w-[420px] flex-grow flex flex-col items-center justify-start mx-auto px-4 py-6 space-y-6 overflow-y-auto no-scrollbar z-10">
          
          {/* Screen Title */}
          <div className="w-full text-center shrink-0">
            <h2 className="text-white text-xl font-extrabold font-['Nunito'] leading-9">
              {lang === 'id' ? 'Refleksi Majelis' : lang === 'th' ? 'การถอดบทเรียนสภา' : 'Assembly Reflection'}
            </h2>
          </div>

          {/* Share Card Container */}
          <div 
            ref={cardRef}
            className="w-full overflow-hidden rounded-xl shrink-0"
          >
            {/* Card Header - Cyan 700 */}
            <div className="w-full h-14 bg-cyan-700 rounded-t-xl border-t-2 border-x-2 border-cyan-800 px-6 flex items-center justify-center">
              <span className="text-white text-xl font-extrabold font-['Nunito'] uppercase tracking-wider text-center">
                {lang === 'id' ? 'MAJELIS RAKYAT' : lang === 'th' ? 'สภาประชาชน' : "THE PEOPLE'S ASSEMBLY"}
              </span>
            </div>

            {/* Card Body - Dark Gray 800 */}
            <div className="w-full bg-gray-800 rounded-b-xl border-b-2 border-x-2 border-zinc-700 p-6 flex flex-col items-center space-y-4 text-center">
              {/* Archetype Title */}
              <div className="flex flex-col items-center space-y-1 text-center">
                <span className="text-white text-sm font-extrabold font-['Nunito'] tracking-wider uppercase">
                  {lang === 'id' ? 'ARKETIPE KOTA' : lang === 'th' ? 'ต้นแบบเมือง' : 'CITY ARCHETYPE'}
                </span>
                <span className="text-white text-xl sm:text-2xl font-extrabold font-['Nunito'] leading-tight">
                  {ARCHETYPE_NAMES[displayArchetypes[0]]?.[lang] || displayArchetypes[0]}
                </span>
              </div>

              {/* 3 Metric Badges Row */}
              <div className="grid grid-cols-3 gap-3 w-full pt-1">
                {/* Prosperity */}
                <div className="w-full h-20 bg-red-500 rounded-xl border-2 border-orange-700 flex flex-col items-center justify-center text-white">
                  <span className="text-white text-2xl font-extrabold font-['Nunito'] leading-none">{fps.toFixed(1)}</span>
                  <span className="text-white text-[10px] font-semibold font-['Nunito'] leading-6 mt-0.5">{lang === 'id' ? 'Kemakmuran' : lang === 'th' ? 'ความมั่งคั่ง' : 'Prosperity'}</span>
                </div>
                {/* Governance */}
                <div className="w-full h-20 bg-red-500 rounded-xl border-2 border-orange-700 flex flex-col items-center justify-center text-white">
                  <span className="text-white text-2xl font-extrabold font-['Nunito'] leading-none">{gqs.toFixed(1)}</span>
                  <span className="text-white text-[10px] font-semibold font-['Nunito'] leading-6 mt-0.5">{lang === 'id' ? 'Tata Kelola' : lang === 'th' ? 'ธรรมาภิบาล' : 'Governance'}</span>
                </div>
                {/* Sustainability */}
                <div className="w-full h-20 bg-red-500 rounded-xl border-2 border-orange-700 flex flex-col items-center justify-center text-white">
                  <span className="text-white text-2xl font-extrabold font-['Nunito'] leading-none">{ss.toFixed(1)}</span>
                  <span className="text-white text-[10px] font-semibold font-['Nunito'] leading-6 mt-0.5">{lang === 'id' ? 'Keberlanjutan' : lang === 'th' ? 'ความยั่งยืน' : 'Sustainability'}</span>
                </div>
              </div>

              {/* Footer */}
              <div className="text-zinc-400 text-xs font-semibold font-['Nunito'] text-center pt-2">
                {lang === 'id' ? 'Dibuat pada ' : lang === 'th' ? 'สร้างเมื่อ ' : 'Generated '}{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} | The People's Assembly
              </div>
            </div>
          </div>

          {/* Download Card Button */}
          <button
            type="button"
            onClick={handleDownloadImage}
            disabled={sharing}
            data-button="Outline-Secondary"
            className="w-full h-12 p-2.5 bg-[#5CACE2] rounded-md shadow-[0px_2px_0px_0px_rgba(36,112,162,1.00)] outline outline-2 outline-offset-[-2px] outline-cyan-700 text-white text-sm font-extrabold font-['Nunito'] uppercase tracking-wide cursor-pointer hover:opacity-90 active:translate-y-0.5 transition-all flex justify-center items-center shrink-0"
          >
            {sharing ? (lang === 'id' ? 'Membuat...' : lang === 'th' ? 'กำลังสร้าง...' : 'Generating...') : (lang === 'id' ? 'unduh kartu hasil' : lang === 'th' ? 'ดาวน์โหลดการ์ดผลลัพธ์' : 'download result card')}
          </button>

          {/* Detailed City Profile Cards */}
          {displayArchetypes.length > 0 && (
            <div className="w-full space-y-3 shrink-0 text-left">
              <h3 className="text-white text-xl font-extrabold font-['Nunito'] leading-9">
                {lang === 'id' ? 'Profil Kota Terperinci' : lang === 'th' ? 'โปรไฟล์เมืองโดยละเอียด' : 'Detailed City Profile'}
              </h3>
              
              <div className="w-full space-y-4">
                {displayArchetypes.map((arch, index) => {
                  const ext = ARCHETYPE_EXTENDED[arch];
                  const profile = ARCHETYPE_PROFILES[arch];
                  if (!ext || !profile) return null;
                  return (
                    <div key={arch} className="w-full bg-gray-800 rounded-xl outline outline-2 outline-offset-[-2px] outline-zinc-700 p-5 flex flex-col gap-4 text-left">
                      {/* Header with Title and index number */}
                      <div className="flex items-center gap-4 w-full">
                        <div className="w-12 h-12 bg-red-500 rounded-2xl shadow-[0px_2px_0px_0px_rgba(0,0,0,0.20)] border-2 border-black/20 flex items-center justify-center text-white text-2xl font-extrabold font-['Nunito'] shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex flex-col gap-1 pr-2 min-w-0">
                          <span className="text-white text-base font-extrabold font-['Nunito'] leading-tight">
                            {ARCHETYPE_NAMES[arch]?.[lang] || arch}
                          </span>
                          <p className="text-zinc-400 text-xs font-semibold font-['Nunito'] leading-relaxed">
                            {profile[lang] || profile['en']}
                          </p>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="h-0.5 bg-zinc-700 -mx-5" />

                      {/* Strengths / Advantages */}
                      <div className="flex flex-col gap-1">
                        <span className="text-white text-xs font-extrabold font-['Nunito'] tracking-wide leading-4">
                          {lang === 'id' ? 'Kekuatan Utama' : lang === 'th' ? 'จุดแข็งหลัก' : 'Advantages'}
                        </span>
                        <p className="text-zinc-300 text-xs font-semibold font-['Nunito'] leading-relaxed pl-0.5">
                          {ext.strengths[lang] || ext.strengths['en']}
                        </p>
                      </div>

                      {/* Risks */}
                      <div className="flex flex-col gap-1">
                        <span className="text-white text-xs font-extrabold font-['Nunito'] tracking-wide leading-4">
                          {lang === 'id' ? 'Risiko Utama' : lang === 'th' ? 'ความเสี่ยงหลัก' : 'Risks'}
                        </span>
                        <p className="text-zinc-300 text-xs font-semibold font-['Nunito'] leading-relaxed pl-0.5">
                          {ext.risks[lang] || ext.risks['en']}
                        </p>
                      </div>

                      {/* Educational Lesson */}
                      <div className="flex flex-col gap-1">
                        <span className="text-white text-xs font-extrabold font-['Nunito'] tracking-wide leading-4">
                          {lang === 'id' ? 'Pelajaran Edukatif' : lang === 'th' ? 'บทเรียนสำคัญ' : 'Educational Lesson'}
                        </span>
                        <p className="text-zinc-300 text-xs font-semibold font-['Inter'] leading-relaxed pl-0.5">
                          {ext.lesson[lang] || ext.lesson['en']}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Individual Stakeholder Impact Section */}
          <div className="w-full space-y-4 shrink-0 text-left">
            <h3 className="text-white text-xl font-extrabold font-['Nunito'] leading-9">
              {lang === 'id' ? 'Dampak Pemangku Kepentingan Individu' : lang === 'th' ? 'ผลกระทบต่อผู้มีส่วนได้ส่วนเสียรายบุคคล' : 'Individual Stakeholder Impact'}
            </h3>
            <p className="text-white text-base font-semibold font-['Nunito'] leading-6 w-full">
              {lang === 'id' 
                ? 'Meskipun Dasbor Kota menunjukkan hasil agregat, pemangku kepentingan individu memiliki ambang batas khusus untuk sukses. Peran-peran ini memenuhi tujuan mereka.'
                : lang === 'th'
                ? 'แม้ว่าแดชบอร์ดเมืองจะแสดงผลลัพธ์รวม แต่ผู้มีส่วนได้ส่วนเสียแต่ละฝ่ายมีเกณฑ์ความสำเร็จเฉพาะ บทบาทเหล่านี้บรรลุวัตถุประสงค์ของตน'
                : 'While the city Dashboard shows the aggregate outcome, individual stakeholders have specific thresholds for success. These roles met their objectives.'}
            </p>

            {/* Beneficiaries Content Box */}
            <div className="w-full min-h-12 bg-gray-800 rounded-md outline outline-2 outline-offset-[-2px] outline-zinc-700 overflow-hidden flex flex-wrap items-center justify-start p-4 gap-2 mt-6">
              {beneficiaries.length === 0 ? (
                <div className="text-zinc-400 text-sm font-medium font-['Inter'] leading-6">
                  {lang === 'id' ? 'Tidak ada peran yang memenuhi ambang batas keuntungan mereka.' : lang === 'th' ? 'ไม่มีบทบาทใดบรรลุเกณฑ์ผลประโยชน์ของตน' : 'No roles met their benefit thresholds.'}
                </div>
              ) : (
                beneficiaries.map((role) => (
                  <span 
                    key={role}
                    className="px-3 py-1.5 bg-[#5CACE2]/20 text-[#5CACE2] text-xs font-extrabold rounded-lg border border-[#5CACE2]/30 uppercase font-['Nunito']"
                  >
                    {formatRoleName(role)}
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Core Policy Reflections Collapsible */}
          <div className="w-full bg-gray-800 rounded-md outline outline-2 outline-offset-[-2px] outline-zinc-700 overflow-hidden flex flex-col shrink-0 text-left">
            <button 
              type="button"
              onClick={() => setShowReflections(!showReflections)}
              className="w-full h-12 bg-gray-800 hover:bg-zinc-800 flex items-center justify-between px-5 cursor-pointer text-white text-sm font-medium font-['Inter'] leading-6 select-none"
            >
              <span>{lang === 'id' ? 'Refleksi Kebijakan Utama' : lang === 'th' ? 'ข้อคิดจากนโยบายหลัก' : 'Core Policy Reflections'}</span>
              {showReflections ? (
                <ChevronUp className="w-5 h-5 text-zinc-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-zinc-400" />
              )}
            </button>
            
            {showReflections && (
              <div className="px-5 pb-4 bg-gray-800/90 space-y-4 pt-2 text-left border-t border-zinc-700">
                {(REFLECTIONS[lang] || REFLECTIONS['en']).map((quote, idx) => (
                  <div key={idx} className="border-b border-zinc-700/60 last:border-0 pb-3">
                    <span className="font-extrabold text-[#5CACE2] text-xs uppercase tracking-wider block mb-1 font-['Nunito']">
                      {lang === 'id' ? `Refleksi Kebijakan ${idx + 1}` : lang === 'th' ? `ข้อคิดจากนโยบาย ${idx + 1}` : `Policy Reflection ${idx + 1}`}
                    </span>
                    <p className="text-zinc-300 text-xs font-semibold leading-relaxed font-['Nunito']">
                      "{quote}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Facilitator / Session Reporting Section */}
          {isFacilitator && (
            <div className="w-full space-y-4 shrink-0 text-center pt-6 pb-2">
              <h3 className="text-white text-xl font-extrabold font-['Nunito'] leading-9">
                {lang === 'id' ? 'Pelaporan Sesi' : lang === 'th' ? 'การรายงานผลเซสชัน' : 'Session Reporting'}
              </h3>
              <p className="text-white text-base font-semibold font-['Nunito'] leading-6 w-full mb-2">
                {lang === 'id'
                  ? 'Unduh data sesi lengkap (keputusan pemain, hasil pemungutan suara, dan riwayat indikator) sebagai Spreadsheet Excel untuk analisis dan pelaporan offline.'
                  : lang === 'th'
                  ? 'ดาวน์โหลดข้อมูลเซสชันอย่างละเอียด (การตัดสินใจของผู้เล่น สรุปผลการลงมติ และประวัติชี้วัด) เป็นสเปรดชีต Excel สำหรับการวิเคราะห์แบบออฟไลน์'
                  : 'Download the comprehensive session data (player decisions, vote tallies, and indicator history) as an Excel Spreadsheet for offline analysis and reporting.'}
              </p>

              {/* Download Spreadsheet Button */}
              <button
                type="button"
                onClick={handleExport}
                disabled={exporting}
                data-button="Primary"
                className="w-full h-12 p-2.5 bg-[#5CACE2] rounded-md shadow-[0px_4px_0px_0px_rgba(36,112,162,1.00)] text-white text-sm font-extrabold font-['Nunito'] uppercase tracking-wide hover:opacity-90 active:translate-y-0.5 transition-all cursor-pointer flex justify-center items-center mt-6"
              >
                {exporting ? (lang === 'id' ? 'Membuat...' : lang === 'th' ? 'กำลังสร้าง...' : 'Generating...') : (lang === 'id' ? 'unduh spreadsheet' : lang === 'th' ? 'ดาวน์โหลดสเปรดชีต' : 'download spreadsheet')}
              </button>

              {/* Restart Session / New Assembly Button */}
              {onRestartSession && (
                <button
                  type="button"
                  onClick={onRestartSession}
                  data-button="Outline-Secondary"
                  className="w-full h-12 p-2.5 bg-cyan-700 rounded-md shadow-[0px_2px_0px_0px_rgba(29,90,130,1.00)] outline outline-2 outline-offset-[-2px] outline-cyan-800 text-white text-sm font-extrabold font-['Nunito'] uppercase tracking-wide hover:opacity-90 active:translate-y-0.5 transition-all cursor-pointer flex justify-center items-center mt-3"
                >
                  {lang === 'id' ? 'majelis baru' : lang === 'th' ? 'เริ่มสภาใหม่' : 'new assembly'}
                </button>
              )}
            </div>
          )}

          <div className="h-4 shrink-0" />
        </div>

      {/* Stats Modal Overlay */}
      {showStatsModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm animate-fade-in flex justify-center items-start sm:items-center p-4 pt-6 sm:pt-4 overflow-y-auto">
          <div className="w-[410px] max-h-[90%] bg-neutral-900 rounded-3xl p-6 shadow-2xl overflow-y-auto border-2 border-neutral-700 flex flex-col justify-between text-white">
            <div>
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
                <span className="text-lg font-extrabold font-['Nunito'] text-white uppercase tracking-wider">
                  City Indicators
                </span>
                <button
                  type="button"
                  onClick={() => setShowStatsModal(false)}
                  className="text-sm font-bold text-zinc-400 hover:text-white cursor-pointer"
                >
                  Close
                </button>
              </div>
              {indicators ? (
                <Dashboard indicators={indicators} flat />
              ) : (
                <div className="text-center py-6 text-zinc-400 font-semibold font-['Nunito']">No data available</div>
              )}
            </div>
            <button
              type="button"
              onClick={() => setShowStatsModal(false)}
              className="w-full mt-6 bg-[#5CACE2] hover:opacity-90 text-white py-3 rounded-2xl text-sm font-extrabold font-['Nunito'] uppercase tracking-wide transition-all shadow-md cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

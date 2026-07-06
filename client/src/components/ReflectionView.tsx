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

const REFLECTIONS = [
  "Sustainable industrialization requires balancing immediate economic gains against long-term environmental and social safeguards to avoid future \"governance debt.\"",
  "Human capital drives prosperity, but universal access needs a stable fiscal foundation to remain sustainable.",
  "Resource extraction offers quick revenue but carries permanent ecological risk; leadership means weighing finite wealth against the heritage of future generations."
];

const ARCHETYPE_PROFILES: Record<string, Record<string, string>> = {
  "Balanced Prosperity City": {
    en: "Your city has achieved a rare equilibrium. Economic growth, citizen welfare, and environmental protection are mutually reinforcing, guided by robust public trust and transparent institutions.",
    id: "Kota Anda telah mencapai keseimbangan yang langka. Pertumbuhan ekonomi, kesejahteraan warga, dan perlindungan lingkungan saling memperkuat, dipandu oleh kepercayaan publik yang kuat dan institusi yang transparan."
  },
  "Governance Crisis City": {
    en: "Your city is in a fragile state. Low public trust and transparent processes have crippled policy execution, risking social stagnation and resource depletion.",
    id: "Kota Anda berada dalam kondisi yang rapuh. Rendahnya kepercayaan publik dan proses transparan yang minim melumpuhkan eksekusi kebijakan, mempertaruhkan stagnasi sosial dan terkurasnya sumber daya."
  },
  "Prosperous but Vulnerable City": {
    en: "While the economy thrives, critical weaknesses in governance or environmental safeguards expose the city to sudden social unrest or ecological shocks.",
    id: "Meskipun ekonomi berkembang pesat, kelemahan kritis dalam tata kelola atau perlindungan lingkungan membuat kota rentan terhadap kerusuhan sosial yang tiba-tiba atau guncangan ekologis."
  },
  "Economic Powerhouse": {
    en: "High economic indicators drive infrastructure and enterprise. However, care must be taken to ensure that citizen welfare and environmental health are not sacrificed for growth.",
    id: "Indikator ekonomi yang tinggi mendorong infrastruktur dan perusahaan. Namun, perhatian harus diberikan untuk memastikan bahwa kesejahteraan warga dan kesehatan lingkungan tidak dikorbankan demi pertumbuhan."
  },
  "Welfare-Oriented City": {
    en: "The administration prioritizes the health, education, and direct support of its citizens, laying down a strong social foundation for long-term development.",
    id: "Pemerintah memprioritaskan kesehatan, pendidikan, dan dukungan langsung bagi warganya, meletakkan fondasi sosial yang kuat untuk pembangunan jangka panjang."
  },
  "Green & Sustainable City": {
    en: "Ecological preservation is the cornerstone of all policies. The city enjoys pristine environments, though future funding must be secured to maintain development.",
    id: "Pelestarian ekologis adalah batu penjuru dari semua kebijakan. Kota ini menikmati lingkungan yang asri, meskipun pendanaan masa depan harus diamankan untuk mempertahankan pembangunan."
  },
  "Good Governance City": {
    en: "Exceptional public trust and absolute transparency ensure high civic participation and effective implementation of regulations.",
    id: "Kepercayaan publik yang luar biasa dan transparansi mutlak menjamin partisipasi sipil yang tinggi dan penerapan regulasi yang efektif."
  },
  "Environmentally Protected but Economically Stagnant City": {
    en: "Natural reserves are successfully protected, but low economic growth and investment limit opportunities for job creation and citizen wealth generation.",
    id: "Cagar alam berhasil dilindungi, namun pertumbuhan ekonomi dan investasi yang rendah membatasi peluang penciptaan lapangan kerja dan peningkatan kekayaan warga."
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
      id: "Kepercayaan publik yang tinggi, ekonomi yang stabil, dan ekosistem yang sehat."
    },
    risks: {
      en: "Complacency and slow adaptation to global changes.",
      id: "Kepuasan diri dan lambatnya adaptasi terhadap perubahan global."
    },
    lesson: {
      en: "Long-term prosperity requires equal investment in economic, social, and environmental pillars.",
      id: "Kemakmuran jangka panjang membutuhkan investasi yang setara dalam pilar ekonomi, sosial, dan lingkungan."
    }
  },
  "Governance Crisis City": {
    strengths: {
      en: "Hard lessons learned from institutional collapse.",
      id: "Pelajaran berharga yang didapat dari keruntuhan institusional."
    },
    risks: {
      en: "Bankruptcy, civil unrest, environmental degradation.",
      id: "Kebangkrutan, kerusuhan sipil, kerusakan lingkungan."
    },
    lesson: {
      en: "Ignoring governance, social equity, or ecological limits leads to cascading systemic failure.",
      id: "Mengabaikan tata kelola, keadilan sosial, atau batas ekologis menyebabkan kegagalan sistemik yang beruntun."
    }
  },
  "Prosperous but Vulnerable City": {
    strengths: {
      en: "Strong financial reserves and infrastructure.",
      id: "Cadangan keuangan dan infrastruktur yang kuat."
    },
    risks: {
      en: "Sudden ecological collapse or intense social polarization.",
      id: "Keruntuhan ekologis yang tiba-tiba atau polarisasi sosial yang intens."
    },
    lesson: {
      en: "Financial wealth cannot fully compensate for fragile social or environmental foundations.",
      id: "Kekayaan finansial tidak dapat sepenuhnya mengimbangi fondasi sosial atau lingkungan yang rapuh."
    }
  },
  "Economic Powerhouse": {
    strengths: {
      en: "Job creation, innovation hubs, and massive public revenue.",
      id: "Penciptaan lapangan kerja, pusat inovasi, dan pendapatan publik yang masif."
    },
    risks: {
      en: "Overexploitation of resources and rising wealth inequality.",
      id: "Eksploitasi sumber daya yang berlebihan dan meningkatnya kesenjangan kekayaan."
    },
    lesson: {
      en: "Unchecked growth without social safeguards can hollow out community resilience.",
      id: "Pertumbuhan yang tidak terkendali tanpa perlindungan sosial dapat mengikis ketahanan komunitas."
    }
  },
  "Welfare-Oriented City": {
    strengths: {
      en: "High quality of life, low inequality, and strong social cohesion.",
      id: "Kualitas hidup yang tinggi, kesenjangan yang rendah, dan kohesi sosial yang kuat."
    },
    risks: {
      en: "Fiscal strain and potential lack of economic competitiveness.",
      id: "Ketegangan fiskal dan potensi kurangnya daya saing ekonomi."
    },
    lesson: {
      en: "Social investments create a highly productive and resilient population.",
      id: "Investasi sosial menciptakan populasi yang sangat produktif dan tangguh."
    }
  },
  "Green & Sustainable City": {
    strengths: {
      en: "Pristine ecosystems and high resource efficiency.",
      id: "Ekosistem yang asri dan efisiensi sumber daya yang tinggi."
    },
    risks: {
      en: "High cost of green transition and slower short-term growth.",
      id: "Biaya transisi hijau yang tinggi dan pertumbuhan jangka pendek yang lebih lambat."
    },
    lesson: {
      en: "Securing the environment protects the city against future external supply shocks.",
      id: "Mengamankan lingkungan melindungi kota dari guncangan pasokan eksternal di masa depan."
    }
  },
  "Good Governance City": {
    strengths: {
      en: "Clean governance, zero corruption, and active public participation.",
      id: "Tata kelola bersih, bebas korupsi, dan partisipasi publik yang aktif."
    },
    risks: {
      en: "Bureaucratic deadlock and gridlock over contested policies.",
      id: "Kebuntuan birokrasi dan hambatan atas kebijakan yang diperdebatkan."
    },
    lesson: {
      en: "Trust is the ultimate currency of policy success and community stability.",
      id: "Kepercayaan adalah mata uang utama bagi keberhasilan kebijakan dan stabilitas komunitas."
    }
  },
  "Environmentally Protected but Economically Stagnant City": {
    strengths: {
      en: "Excellent environmental conservation and low carbon footprint.",
      id: "Konservasi lingkungan yang sangat baik dan jejak karbon yang rendah."
    },
    risks: {
      en: "Youth brain drain and lack of public funds to maintain services.",
      id: "Migrasi intelektual muda keluar dan kurangnya dana publik untuk layanan umum."
    },
    lesson: {
      en: "Environmental protection must align with economic opportunities to remain viable.",
      id: "Perlindungan lingkungan harus sejalan dengan peluang ekonomi agar tetap layak dipertahankan."
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
    return role.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const url = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/v1/rooms/${roomCode}/export`;
      
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
        backgroundColor: '#ffffff',
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

  return (
    <div className="min-h-screen w-full flex justify-center items-start font-['Nunito'] py-0">
      <div className="relative w-full sm:max-w-[480px] bg-white flex flex-col overflow-visible">
        
        {/* Top Header */}
        <div className="w-full h-24 bg-lime-600 px-[40px] flex items-center justify-between shrink-0 relative">
          <div className="flex flex-col text-left justify-center min-w-0 pr-4">
            <div className="text-white text-xl sm:text-2xl font-extrabold font-['Nunito'] truncate leading-tight">
              {lang === 'id' ? 'Majelis Rakyat' : "The People's Assembly"}
            </div>
            <div className="text-white text-sm font-semibold font-['Nunito'] leading-6 mt-0.5">
              {lang === 'id' ? 'Simulasi Selesai' : 'Simulation Complete'}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowStatsModal(true)}
              className="w-12 h-12 rounded-2xl bg-lime-600 shadow-[0px_2px_0px_0px_rgba(0,0,0,0.20)] border-2 border-black/20 hover:bg-lime-700 transition-all flex justify-center items-center cursor-pointer"
              title="Stats"
            >
              <Activity className="w-5 h-5 text-white" />
            </button>
            {onExit && (
              <button
                type="button"
                onClick={onExit}
                className="w-12 h-12 rounded-2xl bg-lime-600 shadow-[0px_2px_0px_0px_rgba(0,0,0,0.20)] border-2 border-black/20 hover:bg-lime-700 transition-all flex justify-center items-center cursor-pointer"
                title="Exit"
              >
                <LogOut className="w-5 h-5 text-white" />
              </button>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-grow flex flex-col gap-5 px-[35px] py-[22px] pb-16">
          
          {/* Badge & Subtitle */}
          <div className="flex flex-col items-center gap-1">
            <div className="h-8 px-4 sm:px-5 bg-neutral-200 rounded-[59px] flex items-center justify-center">
              <span className="text-zinc-500 text-[10px] font-extrabold font-['Nunito'] tracking-wider uppercase">
                {lang === 'id' ? 'SIMULASI SELESAI' : 'SIMULATION COMPLETE'}
              </span>
            </div>
            <div className="text-neutral-600 text-lg sm:text-xl font-extrabold font-['Nunito'] leading-8 sm:leading-9 text-center">
              {lang === 'id' ? 'Refleksi Majelis' : 'Assembly Reflection'}
            </div>
          </div>

          {/* Share Card Container */}
          <div 
            ref={cardRef}
            className="w-full mx-auto overflow-hidden rounded-xl shrink-0 border-2 border-neutral-200"
          >
            {/* Card Header - Green */}
            <div className="w-full bg-lime-600 px-6 py-4 flex items-center justify-center">
              <span className="text-white text-base font-extrabold uppercase tracking-wider text-center">
                {lang === 'id' ? 'MAJELIS RAKYAT' : "THE PEOPLE'S ASSEMBLY"}
              </span>
            </div>

            {/* Card Body */}
            <div className="w-full bg-white px-4 sm:px-6 py-4 sm:py-5 flex flex-col gap-3 sm:gap-4">
              {/* Archetype */}
              <div className="flex flex-col gap-1 items-center text-center">
                <span className="text-zinc-400 text-[10px] font-extrabold tracking-widest uppercase">
                  {lang === 'id' ? 'ARKETIPE KOTA' : 'CITY ARCHETYPE'}
                </span>
                <span className="text-neutral-600 text-lg font-black leading-tight">
                  {archetypes[0] || (lang === 'id' ? 'Arketipe Tidak Terpecahkan' : 'No Archetype Resolved')}
                </span>
              </div>

              {/* Score Boxes */}
              <div className="grid grid-cols-3 gap-3">
                {/* Prosperity */}
                <div className="flex flex-col items-center justify-center gap-1 py-2">
                  <span className="text-zinc-800 text-2xl sm:text-3xl font-extrabold leading-none">{fps.toFixed(1)}</span>
                  <span className="text-zinc-400 text-[9px] font-semibold uppercase tracking-wide">{lang === 'id' ? 'Kemakmuran' : 'Prosperity'}</span>
                </div>
                {/* Governance */}
                <div className="flex flex-col items-center justify-center gap-1 py-2">
                  <span className="text-zinc-800 text-2xl sm:text-3xl font-extrabold leading-none">{gqs.toFixed(1)}</span>
                  <span className="text-zinc-400 text-[9px] font-semibold uppercase tracking-wide">{lang === 'id' ? 'Tata Kelola' : 'Governance'}</span>
                </div>
                {/* Sustainability */}
                <div className="flex flex-col items-center justify-center gap-1 py-2">
                  <span className="text-zinc-800 text-2xl sm:text-3xl font-extrabold leading-none">{ss.toFixed(1)}</span>
                  <span className="text-zinc-400 text-[9px] font-semibold uppercase tracking-wide">{lang === 'id' ? 'Keberlanjutan' : 'Sustainability'}</span>
                </div>
              </div>

              {/* Footer */}
              <div className="text-zinc-400 text-[9px] font-semibold text-center">
                {lang === 'id' ? 'Dibuat pada ' : 'Generated '}{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} | Room {roomCode}
              </div>
            </div>
          </div>

          {/* Download Card Button */}
          <button
            onClick={handleDownloadImage}
            disabled={sharing}
            className="w-full h-12 bg-white hover:bg-neutral-50 rounded-xl shadow-[0px_2px_0px_0px_rgba(229,229,229,1.00)] border-2 border-neutral-200 inline-flex justify-center items-center gap-2.5 cursor-pointer active:scale-95 transition-all text-sky-500 text-sm font-extrabold uppercase tracking-wide"
          >
            {sharing ? (lang === 'id' ? 'Membuat...' : 'Generating...') : (lang === 'id' ? 'unduh kartu hasil' : 'download result card')}
          </button>

          {/* Detailed City Profile Cards */}
          {archetypes.length > 0 && (
            <div className="flex flex-col gap-4">
              <div className="text-neutral-600 text-base sm:text-xl font-extrabold font-['Nunito'] text-left">
                {lang === 'id' ? 'Profil Kota Terperinci' : 'Detailed City Profile'}
              </div>
              
              <div className="flex flex-col gap-4">
                {archetypes.map((arch, index) => {
                  const ext = ARCHETYPE_EXTENDED[arch];
                  const profile = ARCHETYPE_PROFILES[arch];
                  if (!ext || !profile) return null;
                  return (
                    <div key={arch} className="w-full relative bg-white rounded-xl shadow-[0px_2px_0px_0px_rgba(229,229,229,1.00)] outline outline-2 outline-offset-[-2px] outline-neutral-200 p-6 flex flex-col gap-4 text-left">
                      {/* Header with Title and index number */}
                      <div className="flex items-start gap-4 w-full">
                        <div className="size-12 bg-white rounded-2xl shadow-[0px_2px_0px_0px_rgba(0,0,0,0.20)] border-2 border-black/20 flex items-center justify-center text-neutral-600 text-2xl font-extrabold font-['Nunito'] leading-4 shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex flex-col gap-1 pr-2 min-w-0">
                          <span className="text-neutral-600 text-base font-extrabold font-['Nunito'] leading-tight">
                            {arch}
                          </span>
                          <p className="text-zinc-400 text-xs font-semibold font-['Nunito'] leading-relaxed">
                            {profile[lang] || profile['en']}
                          </p>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="h-0.5 bg-neutral-200 -mx-6" />

                      {/* Strengths / Advantages */}
                      <div className="flex flex-col gap-1">
                        <span className="text-sky-500 text-xs font-bold font-['Nunito'] tracking-wide leading-4">
                          {lang === 'id' ? 'Kekuatan Utama' : 'Advantages'}
                        </span>
                        <p className="text-zinc-400 text-xs font-semibold font-['Nunito'] leading-relaxed pl-0.5">
                          {ext.strengths[lang] || ext.strengths['en']}
                        </p>
                      </div>

                      {/* Risks */}
                      <div className="flex flex-col gap-1">
                        <span className="text-red-500 text-xs font-bold font-['Nunito'] tracking-wide leading-4">
                          {lang === 'id' ? 'Risiko Utama' : 'Risks'}
                        </span>
                        <p className="text-zinc-400 text-xs font-semibold font-['Nunito'] leading-relaxed pl-0.5">
                          {ext.risks[lang] || ext.risks['en']}
                        </p>
                      </div>

                      {/* Educational Lesson */}
                      <div className="flex flex-col gap-1">
                        <span className="text-sky-500 text-xs font-bold font-['Nunito'] tracking-wide leading-4">
                          {lang === 'id' ? 'Pelajaran Edukatif' : 'Educational Lesson'}
                        </span>
                        <p className="text-zinc-500 text-xs font-extrabold font-['Inter'] leading-relaxed pl-0.5">
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
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="text-neutral-600 text-base sm:text-xl font-extrabold font-['Nunito'] text-left">
                {lang === 'id' ? 'Dampak Pemangku Kepentingan Individu' : 'Individual Stakeholder Impact'}
              </div>
              <div className="text-zinc-400 text-xs font-semibold leading-relaxed text-left">
                {lang === 'id' 
                  ? 'Meskipun Dasbor Kota menunjukkan hasil agregat, pemangku kepentingan individu memiliki ambang batas khusus untuk sukses. Peran-peran ini memenuhi tujuan mereka.'
                  : 'While the city Dashboard shows the aggregate outcome, individual stakeholders have specific thresholds for success. These roles met their objectives.'}
              </div>
            </div>

            {/* Beneficiaries Content Box */}
            <div className="w-full min-h-12 bg-neutral-100 rounded-xl border-2 border-neutral-200 overflow-hidden flex flex-wrap items-center justify-start px-4 sm:px-6 py-3 gap-2">
              {beneficiaries.length === 0 ? (
                <div className="text-neutral-500 text-sm font-semibold">
                  {lang === 'id' ? 'Tidak ada peran yang memenuhi ambang batas keuntungan mereka.' : 'No roles met their benefit thresholds.'}
                </div>
              ) : (
                beneficiaries.map((role) => (
                  <span 
                    key={role}
                    className="px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold rounded-lg border border-emerald-500/20 uppercase"
                  >
                    {formatRoleName(role)}
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Core Policy Reflections Collapsible */}
          <div className="w-full bg-neutral-100 rounded-xl border-2 border-neutral-200 overflow-hidden flex flex-col">
            <button 
              type="button"
              onClick={() => setShowReflections(!showReflections)}
              className="w-full h-12 bg-neutral-100 hover:bg-neutral-200 flex items-center justify-between px-6 cursor-pointer text-neutral-500 text-sm font-semibold select-none"
            >
              <span>{lang === 'id' ? 'Refleksi Kebijakan Utama' : 'Core Policy Reflections'}</span>
              {showReflections ? (
                <ChevronUp className="w-5 h-5 text-neutral-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-neutral-500" />
              )}
            </button>
            
            {showReflections && (
              <div className="px-6 pb-4 bg-neutral-50 space-y-4 pt-2 text-left">
                {REFLECTIONS.map((quote, idx) => (
                  <div key={idx} className="border-b border-neutral-200/60 last:border-0 pb-3">
                    <span className="font-extrabold text-neutral-600 text-xs uppercase tracking-wider block mb-1">
                      {lang === 'id' ? `Refleksi Kebijakan ${idx + 1}` : `Policy Reflection ${idx + 1}`}
                    </span>
                    <p className="text-zinc-400 text-xs font-semibold leading-relaxed">
                      "{quote}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Facilitator / Session Reporting Section */}
          {isFacilitator && (
            <div className="flex flex-col gap-3 pt-5 mt-2">
              <div className="text-neutral-600 text-base sm:text-xl font-extrabold font-['Nunito'] text-center">
                {lang === 'id' ? 'Pelaporan Sesi' : 'Session Reporting'}
              </div>
              <div className="text-zinc-400 text-xs font-semibold leading-relaxed text-center">
                {lang === 'id'
                  ? 'Unduh data sesi lengkap (keputusan pemain, hasil pemungutan suara, dan riwayat indikator) sebagai Spreadsheet Excel untuk analisis dan pelaporan offline.'
                  : 'Download the comprehensive session data (player decisions, vote tallies, and indicator history) as an Excel Spreadsheet for offline analysis and reporting.'}
              </div>

              {/* Download Spreadsheet Button */}
              <button
                onClick={handleExport}
                disabled={exporting}
                className="w-full h-12 bg-lime-600 hover:bg-lime-700 disabled:bg-lime-400 text-white text-sm font-extrabold uppercase tracking-wide rounded-xl shadow-[0px_4px_0px_0px_#46A302] cursor-pointer active:translate-y-[2px] active:shadow-[0px_2px_0px_0px_#46A302] transition-all mt-3"
              >
                {exporting ? (lang === 'id' ? 'Membuat...' : 'Generating...') : (lang === 'id' ? 'unduh spreadsheet' : 'download spreadsheet')}
              </button>

              {/* Restart Session / New Assembly Button */}
              {onRestartSession && (
                <button
                  onClick={onRestartSession}
                  className="w-full h-12 bg-white hover:bg-neutral-50 text-sky-500 text-sm font-extrabold uppercase tracking-wide rounded-xl shadow-[0px_2px_0px_0px_rgba(229,229,229,1.00)] border-2 border-neutral-200 cursor-pointer active:scale-95 transition-all"
                >
                  {lang === 'id' ? 'majelis baru' : 'new assembly'}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Stats Modal Overlay */}
        {showStatsModal && (
          <div className="absolute inset-0 z-50 bg-slate-950/40 backdrop-blur-sm animate-fade-in flex justify-center items-center p-4">
            <div className="w-[410px] max-h-[90%] bg-white rounded-xl shadow-2xl border-2 border-neutral-200 outline outline-2 outline-offset-[-2px] outline-neutral-200 p-6 overflow-y-auto flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-neutral-200 pb-3 mb-4">
                  <span className="text-neutral-600 text-base font-extrabold font-['Nunito']">
                    {lang === 'id' ? 'Indikator Kota' : 'City Indicators'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowStatsModal(false)}
                    className="text-xs font-bold text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer"
                  >
                    {lang === 'id' ? 'Tutup' : 'Close'}
                  </button>
                </div>
                <div className="py-2">
                  {indicators ? (
                    <Dashboard indicators={indicators} flat />
                  ) : (
                    <div className="text-center py-6 text-neutral-500 font-semibold">No data available</div>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowStatsModal(false)}
                className="w-full h-12 bg-lime-600 hover:bg-lime-700 text-white text-sm font-extrabold uppercase tracking-wide rounded-xl shadow-[0px_4px_0px_0px_#46A302] transition-all flex justify-center items-center cursor-pointer active:translate-y-1 active:shadow-none mt-6"
              >
                {lang === 'id' ? 'Tutup' : 'Close'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


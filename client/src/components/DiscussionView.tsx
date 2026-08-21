import React, { useState } from 'react';
import { LogOut, ChevronDown, ChevronUp } from 'lucide-react';
import { useI18n } from '../i18n.js';
import type { Scenario } from '../gameConstants.js';
import { formatRoleTitle } from '../gameConstants.js';
import bgImage from '../assets/image5.png';
import desktop4Bg from '../assets/desktop4.png';

interface DiscussionViewProps {
  isFacilitator: boolean;
  secondsRemaining: number;
  totalDuration: number;
  onEndDiscussionEarly?: () => void;
  scenarioTitle?: string;
  scenarioIndex?: number;
  scenario?: Scenario | null;
  onCancelSession?: () => void;
  indicators?: any;
  roomCode?: string;
  playerRole?: string;
}

export const DiscussionView: React.FC<DiscussionViewProps> = ({
  isFacilitator,
  secondsRemaining,
  onEndDiscussionEarly,
  scenarioTitle = 'New Industrial Zone',
  scenarioIndex = 0,
  scenario,
  onCancelSession,
  roomCode,
  playerRole
}) => {
  const { t } = useI18n();
  const [showPositions, setShowPositions] = useState(false);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const lang = localStorage.getItem('tpa_lang') || 'en';

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
    return roleMap[lang]?.[role] || role.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const optionKeys = ['A', 'B', 'C'] as const;
  const currentTitle = scenario?.title || scenarioTitle;

  return (
    <div className="relative min-h-screen w-full bg-[#07243A] flex justify-center items-center overflow-x-hidden">
      
      {/* Full-Width Desktop Wallpaper (Hidden on mobile) */}
      <div className="hidden sm:block absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <img 
          className="w-full h-full object-cover object-top" 
          src={desktop4Bg} 
          alt="Assembly Deliberation Desktop Wallpaper" 
        />
        {/* Dark Overlay for optimal text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-[#07243A]/90" />
      </div>

      {/* Full-Height Mobile Background Image Layer (Hidden on desktop) */}
      {bgImage && (
        <img className="sm:hidden absolute inset-x-0 top-0 w-full h-full min-h-full object-top object-cover pointer-events-none z-0" src={bgImage} alt="" />
      )}

      {/* Container 480px width (Scales to 520px on tablet/desktop) */}
      <div className="relative z-10 w-full max-w-[480px] sm:max-w-[520px] min-h-screen flex flex-col items-center pb-12 overflow-y-auto no-scrollbar">

        {/* 1. Header Banner */}
        <div className="w-full px-6 pt-6 pb-2 flex items-center justify-between shrink-0 relative z-20">
          <div className="flex flex-col text-left justify-center min-w-0 pr-4">
            <h1 className="text-white text-xl font-extrabold font-['Nunito'] leading-tight truncate">
              {currentTitle}
            </h1>
            <span className="text-white text-sm sm:text-base font-bold font-['Nunito'] leading-5 flex items-center gap-1.5 flex-wrap">
              <span>{lang === 'id' ? `Skenario ${scenarioIndex + 1} dari 5` : lang === 'th' ? `สถานการณ์ ${scenarioIndex + 1} จาก 5` : `Scenario ${scenarioIndex + 1} of 5`}</span>
              {isFacilitator && roomCode && (
                <>
                  <span className="opacity-60">•</span>
                  <span>{roomCode}</span>
                </>
              )}
              {!isFacilitator && playerRole && (
                <>
                  <span className="opacity-60">•</span>
                  <span className="text-amber-300 font-extrabold">{formatRoleTitle(playerRole, lang)}</span>
                </>
              )}
            </span>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button 
              type="button"
              onClick={onCancelSession}
              className="w-12 h-12 bg-cyan-700 rounded-2xl shadow-[0px_2px_0px_0px_rgba(0,0,0,0.20)] border-2 border-black/20 flex items-center justify-center text-white cursor-pointer hover:opacity-90 active:scale-95 transition-all shrink-0"
              title={t('common.cancel')}
            >
              <LogOut className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* 2. Assembly Deliberation Section */}
        <div className="w-full px-6 pt-6 flex flex-col items-center text-center z-20 space-y-2">
          <h2 className="text-white text-xl sm:text-2xl font-extrabold font-['Nunito'] leading-snug">
            {lang === 'id' ? 'Musyawarah Majelis' : lang === 'th' ? 'การอภิปรายสภา' : 'Assembly Deliberation'}
          </h2>
          <p className="text-white/95 text-sm sm:text-base font-semibold font-['Nunito'] leading-relaxed max-w-[360px] mx-auto">
            {lang === 'id' ? (
              <>Bermusyawarah dengan delegasi lain di ruangan. Negosiasikan aliansi, bahas keuntungan dan risiko, dan siapkan strategi pemungutan suara Anda.</>
            ) : lang === 'th' ? (
              <>อภิปรายกับผู้แทนคนอื่น ๆ ในห้องประชุม เจรจาสร้างพันธมิตร อภิปรายจุดแข็งและความเสี่ยง และเตรียมกลยุทธ์การลงมติของคุณ</>
            ) : (
              <>Deliberate with other delegates in the room. Negotiate alliances, discuss advantages and risks, and prepare your voting strategy.</>
            )}
          </p>
        </div>

        {/* 3. Clock Graphic Spacer & Digital Timer */}
        <div className="w-full px-6 pt-[340px] sm:pt-8 pb-8 flex flex-col items-center text-center z-20 space-y-1">
          <div className="text-white text-5xl sm:text-6xl font-extrabold font-['Nunito'] leading-none tracking-tight">
            {formatTime(secondsRemaining)}
          </div>
          <div className="text-white text-sm sm:text-base font-extrabold font-['Nunito'] tracking-wider">
            {lang === 'id' ? 'WAKTU TERSISA' : lang === 'th' ? 'เวลาที่เหลือ' : 'TIME REMAINING'}
          </div>
        </div>

        {/* 4. Scenario Challenge Section */}
        <div className="w-full max-w-[400px] px-6 pt-8 flex flex-col items-center text-center z-20 space-y-5">
          <h3 className="text-white text-lg sm:text-xl font-extrabold font-['Nunito'] leading-tight">
            {lang === 'id' ? 'Tantangan Skenario' : lang === 'th' ? 'ประเด็นท้าทาย' : 'Scenario Challenge'}
          </h3>
          <div className="w-full bg-[#52A5E4] rounded-2xl p-5 border-2 border-cyan-800/40 text-left">
            <p className="text-white text-xs sm:text-sm font-semibold font-['Nunito'] leading-relaxed">
              {scenario?.challengeSummary || scenario?.description || 'A Consortium proposes a new industrial zone promising jobs, tax, revenue, and investment, against concerns over environmental impact, land acquisition, & transparency.'}
            </p>
          </div>
        </div>

        {/* 5. Policy Options A, B, C Cards */}
        {scenario?.options && (
          <div className="w-full max-w-[400px] px-6 pt-6 flex flex-col space-y-4 z-20 text-left">
            {optionKeys.map((key) => {
              const opt = scenario.options[key];
              if (!opt) return null;
              return (
                <div 
                  key={key}
                  className="w-full p-4 bg-[#232733] rounded-2xl border border-zinc-700/60 flex flex-col space-y-3"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="size-11 rounded-2xl bg-[#FF574D] border border-black/20 flex justify-center items-center shrink-0">
                      <span className="text-white text-xl font-extrabold font-['Nunito']">{key}</span>
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-white text-base font-extrabold font-['Nunito'] leading-snug break-words">
                        {opt.label}
                      </h4>
                      <p className="text-zinc-400 text-xs font-medium font-['Nunito'] leading-relaxed mt-0.5">
                        {opt.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="h-[1px] bg-zinc-700/60 -mx-4" />
                  
                  <div className="space-y-2 pt-1">
                    <div>
                      <div className="text-white text-xs font-bold font-['Nunito'] leading-snug mb-0.5">
                        {lang === 'id' ? 'Keuntungan' : lang === 'th' ? 'จุดแข็ง' : 'Advantages'}
                      </div>
                      <div className="text-zinc-400 text-xs font-medium font-['Nunito'] leading-relaxed">
                        {opt.advantages}
                      </div>
                    </div>
                    <div>
                      <div className="text-white text-xs font-bold font-['Nunito'] leading-snug mb-0.5">
                        {lang === 'id' ? 'Risiko' : lang === 'th' ? 'ความเสี่ยง' : 'Risks'}
                      </div>
                      <div className="text-zinc-400 text-xs font-medium font-['Nunito'] leading-relaxed">
                        {opt.risks}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 6. Stakeholder Positions Accordion */}
        {scenario?.stakeholderPositions && (
          <div className="w-full max-w-[400px] px-6 pt-5 z-20">
            <div className="w-full bg-[#232733] rounded-2xl border border-zinc-700/60 overflow-hidden">
              <button
                type="button"
                onClick={() => setShowPositions(!showPositions)}
                className="w-full flex items-center justify-between px-5 py-4 text-zinc-300 text-xs font-extrabold font-['Nunito'] uppercase tracking-wider cursor-pointer hover:bg-zinc-800/80 transition-colors"
              >
                <span>{lang === 'id' ? 'Posisi Pemangku Kepentingan' : lang === 'th' ? 'ท่าทีของผู้มีส่วนได้ส่วนเสีย' : 'Stakeholder Positions'}</span>
                {showPositions ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
              </button>
              {showPositions && (
                <div className="px-5 pb-4 bg-zinc-900/90 space-y-3 max-h-[280px] overflow-y-auto pt-3 text-left border-t border-zinc-700/60">
                  {Object.entries(scenario.stakeholderPositions).map(([role, position]) => (
                    <div key={role} className="border-b border-zinc-800 last:border-0 pb-2">
                      <span className="font-extrabold text-sky-400 text-[11px] uppercase tracking-wider block mb-0.5 font-['Nunito']">
                        {formatRoleName(role)}
                      </span>
                      <p className="text-zinc-300 text-xs font-semibold font-['Nunito'] leading-relaxed">
                        {position}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 7. End Discussion Early Button */}
        {isFacilitator && onEndDiscussionEarly && (
          <div className="w-full max-w-[400px] px-6 pt-6 z-20">
            <button
              type="button"
              onClick={onEndDiscussionEarly}
              data-button="Primary"
              className="w-full h-12 p-2.5 bg-[#5CACE2] rounded-md shadow-[0px_4px_0px_0px_rgba(36,112,162,1.00)] flex justify-center items-center transition-all hover:opacity-90 cursor-pointer active:translate-y-0.5 focus:outline-none"
            >
              <span className="text-white text-sm font-extrabold font-['Nunito'] uppercase tracking-wide">
                {lang === 'id' ? 'AKHIRI DISKUSI LEBIH AWAL' : lang === 'th' ? 'จบการอภิปรายก่อนกำหนด' : 'END DISCUSSION EARLY'}
              </span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};




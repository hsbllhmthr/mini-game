import React, { useState } from 'react';
import { LogOut, ChevronDown, ChevronUp } from 'lucide-react';
import { useI18n } from '../i18n.js';
import { formatRoleTitle } from '../gameConstants.js';

export interface RoleInfo {
  role: string;
  name?: string;
  description: string;
  objectives: string;
  secretInfo: string;
}

interface PlayerRoleSummary {
  id: string;
  fullName: string;
  role: string;
  country: string;
}

interface RoleRevealViewProps {
  isFacilitator: boolean;
  roleInfo?: RoleInfo;
  facilitatorPlayers?: PlayerRoleSummary[];
  onOpenScenario?: () => void;
  scenarioIndex: number;
  onCancelSession?: () => void;
  roomCode?: string;
}

export const RoleRevealView: React.FC<RoleRevealViewProps> = ({
  isFacilitator,
  roleInfo,
  facilitatorPlayers = [],
  onOpenScenario,
  scenarioIndex,
  onCancelSession,
  roomCode
}) => {
  const { t } = useI18n();
  const lang = localStorage.getItem('tpa_lang') || 'en';
  const [revealSecret, setRevealSecret] = useState(false);
  const [visibleCount, setVisibleCount] = useState(4);

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

  const getRoleBadgeColor = (_role: string) => {
    return 'bg-[#E74B3C]';
  };

  if (isFacilitator) {
    const visiblePlayers = facilitatorPlayers.slice(0, visibleCount);

    return (
      <div className="relative min-h-screen w-full bg-[#0D2B40] flex flex-col justify-between items-center overflow-hidden">
        
        {/* 100% Full-Width Top Header Banner */}
        <div className="w-full bg-cyan-700 flex justify-center shrink-0 z-20">
          <div className="w-full max-w-[480px] sm:max-w-[520px] h-24 px-6 flex items-center justify-between">
            <div className="flex flex-col text-left justify-center min-w-0 pr-4">
              <h1 className="text-white text-xl sm:text-2xl font-extrabold font-['Nunito'] leading-tight truncate">
                {lang === 'id' ? 'Daftar Pembagian Peran' : 'Role Assignment Roster'}
              </h1>
              <span className="text-white text-xs font-semibold font-['Nunito'] leading-5 flex items-center gap-1.5 flex-wrap">
                <span>{lang === 'id' ? `Skenario ${scenarioIndex + 1} dari 5` : `Scenario ${scenarioIndex + 1} of 5`}</span>
                {roomCode && (
                  <>
                    <span className="opacity-60">•</span>
                    <span>{roomCode}</span>
                  </>
                )}
              </span>
            </div>

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

        {/* Middle Content Section */}
        <div className="w-full max-w-[384px] sm:max-w-[420px] flex-grow flex flex-col items-center mx-auto px-4 py-6 space-y-4 overflow-y-auto no-scrollbar z-10">
          
          {/* Subtitle / Description Text */}
          <div className="w-full text-center text-white text-sm font-medium font-['Nunito'] leading-5 px-1">
            {lang === 'id' 
              ? <>Tinjau peran pemain. Musyawarah dilakukan di ruangan.<br className="hidden sm:inline" /> Ketika semua pemain siap, buka Skenario {scenarioIndex + 1}.</>
              : <>Review player roles. Deliberation happens in the room.<br className="hidden sm:inline" /> When all players are ready, open Scenario {scenarioIndex + 1}.</>
            }
          </div>

          {/* Players Roster Cards List */}
          <div className="w-full space-y-3.5 shrink-0 pt-2">
            {visiblePlayers.map((player) => (
              <div 
                key={player.id} 
                className="w-full h-20 bg-white rounded-md border-2 border-neutral-200 px-4 flex items-center justify-between shrink-0"
              >
                <div className="flex flex-col items-start justify-center min-w-0 text-left">
                  <div className="text-neutral-600 text-lg sm:text-xl font-extrabold font-['Nunito'] leading-5 truncate w-full">
                    {player.fullName}
                  </div>
                  <div className="text-neutral-500 text-sm font-medium font-['Inter'] leading-6 mt-0.5 truncate w-full">
                    {player.country}
                  </div>
                </div>

                <div className={`px-3 py-1.5 rounded-md text-white text-xs sm:text-sm font-semibold font-['Inter'] leading-tight shrink-0 ${getRoleBadgeColor(player.role)}`}>
                  {formatRoleName(player.role)}
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {facilitatorPlayers.length > visibleCount && (
            <button
              type="button"
              onClick={() => setVisibleCount(c => Math.min(c + 4, facilitatorPlayers.length))}
              className="text-white text-lg font-extrabold font-['Nunito'] leading-7 hover:opacity-80 transition-all cursor-pointer pt-1 pb-2 shrink-0"
            >
              {lang === 'id' ? 'Muat Lebih Banyak' : 'Load More'}
            </button>
          )}

        </div>

        {/* Bottom Section: Action Buttons */}
        <div className="w-full max-w-[384px] sm:max-w-[420px] flex flex-col items-center mx-auto px-4 space-y-3.5 pb-6 shrink-0 z-10">
          
          {/* Primary Action: Open Scenario */}
          <button
            type="button"
            onClick={onOpenScenario}
            data-button="Primary"
            className="w-full max-w-[384px] sm:max-w-[420px] h-12 p-2.5 bg-[#5CACE2] rounded-md shadow-[0px_4px_0px_0px_rgba(36,112,162,1.00)] inline-flex justify-center items-center gap-2.5 transition-all hover:opacity-90 cursor-pointer active:translate-y-0.5 focus:outline-none"
          >
            <div className="text-white text-sm font-extrabold font-['Nunito'] uppercase tracking-wide">
              {lang === 'id' ? `buka skenario ${scenarioIndex + 1}` : `open scenario ${scenarioIndex + 1}`}
            </div>
          </button>

          {/* Secondary Action: Cancel Session */}
          <button
            type="button"
            onClick={onCancelSession}
            data-button="Outline-Secondary"
            className="w-full max-w-[384px] sm:max-w-[420px] h-12 p-2.5 bg-cyan-700 rounded-md shadow-[0px_2px_0px_0px_rgba(29,90,130,1.00)] outline outline-2 outline-offset-[-2px] outline-cyan-800 inline-flex justify-center items-center gap-2.5 transition-all hover:bg-cyan-600 cursor-pointer active:translate-y-0.5 focus:outline-none"
          >
            <div className="text-white text-sm font-extrabold font-['Nunito'] uppercase tracking-wide">
              {lang === 'id' ? 'Batal Sesi' : 'Cancel session'}
            </div>
          </button>

        </div>

      </div>
    );
  }

  // Player Role Reveal View
  if (!roleInfo) return null;

  const isMayor = roleInfo.role.toLowerCase() === 'mayor';
  const scenarioTitle = lang === 'id' ? 'Penyingkapan Peran' : lang === 'th' ? 'การเปิดเผยบทบาท' : 'Role Briefing';

  return (
    <div className="relative min-h-screen w-full bg-[#0D2B40] flex flex-col justify-between items-center overflow-hidden">
      
      {/* 100% Full-Width Top Header Banner */}
      <div className="w-full bg-cyan-700 flex justify-center shrink-0 z-20">
        <div className="w-full max-w-[480px] sm:max-w-[520px] h-24 px-6 flex items-center justify-between">
          <div className="flex flex-col text-left justify-center min-w-0 pr-4">
            <h1 className="text-white text-xl sm:text-2xl font-extrabold font-['Nunito'] leading-tight truncate">
              {scenarioTitle}
            </h1>
            <span className="text-white text-base sm:text-lg font-bold font-['Nunito'] leading-6 flex items-center gap-1.5 flex-wrap">
              <span>{lang === 'id' ? `Skenario ${scenarioIndex + 1} dari 5` : lang === 'th' ? `สถานการณ์ ${scenarioIndex + 1} จาก 5` : `Scenario ${scenarioIndex + 1} of 5`}</span>
              {roleInfo?.role && (
                <>
                  <span className="opacity-60">•</span>
                  <span className="text-amber-300 font-extrabold">{formatRoleTitle(roleInfo.role, lang)}</span>
                </>
              )}
            </span>
          </div>

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

      {/* Middle Scrollable Content Container */}
      <div className="w-full max-w-[384px] sm:max-w-[420px] flex-grow flex flex-col items-center mx-auto px-4 py-8 space-y-10 overflow-y-auto no-scrollbar z-10">
        
        {/* Role Identity Card Banner */}
        <div className="w-full max-w-[384px] sm:max-w-[420px] min-h-28 bg-[#5CACE2] rounded-xl border-2 border-cyan-800 p-5 flex flex-col justify-center text-left shrink-0 space-y-2">
          <div className="text-white text-xl font-extrabold font-['Nunito'] leading-5">
            {formatRoleName(roleInfo.role)}
          </div>
          <div className="text-white text-sm font-medium font-['Inter'] leading-6">
            {roleInfo.description}
          </div>
        </div>

        {/* Primary Objective Section */}
        <div className="w-full text-left shrink-0 space-y-3">
          <div className="text-white text-xl font-extrabold font-['Nunito'] leading-tight">
            {lang === 'id' ? 'Tujuan Utama' : lang === 'th' ? 'วัตถุประสงค์หลัก' : 'Primary Objective'}
          </div>
          <div className="text-white text-base font-semibold font-['Nunito'] leading-relaxed">
            {roleInfo.objectives}
          </div>
        </div>

        {/* Secret Information Section */}
        <div className="w-full text-left shrink-0 space-y-3">
          <div className="text-white text-xl font-extrabold font-['Nunito'] leading-tight">
            {lang === 'id' ? 'Informasi Rahasia' : lang === 'th' ? 'ข้อมูลลับ' : 'Secret Information'}
          </div>
          
          <div 
            onClick={() => setRevealSecret(!revealSecret)}
            className={`w-full rounded-xl bg-neutral-800 border-2 border-neutral-600 overflow-hidden cursor-pointer transition-all duration-300 ${
              revealSecret 
                ? 'p-4' 
                : 'h-12 flex items-center justify-between px-6 hover:bg-neutral-750'
            }`}
          >
            {revealSecret ? (
              <div className="text-white text-sm font-medium font-['Inter'] leading-relaxed flex justify-between items-start gap-4">
                <span>{roleInfo.secretInfo}</span>
                <ChevronUp className="w-5 h-5 text-zinc-400 shrink-0" />
              </div>
            ) : (
              <>
                <span className="text-zinc-500 text-sm font-medium font-['Inter'] leading-6">
                  {lang === 'id' ? 'Ketuk Untuk Membuka' : lang === 'th' ? 'แตะเพื่อเปิดเผย' : 'Tap To Reveal'}
                </span>
                <ChevronDown className="w-5 h-5 text-zinc-500" />
              </>
            )}
          </div>
          
          <div className="text-white text-base font-semibold font-['Nunito'] leading-6 opacity-90 pt-1">
            {lang === 'id' ? '*jangan diperlihatkan kepada delegasi lain' : lang === 'th' ? '*ซ่อนไว้ไม่ให้ผู้แทนคนอื่นเห็น' : '*keep hidden from other delegates'}
          </div>
        </div>

      </div>

      {/* 100% Full-Width Bottom Mayor Privilege Banner */}
      {isMayor && (
        <div className="w-full bg-[#E74B3C] flex justify-center shrink-0 z-20">
          <div className="w-full max-w-[480px] sm:max-w-[520px] py-4 px-6 text-center text-white text-sm font-medium font-['Inter'] leading-6">
            {lang === 'id' ? (
              <>Hak Istimewa Walikota: Anda memegang kekuasaan keputusan akhir dan hak veto setelah pemungutan suara majelis.</>
            ) : lang === 'th' ? (
              <>สิทธิพิเศษของนายกเทศมนตรี: คุณมีอำนาจตัดสินใจขั้นสุดท้ายและสิทธิในการวีโต้หลังจากการลงมติของสภา</>
            ) : (
              <>Mayor privilege: You hold ultimate decision power and veto rights after assembly votes.</>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

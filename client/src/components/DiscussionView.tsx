import React, { useState } from 'react';
import { LogOut, Activity } from 'lucide-react';
import { useI18n } from '../i18n.js';
import { Dashboard } from './Dashboard.js';
import type { Indicators } from './Dashboard.js';
import bgImage from '../assets/image5.png';

interface DiscussionViewProps {
  isFacilitator: boolean;
  secondsRemaining: number;
  totalDuration: number;
  onEndDiscussionEarly?: () => void;
  scenarioTitle?: string;
  scenarioIndex?: number;
  onCancelSession?: () => void;
  indicators?: Indicators;
}

export const DiscussionView: React.FC<DiscussionViewProps> = ({
  isFacilitator,
  secondsRemaining,
  onEndDiscussionEarly,
  scenarioTitle = 'New Industrial Zone',
  scenarioIndex = 0,
  onCancelSession,
  indicators
}) => {
  const { t } = useI18n();
  const [showStatsModal, setShowStatsModal] = useState(false);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const lang = localStorage.getItem('tpa_lang') || 'en';

  return (
    <div className="relative min-h-screen w-full bg-white flex justify-center items-center overflow-hidden">
      {/* Outer Web Background: White. Main Content Container: Dark #0D2B40 without card wrapper */}
      <div className="relative z-10 w-full max-w-[480px] min-h-screen bg-[#0D2B40] flex flex-col justify-between items-center pb-6 sm:pb-8 overflow-hidden">
        {bgImage && (
          <img className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0" src={bgImage} alt="" />
        )}
        
        {/* Top Full-Width Header Banner (Transparent background) */}
        <div className="w-full h-24 bg-transparent px-6 flex items-center justify-between shrink-0 relative overflow-hidden z-20">
          <div className="flex flex-col text-left justify-center min-w-0 pr-4">
            <h1 className="text-white text-xl sm:text-2xl font-extrabold font-['Nunito'] leading-tight truncate">
              {scenarioTitle}
            </h1>
            <span className="text-white text-sm font-semibold font-['Nunito'] leading-6">
              {lang === 'id' ? `Skenario ${scenarioIndex + 1} dari 3` : lang === 'th' ? `สถานการณ์ ${scenarioIndex + 1} จาก 3` : `Scenario ${scenarioIndex + 1} of 3`}
            </span>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button 
              type="button"
              onClick={() => setShowStatsModal(true)}
              className="w-12 h-12 bg-cyan-700 rounded-2xl shadow-[0px_2px_0px_0px_rgba(0,0,0,0.20)] border-2 border-black/20 flex items-center justify-center text-white cursor-pointer hover:opacity-90 active:scale-95 transition-all shrink-0"
              title="Stats"
            >
              <Activity className="w-5 h-5 text-white" />
            </button>

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

        {/* Central & Bottom Content Area */}
        <div className="w-full max-w-[384px] flex-grow flex flex-col items-center justify-between mx-auto px-4 py-4 text-center overflow-y-auto no-scrollbar z-20 space-y-6">
          
          {/* Top Title & Sub-description */}
          <div className="w-full flex flex-col items-center shrink-0 space-y-1 -mt-3 sm:-mt-4">
            <h2 className="text-white text-xl font-extrabold font-['Nunito'] leading-9">
              {lang === 'id' ? 'Musyawarah Majelis' : lang === 'th' ? 'การอภิปรายสภา' : 'Assembly Deliberation'}
            </h2>
            <p className="text-white text-sm sm:text-base font-semibold font-['Nunito'] leading-relaxed max-w-full mx-auto text-center">
              {lang === 'id' ? (
                <>
                  Bermusyawarah dengan delegasi lain di ruangan.<br />
                  <span className="whitespace-nowrap">Negosiasikan aliansi, bahas keuntungan dan risiko,</span><br />
                  dan siapkan strategi pemungutan suara Anda.
                </>
              ) : lang === 'th' ? (
                <>
                  อภิปรายกับผู้แทนคนอื่น ๆ ในห้องประชุม<br />
                  <span className="whitespace-nowrap">เจรจาสร้างพันธมิตร อภิปรายจุดแข็งและความเสี่ยง</span><br />
                  และเตรียมกลยุทธ์การลงมติของคุณ
                </>
              ) : (
                <>
                  Deliberate with other delegates in the room.<br />
                  <span className="whitespace-nowrap">Negotiate alliances, discuss advantages and risks,</span><br />
                  and prepare your voting strategy.
                </>
              )}
            </p>
          </div>

          {/* Bottom Timer & Action Button Group */}
          <div className="w-full flex flex-col items-center shrink-0 space-y-6 mt-auto">
            {/* Timer Display Group */}
            <div className="flex flex-col items-center justify-center shrink-0 space-y-0.5">
              <div className="text-white text-5xl sm:text-6xl font-extrabold font-['Nunito'] leading-none">
                {formatTime(secondsRemaining)}
              </div>
              <div className="text-white text-lg font-extrabold font-['Nunito'] leading-9 tracking-wide">
                {lang === 'id' ? 'WAKTU TERSISA' : lang === 'th' ? 'เวลาที่เหลือ' : 'TIME REMAINING'}
              </div>
            </div>

            {/* Facilitator End Early Button */}
            {isFacilitator && onEndDiscussionEarly ? (
              <div className="w-full shrink-0">
                <button
                  type="button"
                  onClick={onEndDiscussionEarly}
                  data-button="Primary"
                  className="w-full max-w-[384px] h-12 p-2.5 bg-[#5CACE2] rounded-md shadow-[0px_4px_0px_0px_rgba(36,112,162,1.00)] inline-flex justify-center items-center gap-2.5 transition-all hover:opacity-90 cursor-pointer active:translate-y-0.5 focus:outline-none"
                >
                  <div className="text-white text-sm font-extrabold font-['Nunito'] uppercase tracking-wide">
                    {lang === 'id' ? 'akhiri diskusi lebih awal' : lang === 'th' ? 'จบการอภิปรายก่อนกำหนด' : 'End discussion early'}
                  </div>
                </button>
              </div>
            ) : (
              <div className="h-4 shrink-0" />
            )}
          </div>

        </div>

        {/* Stats Modal Overlay */}
        {showStatsModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm animate-fade-in flex justify-center items-start sm:items-center p-4 pt-6 sm:pt-4 overflow-y-auto">
            <div className="w-[410px] max-h-[90%] bg-neutral-900 rounded-3xl p-6 shadow-2xl overflow-y-auto border-2 border-neutral-700 flex flex-col justify-between text-white">
              <div>
                <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
                  <span className="text-lg font-extrabold font-['Nunito'] text-white uppercase tracking-wider">
                    {lang === 'id' ? 'Indikator Kota' : lang === 'th' ? 'ตัวชี้วัดของเมือง' : 'City Indicators'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowStatsModal(false)}
                    className="text-sm font-bold text-zinc-400 hover:text-white cursor-pointer"
                  >
                    {lang === 'id' ? 'Tutup' : lang === 'th' ? 'ปิด' : 'Close'}
                  </button>
                </div>
                {indicators ? (
                  <Dashboard indicators={indicators} flat />
                ) : (
                  <div className="text-center py-6 text-zinc-400 font-semibold font-['Nunito']">
                    {lang === 'id' ? 'Tidak ada data tersedia' : lang === 'th' ? 'ไม่มีข้อมูล' : 'No data available'}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowStatsModal(false)}
                className="w-full mt-6 bg-[#5CACE2] hover:opacity-90 text-white py-3 rounded-2xl text-sm font-extrabold font-['Nunito'] uppercase tracking-wide transition-all shadow-md cursor-pointer"
              >
                {lang === 'id' ? 'Tutup' : lang === 'th' ? 'ปิด' : 'Close'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};




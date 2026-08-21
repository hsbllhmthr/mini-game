import React, { useState, useRef, useEffect } from 'react';
import { LogOut, Activity } from 'lucide-react';
import type { Scenario } from '../gameConstants.js';
import { formatRoleTitle } from '../gameConstants.js';
import { Dashboard } from './Dashboard.js';

interface IndicatorChanges {
  economic_growth: number;
  government_budget: number;
  people_welfare: number;
  public_trust: number;
  environmental_quality: number;
  transparency: number;
}

interface OutcomeRevealViewProps {
  isFacilitator: boolean;
  scenario: Scenario;
  scenarioIndex: number;
  choice: string;
  vetoUsed: boolean;
  justification: string | null;
  indicatorChanges: IndicatorChanges;
  newIndicators: IndicatorChanges;
  onNextStep?: () => void;
  onCancelSession?: () => void;
  indicators?: IndicatorChanges;
  roomCode?: string;
  playerRole?: string;
}

export const OutcomeRevealView: React.FC<OutcomeRevealViewProps> = ({
  isFacilitator,
  scenario,
  scenarioIndex,
  choice,
  vetoUsed,
  justification,
  indicatorChanges,
  newIndicators,
  onNextStep,
  onCancelSession,
  indicators,
  roomCode,
  playerRole
}) => {
  const [showStatsModal, setShowStatsModal] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, []);
  const selectedOption = scenario.options[choice as 'A' | 'B' | 'C'];

  const getIndicatorLabel = (key: string) => {
    const indicatorLabels: Record<string, Record<string, string>> = {
      id: {
        economic_growth: 'Pertumbuhan Ekonomi',
        government_budget: 'Anggaran Pemerintah',
        people_welfare: 'Kesejahteraan Masyarakat',
        public_trust: 'Kepercayaan Publik',
        environmental_quality: 'Kualitas Lingkungan',
        transparency: 'Transparansi',
      },
      en: {
        economic_growth: 'Economic Growth',
        government_budget: 'Government Budget',
        people_welfare: 'People Welfare',
        public_trust: 'Public Trust',
        environmental_quality: 'Environmental Quality',
        transparency: 'Transparency',
      },
      th: {
        economic_growth: 'การเติบโตทางเศรษฐกิจ',
        government_budget: 'งบประมาณรัฐบาล',
        people_welfare: 'สวัสดิการประชาชน',
        public_trust: 'ความไว้วางใจของสาธารณชน',
        environmental_quality: 'คุณภาพสิ่งแวดล้อม',
        transparency: 'ความโปร่งใส',
      }
    };
    const lang = localStorage.getItem('tpa_lang') || 'en';
    return indicatorLabels[lang]?.[key] || key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const lang = localStorage.getItem('tpa_lang') || 'en';
  const isLastScenario = scenarioIndex >= 4;

  // 1. FACILITATOR VIEW
  if (isFacilitator) {
    return (
      <div className="relative min-h-screen w-full bg-[#0D2B40] flex flex-col justify-between items-center overflow-hidden">
        
        {/* 100% Full-Width Top Header Banner */}
        <div className="w-full bg-cyan-700 flex justify-center shrink-0 z-20">
          <div className="w-full max-w-[480px] sm:max-w-[520px] h-24 px-6 flex items-center justify-between">
            <div className="flex flex-col text-left justify-center min-w-0 pr-4">
              <h1 className="text-white text-xl sm:text-2xl font-extrabold font-['Nunito'] leading-tight truncate">
                {scenario.title}
              </h1>
              <span className="text-white text-sm font-semibold font-['Nunito'] leading-6 flex items-center gap-1.5 flex-wrap">
                <span>{lang === 'id' ? `Skenario ${scenarioIndex + 1} dari 5` : lang === 'th' ? `สถานการณ์ ${scenarioIndex + 1} จาก 5` : `Scenario ${scenarioIndex + 1} of 5`}</span>
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
              <button
                type="button"
                onClick={onCancelSession}
                className="w-12 h-12 bg-cyan-700 rounded-2xl shadow-[0px_2px_0px_0px_rgba(0,0,0,0.20)] border-2 border-black/20 flex items-center justify-center text-white cursor-pointer hover:opacity-90 active:scale-95 transition-all shrink-0"
                title="Cancel"
              >
                <LogOut className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="w-full max-w-[384px] sm:max-w-[420px] flex-grow flex flex-col items-center justify-start mx-auto px-4 py-6 space-y-6 overflow-y-auto no-scrollbar z-10">

            {/* Screen Title */}
            <div className="w-full text-center shrink-0">
              <h2 className="text-white text-xl font-extrabold font-['Nunito'] leading-9">
                {lang === 'id' ? 'Keputusan Eksekutif' : lang === 'th' ? 'การตัดสินใจของผู้บริหาร' : 'Executive Decision'}
              </h2>
            </div>

            {/* Decision Card Box */}
            <div className="w-full bg-gray-800 rounded-xl shadow-[0px_2px_0px_0px_rgba(52,55,64,1.00)] outline outline-2 outline-offset-[-2px] outline-zinc-700 p-5 flex flex-col gap-4 text-left shrink-0">
              {/* Option Row */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 shrink-0 rounded-2xl bg-red-500 shadow-[0px_2px_0px_0px_rgba(0,0,0,0.20)] border-2 border-black/20 flex justify-center items-center text-white text-2xl font-extrabold font-['Nunito']">
                  {choice}
                </div>
                <div className="flex flex-col gap-1 min-w-0 pt-0.5">
                  <span className="text-white text-base font-extrabold font-['Nunito'] leading-tight">
                    {selectedOption.label}
                  </span>
                  <p className="text-zinc-400 text-xs font-semibold font-['Nunito'] leading-relaxed">
                    {selectedOption.description}
                  </p>
                </div>
              </div>

              {/* Veto Banner — only shown if vetoUsed */}
              {vetoUsed && (
                <>
                  <div className="w-full h-0.5 bg-zinc-700" />
                  <div className="w-full bg-amber-700/80 rounded-xl p-4 flex flex-col gap-1 border border-amber-500/50">
                    <span className="text-white text-xl font-extrabold font-['Nunito'] leading-5">
                      {lang === 'id' ? 'Veto Walikota Digunakan' : lang === 'th' ? 'มีการใช้วีโต้ของนายกเทศมนตรี' : "Mayor's Veto Invoked"}
                    </span>
                    <p className="text-white text-sm font-medium font-['Inter'] leading-relaxed">
                      "{justification}"
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* City Indicator Adjustments */}
            <div className="w-full space-y-2 shrink-0">
              <h3 className="text-white text-xl font-extrabold font-['Nunito'] leading-9 text-center w-full">
                {lang === 'id' ? 'Penyesuaian Indikator Kota' : lang === 'th' ? 'การปรับเปลี่ยนตัวชี้วัดของเมือง' : 'City Indicator Adjustments'}
              </h3>

              <div className="w-full bg-gray-800 rounded-xl border-2 border-zinc-700 overflow-hidden text-left">
                {Object.entries(indicatorChanges).map(([key, change], idx, arr) => {
                  const finalVal = newIndicators[key as keyof IndicatorChanges];
                  return (
                    <div key={key} className="flex flex-col">
                      <div className="flex items-center justify-between px-5 py-3.5 gap-3">
                        <span className="text-amber-500 text-xl sm:text-2xl font-extrabold font-['Nunito'] w-10 text-center shrink-0">
                          {finalVal}
                        </span>
                        <span className="text-white text-base font-extrabold font-['Nunito'] flex-1 leading-snug">
                          {getIndicatorLabel(key)}
                        </span>
                        <span className={`text-base font-extrabold font-['Nunito'] w-10 text-right shrink-0 ${change >= 0 ? 'text-[#5CACE2]' : 'text-red-400'}`}>
                          {change >= 0 ? `+${change}` : change}
                        </span>
                      </div>
                      {idx < arr.length - 1 && <div className="w-full h-0.5 bg-zinc-700" />}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Realized Advantages */}
            <div className="w-full space-y-2 shrink-0 text-left">
              <h3 className="text-white text-xl font-extrabold font-['Nunito'] leading-9">
                {lang === 'id' ? 'Keuntungan yang Direalisasikan' : lang === 'th' ? 'ผลประโยชน์ที่ได้รับจริง' : 'Realized Advantages'}
              </h3>
              <div className="w-full bg-gray-800 rounded-xl outline outline-2 outline-offset-[-2px] outline-zinc-700 p-5">
                <p className="text-white text-sm font-medium font-['Inter'] leading-relaxed">
                  {selectedOption.advantages}
                </p>
              </div>
            </div>

            {/* Realized Risks */}
            <div className="w-full space-y-2 shrink-0 text-left">
              <h3 className="text-white text-xl font-extrabold font-['Nunito'] leading-9">
                {lang === 'id' ? 'Risiko yang Direalisasikan' : lang === 'th' ? 'ความเสี่ยงที่เกิดขึ้นจริง' : 'Realized Risks'}
              </h3>
              <div className="w-full bg-gray-800 rounded-xl outline outline-2 outline-offset-[-2px] outline-zinc-700 p-5">
                <p className="text-white text-sm font-medium font-['Inter'] leading-relaxed">
                  {selectedOption.risks}
                </p>
              </div>
            </div>

            {/* Proceed Button */}
            <button
              type="button"
              onClick={onNextStep}
              data-button="Primary"
              className="w-full h-12 p-2.5 bg-[#5CACE2] rounded-xl shadow-[0px_4px_0px_0px_rgba(36,112,162,1.00)] text-white text-sm font-extrabold font-['Nunito'] uppercase tracking-wide hover:opacity-90 active:translate-y-0.5 transition-all cursor-pointer flex justify-center items-center shrink-0 mt-4"
            >
              {isLastScenario ? (
                lang === 'id' ? 'SELESAIKAN GAME & LIHAT SKOR' : lang === 'th' ? 'สรุปคะแนนและจบเกม' : 'Compute Final Scores & End Game'
              ) : (
                lang === 'id' ? `LANJUT KE SKENARIO ${scenarioIndex + 2}` : lang === 'th' ? `ดำเนินการต่อไปยังสถานการณ์ที่ ${scenarioIndex + 2}` : `Proceed to Scenario ${scenarioIndex + 2}`
              )}
            </button>

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
  }

  // 2. PLAYER VIEW
  return (
    <div className="relative min-h-screen w-full bg-[#0D2B40] flex flex-col justify-between items-center overflow-hidden">
      
      {/* 100% Full-Width Top Header Banner */}
      <div className="w-full bg-cyan-700 flex justify-center shrink-0 z-20">
        <div className="w-full max-w-[480px] sm:max-w-[520px] h-24 px-6 flex items-center justify-between">
          <div className="flex flex-col text-left justify-center min-w-0 pr-4">
            <h1 className="text-white text-xl sm:text-2xl font-extrabold font-['Nunito'] leading-tight truncate">
              {scenario.title}
            </h1>
            <span className="text-white text-base sm:text-lg font-bold font-['Nunito'] leading-6 flex items-center gap-1.5 flex-wrap">
              <span>{lang === 'id' ? `Skenario ${scenarioIndex + 1} dari 5` : lang === 'th' ? `สถานการณ์ ${scenarioIndex + 1} จาก 5` : `Scenario ${scenarioIndex + 1} of 5`}</span>
              {playerRole && (
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
              onClick={() => setShowStatsModal(true)}
              className="w-12 h-12 bg-cyan-700 rounded-2xl shadow-[0px_2px_0px_0px_rgba(0,0,0,0.20)] border-2 border-black/20 flex items-center justify-center text-white cursor-pointer hover:opacity-90 active:scale-95 transition-all shrink-0"
              title="View Stats"
            >
              <Activity className="w-5 h-5 text-white" />
            </button>
            <button
              type="button"
              onClick={onCancelSession}
              className="w-12 h-12 bg-cyan-700 rounded-2xl shadow-[0px_2px_0px_0px_rgba(0,0,0,0.20)] border-2 border-black/20 flex items-center justify-center text-white cursor-pointer hover:opacity-90 active:scale-95 transition-all shrink-0"
              title="Cancel"
            >
              <LogOut className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="w-full max-w-[384px] sm:max-w-[420px] flex-grow flex flex-col items-center justify-start mx-auto px-4 py-6 space-y-6 overflow-y-auto no-scrollbar z-10">

          {/* Screen Title */}
          <div className="w-full text-center shrink-0">
            <h2 className="text-white text-xl font-extrabold font-['Nunito'] leading-9">
              {lang === 'id' ? 'Keputusan Eksekutif' : lang === 'th' ? 'การตัดสินใจของผู้บริหาร' : 'Executive Decision'}
            </h2>
          </div>

          {/* Decision Card Box */}
          <div className="w-full bg-gray-800 rounded-xl shadow-[0px_2px_0px_0px_rgba(52,55,64,1.00)] outline outline-2 outline-offset-[-2px] outline-zinc-700 p-5 flex flex-col gap-4 text-left shrink-0">
            {/* Option Row */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 shrink-0 rounded-2xl bg-red-500 shadow-[0px_2px_0px_0px_rgba(0,0,0,0.20)] border-2 border-black/20 flex justify-center items-center text-white text-2xl font-extrabold font-['Nunito']">
                {choice}
              </div>
              <div className="flex flex-col gap-1 min-w-0 pt-0.5">
                <span className="text-white text-base font-extrabold font-['Nunito'] leading-tight">
                  {selectedOption.label}
                </span>
                <p className="text-zinc-400 text-xs font-semibold font-['Nunito'] leading-relaxed">
                  {selectedOption.description}
                </p>
              </div>
            </div>

            {/* Veto Banner — only shown if vetoUsed */}
            {vetoUsed && (
              <>
                <div className="w-full h-0.5 bg-zinc-700" />
                <div className="w-full bg-amber-700/80 rounded-xl p-4 flex flex-col gap-1 border border-amber-500/50">
                  <span className="text-white text-xl font-extrabold font-['Nunito'] leading-5">
                    {lang === 'id' ? 'Veto Walikota Digunakan' : lang === 'th' ? 'มีการใช้วีโต้ของนายกเทศมนตรี' : "Mayor's Veto Invoked"}
                  </span>
                  <p className="text-white text-sm font-medium font-['Inter'] leading-relaxed">
                    "{justification}"
                  </p>
                </div>
              </>
            )}
          </div>

          {/* City Indicator Adjustments */}
          <div className="w-full space-y-2 shrink-0">
            <h3 className="text-white text-xl font-extrabold font-['Nunito'] leading-9 text-center w-full">
              {lang === 'id' ? 'Penyesuaian Indikator Kota' : lang === 'th' ? 'การปรับเปลี่ยนตัวชี้วัดของเมือง' : 'City Indicator Adjustments'}
            </h3>

            <div className="w-full bg-gray-800 rounded-xl border-2 border-zinc-700 overflow-hidden text-left">
              {Object.entries(indicatorChanges).map(([key, change], idx, arr) => {
                const finalVal = newIndicators[key as keyof IndicatorChanges];
                return (
                  <div key={key} className="flex flex-col">
                    <div className="flex items-center justify-between px-5 py-3.5 gap-3">
                      <span className="text-amber-500 text-xl sm:text-2xl font-extrabold font-['Nunito'] w-10 text-center shrink-0">
                        {finalVal}
                      </span>
                      <span className="text-white text-base font-extrabold font-['Nunito'] flex-1 leading-snug">
                        {getIndicatorLabel(key)}
                      </span>
                      <span className={`text-base font-extrabold font-['Nunito'] w-10 text-right shrink-0 ${change >= 0 ? 'text-[#5CACE2]' : 'text-red-400'}`}>
                        {change >= 0 ? `+${change}` : change}
                      </span>
                    </div>
                    {idx < arr.length - 1 && <div className="w-full h-0.5 bg-zinc-700" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Realized Advantages */}
          <div className="w-full space-y-2 shrink-0 text-left">
            <h3 className="text-white text-xl font-extrabold font-['Nunito'] leading-9">
              {lang === 'id' ? 'Keuntungan yang Direalisasikan' : lang === 'th' ? 'ผลประโยชน์ที่ได้รับจริง' : 'Realized Advantages'}
            </h3>
            <div className="w-full bg-gray-800 rounded-xl outline outline-2 outline-offset-[-2px] outline-zinc-700 p-5">
              <p className="text-white text-sm font-medium font-['Inter'] leading-relaxed">
                {selectedOption.advantages}
              </p>
            </div>
          </div>

          {/* Realized Risks */}
          <div className="w-full space-y-2 shrink-0 text-left">
            <h3 className="text-white text-xl font-extrabold font-['Nunito'] leading-9">
              {lang === 'id' ? 'Risiko yang Direalisasikan' : lang === 'th' ? 'ความเสี่ยงที่เกิดขึ้นจริง' : 'Realized Risks'}
            </h3>
            <div className="w-full bg-gray-800 rounded-xl outline outline-2 outline-offset-[-2px] outline-zinc-700 p-5">
              <p className="text-white text-sm font-medium font-['Inter'] leading-relaxed">
                {selectedOption.risks}
              </p>
            </div>
          </div>

          {/* Awaiting Facilitator Wait Statement */}
          <div className="w-full text-center py-5 px-4 shrink-0 mt-auto space-y-3">
            <div className="flex items-center justify-center gap-1.5 mb-2.5">
              <span className="inline-block w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="inline-block w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="inline-block w-1.5 h-1.5 bg-white rounded-full animate-bounce" />
            </div>
            <div className="text-sm font-extrabold font-['Nunito'] text-slate-200 leading-snug max-w-xs mx-auto">
              {lang === 'id' ? 'Menunggu fasilitator melanjutkan sesi...' : lang === 'th' ? 'กำลังรอผู้ดำเนินรายการดำเนินการเซสชันต่อ...' : 'Awaiting facilitator to advance the session...'}
            </div>
          </div>

          <div className="h-4 shrink-0" />
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
              {!isFacilitator && playerRole && (
                <div className="mb-3 px-3.5 py-2 bg-amber-500/20 border border-amber-500/40 rounded-xl flex items-center justify-between text-xs font-bold font-['Nunito'] text-amber-300">
                  <span>{lang === 'id' ? 'Peran Anda:' : lang === 'th' ? 'บทบาทของคุณ:' : 'Your Role:'}</span>
                  <span className="uppercase tracking-wider font-extrabold text-amber-300">{formatRoleTitle(playerRole, lang)}</span>
                </div>
              )}
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
  );
};

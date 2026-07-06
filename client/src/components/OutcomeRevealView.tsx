import React, { useState, useRef, useEffect } from 'react';
import { LogOut, Activity } from 'lucide-react';
import type { Scenario } from '../gameConstants.js';
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
  indicators
}) => {
  const [showStatsModal, setShowStatsModal] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, []);
  const selectedOption = scenario.options[choice as 'A' | 'B' | 'C'];

  const getIndicatorLabel = (key: string) => {
    return key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  // 1. FACILITATOR VIEW
  if (isFacilitator) {
    const lang = localStorage.getItem('tpa_lang') || 'en';
    const isLastScenario = scenarioIndex === 2;

    return (
      <div className="min-h-screen w-full flex justify-center items-start">
        <div className="relative w-full sm:max-w-[480px] min-h-screen bg-white flex flex-col overflow-visible">

          {/* Top Header */}
          <div className="w-full h-24 bg-lime-600 px-[40px] flex items-center justify-between shrink-0 relative">
            <div className="flex flex-col text-left justify-center min-w-0 pr-4">
              <div className="text-white text-2xl font-extrabold font-['Nunito'] truncate leading-tight">
                {scenario.title}
              </div>
              <div className="text-white text-sm font-semibold font-['Nunito'] leading-6 mt-0.5">
                {lang === 'id' ? `Skenario ${scenarioIndex + 1} dari 3` : `Scenario ${scenarioIndex + 1} of 3`}
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
              <button
                type="button"
                onClick={onCancelSession}
                className="w-12 h-12 rounded-2xl bg-lime-600 shadow-[0px_2px_0px_0px_rgba(0,0,0,0.20)] border-2 border-black/20 hover:bg-lime-700 transition-all flex justify-center items-center cursor-pointer"
              >
                <LogOut className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-grow flex flex-col gap-5 px-[35px] py-[22px]">

            {/* Badge + Title */}
            <div className="flex flex-col items-center gap-1">
              <div className="h-8 px-5 bg-neutral-200 rounded-[59px] flex items-center justify-center">
                <span className="text-zinc-400 text-[10px] font-extrabold font-['Nunito'] leading-9 tracking-wider uppercase">
                  {lang === 'id' ? 'HASIL KEBIJAKAN TERUNGKAP' : 'POLICY OUTCOME REVEALED'}
                </span>
              </div>
              <div className="text-neutral-600 text-xl font-extrabold font-['Nunito'] leading-9 text-center">
                {lang === 'id' ? 'Keputusan Eksekutif' : 'Executive Decision'}
              </div>
            </div>

            {/* Decision Card */}
            <div className="w-full bg-white rounded-xl shadow-[0px_2px_0px_0px_rgba(229,229,229,1.00)] outline outline-2 outline-offset-[-2px] outline-neutral-200 p-[18px] flex flex-col gap-3">
              {/* Option row */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 shrink-0 rounded-2xl bg-white shadow-[0px_2px_0px_0px_rgba(0,0,0,0.20)] border-2 border-black/20 flex justify-center items-center">
                  <span className="text-stone-300 text-2xl font-extrabold font-['Nunito'] leading-4">{choice}</span>
                </div>
                <div className="flex flex-col gap-1 min-w-0 pt-1">
                  <span className="text-neutral-600 text-base font-extrabold font-['Nunito'] leading-4">
                    {selectedOption.label}
                  </span>
                  <p className="text-zinc-400 text-xs font-semibold font-['Nunito'] leading-4 mt-1">
                    {selectedOption.description}
                  </p>
                </div>
              </div>

              {/* Divider and Veto banner — only shown if vetoUsed */}
              {vetoUsed && (
                <>
                  <div className="-mx-[18px] h-0.5 bg-neutral-200" />
                  <div className="w-full bg-orange-100 rounded-xl border-2 border-amber-500 p-4 flex flex-col gap-1">
                    <span className="text-amber-500 text-xl font-extrabold font-['Nunito'] leading-5">
                      {lang === 'id' ? 'Veto Walikota Digunakan' : "Mayor's Veto Invoked"}
                    </span>
                    <p className="text-amber-500 text-sm font-medium font-['Inter'] leading-6">
                      "{justification}"
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* City Indicator Adjustments */}
            <div className="flex flex-col gap-2">
              <span className="text-neutral-600 text-xl font-extrabold font-['Nunito'] leading-9">
                {lang === 'id' ? 'Penyesuaian Indikator Kota' : 'City Indicator Adjustments'}
              </span>

              <div className="w-full bg-white rounded-xl border-2 border-neutral-200 overflow-hidden">
                {Object.entries(indicatorChanges).map(([key, change], idx, arr) => {
                  const finalVal = newIndicators[key as keyof IndicatorChanges];
                  return (
                    <div key={key} className="flex flex-col">
                      <div className="flex items-center justify-between px-5 py-3">
                        <div className="flex items-center gap-4">
                          <span className="text-red-500 text-3xl font-extrabold font-['Nunito'] w-10 text-center shrink-0">
                            {finalVal}
                          </span>
                          <span className="text-neutral-600 text-base font-extrabold font-['Nunito'] leading-4">
                            {getIndicatorLabel(key)}
                          </span>
                        </div>
                        <span className={`text-lg font-extrabold font-['Nunito'] w-8 text-center ${change >= 0 ? 'text-lime-500' : 'text-red-500'}`}>
                          {change >= 0 ? `+${change}` : change}
                        </span>
                      </div>
                      {idx < arr.length - 1 && <div className="w-full h-0.5 bg-neutral-200" />}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Realized Advantages */}
            <div className="flex flex-col gap-1">
              <span className="text-neutral-600 text-xl font-extrabold font-['Nunito'] leading-9">
                {lang === 'id' ? 'Keuntungan yang Direalisasikan' : 'Realized Advantages'}
              </span>
              <div className="w-full bg-neutral-100 rounded-xl outline outline-2 outline-offset-[-2px] outline-neutral-200 overflow-hidden px-5 py-3">
                <p className="text-neutral-500 text-sm font-medium font-['Inter'] leading-6">
                  {selectedOption.advantages}
                </p>
              </div>
            </div>

            {/* Realized Risks */}
            <div className="flex flex-col gap-1">
              <span className="text-neutral-600 text-xl font-extrabold font-['Nunito'] leading-9">
                {lang === 'id' ? 'Risiko yang Direalisasikan' : 'Realized Risks'}
              </span>
              <div className="w-full bg-neutral-100 rounded-xl outline outline-2 outline-offset-[-2px] outline-neutral-200 overflow-hidden px-5 py-3">
                <p className="text-neutral-500 text-sm font-medium font-['Inter'] leading-6">
                  {selectedOption.risks}
                </p>
              </div>
            </div>

            {/* Proceed Button */}
            <button
              type="button"
              onClick={onNextStep}
              className="w-full h-12 bg-lime-600 rounded-xl shadow-[0px_4px_0px_0px_#46A302] text-white text-sm font-extrabold font-['Nunito'] uppercase tracking-wide hover:bg-lime-700 active:translate-y-px transition-all cursor-pointer"
            >
              {isLastScenario ? (
                lang === 'id' ? 'SELESAIKAN GAME & LIHAT SKOR' : 'Compute Final Scores & End Game'
              ) : (
                lang === 'id' ? `LANJUT KE SKENARIO ${scenarioIndex + 2}` : `Proceed to Scenario ${scenarioIndex + 2}`
              )}
            </button>

            <div className="h-2 shrink-0" />
          </div>
        </div>

        {/* Stats Modal Overlay */}
        {showStatsModal && (
          <div className="absolute inset-0 z-50 bg-slate-950/40 backdrop-blur-sm animate-fade-in flex justify-center items-center p-4">
            <div className="w-[410px] max-h-[90%] bg-white rounded-xl shadow-2xl border-2 border-neutral-200 outline outline-2 outline-offset-[-2px] outline-neutral-200 p-6 overflow-y-auto flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-neutral-200 pb-3 mb-4">
                  <span className="text-neutral-600 text-base font-extrabold font-['Nunito']">
                    City Indicators
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowStatsModal(false)}
                    className="text-xs font-bold text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
                {indicators ? (
                  <Dashboard indicators={indicators} flat />
                ) : (
                  <div className="text-center py-6 text-neutral-500 font-semibold">No data available</div>
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowStatsModal(false)}
                className="w-full h-12 bg-lime-600 hover:bg-lime-700 text-white text-sm font-extrabold uppercase tracking-wide rounded-xl shadow-[0px_4px_0px_0px_#46A302] transition-all flex justify-center items-center cursor-pointer active:translate-y-1 active:shadow-none mt-6"
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
  const lang = localStorage.getItem('tpa_lang') || 'en';

  return (
    <div className="min-h-screen w-full flex justify-center items-start">
      <div className="relative w-full sm:max-w-[480px] min-h-screen bg-white flex flex-col overflow-visible">

        {/* Top Header */}
        <div className="w-full h-24 bg-lime-600 px-[40px] flex items-center justify-between shrink-0 relative">
          <div className="flex flex-col text-left justify-center min-w-0 pr-4">
            <div className="text-white text-2xl font-extrabold font-['Nunito'] truncate leading-tight">
              {scenario.title}
            </div>
            <div className="text-white text-sm font-semibold font-['Nunito'] leading-6 mt-0.5">
              {lang === 'id' ? `Skenario ${scenarioIndex + 1} dari 3` : `Scenario ${scenarioIndex + 1} of 3`}
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
            <button
              type="button"
              onClick={onCancelSession}
              className="w-12 h-12 rounded-2xl bg-lime-600 shadow-[0px_2px_0px_0px_rgba(0,0,0,0.20)] border-2 border-black/20 hover:bg-lime-700 transition-all flex justify-center items-center cursor-pointer"
            >
              <LogOut className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-grow flex flex-col gap-5 px-[35px] py-[22px]">

          {/* Badge + Title */}
          <div className="flex flex-col items-center gap-1">
            <div className="h-8 px-5 bg-neutral-200 rounded-[59px] flex items-center justify-center">
              <span className="text-zinc-400 text-[10px] font-extrabold font-['Nunito'] leading-9 tracking-wider uppercase">
                {lang === 'id' ? 'HASIL KEBIJAKAN TERUNGKAP' : 'POLICY OUTCOME REVEALED'}
              </span>
            </div>
            <div className="text-neutral-600 text-xl font-extrabold font-['Nunito'] leading-9 text-center">
              {lang === 'id' ? 'Keputusan Eksekutif' : 'Executive Decision'}
            </div>
          </div>

          {/* Decision Card */}
          <div className="w-full bg-white rounded-xl shadow-[0px_2px_0px_0px_rgba(229,229,229,1.00)] outline outline-2 outline-offset-[-2px] outline-neutral-200 p-[18px] flex flex-col gap-3">
            {/* Option row */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 shrink-0 rounded-2xl bg-white shadow-[0px_2px_0px_0px_rgba(0,0,0,0.20)] border-2 border-black/20 flex justify-center items-center">
                <span className="text-stone-300 text-2xl font-extrabold font-['Nunito'] leading-4">{choice}</span>
              </div>
              <div className="flex flex-col gap-1 min-w-0 pt-1">
                <span className="text-neutral-600 text-base font-extrabold font-['Nunito'] leading-4">
                  {selectedOption.label}
                </span>
                <p className="text-zinc-400 text-xs font-semibold font-['Nunito'] leading-4 mt-1">
                  {selectedOption.description}
                </p>
              </div>
            </div>

            {/* Divider and Veto banner — only shown if vetoUsed */}
            {vetoUsed && (
              <>
                <div className="-mx-[18px] h-0.5 bg-neutral-200" />
                <div className="w-full bg-orange-100 rounded-xl border-2 border-amber-500 p-4 flex flex-col gap-1">
                  <span className="text-amber-500 text-xl font-extrabold font-['Nunito'] leading-5">
                    {lang === 'id' ? 'Veto Walikota Digunakan' : "Mayor's Veto Invoked"}
                  </span>
                  <p className="text-amber-500 text-sm font-medium font-['Inter'] leading-6">
                    "{justification}"
                  </p>
                </div>
              </>
            )}
          </div>

          {/* City Indicator Adjustments */}
          <div className="flex flex-col gap-2">
            <span className="text-neutral-600 text-xl font-extrabold font-['Nunito'] leading-9">
              {lang === 'id' ? 'Penyesuaian Indikator Kota' : 'City Indicator Adjustments'}
            </span>

            <div className="w-full bg-white rounded-xl border-2 border-neutral-200 overflow-hidden">
              {Object.entries(indicatorChanges).map(([key, change], idx, arr) => {
                const finalVal = newIndicators[key as keyof IndicatorChanges];
                return (
                  <div key={key} className="flex flex-col">
                    <div className="flex items-center justify-between px-5 py-3">
                      <div className="flex items-center gap-4">
                        <span className="text-red-500 text-3xl font-extrabold font-['Nunito'] w-10 text-center shrink-0">
                          {finalVal}
                        </span>
                        <span className="text-neutral-600 text-base font-extrabold font-['Nunito'] leading-4">
                          {getIndicatorLabel(key)}
                        </span>
                      </div>
                      <span className={`text-lg font-extrabold font-['Nunito'] w-8 text-center ${change >= 0 ? 'text-lime-500' : 'text-red-500'}`}>
                        {change >= 0 ? `+${change}` : change}
                      </span>
                    </div>
                    {idx < arr.length - 1 && <div className="w-full h-0.5 bg-neutral-200" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Realized Advantages */}
          <div className="flex flex-col gap-1">
            <span className="text-neutral-600 text-xl font-extrabold font-['Nunito'] leading-9">
              {lang === 'id' ? 'Keuntungan yang Direalisasikan' : 'Realized Advantages'}
            </span>
            <div className="w-full bg-neutral-100 rounded-xl outline outline-2 outline-offset-[-2px] outline-neutral-200 overflow-hidden px-5 py-3">
              <p className="text-neutral-500 text-sm font-medium font-['Inter'] leading-6">
                {selectedOption.advantages}
              </p>
            </div>
          </div>

          {/* Realized Risks */}
          <div className="flex flex-col gap-1">
            <span className="text-neutral-600 text-xl font-extrabold font-['Nunito'] leading-9">
              {lang === 'id' ? 'Risiko yang Direalisasikan' : 'Realized Risks'}
            </span>
            <div className="w-full bg-neutral-100 rounded-xl outline outline-2 outline-offset-[-2px] outline-neutral-200 overflow-hidden px-5 py-3">
              <p className="text-neutral-500 text-sm font-medium font-['Inter'] leading-6">
                {selectedOption.risks}
              </p>
            </div>
          </div>

          {/* Awaiting Facilitator Wait Statement */}
          <div className="text-center py-5 bg-white border border-dashed border-neutral-200 rounded-2xl max-w-md mx-auto w-full flex items-center justify-center gap-2.5">
            <span className="inline-block w-2.5 h-2.5 bg-lime-500 rounded-full animate-ping" />
            <span className="text-xs font-extrabold text-neutral-400 font-['Nunito'] uppercase tracking-wider">
              {lang === 'id' ? 'Menunggu fasilitator melanjutkan sesi...' : 'Awaiting facilitator to advance the session...'}
            </span>
          </div>

          <div className="h-2 shrink-0" />
        </div>
      </div>

      {/* Stats Modal Overlay */}
      {showStatsModal && (
        <div className="absolute inset-0 z-50 bg-slate-950/40 backdrop-blur-sm animate-fade-in flex justify-center items-center p-4">
          <div className="w-[410px] max-h-[90%] bg-white rounded-3xl p-6 shadow-2xl overflow-y-auto border-2 border-neutral-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <span className="text-lg font-black text-slate-800 uppercase tracking-wider">
                  City Indicators
                </span>
                <button
                  type="button"
                  onClick={() => setShowStatsModal(false)}
                  className="text-sm font-bold text-neutral-400 hover:text-neutral-600 cursor-pointer"
                >
                  Close
                </button>
              </div>
              {indicators ? (
                <Dashboard indicators={indicators} />
              ) : (
                <div className="text-center py-6 text-neutral-500 font-semibold">No data available</div>
              )}
            </div>
            <button
              type="button"
              onClick={() => setShowStatsModal(false)}
              className="w-full mt-6 bg-lime-600 hover:bg-lime-700 text-white py-3 rounded-2xl text-sm font-bold transition-all shadow-[0px_2px_0px_0px_rgba(0,0,0,0.20)] border-2 border-black/20 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

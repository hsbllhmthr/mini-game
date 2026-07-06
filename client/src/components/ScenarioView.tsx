import React, { useState } from 'react';
import { ChevronDown, ChevronUp, LogOut, Activity } from 'lucide-react';
import type { Scenario } from '../gameConstants.js';
import { Dashboard } from './Dashboard.js';
import type { Indicators } from './Dashboard.js';

interface ScenarioViewProps {
  isFacilitator: boolean;
  scenarioIndex: number;
  scenario: Scenario;
  indicators?: Indicators;
  onStartDiscussion?: (durationSeconds: number) => void;
  onCancelSession?: () => void;
}

export const ScenarioView: React.FC<ScenarioViewProps> = ({
  isFacilitator,
  scenarioIndex,
  scenario,
  indicators,
  onStartDiscussion,
  onCancelSession
}) => {
  const [selectedDuration, setSelectedDuration] = useState(7); // 7 minutes default
  const [showPositions, setShowPositions] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);

  const formatRoleName = (role: string) => {
    return role.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const optionKeys = ['A', 'B', 'C'] as const;

  return (
    <div className="min-h-screen w-full flex justify-center items-start font-['Nunito']">
      <div className="relative w-full sm:max-w-[480px] min-h-screen overflow-hidden bg-white flex flex-col">
        {/* Top Header */}
        <div className="w-full h-24 bg-lime-600 px-[35px] flex items-center justify-between shrink-0 relative">
          <div className="flex flex-col text-left justify-center min-w-0 pr-4">
            <div className="text-white text-lg sm:text-2xl font-extrabold font-['Nunito'] truncate leading-tight">
              {scenario.title}
            </div>
            <div className="text-lime-100 text-xs sm:text-sm font-semibold font-['Nunito'] leading-normal mt-0.5">
              Scenario {scenarioIndex + 1} of 3
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
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

        <style>{`
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {/* Scrollable Content Container */}
        <div 
          className="flex-grow overflow-y-auto no-scrollbar px-[35px] py-6 space-y-6"
          style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
        >
          {/* Challenge Statement */}
          <div className="w-full">
            <div className="text-neutral-600 text-xl font-extrabold font-['Nunito'] mb-3 text-left">
              Challenge Statement
            </div>
            <div className="w-full p-5 bg-white rounded-xl border-2 border-neutral-200 text-left text-sm text-neutral-500 font-semibold leading-relaxed">
              {scenario.challengeSummary}
            </div>
          </div>

          {/* Options A, B, C */}
          {optionKeys.map((key) => {
            const opt = scenario.options[key];
            return (
              <div 
                key={key}
                className="relative w-full p-6 bg-white rounded-xl shadow-[0px_2px_0px_0px_rgba(229,229,229,1.00)] border-2 border-neutral-200 flex flex-col space-y-4 text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-[0px_2px_0px_0px_rgba(0,0,0,0.20)] border-2 border-black/20 flex justify-center items-center shrink-0">
                    <span className="text-stone-300 text-2xl font-extrabold font-['Nunito']">{key}</span>
                  </div>
                  <div>
                    <div className="text-neutral-600 text-base font-extrabold font-['Nunito'] leading-tight">{opt.label}</div>
                    <div className="text-zinc-400 text-xs font-semibold leading-normal mt-1">{opt.description}</div>
                  </div>
                </div>
                
                <div className="h-[1px] bg-neutral-200 -mx-6" />
                
                <div className="space-y-3 text-xs">
                  <div>
                    <div className="text-sky-500 text-xs font-bold font-['Nunito'] mb-1">Advantages</div>
                    <div className="text-zinc-400 font-semibold leading-relaxed">{opt.advantages}</div>
                  </div>
                  <div>
                    <div className="text-red-500 text-xs font-bold font-['Nunito'] mb-1">Risks</div>
                    <div className="text-zinc-400 font-semibold leading-relaxed">{opt.risks}</div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Stakeholder Positions Accordion */}
          <div className="w-full bg-neutral-100 rounded-xl border-2 border-neutral-200 overflow-hidden">
            <button
              type="button"
              onClick={() => setShowPositions(!showPositions)}
              className="w-full flex items-center justify-between px-6 py-3 text-neutral-500 text-sm font-medium font-['Inter'] leading-6 cursor-pointer"
            >
              <span>Stakeholder Briefings & Positions</span>
              {showPositions ? <ChevronUp className="w-5 h-5 text-zinc-500" /> : <ChevronDown className="w-5 h-5 text-zinc-500" />}
            </button>
            {showPositions && (
              <div className="px-6 pb-4 bg-neutral-50 space-y-4 max-h-[300px] overflow-y-auto pt-2 text-left">
                {Object.entries(scenario.stakeholderPositions).map(([role, position]) => (
                  <div key={role} className="border-b border-neutral-200/60 last:border-0 pb-2">
                    <span className="font-extrabold text-neutral-600 text-xs uppercase tracking-wider block mb-1">
                      {formatRoleName(role)}
                    </span>
                    <p className="text-zinc-400 text-xs font-semibold leading-relaxed">
                      {position}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom section (controls for facilitator, wait message for player) */}
          {isFacilitator ? (
            <>
              {/* Discussion Session Settings */}
              <div className="space-y-4 text-left w-full">
                <div className="text-neutral-600 text-xl font-extrabold font-['Nunito']">
                  Discussion Session Setting
                </div>
                
                <div className="w-full h-12 bg-neutral-100 rounded-xl border-2 border-neutral-200 flex items-center justify-between px-6 relative cursor-pointer hover:bg-neutral-200/50 transition-colors">
                  <span className="text-neutral-500 text-sm font-medium font-['Inter']">
                    Duration {selectedDuration} Minutes
                  </span>
                  <select
                    value={selectedDuration}
                    onChange={(e) => setSelectedDuration(parseInt(e.target.value))}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(m => (
                      <option key={m} value={m}>{m} {m === 1 ? 'Minute' : 'Minutes'}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-5 h-5 text-neutral-500 pointer-events-none" />
                </div>
              </div>

              {/* Start timed discussion */}
              <button
                type="button"
                onClick={() => onStartDiscussion?.(selectedDuration * 60)}
                className="w-full h-12 bg-lime-600 hover:bg-lime-700 text-white text-sm font-extrabold font-['Nunito'] uppercase tracking-wide rounded-xl shadow-[0px_4px_0px_0px_#46A302] transition-all flex justify-center items-center cursor-pointer active:translate-y-1 active:shadow-none"
              >
                Start timed discussion
              </button>
            </>
          ) : (
            <div className="text-center py-6 bg-white border border-dashed border-neutral-200 rounded-xl w-full shadow-sm px-6">
              <span className="inline-block w-2.5 h-2.5 bg-lime-600 rounded-full animate-ping mr-2.5" />
              <span className="text-sm font-extrabold text-neutral-500">
                Awaiting facilitator to start the discussion timer...
              </span>
              <p className="text-xs text-neutral-400 mt-1.5 font-medium leading-relaxed max-w-xs mx-auto">
                You can take this time to review the options and check other stakeholders' positions.
              </p>
            </div>
          )}
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
                  <Dashboard indicators={indicators} flat />
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
    </div>
  );
};

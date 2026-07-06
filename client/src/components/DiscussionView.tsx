import React, { useState } from 'react';
import { LogOut, Activity } from 'lucide-react';
import { Dashboard } from './Dashboard.js';
import type { Indicators } from './Dashboard.js';

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
  const [showStatsModal, setShowStatsModal] = useState(false);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-start font-['Nunito']">
      <div className="relative w-full sm:max-w-[480px] min-h-screen overflow-hidden bg-white flex flex-col">
        
        {/* Header */}
        <div className="w-full h-24 bg-lime-600 px-[35px] flex items-center justify-between shrink-0 relative">
          <div className="flex flex-col text-left justify-center min-w-0 pr-4">
            <div className="text-white text-lg sm:text-2xl font-extrabold font-['Nunito'] truncate leading-tight">
              {scenarioTitle}
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

        {/* Central Content Area */}
        <div className="flex-grow overflow-y-auto no-scrollbar px-[35px] py-8 flex flex-col justify-between items-center text-center">
          
          {/* Badge & Info Group */}
          <div className="w-full flex flex-col items-center space-y-4">
            <div className="bg-neutral-200 rounded-full h-8 px-5 flex items-center justify-center text-zinc-500 text-[10px] font-extrabold font-['Nunito'] tracking-wider whitespace-nowrap">
              FACE TO FACE DELIBERATION
            </div>

            <div className="space-y-3 w-full">
              <h2 className="text-neutral-600 text-xl font-extrabold leading-tight">
                Assembly Deliberation
              </h2>
              <p className="text-zinc-400 text-sm font-medium leading-relaxed max-w-sm mx-auto">
                Deliberate with other delegates in the room. Negotiate alliances, discuss advantages and risks, and prepare your voting strategy.
              </p>
            </div>
          </div>

          {/* Timer Display Group */}
          <div className="flex flex-col items-center my-auto py-8">
            <div className="text-neutral-600 text-7xl sm:text-8xl font-black leading-none mb-2">
              {formatTime(secondsRemaining)}
            </div>
            <div className="text-zinc-400 text-xs sm:text-sm font-extrabold tracking-widest uppercase">
              TIME REMAINING
            </div>
          </div>

          {/* Facilitator Action Button */}
          {isFacilitator && onEndDiscussionEarly ? (
            <div className="w-full pt-4 shrink-0">
              <button
                type="button"
                onClick={onEndDiscussionEarly}
                className="w-full h-12 bg-white rounded-xl shadow-[0px_2px_0px_0px_rgba(229,229,229,1.00)] outline outline-2 outline-offset-[-2px] outline-neutral-200 inline-flex justify-center items-center hover:bg-neutral-50 active:translate-y-px transition-all cursor-pointer"
              >
                <div className="text-sky-500 text-sm font-extrabold font-['Nunito'] uppercase tracking-wide">
                  END DISCUSSION EARLY
                </div>
              </button>
            </div>
          ) : (
            <div className="h-10 shrink-0" />
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


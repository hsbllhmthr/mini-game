import React from 'react';
import { Languages } from 'lucide-react';
import govImage from '../assets/gov.png';

interface LandingViewProps {
  onCreateRoom: () => void;
  onJoinRoom: () => void;
  lang: string;
  onSelectLanguageClick: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onCreateRoom, onJoinRoom, lang, onSelectLanguageClick }) => {
  return (
    <div className="min-h-screen w-full flex justify-center items-start font-['Nunito']">
      <div className="relative w-full sm:max-w-[480px] min-h-screen bg-white flex flex-col justify-between px-6 py-8 sm:py-12">
        
        {/* Top Header Section */}
        <div className="flex flex-col items-center w-full">
          <div className="w-full flex justify-end mb-4">
            <button
              type="button"
              onClick={onSelectLanguageClick}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-white px-3.5 text-[11px] font-black uppercase tracking-[0.1em] text-slate-600 shadow-[0px_2px_0px_0px_rgba(229,229,229,1.00)] border border-neutral-200 transition-all hover:bg-neutral-50 active:translate-y-0.5 cursor-pointer"
            >
              <Languages className="w-3.5 h-3.5 text-slate-500" />
              <span>{lang}</span>
            </button>
          </div>
          
          <div className="text-center text-xs sm:text-sm font-extrabold uppercase tracking-wider text-zinc-400 mb-2">
            Civic Education Simulation
          </div>
        </div>

        {/* Central Content (Image & Title) */}
        <div className="flex flex-col items-center my-auto py-6">
          <div className="w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center overflow-hidden mb-6">
            <img 
              src={govImage} 
              alt="City governance simulation" 
              className="w-full h-full object-cover"
            />
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold leading-snug text-neutral-600 text-center max-w-sm">
            A city governance simulation. Discuss, vote, and see the impact on your city.
          </h1>
        </div>

        {/* Action Buttons Section */}
        <div className="flex flex-col items-center w-full space-y-4">
          <button
            type="button"
            onClick={onCreateRoom}
            className="w-full h-14 inline-flex items-center justify-center rounded-xl bg-lime-600 px-5 py-3 shadow-[0px_4px_0px_0px_#46A302] hover:bg-lime-700 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
          >
            <span className="text-[15px] font-extrabold uppercase tracking-wide text-white">
              Create room (facilitator)
            </span>
          </button>

          <button
            type="button"
            onClick={onJoinRoom}
            className="w-full h-14 inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sky-500 shadow-[0px_2px_0px_0px_rgba(229,229,229,1.00)] border-2 border-neutral-200 hover:bg-neutral-50 active:translate-y-0.5 transition-all cursor-pointer"
          >
            <span className="text-[15px] font-extrabold uppercase tracking-wide">
              Join Room (Player)
            </span>
          </button>

          <div className="text-center text-xs sm:text-sm font-medium text-zinc-400 pt-2">
            No account or login needed
          </div>
        </div>

      </div>
    </div>
  );
};

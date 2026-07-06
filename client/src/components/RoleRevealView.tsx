import React, { useState } from 'react';
import { LogOut, ChevronDown, ChevronUp } from 'lucide-react';

import { SCENARIOS } from '../gameConstants.js';

export interface RoleInfo {
  role: string;
  description: string;
  objective: string;
  secret_info: string;
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
}

export const RoleRevealView: React.FC<RoleRevealViewProps> = ({
  isFacilitator,
  roleInfo,
  facilitatorPlayers = [],
  onOpenScenario,
  scenarioIndex,
  onCancelSession
}) => {
  const [revealSecret, setRevealSecret] = useState(false);
  const [visibleCount, setVisibleCount] = useState(4);

  const formatRoleName = (role: string) => {
    return role.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };


  const getRoleCardStyles = (role: string) => {
    switch (role.toLowerCase()) {
      case 'mayor': return { bg: 'bg-orange-100', border: 'border-amber-500', text: 'text-amber-500' };
      case 'journalist': return { bg: 'bg-sky-100 border-sky-200', border: 'border-sky-500', text: 'text-sky-650' };
      case 'community_rep': return { bg: 'bg-teal-100 border-teal-200', border: 'border-teal-500', text: 'text-teal-700' };
      case 'business_rep': return { bg: 'bg-yellow-50 border-amber-200', border: 'border-amber-600', text: 'text-amber-800' };
      case 'social_welfare': return { bg: 'bg-rose-100 border-rose-200', border: 'border-rose-500', text: 'text-rose-600' };
      case 'environmental': return { bg: 'bg-emerald-100 border-emerald-250', border: 'border-emerald-500', text: 'text-emerald-700' };
      case 'investor': return { bg: 'bg-purple-100 border-purple-200', border: 'border-purple-500', text: 'text-purple-600' };
      case 'youth_rep': return { bg: 'bg-pink-100 border-pink-200', border: 'border-pink-500', text: 'text-pink-600' };
      default: return { bg: 'bg-neutral-100 border-neutral-200', border: 'border-neutral-500', text: 'text-neutral-600' };
    }
  };

  if (isFacilitator) {
    const visiblePlayers = facilitatorPlayers.slice(0, visibleCount);

    return (
      <div className="min-h-screen w-full flex justify-center items-start font-['Nunito']">
        <div className="relative w-full sm:max-w-[480px] min-h-screen overflow-hidden bg-white flex flex-col">
          {/* Top Header */}
          <div className="w-full h-24 bg-lime-600 px-[35px] flex items-center justify-between shrink-0 relative">
            <div className="flex flex-col text-left justify-center min-w-0 pr-4">
              <div className="text-white text-lg sm:text-2xl font-extrabold font-['Nunito'] truncate leading-tight">
                Role Assignment Roster
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
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

          {/* Scrollable content wrapper */}
          <div 
            className="flex-grow overflow-y-auto no-scrollbar px-[35px] py-6 space-y-6 flex flex-col"
            style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
          >
            {/* Subtitle description */}
            <div className="w-full text-center justify-center text-zinc-400 text-sm font-medium font-['Nunito'] leading-relaxed shrink-0">
              Review player roles. Deliberation happens in the room. When all players are ready, open Scenario {scenarioIndex + 1}.
            </div>

            {/* Players List */}
            <div className="w-full space-y-[15px] no-scrollbar">
              {visiblePlayers.map((player) => (
                <div 
                  key={player.id} 
                  className="relative w-full h-20 bg-white rounded-xl border-2 border-neutral-200 flex items-center justify-between pl-[30px] pr-[20px] shrink-0"
                >
                  <div className="flex flex-col justify-center text-left">
                    <div className="text-neutral-600 text-xl font-extrabold font-['Nunito'] leading-5 truncate max-w-[200px]">
                      {player.fullName}
                    </div>
                    <div className="text-neutral-500 text-sm font-medium font-['Inter'] leading-6 mt-1">
                      {player.country}
                    </div>
                  </div>
                  <div className="h-7 px-3 bg-yellow-400 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-semibold font-['Inter'] leading-none">
                      {formatRoleName(player.role)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {facilitatorPlayers.length > visibleCount && (
              <button 
                type="button"
                onClick={() => setVisibleCount(prev => prev + 4)}
                className="w-full text-center text-indigo-400 text-lg font-extrabold font-['Nunito'] leading-7 hover:text-indigo-600 transition-colors cursor-pointer py-2 shrink-0"
              >
                Load More
              </button>
            )}

            {/* Action Buttons */}
            <div className="w-full space-y-4 pt-4 mt-auto shrink-0">
              <button 
                type="button"
                onClick={onOpenScenario}
                data-button="Outline-Secondary" 
                className="w-full h-12 p-2.5 bg-white rounded-xl shadow-[0px_2px_0px_0px_rgba(229,229,229,1.00)] outline outline-2 outline-offset-[-2px] outline-neutral-200 inline-flex justify-center items-center gap-2.5 hover:bg-neutral-50 active:translate-y-px transition-all cursor-pointer"
              >
                <div className="justify-start text-sky-500 text-sm font-extrabold font-['Nunito'] uppercase tracking-wide">
                  Open scenario {scenarioIndex + 1}
                </div>
              </button>

              <button 
                type="button"
                onClick={onCancelSession}
                data-button="Outline-Secondary" 
                className="w-full h-12 p-2.5 bg-white rounded-xl shadow-[0px_2px_0px_0px_rgba(229,229,229,1.00)] outline outline-2 outline-offset-[-2px] outline-neutral-200 inline-flex justify-center items-center gap-2.5 hover:bg-neutral-50 active:translate-y-px transition-all cursor-pointer"
              >
                <div className="justify-start text-pink-400 text-sm font-extrabold font-['Nunito'] uppercase tracking-wide">
                  Cancel session
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Player Role Reveal Card
  if (!roleInfo) return null;

  const isMayor = roleInfo.role.toLowerCase() === 'mayor';
  const lang = localStorage.getItem('tpa_lang') || 'en';
  const scenarioTitle = SCENARIOS[scenarioIndex]?.title[lang] || 'New Industrial Zone';
  const cardStyles = getRoleCardStyles(roleInfo.role);

  return (
    <div className="min-h-screen w-full flex justify-center items-start font-['Nunito']">
      <div className="relative w-full sm:max-w-[480px] min-h-screen overflow-hidden bg-white flex flex-col">
        
        {/* Top Header */}
        <div className="w-full h-24 bg-lime-600 px-[35px] flex items-center justify-between shrink-0 relative">
          <div className="flex flex-col text-left justify-center min-w-0 pr-4">
            <div className="text-white text-lg sm:text-2xl font-extrabold font-['Nunito'] truncate leading-tight">
              {scenarioTitle}
            </div>
            <div className="text-lime-100 text-xs sm:text-sm font-semibold font-['Nunito'] leading-normal mt-0.5">
              {lang === 'id' ? `Skenario ${scenarioIndex + 1} dari 3` : `Scenario ${scenarioIndex + 1} of 3`}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
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
          className="flex-grow overflow-y-auto no-scrollbar px-[35px] py-6 space-y-9 flex flex-col"
          style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
        >
          {/* Role Identity Badge */}
          <div className={`w-full p-5 rounded-xl border-2 flex flex-col justify-center ${cardStyles.bg} ${cardStyles.border} shrink-0`}>
            <div className={`text-xl font-extrabold font-['Nunito'] leading-none mb-2 ${cardStyles.text}`}>
              {formatRoleName(roleInfo.role)}
            </div>
            <div className={`text-sm font-medium font-['Inter'] leading-relaxed ${cardStyles.text}`}>
              {roleInfo.description}
            </div>
          </div>

          {/* Primary Objective */}
          <div className="w-full text-left shrink-0">
            <div className="text-neutral-600 text-xl font-extrabold font-['Nunito'] leading-none mb-3">
              {lang === 'id' ? 'Tujuan Utama' : 'Primary Objective'}
            </div>
            <div className="text-zinc-400 text-sm sm:text-base font-semibold font-['Nunito'] leading-relaxed">
              {roleInfo.objective}
            </div>
          </div>

          {/* Secret Information */}
          <div className="w-full text-left shrink-0">
            <div className="text-neutral-600 text-xl font-extrabold font-['Nunito'] leading-none mb-3">
              {lang === 'id' ? 'Informasi Rahasia' : 'Secret Information'}
            </div>
            
            <div 
              onClick={() => setRevealSecret(!revealSecret)}
              className={`w-full rounded-xl border-2 overflow-hidden cursor-pointer transition-all duration-300 ${
                revealSecret 
                  ? 'bg-neutral-50 border-neutral-200 p-5' 
                  : 'bg-neutral-100 border-neutral-200 h-12 flex items-center justify-between px-6 hover:bg-neutral-200'
              }`}
            >
              {revealSecret ? (
                <div className="text-neutral-700 text-sm font-semibold font-['Nunito'] leading-relaxed flex justify-between items-start gap-4">
                  <span>{roleInfo.secret_info}</span>
                  <ChevronUp className="w-5 h-5 text-neutral-500 shrink-0" />
                </div>
              ) : (
                <>
                  <span className="text-neutral-500 text-sm font-medium font-['Inter']">
                    {lang === 'id' ? 'Ketuk Untuk Membuka' : 'Tap To Reveal'}
                  </span>
                  <ChevronDown className="w-5 h-5 text-neutral-500" />
                </>
              )}
            </div>
            
            <div className="text-zinc-400 text-sm font-semibold font-['Nunito'] leading-6 mt-2">
              {lang === 'id' ? '*jangan diperlihatkan kepada delegasi lain' : '*keep hidden from other delegates'}
            </div>
          </div>
        </div>

        {/* Mayor privilege footnote */}
        {isMayor && (
          <div className="w-full h-20 relative shrink-0">
            <div className="w-full h-20 left-0 top-0 absolute bg-lime-200" />
            <div className="absolute inset-0 flex items-center justify-center text-center text-lime-500 text-sm font-medium font-['Inter'] leading-6 px-6">
              {lang === 'id' ? (
                <>Hak Istimewa Walikota: Anda memegang kekuasaan keputusan akhir<br/>dan hak veto setelah pemungutan suara majelis.</>
              ) : (
                <>Mayor privilage: You hold ultimate decision power<br/>and veto rights after assembly votes.</>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

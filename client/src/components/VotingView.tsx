import React, { useState } from 'react';
import { Check, LogOut, Activity } from 'lucide-react';
import type { Scenario } from '../gameConstants.js';

interface VotingViewProps {
  isFacilitator: boolean;
  scenario: Scenario;
  votesCast: number;
  totalPlayers: number;
  onVoteSubmitted?: (choice: string) => void;
  onForceCloseVoting?: () => void;
  scenarioIndex?: number;
  onCancelSession?: () => void;
  onToggleStats?: () => void;
}

export const VotingView: React.FC<VotingViewProps> = ({
  isFacilitator,
  scenario,
  votesCast,
  totalPlayers,
  onVoteSubmitted,
  onForceCloseVoting,
  scenarioIndex = 0,
  onCancelSession,
  onToggleStats
}) => {
  const [votedChoice, setVotedChoice] = useState<string | null>(null);

  const handleVote = (choice: string) => {
    if (votedChoice) return;
    setVotedChoice(choice);
    onVoteSubmitted?.(choice);
  };

  const optionKeys = ['A', 'B', 'C'] as const;

  if (isFacilitator) {
    return (
      <div className="min-h-screen w-full flex justify-center items-start font-['Nunito']">
        <div className="relative w-full sm:max-w-[480px] min-h-screen overflow-hidden bg-white flex flex-col">
          
          {/* Header */}
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
              {onToggleStats && (
                <button 
                  type="button"
                  onClick={onToggleStats}
                  className="w-12 h-12 rounded-2xl bg-lime-600 shadow-[0px_2px_0px_0px_rgba(0,0,0,0.20)] border-2 border-black/20 hover:bg-lime-700 transition-all flex justify-center items-center cursor-pointer"
                  title="View Stats"
                >
                  <Activity className="w-5 h-5 text-white" />
                </button>
              )}

              {onCancelSession && (
                <button 
                  type="button"
                  onClick={onCancelSession}
                  className="w-12 h-12 rounded-2xl bg-lime-600 shadow-[0px_2px_0px_0px_rgba(0,0,0,0.20)] border-2 border-black/20 hover:bg-lime-700 transition-all flex justify-center items-center cursor-pointer"
                >
                  <LogOut className="w-5 h-5 text-white" />
                </button>
              )}
            </div>
          </div>

          {/* Central Content Area */}
          <div className="flex-grow overflow-y-auto no-scrollbar px-[35px] py-8 flex flex-col justify-between items-center text-center">
            
            {/* Info Section */}
            <div className="space-y-3 w-full flex flex-col items-center">
              <h2 className="text-neutral-600 text-xl font-extrabold leading-tight">
                Voting in Progress
              </h2>
              <p className="text-zinc-400 text-sm font-medium leading-relaxed max-w-sm mx-auto">
                Players are casting their votes confidentially on their devices. Wait for all votes or close the poll manually.
              </p>
            </div>

            {/* Votes Counter Display */}
            <div className="flex flex-col items-center my-auto py-8">
              <div className="text-neutral-600 text-7xl sm:text-8xl font-black leading-none mb-2">
                {votesCast}/{totalPlayers}
              </div>
              <div className="text-zinc-400 text-xs sm:text-sm font-extrabold tracking-widest uppercase">
                VOTES REGISTERED
              </div>
            </div>

            {/* Facilitator Control Button */}
            {onForceCloseVoting ? (
              <div className="w-full pt-4 shrink-0">
                <button
                  type="button"
                  onClick={onForceCloseVoting}
                  className="w-full h-12 bg-white rounded-xl shadow-[0px_2px_0px_0px_rgba(229,229,229,1.00)] outline outline-2 outline-offset-[-2px] outline-neutral-200 inline-flex justify-center items-center hover:bg-neutral-50 active:translate-y-px transition-all cursor-pointer"
                >
                  <div className="text-sky-500 text-sm font-extrabold font-['Nunito'] uppercase tracking-wide">
                    FORCE CLOSE VOTING
                  </div>
                </button>
              </div>
            ) : (
              <div className="h-10 shrink-0" />
            )}

          </div>

        </div>
      </div>
    );
  }

  const lang = localStorage.getItem('tpa_lang') || 'en';

  return (
    <div className="min-h-screen w-full flex justify-center items-start font-['Nunito']">
      <div className="relative w-full sm:max-w-[480px] min-h-screen bg-white flex flex-col">
        
        {/* Top Header */}
        <div className="w-full h-24 bg-lime-600 px-[35px] flex items-center justify-between shrink-0 relative">
          <div className="flex flex-col text-left justify-center min-w-0 pr-4">
            <div className="text-white text-lg sm:text-2xl font-extrabold font-['Nunito'] truncate leading-tight">
              {scenario.title}
            </div>
            <div className="text-lime-100 text-xs sm:text-sm font-semibold font-['Nunito'] leading-normal mt-0.5">
              {lang === 'id' ? `Skenario ${scenarioIndex + 1} dari 3` : `Scenario ${scenarioIndex + 1} of 3`}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {onToggleStats && (
              <button 
                type="button"
                onClick={onToggleStats}
                className="w-12 h-12 rounded-2xl bg-lime-600 shadow-[0px_2px_0px_0px_rgba(0,0,0,0.20)] border-2 border-black/20 hover:bg-lime-700 transition-all flex justify-center items-center cursor-pointer"
                title="View Stats"
              >
                <Activity className="w-5 h-5 text-white" />
              </button>
            )}

            {onCancelSession && (
              <button 
                type="button"
                onClick={onCancelSession}
                className="w-12 h-12 rounded-2xl bg-lime-600 shadow-[0px_2px_0px_0px_rgba(0,0,0,0.20)] border-2 border-black/20 hover:bg-lime-700 transition-all flex justify-center items-center cursor-pointer"
              >
                <LogOut className="w-5 h-5 text-white" />
              </button>
            )}
          </div>
        </div>

        <style>{`
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {/* Scrollable Content Container */}
        <div 
          className="flex-grow overflow-y-auto no-scrollbar px-[35px] py-6 space-y-6 flex flex-col items-center justify-start"
          style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
        >
          {/* Header Info */}
          <div className="flex flex-col items-center space-y-4 w-full">
            <div className="bg-neutral-200 rounded-full h-8 px-5 flex items-center justify-center text-zinc-500 text-[10px] font-extrabold font-['Nunito'] tracking-wider">
              {lang === 'id' ? 'KERTAS SUARA RAHASIA' : 'CONFIDENTIAL BALLOT'}
            </div>
            <div className="space-y-2 w-full text-center">
              <h2 className="text-neutral-600 text-xl font-extrabold leading-tight">
                {lang === 'id' ? 'Berikan Suara Anda' : 'Cast Your Vote'}
              </h2>
              <div className="text-zinc-400 text-sm font-semibold font-['Nunito']">
                {lang === 'id' 
                  ? `${votesCast} dari ${totalPlayers} Delegasi Telah Memilih` 
                  : `${votesCast} of ${totalPlayers} Delegates Have Voted`
                }
              </div>
            </div>
          </div>

          {votedChoice ? (
            /* Waiting Card after voting */
            <div className="w-full flex-grow flex flex-col items-center justify-center space-y-8 py-12">
              {/* Custom checkmark icon container */}
              <div className="w-24 h-24 bg-lime-600 rounded-[24px] shadow-[0px_2px_0px_0px_rgba(0,0,0,0.20)] border-2 border-black/20 flex justify-center items-center relative">
                <Check className="w-12 h-12 text-white stroke-[4]" />
              </div>
              
              <div className="space-y-4 w-full text-center">
                <h3 className="text-neutral-600 text-xl font-extrabold font-['Nunito'] leading-none">
                  {lang === 'id' ? 'Suara Terdaftar!' : 'Vote Registered!'}
                </h3>
                <p className="text-zinc-400 text-base font-semibold font-['Nunito'] leading-relaxed w-80 mx-auto text-center">
                  {lang === 'id' 
                    ? <>Anda memilih Opsi {votedChoice}. Pilihan Anda rahasia. Menunggu delegasi lain selesai memilih...</>
                    : <>You voted for Option {votedChoice}. Your choice is encrypted and confidential. Wait for other delegates to finish voting...</>
                  }
                </p>
              </div>

              {/* Bottom Syncing State */}
              <div className="pt-12 text-center space-y-2">
                <div className="text-zinc-400 text-base font-semibold font-['Nunito'] leading-6 flex items-center justify-center gap-1.5 capitalize">
                  <span className="inline-block w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="inline-block w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="inline-block w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce" />
                  {lang === 'id' ? 'sinkronisasi lobi' : 'Lobby synchronizing'}
                </div>
              </div>
            </div>
          ) : (
            /* Options Choice list */
            <div className="w-full space-y-4">
              {optionKeys.map((key) => {
                const opt = scenario.options[key];
                return (
                  <button 
                    key={key}
                    type="button"
                    onClick={() => handleVote(key)}
                    className="w-full min-h-[112px] p-5 bg-white rounded-xl shadow-[0px_2px_0px_0px_rgba(229,229,229,1.00)] outline outline-2 outline-offset-[-2px] outline-neutral-200 flex items-center gap-4 text-left hover:bg-neutral-50 active:translate-y-px transition-all cursor-pointer"
                  >
                    {/* Circle Badge for Option Key (A, B, C) */}
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-[0px_2px_0px_0px_rgba(0,0,0,0.20)] border-2 border-black/20 flex justify-center items-center shrink-0">
                      <span className="text-stone-300 text-2xl font-extrabold font-['Nunito'] leading-none">{key}</span>
                    </div>

                    {/* Option Text Details */}
                    <div className="min-w-0 flex-grow">
                      <div className="text-neutral-600 text-base font-extrabold font-['Nunito'] leading-snug">
                        {opt.label}
                      </div>
                      <div className="text-zinc-400 text-xs font-semibold font-['Nunito'] leading-snug mt-1">
                        {opt.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Bottom spacing dummy */}
          <div className="h-4 shrink-0" />
        </div>
      </div>
    </div>
  );
};

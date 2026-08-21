import React, { useState } from 'react';
import { LogOut, Activity } from 'lucide-react';
import { useI18n } from '../i18n.js';
import type { Scenario } from '../gameConstants.js';
import { formatRoleTitle } from '../gameConstants.js';
import bgImage4 from '../assets/image4.png';
import bgImage5 from '../assets/image5.png';
import bgImage6 from '../assets/image6.png';
import desktop4Bg from '../assets/desktop4.png';
import desktop5Bg from '../assets/desktop5.png';

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
  initialVotedChoice?: string | null;
  roomCode?: string;
  playerRole?: string;
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
  onToggleStats,
  initialVotedChoice = null,
  roomCode,
  playerRole
}) => {
  const { t } = useI18n();
  const [votedChoice, setVotedChoice] = useState<string | null>(initialVotedChoice || null);

  const handleVote = (choice: string) => {
    if (votedChoice) return;
    setVotedChoice(choice);
    onVoteSubmitted?.(choice);
  };

  const optionKeys = ['A', 'B', 'C'] as const;
  const lang = localStorage.getItem('tpa_lang') || 'en';

  if (isFacilitator) {
    return (
      <div className="relative min-h-screen w-full bg-[#0D2B40] flex flex-col justify-between items-center overflow-hidden">
        {/* 1. Mobile Background Image (image6.png) - Original Mobile Layout */}
        {bgImage6 && (
          <img className="sm:hidden absolute inset-x-0 top-0 w-full h-full min-h-full object-top object-cover pointer-events-none z-0" src={bgImage6} alt="" />
        )}

        {/* 2. Tablet Background Image (image5.png) - Optimized Tablet Layout */}
        {bgImage5 && (
          <img className="hidden sm:block lg:hidden absolute inset-x-0 -top-40 md:-top-44 w-full h-[calc(100%+180px)] object-top object-cover pointer-events-none z-0" src={bgImage5} alt="" />
        )}

        {/* 3. Desktop Background Wallpaper (desktop4.png) - Optimized Desktop Layout */}
        {desktop4Bg && (
          <div className="hidden lg:block absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
            <img className="w-full h-full object-cover object-top" src={desktop4Bg} alt="Voting Desktop Background" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-[#0D2B40]/90" />
          </div>
        )}
        
        {/* 100% Full-Width Top Header Banner */}
        <div className="w-full bg-transparent flex justify-center shrink-0 z-20">
          <div className="w-full max-w-[480px] sm:max-w-[520px] h-24 px-6 flex items-center justify-between">
            <div className="flex flex-col text-left justify-center min-w-0 pr-4">
              <h1 className="text-white text-xl sm:text-2xl font-extrabold font-['Nunito'] leading-tight truncate">
                {scenario.title}
              </h1>
              <span className="text-white text-sm font-semibold font-['Nunito'] leading-6 flex items-center gap-1.5 flex-wrap">
                <span>{lang === 'id' ? `Skenario ${scenarioIndex + 1} dari 5` : `Scenario ${scenarioIndex + 1} of 5`}</span>
                {isFacilitator && roomCode && (
                  <>
                    <span className="opacity-60">•</span>
                    <span>{roomCode}</span>
                  </>
                )}
              </span>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              {onToggleStats && (
                <button 
                  type="button"
                  onClick={onToggleStats}
                  className="w-12 h-12 bg-cyan-700 rounded-2xl shadow-[0px_2px_0px_0px_rgba(0,0,0,0.20)] border-2 border-black/20 flex items-center justify-center text-white cursor-pointer hover:opacity-90 active:scale-95 transition-all shrink-0"
                  title="View Stats"
                >
                  <Activity className="w-5 h-5 text-white" />
                </button>
              )}

              {onCancelSession && (
                <button 
                  type="button"
                  onClick={onCancelSession}
                  className="w-12 h-12 bg-cyan-700 rounded-2xl shadow-[0px_2px_0px_0px_rgba(0,0,0,0.20)] border-2 border-black/20 flex items-center justify-center text-white cursor-pointer hover:opacity-90 active:scale-95 transition-all shrink-0"
                  title={t('common.cancel')}
                >
                  <LogOut className="w-5 h-5 text-white" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Central & Bottom Content Area */}
        <div className="w-full max-w-[384px] sm:max-w-[420px] flex-grow flex flex-col items-center justify-between mx-auto px-4 pt-4 pb-8 sm:pb-16 text-center overflow-y-auto no-scrollbar z-20 space-y-6">
          
          {/* Top Title & Info Section */}
          <div className="w-full flex flex-col items-center shrink-0 space-y-2 -mt-1 sm:pt-5">
            <h2 className="text-white text-2xl sm:text-3xl font-extrabold font-['Nunito'] leading-tight shrink-0">
              Voting in Progress
            </h2>
            <p className="text-white text-base sm:text-lg font-semibold font-['Nunito'] leading-relaxed max-w-sm mx-auto opacity-95">
              Players are casting their votes confidentially on their devices. Wait for all votes or close the poll manually.
            </p>
          </div>

          {/* Bottom Voting Stats & Control Button Group */}
          <div className="w-full flex flex-col items-center shrink-0 space-y-6 mt-auto pb-4 sm:pb-6">
            {/* Votes Counter Display */}
            <div className="flex flex-col items-center justify-center shrink-0 space-y-0.5 pt-[220px] sm:pt-[220px]">
              <div className="text-white text-5xl sm:text-6xl font-extrabold font-['Nunito'] leading-none tracking-wider flex items-center justify-center">
                <span>{votesCast}</span>
                <span className="mx-1.5 opacity-90">/</span>
                <span>{totalPlayers}</span>
              </div>
              <div className="text-white text-lg font-extrabold font-['Nunito'] leading-9 tracking-wide">
                VOTES REGISTERED
              </div>
            </div>

            {/* Facilitator Control Button */}
            {onForceCloseVoting ? (
              <div className="w-full shrink-0">
                <button
                  type="button"
                  onClick={onForceCloseVoting}
                  data-button="Primary"
                  className="w-full max-w-[384px] sm:max-w-[420px] h-12 p-2.5 bg-[#5CACE2] rounded-md shadow-[0px_4px_0px_0px_rgba(36,112,162,1.00)] inline-flex justify-center items-center gap-2.5 transition-all hover:opacity-90 cursor-pointer active:translate-y-0.5 focus:outline-none"
                >
                  <div className="text-white text-sm font-extrabold font-['Nunito'] uppercase tracking-wide">
                    force close voting
                  </div>
                </button>
              </div>
            ) : (
              <div className="h-4 shrink-0" />
            )}
          </div>

        </div>

      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-[#0D2B40] flex flex-col justify-between items-center overflow-hidden">
      {votedChoice && (
        <>
          {/* Mobile & Tablet Background (image4.png) */}
          {bgImage4 && (
            <img className="lg:hidden absolute inset-x-0 top-0 w-full h-full min-h-full object-top object-cover pointer-events-none z-0" src={bgImage4} alt="" />
          )}

          {/* Desktop Background (desktop5.png) */}
          {desktop5Bg && (
            <div className="hidden lg:block absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
              <img className="w-full h-full object-cover object-top" src={desktop5Bg} alt="Vote Registered Desktop Background" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-[#0D2B40]/90" />
            </div>
          )}
        </>
      )}
      
      {/* 100% Full-Width Top Header Banner */}
      <div className={`w-full flex justify-center shrink-0 z-20 ${votedChoice ? 'bg-transparent' : 'bg-cyan-700'}`}>
        <div className="w-full max-w-[480px] sm:max-w-[520px] h-24 px-6 flex items-center justify-between">
          <div className="flex flex-col text-left justify-center min-w-0 pr-4">
            <h1 className="text-white text-xl sm:text-2xl font-extrabold font-['Nunito'] leading-tight truncate">
              {scenario.title}
            </h1>
            <span className="text-white text-base sm:text-lg font-bold font-['Nunito'] leading-6 flex items-center gap-1.5 flex-wrap">
              <span>{lang === 'id' ? `Skenario ${scenarioIndex + 1} dari 5` : `Scenario ${scenarioIndex + 1} of 5`}</span>
              {playerRole && (
                <>
                  <span className="opacity-60">•</span>
                  <span className="text-amber-300 font-extrabold">{formatRoleTitle(playerRole, lang)}</span>
                </>
              )}
            </span>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {onToggleStats && (
              <button 
                type="button"
                onClick={onToggleStats}
                className="w-12 h-12 bg-cyan-700 rounded-2xl shadow-[0px_2px_0px_0px_rgba(0,0,0,0.20)] border-2 border-black/20 flex items-center justify-center text-white cursor-pointer hover:opacity-90 active:scale-95 transition-all shrink-0"
                title="View Stats"
              >
                <Activity className="w-5 h-5 text-white" />
              </button>
            )}

            {onCancelSession && (
              <button 
                type="button"
                onClick={onCancelSession}
                className="w-12 h-12 bg-cyan-700 rounded-2xl shadow-[0px_2px_0px_0px_rgba(0,0,0,0.20)] border-2 border-black/20 flex items-center justify-center text-white cursor-pointer hover:opacity-90 active:scale-95 transition-all shrink-0"
                title={t('common.cancel')}
              >
                <LogOut className="w-5 h-5 text-white" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Middle Scrollable Content Container */}
      <div className="w-full max-w-[384px] sm:max-w-[420px] flex-grow flex flex-col items-center justify-start mx-auto px-4 py-6 space-y-6 overflow-y-auto no-scrollbar z-10">
        
        {votedChoice ? (
            /* Vote Registered State after voting */
            <div className="w-full flex-grow flex flex-col items-center justify-end space-y-5 pt-64 sm:pt-[320px] pb-8 shrink-0 text-center mt-auto">
              <div className="space-y-3 w-full text-center mt-24 sm:mt-28">
                <h3 className="text-white text-xl font-extrabold font-['Nunito'] leading-9">
                  {lang === 'id' ? 'Suara Terdaftar!' : lang === 'th' ? 'บันทึกการลงมติแล้ว!' : 'Vote Registered!'}
                </h3>
                <p className="text-white text-base font-semibold font-['Nunito'] leading-6 max-w-xs mx-auto text-center">
                  {lang === 'id' 
                    ? <>Anda memilih Opsi {votedChoice}. Pilihan Anda rahasia. Menunggu delegasi lain selesai memilih...</>
                    : lang === 'th'
                    ? <>คุณลงมติเลือกตัวเลือก {votedChoice} ตัวเลือกของคุณเป็นความลับ กำลังรอผู้แทนคนอื่นลงมติ...</>
                    : <>You voted for Option {votedChoice}. Your choice is encrypted and confidential. Wait for other delegates to finish voting...</>
                  }
                </p>
              </div>

              {/* Bottom Syncing State */}
              <div className="pt-4 text-center">
                <div className="text-white text-base font-semibold font-['Nunito'] leading-6 flex items-center justify-center gap-2">
                  <span className="inline-block w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="inline-block w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="inline-block w-2 h-2 bg-white rounded-full animate-bounce" />
                  <span>{lang === 'id' ? 'Sinkronisasi lobi' : lang === 'th' ? 'กำลังซิงค์ข้อมูลล็อบบี้' : 'Lobby synchronizing'}</span>
                </div>
              </div>
            </div>
          ) : (
            /* Options Choice list (Ballot view) */
            <>
              {/* Header Info */}
              <div className="flex flex-col items-center space-y-1 w-full shrink-0">
                <h2 className="text-white text-xl font-extrabold font-['Nunito'] leading-9">
                  {lang === 'id' ? 'Berikan Suara Anda' : lang === 'th' ? 'ลงมติของคุณ' : 'Cast Your Vote'}
                </h2>
                <div className="text-white text-base font-semibold font-['Nunito'] leading-6">
                  {lang === 'id' 
                    ? `${votesCast} dari ${totalPlayers} Delegasi Telah Memilih` 
                    : lang === 'th'
                    ? `ผู้แทน ${votesCast} จาก ${totalPlayers} คนได้ลงมติแล้ว`
                    : `${votesCast} of ${totalPlayers} Delegates Have Voted`
                  }
                </div>
              </div>

              <div className="w-full space-y-4 shrink-0">
                {optionKeys.map((key) => {
                  const opt = scenario.options[key];
                  return (
                    <button 
                      key={key}
                      type="button"
                      onClick={() => handleVote(key)}
                      className="w-full min-h-[112px] p-3.5 bg-gray-800 rounded-xl shadow-[0px_2px_0px_0px_rgba(52,55,64,1.00)] outline outline-2 outline-offset-[-2px] outline-neutral-700 flex items-center gap-3.5 text-left hover:bg-neutral-750 active:translate-y-0.5 transition-all cursor-pointer"
                    >
                      <div className="size-12 rounded-2xl bg-red-500 shadow-[0px_2px_0px_0px_rgba(0,0,0,0.20)] border-2 border-black/20 flex justify-center items-center shrink-0">
                        <span className="text-white text-2xl font-extrabold font-['Nunito']">{key}</span>
                      </div>

                      <div className="min-w-0 flex-grow">
                        <div className="text-white text-base font-extrabold font-['Nunito'] leading-tight">
                          {opt.label}
                        </div>
                        <div className="text-zinc-400 text-xs font-semibold font-['Nunito'] leading-relaxed mt-1">
                          {opt.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          <div className="h-4 shrink-0" />
      </div>
    </div>
  );
};

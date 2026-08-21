import React, { useState } from 'react';
import { Check, ArrowLeft, Copy } from 'lucide-react';
import { useI18n } from '../i18n.js';

export interface LobbyPlayer {
  id: string;
  full_name: string;
  country: string;
  is_connected: boolean;
  role?: string;
}

interface LobbyViewProps {
  roomCode: string;
  players: LobbyPlayer[];
  isFacilitator: boolean;
  onStartGame?: () => void;
  onCancelSession?: () => void;
  isCancelled?: boolean;
}

const avatarBgColors = [
  'bg-red-500',
  'bg-amber-500',
  'bg-sky-500',
  'bg-emerald-500',
  'bg-indigo-500',
  'bg-purple-500',
  'bg-rose-500'
];

export const LobbyView: React.FC<LobbyViewProps> = ({
  roomCode,
  players,
  isFacilitator,
  onStartGame,
  onCancelSession,
  isCancelled = false
}) => {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);

  const handleCopy = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const minPlayers = 2;
  const maxPlayers = 12;
  const playerCount = players.length;
  const isCountValid = playerCount >= minPlayers && playerCount <= maxPlayers;
  const visiblePlayers = players.slice(0, visibleCount);

  return (
    <div className="relative min-h-screen w-full bg-[#0D2B40] flex justify-center items-center overflow-hidden">
      {/* Outer Web Background: #0D2B40. Main Content Container: Dark #0D2B40 without card wrapper */}
      <div className="relative z-10 w-full max-w-[480px] min-h-screen bg-[#0D2B40] flex flex-col justify-between items-center px-6 py-6 sm:py-8">
        
        {/* Top Header */}
        <div className="w-full max-w-[384px] flex items-center justify-start gap-4 pt-2 mx-auto">
          <button
            type="button"
            onClick={onCancelSession}
            className="p-1 text-white hover:opacity-80 transition-all flex items-center justify-center cursor-pointer active:scale-95 focus:outline-none shrink-0"
            title={t('common.back')}
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-white text-base sm:text-lg font-extrabold font-['Nunito'] leading-7 truncate">
            {t('lobby.badge')} ({t('lobby.title')})
          </h1>
        </div>

        {/* Middle Scrollable Section: Share Code, Count, Delegates */}
        <div className="w-full max-w-[384px] flex-grow flex flex-col items-center mx-auto py-4 space-y-4 overflow-y-auto no-scrollbar">
          
          {/* Share Room Code Banner */}
          <button
            type="button"
            onClick={handleCopy}
            className="w-full h-28 bg-[#5CACE2] rounded-xl shadow-[0px_4px_0px_0px_rgba(36,112,162,1.00)] p-4 flex items-center justify-between transition-all hover:opacity-90 cursor-pointer active:translate-y-0.5 shrink-0 text-left"
          >
            <div className="flex flex-col justify-center space-y-1">
              <span className="text-white text-xs font-extrabold font-['Nunito'] uppercase tracking-wide opacity-90">
                {t('lobby.share_code')}
              </span>
              <span className="text-white text-2xl sm:text-3xl font-black font-['Nunito'] leading-none tracking-wider">
                {roomCode}
              </span>
            </div>

            <div className="flex items-center gap-3.5 h-full">
              <div className="w-0.5 -my-4 h-[112px] bg-[#2470A2]" />
              <div className="flex items-center justify-center w-10 h-10 text-white shrink-0">
                {copied ? (
                  <Check className="w-8 h-8 stroke-[3]" />
                ) : (
                  <Copy className="w-8 h-8 stroke-[2.5]" />
                )}
              </div>
            </div>
          </button>

          {/* Joined Delegates Header */}
          <div className="w-full text-left text-white text-xl sm:text-2xl font-extrabold font-['Nunito'] leading-5 pt-2 shrink-0">
            {playerCount}/{maxPlayers} {t('lobby.joined_delegates')}
          </div>

          {/* Delegates Cards List */}
          <div className={`w-full space-y-3.5 ${visiblePlayers.length === 0 ? 'flex-grow flex flex-col justify-center' : 'shrink-0'}`}>
            {visiblePlayers.length === 0 ? (
              <div className="py-16 my-auto text-center text-sm font-bold text-slate-300 font-['Nunito']">
                {t('lobby.no_delegates')}
              </div>
            ) : (
              visiblePlayers.map((player, index) => (
                <div
                  key={player.id}
                  className="w-full h-20 bg-white rounded-md border-2 border-neutral-200 px-4 flex items-center gap-4 shrink-0"
                >
                  <div className={`size-14 rounded-full flex items-center justify-center text-white text-2xl font-extrabold font-['Nunito'] shrink-0 ${avatarBgColors[index % avatarBgColors.length]}`}>
                    {player.full_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col items-start justify-center min-w-0 text-left">
                    <div className="text-neutral-600 text-lg sm:text-xl font-extrabold font-['Nunito'] leading-5 truncate w-full">
                      {player.full_name}
                    </div>
                    <div className="text-neutral-500 text-sm font-medium font-['Inter'] leading-6 mt-0.5 truncate w-full">
                      {player.country}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Load More Link */}
          {players.length > visibleCount && (
            <button
              type="button"
              onClick={() => setVisibleCount(count => Math.min(count + 3, players.length))}
              className="text-white text-base font-extrabold font-['Nunito'] leading-7 hover:opacity-80 transition-all cursor-pointer pt-1 pb-2 shrink-0"
            >
              {t('lobby.load_more')}
            </button>
          )}

        </div>

        {/* Bottom Section: Action Buttons */}
        <div className="w-full max-w-[384px] flex flex-col items-center mx-auto space-y-3.5 pb-2 shrink-0">
          
          {/* Start Assembly Button (For Facilitator) or Waiting Status (For Players) */}
          {isFacilitator ? (
            <button
              type="button"
              onClick={onStartGame}
              disabled={!isCountValid}
              data-button="Primary"
              className={`w-full max-w-[384px] h-12 p-2.5 rounded-md inline-flex justify-center items-center gap-2.5 transition-all focus:outline-none ${
                isCountValid 
                  ? 'bg-[#5CACE2] shadow-[0px_4px_0px_0px_rgba(36,112,162,1.00)] hover:opacity-90 cursor-pointer active:translate-y-0.5' 
                  : 'bg-[#1C2C39] shadow-[0px_4px_0px_0px_rgba(12,20,28,1.00)] cursor-not-allowed'
              }`}
            >
              <div className={`text-sm font-extrabold font-['Nunito'] uppercase tracking-wide ${isCountValid ? 'text-white' : 'text-zinc-500'}`}>
                {t('lobby.btn_start')}
              </div>
            </button>
          ) : (
            <div className="w-full max-w-[384px] py-3 text-center text-slate-300 text-sm font-extrabold font-['Nunito'] tracking-wide">
              {isCancelled ? t('lobby.session_cancelled') : t('lobby.waiting_facil')}
            </div>
          )}

          {/* Secondary Action: Cancel Session */}
          <button
            type="button"
            onClick={onCancelSession}
            data-button="Outline-Secondary"
            className="w-full max-w-[384px] h-12 p-2.5 bg-cyan-700 rounded-md shadow-[0px_2px_0px_0px_rgba(29,90,130,1.00)] outline outline-2 outline-offset-[-2px] outline-cyan-800 inline-flex justify-center items-center gap-2.5 transition-all hover:bg-cyan-600 cursor-pointer active:translate-y-0.5 focus:outline-none"
          >
            <div className="text-white text-sm font-extrabold font-['Nunito'] uppercase tracking-wide">
              {isCancelled ? t('common.back') : t('lobby.cancel_session')}
            </div>
          </button>

        </div>

      </div>
    </div>
  );
};


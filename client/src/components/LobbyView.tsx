import React, { useState } from 'react';
import { Check, ChevronLeft, Copy } from 'lucide-react';
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

const avatarColors = ['bg-red-500', 'bg-amber-500', 'bg-sky-500', 'bg-lime-600', 'bg-fuchsia-500'];

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
    <div className="min-h-screen w-full flex justify-center items-start font-['Nunito']">
      <div className="relative w-full sm:max-w-[480px] min-h-screen bg-white flex flex-col justify-between px-8 py-8 sm:py-12">
        
        {/* Header Section */}
        <div className="flex items-center gap-3 w-full shrink-0">
          <button
            type="button"
            onClick={onCancelSession}
            aria-label={t('common.back')}
            className="p-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-all border border-slate-100 cursor-pointer focus:outline-none flex items-center justify-center shadow-sm"
          >
            <ChevronLeft className="size-5 stroke-[2.5]" />
          </button>
          <span className="text-slate-700 text-lg font-black leading-7 select-none">
            Session Lobby (Waiting Room)
          </span>
        </div>

        {/* Central Content (Share Room Code & Joined list) */}
        <div className="flex-grow overflow-y-auto no-scrollbar py-6 space-y-6 flex flex-col items-center">
          
          {/* Share Code Button (Refactored to be fluid and responsive) */}
          <button
            type="button"
            onClick={handleCopy}
            className="relative flex items-center justify-between w-full h-28 bg-lime-600 hover:bg-lime-700 rounded-xl px-6 text-white shadow-[0px_4px_0px_0px_#46A302] hover:translate-y-0.5 hover:shadow-[0px_2px_0px_0px_#46A302] active:translate-y-1 active:shadow-none transition-all cursor-pointer text-left shrink-0"
          >
            <div className="flex flex-col justify-center">
              <span className="text-xs font-extrabold uppercase tracking-wider text-lime-100 opacity-90 mb-1">
                {t('lobby.share_code')}
              </span>
              <span className="text-3xl sm:text-4xl font-black tracking-wide leading-none">
                {roomCode}
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-[1px] h-16 bg-lime-700/60" />
              <div className="flex items-center justify-center w-12 h-12 text-white shrink-0">
                {copied ? <Check className="size-8 stroke-[4]" /> : <Copy className="size-8 stroke-[3.5]" />}
              </div>
            </div>
          </button>

          {/* Joined Delegates Status */}
          <div className="w-full text-left text-xl font-extrabold text-neutral-600 pt-2 shrink-0">
            {playerCount}/{maxPlayers} {t('lobby.joined_delegates')}
          </div>

          {/* Delegates List Wrapper */}
          <div className="w-full flex-grow space-y-[15px]">
            {visiblePlayers.length === 0 ? (
              <div className="flex h-20 items-center justify-center rounded-xl border-2 border-neutral-200 bg-white px-5 text-center text-sm font-extrabold text-neutral-400">
                {t('lobby.no_delegates')}
              </div>
            ) : (
              visiblePlayers.map((player, index) => (
                <div
                  key={player.id}
                  className="flex h-20 items-center rounded-xl border-2 border-neutral-200 bg-white px-[20px] shrink-0"
                >
                  <div className={`flex size-12 shrink-0 items-center justify-center rounded-full ${avatarColors[index % avatarColors.length]}`}>
                    <span className="text-lg font-extrabold text-white">
                      {player.full_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-[16px] min-w-0 text-left">
                    <div className="truncate text-lg font-extrabold text-neutral-600 leading-tight">
                      {player.full_name}
                    </div>
                    <div className="mt-0.5 truncate font-['Inter'] text-xs font-medium text-neutral-500">
                      {player.country}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Load More Button */}
          {players.length > visibleCount && (
            <button
              type="button"
              onClick={() => setVisibleCount(count => Math.min(count + 3, players.length))}
              className="w-full text-center text-sm font-extrabold text-sky-400 hover:text-sky-500 transition-colors py-2 shrink-0"
            >
              Load More
            </button>
          )}

        </div>

        {/* Footer Buttons Section */}
        <div className="w-full shrink-0 space-y-3 pt-2">
          {isFacilitator ? (
            <button
              type="button"
              onClick={onStartGame}
              disabled={!isCountValid}
              className={`w-full h-12 flex items-center justify-center rounded-xl bg-white p-2.5 text-sm font-extrabold uppercase tracking-wide shadow-[0px_2px_0px_0px_rgba(229,229,229,1.00)] outline outline-2 outline-offset-[-2px] outline-neutral-200 transition-all hover:translate-y-px hover:bg-neutral-50 active:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 ${
                isCountValid ? 'text-sky-500' : 'text-pink-400'
              }`}
            >
              {t('lobby.btn_start')}
            </button>
          ) : (
            <div className="w-full h-12 flex items-center justify-center rounded-xl border-2 border-neutral-200 bg-white px-4 text-center text-xs font-extrabold uppercase tracking-wide text-neutral-400">
              {isCancelled ? (
                <span className="text-red-500 font-extrabold">{t('lobby.session_cancelled')}</span>
              ) : (
                t('lobby.waiting_facil')
              )}
            </div>
          )}

          <button
            type="button"
            onClick={onCancelSession}
            className="w-full h-12 flex items-center justify-center rounded-xl bg-white p-2.5 text-sm font-extrabold uppercase tracking-wide text-pink-400 shadow-[0px_2px_0px_0px_rgba(229,229,229,1.00)] outline outline-2 outline-offset-[-2px] outline-neutral-200 transition-all hover:translate-y-px hover:bg-neutral-50 active:translate-y-0.5"
          >
            {isCancelled ? t('common.back') : 'Cancel session'}
          </button>
        </div>

      </div>
    </div>
  );
};

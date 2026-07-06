import React, { useState } from 'react';
import { createRoom } from '../api.js';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useI18n } from '../i18n.js';

interface CreateRoomViewProps {
  onSuccess: (roomCode: string, facilitatorToken: string) => void;
  onBack: () => void;
}

export const CreateRoomView: React.FC<CreateRoomViewProps> = ({ onSuccess, onBack }) => {
  const { t, lang } = useI18n();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await createRoom();
      // Store in localStorage
      localStorage.setItem('tpa_facilitator_token', response.facilitator_token);
      localStorage.setItem(`tpa_room_code_${response.room_code}`, response.facilitator_token);
      onSuccess(response.room_code, response.facilitator_token);
    } catch (err: any) {
      console.error(err);
      setError(t('create.error_connect'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-start font-['Nunito']">
      <div className="relative w-full sm:max-w-[480px] min-h-screen bg-white flex flex-col justify-between px-8 py-8 sm:py-12">
        
        {/* Header containing the back icon button and Back to Home title */}
        <div className="flex items-center gap-3 w-full shrink-0">
          <button
            type="button"
            onClick={onBack}
            className="p-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-all border border-slate-100 cursor-pointer focus:outline-none flex items-center justify-center shadow-sm"
            title={t('common.back')}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="text-slate-700 text-lg font-black leading-7 select-none">
            {t('join.back_home')}
          </span>
        </div>

        {/* Central Action (Plus Button & Title & Description) */}
        <div className="flex flex-col items-center justify-center my-auto space-y-8 py-6 shrink-0">
          <button
            type="button"
            onClick={handleCreate}
            disabled={loading}
            className="w-24 h-20 bg-white rounded-3xl flex items-center justify-center shadow-[0px_4px_0px_0px_rgba(229,229,229,1.00)] border-2 border-neutral-200 hover:bg-neutral-50 hover:translate-y-0.5 hover:shadow-[0px_2px_0px_0px_rgba(229,229,229,1.00)] active:translate-y-1 active:shadow-none transition-all disabled:bg-neutral-100 disabled:cursor-not-allowed cursor-pointer focus:outline-none"
          >
            {loading ? (
              <Loader2 className="w-8 h-8 text-slate-500 animate-spin" />
            ) : (
              <div className="w-12 h-12 relative overflow-hidden flex items-center justify-center">
                <div className="w-7 h-1.5 bg-slate-500 rounded-full absolute" />
                <div className="w-1.5 h-7 bg-slate-500 rounded-full absolute" />
              </div>
            )}
          </button>

          {/* Title & Description */}
          <div className="space-y-4 text-center max-w-[410px]">
            <div className="w-full text-neutral-600 text-2xl sm:text-3xl font-extrabold font-['Nunito'] leading-9 select-none">
              {t('create.title')}
            </div>
            <div className="w-full text-zinc-400 text-sm font-medium font-['Nunito'] leading-relaxed">
              {lang === 'id' ? (
                <span>
                  Ini akan menghasilkan kode ruangan unik. Bagikan kode ini kepada pemain Anda (8 hingga 12 peserta) agar mereka dapat terhubung menggunakan nama mereka.
                </span>
              ) : (
                <span>
                  This will generate a unique room code. Share it with your players (8 to 12 participants) so they can connect using their name.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error ? (
          <div className="w-full p-3.5 bg-rose-500/10 border border-rose-200 dark:border-rose-900/40 rounded-2xl text-xs font-bold text-rose-600 dark:text-rose-400 text-center leading-relaxed animate-fade-in shrink-0">
            {error}
          </div>
        ) : (
          <div className="h-10 shrink-0" />
        )}
      </div>
    </div>
  );
};

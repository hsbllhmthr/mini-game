import React, { useState } from 'react';
import { createRoom } from '../api.js';
import { Loader2, ArrowLeft, Plus } from 'lucide-react';
import { useI18n } from '../i18n.js';

interface CreateRoomViewProps {
  onSuccess: (roomCode: string, facilitatorToken: string) => void;
  onBack: () => void;
}

export const CreateRoomView: React.FC<CreateRoomViewProps> = ({ onSuccess, onBack }) => {
  const { t } = useI18n();
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
    <div className="min-h-screen w-full bg-[#0D2B40] flex justify-center items-start">
      <div className="relative w-full sm:max-w-[480px] min-h-screen bg-[#0D2B40] flex flex-col justify-between px-8 py-8 sm:py-12">
        
        {/* Header containing the back icon button and title */}
        <div className="flex items-center gap-3 w-full shrink-0">
          <button
            type="button"
            onClick={onBack}
            className="p-1 text-white hover:opacity-80 transition-all flex items-center justify-center cursor-pointer active:scale-95 focus:outline-none"
            title={t('common.back')}
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div className="text-center justify-center text-white text-lg font-extrabold font-['Nunito'] leading-7 select-none">
            {t('create.title')}
          </div>
        </div>

        {/* Central Action (Plus Button & Title & Description) */}
        <div className="flex flex-col items-center justify-center my-auto space-y-8 py-6 shrink-0">
          <button
            type="button"
            onClick={handleCreate}
            disabled={loading}
            className="w-20 h-20 relative cursor-pointer active:translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none flex items-center justify-center"
          >
            <div className="w-20 h-20 left-0 top-0 absolute bg-[#5CACE2] rounded-2xl shadow-[0px_3px_0px_0px_rgba(36,112,162,1.00)] border-2 border-black/20" />
            <div className="relative z-10 flex items-center justify-center pointer-events-none">
              {loading ? (
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              ) : (
                <Plus className="w-9 h-9 text-white stroke-[3.5]" />
              )}
            </div>
          </button>

          {/* Title & Description */}
          <div className="space-y-4 text-center max-w-[410px]">
            <div className="w-full text-white text-xl sm:text-2xl font-extrabold font-['Nunito'] leading-9 select-none">
              {t('create.title')}
            </div>
            <div className="w-full text-slate-300 text-sm font-medium font-['Nunito'] leading-relaxed">
              {t('create.desc')}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error ? (
          <div className="w-full p-3.5 bg-rose-500/20 border border-rose-400/30 rounded-2xl text-xs font-bold text-rose-300 text-center leading-relaxed animate-fade-in shrink-0">
            {error}
          </div>
        ) : (
          <div className="h-10 shrink-0" />
        )}
      </div>
    </div>
  );
};

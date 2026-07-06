import React, { useState } from 'react';
import { getRoomDetails } from '../api.js';
import { Loader2, ArrowLeft, ChevronDown } from 'lucide-react';
import { useI18n } from '../i18n.js';
import joinIllustration from '../assets/joinroom.png';

interface JoinRoomViewProps {
  onSuccess: (roomCode: string, fullName: string, country: string, isReconnection: boolean) => void;
  onBack: () => void;
}

const ASEAN_COUNTRIES = [
  'Indonesia',
  'Malaysia',
  'Singapore',
  'Thailand',
  'Philippines',
  'Vietnam',
  'Myanmar',
  'Cambodia',
  'Laos',
  'Brunei',
  'Other'
];

export const JoinRoomView: React.FC<JoinRoomViewProps> = ({ onSuccess, onBack }) => {
  const { t } = useI18n();
  const [roomCode, setRoomCode] = useState('');
  const [fullName, setFullName] = useState('');
  const [country, setCountry] = useState(ASEAN_COUNTRIES[0]);
  const [customCountry, setCustomCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomCode || !fullName || (!country && !customCountry)) {
      setError(t('join.error_fill_all'));
      return;
    }

    setLoading(true);
    setError(null);
    const selectedCountry = country === 'Other' ? customCountry : country;
    const formattedCode = roomCode.toUpperCase().trim();

    try {
      // Validate room exists and get its status
      const details = await getRoomDetails(formattedCode);
      const isReconnection = details.status === 'active';
      onSuccess(formattedCode, fullName.trim(), selectedCountry.trim(), isReconnection);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Room not found or could not connect to server.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoomCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.toUpperCase();
    if (val.length === 3 && !val.includes('-') && e.nativeEvent instanceof InputEvent && e.nativeEvent.inputType !== 'deleteContentBackward') {
      val += '-';
    }
    setRoomCode(val);
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-start font-['Nunito']">
      <form 
        onSubmit={handleSubmit}
        className="relative w-full sm:max-w-[480px] min-h-screen bg-white flex flex-col justify-between px-8 py-8 sm:py-12"
      >
        {/* Header containing the back icon button and Join Assembly Session title */}
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
            {t('join.title')}
          </span>
        </div>

        {/* Central Forms & Illustration (Scrollable area if screen height is small) */}
        <div className="flex-grow overflow-y-auto no-scrollbar py-6 space-y-6 flex flex-col items-center">
          
          {/* Error Message */}
          {error && (
            <div className="w-full p-3 bg-rose-500/10 border border-rose-200 dark:border-rose-900/40 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 text-center leading-relaxed animate-fade-in shrink-0">
              {error}
            </div>
          )}

          {/* Premium Illustration */}
          <div className="w-40 h-40 sm:w-56 sm:h-56 flex items-center justify-center overflow-hidden shrink-0">
            <img 
              className="w-full h-full object-cover"
              src={joinIllustration} 
              alt="Assembly delegates illustration"
            />
          </div>

          {/* Form Fields Wrapper */}
          <div className="w-full space-y-4">
            {/* Room Code */}
            <div className="space-y-1.5 text-left">
              <label className="block text-neutral-500 text-sm font-medium font-['Inter'] leading-6 select-none">
                {t('common.room_code')}
              </label>
              <input
                type="text"
                placeholder={t('join.room_placeholder')}
                value={roomCode}
                onChange={handleRoomCodeChange}
                maxLength={10}
                required
                className="w-full h-12 bg-neutral-100 rounded-xl outline outline-2 outline-offset-[-2px] outline-neutral-200 focus:outline-sky-500 focus:outline px-[20px] text-neutral-800 text-sm font-bold font-['Inter'] leading-6 placeholder:text-neutral-500/50"
              />
            </div>

            {/* Full Name */}
            <div className="space-y-1.5 text-left">
              <label className="block text-neutral-500 text-sm font-medium font-['Inter'] leading-6 select-none">
                {t('common.full_name')}
              </label>
              <input
                type="text"
                placeholder={t('join.name_placeholder')}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                maxLength={100}
                required
                className="w-full h-12 bg-neutral-100 rounded-xl outline outline-2 outline-offset-[-2px] outline-neutral-200 focus:outline-sky-500 focus:outline px-[20px] text-neutral-800 text-sm font-medium font-['Inter'] leading-6 placeholder:text-neutral-500/50"
              />
            </div>

            {/* Country / Delegate Of */}
            <div className="space-y-1.5 text-left">
              <label className="block text-neutral-500 text-sm font-medium font-['Inter'] leading-6 select-none">
                {t('join.country_label')}
              </label>
              {country === 'Other' ? (
                <div className="w-full h-12 bg-neutral-100 rounded-xl outline outline-2 outline-offset-[-2px] outline-neutral-200 flex items-center justify-between overflow-hidden">
                  <input
                    type="text"
                    placeholder={t('join.specify_country')}
                    value={customCountry}
                    onChange={(e) => setCustomCountry(e.target.value)}
                    required
                    className="w-full h-full bg-transparent px-[20px] focus:outline-none text-neutral-800 text-sm font-medium font-['Inter'] leading-6 placeholder:text-neutral-500/50"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setCountry(ASEAN_COUNTRIES[0]);
                      setCustomCountry('');
                    }}
                    className="text-xs font-bold text-sky-500 hover:text-sky-600 cursor-pointer pr-5 shrink-0"
                  >
                    ASEAN List
                  </button>
                </div>
              ) : (
                <div className="w-full h-12 relative">
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full h-full bg-neutral-100 rounded-xl outline outline-2 outline-offset-[-2px] outline-neutral-200 focus:outline-sky-500 focus:outline pl-[20px] pr-10 text-neutral-800 text-sm font-medium font-['Inter'] leading-6 cursor-pointer appearance-none"
                  >
                    {ASEAN_COUNTRIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Join Button */}
        <div className="w-full shrink-0 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-lime-600 hover:bg-lime-700 text-white text-[15px] font-extrabold uppercase tracking-wide rounded-xl shadow-[0px_4px_0px_0px_#46A302] hover:translate-y-0.5 hover:shadow-[0px_2px_0px_0px_#46A302] active:translate-y-1 active:shadow-none transition-all inline-flex justify-center items-center gap-2.5 cursor-pointer disabled:bg-lime-500/80 disabled:cursor-not-allowed focus:outline-none"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                {t('join.btn_joining').toUpperCase()}
              </>
            ) : (
              t('join.btn_join').toUpperCase()
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

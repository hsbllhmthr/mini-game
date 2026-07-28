import React, { useState } from 'react';
import { getRoomDetails } from '../api.js';
import { Loader2, ChevronDown } from 'lucide-react';
import { useI18n } from '../i18n.js';
import bgImage from '../assets/image3.webp';

interface JoinRoomViewProps {
  onSuccess: (roomCode: string, fullName: string, country: string, isReconnection: boolean) => void;
  onBack: () => void;
}

const ASEAN_COUNTRIES: Record<string, string[]> = {
  en: ['Indonesia', 'Thailand', 'United States'],
  id: ['Indonesia', 'Thailand', 'Amerika Serikat'],
  th: ['อินโดนีเซีย', 'ประเทศไทย', 'สหรัฐอเมริกา'],
};

export const JoinRoomView: React.FC<JoinRoomViewProps> = ({ onSuccess, onBack }) => {
  const { t, lang } = useI18n();
  const countries = ASEAN_COUNTRIES[lang] || ASEAN_COUNTRIES['en'];
  const [roomCode, setRoomCode] = useState('');
  const [fullName, setFullName] = useState('');
  const [country, setCountry] = useState(countries[0]);
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
    <div className="relative min-h-screen w-full bg-white flex justify-center items-center overflow-hidden">
      {/* Background Image Layer */}
      <div className="absolute inset-0 w-full h-full overflow-hidden flex justify-center items-center pointer-events-none">
        <img 
          className="w-full h-full max-w-[480px] object-cover" 
          src={bgImage} 
          alt="The People's Assembly" 
        />
      </div>

      {/* Main Content Container - Seamless full height without card wrapper */}
      <form 
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-[480px] min-h-screen flex flex-col justify-between items-center px-6 py-6 sm:py-8"
      >

        {/* Middle Content: Instruction & Inputs */}
        <div className="w-full max-w-[384px] flex flex-col items-center mx-auto mt-auto mb-8 sm:mb-12 space-y-4">

          {/* Error Message Alert */}
          {error && (
            <div className="w-full p-3 bg-rose-500/20 border border-rose-400/40 rounded-md text-xs font-bold text-rose-300 text-center leading-relaxed animate-fade-in">
              {error}
            </div>
          )}

          {/* Form Fields Stack */}
          <div className="w-full space-y-4">
            
            {/* Room Code */}
            <div className="w-full space-y-1 text-left">
              <label className="block text-white text-sm font-medium font-['Inter'] leading-6 select-none">
                {t('common.room_code')}
              </label>
              <input
                type="text"
                placeholder={t('join.room_placeholder')}
                value={roomCode}
                onChange={handleRoomCodeChange}
                maxLength={10}
                required
                className="w-full h-12 bg-neutral-800 rounded-md outline outline-2 outline-offset-[-2px] outline-neutral-700 focus:outline-blue-400 px-6 text-white text-sm font-medium font-['Inter'] leading-6 placeholder:text-zinc-500 transition-all"
              />
            </div>

            {/* Full Name */}
            <div className="w-full space-y-1 text-left">
              <label className="block text-white text-sm font-medium font-['Inter'] leading-6 select-none">
                {t('common.full_name')}
              </label>
              <input
                type="text"
                placeholder={t('join.name_placeholder')}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                maxLength={100}
                required
                className="w-full h-12 bg-neutral-800 rounded-md outline outline-2 outline-offset-[-2px] outline-neutral-700 focus:outline-blue-400 px-6 text-white text-sm font-medium font-['Inter'] leading-6 placeholder:text-zinc-500 transition-all"
              />
            </div>

            {/* Country / Delegate Of */}
            <div className="w-full space-y-1 text-left">
              <label className="block text-white text-sm font-medium font-['Inter'] leading-6 select-none">
                {t('join.country_label')}
              </label>
              {country === 'Other' ? (
                <div className="w-full h-12 bg-neutral-800 rounded-md outline outline-2 outline-offset-[-2px] outline-neutral-700 flex items-center justify-between overflow-hidden">
                  <input
                    type="text"
                    placeholder={t('join.specify_country')}
                    value={customCountry}
                    onChange={(e) => setCustomCountry(e.target.value)}
                    required
                    className="w-full h-full bg-transparent px-6 focus:outline-none text-white text-sm font-medium font-['Inter'] leading-6 placeholder:text-zinc-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setCountry(countries[0]);
                      setCustomCountry('');
                    }}
                    className="text-xs font-bold text-blue-400 hover:text-blue-300 cursor-pointer pr-4 shrink-0"
                  >
                    ASEAN List
                  </button>
                </div>
              ) : (
                <div className="w-full h-12 relative">
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full h-full bg-neutral-800 rounded-md outline outline-2 outline-offset-[-2px] outline-neutral-700 focus:outline-blue-400 pl-6 pr-10 text-white text-sm font-medium font-['Inter'] leading-6 cursor-pointer appearance-none"
                  >
                    {countries.map((c) => (
                      <option key={c} value={c} className="bg-neutral-900 text-white">
                        {c}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Bottom Section: Action Buttons */}
        <div className="w-full max-w-[384px] flex flex-col items-center mx-auto space-y-3.5 pb-2">
          
          {/* Primary Submit Button */}
          <button
            type="submit"
            disabled={loading}
            data-button="Primary"
            className="w-full max-w-[384px] h-12 p-2.5 bg-[#5CACE2] rounded-md shadow-[0px_4px_0px_0px_rgba(36,112,162,1.00)] inline-flex justify-center items-center gap-2.5 transition-all hover:opacity-90 cursor-pointer active:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin text-white" />
            ) : (
              <div className="text-white text-sm font-extrabold font-['Nunito'] uppercase tracking-wide">
                {t('join.btn_join')}
              </div>
            )}
          </button>

          {/* Secondary Back Button */}
          <button
            type="button"
            onClick={onBack}
            data-button="Outline-Secondary"
            className="w-full max-w-[384px] h-12 p-2.5 bg-cyan-700 rounded-md shadow-[0px_2px_0px_0px_rgba(29,90,130,1.00)] outline outline-2 outline-offset-[-2px] outline-cyan-800 inline-flex justify-center items-center gap-2.5 transition-all hover:bg-cyan-600 cursor-pointer active:translate-y-0.5 focus:outline-none"
          >
            <div className="text-white text-sm font-extrabold font-['Nunito'] uppercase tracking-wide">
              {t('join.back_home')}
            </div>
          </button>

        </div>
      </form>
    </div>
  );
};

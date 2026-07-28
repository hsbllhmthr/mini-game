import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import bgImage from '../assets/image2.webp';
import { useI18n, type Language } from '../i18n.js';

interface LanguageSelectViewProps {
  onBack: () => void;
  onSelectLanguage: (lang: Language) => void;
  currentLang: Language;
}

export const LanguageSelectView: React.FC<LanguageSelectViewProps> = ({
  onBack,
  onSelectLanguage,
  currentLang,
}) => {
  const { t } = useI18n();
  const [selected, setSelected] = useState<Language>(currentLang);

  const languages = [
    { code: 'id' as const, name: 'Indonesia', subName: 'Bahasa Indonesia', flag: 'https://flagcdn.com/w80/id.png' },
    { code: 'en' as const, name: 'English', subName: 'English', flag: 'https://flagcdn.com/w80/us.png' },
    { code: 'th' as const, name: 'ภาษาไทย', subName: 'ภาษาไทย', flag: 'https://flagcdn.com/w80/th.png' },
  ];

  const handleContinue = () => {
    onSelectLanguage(selected);
    onBack();
  };

  return (
    <div className="relative min-h-screen w-full bg-white flex justify-center items-center overflow-hidden">
      {/* Background Image - Seamless full height, centered without card wrapper */}
      <div className="absolute inset-0 w-full h-full overflow-hidden flex justify-center items-center">
        <img 
          className="w-full h-full max-w-[480px] object-cover" 
          src={bgImage} 
          alt="The People's Assembly" 
        />
      </div>

      {/* Content Container - Balanced position for MacBook Air (sm: breakpoint) */}
      <div className="relative z-10 w-full max-w-[480px] min-h-screen flex flex-col justify-between px-6 pt-6 sm:pt-5 pb-8 sm:pb-6">
        
        {/* Top Bar: Back Button & Header */}
        <div className="w-full flex items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            className="p-1 text-white hover:opacity-80 transition-all flex items-center justify-center cursor-pointer active:scale-95"
            title={t('common.back')}
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-white text-lg sm:text-xl font-extrabold font-['Nunito'] leading-7">
            {t('landing.select_language')}
          </h1>
        </div>

        {/* Middle / Bottom Content Container */}
        <div className="w-full flex flex-col items-center mt-auto mb-2 sm:mb-5 space-y-4">
          
          {/* Instruction Text - Fluid Typography (Fluid resizing based on viewport width) */}
          <div className="w-full text-center text-white text-[clamp(12px,3.6vw,17px)] font-extrabold font-['Nunito'] leading-tight whitespace-nowrap px-1 mb-4 sm:mb-6">
            {t('landing.choose_language')}
          </div>

          {/* Language Options List */}
          <div className="w-full max-w-[384px] space-y-3">
            {languages.map((langItem) => {
              const isSelected = selected === langItem.code;
              return (
                <button
                  key={langItem.code}
                  type="button"
                  onClick={() => setSelected(langItem.code)}
                  className={`w-full h-14 p-2.5 rounded-md transition-all cursor-pointer flex items-center justify-start gap-4 px-4 active:translate-y-0.5 ${
                    isSelected
                      ? 'bg-sky-100 shadow-[0px_4px_0px_0px_rgba(132,215,255,1.00)] outline outline-2 outline-offset-[-2px] outline-sky-400'
                      : 'bg-white shadow-[0px_2px_0px_0px_rgba(229,229,229,1.00)] outline outline-2 outline-offset-[-2px] outline-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  <img
                    className="w-14 h-9 rounded-[5px] object-cover border border-neutral-200 pointer-events-none"
                    src={langItem.flag}
                    alt={`${langItem.name} flag`}
                  />
                  <div className="flex flex-col items-start justify-center">
                    <span className={`text-base font-extrabold font-['Nunito'] leading-none ${
                      isSelected ? 'text-sky-700' : 'text-neutral-700'
                    }`}>
                      {langItem.name}
                    </span>
                    <span className="text-[10px] font-medium font-['Nunito'] text-zinc-400 mt-1">
                      {langItem.subName}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Continue Button */}
          <button
            type="button"
            onClick={handleContinue}
            data-button="Primary"
            className="w-full max-w-[384px] h-12 p-2.5 mt-0 sm:mt-6 bg-[#5CACE2] rounded-md shadow-[0px_4px_0px_0px_rgba(36,112,162,1.00)] inline-flex justify-center items-center gap-2.5 transition-all hover:opacity-90 cursor-pointer active:translate-y-0.5"
          >
            <div className="justify-start text-white text-sm font-extrabold font-['Nunito'] uppercase tracking-wide">
              {t('common.continue')}
            </div>
          </button>

          {/* Tip Note */}
          <div className="text-center text-white text-xs font-medium font-['Nunito'] opacity-90 pt-1">
            {t('landing.tip_change_later')}
          </div>

        </div>

      </div>
    </div>
  );
};

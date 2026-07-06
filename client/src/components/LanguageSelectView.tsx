import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
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
    { code: 'id' as const, name: 'Indonesia', flag: 'https://flagcdn.com/w80/id.png' },
    { code: 'en' as const, name: 'English', flag: 'https://flagcdn.com/w80/us.png' },
    { code: 'th' as const, name: 'Thailand', flag: 'https://flagcdn.com/w80/th.png' },
    { code: 'ph' as const, name: 'Filiphine', flag: 'https://flagcdn.com/w80/ph.png' },
    { code: 'vi' as const, name: 'Vietnam', flag: 'https://flagcdn.com/w80/vn.png' },
    { code: 'my' as const, name: 'Myanmar', flag: 'https://flagcdn.com/w80/mm.png' },
  ];

  const handleContinue = () => {
    onSelectLanguage(selected);
    onBack();
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-start font-['Nunito']">
      <div className="relative w-full sm:max-w-[480px] min-h-screen bg-white flex flex-col justify-between px-8 py-8 sm:py-12">
        
        {/* Header containing the back icon button and Select Your Language title */}
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
            {t('landing.select_language')}
          </span>
        </div>

        {/* Vertical flex column for language cards (Scrollable to prevent overflows) */}
        <div className="flex-grow overflow-y-auto no-scrollbar py-6 space-y-3 w-full">
          {languages.map((langItem) => {
            const isSelected = selected === langItem.code;
            return (
              <button
                key={langItem.code}
                type="button"
                onClick={() => setSelected(langItem.code)}
                className={`w-full h-[72px] rounded-xl transition-all cursor-pointer flex items-center justify-start gap-5 pl-6 focus:outline-none hover:translate-y-0.5 active:translate-y-1 shrink-0 ${
                  isSelected
                    ? 'bg-sky-100 shadow-[0px_4px_0px_0px_rgba(132,215,255,1.00)] hover:shadow-[0px_2px_0px_0px_rgba(132,215,255,1.00)] active:shadow-none outline outline-2 outline-offset-[-2px] outline-sky-300'
                    : 'bg-white shadow-[0px_4px_0px_0px_rgba(229,229,229,1.00)] hover:shadow-[0px_2px_0px_0px_rgba(229,229,229,1.00)] active:shadow-none outline outline-2 outline-offset-[-2px] outline-neutral-200 hover:bg-neutral-50'
                }`}
              >
                <img
                  className="w-14 h-9 rounded-[6px] object-cover border border-neutral-100 pointer-events-none"
                  src={langItem.flag}
                  alt={`${langItem.name} flag`}
                />
                <span className={`text-xl font-extrabold capitalize tracking-wide ${
                  isSelected ? 'text-sky-500' : 'text-black'
                }`}>
                  {langItem.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Continue button */}
        <div className="w-full shrink-0 pt-2">
          <button
            type="button"
            onClick={handleContinue}
            className="w-full h-14 inline-flex items-center justify-center gap-2.5 rounded-xl bg-lime-600 px-5 py-3 shadow-[0px_4px_0px_0px_#46A302] hover:bg-lime-700 active:translate-y-1 active:shadow-none transition-all cursor-pointer focus:outline-none"
          >
            <span className="text-[15px] font-extrabold uppercase tracking-wide text-white">
              Continue
            </span>
          </button>
        </div>

      </div>
    </div>
  );
};

import React from 'react';
import { Languages } from 'lucide-react';
import govImage from '../assets/image1.png';
import { useI18n } from '../i18n.js';

interface LandingViewProps {
  onCreateRoom: () => void;
  onJoinRoom: () => void;
  lang: string;
  onSelectLanguageClick: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onCreateRoom, onJoinRoom, onSelectLanguageClick }) => {
  const { t } = useI18n();

  return (
    <div className="relative min-h-screen w-full bg-white flex justify-center items-center overflow-hidden">
      {/* Background Image - Seamless full height, centered without card wrapper */}
      <div className="absolute inset-0 w-full h-full overflow-hidden flex justify-center items-center">
        <img 
          className="w-full h-full max-w-[480px] object-cover" 
          src={govImage} 
          alt="The People's Assembly" 
        />
      </div>

      {/* Content Container - No card styling */}
      <div className="relative z-10 w-full max-w-[480px] min-h-screen flex flex-col justify-between px-6 py-8 sm:py-12">
        
        {/* Top Header: Language Select Button */}
        <div className="w-full flex justify-end">
          <button
            type="button"
            onClick={onSelectLanguageClick}
            className="w-12 h-12 rounded-2xl bg-cyan-700 shadow-[0px_2px_0px_0px_rgba(29,90,130,1.00)] outline outline-2 outline-offset-[-2px] outline-cyan-800 flex items-center justify-center cursor-pointer hover:bg-cyan-600 transition-all active:translate-y-0.5"
            title="Select Language"
          >
            <Languages className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Central Content: Badge & Title / Subtitle */}
        <div className="flex flex-col items-center mt-auto mb-10 sm:mb-14 text-center space-y-2.5 px-2">
          <div className="text-white text-xs sm:text-sm font-extrabold font-['Nunito'] leading-6 uppercase tracking-wider opacity-95">
            {t('landing.badge')}
          </div>
          <h1 className="text-white text-[clamp(18.5px,5.6vw,26px)] sm:text-[26px] font-extrabold font-['Nunito'] leading-tight whitespace-pre-line max-w-[440px]">
            {t('landing.subtitle')}
          </h1>
        </div>

        {/* Bottom Section: Action Buttons */}
        <div className="w-full flex flex-col items-center space-y-4">
          <button
            type="button"
            onClick={onCreateRoom}
            data-button="Primary"
            className="w-full max-w-[384px] h-12 p-2.5 bg-[#5CACE2] rounded-md shadow-[0px_4px_0px_0px_rgba(36,112,162,1.00)] inline-flex justify-center items-center gap-2.5 transition-all hover:opacity-90 cursor-pointer active:translate-y-0.5"
          >
            <div className="justify-start text-white text-sm font-extrabold font-['Nunito'] uppercase tracking-wide">
              {t('landing.create_btn')}
            </div>
          </button>

          <button
            type="button"
            onClick={onJoinRoom}
            data-button="Outline-Secondary"
            className="w-full max-w-[384px] h-12 p-2.5 bg-cyan-700 rounded-md shadow-[0px_2px_0px_0px_rgba(29,90,130,1.00)] outline outline-2 outline-offset-[-2px] outline-cyan-800 inline-flex justify-center items-center gap-2.5 transition-all hover:bg-cyan-600 cursor-pointer active:translate-y-0.5"
          >
            <div className="justify-start text-white text-sm font-extrabold font-['Nunito'] uppercase tracking-wide">
              {t('landing.join_btn')}
            </div>
          </button>

          {/* Footer Text */}
          <div className="text-white text-xs font-medium font-['Nunito'] leading-5 pt-1">
            {t('landing.no_account')}
          </div>
        </div>

      </div>
    </div>
  );
};

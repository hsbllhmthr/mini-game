import React, { useEffect, useState } from 'react';
import logo1 from '../assets/1.png';
import logo2 from '../assets/2.png';
import logo3 from '../assets/3.png';

interface OnboardingViewProps {
  onComplete: () => void;
  durationMs?: number;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({ 
  onComplete, 
  durationMs = 2500 
}) => {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Lock body scroll while onboarding screen is active
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const timer = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(() => {
        onComplete();
      }, 300);
    }, durationMs);

    return () => {
      document.body.style.overflow = originalOverflow;
      clearTimeout(timer);
    };
  }, [durationMs, onComplete]);

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 150);
  };

  return (
    <div 
      onClick={handleSkip}
      className={`fixed inset-0 z-50 w-screen h-screen bg-white flex justify-center items-center overflow-hidden select-none cursor-pointer touch-none transition-opacity duration-300 ${
        isFadingOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Full height 100% container without top/bottom cuts */}
      <div className="w-full max-w-[480px] h-full bg-white relative flex flex-col justify-between items-center py-10 px-6 overflow-hidden">
        
        {/* Top spacer */}
        <div className="w-full h-12" />

        {/* Center Logos Section */}
        <div className="flex-1 w-full flex items-center justify-center my-auto">
          <div className="flex items-center justify-center gap-3 sm:gap-5">
            <img className="w-32 sm:w-36 h-12 object-contain" src={logo1} alt="Biji-biji Initiative" />
            <img className="w-14 sm:w-16 h-20 object-contain" src={logo2} alt="YSEALI" />
            <img className="w-32 sm:w-36 h-14 object-contain" src={logo3} alt="GovernPlay" />
          </div>
        </div>

        {/* Bottom Text */}
        <div className="w-full text-center justify-center text-neutral-400 text-xs font-medium font-['Nunito'] leading-5 pb-6">
          a web-based governance simulation tool designed<br/>to facilitate face-to-face discussion.
        </div>

      </div>
    </div>
  );
};

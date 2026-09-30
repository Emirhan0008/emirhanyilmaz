import React from 'react';
import { Languages } from 'lucide-react';
import { Language } from '../utils/i18n';

interface LanguageToggleProps {
  currentLang: Language;
  onToggle: (lang: Language) => void;
  className?: string;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({
  currentLang,
  onToggle,
  className = '',
}) => {
  const isTr = currentLang === 'tr';

  const handleClick = () => {
    onToggle(isTr ? 'en' : 'tr');
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`Dili değiştir / Switch language to ${isTr ? 'English' : 'Türkçe'}`}
      title={`Dil / Language: ${isTr ? 'Türkçe (EN için tıkla)' : 'English (Click for TR)'}`}
      className={`relative inline-flex items-center gap-1.5 h-8 px-2.5 rounded-full 
        liquid-glass border border-white/10 hover:border-emerald-400/50 
        text-white font-mono text-xs font-bold transition-all duration-200 
        hover:scale-105 active:scale-95 cursor-pointer shadow-sm group select-none ${className}`}
    >
      <Languages size={13} className="text-emerald-400 group-hover:rotate-12 transition-transform duration-300" />
      <span className="text-[11px] font-extrabold tracking-wider">
        {isTr ? 'TR' : 'EN'}
      </span>
      <span className="text-[9px] text-white/40 group-hover:text-white/80 transition-colors uppercase">
        {isTr ? '🇹🇷' : '🇬🇧'}
      </span>
    </button>
  );
};

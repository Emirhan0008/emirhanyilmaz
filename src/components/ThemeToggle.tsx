import React from 'react';
import { motion } from 'framer-motion';
import { soundEngine } from '../utils/audioSynth';
import { Sparkles, Zap, Terminal } from 'lucide-react';

export type AppTheme = 'normal' | 'terminal' | 'split';

interface ThemeToggleProps {
  theme: AppTheme;
  onToggle: () => void;
  onSelectTheme?: (newTheme: AppTheme) => void;
  className?: string;
  lang?: 'tr' | 'en';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  theme, 
  onToggle, 
  onSelectTheme,
  className = '',
  lang = 'tr'
}) => {
  const isEn = lang === 'en';

  const handleSelect = (target: AppTheme) => {
    if (target === theme) return;
    if (target === 'terminal') {
      soundEngine.playTerminalKey();
    } else if (target === 'split') {
      soundEngine.playTabSwitch();
    } else {
      soundEngine.playGlassClick();
    }

    if (onSelectTheme) {
      onSelectTheme(target);
    } else {
      onToggle();
    }
  };

  // Knob coordinate mapping
  const knobX = theme === 'normal' ? 2 : theme === 'split' ? 38 : 74;

  return (
    <div className={`relative inline-flex items-center select-none ${className}`}>
      {/* 3D Tactile Tri-Mode Segmented Pill */}
      <div
        role="group"
        aria-label={isEn ? "View Theme: Liquid Glass / Split Reality / Terminal" : "Görünüm Teması: Cam UI / Canlı Yarılma / Terminal"}
        className="relative w-[114px] h-[36px] rounded-full p-[3px] transition-all duration-300 flex items-center bg-[#07130e] border border-white/20 shadow-inner"
        style={{
          boxShadow: theme === 'split'
            ? 'inset 0 2px 6px rgba(0, 0, 0, 0.8), 0 0 12px rgba(6, 182, 212, 0.35)'
            : theme === 'terminal'
            ? 'inset 0 2px 6px rgba(0, 0, 0, 0.8), 0 0 10px rgba(52, 211, 153, 0.3)'
            : 'inset 0 2px 6px rgba(0, 0, 0, 0.4), 0 0 10px rgba(255, 255, 255, 0.15)'
        }}
      >
        {/* SLIDING THUMB KNOB */}
        <motion.div
          className="absolute top-[3px] w-[32px] h-[28px] rounded-full z-0 flex items-center justify-center pointer-events-none"
          initial={false}
          animate={{ x: knobX }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30
          }}
          style={{
            background: theme === 'normal'
              ? 'radial-gradient(circle at 40% 35%, #ffffff 0%, #cbd5e1 100%)'
              : theme === 'split'
              ? 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)'
              : 'radial-gradient(circle at 40% 35%, #34d399 0%, #065f46 100%)',
            boxShadow: theme === 'normal'
              ? '0 2px 6px rgba(0, 0, 0, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.9)'
              : theme === 'split'
              ? '0 0 14px rgba(6, 182, 212, 0.7), inset 0 1px 2px rgba(255, 255, 255, 0.6)'
              : '0 0 12px rgba(52, 211, 153, 0.6), inset 0 1px 2px rgba(255, 255, 255, 0.4)',
            border: theme === 'split' 
              ? '1px solid rgba(165, 243, 252, 0.8)' 
              : '1px solid rgba(255, 255, 255, 0.8)'
          }}
        />

        {/* SLOT 1: NORMAL (GLASS / SUN) */}
        <button
          type="button"
          onClick={() => handleSelect('normal')}
          className="relative z-10 w-[36px] h-full flex items-center justify-center cursor-pointer transition-transform active:scale-90"
          title={isEn ? "Switch to Liquid Glass Mode (Modern Cam UI)" : "Cam UI Modu (Modern Vitrin)"}
          aria-pressed={theme === 'normal'}
        >
          <Sparkles 
            size={14} 
            className={`transition-colors duration-200 ${
              theme === 'normal' ? 'text-slate-900 drop-shadow-sm font-bold' : 'text-white/40 hover:text-white/80'
            }`} 
          />
        </button>

        {/* SLOT 2: SPLIT REALITY (CANLI YARILMA) */}
        <button
          type="button"
          onClick={() => handleSelect('split')}
          className="relative z-10 w-[36px] h-full flex items-center justify-center cursor-pointer transition-transform active:scale-90"
          title={isEn ? "Split-Screen Reality (Side-by-side Terminal & Liquid Glass)" : "Canlı Yarılma Efekti (Terminal + Cam UI Yan Yana)"}
          aria-pressed={theme === 'split'}
        >
          <Zap 
            size={14} 
            className={`transition-colors duration-200 ${
              theme === 'split' ? 'text-black drop-shadow-sm font-extrabold animate-pulse' : 'text-white/40 hover:text-cyan-300'
            }`} 
          />
        </button>

        {/* SLOT 3: TERMINAL (CLI) */}
        <button
          type="button"
          onClick={() => handleSelect('terminal')}
          className="relative z-10 w-[36px] h-full flex items-center justify-center cursor-pointer transition-transform active:scale-90"
          title={isEn ? "Switch to Terminal Mode (PowerShell CLI)" : "Terminal Modu (PowerShell CLI)"}
          aria-pressed={theme === 'terminal'}
        >
          <Terminal 
            size={14} 
            className={`transition-colors duration-200 ${
              theme === 'terminal' ? 'text-emerald-950 font-bold' : 'text-white/40 hover:text-emerald-400'
            }`} 
          />
        </button>
      </div>

      {/* Dynamic Status Tag */}
      <div className="hidden sm:flex flex-col ml-2.5 text-left leading-none">
        <span className={`text-[10px] font-mono font-bold tracking-wider uppercase transition-colors ${
          theme === 'split' ? 'text-cyan-300' : theme === 'terminal' ? 'text-emerald-300' : 'text-white/90'
        }`}>
          {theme === 'split' ? (isEn ? 'SPLIT REALITY' : 'YARILMA MODU') : theme === 'terminal' ? 'TERMINAL CLI' : 'CAM UI'}
        </span>
        <span className="text-[8px] text-white/50 font-mono">
          {theme === 'split' ? (isEn ? 'DUAL MATRIX' : 'CANLI PERDE') : theme === 'terminal' ? 'HACKER KONSOL' : 'MODERN VİTRİN'}
        </span>
      </div>
    </div>
  );
};

export default ThemeToggle;

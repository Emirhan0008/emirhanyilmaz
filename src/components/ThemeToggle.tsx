import React from 'react';
import { motion } from 'framer-motion';
import { soundEngine } from '../utils/audioSynth';
import { Terminal } from 'lucide-react';

export type AppTheme = 'normal' | 'terminal';

// 3D Isometric Glass Cube Icon with realistic light refraction and facets
const Glass3DIcon: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-all duration-300 ${
        isActive 
          ? 'drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)] scale-105' 
          : 'opacity-65 group-hover:opacity-95 group-hover:scale-105'
      }`}
    >
      <defs>
        {/* Top Face Gradient */}
        <linearGradient id="g3dTop" x1="12" y1="2" x2="12" y2="10" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={isActive ? "#ffffff" : "#ffffff"} stopOpacity={isActive ? "1" : "0.9"} />
          <stop offset="100%" stopColor={isActive ? "#cbd5e1" : "#94a3b8"} stopOpacity={isActive ? "0.9" : "0.6"} />
        </linearGradient>

        {/* Left Face Gradient */}
        <linearGradient id="g3dLeft" x1="4" y1="6" x2="12" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={isActive ? "#94a3b8" : "#64748b"} stopOpacity={isActive ? "0.95" : "0.7"} />
          <stop offset="100%" stopColor={isActive ? "#475569" : "#334155"} stopOpacity={isActive ? "0.9" : "0.5"} />
        </linearGradient>

        {/* Right Face Gradient */}
        <linearGradient id="g3dRight" x1="20" y1="6" x2="12" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={isActive ? "#e2e8f0" : "#cbd5e1"} stopOpacity={isActive ? "1" : "0.85"} />
          <stop offset="100%" stopColor={isActive ? "#64748b" : "#475569"} stopOpacity={isActive ? "0.85" : "0.55"} />
        </linearGradient>

        {/* Inner Glass Prism Specular Glow */}
        <radialGradient id="g3dPrism" cx="50%" cy="30%" r="50%">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity={isActive ? "0.85" : "0.4"} />
          <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 3D Isometric Cube Faces */}
      {/* Top Face (Roof) */}
      <polygon
        points="12,3 20,7.5 12,12 4,7.5"
        fill="url(#g3dTop)"
        stroke={isActive ? "#ffffff" : "rgba(255,255,255,0.7)"}
        strokeWidth="0.75"
        strokeLinejoin="round"
      />

      {/* Left Face */}
      <polygon
        points="4,7.5 12,12 12,21 4,16.5"
        fill="url(#g3dLeft)"
        stroke={isActive ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.4)"}
        strokeWidth="0.75"
        strokeLinejoin="round"
      />

      {/* Right Face */}
      <polygon
        points="12,12 20,7.5 20,16.5 12,21"
        fill="url(#g3dRight)"
        stroke={isActive ? "#ffffff" : "rgba(255,255,255,0.6)"}
        strokeWidth="0.75"
        strokeLinejoin="round"
      />

      {/* Subtle Inner 3D Glass Prism Core Reflection */}
      <ellipse
        cx="12"
        cy="12"
        rx="4.5"
        ry="3"
        fill="url(#g3dPrism)"
      />

      {/* Specular Diagonal Glass Glare Lines */}
      <line
        x1="12"
        y1="3.5"
        x2="12"
        y2="11.5"
        stroke="#ffffff"
        strokeWidth="0.9"
        strokeOpacity={isActive ? "0.95" : "0.6"}
        strokeLinecap="round"
      />
      <line
        x1="12"
        y1="12"
        x2="20"
        y2="7.5"
        stroke="#ffffff"
        strokeWidth="0.8"
        strokeOpacity={isActive ? "0.8" : "0.5"}
      />
      <circle
        cx="12"
        cy="7.5"
        r="1"
        fill="#ffffff"
        fillOpacity={isActive ? "1" : "0.8"}
      />
    </svg>
  );
};

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

  const handleToggle = () => {
    const nextTheme: AppTheme = theme === 'normal' ? 'terminal' : 'normal';
    if (nextTheme === 'terminal') {
      soundEngine.playTerminalKey();
    } else {
      soundEngine.playGlassClick();
    }

    if (onSelectTheme) {
      onSelectTheme(nextTheme);
    } else {
      onToggle();
    }
  };

  // Knob coordinate mapping: 2 slots
  const knobX = theme === 'normal' ? 2 : 38;

  return (
    <div className={`relative inline-flex items-center select-none ${className}`}>
      {/* 3D Tactile Segmented Pill (Click anywhere to toggle theme) */}
      <button
        type="button"
        role="switch"
        aria-checked={theme === 'terminal'}
        onClick={handleToggle}
        aria-label={isEn ? "Toggle Theme: Liquid Glass / Terminal CLI" : "Görünüm Teması Değiştir: Cam UI / Terminal CLI"}
        title={
          theme === 'normal' 
            ? (isEn ? "Switch to Terminal Mode (PowerShell CLI)" : "Terminal Moduna Geç (PowerShell CLI)") 
            : (isEn ? "Switch to Liquid Glass Mode (Modern Cam UI)" : "Cam UI Moduna Geç (Modern Vitrin)")
        }
        className="group relative w-[78px] h-[36px] rounded-full p-[3px] transition-all duration-300 flex items-center bg-[#07130e] border border-white/40 hover:border-white/70 shadow-[inset_0_1px_2px_rgba(255,255,255,0.3),0_0_12px_rgba(255,255,255,0.18)] hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.45),0_0_16px_rgba(255,255,255,0.28)] cursor-pointer active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
      >
        {/* SLIDING THUMB KNOB */}
        <motion.div
          className="absolute top-[3px] w-[34px] h-[28px] rounded-full z-0 flex items-center justify-center pointer-events-none"
          initial={false}
          animate={{ x: knobX }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 32
          }}
          style={{
            background: theme === 'normal'
              ? 'radial-gradient(circle at 40% 35%, #ffffff 0%, #cbd5e1 100%)'
              : 'radial-gradient(circle at 40% 35%, #34d399 0%, #065f46 100%)',
            boxShadow: theme === 'normal'
              ? '0 2px 6px rgba(0, 0, 0, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.9)'
              : '0 0 12px rgba(52, 211, 153, 0.6), inset 0 1px 2px rgba(255, 255, 255, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.8)'
          }}
        />

        {/* SLOT 1: NORMAL (CAM UI / GLASS) */}
        <div
          className="relative z-10 w-[36px] h-full flex items-center justify-center pointer-events-none transition-transform"
        >
          <Glass3DIcon isActive={theme === 'normal'} />
        </div>

        {/* SLOT 2: TERMINAL (CLI) */}
        <div
          className="relative z-10 w-[36px] h-full flex items-center justify-center pointer-events-none transition-transform"
        >
          <Terminal 
            size={14} 
            className={`transition-colors duration-200 ${
              theme === 'terminal' ? 'text-emerald-950 font-bold' : 'text-white/40 group-hover:text-emerald-400'
            }`} 
          />
        </div>
      </button>

      {/* Dynamic Status Tag (Clickable for quick toggle) */}
      <button
        type="button"
        onClick={handleToggle}
        className="hidden sm:flex flex-col ml-2.5 text-left leading-none cursor-pointer group focus:outline-none"
        title={
          theme === 'normal' 
            ? (isEn ? "Switch to Terminal Mode" : "Terminal Moduna Geç") 
            : (isEn ? "Switch to Glass Mode" : "Cam UI Moduna Geç")
        }
      >
        <span className={`text-[10px] font-mono font-bold tracking-wider uppercase transition-colors group-hover:text-white ${
          theme === 'terminal' ? 'text-emerald-300' : 'text-white/90'
        }`}>
          {theme === 'terminal' ? 'TERMINAL CLI' : 'CAM UI'}
        </span>
        <span className="text-[8px] text-white/50 font-mono group-hover:text-white/70">
          {theme === 'terminal' ? (isEn ? 'HACKER WORKSTATION' : 'HACKER KONSOL') : (isEn ? 'MODERN SHOWCASE' : 'MODERN VİTRİN')}
        </span>
      </button>
    </div>
  );
};

export default ThemeToggle;

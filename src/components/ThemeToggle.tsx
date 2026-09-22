import React from 'react';
import { motion } from 'framer-motion';
import { soundEngine } from '../utils/audioSynth';

export type AppTheme = 'normal' | 'terminal';

interface ThemeToggleProps {
  theme: AppTheme;
  onToggle: () => void;
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onToggle, className = '' }) => {
  const isTerminal = theme === 'terminal';

  const handleClick = () => {
    if (isTerminal) {
      soundEngine.playGlassClick();
    } else {
      soundEngine.playTerminalKey();
    }
    onToggle();
  };

  return (
    <div className={`relative inline-flex items-center select-none ${className}`}>
      <button
        type="button"
        onClick={handleClick}
        role="switch"
        aria-checked={isTerminal}
        aria-label="Görünüm Modunu Değiştir: Normal (Modern UI) / Terminal (Hacker CLI)"
        title={isTerminal ? "Normal Görünüme Geç (Modern Cam UI)" : "Terminal Görünümüne Geç (Hacker CLI)"}
        className="group relative w-[80px] h-[36px] rounded-full p-[3px] transition-all duration-300 focus:outline-hidden cursor-pointer"
        style={{
          // Outer bezel highlight ring & sunken track styling inspired by the reference image
          background: isTerminal
            ? 'linear-gradient(180deg, #18241e 0%, #0d1712 100%)'
            : 'linear-gradient(180deg, #e2e8f0 0%, #cbd5e1 100%)',
          boxShadow: isTerminal
            ? 'inset 0 3px 6px rgba(0, 0, 0, 0.85), inset 0 -1.5px 2px rgba(52, 211, 153, 0.2), 0 2px 8px rgba(0, 0, 0, 0.6)'
            : 'inset 0 3px 6px rgba(0, 0, 0, 0.45), inset 0 -1.5px 3px rgba(255, 255, 255, 0.8), 0 2px 8px rgba(0, 0, 0, 0.25)',
          border: isTerminal
            ? '1px solid rgba(52, 211, 153, 0.35)'
            : '1px solid rgba(255, 255, 255, 0.65)'
        }}
      >
        {/* Crisp lower rim reflection/groove highlight matching reference image */}
        <span 
          className="absolute inset-x-3 bottom-0 h-[1.5px] rounded-full pointer-events-none transition-opacity duration-300"
          style={{
            background: isTerminal
              ? 'linear-gradient(90deg, transparent, rgba(52, 211, 153, 0.4), transparent)'
              : 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.95), transparent)',
          }}
        />

        {/* ========================================================
            LEFT ICON SLOT: NORMAL (MODERN SUN / GUI WINDOW)
            Visible when knob is on the right (Normal active)
            ======================================================== */}
        <div className="absolute left-[9px] top-1/2 -translate-y-1/2 w-[22px] h-[22px] flex items-center justify-center pointer-events-none z-0">
          <motion.div
            initial={false}
            animate={{
              opacity: !isTerminal ? 1 : 0.25,
              scale: !isTerminal ? 1 : 0.85,
              rotate: !isTerminal ? 0 : -35,
            }}
            transition={{ duration: 0.25 }}
            className="flex items-center justify-center text-amber-500"
          >
            {/* Skeuomorphic radiant Sun + UI Spark matching reference image style */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="5" fill="#F5A623" />
              {/* 8 Crisp radiating sun rays */}
              <line x1="12" y1="1.5" x2="12" y2="4.5" stroke="#F5A623" strokeWidth="2.4" strokeLinecap="round" />
              <line x1="12" y1="19.5" x2="12" y2="22.5" stroke="#F5A623" strokeWidth="2.4" strokeLinecap="round" />
              <line x1="1.5" y1="12" x2="4.5" y2="12" stroke="#F5A623" strokeWidth="2.4" strokeLinecap="round" />
              <line x1="19.5" y1="12" x2="22.5" y2="12" stroke="#F5A623" strokeWidth="2.4" strokeLinecap="round" />
              <line x1="4.58" y1="4.58" x2="6.7" y2="6.7" stroke="#F5A623" strokeWidth="2.4" strokeLinecap="round" />
              <line x1="17.3" y1="17.3" x2="19.42" y2="19.42" stroke="#F5A623" strokeWidth="2.4" strokeLinecap="round" />
              <line x1="4.58" y1="19.42" x2="6.7" y2="17.3" stroke="#F5A623" strokeWidth="2.4" strokeLinecap="round" />
              <line x1="17.3" y1="6.7" x2="19.42" y2="4.58" stroke="#F5A623" strokeWidth="2.4" strokeLinecap="round" />
              {/* Subtle inner modern dot */}
              <circle cx="12" cy="12" r="2.2" fill="#FFE599" />
            </svg>
          </motion.div>
        </div>

        {/* ========================================================
            RIGHT ICON SLOT: TERMINAL (HACKER CLI PROMPT & CRT SCREEN)
            Visible when knob is on the left (Terminal active)
            ======================================================== */}
        <div className="absolute right-[9px] top-1/2 -translate-y-1/2 w-[22px] h-[22px] flex items-center justify-center pointer-events-none z-0">
          <motion.div
            initial={false}
            animate={{
              opacity: isTerminal ? 1 : 0.25,
              scale: isTerminal ? 1 : 0.85,
              rotate: isTerminal ? 0 : 35,
            }}
            transition={{ duration: 0.25 }}
            className="flex items-center justify-center"
          >
            {/* Futuristic Terminal Screen with phosphor >_ prompt */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2.5" y="3.5" width="19" height="17" rx="3.5" stroke="#10B981" strokeWidth="2" fill="#061A12" fillOpacity="0.8" />
              {/* CLI Chevron > */}
              <path d="M6.5 8.5L10 12L6.5 15.5" stroke="#34D399" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              {/* Blinking prompt line _ */}
              <line x1="12" y1="15.5" x2="17" y2="15.5" stroke="#34D399" strokeWidth="2.2" strokeLinecap="round" />
              {/* Mini phosphor glow dot */}
              <circle cx="17.5" cy="6.5" r="1" fill="#34D399" />
            </svg>
          </motion.div>
        </div>

        {/* ========================================================
            SLIDING 3D TACTILE THUMB KNOB
            Position:
            - When Normal Mode: knob slides to the RIGHT (translateX: 44px), revealing the Golden Sun/Normal icon on the left!
            - When Terminal Mode: knob slides to the LEFT (translateX: 0px), revealing the Green Terminal icon on the right!
            Exactly mirroring the reference image's dual-mode layout!
            ======================================================== */}
        <motion.div
          className="relative w-[28px] h-[28px] rounded-full z-10 flex items-center justify-center cursor-pointer pointer-events-none"
          initial={false}
          animate={{
            x: isTerminal ? 0 : 44,
          }}
          transition={{
            type: "spring",
            stiffness: 550,
            damping: 32
          }}
          style={{
            // 3D Spherical bevel gradient matching the reference image's rounded matte button
            background: isTerminal
              ? 'radial-gradient(circle at 35% 30%, #34d399 0%, #059669 45%, #047857 100%)'
              : 'radial-gradient(circle at 35% 30%, #ffffff 0%, #f1f5f9 45%, #cbd5e1 100%)',
            boxShadow: isTerminal
              ? '0 3px 8px rgba(0, 0, 0, 0.6), 0 1px 3px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.5), 0 0 10px rgba(52, 211, 153, 0.4)'
              : '0 3px 8px rgba(0, 0, 0, 0.35), 0 1px 3px rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.95)',
            border: isTerminal
              ? '1px solid rgba(167, 243, 208, 0.6)'
              : '1px solid rgba(255, 255, 255, 0.9)'
          }}
        >
          {/* Directional arrow indicating slide direction (left/right) */}
          <motion.div
            className="flex items-center justify-center pointer-events-none select-none"
            animate={{
              x: isTerminal ? [0, 1.8, 0] : [0, -1.8, 0]
            }}
            transition={{
              repeat: Infinity,
              duration: 1.2,
              ease: "easeInOut"
            }}
          >
            {isTerminal ? (
              // Pointing Right (to slide right into Normal mode)
              <svg 
                width="13" 
                height="13" 
                viewBox="0 0 16 16" 
                fill="none" 
                className="text-emerald-950 drop-shadow-xs"
              >
                <path 
                  d="M5.5 3.5L10 8L5.5 12.5" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
              </svg>
            ) : (
              // Pointing Left (to slide left into Terminal mode)
              <svg 
                width="13" 
                height="13" 
                viewBox="0 0 16 16" 
                fill="none" 
                className="text-slate-700 drop-shadow-xs"
              >
                <path 
                  d="M10.5 3.5L6 8L10.5 12.5" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
              </svg>
            )}
          </motion.div>
        </motion.div>
      </button>

      {/* Mode Label Tag for extra clarity */}
      <div className="hidden sm:flex flex-col ml-2.5 text-left leading-none">
        <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-white/90">
          {isTerminal ? 'TERMINAL' : 'NORMAL'}
        </span>
        <span className="text-[8px] text-white/45 font-mono">
          {isTerminal ? 'CLI MODU' : 'CAM UI'}
        </span>
      </div>
    </div>
  );
};
export default ThemeToggle;

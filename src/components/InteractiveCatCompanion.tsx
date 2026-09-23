import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MessageCircle, Heart, Compass, Mail, Terminal as TerminalIcon, X, Zap } from 'lucide-react';
import { soundEngine } from '../utils/audioSynth';

export type CatBehavior = 'walking-left' | 'walking-right' | 'curious-front' | 'sleeping' | 'purring';

export interface InteractiveCatCompanionProps {
  theme?: 'normal' | 'terminal';
  onNavigateToTab?: (tab: string) => void;
  onOpenTerminal?: () => void;
  // Future AI Assistant Architecture hooks
  onAskAssistant?: (query: string) => Promise<string> | void;
  isAiAssistantMode?: boolean;
}

const CAT_QUOTES = [
  {
    text: "Miyav! Hoş geldin! Ben Emirhan'ın dijital yol arkadaşıyım. 🐾",
    badge: "Selam!",
    actionTab: null
  },
  {
    text: "Emirhan'ın yapay zeka & Python projelerini inceledin mi? 'Projeler' sekmesinde çok yenilikçi çalışmalar var!",
    badge: "Tavsiye",
    actionTab: "projects"
  },
  {
    text: "Mırrr... Sırtımı kaşıdığın için teşekkürler! 😻 Burada kod yazmayı ve kahve kokusunu çok severim.",
    badge: "Mırrr",
    actionTab: null
  },
  {
    text: "Terminal modunu denedin mi? Sağ üstteki anahtarla terminale geçebilir ve 'Get-Projects' yazabilirsin!",
    badge: "İpucu",
    actionTab: "terminal"
  },
  {
    text: "Emirhan ile doğrudan iş birliği yapmak veya selam vermek istersen: emirhan0008@gmail.com ✉️",
    badge: "İletişim",
    actionTab: "contact"
  },
  {
    text: "Çok yakında Emirhan beni akıllı bir yapay zeka asistanına dönüştürecek! Altyapım şimdiden hazırlandı. 🚀",
    badge: "Yol Haritası",
    actionTab: null
  }
];

export function InteractiveCatCompanion({
  theme = 'normal',
  onNavigateToTab,
  onOpenTerminal
}: InteractiveCatCompanionProps) {
  const [behavior, setBehavior] = useState<CatBehavior>('curious-front');
  const [positionX, setPositionX] = useState<number>(35); // Percentage across screen (15% to 75%)
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [quoteIndex, setQuoteIndex] = useState<number>(0);
  const [petCount, setPetCount] = useState<number>(0);
  const [showHeart, setShowHeart] = useState<boolean>(false);

  // Future assistant extensible query state
  const [userQuery, setUserQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const isTerminal = theme === 'terminal';
  const behaviorTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Autonomous Behavior Loop (Wander, turn to visitor, rest)
  useEffect(() => {
    if (dialogOpen || isHovered) return;

    const cycleBehaviors = () => {
      const behaviors: CatBehavior[] = ['walking-left', 'walking-right', 'curious-front', 'curious-front', 'sleeping', 'purring'];
      const nextBehavior = behaviors[Math.floor(Math.random() * behaviors.length)];
      setBehavior(nextBehavior);

      if (nextBehavior === 'walking-left') {
        setPositionX(prev => Math.max(10, prev - (10 + Math.random() * 15)));
      } else if (nextBehavior === 'walking-right') {
        setPositionX(prev => Math.min(80, prev + (10 + Math.random() * 15)));
      }

      // Schedule next behavior change (between 4 and 8 seconds)
      const nextInterval = 4000 + Math.random() * 4500;
      behaviorTimerRef.current = setTimeout(cycleBehaviors, nextInterval);
    };

    behaviorTimerRef.current = setTimeout(cycleBehaviors, 4000);

    return () => {
      if (behaviorTimerRef.current) clearTimeout(behaviorTimerRef.current);
    };
  }, [dialogOpen, isHovered]);

  const handleCatClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playCatMeow();
    setPetCount(prev => prev + 1);
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 1400);

    setBehavior('curious-front');
    setDialogOpen(true);
    setQuoteIndex(prev => (prev + 1) % CAT_QUOTES.length);
  };

  const handlePetAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playCatPurr();
    setPetCount(prev => prev + 1);
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 1200);
  };

  const currentQuote = CAT_QUOTES[quoteIndex];

  return (
    <div 
      className="fixed bottom-3 z-[110] pointer-events-none select-none transition-all duration-700 ease-out"
      style={{
        left: `${positionX}%`,
        transform: 'translateX(-50%)'
      }}
    >
      {/* Floating Dialog / Speech Bubble */}
      <AnimatePresence>
        {dialogOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className={`pointer-events-auto absolute bottom-22 -left-32 sm:-left-36 w-72 sm:w-80 p-3.5 rounded-2xl shadow-2xl border backdrop-blur-xl z-20 text-left ${
              isTerminal 
                ? 'bg-[#03150d]/95 border-emerald-500/60 shadow-[0_0_25px_rgba(16,185,129,0.3)] text-emerald-300 font-mono'
                : 'liquid-glass-strong border-white/20 text-white font-sans'
            }`}
          >
            {/* Speech bubble header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-sm">🐾</span>
                <span className="text-xs font-bold tracking-tight">
                  {isTerminal ? 'CYBER-CAT // PROMPTER' : 'Dijital Asistan Kedi'}
                </span>
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  isTerminal ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-white/15 text-white/90'
                }`}>
                  {currentQuote.badge}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  soundEngine.playGlassClick();
                  setDialogOpen(false);
                }}
                className="text-white/40 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10 cursor-pointer"
                title="Kapat"
              >
                <X size={13} />
              </button>
            </div>

            {/* Bubble Quote Content */}
            <p className="text-xs text-white/90 leading-relaxed mb-3">
              {currentQuote.text}
            </p>

            {/* Interactive Actions */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-white/10 text-[10px]">
              {currentQuote.actionTab && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    soundEngine.playGlassClick();
                    if (currentQuote.actionTab === 'terminal' && onOpenTerminal) {
                      onOpenTerminal();
                    } else if (onNavigateToTab) {
                      onNavigateToTab(currentQuote.actionTab);
                    }
                    setDialogOpen(false);
                  }}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    isTerminal
                      ? 'bg-emerald-500 text-black hover:bg-emerald-400 font-bold'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold shadow-xs'
                  }`}
                >
                  <Sparkles size={10} />
                  <span>{currentQuote.actionTab === 'projects' ? 'Projeleri Aç' : currentQuote.actionTab === 'terminal' ? 'Terminale Geç' : 'İletişime Geç'}</span>
                </button>
              )}

              <button
                onClick={handlePetAction}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-all cursor-pointer"
                title="Sevgi Göster"
              >
                <Heart size={10} className="text-rose-400 fill-rose-400" />
                <span>Sev ({petCount})</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  soundEngine.playCatMeow();
                  setQuoteIndex(prev => (prev + 1) % CAT_QUOTES.length);
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-white/80 transition-all cursor-pointer ml-auto"
                title="Başka bir şey söyle"
              >
                <span>Farklı Söz 🐾</span>
              </button>
            </div>

            {/* Bottom Arrow Pointer */}
            <div className={`absolute -bottom-2 left-32 sm:left-36 w-3.5 h-3.5 rotate-45 border-r border-b ${
              isTerminal ? 'bg-[#03150d] border-emerald-500/60' : 'bg-slate-900 border-white/20'
            }`} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Heart animation on pet */}
      <AnimatePresence>
        {showHeart && (
          <motion.div
            initial={{ opacity: 1, y: 0, scale: 0.8 }}
            animate={{ opacity: 0, y: -45, scale: 1.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute -top-9 left-7 text-rose-400 pointer-events-none z-30"
          >
            <Heart size={20} className="fill-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sleeping 'Zzz' animation */}
      {behavior === 'sleeping' && !dialogOpen && (
        <div className="absolute -top-9 right-1 font-mono font-bold text-xs text-emerald-400/80 pointer-events-none select-none">
          <motion.span
            animate={{ y: [-2, -12], opacity: [0, 1, 0], scale: [0.8, 1.2] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="inline-block"
          >
            Zzz...
          </motion.span>
        </div>
      )}

      {/* Interactive Cat Character SVG & Hitbox */}
      <motion.div
        className="pointer-events-auto cursor-pointer relative group"
        onClick={handleCatClick}
        onMouseEnter={() => {
          setIsHovered(true);
          setBehavior('curious-front');
        }}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        title="Emirhan'ın Dijital Kedisi (Bana tıkla!) 🐾"
      >
        {/* Glow halo under cat */}
        <div className={`absolute -bottom-1 -left-3 -right-3 h-4 rounded-full blur-md transition-all duration-300 ${
          isTerminal ? 'bg-emerald-500/40' : 'bg-teal-400/30'
        }`} />

        {/* Dynamic SVG Animated Cat - Scaled up for prominent, friendly appearance */}
        <svg 
          width="82" 
          height="72" 
          viewBox="0 0 64 56" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="relative drop-shadow-[0_10px_20px_rgba(0,0,0,0.65)]"
        >
          {/* Animated Tail */}
          <motion.path
            d={behavior === 'walking-left' 
              ? "M42 38 C 48 34, 56 30, 54 20 C 52 14, 46 16, 48 24" 
              : behavior === 'walking-right'
              ? "M18 38 C 12 34, 4 30, 6 20 C 8 14, 14 16, 12 24"
              : "M42 38 C 50 36, 56 32, 54 22 C 52 16, 47 18, 49 26"
            }
            stroke={isTerminal ? "#10b981" : "#38bdf8"}
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
            animate={{
              d: [
                "M42 38 C 50 36, 56 32, 54 22 C 52 16, 47 18, 49 26",
                "M42 38 C 52 38, 58 35, 57 20 C 55 12, 48 16, 50 24",
                "M42 38 C 50 36, 56 32, 54 22 C 52 16, 47 18, 49 26"
              ]
            }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
          />

          {/* Cat Body */}
          <ellipse 
            cx="32" 
            cy="36" 
            rx="16" 
            ry="11" 
            fill={isTerminal ? "#041b12" : "#0f172a"} 
            stroke={isTerminal ? "#34d399" : "#38bdf8"} 
            strokeWidth="1.8"
          />

          {/* Cyber Accent Circuit lines on back */}
          <path
            d="M26 33 L32 30 L38 33"
            stroke={isTerminal ? "rgba(52,211,153,0.5)" : "rgba(56,189,248,0.5)"}
            strokeWidth="1"
            strokeLinecap="round"
          />

          {/* Cat Paws / Legs */}
          {behavior === 'walking-left' || behavior === 'walking-right' ? (
            <motion.g
              animate={{ y: [0, -2, 0] }}
              transition={{ repeat: Infinity, duration: 0.4 }}
            >
              <ellipse cx="23" cy="45" rx="3.5" ry="2" fill={isTerminal ? "#34d399" : "#e2e8f0"} />
              <ellipse cx="30" cy="46" rx="3.5" ry="2" fill={isTerminal ? "#10b981" : "#cbd5e1"} />
              <ellipse cx="37" cy="45" rx="3.5" ry="2" fill={isTerminal ? "#34d399" : "#e2e8f0"} />
              <ellipse cx="43" cy="46" rx="3.5" ry="2" fill={isTerminal ? "#10b981" : "#cbd5e1"} />
            </motion.g>
          ) : (
            <g>
              <ellipse cx="24" cy="45" rx="3.5" ry="2" fill={isTerminal ? "#34d399" : "#cbd5e1"} />
              <ellipse cx="32" cy="45.5" rx="3.5" ry="2" fill={isTerminal ? "#10b981" : "#e2e8f0"} />
              <ellipse cx="40" cy="45" rx="3.5" ry="2" fill={isTerminal ? "#34d399" : "#cbd5e1"} />
            </g>
          )}

          {/* Cat Head Container */}
          <g>
            {/* Left Ear */}
            <motion.path
              d={behavior === 'walking-left' ? "M20 19 L15 6 L26 13 Z" : "M20 18 L16 7 L27 13 Z"}
              fill={isTerminal ? "#041b12" : "#0f172a"}
              stroke={isTerminal ? "#34d399" : "#38bdf8"}
              strokeWidth="1.6"
              animate={isHovered ? { rotate: [-4, 4, -4] } : {}}
              transition={{ repeat: Infinity, duration: 0.8 }}
            />
            {/* Left Ear Inner Pink / Glow */}
            <polygon 
              points="19,16 17,9 24,13" 
              fill={isTerminal ? "rgba(52,211,153,0.4)" : "rgba(244,114,182,0.6)"} 
            />

            {/* Right Ear */}
            <motion.path
              d={behavior === 'walking-right' ? "M44 19 L49 6 L38 13 Z" : "M44 18 L48 7 L37 13 Z"}
              fill={isTerminal ? "#041b12" : "#0f172a"}
              stroke={isTerminal ? "#34d399" : "#38bdf8"}
              strokeWidth="1.6"
              animate={isHovered ? { rotate: [4, -4, 4] } : {}}
              transition={{ repeat: Infinity, duration: 0.8 }}
            />
            {/* Right Ear Inner Pink / Glow */}
            <polygon 
              points="45,16 47,9 40,13" 
              fill={isTerminal ? "rgba(52,211,153,0.4)" : "rgba(244,114,182,0.6)"} 
            />

            {/* Head Round */}
            <circle 
              cx="32" 
              cy="21" 
              r="12.5" 
              fill={isTerminal ? "#02120c" : "#0a0f1d"} 
              stroke={isTerminal ? "#34d399" : "#38bdf8"} 
              strokeWidth="1.8"
            />

            {/* Whiskers */}
            <line x1="16" y1="23" x2="24" y2="23" stroke={isTerminal ? "#6ee7b7" : "#94a3b8"} strokeWidth="1" strokeLinecap="round" />
            <line x1="15" y1="26" x2="24" y2="25" stroke={isTerminal ? "#6ee7b7" : "#94a3b8"} strokeWidth="1" strokeLinecap="round" />
            <line x1="48" y1="23" x2="40" y2="23" stroke={isTerminal ? "#6ee7b7" : "#94a3b8"} strokeWidth="1" strokeLinecap="round" />
            <line x1="49" y1="26" x2="40" y2="25" stroke={isTerminal ? "#6ee7b7" : "#94a3b8"} strokeWidth="1" strokeLinecap="round" />

            {/* Eyes */}
            {behavior === 'sleeping' ? (
              // Closed smiling eyes (^ ^)
              <g stroke={isTerminal ? "#34d399" : "#38bdf8"} strokeWidth="1.6" strokeLinecap="round">
                <path d="M26 21 Q28 18 30 21" />
                <path d="M34 21 Q36 18 38 21" />
              </g>
            ) : (
              // Big expressive eyes
              <g>
                {/* Left eye */}
                <ellipse 
                  cx={behavior === 'walking-left' ? "26.5" : behavior === 'walking-right' ? "28.5" : "28"} 
                  cy="20.5" 
                  rx="2.6" 
                  ry="3.2" 
                  fill={isTerminal ? "#34d399" : "#38bdf8"} 
                />
                {/* Left pupil reflection */}
                <circle cx={behavior === 'walking-left' ? "26" : "27.5"} cy="19.5" r="0.9" fill="#ffffff" />

                {/* Right eye */}
                <ellipse 
                  cx={behavior === 'walking-left' ? "34.5" : behavior === 'walking-right' ? "36.5" : "36"} 
                  cy="20.5" 
                  rx="2.6" 
                  ry="3.2" 
                  fill={isTerminal ? "#34d399" : "#38bdf8"} 
                />
                {/* Right pupil reflection */}
                <circle cx={behavior === 'walking-left' ? "34" : "35.5"} cy="19.5" r="0.9" fill="#ffffff" />
              </g>
            )}

            {/* Cute Nose & Mouth */}
            <polygon points="32,24.5 30.8,23 33.2,23" fill={isTerminal ? "#6ee7b7" : "#f472b6"} />
            <path 
              d="M32 25 L32 26.5 M32 26.5 C31 27.5 29.5 27 29.5 27 M32 26.5 C33 27.5 34.5 27 34.5 27" 
              stroke={isTerminal ? "#34d399" : "#94a3b8"} 
              strokeWidth="1.1" 
              strokeLinecap="round" 
              fill="none" 
            />

            {/* Glowing Cyber Collar & EY Tag */}
            <path 
              d="M26 31 Q32 34 38 31" 
              stroke={isTerminal ? "#10b981" : "#06b6d4"} 
              strokeWidth="2" 
              strokeLinecap="round"
              fill="none"
            />
            <circle 
              cx="32" 
              cy="34" 
              r="2.2" 
              fill={isTerminal ? "#34d399" : "#38bdf8"} 
              className="animate-pulse"
            />
          </g>
        </svg>

        {/* Micro Interaction Tooltip badge */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-black/80 text-[9px] font-bold text-emerald-300 border border-emerald-500/40 whitespace-nowrap shadow-xs">
          Bana tıkla! 🐾
        </div>
      </motion.div>
    </div>
  );
}

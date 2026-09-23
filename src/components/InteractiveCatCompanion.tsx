import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Send, Loader2, FolderGit2, Terminal, Mail, BookOpen, Sparkles } from 'lucide-react';
import { soundEngine } from '../utils/audioSynth';
import { askGroqCatAssistant } from '../utils/groqService';

export type CatBehavior = 'walking-left' | 'walking-right' | 'curious-front' | 'sleeping' | 'purring';

export interface InteractiveCatCompanionProps {
  theme?: 'normal' | 'terminal';
  onNavigateToTab?: (tab: string) => void;
  onOpenTerminal?: () => void;
}

const CAT_QUOTES = [
  {
    text: "Miyav! Hoş geldin. Projeler sekmesine veya İletişim bölümüne göz atabilir, bana dilediğini sorabilirsin. 🐾",
  },
  {
    text: "Emirhan'ın mobil asistan ve yapay zeka çalışmalarını görmek için Projeler sekmesine bakabilirsin.",
  },
  {
    text: "Hacker görünümü için Terminal moduna geçebilir ya da PowerShell komutlarını deneyebilirsin!",
  },
  {
    text: "Doğrudan mesaj iletmek istersen İletişim sayfasından veya e-posta ile ulaşabilirsin. ✉️",
  },
  {
    text: "Mırrr... Dinleniyorum. Kafana takılan bir şey varsa hemen sorabilirsin. 🐾",
  }
];

const PRESET_QUERIES = [
  "Projeler?",
  "Kimdir?",
  "Mod Değiştir",
  "İletişim?"
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

  // Active cat message shown in bubble
  const [currentMessage, setCurrentMessage] = useState<string>(CAT_QUOTES[0].text);
  const [inputQuery, setInputQuery] = useState('');
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

      const nextInterval = 4000 + Math.random() * 4500;
      behaviorTimerRef.current = setTimeout(cycleBehaviors, nextInterval);
    };

    behaviorTimerRef.current = setTimeout(cycleBehaviors, 4000);

    return () => {
      if (behaviorTimerRef.current) clearTimeout(behaviorTimerRef.current);
    };
  }, [dialogOpen, isHovered]);

  // Click on Cat: Toggles the speech bubble open or closed
  const handleCatClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playCatMeow();
    setPetCount(prev => prev + 1);
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 1400);

    setBehavior('curious-front');
    setDialogOpen(prev => !prev);
  };

  const handlePetAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playCatPurr();
    setPetCount(prev => prev + 1);
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 1200);
  };

  const handleNextQuote = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playCatMeow();
    const nextIdx = (quoteIndex + 1) % CAT_QUOTES.length;
    setQuoteIndex(nextIdx);
    setCurrentMessage(CAT_QUOTES[nextIdx].text);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isThinking) return;

    soundEngine.playAiSparkle();
    setInputQuery('');
    setBehavior('curious-front');
    setIsThinking(true);

    try {
      const reply = await askGroqCatAssistant(query, [{ sender: 'user', text: query }]);
      setCurrentMessage(reply);
      soundEngine.playCatPurr();
    } catch {
      setCurrentMessage("Miyav! 🐾 Detaylar için Projeler ve İletişim sekmesine göz atabilirsin!");
    } finally {
      setIsThinking(false);
    }
  };

  // Render text with clickable GREEN and UNDERLINED keywords
  const renderFormattedText = (text: string) => {
    const regex = /(projeler(?:i|de|den|e)?|terminal(?:e|de|den)?|powershell|iletişim(?:e|de|den)?|makaleler(?:e|de|den)?)/gi;
    const parts = text.split(regex);

    return parts.map((part, index) => {
      const lower = part.toLowerCase();

      if (lower.startsWith('proje')) {
        return (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              soundEngine.playGlassClick();
              onNavigateToTab?.('projects');
            }}
            className="text-emerald-400 hover:text-emerald-300 font-bold underline underline-offset-4 cursor-pointer transition-colors inline-block"
            title="Projelere Git"
          >
            {part}
          </button>
        );
      }

      if (lower.startsWith('terminal') || lower === 'powershell') {
        return (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              soundEngine.playTerminalKey();
              onOpenTerminal?.();
            }}
            className="text-emerald-400 hover:text-emerald-300 font-bold underline underline-offset-4 cursor-pointer transition-colors inline-block"
            title="Terminal Moduna Geç"
          >
            {part}
          </button>
        );
      }

      if (lower.startsWith('iletişim')) {
        return (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              soundEngine.playGlassClick();
              onNavigateToTab?.('contact');
            }}
            className="text-emerald-400 hover:text-emerald-300 font-bold underline underline-offset-4 cursor-pointer transition-colors inline-block"
            title="İletişime Git"
          >
            {part}
          </button>
        );
      }

      if (lower.startsWith('makale')) {
        return (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              soundEngine.playGlassClick();
              onNavigateToTab?.('articles');
            }}
            className="text-emerald-400 hover:text-emerald-300 font-bold underline underline-offset-4 cursor-pointer transition-colors inline-block"
            title="Makalelere Git"
          >
            {part}
          </button>
        );
      }

      return <span key={index}>{part}</span>;
    });
  };

  // Generate interactive redirection buttons based on text content
  const getActionButtons = (text: string) => {
    const lower = text.toLowerCase();
    const buttons: { id: string; label: string; icon: React.ReactNode; onClick: () => void }[] = [];

    if (lower.includes('proje')) {
      buttons.push({
        id: 'projects',
        label: 'Projelere Git',
        icon: <FolderGit2 size={12} />,
        onClick: () => {
          soundEngine.playGlassClick();
          onNavigateToTab?.('projects');
        }
      });
    }

    if (lower.includes('terminal') || lower.includes('powershell') || lower.includes('mod')) {
      buttons.push({
        id: 'terminal',
        label: isTerminal ? 'Normal Moda Geç' : 'Mod Değiştir (Terminal)',
        icon: <Terminal size={12} />,
        onClick: () => {
          soundEngine.playTerminalKey();
          onOpenTerminal?.();
        }
      });
    }

    if (lower.includes('iletişim') || lower.includes('mail') || lower.includes('eposta') || lower.includes('e-posta')) {
      buttons.push({
        id: 'contact',
        label: 'İletişime Geç',
        icon: <Mail size={12} />,
        onClick: () => {
          soundEngine.playGlassClick();
          onNavigateToTab?.('contact');
        }
      });
    }

    if (lower.includes('makale') || lower.includes('yazı')) {
      buttons.push({
        id: 'articles',
        label: 'Makalelere Git',
        icon: <BookOpen size={12} />,
        onClick: () => {
          soundEngine.playGlassClick();
          onNavigateToTab?.('articles');
        }
      });
    }

    return buttons;
  };

  const actionButtons = getActionButtons(currentMessage);

  // Responsive bubble alignment based on cat screen position
  const bubbleAlignClass = positionX < 25 
    ? 'left-0 translate-x-0' 
    : positionX > 75 
    ? 'right-0 translate-x-0' 
    : 'left-1/2 -translate-x-1/2';

  const tailAlignClass = positionX < 25
    ? 'left-10'
    : positionX > 75
    ? 'right-10'
    : 'left-1/2 -translate-x-1/2';

  return (
    <div 
      className="fixed bottom-3 z-[110] pointer-events-none select-none transition-all duration-700 ease-out"
      style={{
        left: `${positionX}%`,
        transform: 'translateX(-50%)'
      }}
    >
      {/* PURE COMIC CLOUD SPEECH BUBBLE (No rectangular box, no border) */}
      <AnimatePresence>
        {dialogOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.88 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.88 }}
            className={`pointer-events-auto absolute bottom-[86px] w-80 sm:w-92 z-20 text-left select-text ${bubbleAlignClass}`}
          >
            {/* The Cloud Container */}
            <div className="relative px-7 py-6">
              
              {/* Organic Comic Cloud SVG Background (Fluffy cloud lobes, borderless/soft stroke) */}
              <svg 
                viewBox="0 0 340 200" 
                preserveAspectRatio="none" 
                className="absolute -inset-3 w-[calc(100%+24px)] h-[calc(100%+24px)] -z-10 overflow-visible drop-shadow-[0_16px_35px_rgba(0,0,0,0.65)]"
              >
                <path
                  d="M 50,80
                     C 28,55 42,28 75,32
                     C 95,12 135,10 160,25
                     C 185,8 225,8 250,26
                     C 275,14 308,30 314,58
                     C 336,78 336,115 315,135
                     C 328,162 298,188 268,182
                     C 245,198 205,198 180,185
                     C 155,198 115,198 90,184
                     C 62,192 35,172 40,145
                     C 18,128 18,98 50,80 Z"
                  fill={isTerminal ? "rgba(2, 24, 14, 0.95)" : "rgba(15, 23, 42, 0.92)"}
                  stroke={isTerminal ? "rgba(52, 211, 153, 0.4)" : "rgba(255, 255, 255, 0.2)"}
                  strokeWidth="1.6"
                />
              </svg>

              {/* Trailing Comic Cloud Puffs leading down to the cat */}
              <div className={`absolute -bottom-6 ${tailAlignClass} flex flex-col items-center gap-1 pointer-events-none z-10`}>
                <div className={`w-3.5 h-3.5 rounded-full shadow-md ${
                  isTerminal 
                    ? 'bg-[#02180e] border border-emerald-500/50 shadow-emerald-900/30' 
                    : 'bg-slate-900 border border-white/20 shadow-black/40'
                }`} />
                <div className={`w-2.5 h-2.5 rounded-full shadow-xs ${
                  isTerminal 
                    ? 'bg-[#02180e] border border-emerald-500/50' 
                    : 'bg-slate-900 border border-white/20'
                }`} />
                <div className={`w-1.5 h-1.5 rounded-full ${
                  isTerminal 
                    ? 'bg-[#02180e] border border-emerald-500/50' 
                    : 'bg-slate-900 border border-white/20'
                }`} />
              </div>

              {/* Thinking Indicator or Message Content */}
              {isThinking ? (
                <div className="flex items-center gap-2 text-xs py-2 text-emerald-400 font-mono">
                  <Loader2 size={14} className="animate-spin text-emerald-400" />
                  <span>Mırrr... Bulutta düşünüyorum 🐾☁️</span>
                </div>
              ) : (
                <>
                  <p className="text-xs leading-relaxed font-normal">
                    {renderFormattedText(currentMessage)}
                  </p>

                  {/* Interactive Redirection Buttons */}
                  {actionButtons.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-white/10 flex flex-wrap gap-1.5">
                      {actionButtons.map((btn) => (
                        <button
                          key={btn.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            btn.onClick();
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500 hover:bg-emerald-400 text-black shadow-md shadow-emerald-500/25 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                        >
                          {btn.icon}
                          <span>{btn.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Minimalist Question Input */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="mt-2.5 pt-2 border-t border-white/10 flex items-center gap-1.5"
              >
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder="Kediciğe sor... 🐾"
                  disabled={isThinking}
                  className={`flex-1 min-w-0 px-2.5 py-1 text-xs rounded-full bg-black/40 border border-white/15 outline-hidden placeholder:text-white/40 transition-colors ${
                    isTerminal ? 'text-emerald-300 font-mono focus:border-emerald-400' : 'text-white font-sans focus:border-white/40'
                  }`}
                />
                <button
                  type="submit"
                  disabled={isThinking || !inputQuery.trim()}
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all ${
                    inputQuery.trim() && !isThinking
                      ? 'bg-emerald-500 text-black hover:bg-emerald-400 cursor-pointer shadow-sm shadow-emerald-500/30'
                      : 'bg-white/10 text-white/30 cursor-not-allowed'
                  }`}
                  title="Sor"
                >
                  <Send size={10} />
                </button>
              </form>

              {/* Quick Prompt Chips & Interactions Footer */}
              <div className="mt-1.5 pt-1 flex items-center justify-between gap-1 text-[9px] text-white/60">
                <div className="flex flex-wrap gap-1">
                  {PRESET_QUERIES.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (q === "Mod Değiştir") {
                          soundEngine.playTerminalKey();
                          onOpenTerminal?.();
                        } else {
                          handleSendMessage(q);
                        }
                      }}
                      className="px-2 py-0.5 rounded-full bg-white/5 hover:bg-white/15 text-white/80 hover:text-emerald-300 border border-white/10 transition-all cursor-pointer"
                    >
                      {q}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={handlePetAction}
                    className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full hover:bg-white/10 text-rose-300 hover:text-rose-200 transition-colors cursor-pointer"
                    title="Sevgi Göster"
                  >
                    <Heart size={9} className="fill-rose-400 text-rose-400" />
                    <span>{petCount}</span>
                  </button>
                  <button
                    onClick={handleNextQuote}
                    className="px-1.5 py-0.5 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
                    title="Farklı Söz Söyle"
                  >
                    <Sparkles size={9} />
                  </button>
                </div>
              </div>

            </div>
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
        title="Emirhan'ın Siber Kedisi (Açmak / Kapatmak için tıkla) 🐾"
      >
        {/* Glow halo under cat */}
        <div className={`absolute -bottom-1 -left-3 -right-3 h-4 rounded-full blur-md transition-all duration-300 ${
          isTerminal ? 'bg-emerald-500/40' : 'bg-teal-400/30'
        }`} />

        {/* Dynamic SVG Animated Cat */}
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
            {/* Left Ear Inner */}
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
            {/* Right Ear Inner */}
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
              <g stroke={isTerminal ? "#34d399" : "#38bdf8"} strokeWidth="1.6" strokeLinecap="round">
                <path d="M26 21 Q28 18 30 21" />
                <path d="M34 21 Q36 18 38 21" />
              </g>
            ) : (
              <g>
                <ellipse 
                  cx={behavior === 'walking-left' ? "26.5" : behavior === 'walking-right' ? "28.5" : "28"} 
                  cy="20.5" 
                  rx="2.6" 
                  ry="3.2" 
                  fill={isTerminal ? "#34d399" : "#38bdf8"} 
                />
                <circle cx={behavior === 'walking-left' ? "26" : "27.5"} cy="19.5" r="0.9" fill="#ffffff" />

                <ellipse 
                  cx={behavior === 'walking-left' ? "34.5" : behavior === 'walking-right' ? "36.5" : "36"} 
                  cy="20.5" 
                  rx="2.6" 
                  ry="3.2" 
                  fill={isTerminal ? "#34d399" : "#38bdf8"} 
                />
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
          {dialogOpen ? 'Kapatmak için tıkla 🐾' : 'Konuşmak için tıkla 🐾'}
        </div>
      </motion.div>
    </div>
  );
}

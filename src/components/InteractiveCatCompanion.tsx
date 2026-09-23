import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Send, Loader2, FolderGit2, Terminal, Mail, BookOpen } from 'lucide-react';
import { soundEngine } from '../utils/audioSynth';
import { askGroqCatAssistant } from '../utils/groqService';

export type CatBehavior = 'walking-left' | 'walking-right' | 'curious-front' | 'sleeping' | 'purring';

export interface InteractiveCatCompanionProps {
  theme?: 'normal' | 'terminal';
  onNavigateToTab?: (tab: string) => void;
  onOpenTerminal?: () => void;
}

export interface CloudBubbleItem {
  id: string;
  sender: 'user' | 'cat';
  text: string;
}

const CAT_QUOTES = [
  "Miyav! Hoş geldin. Projeler sekmesine veya İletişim bölümüne göz atabilir, bana dilediğini sorabilirsin. 🐾",
  "Emirhan'ın mobil asistan ve yapay zeka çalışmalarını görmek için Projeler sekmesine bakabilirsin.",
  "Hacker görünümü için Terminal moduna geçebilir ya da PowerShell komutlarını deneyebilirsin!",
  "Doğrudan mesaj iletmek istersen İletişim sayfasından veya e-posta ile ulaşabilirsin. ✉️",
  "Mırrr... Dinleniyorum. Kafana takılan bir şey varsa hemen sorabilirsin. 🐾"
];

const PRESET_QUERIES = [
  "Projeleri Özetle",
  "Emirhan Kimdir?",
  "Mod Değiştir",
  "İletişim Bilgileri"
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

  // Maximum 2 bubbles on screen at any time! (Oldest fades out when 3rd arrives)
  const [bubbles, setBubbles] = useState<CloudBubbleItem[]>([
    {
      id: 'init-cat',
      sender: 'cat',
      text: CAT_QUOTES[0]
    }
  ]);

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

  // Click on Cat: Toggles the cloud bubbles & floating input on or off
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

  // Add message ensuring STRICTLY MAXIMUM 2 BUBBLES on screen
  const addBubbleStrictMaxTwo = (newBubble: CloudBubbleItem) => {
    setBubbles(prev => {
      const combined = [...prev, newBubble];
      // Keep only the last 2 items; older ones get dropped and fade out via AnimatePresence
      return combined.slice(-2);
    });
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isThinking) return;

    soundEngine.playAiSparkle();
    setInputQuery('');
    setBehavior('curious-front');

    // 1. Add Visitor's message bubble (triggers fade-out of oldest if already 2)
    const userBubble: CloudBubbleItem = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query
    };
    addBubbleStrictMaxTwo(userBubble);
    setIsThinking(true);

    try {
      const historyForAi = bubbles.map(b => ({
        sender: b.sender,
        text: b.text
      }));
      const reply = await askGroqCatAssistant(query, historyForAi);
      
      // 2. Add Cat's reply bubble (triggers fade-out of oldest if already 2)
      const catBubble: CloudBubbleItem = {
        id: `cat-${Date.now()}`,
        sender: 'cat',
        text: reply
      };
      addBubbleStrictMaxTwo(catBubble);
      soundEngine.playCatPurr();
    } catch {
      const fallbackBubble: CloudBubbleItem = {
        id: `cat-${Date.now()}`,
        sender: 'cat',
        text: "Miyav! 🐾 Detaylar için Projeler ve İletişim sekmesine göz atabilirsin!"
      };
      addBubbleStrictMaxTwo(fallbackBubble);
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
            className={`font-bold underline underline-offset-4 cursor-pointer transition-colors inline-block ${
              isTerminal ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-600 hover:text-emerald-500'
            }`}
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
            className={`font-bold underline underline-offset-4 cursor-pointer transition-colors inline-block ${
              isTerminal ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-600 hover:text-emerald-500'
            }`}
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
            className={`font-bold underline underline-offset-4 cursor-pointer transition-colors inline-block ${
              isTerminal ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-600 hover:text-emerald-500'
            }`}
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
            className={`font-bold underline underline-offset-4 cursor-pointer transition-colors inline-block ${
              isTerminal ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-600 hover:text-emerald-500'
            }`}
            title="Makalelere Git"
          >
            {part}
          </button>
        );
      }

      return <span key={index}>{part}</span>;
    });
  };

  // Generate interactive redirection buttons for cat messages
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

  // Responsive alignment to keep bubbles on screen
  const containerAlignClass = positionX < 30 
    ? 'left-0 translate-x-0' 
    : positionX > 70 
    ? 'right-0 translate-x-0' 
    : 'left-1/2 -translate-x-1/2';

  return (
    <div 
      className="fixed bottom-3 z-[110] pointer-events-none select-none transition-all duration-700 ease-out"
      style={{
        left: `${positionX}%`,
        transform: 'translateX(-50%)'
      }}
    >
      {/* CLOUD BUBBLE STACK & FLOATING INPUT (Strictly max 2 bubbles, no window background) */}
      <AnimatePresence>
        {dialogOpen && (
          <div className={`pointer-events-none absolute bottom-[78px] w-84 sm:w-96 flex flex-col items-center gap-3 z-20 ${containerAlignClass}`}>
            
            {/* Exactly 2 Cloud Bubbles Stack with graceful fade-in & fade-out */}
            <div className="w-full flex flex-col gap-2.5 items-center">
              <AnimatePresence initial={false}>
                {bubbles.map((item) => {
                  const isCat = item.sender === 'cat';
                  const actionButtons = isCat ? getActionButtons(item.text) : [];

                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 15, scale: 0.88 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -16, scale: 0.84, transition: { duration: 0.35, ease: 'easeOut' } }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      className={`relative pointer-events-auto w-full px-7 py-5 select-text ${
                        isCat ? 'self-start sm:self-center' : 'self-end sm:self-center'
                      }`}
                    >
                      {/* Comic Cloud SVG Background (Matching pngwing.com.png puffy cloud with black outline & soft shadow) */}
                      <svg 
                        viewBox="0 0 340 200" 
                        preserveAspectRatio="none" 
                        className="absolute inset-0 w-full h-full -z-10 overflow-visible drop-shadow-[0_12px_26px_rgba(0,0,0,0.38)]"
                      >
                        <path
                          d="M 50,80
                             C 26,55 40,26 75,30
                             C 95,10 135,8 160,22
                             C 185,8 225,8 248,24
                             C 275,12 308,28 314,56
                             C 336,76 336,115 315,135
                             C 328,162 298,188 268,182
                             C 245,198 205,198 180,185
                             C 155,198 115,198 90,184
                             C 62,192 35,170 40,142
                             C 18,126 18,96 50,80 Z"
                          fill={
                            isTerminal 
                              ? (isCat ? '#031a0e' : '#01120a') 
                              : (isCat ? '#ffffff' : '#f8fafc')
                          }
                          stroke={
                            isTerminal 
                              ? (isCat ? '#10b981' : '#059669') 
                              : '#0f172a'
                          }
                          strokeWidth="2.6"
                        />
                      </svg>

                      {/* Trailing Comic Thought Bubbles pointing to the speaker (like pngwing.com.png) */}
                      {isCat ? (
                        /* Cat's cloud bubbles pointing down-left toward cat */
                        <div className="absolute -bottom-5 left-10 flex flex-col items-center gap-0.5 pointer-events-none">
                          <div className={`w-3.5 h-2.5 rounded-full border-[2px] -rotate-25 shadow-xs ${
                            isTerminal ? 'bg-[#031a0e] border-emerald-500' : 'bg-white border-slate-900'
                          }`} />
                          <div className={`w-2.5 h-1.8 rounded-full border-[1.8px] -rotate-25 ${
                            isTerminal ? 'bg-[#031a0e] border-emerald-500' : 'bg-white border-slate-900'
                          }`} />
                          <div className={`w-1.5 h-1 rounded-full border-[1.4px] -rotate-25 ${
                            isTerminal ? 'bg-[#031a0e] border-emerald-500' : 'bg-white border-slate-900'
                          }`} />
                        </div>
                      ) : (
                        /* Visitor's cloud bubbles pointing down-right */
                        <div className="absolute -bottom-5 right-12 flex flex-col items-center gap-0.5 pointer-events-none">
                          <div className={`w-3.5 h-2.5 rounded-full border-[2px] rotate-25 shadow-xs ${
                            isTerminal ? 'bg-[#01120a] border-emerald-600' : 'bg-slate-50 border-slate-900'
                          }`} />
                          <div className={`w-2.5 h-1.8 rounded-full border-[1.8px] rotate-25 ${
                            isTerminal ? 'bg-[#01120a] border-emerald-600' : 'bg-slate-50 border-slate-900'
                          }`} />
                          <div className={`w-1.5 h-1 rounded-full border-[1.4px] rotate-25 ${
                            isTerminal ? 'bg-[#01120a] border-emerald-600' : 'bg-slate-50 border-slate-900'
                          }`} />
                        </div>
                      )}

                      {/* Content inside cloud */}
                      <div className="relative z-10 text-xs leading-relaxed px-1">
                        {/* Sender Micro Label */}
                        <div className="text-[10px] font-bold mb-1 flex items-center gap-1">
                          {isCat ? (
                            <span className={isTerminal ? 'text-emerald-400' : 'text-emerald-700'}>
                              🐾 Kedi:
                            </span>
                          ) : (
                            <span className={isTerminal ? 'text-emerald-500' : 'text-slate-500'}>
                              💬 Sen:
                            </span>
                          )}
                        </div>

                        {/* Bubble Text */}
                        <p className={`font-normal ${
                          isTerminal ? 'text-emerald-200' : 'text-slate-900'
                        }`}>
                          {isCat ? renderFormattedText(item.text) : item.text}
                        </p>

                        {/* Interactive Redirection Buttons inside cat's bubble */}
                        {isCat && actionButtons.length > 0 && (
                          <div className="mt-2.5 pt-1.5 border-t border-black/10 flex flex-wrap gap-1.5">
                            {actionButtons.map((btn) => (
                              <button
                                key={btn.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  btn.onClick();
                                }}
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer ${
                                  isTerminal
                                    ? 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-emerald-500/25'
                                    : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-600/30'
                                }`}
                              >
                                {btn.icon}
                                <span>{btn.label}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Thinking Indicator as small floating thought cloud */}
              {isThinking && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  className="relative pointer-events-auto px-5 py-2.5"
                >
                  <svg 
                    viewBox="0 0 200 80" 
                    preserveAspectRatio="none" 
                    className="absolute inset-0 w-full h-full -z-10 overflow-visible drop-shadow-md"
                  >
                    <path
                      d="M 30,40 C 15,25 25,10 45,15 C 60,5 90,5 105,15 C 120,5 150,5 165,15 C 185,15 195,30 185,50 C 195,65 175,75 155,70 C 135,78 110,78 95,70 C 75,78 50,75 40,60 C 20,55 20,45 30,40 Z"
                      fill={isTerminal ? '#031a0e' : '#ffffff'}
                      stroke={isTerminal ? '#10b981' : '#0f172a'}
                      strokeWidth="2.2"
                    />
                  </svg>
                  <div className={`flex items-center gap-2 text-xs font-mono font-medium ${
                    isTerminal ? 'text-emerald-400' : 'text-slate-900'
                  }`}>
                    <Loader2 size={13} className="animate-spin text-emerald-500" />
                    <span>Mırrr... Düşünüyorum 🐾💭</span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* SEPARATE FLOATING INPUT (No container background, floats freely in the air) */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="w-full max-w-[340px] flex items-center gap-1.5 pointer-events-auto"
            >
              <div className={`flex-1 flex items-center gap-2 px-3.5 py-1.5 rounded-full shadow-xl backdrop-blur-xl border transition-all ${
                isTerminal
                  ? 'bg-black/80 border-emerald-500/50 text-emerald-300 focus-within:border-emerald-400'
                  : 'bg-black/75 border-white/25 text-white focus-within:border-emerald-400'
              }`}>
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder="Kediciğe bir soru sor... 🐾"
                  disabled={isThinking}
                  className="flex-1 min-w-0 bg-transparent text-xs outline-hidden placeholder:text-white/40"
                />
                <button
                  type="submit"
                  disabled={isThinking || !inputQuery.trim()}
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all ${
                    inputQuery.trim() && !isThinking
                      ? 'bg-emerald-500 text-black hover:bg-emerald-400 cursor-pointer shadow-sm shadow-emerald-500/40'
                      : 'bg-white/10 text-white/30 cursor-not-allowed'
                  }`}
                  title="Gönder"
                >
                  <Send size={11} />
                </button>
              </div>
            </form>

            {/* PRESET QUESTIONS (Floating freely under input with NO background) */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pointer-events-auto max-w-[350px]">
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
                  className={`px-2.5 py-1 rounded-full text-[10px] font-medium backdrop-blur-md border shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer ${
                    isTerminal
                      ? 'bg-black/70 border-emerald-500/40 text-emerald-300 hover:border-emerald-400 hover:text-white'
                      : 'bg-black/70 border-white/20 text-white/90 hover:border-emerald-400 hover:text-emerald-300'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>

          </div>
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

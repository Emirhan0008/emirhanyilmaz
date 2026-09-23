import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, X, Zap, Send, RotateCcw, Loader2, ArrowRight } from 'lucide-react';
import { soundEngine } from '../utils/audioSynth';
import { askGroqCatAssistant } from '../utils/groqService';

export type CatBehavior = 'walking-left' | 'walking-right' | 'curious-front' | 'sleeping' | 'purring';

export interface InteractiveCatCompanionProps {
  theme?: 'normal' | 'terminal';
  onNavigateToTab?: (tab: string) => void;
  onOpenTerminal?: () => void;
}

interface ChatHistoryItem {
  sender: 'user' | 'cat';
  text: string;
}

const CAT_QUOTES = [
  {
    text: "Miyav! Ben Emirhan'ın kedi asistanıyım. Sorun olursa buradan yazabilirsin. 🐾",
    badge: "Selam",
    actionTab: null
  },
  {
    text: "Projeler sekmesinde mobil asistan, eğitim ve Python araçları yer alıyor.",
    badge: "Projeler",
    actionTab: "projects"
  },
  {
    text: "Mırrr... Dinleniyorum. İstediğin zaman soru sorabilirsin. 🐾",
    badge: "Mırrr",
    actionTab: null
  },
  {
    text: "Üstteki anahtarla Terminal moduna geçip komut satırını deneyebilirsin.",
    badge: "Terminal",
    actionTab: "terminal"
  },
  {
    text: "İletişim için: emirhan0008@gmail.com ✉️",
    badge: "İletişim",
    actionTab: "contact"
  }
];

const PRESET_QUERIES = [
  "Emirhan kimdir?",
  "Projelerini özetle",
  "PDR ve Yapay Zeka?",
  "Hangi dilleri biliyor?"
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

  // Groq AI Chat States
  const [inputQuery, setInputQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const chatScrollRef = useRef<HTMLDivElement>(null);

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

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatHistory, isThinking]);

  const handleCatClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playCatMeow();
    setPetCount(prev => prev + 1);
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 1400);

    setBehavior('curious-front');
    setDialogOpen(true);
  };

  const handlePetAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playCatPurr();
    setPetCount(prev => prev + 1);
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 1200);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isThinking) return;

    soundEngine.playAiSparkle();
    setInputQuery('');
    setBehavior('curious-front');

    const updatedHistory: ChatHistoryItem[] = [
      ...chatHistory,
      { sender: 'user', text: query }
    ];
    setChatHistory(updatedHistory);
    setIsThinking(true);

    try {
      const reply = await askGroqCatAssistant(query, chatHistory);
      setChatHistory([...updatedHistory, { sender: 'cat', text: reply }]);
      soundEngine.playCatPurr();
    } catch {
      setChatHistory([
        ...updatedHistory,
        {
          sender: 'cat',
          text: "Miyav! 🐾 Yanıt oluştururken küçük bir aksaklık oldu. Projeler sekmesinden Emirhan'ın çalışmalarını inceleyebilirsin!"
        }
      ]);
    } finally {
      setIsThinking(false);
    }
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
      {/* Floating Speech Bubbles & Groq AI Chat (No window background) */}
      <AnimatePresence>
        {dialogOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.94 }}
            className="pointer-events-auto absolute bottom-22 -left-36 sm:-left-44 w-80 sm:w-92 z-20 text-left select-text flex flex-col gap-2"
          >
            {/* Top Minimal Toolbar (Only Close & Reset floating badges) */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 border border-white/10 text-[9px] font-bold text-emerald-300 backdrop-blur-md">
                <span>🐾</span>
                <span>{isTerminal ? 'CYBER-CAT // GROQ' : 'Kedi Asistanı'}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="flex items-center gap-1">
                {chatHistory.length > 0 && (
                  <button
                    onClick={() => {
                      soundEngine.playGlassClick();
                      setChatHistory([]);
                    }}
                    className="w-5 h-5 rounded-full bg-black/60 border border-white/10 hover:border-white/30 text-white/70 hover:text-white flex items-center justify-center text-[10px] backdrop-blur-md cursor-pointer transition-colors"
                    title="Sohbeti Sıfırla"
                  >
                    <RotateCcw size={10} />
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    soundEngine.playGlassClick();
                    setDialogOpen(false);
                  }}
                  className="w-5 h-5 rounded-full bg-black/60 border border-white/10 hover:border-white/30 text-white/70 hover:text-white flex items-center justify-center text-[10px] backdrop-blur-md cursor-pointer transition-colors"
                  title="Kapat"
                >
                  <X size={11} />
                </button>
              </div>
            </div>

            {/* Conversation Area (Only floating speech bubbles) */}
            <div 
              ref={chatScrollRef}
              className="max-h-60 overflow-y-auto pr-0.5 space-y-2 text-xs scrollbar-thin scrollbar-thumb-white/20"
            >
              {chatHistory.length === 0 ? (
                /* Primary Greeting Speech Bubble */
                <div className={`relative p-3.5 rounded-2xl rounded-bl-xs shadow-xl backdrop-blur-xl border ${
                  isTerminal 
                    ? 'bg-[#02180e]/95 border-emerald-500/50 text-emerald-300 font-mono shadow-[0_8px_30px_rgba(0,0,0,0.6)]' 
                    : 'liquid-glass-strong border-white/20 text-white shadow-[0_8px_30px_rgba(0,0,0,0.45)]'
                }`}>
                  <p className="text-xs leading-relaxed">
                    {currentQuote.text}
                  </p>

                  {/* Preset Question Chips as mini floating pills */}
                  <div className="pt-2 mt-2 border-t border-white/10">
                    <span className="text-[10px] text-white/50 block mb-1.5 font-medium">
                      Hızlıca sorabilirsiniz:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {PRESET_QUERIES.map((q, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(q)}
                          className="px-2 py-1 rounded-lg text-[10px] bg-white/10 hover:bg-white/20 text-white/90 hover:text-emerald-300 border border-white/10 transition-all cursor-pointer text-left"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Speech Bubble Tail */}
                  <div className={`absolute -bottom-2 left-36 sm:left-44 w-3.5 h-3.5 rotate-45 border-r border-b ${
                    isTerminal ? 'bg-[#02180e] border-emerald-500/50' : 'bg-slate-900 border-white/20'
                  }`} />
                </div>
              ) : (
                /* Chat Speech Bubbles */
                chatHistory.map((item, idx) => {
                  const isUser = item.sender === 'user';
                  const isLastCatMsg = !isUser && idx === chatHistory.length - 1;

                  return (
                    <div 
                      key={idx} 
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                    >
                      <div className={`relative px-3.5 py-2.5 max-w-[88%] text-xs leading-relaxed shadow-lg backdrop-blur-xl ${
                        isUser
                          ? 'rounded-2xl rounded-br-xs bg-emerald-500/30 border border-emerald-400/50 text-emerald-100 shadow-[0_4px_20px_rgba(16,185,129,0.2)]'
                          : isTerminal
                          ? 'rounded-2xl rounded-bl-xs bg-[#02180e]/95 border border-emerald-500/50 text-emerald-300 font-mono shadow-[0_6px_25px_rgba(0,0,0,0.6)]'
                          : 'rounded-2xl rounded-bl-xs liquid-glass-strong border border-white/20 text-white shadow-[0_6px_25px_rgba(0,0,0,0.45)]'
                      }`}>
                        {!isUser && (
                          <span className="text-[10px] font-bold text-emerald-400 block mb-0.5">
                            🐾 Kedi:
                          </span>
                        )}
                        <p className="whitespace-pre-wrap">{item.text}</p>

                        {/* Speech bubble tail for last cat message */}
                        {isLastCatMsg && (
                          <div className={`absolute -bottom-1.5 left-6 w-3 h-3 rotate-45 border-r border-b ${
                            isTerminal ? 'bg-[#02180e] border-emerald-500/50' : 'bg-slate-900 border-white/20'
                          }`} />
                        )}
                      </div>
                    </div>
                  );
                })
              )}

              {/* Floating Thinking Bubble */}
              {isThinking && (
                <div className="flex items-start">
                  <div className={`px-3 py-1.5 rounded-2xl rounded-bl-xs shadow-md backdrop-blur-md border flex items-center gap-2 text-xs font-mono ${
                    isTerminal
                      ? 'bg-[#02180e]/95 border-emerald-500/40 text-emerald-400'
                      : 'liquid-glass-strong border-white/20 text-emerald-300'
                  }`}>
                    <Loader2 size={12} className="animate-spin text-emerald-400" />
                    <span>Mırrr... 🐾⚡</span>
                  </div>
                </div>
              )}
            </div>

            {/* Floating Input Pill (No large container card) */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className={`flex items-center gap-1.5 p-1 rounded-full shadow-xl backdrop-blur-xl border ${
                isTerminal
                  ? 'bg-[#02180e]/95 border-emerald-500/50'
                  : 'bg-slate-900/85 border-white/20'
              }`}
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Kediciğe bir soru sor... 🐾"
                disabled={isThinking}
                className={`flex-1 min-w-0 px-3 py-1 text-xs outline-hidden bg-transparent transition-all placeholder:text-white/40 ${
                  isTerminal ? 'text-emerald-300 font-mono' : 'text-white font-sans'
                }`}
              />
              <button
                type="submit"
                disabled={isThinking || !inputQuery.trim()}
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                  inputQuery.trim() && !isThinking
                    ? 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-md shadow-emerald-500/30'
                    : 'bg-white/10 text-white/40 cursor-not-allowed'
                }`}
                title="Gönder"
              >
                <Send size={11} />
              </button>
            </form>

            {/* Floating Action Pills */}
            <div className="flex items-center justify-between gap-1 text-[10px] px-1">
              <div className="flex items-center gap-1">
                {onNavigateToTab && (
                  <button
                    onClick={() => {
                      soundEngine.playGlassClick();
                      onNavigateToTab('projects');
                      setDialogOpen(false);
                    }}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/50 hover:bg-black/70 border border-white/10 text-white/80 hover:text-white backdrop-blur-md transition-all cursor-pointer"
                  >
                    <span>Projeler</span>
                    <ArrowRight size={8} />
                  </button>
                )}
                <button
                  onClick={handlePetAction}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/50 hover:bg-black/70 border border-white/10 text-white/80 hover:text-rose-300 backdrop-blur-md transition-all cursor-pointer"
                  title="Sevgi Göster"
                >
                  <Heart size={9} className="text-rose-400 fill-rose-400" />
                  <span>Sev ({petCount})</span>
                </button>
              </div>

              {chatHistory.length === 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    soundEngine.playCatMeow();
                    setQuoteIndex(prev => (prev + 1) % CAT_QUOTES.length);
                  }}
                  className="px-2 py-0.5 rounded-full bg-black/50 hover:bg-black/70 border border-white/10 text-white/70 hover:text-white backdrop-blur-md transition-all cursor-pointer"
                  title="Farklı bir şey söyle"
                >
                  <span>Farklı Söz 🐾</span>
                </button>
              )}
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
        title="Emirhan'ın Groq Yapay Zeka Destekli Siber Kedisi (Bana tıkla!) 🐾"
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
          Groq AI Kedi 🐾⚡
        </div>
      </motion.div>
    </div>
  );
}

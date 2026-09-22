import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Heart, X, Zap, Volume2, VolumeX, MessageSquare, 
  ArrowRight, Compass, Terminal as TerminalIcon, Send, HelpCircle
} from 'lucide-react';
import { soundEngine } from '../utils/audioSynth';

export type CatAction = 
  | 'sitting_calm'      // Sits gracefully, breathes, slow blinks
  | 'paw_groom'         // Licks front paw and grooms ear (iconic real cat behavior)
  | 'cat_stretch'       // Downward stretch with arched back & yawn
  | 'in_place_hop'      // Playful in-place hop / pounce on imaginary bug
  | 'short_dash'        // Short distance run (not whole screen!)
  | 'playing_ball'      // Playing with the ball for 30s
  | 'looking_at_user';  // Direct front eye contact with user when hovered

export interface InteractiveCatCompanionProps {
  theme?: 'normal' | 'terminal';
  onNavigateToTab?: (tab: string) => void;
  onOpenTerminal?: () => void;
  onAskAssistant?: (query: string) => Promise<string> | void;
  isAiAssistantMode?: boolean;
}

// Interactive conversation & portfolio advice tree
interface CatDialogItem {
  id: string;
  badge: string;
  questionPrompt: string;
  response: string;
  actionLabel?: string;
  actionTab?: string;
  actionType?: 'tab' | 'terminal' | 'ball' | 'hop';
}

const CAT_CONVERSATIONS: CatDialogItem[] = [
  {
    id: 'intro',
    badge: 'Miyav!',
    questionPrompt: '👋 Selam, sen kimsin?',
    response: "Mırrr... Ben Emirhan'ın dijital yoldaşıyım! 🐾 Sayfada sana rehberlik etmek, projeleri özetlemek ve biraz oyun oynamak için buradayım.",
    actionLabel: 'Projeleri İncele 🚀',
    actionTab: 'projects',
    actionType: 'tab'
  },
  {
    id: 'best_project',
    badge: 'Öneri',
    questionPrompt: '⭐ En dikkat çeken proje hangisi?',
    response: "Yapay zeka alanında 'Otonom Çoklu Ajan Orkestrasyonu' ve ses işleme projeleri muazzam! Kod kalitesi ve mimarisi üst düzey.",
    actionLabel: 'Projeler Sekmesine Git',
    actionTab: 'projects',
    actionType: 'tab'
  },
  {
    id: 'terminal',
    badge: 'Gizli Mod',
    questionPrompt: '💻 Terminal modu nedir?',
    response: "Sağ üstteki anahtarla gerçek PowerShell 7.4 terminaline geçebilirsin! Orada 'Get-Projects', 'dir' veya 'cat Bio.txt' komutları çalışıyor!",
    actionLabel: 'Terminale Geçiş Yap ⚡',
    actionTab: 'terminal',
    actionType: 'terminal'
  },
  {
    id: 'contact',
    badge: 'İletişim',
    questionPrompt: '✉️ Emirhan ile nasıl çalışabilirim?',
    response: "Emirhan yeni iş birliklerine, yenilikçi yapay zeka projelerine ve danışmanlığa açık. İletişim formundan doğrudan mesaj yazabilirsin.",
    actionLabel: 'İletişim Formunu Aç 📬',
    actionTab: 'contact',
    actionType: 'tab'
  },
  {
    id: 'play_ball',
    badge: 'Oyun',
    questionPrompt: '⚾ Topunu çıkart, biraz oyna!',
    response: "Miyavvv! Yaşasın, hemen topumu çıkartıyorum! 30 saniye boyunca patimle sektireceğim, izle! 🐾",
    actionLabel: 'Topla Oyna 🎾',
    actionType: 'ball'
  },
  {
    id: 'trick',
    badge: 'Akrobasi',
    questionPrompt: '✨ Bana bir kedi numarası göster!',
    response: "Hop! İşte kedi zarafetiyle yerimde havaya sıçrama! Mırrr... 😻",
    actionLabel: 'Olduğun Yerde Zıpla ✨',
    actionType: 'hop'
  }
];

export function InteractiveCatCompanion({
  theme = 'normal',
  onNavigateToTab,
  onOpenTerminal
}: InteractiveCatCompanionProps) {
  const isTerminal = theme === 'terminal';

  // --- POSITION & STATE ---
  // Default position: comfortable bottom-right corner (around 72% screen)
  const [catX, setCatX] = useState<number>(72);
  const [catY, setCatY] = useState<number>(0); // Vertical jump offset (px)
  const [facing, setFacing] = useState<'left' | 'right'>('left');
  const [action, setAction] = useState<CatAction>('sitting_calm');
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isLookingAtUser, setIsLookingAtUser] = useState<boolean>(false);

  // Ball states (Appears for ~30 seconds periodically or when requested)
  const [ballActive, setBallActive] = useState<boolean>(false);
  const [ballX, setBallX] = useState<number>(68);
  const [ballY, setBallY] = useState<number>(0);
  const [ballRot, setBallRot] = useState<number>(0);

  // Dialog & Interactive Verbal system
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [activeDialog, setActiveDialog] = useState<CatDialogItem>(CAT_CONVERSATIONS[0]);
  const [petCount, setPetCount] = useState<number>(0);
  const [showHeart, setShowHeart] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Animation micro-cycles
  const [breathPhase, setBreathPhase] = useState<number>(0);
  const [tailAngle, setTailAngle] = useState<number>(0);
  const [pawCycle, setPawCycle] = useState<number>(0);
  const [blink, setBlink] = useState<boolean>(false);

  // Timers & Physics refs
  const ballTimerRef = useRef<NodeJS.Timeout | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const dashTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Ball physics internal
  const ballPhysRef = useRef({
    x: 68,
    y: 0,
    vx: 0,
    vy: 0,
    rot: 0
  });

  // Sound safe trigger
  const playSound = useCallback((type: 'meow' | 'purr' | 'ball' | 'pounce') => {
    if (isMuted) return;
    try {
      if (type === 'meow') soundEngine.playCatMeow();
      else if (type === 'purr') soundEngine.playCatPurr();
      else if (type === 'ball') soundEngine.playBallBounce();
      else if (type === 'pounce') soundEngine.playCatPounce();
    } catch {}
  }, [isMuted]);

  // Trigger 30-Second Ball Play Session
  const startBallPlaySession = useCallback(() => {
    if (ballTimerRef.current) clearTimeout(ballTimerRef.current);
    
    // Position ball near cat
    const spawnX = Math.max(15, Math.min(85, catX + (facing === 'right' ? 8 : -8)));
    ballPhysRef.current = {
      x: spawnX,
      y: 40,
      vx: facing === 'right' ? 14 : -14,
      vy: 120,
      rot: 0
    };
    setBallActive(true);
    setAction('playing_ball');
    playSound('ball');

    // Auto finish ball play session after 30 seconds
    ballTimerRef.current = setTimeout(() => {
      // Gently roll ball away and end session
      ballPhysRef.current.vx = facing === 'right' ? 40 : -40;
      setTimeout(() => {
        setBallActive(false);
        setAction('cat_stretch');
        setTimeout(() => setAction('sitting_calm'), 3000);
      }, 1500);
    }, 30000); // 30 seconds!
  }, [catX, facing, playSound]);

  // Trigger realistic in-place hop / pounce
  const triggerInPlaceHop = useCallback(() => {
    if (isHovered) return;
    setAction('in_place_hop');
    playSound('pounce');

    // Jump physics trajectory
    let t = 0;
    const jumpInterval = setInterval(() => {
      t += 0.05;
      // Parabolic jump arc: 0 -> 36px -> 0
      const jumpY = Math.max(0, Math.sin(t * Math.PI) * 38);
      setCatY(jumpY);
      if (t >= 1) {
        clearInterval(jumpInterval);
        setCatY(0);
        setAction('sitting_calm');
      }
    }, 25);
  }, [isHovered, playSound]);

  // Trigger short-distance dash (~2 dakikada bir, kısa mesafeli)
  const triggerShortDash = useCallback(() => {
    if (isHovered || action === 'playing_ball') return;
    setAction('short_dash');
    const direction = Math.random() > 0.5 ? 1 : -1;
    const targetX = Math.max(25, Math.min(80, catX + direction * (10 + Math.random() * 8)));
    setFacing(direction === 1 ? 'right' : 'left');

    let current = catX;
    const step = (targetX - current) / 25;
    let count = 0;
    const dashInt = setInterval(() => {
      count++;
      current += step;
      setCatX(current);
      setPawCycle(prev => prev + 1.2);
      if (count >= 25) {
        clearInterval(dashInt);
        setAction('sitting_calm');
      }
    }, 35);
  }, [isHovered, action, catX]);

  // Periodic ~2-minute dash & spontaneous calm behaviors
  useEffect(() => {
    // Schedule periodic dash every ~100-120 seconds
    const scheduleNextDash = () => {
      dashTimerRef.current = setTimeout(() => {
        triggerShortDash();
        scheduleNextDash();
      }, 110000 + Math.random() * 20000); // ~2 minutes
    };
    scheduleNextDash();

    // Occasional gentle in-place actions (stretching, grooming, hop)
    const calmRoutine = setInterval(() => {
      if (isHovered || action === 'playing_ball' || action === 'short_dash') return;
      
      const rand = Math.random();
      if (rand < 0.35) {
        setAction('paw_groom');
        setTimeout(() => setAction('sitting_calm'), 4000);
      } else if (rand < 0.65) {
        setAction('cat_stretch');
        setTimeout(() => setAction('sitting_calm'), 3500);
      } else if (rand < 0.85) {
        triggerInPlaceHop();
      }
    }, 18000);

    // Periodic ball play session every ~2.5 - 3 minutes if not already playing
    const periodicBall = setInterval(() => {
      if (!isHovered && !ballActive && action !== 'short_dash') {
        startBallPlaySession();
      }
    }, 160000);

    return () => {
      if (dashTimerRef.current) clearTimeout(dashTimerRef.current);
      clearInterval(calmRoutine);
      clearInterval(periodicBall);
    };
  }, [isHovered, action, ballActive, triggerShortDash, triggerInPlaceHop, startBallPlaySession]);

  // Blinking timer (Cat slow blink of contentment)
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 240);
    }, 4500 + Math.random() * 3000);
    return () => clearInterval(blinkInterval);
  }, []);

  // Main 60FPS animation & ball physics loop (smooth, no jank)
  useEffect(() => {
    const tick = (now: number) => {
      const dt = Math.min(0.06, (now - lastTimeRef.current) / 1000);
      lastTimeRef.current = now;

      // Gentle continuous breathing & tail swaying
      setBreathPhase(prev => (prev + dt * 2.2) % (Math.PI * 2));
      setTailAngle(Math.sin(now * 0.002) * (action === 'playing_ball' ? 22 : 12));

      // BALL PHYSICS (if active)
      if (ballActive) {
        const b = ballPhysRef.current;
        b.vy -= 420 * dt; // gravity
        b.y += b.vy * dt;
        b.x += b.vx * dt;
        b.rot += b.vx * dt * 10;

        // Ground bounce
        if (b.y <= 0) {
          b.y = 0;
          if (Math.abs(b.vy) > 30) {
            b.vy = -b.vy * 0.65;
            playSound('ball');
          } else {
            b.vy = 0;
          }
        }

        // Cat swatting the ball within local 12% radius
        const dist = b.x - catX;
        if (Math.abs(dist) < 7 && b.y < 20) {
          // Whack! Cat bats the ball
          b.vx = (dist > 0 ? 1 : -1) * (18 + Math.random() * 16);
          b.vy = 90 + Math.random() * 60;
          playSound('ball');
        }

        // Keep ball localized around cat territory (doesn't fly across entire screen)
        if (b.x < catX - 16) {
          b.vx = Math.abs(b.vx) * 0.8 + 4;
        } else if (b.x > catX + 16) {
          b.vx = -Math.abs(b.vx) * 0.8 - 4;
        }

        setBallX(b.x);
        setBallY(b.y);
        setBallRot(b.rot);
      }

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [ballActive, catX, action, playSound]);

  // MOUSE HOVER HANDLER:
  // "ziyaretçi fare ile üstüne geldiğinde dursun ve ziyaretçiye bakarak miyavlasın ve bir önceki sürümdeki gibi konuşsun"
  const handleMouseEnter = () => {
    setIsHovered(true);
    setIsLookingAtUser(true);
    playSound('meow');
    setDialogOpen(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // After 2 seconds, gently look forward again
    setTimeout(() => {
      if (!isHovered) setIsLookingAtUser(false);
    }, 2000);
  };

  // Click on Cat: pet, purr, hearts
  const handleCatClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    playSound('purr');
    setPetCount(prev => prev + 1);
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 1400);
    setDialogOpen(true);
  };

  // Execute interactive dialog action
  const handleDialogAction = (item: CatDialogItem) => {
    soundEngine.playGlassClick();
    if (item.actionType === 'tab' && item.actionTab && onNavigateToTab) {
      onNavigateToTab(item.actionTab);
      setDialogOpen(false);
    } else if (item.actionType === 'terminal' && onOpenTerminal) {
      onOpenTerminal();
      setDialogOpen(false);
    } else if (item.actionType === 'ball') {
      startBallPlaySession();
    } else if (item.actionType === 'hop') {
      triggerInPlaceHop();
    }
  };

  // Breathing subtle deformation for realistic live presence
  const breathScaleY = 1 + Math.sin(breathPhase) * 0.025;

  return (
    <>
      {/* 30-SECOND BOUNCING PLAY BALL (Appears locally, doesn't cross whole page) */}
      <AnimatePresence>
        {ballActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed bottom-2 z-[110] pointer-events-auto cursor-pointer select-none"
            style={{
              left: `${ballX}%`,
              bottom: `${8 + ballY}px`,
              transform: 'translateX(-50%)'
            }}
            onClick={(e) => {
              e.stopPropagation();
              ballPhysRef.current.vy = 140;
              ballPhysRef.current.vx = (ballX > catX ? 1 : -1) * 20;
              playSound('ball');
            }}
            title="Topa dokun! Kedin hemen yakalayacak 🐾"
          >
            {/* Ball Ground Shadow */}
            <div 
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-black/60 rounded-full blur-xs"
              style={{
                width: `${Math.max(6, 18 - ballY * 0.15)}px`,
                height: '4px',
                opacity: Math.max(0.2, 0.7 - ballY * 0.01)
              }}
            />

            {/* Glowing Yarn / Energy Ball */}
            <div 
              className="relative w-5 h-5 rounded-full border border-white/40 shadow-md flex items-center justify-center overflow-hidden"
              style={{
                transform: `rotate(${ballRot}deg)`,
                background: isTerminal 
                  ? 'radial-gradient(circle, #34d399 20%, #065f46 90%)'
                  : 'radial-gradient(circle, #f472b6 20%, #e11d48 90%)'
              }}
            >
              {/* Yarn threads */}
              <div className="absolute inset-0 border-t border-b border-white/50 rounded-full rotate-45" />
              <div className="w-1.5 h-1.5 rounded-full bg-white/90 shadow-[0_0_4px_#fff]" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CAT COMPANION WRAPPER */}
      <div
        className="fixed bottom-2 z-[115] pointer-events-none select-none transition-all duration-300 ease-out"
        style={{
          left: `${catX}%`,
          bottom: `${4 + catY}px`,
          transform: 'translateX(-50%)'
        }}
      >
        {/* Soft Organic Ground Shadow */}
        <div 
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-black/75 rounded-full blur-sm transition-transform"
          style={{
            width: `${Math.max(18, 54 - catY * 0.4)}px`,
            height: '8px',
            opacity: Math.max(0.15, 0.8 - catY * 0.01)
          }}
        />

        {/* Floating Heart Effect on Petting */}
        <AnimatePresence>
          {showHeart && (
            <motion.div
              initial={{ opacity: 1, y: 0, scale: 0.8 }}
              animate={{ opacity: 0, y: -45, scale: 1.4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="absolute -top-7 left-7 text-rose-400 pointer-events-none z-30"
            >
              <Heart size={20} className="fill-rose-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.9)]" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* DIALOG SPEECH BALLOON (Sözlü etkileşim ve site içi tavsiye/yönlendirmeler) */}
        <AnimatePresence>
          {dialogOpen && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.92 }}
              className={`pointer-events-auto absolute bottom-22 -left-36 sm:-left-44 w-76 sm:w-88 p-4 rounded-2xl shadow-2xl border backdrop-blur-xl z-30 text-left ${
                isTerminal 
                  ? 'bg-[#02130c]/95 border-emerald-500/60 shadow-[0_0_25px_rgba(16,185,129,0.35)] text-emerald-300 font-mono'
                  : 'liquid-glass-strong border-white/20 text-white font-sans'
              }`}
            >
              {/* Header with Cat Badge & Close */}
              <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-base">🐾</span>
                  <span className="text-xs font-bold tracking-tight">
                    {isTerminal ? 'CYBER-CAT // PROMPTER' : "Emirhan'ın Dijital Kedisi"}
                  </span>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    isTerminal ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                  }`}>
                    {activeDialog.badge}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMuted(prev => !prev);
                    }}
                    className="text-white/40 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10 cursor-pointer"
                    title={isMuted ? 'Sesi Aç' : 'Sesi Kapat'}
                  >
                    {isMuted ? <VolumeX size={12} className="text-rose-400" /> : <Volume2 size={12} className="text-emerald-400" />}
                  </button>
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
              </div>

              {/* Cat Response Message */}
              <p className="text-xs text-white/90 leading-relaxed mb-3">
                {activeDialog.response}
              </p>

              {/* Primary Action Button (If dialog provides navigation) */}
              {activeDialog.actionLabel && (
                <div className="mb-3">
                  <button
                    onClick={() => handleDialogAction(activeDialog)}
                    className={`w-full py-1.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                      isTerminal
                        ? 'bg-emerald-500 text-black hover:bg-emerald-400'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-400 text-black hover:brightness-110'
                    }`}
                  >
                    <Sparkles size={12} />
                    <span>{activeDialog.actionLabel}</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              )}

              {/* Interactive Verbal Prompts / Question Pills */}
              <div className="pt-2 border-t border-white/10">
                <div className="text-[10px] text-white/50 mb-1.5 font-medium flex items-center gap-1">
                  <HelpCircle size={10} />
                  <span>Kediye bir soru sor veya yönlendirme iste:</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {CAT_CONVERSATIONS.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        playSound('meow');
                        setActiveDialog(c);
                      }}
                      className={`text-[10px] px-2 py-0.5 rounded-lg border transition-all cursor-pointer ${
                        activeDialog.id === c.id
                          ? 'bg-emerald-500/25 border-emerald-400 text-emerald-200 font-bold'
                          : 'bg-white/5 hover:bg-white/15 border-white/10 text-white/80'
                      }`}
                    >
                      {c.questionPrompt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pointer Triangle */}
              <div className={`absolute -bottom-2 left-36 sm:left-44 w-3.5 h-3.5 rotate-45 border-r border-b ${
                isTerminal ? 'bg-[#02130c] border-emerald-500/60' : 'bg-slate-900 border-white/20'
              }`} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ANATOMICALLY ACCURATE SVG CAT RIG */}
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleCatClick}
          className="pointer-events-auto cursor-pointer relative group/cat"
          style={{
            transform: `scaleX(${facing === 'right' ? 1 : -1})`,
            transition: 'transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
          title="Bana tıkla veya üstüme gel! 🐾"
        >
          {/* Subtle bio-glow */}
          <div className={`absolute -inset-1 rounded-full blur-md opacity-40 transition-opacity group-hover/cat:opacity-100 ${
            isTerminal ? 'bg-emerald-500/30' : 'bg-cyan-400/20'
          }`} />

          <svg 
            width="68" 
            height="56" 
            viewBox="0 0 88 72" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="relative drop-shadow-[0_6px_14px_rgba(0,0,0,0.85)] overflow-visible"
            style={{
              transform: `scaleY(${breathScaleY})`,
              transformOrigin: 'bottom center'
            }}
          >
            {/* 1. TAIL (Realistic natural curved tail with tip flick) */}
            <path
              d={`M22 46 C ${12 + tailAngle * 0.5} ${40 + Math.sin(breathPhase) * 3}, ${4 + tailAngle * 0.7} ${24 + Math.cos(breathPhase) * 5}, ${10 + tailAngle} ${12 + Math.sin(breathPhase) * 4}`}
              stroke={isTerminal ? "#10b981" : "#38bdf8"}
              strokeWidth="3.2"
              strokeLinecap="round"
              fill="none"
              className="transition-all duration-200"
            />
            {/* Tail Tip accent */}
            <circle 
              cx={10 + tailAngle} 
              cy={12 + Math.sin(breathPhase) * 4} 
              r="2" 
              fill={isTerminal ? "#6ee7b7" : "#a5f3fc"} 
            />

            {/* 2. HIND LEGS (Realistic feline zigzag joint: Thigh -> Stifle/Knee -> Hock -> Paw) */}
            {/* Far Hind Leg */}
            <g opacity="0.85">
              <path 
                d="M28 46 L22 54 L26 63 L30 64" 
                stroke={isTerminal ? "#047857" : "#1e293b"} 
                strokeWidth="3.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              <ellipse cx="29" cy="64.5" rx="3.2" ry="1.8" fill={isTerminal ? "#047857" : "#334155"} />
            </g>

            {/* Far Front Leg */}
            <g opacity="0.85">
              <path 
                d="M58 46 L55 56 L59 64 L63 65" 
                stroke={isTerminal ? "#047857" : "#1e293b"} 
                strokeWidth="3.2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              <ellipse cx="62" cy="65" rx="3.2" ry="1.8" fill={isTerminal ? "#047857" : "#334155"} />
            </g>

            {/* 3. TORSO & SPINE (Graceful feline body with gentle breathing curve) */}
            <path
              d={action === 'cat_stretch'
                ? "M24 50 C 28 42, 42 45, 58 48 C 65 52, 63 60, 54 62 C 40 62, 26 58, 24 50 Z"
                : "M25 48 C 27 36, 44 32, 60 38 C 66 43, 64 54, 55 57 C 42 58, 28 56, 25 48 Z"
              }
              fill={isTerminal ? "#021c12" : "#0f172a"}
              stroke={isTerminal ? "#34d399" : "#38bdf8"}
              strokeWidth="2"
              className="transition-all duration-300"
            />

            {/* Ribcage / flank contour */}
            <path
              d="M36 43 C 44 40, 52 41, 57 45"
              stroke={isTerminal ? "rgba(52,211,153,0.35)" : "rgba(56,189,248,0.35)"}
              strokeWidth="1.1"
              strokeLinecap="round"
              fill="none"
            />

            {/* 4. NEAR HIND LEG (Powerful muscular thigh & distinct hock) */}
            <g>
              <ellipse cx="29" cy="48" rx="7.5" ry="6" fill={isTerminal ? "#022417" : "#1e293b"} />
              <path 
                d="M29 46 L23 55 L28 64 L34 65" 
                stroke={isTerminal ? "#34d399" : "#38bdf8"} 
                strokeWidth="3.6" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              <ellipse cx="33" cy="65" rx="3.8" ry="2" fill={isTerminal ? "#6ee7b7" : "#cbd5e1"} />
            </g>

            {/* 5. NEAR FORELEG (Swats when playing or grooms when grooming) */}
            <g>
              {action === 'paw_groom' ? (
                // Paw lifted to face for grooming
                <path 
                  d="M58 46 L64 42 L66 32 L64 30" 
                  stroke={isTerminal ? "#34d399" : "#38bdf8"} 
                  strokeWidth="3.6" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
              ) : action === 'playing_ball' ? (
                // Playful forward paw swat
                <path 
                  d="M58 46 L66 48 L74 46 L78 44" 
                  stroke={isTerminal ? "#34d399" : "#38bdf8"} 
                  strokeWidth="3.6" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
              ) : (
                // Normal sitting / standing foreleg
                <path 
                  d="M58 46 L58 56 L61 64 L67 65" 
                  stroke={isTerminal ? "#34d399" : "#38bdf8"} 
                  strokeWidth="3.6" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
              )}
              <ellipse 
                cx={action === 'paw_groom' ? 64 : (action === 'playing_ball' ? 78 : 66)} 
                cy={action === 'paw_groom' ? 30 : (action === 'playing_ball' ? 44 : 65)} 
                rx="3.8" 
                ry="2" 
                fill={isTerminal ? "#6ee7b7" : "#cbd5e1"} 
              />
            </g>

            {/* 6. HEAD & EXPRESSION */}
            {/* Smooth head turn towards visitor when hovered (`isLookingAtUser`) */}
            <g transform={isLookingAtUser ? "translate(58, 12)" : "translate(58, 14)"} className="transition-transform duration-200">
              {/* Left Ear */}
              <path
                d={isLookingAtUser ? "M2 13 L-1 1 L10 7 Z" : "M3 13 L-1 2 L11 7 Z"}
                fill={isTerminal ? "#021c12" : "#0f172a"}
                stroke={isTerminal ? "#34d399" : "#38bdf8"}
                strokeWidth="1.6"
              />
              <polygon points="2,10 0,3 8,7" fill={isTerminal ? "rgba(52,211,153,0.4)" : "rgba(244,114,182,0.6)"} />

              {/* Right Ear */}
              <path
                d={isLookingAtUser ? "M14 11 L20 -1 L22 9 Z" : "M15 11 L21 0 L23 9 Z"}
                fill={isTerminal ? "#021c12" : "#0f172a"}
                stroke={isTerminal ? "#34d399" : "#38bdf8"}
                strokeWidth="1.6"
              />
              <polygon points="16,9 19,2 21,8" fill={isTerminal ? "rgba(52,211,153,0.4)" : "rgba(244,114,182,0.6)"} />

              {/* Head Silhouette */}
              <circle 
                cx="11" 
                cy="15" 
                r="11.5" 
                fill={isTerminal ? "#02120c" : "#0a0f1d"} 
                stroke={isTerminal ? "#34d399" : "#38bdf8"} 
                strokeWidth="1.8" 
              />

              {/* Whiskers */}
              <line x1="15" y1="17" x2="24" y2="15" stroke={isTerminal ? "#6ee7b7" : "#cbd5e1"} strokeWidth="1" strokeLinecap="round" />
              <line x1="15" y1="19" x2="25" y2="20" stroke={isTerminal ? "#6ee7b7" : "#cbd5e1"} strokeWidth="1" strokeLinecap="round" />
              <line x1="7" y1="17" x2="-2" y2="15" stroke={isTerminal ? "#6ee7b7" : "#cbd5e1"} strokeWidth="1" strokeLinecap="round" />
              <line x1="7" y1="19" x2="-3" y2="20" stroke={isTerminal ? "#6ee7b7" : "#cbd5e1"} strokeWidth="1" strokeLinecap="round" />

              {/* EYES (Almond shape, blinking, looking at user when hovered) */}
              {blink ? (
                // Sweet slow-blink (^ ^)
                <g stroke={isTerminal ? "#34d399" : "#38bdf8"} strokeWidth="1.6" strokeLinecap="round">
                  <path d="M5 14 Q7 12 9 14" />
                  <path d="M13 14 Q15 12 17 14" />
                </g>
              ) : (
                // Wide, intelligent feline eyes
                <g>
                  {/* Left Eye */}
                  <ellipse 
                    cx={isLookingAtUser ? "7.5" : "7"} 
                    cy="13.5" 
                    rx={isLookingAtUser ? "2.8" : "2.5"} 
                    ry={isLookingAtUser ? "3" : "2.7"} 
                    fill={isTerminal ? "#34d399" : "#38bdf8"} 
                  />
                  {/* Pupil Reflection */}
                  <circle cx={isLookingAtUser ? "7" : "6.5"} cy="12.5" r="0.9" fill="#ffffff" />

                  {/* Right Eye */}
                  <ellipse 
                    cx={isLookingAtUser ? "14.5" : "15"} 
                    cy="13.5" 
                    rx={isLookingAtUser ? "2.8" : "2.5"} 
                    ry={isLookingAtUser ? "3" : "2.7"} 
                    fill={isTerminal ? "#34d399" : "#38bdf8"} 
                  />
                  {/* Pupil Reflection */}
                  <circle cx={isLookingAtUser ? "14" : "14.5"} cy="12.5" r="0.9" fill="#ffffff" />
                </g>
              )}

              {/* Pink Nose & Cute Cat Mouth */}
              <polygon points="11,17.2 9.8,16 12.2,16" fill={isTerminal ? "#6ee7b7" : "#f472b6"} />
              <path 
                d="M11 17.5 L11 19 M11 19 C10 20 8.5 19.5 8.5 19.5 M11 19 C12 20 13.5 19.5 13.5 19.5" 
                stroke={isTerminal ? "#34d399" : "#94a3b8"} 
                strokeWidth="1" 
                strokeLinecap="round" 
                fill="none" 
              />

              {/* Collar & Tech Charm */}
              <path 
                d="M5 22 Q11 25 17 22" 
                stroke={isTerminal ? "#10b981" : "#06b6d4"} 
                strokeWidth="2" 
                strokeLinecap="round" 
                fill="none" 
              />
              <circle 
                cx="11" 
                cy="24.5" 
                r="2.2" 
                fill={isTerminal ? "#34d399" : "#38bdf8"} 
                className="animate-pulse" 
              />
            </g>
          </svg>

          {/* Micro Status Hint */}
          <div className="opacity-0 group-hover/cat:opacity-100 transition-opacity absolute -top-5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-black/80 text-[8px] font-bold text-emerald-300 border border-emerald-500/40 whitespace-nowrap shadow-xs uppercase">
            {isHovered ? '🐾 MİYAV! SANA BAKIYOR' : '🐾 DİJİTAL KEDİ'}
          </div>
        </div>
      </div>
    </>
  );
}

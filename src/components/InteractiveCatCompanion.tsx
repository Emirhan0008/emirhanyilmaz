import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Heart, X, Zap, Volume2, VolumeX, MessageSquare, 
  RotateCcw, Compass, ArrowRight, Activity, Smile
} from 'lucide-react';
import { soundEngine } from '../utils/audioSynth';

export type CatMotionState = 
  | 'running' 
  | 'walking' 
  | 'stalking' 
  | 'pouncing' 
  | 'jumping' 
  | 'swatting' 
  | 'stretching' 
  | 'rolling' 
  | 'sitting_curious';

export interface InteractiveCatCompanionProps {
  theme?: 'normal' | 'terminal';
  onNavigateToTab?: (tab: string) => void;
  onOpenTerminal?: () => void;
  onAskAssistant?: (query: string) => Promise<string> | void;
  isAiAssistantMode?: boolean;
}

const CAT_QUOTES = [
  {
    text: "Miyav! Hoş geldin! Ben Emirhan'ın enerjik siber kedisiyim. 🐾 Topumla oynamayı çok severim!",
    badge: "Selam!",
    actionTab: null
  },
  {
    text: "Emirhan'ın yapay zeka & Python projelerini inceledin mi? 'Projeler' sekmesinde çok yenilikçi çalışmalar var!",
    badge: "Tavsiye",
    actionTab: "projects"
  },
  {
    text: "Mırrr... Sırtımı kaşıdığın için teşekkürler! 😻 Burada kod yazmayı, koşmayı ve kahve kokusunu çok severim.",
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
    text: "Topu fırlat butonuna bas veya zemine tıkla, hemen peşinden koşup havada yakalayayım! 🚀",
    badge: "Oyun Zamanı",
    actionTab: null
  }
];

export function InteractiveCatCompanion({
  theme = 'normal',
  onNavigateToTab,
  onOpenTerminal
}: InteractiveCatCompanionProps) {
  const isTerminal = theme === 'terminal';

  // --- PHYSICS & SPATIAL POSITIONS (Percentages across screen: 6% to 92%) ---
  const [catX, setCatX] = useState<number>(38); // 6 - 92
  const [catY, setCatY] = useState<number>(0);   // 0 = ground, > 0 = airborne jump px
  const [facing, setFacing] = useState<'left' | 'right'>('right');
  const [motionState, setMotionState] = useState<CatMotionState>('walking');
  const [rotationAngle, setRotationAngle] = useState<number>(0);

  // Ball Physics
  const [ballX, setBallX] = useState<number>(62);
  const [ballY, setBallY] = useState<number>(0); // 0 = ground, px height
  const [ballRotation, setBallRotation] = useState<number>(0);
  const [isBallActive, setIsBallActive] = useState<boolean>(true);

  // Interactive feedback states
  const [showHeart, setShowHeart] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [quoteIndex, setQuoteIndex] = useState<number>(0);
  const [petCount, setPetCount] = useState<number>(0);
  const [ballHitCount, setBallHitCount] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [tailWagPhase, setTailWagPhase] = useState<number>(0);
  const [pawRunCycle, setPawRunCycle] = useState<number>(0);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; vx: number; vy: number; life: number; color: string }>>([]);

  // Refs for requestAnimationFrame continuous physics loop
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const ballPhysicsRef = useRef<{
    x: number;      // percent 6..92
    y: number;      // px
    vx: number;     // percent per second
    vy: number;     // px per second
    rotation: number;
    bounceCount: number;
  }>({
    x: 62,
    y: 0,
    vx: 0,
    vy: 0,
    rotation: 0,
    bounceCount: 0
  });

  const catPhysicsRef = useRef<{
    x: number;      // percent 6..92
    y: number;      // px
    vy: number;     // px per second
    facing: 'left' | 'right';
    state: CatMotionState;
    stateTimer: number; // seconds remaining in current state
    targetX: number;
    jumpRot: number;
  }>({
    x: 38,
    y: 0,
    vy: 0,
    facing: 'right',
    state: 'walking',
    stateTimer: 2.5,
    targetX: 62,
    jumpRot: 0
  });

  // Sound triggers with mute guard
  const playSound = useCallback((type: 'meow' | 'purr' | 'ball' | 'pounce') => {
    if (isMuted) return;
    try {
      if (type === 'meow') soundEngine.playCatMeow();
      else if (type === 'purr') soundEngine.playCatPurr();
      else if (type === 'ball') soundEngine.playBallBounce();
      else if (type === 'pounce') soundEngine.playCatPounce();
    } catch {}
  }, [isMuted]);

  // Spawn visual dust/spark particles
  const spawnParticles = (x: number, y: number, count = 3, color = '#34d399') => {
    const newItems = Array.from({ length: count }).map((_, i) => ({
      id: Math.random() + Date.now() + i,
      x: x + (Math.random() - 0.5) * 2,
      y: y + Math.random() * 4,
      vx: (Math.random() - 0.5) * 6,
      vy: -(Math.random() * 6 + 2),
      life: 1.0,
      color: isTerminal ? '#10b981' : (Math.random() > 0.5 ? '#38bdf8' : '#f472b6')
    }));
    setParticles(prev => [...prev.slice(-15), ...newItems]);
  };

  // Kick / Throw Ball to a target location
  const throwBallTo = useCallback((targetPercent: number, impulseVy = 180) => {
    const b = ballPhysicsRef.current;
    const clampedTarget = Math.max(8, Math.min(90, targetPercent));
    const dx = clampedTarget - b.x;
    b.vx = Math.sign(dx) * (Math.abs(dx) * 1.8 + 15);
    b.vy = impulseVy;
    b.bounceCount = 0;
    playSound('ball');
    spawnParticles(b.x, b.y, 4);

    // Alert cat to chase!
    const c = catPhysicsRef.current;
    c.targetX = clampedTarget;
    if (Math.abs(clampedTarget - c.x) > 10) {
      c.state = 'running';
      c.stateTimer = 3.5;
    }
  }, [playSound]);

  // Command Cat to do an acrobatic leap/jump
  const triggerAcrobaticLeap = useCallback(() => {
    const c = catPhysicsRef.current;
    c.vy = 260; // Launch upward
    c.state = 'pouncing';
    c.stateTimer = 1.4;
    c.jumpRot = c.facing === 'right' ? 360 : -360;
    playSound('pounce');
    spawnParticles(c.x, c.y, 6);
  }, [playSound]);

  // Command Cat to get Zoomies
  const triggerZoomies = useCallback(() => {
    const c = catPhysicsRef.current;
    c.state = 'running';
    c.stateTimer = 5.0;
    c.targetX = c.x > 50 ? 10 : 85;
    playSound('meow');
    // Also launch the ball across
    throwBallTo(c.targetX > 50 ? 82 : 14, 220);
  }, [throwBallTo, playSound]);

  // Continuous physics & behavior tick loop
  useEffect(() => {
    let animId: number;

    const tick = (now: number) => {
      const dt = Math.min(0.08, (now - lastTimeRef.current) / 1000); // delta time in seconds
      lastTimeRef.current = now;

      const c = catPhysicsRef.current;
      const b = ballPhysicsRef.current;

      // 1. BALL PHYSICS SIMULATION (Gravity, bounce, friction, walls)
      const gravity = 520; // px/s^2
      if (b.y > 0 || b.vy > 0) {
        b.vy -= gravity * dt;
        b.y += b.vy * dt;
        b.x += b.vx * dt;
        b.rotation += b.vx * dt * 8;

        // Ground collision
        if (b.y <= 0) {
          b.y = 0;
          if (Math.abs(b.vy) > 40) {
            b.vy = -b.vy * 0.68; // Bounciness
            b.bounceCount += 1;
            playSound('ball');
            spawnParticles(b.x, 0, 2);
          } else {
            b.vy = 0;
          }
        }
      } else {
        // Rolling friction along ground
        if (Math.abs(b.vx) > 0.5) {
          b.x += b.vx * dt;
          b.rotation += b.vx * dt * 10;
          b.vx *= Math.pow(0.55, dt);
        } else {
          b.vx = 0;
        }
      }

      // Ball wall bounces
      if (b.x <= 8) {
        b.x = 8;
        b.vx = Math.abs(b.vx) * 0.75 + 5;
        playSound('ball');
      } else if (b.x >= 92) {
        b.x = 92;
        b.vx = -Math.abs(b.vx) * 0.75 - 5;
        playSound('ball');
      }

      // 2. CAT AIRBORNE & JUMP PHYSICS
      if (c.y > 0 || c.vy > 0) {
        c.vy -= 480 * dt;
        c.y += c.vy * dt;
        if (c.y <= 0) {
          c.y = 0;
          c.vy = 0;
          c.jumpRot = 0;
          spawnParticles(c.x, 0, 4);
          // Landed!
          if (c.state === 'pouncing' || c.state === 'jumping') {
            c.state = 'swatting';
            c.stateTimer = 0.5;
          }
        }
      }

      // 3. CAT AUTONOMOUS AI & BEHAVIOR LOGIC
      c.stateTimer -= dt;
      const distToBall = b.x - c.x;
      const absDistToBall = Math.abs(distToBall);

      // State Transitions
      if (c.stateTimer <= 0) {
        // Choose next dynamic action based on distance to ball
        if (absDistToBall > 30) {
          // Ball is far -> Sprint towards it!
          c.state = 'running';
          c.stateTimer = 2.0 + Math.random() * 1.5;
        } else if (absDistToBall > 10) {
          // Ball is medium distance -> Stalk with predatory crouch or trot
          c.state = Math.random() > 0.4 ? 'stalking' : 'running';
          c.stateTimer = 1.2 + Math.random() * 1.0;
        } else if (absDistToBall <= 8) {
          // Close to ball! Pounce or Swat!
          if (Math.random() > 0.35) {
            // Pounce high into air!
            c.state = 'pouncing';
            c.vy = 180 + Math.random() * 80;
            c.stateTimer = 1.0;
            playSound('pounce');
          } else {
            // Swat the ball with paw!
            c.state = 'swatting';
            c.stateTimer = 0.6;
          }
        } else {
          // Occasional playful stretch, roll, or curious look
          const randomBehaviors: CatMotionState[] = ['walking', 'stretching', 'rolling', 'sitting_curious', 'running'];
          c.state = randomBehaviors[Math.floor(Math.random() * randomBehaviors.length)];
          c.stateTimer = 1.5 + Math.random() * 2.0;
        }
      }

      // 4. BEHAVIOR EXECUTION & MOVEMENT
      let moveSpeed = 0; // percent per second
      if (c.state === 'running') {
        moveSpeed = 34; // fast sprint
        c.facing = distToBall >= 0 ? 'right' : 'left';
      } else if (c.state === 'walking') {
        moveSpeed = 12; // relaxed trot
        c.facing = distToBall >= 0 ? 'right' : 'left';
      } else if (c.state === 'stalking') {
        moveSpeed = 8;  // stealth crouched creep
        c.facing = distToBall >= 0 ? 'right' : 'left';
      } else if (c.state === 'pouncing') {
        moveSpeed = 22; // airborne forward drive
      } else if (c.state === 'swatting') {
        // Whack the ball!
        if (absDistToBall < 12) {
          const hitDirection = c.facing === 'right' ? 1 : -1;
          b.vx = hitDirection * (45 + Math.random() * 35);
          b.vy = 120 + Math.random() * 100;
          playSound('ball');
          setBallHitCount(prev => prev + 1);
          spawnParticles(b.x, b.y, 5);
          // Switch to curious or running
          c.state = 'sitting_curious';
          c.stateTimer = 0.9;
        }
      }

      // Apply movement towards ball or target
      if (moveSpeed > 0 && absDistToBall > 4) {
        const dir = c.facing === 'right' ? 1 : -1;
        c.x += dir * moveSpeed * dt;
        c.x = Math.max(6, Math.min(92, c.x));
      }

      // Continuous running/paw cycle animation
      setPawRunCycle(prev => (prev + dt * (c.state === 'running' ? 16 : 8)) % (Math.PI * 2));
      setTailWagPhase(prev => (prev + dt * 5) % (Math.PI * 2));

      // 5. UPDATE REACT RENDERING STATES
      setCatX(c.x);
      setCatY(c.y);
      setFacing(c.facing);
      setMotionState(c.state);
      setRotationAngle(c.jumpRot);

      setBallX(b.x);
      setBallY(b.y);
      setBallRotation(b.rotation);

      // Particle decay
      setParticles(prev => prev
        .map(p => ({
          ...p,
          x: p.x + p.vx * dt,
          y: p.y + p.vy * dt,
          vy: p.vy + 200 * dt,
          life: p.life - dt * 2.2
        }))
        .filter(p => p.life > 0)
      );

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [playSound]);

  // Click on Cat: pet, sound, flip leap
  const handleCatClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    playSound('meow');
    setPetCount(prev => prev + 1);
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 1400);

    triggerAcrobaticLeap();
    setQuoteIndex(prev => (prev + 1) % CAT_QUOTES.length);
  };

  // Click on Ground / Play field: Throw ball there!
  const handleGroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentX = (clickX / rect.width) * 100;
    throwBallTo(percentX, 190);
  };

  const currentQuote = CAT_QUOTES[quoteIndex];

  // Procedural leg angles based on run cycle and state
  const legCycle = pawRunCycle;
  const isRunning = motionState === 'running';
  const isWalking = motionState === 'walking';
  const isStalking = motionState === 'stalking';
  const isPouncing = motionState === 'pouncing';
  const isStretching = motionState === 'stretching';
  const isSitting = motionState === 'sitting_curious';

  // Front legs swing
  const frontLegAngleA = (isRunning || isWalking) ? Math.sin(legCycle) * (isRunning ? 32 : 18) : (isPouncing ? 35 : (isStretching ? 25 : 0));
  const frontLegAngleB = (isRunning || isWalking) ? Math.sin(legCycle + Math.PI) * (isRunning ? 32 : 18) : (isPouncing ? 40 : (isStretching ? 25 : 0));
  
  // Hind legs swing
  const backLegAngleA = (isRunning || isWalking) ? Math.sin(legCycle + 0.8) * (isRunning ? 36 : 20) : (isPouncing ? -30 : (isStretching ? -20 : (isSitting ? 45 : 0)));
  const backLegAngleB = (isRunning || isWalking) ? Math.sin(legCycle + Math.PI + 0.8) * (isRunning ? 36 : 20) : (isPouncing ? -25 : (isStretching ? -20 : (isSitting ? 45 : 0)));

  // Spine & Torso flexion
  const spineArch = isRunning 
    ? Math.sin(legCycle) * 3 
    : isStretching ? -5 : (isPouncing ? 4 : (isStalking ? -2 : 0));

  // Tail curvature & wag
  const tailBaseAngle = isRunning 
    ? -25 + Math.sin(tailWagPhase) * 15 
    : isPouncing ? -45 : (isStretching ? -35 : -10 + Math.sin(tailWagPhase) * 12);

  return (
    <>
      {/* FULL BOTTOM PLAY ARENA STRIP (Click anywhere to throw ball!) */}
      <div 
        onClick={handleGroundClick}
        className="fixed bottom-0 left-0 right-0 h-16 z-[105] pointer-events-auto cursor-crosshair group/arena"
        title="Zemine tıkla: Topu fırlat ve kedinin koşmasını izle! 🐾"
      >
        {/* Subtle glowing floor guide line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/25 to-transparent pointer-events-none" />
      </div>

      {/* FLOATING ACTION CONTROL BAR (Throw ball, leap, zoomies, pet, speech) */}
      <div className="fixed bottom-2 left-1/2 -translate-x-1/2 z-[115] pointer-events-auto flex items-center gap-1 sm:gap-2 px-3 py-1.5 rounded-full liquid-glass border border-white/20 shadow-xl backdrop-blur-md text-[10px] sm:text-xs select-none">
        <button
          onClick={(e) => {
            e.stopPropagation();
            throwBallTo(catX > 50 ? 15 : 85, 220);
          }}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full font-bold transition-all cursor-pointer ${
            isTerminal 
              ? 'bg-emerald-500/30 text-emerald-300 hover:bg-emerald-500/50 border border-emerald-500/40' 
              : 'bg-emerald-500 text-white hover:bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.5)]'
          }`}
          title="Topu diğer köşeye yüksekten fırlat!"
        >
          <Zap size={11} className="text-yellow-300 animate-bounce" />
          <span>Topu Fırlat ⚾</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            triggerAcrobaticLeap();
          }}
          className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium transition-all cursor-pointer"
          title="Kediyi havaya zıplat / takla attır!"
        >
          <Sparkles size={11} className="text-cyan-400" />
          <span>Zıplat ✨</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            triggerZoomies();
          }}
          className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium transition-all cursor-pointer hidden md:flex"
          title="Süper hızlı koşma modu (Zoomies!)"
        >
          <Activity size={11} className="text-amber-400" />
          <span>Hızlı Koş 🚀</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            playSound('purr');
            setPetCount(prev => prev + 1);
            setShowHeart(true);
            setTimeout(() => setShowHeart(false), 1200);
          }}
          className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium transition-all cursor-pointer"
          title="Kediyi sev ve mırıldat"
        >
          <Heart size={11} className="text-rose-400 fill-rose-400" />
          <span>Sev ({petCount})</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            soundEngine.playGlassClick();
            setDialogOpen(prev => !prev);
          }}
          className={`flex items-center gap-1 px-2 py-1 rounded-full transition-all cursor-pointer ${
            dialogOpen ? 'bg-cyan-500 text-black font-bold' : 'bg-white/10 hover:bg-white/20 text-white'
          }`}
          title="Asistan diyaloğunu aç/kapat"
        >
          <MessageSquare size={11} />
          <span>{dialogOpen ? 'Kapat' : 'Sohbet'}</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsMuted(prev => !prev);
          }}
          className="p-1 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title={isMuted ? 'Kedi Seslerini Aç' : 'Kedi Seslerini Sustur'}
        >
          {isMuted ? <VolumeX size={12} className="text-rose-400" /> : <Volume2 size={12} className="text-emerald-400" />}
        </button>
      </div>

      {/* BOUNCING & ROLLING PLAY TOY BALL (Yarn / Cyber Energy Ball) */}
      <div
        className="fixed bottom-2 z-[110] pointer-events-auto cursor-grab active:cursor-grabbing select-none"
        style={{
          left: `${ballX}%`,
          bottom: `${8 + ballY}px`,
          transform: 'translateX(-50%)'
        }}
        onClick={(e) => {
          e.stopPropagation();
          throwBallTo(ballX > 50 ? 20 : 80, 200);
        }}
        title="Topa tıkla: Uzağa zıplat!"
      >
        {/* Ball Shadow on ground */}
        <div 
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-black/60 rounded-full blur-xs transition-transform"
          style={{
            width: `${Math.max(6, 20 - ballY * 0.12)}px`,
            height: '4px',
            opacity: Math.max(0.2, 0.8 - ballY * 0.008)
          }}
        />

        {/* Dynamic Glowing Sphere (Yarn ball with grooves & cyber energy pulse) */}
        <div 
          className="relative w-6 h-6 rounded-full transition-transform"
          style={{
            transform: `rotate(${ballRotation}deg)`
          }}
        >
          {/* Outer glow */}
          <div className={`absolute inset-0 rounded-full blur-sm ${
            isTerminal ? 'bg-emerald-400/60' : 'bg-gradient-to-r from-amber-400 to-rose-500 opacity-80'
          }`} />

          {/* Ball Surface */}
          <div className={`relative w-full h-full rounded-full border border-white/40 shadow-lg flex items-center justify-center overflow-hidden ${
            isTerminal 
              ? 'bg-gradient-to-tr from-emerald-900 via-emerald-500 to-teal-200' 
              : 'bg-gradient-to-tr from-rose-600 via-amber-500 to-yellow-300'
          }`}>
            {/* Yarn / cyber texture bands */}
            <div className="absolute inset-0 border-t border-b border-white/50 rounded-full rotate-45" />
            <div className="absolute inset-0 border-l border-r border-white/40 rounded-full -rotate-45" />
            <div className="w-1.5 h-1.5 rounded-full bg-white/90 shadow-[0_0_6px_#fff]" />
          </div>
        </div>

        {/* Ball Hit Counter Badge */}
        {ballHitCount > 0 && (
          <div className="absolute -top-3 -right-2 px-1 py-0.2 rounded-full bg-black/80 text-[8px] font-mono text-yellow-300 border border-yellow-500/40 pointer-events-none">
            {ballHitCount}
          </div>
        )}
      </div>

      {/* FLYING SPARK / DUST PARTICLES */}
      {particles.map(p => (
        <div
          key={p.id}
          className="fixed z-[108] pointer-events-none rounded-full"
          style={{
            left: `${p.x}%`,
            bottom: `${6 + p.y}px`,
            width: `${Math.max(2, p.life * 4)}px`,
            height: `${Math.max(2, p.life * 4)}px`,
            backgroundColor: p.color,
            opacity: p.life,
            boxShadow: `0 0 6px ${p.color}`
          }}
        />
      ))}

      {/* CONTINUOUSLY MOVING, RUNNING, JUMPING CAT */}
      <div
        className="fixed bottom-2 z-[112] pointer-events-none select-none"
        style={{
          left: `${catX}%`,
          bottom: `${4 + catY}px`,
          transform: `translateX(-50%) rotate(${rotationAngle}deg)`,
          transition: catY > 0 ? 'none' : 'bottom 0.1s ease'
        }}
      >
        {/* Ground Shadow under Cat (Shrinks and fades as cat leaps into the air) */}
        <div 
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-black/70 rounded-full blur-sm transition-transform"
          style={{
            width: `${Math.max(14, 52 - catY * 0.3)}px`,
            height: '7px',
            opacity: Math.max(0.1, 0.75 - catY * 0.007)
          }}
        />

        {/* Floating Heart on Pet */}
        <AnimatePresence>
          {showHeart && (
            <motion.div
              initial={{ opacity: 1, y: 0, scale: 0.8 }}
              animate={{ opacity: 0, y: -50, scale: 1.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="absolute -top-8 left-8 text-rose-400 pointer-events-none z-30"
            >
              <Heart size={20} className="fill-rose-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.9)]" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* DIALOG SPEECH BALLOON */}
        <AnimatePresence>
          {dialogOpen && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className={`pointer-events-auto absolute bottom-20 -left-36 sm:-left-40 w-76 sm:w-84 p-3.5 rounded-2xl shadow-2xl border backdrop-blur-xl z-30 text-left ${
                isTerminal 
                  ? 'bg-[#03150d]/95 border-emerald-500/60 shadow-[0_0_25px_rgba(16,185,129,0.35)] text-emerald-300 font-mono'
                  : 'liquid-glass-strong border-white/20 text-white font-sans'
              }`}
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">🐾</span>
                  <span className="text-xs font-bold tracking-tight">
                    {isTerminal ? 'CYBER-CAT // CO-PILOT' : 'Emirhan\'ın Siber Kedisi'}
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

              <p className="text-xs text-white/90 leading-relaxed mb-3">
                {currentQuote.text}
              </p>

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
                  onClick={(e) => {
                    e.stopPropagation();
                    playSound('meow');
                    setQuoteIndex(prev => (prev + 1) % CAT_QUOTES.length);
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-white/80 transition-all cursor-pointer ml-auto"
                >
                  <span>Farklı Söz 🐾</span>
                </button>
              </div>

              {/* Speech pointer arrow */}
              <div className={`absolute -bottom-2 left-36 sm:left-40 w-3.5 h-3.5 rotate-45 border-r border-b ${
                isTerminal ? 'bg-[#03150d] border-emerald-500/60' : 'bg-slate-900 border-white/20'
              }`} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* INTERACTIVE CAT BODY (SVG RIG with Realistic Feline Anatomy) */}
        <div
          onClick={handleCatClick}
          className="pointer-events-auto cursor-pointer relative group/cat"
          style={{
            transform: `scaleX(${facing === 'right' ? 1 : -1})`,
            transition: 'transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
          title="Bana tıkla! Miyavlayayım & zıplayayım 🐾"
        >
          {/* Subtle bio-cyber glow behind cat */}
          <div className={`absolute -inset-1 rounded-full blur-md opacity-50 transition-opacity group-hover/cat:opacity-100 ${
            isTerminal ? 'bg-emerald-500/30' : 'bg-cyan-400/25'
          }`} />

          <svg 
            width="72" 
            height="58" 
            viewBox="0 0 96 74" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="relative drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)] overflow-visible"
          >
            {/* TAIL (Sinuous Cat Tail with dynamic curvature & wag) */}
            <path
              d={`M24 45 C ${10 + tailBaseAngle * 0.4} ${42 + Math.sin(tailWagPhase) * 6}, ${4 + tailBaseAngle * 0.6} ${26 + Math.cos(tailWagPhase) * 8}, ${12 + tailBaseAngle * 0.8} ${12 + Math.sin(tailWagPhase) * 6}`}
              stroke={isTerminal ? "#10b981" : "#38bdf8"}
              strokeWidth={isPouncing ? "4.5" : "3.5"}
              strokeLinecap="round"
              fill="none"
              className="transition-all duration-150"
            />
            {/* Tail Tip Glow */}
            <circle 
              cx={12 + tailBaseAngle * 0.8} 
              cy={12 + Math.sin(tailWagPhase) * 6} 
              r="2.2" 
              fill={isTerminal ? "#6ee7b7" : "#a5f3fc"} 
              className="animate-pulse"
            />

            {/* HIND LEFT LEG (Back far leg) */}
            <g style={{ transform: `rotate(${backLegAngleB}deg)`, transformOrigin: '32px 46px' }}>
              <path 
                d="M32 46 L26 56 L30 66 L35 67" 
                stroke={isTerminal ? "#047857" : "#1e293b"} 
                strokeWidth="4" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              <ellipse cx="34" cy="67" rx="3.5" ry="2" fill={isTerminal ? "#047857" : "#334155"} />
            </g>

            {/* FRONT LEFT LEG (Front far leg) */}
            <g style={{ transform: `rotate(${frontLegAngleB}deg)`, transformOrigin: '64px 44px' }}>
              <path 
                d="M64 44 L60 56 L64 66 L68 67" 
                stroke={isTerminal ? "#047857" : "#1e293b"} 
                strokeWidth="3.6" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              <ellipse cx="67" cy="67" rx="3.5" ry="2" fill={isTerminal ? "#047857" : "#334155"} />
            </g>

            {/* CAT MAIN BODY & SPINE (Flexible arched anatomical torso) */}
            <g>
              {/* Torso path with spine curvature */}
              <path
                d={`M28 48 C 30 ${34 + spineArch}, 46 ${30 + spineArch}, 64 36 C 70 42, 68 54, 58 56 C 44 58, 30 56, 28 48 Z`}
                fill={isTerminal ? "#021c12" : "#0f172a"}
                stroke={isTerminal ? "#34d399" : "#38bdf8"}
                strokeWidth="2.2"
              />

              {/* Muscular Flank & Chest Contour */}
              <path
                d="M38 42 C 48 38, 56 40, 62 44"
                stroke={isTerminal ? "rgba(52,211,153,0.4)" : "rgba(56,189,248,0.4)"}
                strokeWidth="1.2"
                strokeLinecap="round"
                fill="none"
              />
              {/* Shoulder Blade Accent */}
              <path
                d="M58 38 C 62 42, 63 48, 60 52"
                stroke={isTerminal ? "rgba(52,211,153,0.3)" : "rgba(244,114,182,0.3)"}
                strokeWidth="1.2"
                strokeLinecap="round"
                fill="none"
              />
            </g>

            {/* HIND RIGHT LEG (Near leg with powerful feline hock joint) */}
            <g style={{ transform: `rotate(${backLegAngleA}deg)`, transformOrigin: '32px 46px' }}>
              {/* Thigh */}
              <ellipse cx="32" cy="48" rx="8" ry="6" fill={isTerminal ? "#022417" : "#1e293b"} />
              {/* Lower leg & Paw */}
              <path 
                d="M32 46 L26 56 L31 66 L37 67" 
                stroke={isTerminal ? "#34d399" : "#38bdf8"} 
                strokeWidth="3.8" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              <ellipse cx="36" cy="67" rx="4" ry="2.2" fill={isTerminal ? "#6ee7b7" : "#e2e8f0"} />
            </g>

            {/* FRONT RIGHT LEG (Near foreleg, swats/strikes when pouncing) */}
            <g style={{ transform: `rotate(${frontLegAngleA}deg)`, transformOrigin: '64px 44px' }}>
              <path 
                d={motionState === 'swatting' ? "M64 44 L72 48 L80 50 L84 48" : "M64 44 L63 56 L67 66 L73 67"} 
                stroke={isTerminal ? "#34d399" : "#38bdf8"} 
                strokeWidth="3.8" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              <ellipse 
                cx={motionState === 'swatting' ? 84 : 72} 
                cy={motionState === 'swatting' ? 48 : 67} 
                rx="4" 
                ry="2.4" 
                fill={isTerminal ? "#6ee7b7" : "#e2e8f0"} 
              />
            </g>

            {/* HEAD CONTAINER & EXPRESSION */}
            <g transform="translate(62, 14)">
              {/* Left Ear */}
              <path
                d="M4 14 L0 2 L12 8 Z"
                fill={isTerminal ? "#021c12" : "#0f172a"}
                stroke={isTerminal ? "#34d399" : "#38bdf8"}
                strokeWidth="1.6"
              />
              <polygon points="3,11 1,4 9,8" fill={isTerminal ? "rgba(52,211,153,0.5)" : "rgba(244,114,182,0.6)"} />

              {/* Right Ear */}
              <path
                d="M16 12 L22 0 L24 10 Z"
                fill={isTerminal ? "#021c12" : "#0f172a"}
                stroke={isTerminal ? "#34d399" : "#38bdf8"}
                strokeWidth="1.6"
              />
              <polygon points="17,10 21,3 22,9" fill={isTerminal ? "rgba(52,211,153,0.5)" : "rgba(244,114,182,0.6)"} />

              {/* Head Base */}
              <circle 
                cx="12" 
                cy="16" 
                r="12" 
                fill={isTerminal ? "#02120c" : "#0a0f1d"} 
                stroke={isTerminal ? "#34d399" : "#38bdf8"} 
                strokeWidth="2" 
              />

              {/* Whiskers */}
              <line x1="16" y1="18" x2="26" y2="16" stroke={isTerminal ? "#6ee7b7" : "#cbd5e1"} strokeWidth="1" strokeLinecap="round" />
              <line x1="16" y1="20" x2="27" y2="21" stroke={isTerminal ? "#6ee7b7" : "#cbd5e1"} strokeWidth="1" strokeLinecap="round" />
              <line x1="8" y1="18" x2="-2" y2="16" stroke={isTerminal ? "#6ee7b7" : "#cbd5e1"} strokeWidth="1" strokeLinecap="round" />
              <line x1="8" y1="20" x2="-3" y2="21" stroke={isTerminal ? "#6ee7b7" : "#cbd5e1"} strokeWidth="1" strokeLinecap="round" />

              {/* Expressive Eyes (Dilate during hunt/pounce!) */}
              <g>
                {/* Left Eye */}
                <ellipse 
                  cx="8" 
                  cy="14" 
                  rx={isPouncing || isStalking ? "3.2" : "2.6"} 
                  ry={isPouncing || isStalking ? "3.4" : "2.8"} 
                  fill={isTerminal ? "#34d399" : "#38bdf8"} 
                />
                <circle cx="7.5" cy="13" r="1.1" fill="#ffffff" />

                {/* Right Eye */}
                <ellipse 
                  cx="16" 
                  cy="14" 
                  rx={isPouncing || isStalking ? "3.2" : "2.6"} 
                  ry={isPouncing || isStalking ? "3.4" : "2.8"} 
                  fill={isTerminal ? "#34d399" : "#38bdf8"} 
                />
                <circle cx="15.5" cy="13" r="1.1" fill="#ffffff" />
              </g>

              {/* Nose & Cute Cat Mouth */}
              <polygon points="12,18 10.8,17 13.2,17" fill={isTerminal ? "#6ee7b7" : "#f472b6"} />
              <path 
                d="M12 18.5 L12 20 M12 20 C11 21 9.5 20.5 9.5 20.5 M12 20 C13 21 14.5 20.5 14.5 20.5" 
                stroke={isTerminal ? "#34d399" : "#94a3b8"} 
                strokeWidth="1.1" 
                strokeLinecap="round" 
                fill="none" 
              />

              {/* Cyber Collar with Glowing Tag */}
              <path 
                d="M6 24 Q12 27 18 24" 
                stroke={isTerminal ? "#10b981" : "#06b6d4"} 
                strokeWidth="2.2" 
                strokeLinecap="round"
                fill="none"
              />
              <circle 
                cx="12" 
                cy="26.5" 
                r="2.5" 
                fill={isTerminal ? "#34d399" : "#38bdf8"} 
                className="animate-pulse"
              />
            </g>
          </svg>

          {/* Behavior State Indicator Tag */}
          <div className="opacity-0 group-hover/cat:opacity-100 transition-opacity absolute -top-5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-black/80 text-[8px] font-bold text-emerald-300 border border-emerald-500/40 whitespace-nowrap shadow-xs uppercase">
            {motionState === 'running' ? '⚡ KOŞUYOR' : motionState === 'pouncing' ? '🚀 ZIPLIYOR' : motionState === 'stalking' ? '👀 AVLIYOR' : motionState === 'swatting' ? '🐾 TOPA VURUYOR' : '🐾 KEDİ'}
          </div>
        </div>
      </div>
    </>
  );
}

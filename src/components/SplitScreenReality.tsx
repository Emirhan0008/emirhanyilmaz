import React, { useState, useRef, useEffect, useCallback } from 'react';
import { soundEngine } from '../utils/audioSynth';
import { Sparkles, Terminal, Layers, ArrowLeftRight, Check, X } from 'lucide-react';

export interface SplitScreenRealityProps {
  lang?: 'tr' | 'en';
  terminalNode: React.ReactNode;
  liquidGlassNode: React.ReactNode;
  onCloseSplit: (targetMode?: 'normal' | 'terminal') => void;
  initialSplit?: number; // 15 to 85, default 50
}

export const SplitScreenReality: React.FC<SplitScreenRealityProps> = ({
  lang = 'tr',
  terminalNode,
  liquidGlassNode,
  onCloseSplit,
  initialSplit = 50
}) => {
  const isEn = lang === 'en';
  const [splitPos, setSplitPos] = useState<number>(initialSplit);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastSoundPosRef = useRef<number>(initialSplit);

  // Play subtle audio tick when divider crosses every ~5% threshold
  const triggerTickIfCrossed = useCallback((newPos: number) => {
    if (Math.abs(newPos - lastSoundPosRef.current) >= 4) {
      soundEngine.playTerminalKey();
      lastSoundPosRef.current = newPos;
    }
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    soundEngine.playGlassClick();
  };

  const setSplitPosWithSound = (pos: number) => {
    const clamped = Math.min(85, Math.max(15, pos));
    setSplitPos(clamped);
    soundEngine.playTabSwitch();
  };

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const clientX = e.clientX;
      const relativeX = clientX - rect.left;
      const newPercent = (relativeX / rect.width) * 100;
      
      // Clamp between 15% and 85% to preserve usability of both sides
      const clamped = Math.min(85, Math.max(15, newPercent));
      setSplitPos(clamped);
      triggerTickIfCrossed(clamped);
    };

    const handlePointerUp = () => {
      if (isDragging) {
        setIsDragging(false);
        soundEngine.playGlassClick();
      }
    };

    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      window.addEventListener('pointercancel', handlePointerUp);
    }

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [isDragging, triggerTickIfCrossed]);

  // Keyboard navigation for accessibility (WCAG)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setSplitPos(prev => {
        const next = Math.max(15, prev - (e.shiftKey ? 10 : 2));
        triggerTickIfCrossed(next);
        return next;
      });
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setSplitPos(prev => {
        const next = Math.min(85, prev + (e.shiftKey ? 10 : 2));
        triggerTickIfCrossed(next);
        return next;
      });
    } else if (e.key === 'Home') {
      e.preventDefault();
      setSplitPosWithSound(25);
    } else if (e.key === 'End') {
      e.preventDefault();
      setSplitPosWithSound(75);
    } else if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      setSplitPosWithSound(50);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full min-h-screen lg:min-h-0 flex flex-col overflow-hidden select-none bg-[#030706]"
    >
      {/* Invisible global drag shield during active pointer drag */}
      {isDragging && (
        <div className="fixed inset-0 z-[100] cursor-col-resize select-none pointer-events-auto bg-transparent" />
      )}

      {/* Top Cybernetic Split HUD Header */}
      <div className="relative z-30 shrink-0 flex items-center justify-between px-3 sm:px-5 py-2 bg-black/90 backdrop-blur-xl border-b border-emerald-500/20 text-xs shadow-md">
        
        {/* Left: Terminal status indicator */}
        <div className="flex items-center gap-2 text-emerald-400 font-mono select-none">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
          </span>
          <span className="font-bold text-[11px] tracking-wider uppercase flex items-center gap-1.5 truncate">
            <Terminal size={13} className="shrink-0 text-emerald-400" />
            <span className="hidden sm:inline">
              {isEn ? 'MATRIX // POWERSHELL REALITY' : 'POWERSHELL // KODUN MUTFAĞI'}
            </span>
            <span className="sm:hidden">POWERSHELL</span>
          </span>
          <span className="px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-[10px] text-emerald-300 font-mono font-bold">
            %{Math.round(splitPos)}
          </span>
        </div>

        {/* Center: Draggable Ratio Meter & Quick Presets */}
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="hidden md:flex items-center gap-1 text-[10px] font-mono text-white/50 mr-1">
            <ArrowLeftRight size={11} className="text-emerald-400 animate-pulse" />
            <span>{isEn ? 'Slide Curtain:' : 'Canlı Yarılma:'}</span>
          </div>

          <div className="inline-flex items-center p-0.5 rounded-full bg-white/5 border border-white/10">
            <button
              type="button"
              onClick={() => setSplitPosWithSound(25)}
              className={`px-2 py-0.5 rounded-full text-[10px] font-mono transition-all cursor-pointer ${
                Math.round(splitPos) === 25
                  ? 'bg-emerald-500 text-black font-extrabold shadow-[0_0_10px_rgba(52,211,153,0.7)]'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
              title={isEn ? "25% Terminal / 75% Liquid Glass" : "%25 Terminal / %75 Cam UI"}
            >
              %25
            </button>
            <button
              type="button"
              onClick={() => setSplitPosWithSound(50)}
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono transition-all flex items-center gap-1 cursor-pointer ${
                Math.round(splitPos) === 50
                  ? 'bg-gradient-to-r from-emerald-400 to-cyan-400 text-black font-extrabold shadow-[0_0_12px_rgba(6,182,212,0.7)]'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
              title={isEn ? "50:50 Balanced Reality Split" : "50:50 Eşit Yarılma"}
            >
              <span>50:50</span>
            </button>
            <button
              type="button"
              onClick={() => setSplitPosWithSound(75)}
              className={`px-2 py-0.5 rounded-full text-[10px] font-mono transition-all cursor-pointer ${
                Math.round(splitPos) === 75
                  ? 'bg-cyan-500 text-black font-extrabold shadow-[0_0_10px_rgba(6,182,212,0.7)]'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
              title={isEn ? "75% Terminal / 25% Liquid Glass" : "%75 Terminal / %25 Cam UI"}
            >
              %75
            </button>
          </div>

          <div className="w-[1px] h-3.5 bg-white/15 mx-0.5" />

          {/* Quick Exit Buttons */}
          <button
            type="button"
            onClick={() => {
              soundEngine.playGlassClick();
              onCloseSplit('normal');
            }}
            className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/10 hover:bg-white/20 text-white transition-all border border-white/15 hover:border-cyan-400/50 flex items-center gap-1 cursor-pointer shadow-xs"
            title={isEn ? "Switch to Fullscreen Liquid Glass Mode" : "Tam Ekran Cam UI Moduna Geç"}
          >
            <Sparkles size={11} className="text-cyan-400" />
            <span className="hidden sm:inline">{isEn ? 'Full Glass' : 'Tam Cam'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEngine.playTerminalKey();
              onCloseSplit('terminal');
            }}
            className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/40 transition-all flex items-center gap-1 cursor-pointer shadow-xs"
            title={isEn ? "Switch to Fullscreen Terminal Mode" : "Tam Ekran Terminal Moduna Geç"}
          >
            <Terminal size={11} className="text-emerald-400" />
            <span className="hidden sm:inline">{isEn ? 'Full Terminal' : 'Tam Terminal'}</span>
          </button>
        </div>

        {/* Right: Liquid Glass status indicator */}
        <div className="flex items-center gap-2 text-cyan-300 font-mono select-none">
          <span className="px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-[10px] text-cyan-300 font-mono font-bold">
            %{Math.round(100 - splitPos)}
          </span>
          <span className="font-bold text-[11px] tracking-wider uppercase flex items-center gap-1.5 truncate">
            <span className="hidden sm:inline">
              {isEn ? 'LIQUID GLASS // DESIGN SHOWCASE' : 'LIQUID GLASS // TASARIM VİTRİNİ'}
            </span>
            <span className="sm:hidden">CAM UI</span>
            <Layers size={13} className="shrink-0 text-cyan-300" />
          </span>
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-80"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span>
          </span>
        </div>

      </div>

      {/* Main Dual-Universe Split Body */}
      <div className="relative w-full flex-1 flex overflow-hidden min-h-0">
        
        {/* Left Pane: Terminal Reality */}
        <div 
          className="h-full overflow-hidden flex flex-col relative transition-[width] duration-75 ease-out bg-[#020c07]"
          style={{ width: `${splitPos}%` }}
        >
          <div className="w-full h-full overflow-auto relative">
            {terminalNode}
          </div>
        </div>

        {/* Draggable Laser Divider */}
        <div 
          className="relative z-40 shrink-0 w-4 -mx-2 h-full cursor-col-resize group flex items-center justify-center select-none outline-hidden"
          onPointerDown={handlePointerDown}
          onDoubleClick={() => setSplitPosWithSound(50)}
          role="slider"
          aria-label={isEn ? "Dual Reality Split-Screen Divider" : "Canlı Yarılma Perdesi Ayırıcısı"}
          aria-valuenow={Math.round(splitPos)}
          aria-valuemin={15}
          aria-valuemax={85}
          tabIndex={0}
          onKeyDown={handleKeyDown}
        >
          {/* Laser vertical glowing beam */}
          <div className={`w-[2px] h-full transition-all duration-150 ${
            isDragging 
              ? 'bg-gradient-to-b from-emerald-400 via-teal-300 to-cyan-400 shadow-[0_0_18px_rgba(52,211,153,1),0_0_28px_rgba(6,182,212,0.9)] scale-x-150' 
              : 'bg-gradient-to-b from-emerald-400/80 via-teal-300 to-cyan-400/80 shadow-[0_0_10px_rgba(52,211,153,0.7)] group-hover:shadow-[0_0_20px_rgba(52,211,153,1)] group-hover:scale-x-125'
          }`} />

          {/* Draggable Laser Handle Grip Knob */}
          <div 
            className={`absolute top-1/2 -translate-y-1/2 w-8 h-16 rounded-full flex flex-col items-center justify-center gap-1.5 transition-all duration-200 cursor-col-resize select-none ${
              isDragging
                ? 'scale-110 shadow-[0_0_30px_rgba(52,211,153,1),0_0_40px_rgba(6,182,212,0.8)] border-cyan-300 bg-black/95'
                : 'hover:scale-105 shadow-[0_0_20px_rgba(0,0,0,0.9),0_0_15px_rgba(52,211,153,0.6)] border-emerald-400/60 hover:border-emerald-300 bg-black/85 backdrop-blur-lg'
            } border`}
          >
            {/* Left arrow / Terminal side */}
            <span className="text-[10px] text-emerald-400 font-extrabold leading-none pointer-events-none select-none drop-shadow-[0_0_6px_rgba(52,211,153,0.8)]">
              ◀
            </span>

            {/* Tactile Grip Ridges */}
            <div className="flex flex-col gap-0.5 items-center pointer-events-none">
              <span className="w-2.5 h-[1.5px] bg-emerald-400 rounded-full" />
              <span className="w-3.5 h-[1.5px] bg-white rounded-full shadow-[0_0_4px_rgba(255,255,255,0.8)]" />
              <span className="w-2.5 h-[1.5px] bg-cyan-400 rounded-full" />
            </div>

            {/* Right arrow / Glass side */}
            <span className="text-[10px] text-cyan-400 font-extrabold leading-none pointer-events-none select-none drop-shadow-[0_0_6px_rgba(6,182,212,0.8)]">
              ▶
            </span>
          </div>

          {/* Floating Pill Tooltip above divider */}
          <div className={`absolute top-5 pointer-events-none transition-all duration-200 whitespace-nowrap px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-black/95 border border-white/20 shadow-2xl flex items-center gap-2 ${
            isDragging ? 'opacity-100 scale-105' : 'opacity-0 group-hover:opacity-100'
          }`}>
            <span className="text-emerald-400">TERM %{Math.round(splitPos)}</span>
            <span className="text-white/40">|</span>
            <span className="text-cyan-300">CAM %{Math.round(100 - splitPos)}</span>
          </div>
        </div>

        {/* Right Pane: Liquid Glass Reality */}
        <div 
          className="h-full overflow-hidden flex flex-col relative transition-[width] duration-75 ease-out bg-black/40"
          style={{ width: `${100 - splitPos}%` }}
        >
          <div className="w-full h-full overflow-auto relative">
            {liquidGlassNode}
          </div>
        </div>

      </div>
    </div>
  );
};

export default SplitScreenReality;

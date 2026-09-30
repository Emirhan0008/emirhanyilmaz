import { useEffect, useRef } from 'react';

interface MeltingCanvasEffectProps {
  active: boolean;
  onMeltingComplete?: () => void;
}

interface SlagDrip {
  x: number;
  width: number;
  length: number;
  maxLength: number;
  speed: number;
  color: string;
  headRadius: number;
  wobbleSpeed: number;
  wobblePhase: number;
  // Detached drops
  tearY?: number;
  tearSpeed?: number;
  tearRadius?: number;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
}

export function MeltingCanvasEffect({ active, onMeltingComplete }: MeltingCanvasEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Audio sizzle / boil sound effect
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ac = new AudioCtx();
        if (ac.state === 'suspended') ac.resume();

        const bufferSize = Math.floor(ac.sampleRate * 1.5);
        const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noise = ac.createBufferSource();
        noise.buffer = buffer;

        const filter = ac.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(800, ac.currentTime);
        filter.frequency.linearRampToValueAtTime(300, ac.currentTime + 1.8);
        filter.Q.setValueAtTime(2.0, ac.currentTime);

        const gain = ac.createGain();
        gain.gain.setValueAtTime(0.01, ac.currentTime);
        gain.gain.linearRampToValueAtTime(0.06, ac.currentTime + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 2.0);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ac.destination);

        noise.start();
        noise.stop(ac.currentTime + 2.1);
      }
    } catch {}

    // 60FPS Optimized drip array: ~28-35 drips max (covers entire screen seamlessly without CPU lag)
    const dripCount = Math.min(32, Math.max(18, Math.floor(width / 42)));
    const drips: SlagDrip[] = [];

    const magmaColors = [
      '#ff3311', // vibrant hot red
      '#ff5500', // blazing orange
      '#e60026', // ruby magma
      '#ff9900', // molten amber
      '#990011', // cooled dark slag
    ];

    for (let i = 0; i < dripCount; i++) {
      const x = ((i + 0.5) / dripCount) * width + (Math.random() * 20 - 10);
      const widthDrip = Math.random() * 18 + 14;
      drips.push({
        x,
        width: widthDrip,
        length: 0,
        maxLength: height * (0.85 + Math.random() * 0.35),
        speed: (Math.random() * 5 + 4.5) * (height / 800),
        color: magmaColors[i % magmaColors.length],
        headRadius: widthDrip * 0.55 + 2,
        wobbleSpeed: Math.random() * 0.05 + 0.03,
        wobblePhase: Math.random() * Math.PI * 2,
        tearY: 0,
        tearSpeed: Math.random() * 8 + 7,
        tearRadius: Math.random() * 3 + 2,
      });
    }

    const sparks: Spark[] = [];
    const startTime = performance.now();
    let isCompletedCalled = false;

    const render = (now: number) => {
      const elapsed = (now - startTime) / 1000;

      // Fast clear with slight motion trail accumulation
      ctx.fillStyle = 'rgba(6, 2, 3, 0.18)';
      ctx.fillRect(0, 0, width, height);

      // 1. Top molten lava crust bar (fast linear gradient)
      const topBarH = Math.min(height * 0.35, elapsed * 120);
      const topGrad = ctx.createLinearGradient(0, 0, 0, topBarH + 30);
      topGrad.addColorStop(0, 'rgba(120, 8, 8, 0.98)');
      topGrad.addColorStop(0.5, 'rgba(235, 45, 15, 0.92)');
      topGrad.addColorStop(0.85, 'rgba(255, 140, 20, 0.85)');
      topGrad.addColorStop(1, 'rgba(255, 50, 0, 0)');
      ctx.fillStyle = topGrad;
      ctx.fillRect(0, 0, width, topBarH);

      // 2. Render Drips (Clean pathing without expensive per-frame shadowBlur)
      for (let i = 0; i < drips.length; i++) {
        const d = drips[i];
        d.length += d.speed;
        d.wobblePhase += d.wobbleSpeed;

        const currentTipY = Math.min(d.length, d.maxLength);
        const wobbleX = Math.sin(d.wobblePhase) * 4;
        const tipX = d.x + wobbleX;

        // Path for dripping column
        ctx.beginPath();
        ctx.moveTo(d.x - d.width * 0.5, 0);
        ctx.lineTo(tipX - d.headRadius, currentTipY);
        ctx.arc(tipX, currentTipY, d.headRadius, Math.PI, 0, true);
        ctx.lineTo(d.x + d.width * 0.5, 0);
        ctx.closePath();

        // High contrast molten coloring
        const grad = ctx.createLinearGradient(d.x, 0, tipX, currentTipY);
        grad.addColorStop(0, '#550505');
        grad.addColorStop(0.4, d.color);
        grad.addColorStop(0.9, '#ff5500');
        grad.addColorStop(1, '#ffea00'); // incandescent glowing core tip
        ctx.fillStyle = grad;
        ctx.fill();

        // Falling droplets
        if (d.length > 90) {
          if (!d.tearY || d.tearY <= 0) {
            d.tearY = currentTipY;
          } else {
            d.tearY += d.tearSpeed!;
            if (d.tearY > height) d.tearY = currentTipY;
          }

          ctx.beginPath();
          ctx.arc(tipX, d.tearY, d.tearRadius!, 0, Math.PI * 2);
          ctx.fillStyle = '#ffbb00';
          ctx.fill();
        }

        // Spawn a couple of high-impact sparks
        if (Math.random() > 0.85 && sparks.length < 40) {
          sparks.push({
            x: tipX,
            y: currentTipY,
            vx: (Math.random() - 0.5) * 3,
            vy: Math.random() * 2.5 + 1.5,
            size: Math.random() * 2.5 + 1,
            alpha: 1,
            color: Math.random() > 0.4 ? '#ffdd00' : '#ff4400',
          });
        }
      }

      // 3. Render Sparks (Fast circles)
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.alpha -= 0.035;

        if (s.alpha <= 0) {
          sparks.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = s.alpha;
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Bottom molten pool accumulation
      const poolH = Math.min(height * 0.2, elapsed * 50);
      if (poolH > 5) {
        const poolGrad = ctx.createLinearGradient(0, height - poolH, 0, height);
        poolGrad.addColorStop(0, 'rgba(255, 60, 0, 0)');
        poolGrad.addColorStop(0.5, 'rgba(210, 30, 10, 0.7)');
        poolGrad.addColorStop(1, 'rgba(100, 5, 5, 0.98)');
        ctx.fillStyle = poolGrad;
        ctx.fillRect(0, height - poolH, width, poolH);
      }

      if (elapsed >= 2.5 && !isCompletedCalled) {
        isCompletedCalled = true;
        if (onMeltingComplete) onMeltingComplete();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [active, onMeltingComplete]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-[190] pointer-events-none overflow-hidden select-none">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
    </div>
  );
}

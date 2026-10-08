import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Wind, 
  X, 
  Send, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  ShieldAlert, 
  PhoneCall, 
  Check, 
  Copy, 
  ChevronDown,
  Circle
} from 'lucide-react';
import { soundEngine } from '../utils/audioSynth';
import { 
  processCbtInput, 
  CbtMessage, 
  CRISIS_EMERGENCY_DATA 
} from '../utils/cbtTherapyEngine';

export interface ZenCbtTherapyWidgetProps {
  theme?: 'normal' | 'terminal';
  lang?: 'tr' | 'en';
}

export function ZenCbtTherapyWidget({
  theme = 'normal',
  lang = 'tr'
}: ZenCbtTherapyWidgetProps) {
  const isEn = lang === 'en';
  const isTerminal = theme === 'terminal';

  const [isOpen, setIsOpen] = useState(false);
  const [useAiMode, setUseAiMode] = useState(true);
  const [messages, setMessages] = useState<CbtMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showBreathing, setShowBreathing] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // 4-7-8 Breathing Cycle State (Evidence-based parasympathetic relaxation)
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathCountdown, setBreathCountdown] = useState(4);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initial peaceful greeting
  useEffect(() => {
    const greetingText = isEn
      ? "Welcome to this quiet space. 🌿 I am your PDR & CBT mindful reflection companion. Here, we name emotions without judgment and explore thoughts with gentle curiosity. What is lingering on your mind today?"
      : "Sakin ve güvenli bu alana hoş geldin. 🌿 Ben, Emirhan Yılmaz'ın PDR (Rehberlik ve Psikolojik Danışmanlık) ilkeleriyle kurguladığı Bilişsel Yansıtma Danışmanıyım. Seni tüm şefkatimle ve yargısızca dinlemek, duygularını birlikte adlandırmak için buradayım. Bugün kalbinde ya da zihninde neyin ağırlığı var?";

    setMessages([
      {
        id: 'init-therapist',
        sender: 'therapist',
        text: greetingText,
        suggestedFollowUps: isEn 
          ? [
              "I feel overwhelmed by future uncertainty",
              "I am tired of putting pressure on myself",
              "Can we pause for a quiet breathing moment?"
            ]
          : [
              "Gelecek belirsizliği ve iş kaygısı beni yoruyor",
              "Kendime çok fazla yükleniyorum",
              "Birlikte kısa bir sakinleşme nefesi alalım"
            ],
        timestamp: Date.now()
      }
    ]);
  }, [isEn]);

  // Scroll to bottom
  useEffect(() => {
    if (isOpen && !showBreathing) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen, showBreathing]);

  // 4-7-8 Breathing Loop
  useEffect(() => {
    if (!isOpen || !showBreathing) return;

    let timer: NodeJS.Timeout;
    if (breathPhase === 'inhale') {
      if (breathCountdown > 1) {
        timer = setTimeout(() => setBreathCountdown(prev => prev - 1), 1000);
      } else {
        setBreathPhase('hold');
        setBreathCountdown(7);
      }
    } else if (breathPhase === 'hold') {
      if (breathCountdown > 1) {
        timer = setTimeout(() => setBreathCountdown(prev => prev - 1), 1000);
      } else {
        setBreathPhase('exhale');
        setBreathCountdown(8);
      }
    } else if (breathPhase === 'exhale') {
      if (breathCountdown > 1) {
        timer = setTimeout(() => setBreathCountdown(prev => prev - 1), 1000);
      } else {
        setBreathPhase('inhale');
        setBreathCountdown(4);
      }
    }

    return () => clearTimeout(timer);
  }, [isOpen, showBreathing, breathPhase, breathCountdown]);

  const handleOpen = () => {
    setIsOpen(true);
    if (soundEnabled) {
      soundEngine.playZenChime();
    }
    setTimeout(() => {
      inputRef.current?.focus();
    }, 200);
  };

  const handleClose = () => {
    setIsOpen(false);
    setShowBreathing(false);
    if (soundEnabled) {
      soundEngine.playGlassClick();
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isTyping) return;

    setInputText('');
    const isBreathingRequest = /\b(nefes|soluk|breath|4-7-8|sakinleşme nefesi)\b/i.test(query);
    if (isBreathingRequest) {
      setShowBreathing(true);
    }
    if (soundEnabled) {
      soundEngine.playGlassClick();
    }

    // Add user message
    const userMsg: CbtMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    // 1. High-Priority Client-Side Crisis Interceptor (Safety First)
    const ruleResult = processCbtInput(query, lang);
    if (ruleResult.isCrisis) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: `therapist-${Date.now()}`,
          sender: 'therapist',
          text: ruleResult.text,
          isCrisis: true,
          timestamp: Date.now()
        }]);
        setIsTyping(false);
        if (soundEnabled) soundEngine.playErrorBeep();
      }, 400);
      return;
    }

    // 2. AI Mode (Powered by PDR Gemini Model)
    if (useAiMode) {
      try {
        const response = await fetch('/api/cbt-therapist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: query,
            history: messages.slice(-6)
          }),
          signal: AbortSignal.timeout(10000)
        });

        if (response.ok) {
          const data = await response.json();
          if (data && typeof data.reply === 'string' && data.reply.trim()) {
            setMessages(prev => [...prev, {
              id: `therapist-${Date.now()}`,
              sender: 'therapist',
              text: data.reply.trim(),
              distortionTag: ruleResult.distortionTag,
              suggestedFollowUps: Array.isArray(data.suggestedFollowUps) && data.suggestedFollowUps.length > 0
                ? data.suggestedFollowUps
                : ruleResult.suggestedFollowUps,
              timestamp: Date.now()
            }]);
            setIsTyping(false);
            if (soundEnabled) soundEngine.playZenChime();
            return;
          }
        }
      } catch (err) {
        console.warn("CBT AI Assistant offline, falling back to local reflection.");
      }
    }

    // 3. Fallback to Local Rule-Based Engine
    const simulatedDelay = Math.min(900, Math.max(500, query.length * 8));
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: `therapist-${Date.now()}`,
        sender: 'therapist',
        text: ruleResult.text,
        distortionTag: ruleResult.distortionTag,
        suggestedFollowUps: ruleResult.suggestedFollowUps,
        timestamp: Date.now()
      }]);
      setIsTyping(false);
      if (soundEnabled) soundEngine.playZenChime();
    }, simulatedDelay);
  };

  const handleResetSession = () => {
    if (soundEnabled) {
      soundEngine.playGlassClick();
    }
    const resetText = isEn
      ? "A fresh, open space has been created. Take a deep, gentle breath and share whatever you wish. 🌿"
      : "Yepyeni bir sayfa açtık. Derin bir nefes al ve zihninden geçenleri sıfırdan paylaş. 🌿";

    setMessages([
      {
        id: `init-${Date.now()}`,
        sender: 'therapist',
        text: resetText,
        suggestedFollowUps: isEn 
          ? ["I want to share my thoughts", "Help me reframe this feeling", "Let's take a calm breath"]
          : ["Aklımdan geçenleri paylaşmak istiyorum", "Bu hissi birlikte inceleyelim", "Kısa bir nefes alalım"],
        timestamp: Date.now()
      }
    ]);
  };

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleCopyMessage = async (id: string, text: string) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1800);
    } catch {
      // In restricted iframe or non-secure contexts, safely ignore
    }
  };

  // Scientific Affect Labeling Chips (Matthew Lieberman fMRI Study: Naming emotions calms amygdala)
  const AFFECT_LABELS = isEn ? [
    { label: "Anxiety", query: "I notice a strong feeling of anxiety and restlessness right now." },
    { label: "Fatigue", query: "I am feeling mentally and emotionally exhausted." },
    { label: "Pressure", query: "I feel an intense inner pressure to achieve and not fail." },
    { label: "Uncertainty", query: "The uncertainty of the future feels quite overwhelming." }
  ] : [
    { label: "Kaygı", query: "Şu an içimde yoğun bir kaygı ve huzursuzluk fark ediyorum." },
    { label: "Yorgunluk", query: "Zihinsel ve duygusal olarak çok yorgun hissediyorum." },
    { label: "Baskı", query: "Üzerimde başarma ve hata yapmama baskısı hissediyorum." },
    { label: "Belirsizlik", query: "Geleceğin belirsizliği şu an beni bunaltıyor." }
  ];

  return (
    <>
      {/* 1. MINIMAL FLOATING ZEN LAUNCHER */}
      <div className="fixed bottom-6 right-6 z-[150] pointer-events-auto select-none">
        <motion.button
          onClick={isOpen ? handleClose : handleOpen}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`group flex items-center gap-2.5 px-3.5 py-2 rounded-full backdrop-blur-2xl transition-all cursor-pointer border shadow-[0_8px_30px_rgba(0,0,0,0.3)] ${
            isTerminal
              ? 'bg-[#02180e]/95 text-emerald-300 border-emerald-500/40 hover:border-emerald-400'
              : 'bg-zinc-950/85 text-zinc-200 border-white/10 hover:border-emerald-500/40 hover:text-white'
          }`}
          title={isEn ? "Open Mindful Reflection Mirror" : "Zen Bilişsel Yansıtma Aynasını Aç"}
        >
          {/* Subtle serene halo */}
          <span className="w-2 h-2 rounded-full bg-emerald-400/80 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />

          <span className="text-[11px] font-medium tracking-wide">
            {isEn ? "Zen Mirror" : "Zen Ayna"}
          </span>

          <span className="text-zinc-500 text-[10px] group-hover:text-zinc-300 transition-colors">
            {isOpen ? <ChevronDown size={13} /> : <Sparkles size={11} className="text-emerald-400/80" />}
          </span>
        </motion.button>
      </div>

      {/* 2. CALM & MINIMALIST MODAL WINDOW */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.96 }}
            transition={{ type: "spring", damping: 30, stiffness: 350 }}
            className={`fixed bottom-20 right-4 sm:right-6 z-[200] w-[350px] sm:w-[410px] max-w-[94vw] h-[550px] max-h-[min(560px,84dvh)] rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] flex flex-col overflow-hidden backdrop-blur-3xl border transition-all ${
              isTerminal
                ? 'bg-[#02130b]/95 border-emerald-500/30 text-emerald-300 font-mono'
                : 'bg-zinc-950/92 border-white/10 text-zinc-100'
            }`}
          >
            {/* Ambient Background Aura */}
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/15 via-transparent to-transparent pointer-events-none -z-10" />

            {/* MINIMAL HEADER */}
            <div className="px-4 py-3 border-b border-white/8 flex items-center justify-between shrink-0 bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400/90 shadow-[0_0_10px_rgba(52,211,153,0.7)]" />
                <div>
                  <h3 className="text-xs font-semibold tracking-tight text-white flex items-center gap-1.5">
                    <span>{isEn ? "Zen Reflection" : "Zen Yansıtma"}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setUseAiMode(prev => !prev);
                        if (soundEnabled) soundEngine.playGlassClick();
                      }}
                      className="px-1.5 py-0.2 rounded text-[8px] bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 hover:bg-emerald-500/25 transition-all cursor-pointer"
                      title={useAiMode ? "Derin AI Modu aktif. Kural tabanlıya geçmek için tıkla." : "Kural tabanlı mod aktif. AI moduna geçmek için tıkla."}
                    >
                      {useAiMode ? "AI PDR" : "Kuralcı"}
                    </button>
                  </h3>
                  <p className="text-[9px] text-zinc-400 font-light">
                    {isEn ? "Affect Labeling & Decentering" : "Duyguyu Adlandırma & Bilişsel Ayrışma"}
                  </p>
                </div>
              </div>

              {/* Minimal Action Icons */}
              <div className="flex items-center gap-1">
                {/* 4-7-8 Breathing Toggle */}
                <button
                  type="button"
                  onClick={() => setShowBreathing(prev => !prev)}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                    showBreathing 
                      ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40' 
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                  title={isEn ? "4-7-8 Breathing" : "4-7-8 Sakinleşme Nefesi"}
                >
                  <Wind size={14} />
                </button>

                {/* Sound Toggle */}
                <button
                  type="button"
                  onClick={() => setSoundEnabled(prev => !prev)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                  title={soundEnabled ? (isEn ? "Mute Chimes" : "Sesi Kapat") : (isEn ? "Enable Chimes" : "Sesi Aç")}
                >
                  {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
                </button>

                {/* Reset Session */}
                <button
                  type="button"
                  onClick={handleResetSession}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                  title={isEn ? "Reset Session" : "Seansı Sıfırla"}
                >
                  <RotateCcw size={13} />
                </button>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={handleClose}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer ml-0.5"
                  title={isEn ? "Close" : "Kapat"}
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* MINIMAL BREATHING OVERLAY (When opened) */}
            <AnimatePresence>
              {showBreathing && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-b border-emerald-500/20 bg-emerald-950/20 p-4 flex flex-col items-center justify-center gap-2 overflow-hidden shrink-0 select-none"
                >
                  <div className="flex items-center justify-between w-full text-[10px] text-zinc-400">
                    <span className="font-medium text-emerald-300">4-7-8 Nefes Egzersizi</span>
                    <button
                      onClick={() => setShowBreathing(false)}
                      className="text-zinc-500 hover:text-zinc-300 text-[9px] cursor-pointer"
                    >
                      Kapat
                    </button>
                  </div>

                  {/* Serene Breathing Orb */}
                  <div className="relative w-24 h-24 flex items-center justify-center my-1">
                    <motion.div
                      animate={{
                        scale: breathPhase === 'inhale' ? 1.4 : breathPhase === 'hold' ? 1.4 : 0.85,
                        backgroundColor: breathPhase === 'inhale' 
                          ? 'rgba(16, 185, 129, 0.25)' 
                          : breathPhase === 'hold' 
                          ? 'rgba(217, 119, 6, 0.25)' 
                          : 'rgba(56, 189, 248, 0.25)'
                      }}
                      transition={{
                        duration: breathPhase === 'inhale' ? 4 : breathPhase === 'hold' ? 0.3 : 8,
                        ease: "easeInOut"
                      }}
                      className="w-18 h-18 rounded-full border border-emerald-400/50 shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center flex-col text-center"
                    >
                      <span className="text-[11px] font-mono font-bold text-white">
                        {breathCountdown}s
                      </span>
                      <span className="text-[8px] font-medium text-zinc-300 uppercase tracking-wider">
                        {breathPhase === 'inhale' ? (isEn ? 'Inhale' : 'Nefes Al') : breathPhase === 'hold' ? (isEn ? 'Hold' : 'Tut') : (isEn ? 'Exhale' : 'Yavaşça Ver')}
                      </span>
                    </motion.div>
                  </div>

                  <p className="text-[10px] text-zinc-400 text-center max-w-[260px] font-light">
                    {breathPhase === 'inhale' && (isEn ? "Breathe in gently through your nose (4s)." : "Burnundan ciğerlerini sakince doldur (4s).")}
                    {breathPhase === 'hold' && (isEn ? "Hold your breath gently, soften your shoulders (7s)." : "Nefesini tut, omuzlarındaki gerginliği serbest bırak (7s).")}
                    {breathPhase === 'exhale' && (isEn ? "Exhale slowly through your mouth (8s)." : "Nefesini dudaklarını büzerek yavaşça boşalt (8s).")}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* MESSAGES SCROLL AREA */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 select-text">
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';

                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} gap-1.5`}
                  >
                    {/* Quiet Distortion Pill if detected */}
                    {msg.distortionTag && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-light bg-amber-500/10 text-amber-200/90 border border-amber-500/20">
                        <span>{msg.distortionTag}</span>
                      </span>
                    )}

                    {/* Chat Bubble */}
                    <div
                      className={`relative group max-w-[88%] px-3.5 py-3 rounded-2xl text-[12px] leading-relaxed transition-all ${
                        isUser
                          ? (isTerminal
                              ? 'bg-emerald-950/80 text-emerald-200 border border-emerald-500/30 rounded-tr-xs'
                              : 'bg-emerald-600/80 text-white rounded-tr-xs')
                          : (isTerminal
                              ? 'bg-[#031c10]/80 text-emerald-300/90 border border-emerald-500/25 rounded-tl-xs'
                              : 'bg-white/[0.05] text-zinc-200 border border-white/[0.07] rounded-tl-xs')
                      }`}
                    >
                      <p className="whitespace-pre-wrap font-light">{msg.text}</p>

                      {/* CRISIS CARD INTERCEPTOR (Dignified, reassuring, calm) */}
                      {msg.isCrisis && (
                        <div className="mt-3 p-3 rounded-xl bg-red-950/40 border border-red-500/30 space-y-2 text-left text-white">
                          <div className="flex items-center gap-1.5 text-red-300 font-medium text-[11px]">
                            <ShieldAlert size={13} className="text-red-400" />
                            <span>{isEn ? CRISIS_EMERGENCY_DATA.titleEn : CRISIS_EMERGENCY_DATA.title}</span>
                          </div>

                          <div className="space-y-1 pt-1">
                            {CRISIS_EMERGENCY_DATA.hotlines.map(h => (
                              <a
                                key={h.number}
                                href={`tel:${h.number}`}
                                className="flex items-center justify-between p-2 rounded-lg bg-black/40 hover:bg-red-950/30 border border-red-500/20 transition-all cursor-pointer group"
                              >
                                <div className="flex flex-col">
                                  <span className="font-semibold text-[11px] text-white flex items-center gap-1">
                                    <PhoneCall size={10} className="text-red-400" />
                                    <span>{h.name}</span>
                                  </span>
                                  <span className="text-[9px] text-zinc-400">{h.desc}</span>
                                </div>
                                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-red-500/80 text-white">
                                  {h.number}
                                </span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* MINIMAL SOCRATIC FOLLOW-UP CHIPS (Low cognitive burden) */}
                      {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                        <div className="mt-2.5 pt-2 border-t border-white/5 flex flex-wrap gap-1.5">
                          {msg.suggestedFollowUps.map((chip, chipIdx) => (
                            <button
                              key={chipIdx}
                              type="button"
                              onClick={() => handleSendMessage(chip)}
                              disabled={isTyping}
                              className="text-left px-2.5 py-1 rounded-xl text-[10px] font-light bg-emerald-500/[0.08] hover:bg-emerald-500/[0.18] text-emerald-200/90 border border-emerald-500/20 transition-all cursor-pointer"
                            >
                              {chip}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Copy Message Action on Hover */}
                      <button
                        type="button"
                        onClick={() => handleCopyMessage(msg.id, msg.text)}
                        className="absolute -bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md bg-black/70 hover:bg-black text-zinc-400 hover:text-white cursor-pointer"
                        title="Metni Kopyala"
                      >
                        {copiedId === msg.id ? <Check size={10} className="text-emerald-400" /> : <Copy size={10} />}
                      </button>
                    </div>

                    <span className="text-[8px] text-zinc-500 font-mono px-1">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </motion.div>
                );
              })}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-1.5 p-2 rounded-xl text-zinc-400 text-[10px] font-light"
                >
                  <Circle size={6} className="text-emerald-400 animate-ping" />
                  <span>{isEn ? "Reflecting..." : "Yansıtılıyor..."}</span>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* AFFECT LABELING QUICK PILLS (Lieberman fMRI Principle: Putting feelings into words) */}
            <div className="px-3 py-1.5 bg-white/[0.01] border-t border-white/5 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
              <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider shrink-0 pl-1">
                {isEn ? "Feel:" : "Duygu:"}
              </span>
              {AFFECT_LABELS.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(item.query)}
                  disabled={isTyping}
                  className="px-2 py-0.5 rounded-full text-[9px] font-light bg-white/[0.04] hover:bg-emerald-500/15 text-zinc-300 hover:text-emerald-200 border border-white/8 hover:border-emerald-500/25 shrink-0 transition-all cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* MINIMAL INPUT BAR */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 border-t border-white/8 bg-black/40 flex items-center gap-2 shrink-0"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={isEn ? "Express what is on your mind..." : "Aklından geçen düşünceyi buraya yaz..."}
                disabled={isTyping}
                className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-400/40 transition-all font-light"
              />

              <button
                type="submit"
                disabled={isTyping || !inputText.trim()}
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                  inputText.trim() && !isTyping
                    ? 'bg-emerald-500 text-black hover:bg-emerald-400 cursor-pointer shadow-md shadow-emerald-500/20'
                    : 'bg-white/5 text-zinc-600 cursor-not-allowed'
                }`}
                title="Gönder"
              >
                <Send size={12} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Send, Loader2, FolderGit2, Terminal, Mail, BookOpen, Layers } from 'lucide-react';
import { soundEngine } from '../utils/audioSynth';
import { askGroqCatAssistant } from '../utils/groqService';

export type CatBehavior = 'walking-left' | 'walking-right' | 'curious-front' | 'sleeping' | 'purring';

export interface InteractiveCatCompanionProps {
  theme?: 'normal' | 'terminal';
  lang?: 'tr' | 'en';
  onNavigateToTab?: (tab: string) => void;
  onOpenTerminal?: () => void;
  onSwitchToNormal?: () => void;
  onToggleTheme?: () => void;
}

export interface CloudBubbleItem {
  id: string;
  sender: 'user' | 'cat';
  text: string;
}

const CAT_QUOTES_TR = [
  "Miyav! Hoş geldin. Emirhan kod yazarken klavyesinde uyumayı çok severim... Projeler bölümüne mutlaka göz at! 🐾",
  "PDR ve algoritmaların kesiştiği yerdesin! Projeler sekmesindeki yapay zeka araçlarını keşfedebilirsin.",
  "Hacker havası arıyorsan üst menüden Terminal moduna geç, PowerShell komutlarıyla ortalığı tozutalım! ⚡",
  "Bir fikrin veya iş birliği düşüncen mi var? İletişim sekmesinden hemen Emirhan'a pati uzatabilirsin. ✉️",
  "Mırrr... Zihnini dinlendir, projeleri incele. Aklına takılanı bana sorabilirsin! 🐾"
];

const CAT_QUOTES_EN = [
  "Meow! Welcome. I love napping on Emirhan's keyboard while he codes... Be sure to check the Projects! 🐾",
  "You're at the intersection of cognitive psychology & code! Explore AI apps in the Projects tab.",
  "Feeling like a hacker? Switch to Terminal mode and run real PowerShell commands! ⚡",
  "Have a project or collaboration in mind? Reach out directly via the Contact tab. ✉️",
  "Purrr... Take a breath, browse around, and ask me anything you're curious about! 🐾"
];

export function InteractiveCatCompanion({
  theme = 'normal',
  lang = 'tr',
  onNavigateToTab,
  onOpenTerminal,
  onSwitchToNormal,
  onToggleTheme
}: InteractiveCatCompanionProps) {
  const isEn = lang === 'en';
  const isTerminal = theme === 'terminal';
  const CAT_QUOTES = isEn ? CAT_QUOTES_EN : CAT_QUOTES_TR;

  // Dynamic preset queries based on current mode
  const PRESET_QUERIES = isEn
    ? [
        "Summarize Projects",
        "Who is Emirhan?",
        isTerminal ? "Switch to Normal" : "Terminal Mode",
        "Contact Info"
      ]
    : [
        "Projeleri Özetle",
        "Emirhan Kimdir?",
        isTerminal ? "Normal Moda Geç" : "Terminal Modu",
        "İletişim Bilgileri"
      ];

  const [behavior, setBehavior] = useState<CatBehavior>('curious-front');
  const [positionX, setPositionX] = useState<number>(35); // Percentage across screen (15% to 75%)
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [petCount, setPetCount] = useState<number>(0);
  const [showPurrNote, setShowPurrNote] = useState<boolean>(false);

  // Maximum 2 bubbles on screen at any time
  const [bubbles, setBubbles] = useState<CloudBubbleItem[]>([
    {
      id: 'init-cat',
      sender: 'cat',
      text: CAT_QUOTES[0]
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [awaitingAysegulPassword, setAwaitingAysegulPassword] = useState<boolean>(false);
  const [showLoveExplosion, setShowLoveExplosion] = useState<boolean>(false);
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

  // Click on Cat: Toggles the speech dialog with subtle purr feedback (zero heart clues)
  const handleCatClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playCatMeow();
    setPetCount(prev => prev + 1);
    setShowPurrNote(true);
    setTimeout(() => setShowPurrNote(false), 1400);

    setBehavior('curious-front');
    setDialogOpen(prev => !prev);
  };

  // Add message ensuring STRICTLY MAXIMUM 2 BUBBLES on screen
  const addBubbleStrictMaxTwo = (newBubble: CloudBubbleItem) => {
    setBubbles(prev => {
      const combined = [...prev, newBubble];
      return combined.slice(-2);
    });
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isThinking) return;

    soundEngine.playAiSparkle();
    setInputQuery('');
    setBehavior('curious-front');

    // 1. Add Visitor's message bubble
    const userBubble: CloudBubbleItem = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query
    };
    addBubbleStrictMaxTwo(userBubble);

    const lowerQuery = query.toLowerCase().trim();
    const lowerQueryTr = query.toLocaleLowerCase('tr-TR').trim();
    const cleanNumbersOnly = query.replace(/[\.\s\/\-:,_#*]/g, '');

    // SPECIAL EASTER EGG 1: Check if password "25092025" is provided
    if (cleanNumbersOnly.includes('25092025') || cleanNumbersOnly.includes('250925') || cleanNumbersOnly.includes('2592025')) {
      setAwaitingAysegulPassword(false);
      setBehavior('purring');
      setShowLoveExplosion(true);
      setTimeout(() => setShowLoveExplosion(false), 5000);
      soundEngine.playCatPurr();

      const secretLoveReply = isEn
        ? "Shhh... Quiet now, come closer, closer... 🤫🐾 Emirhan loves you so, so much, just so you know! More than anything in the world... I was strictly instructed to whisper this only to you, keep it our little secret! ❤️✨🐾"
        : "Şşşt... Sessiz ol, yaklaş yaklaş... 🤫🐾 Emirhan seni çok ama çok seviyor haberin olsun! Dünyadaki her şeyden çok... Bunu sadece sana fısıldamam tembihlendi, aramızda kalsın! ❤️✨🐾";

      addBubbleStrictMaxTwo({
        id: `cat-${Date.now()}`,
        sender: 'cat',
        text: secretLoveReply
      });
      return;
    }

    // SPECIAL EASTER EGG 2: Check if user claims to be Ayşegül or asks about her
    const isAysegulClaim = 
      lowerQuery.includes('ayşegül') || 
      lowerQuery.includes('aysegul') || 
      lowerQuery.includes('ayşegul') || 
      lowerQueryTr.includes('ayşegül') || 
      lowerQueryTr.includes('aysegul') || 
      /\b(ay[şs]eg[uü]l|ay[şs]o)\b/i.test(lowerQuery) ||
      /\b(ay[şs]eg[uü]l|ay[şs]o)\b/i.test(lowerQueryTr) ||
      /ben\s+ay/i.test(lowerQuery) ||
      /ben\s+ay/i.test(lowerQueryTr);

    if (isAysegulClaim) {
      setAwaitingAysegulPassword(true);
      setBehavior('curious-front');
      soundEngine.playCatMeow();

      const askPasswordReply = isEn
        ? "Meow?! 🐾 Are you really Ayşegül, or an impostor? Only the real Ayşegül knows the secret password... Tell me the password! 🤫🔐"
        : "Miyav?! 🐾 Gerçekten Ayşegül müsün yoksa bir taklitçi mi? Bunu sadece gerçek Ayşegül bilebilir... Gizli parolayı söyle bakalım? 🤫🔐";

      addBubbleStrictMaxTwo({
        id: `cat-${Date.now()}`,
        sender: 'cat',
        text: askPasswordReply
      });
      return;
    }

    // SPECIAL EASTER EGG 3: If cat was expecting the password from Ayşegül and wrong input was typed
    if (awaitingAysegulPassword) {
      setAwaitingAysegulPassword(false);
      soundEngine.playCatMeow();

      const wrongPasswordReply = isEn
        ? "Hmm... Wrong password meow! 😾 The real Ayşegül would never forget that special date... 🐾"
        : "Hımm... Yanlış parola miyav! 😾 Sen gerçek Ayşegül değilsin gibi... Gerçek Ayşegül o özel tarihi asla unutmazdı! 🐾";

      addBubbleStrictMaxTwo({
        id: `cat-${Date.now()}`,
        sender: 'cat',
        text: wrongPasswordReply
      });
      return;
    }

    const isNormalSwitchIntent = 
      lowerQuery.includes('normal mod') || 
      lowerQuery.includes('normal pencere') || 
      lowerQuery.includes('normal arayüz') || 
      lowerQuery.includes('terminalden çık') || 
      lowerQuery.includes('terminali kapat') || 
      lowerQuery.includes('normal moda') || 
      lowerQuery.includes('switch to normal') ||
      lowerQuery.includes('exit terminal');

    if (isNormalSwitchIntent) {
      soundEngine.playGlassClick();
      if (onSwitchToNormal) {
        onSwitchToNormal();
      } else if (onToggleTheme) {
        onToggleTheme();
      }
      addBubbleStrictMaxTwo({
        id: `cat-${Date.now()}`,
        sender: 'cat',
        text: isEn 
          ? "Meow! Switched back to normal sleek portfolio view! 🐾✨" 
          : "Miyav! Normal portfolyo görünümüne geri döndük! 🐾✨"
      });
      return;
    }

    const isTerminalSwitchIntent = 
      lowerQuery.includes('terminal mod') || 
      lowerQuery.includes('powershell') || 
      lowerQuery.includes('terminale geç') || 
      lowerQuery.includes('terminal aç') || 
      lowerQuery.includes('komut satırı') || 
      lowerQuery.includes('switch to terminal') || 
      lowerQuery.includes('open terminal');

    if (isTerminalSwitchIntent) {
      soundEngine.playTerminalKey();
      if (onOpenTerminal) {
        onOpenTerminal();
      } else if (onToggleTheme) {
        onToggleTheme();
      }
      addBubbleStrictMaxTwo({
        id: `cat-${Date.now()}`,
        sender: 'cat',
        text: isEn 
          ? "Meow! Terminal mode engaged! Run PowerShell commands now! ⚡🐾" 
          : "Miyav! PowerShell Terminal moduna geçtik, iyi kodlamalar! ⚡🐾"
      });
      return;
    }

    // Call Groq / AI Assistant
    setIsThinking(true);
    setBehavior('curious-front');

    try {
      const historyForApi = bubbles.map(b => ({ sender: b.sender, text: b.text }));
      const response = await askGroqCatAssistant(query, historyForApi);
      soundEngine.playCatPurr();
      setBehavior('purring');

      addBubbleStrictMaxTwo({
        id: `cat-${Date.now()}`,
        sender: 'cat',
        text: response
      });
    } catch {
      soundEngine.playCatMeow();
      setBehavior('curious-front');

      const fallbackReply = isEn
        ? "Purr... I couldn't reach the AI cloud right now, but feel free to explore the Projects or Contact tab! 🐾"
        : "Mırrr... Şu an yapay zeka bulutuna ulaşamadım, ama Projeler sekmesini mutlaka incele! 🐾";

      addBubbleStrictMaxTwo({
        id: `cat-${Date.now()}`,
        sender: 'cat',
        text: fallbackReply
      });
    } finally {
      setIsThinking(false);
    }
  };

  // Helper: Format text with clickable links
  const renderFormattedText = (text: string) => {
    const parts = text.split(/(\b(?:projeler|projects|iletişim|contact|makaleler|articles|terminal|powershell)\b)/gi);

    return parts.map((part, index) => {
      const lower = part.toLowerCase();

      if (lower.startsWith('proje') || lower.startsWith('project')) {
        return (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              soundEngine.playGlassClick();
              onNavigateToTab?.('projects');
            }}
            className="font-bold underline underline-offset-4 cursor-pointer text-emerald-400 hover:text-emerald-300 transition-colors inline-block"
            title="Projelere Git"
          >
            {part}
          </button>
        );
      }

      if (lower.startsWith('iletişim') || lower.startsWith('contact')) {
        return (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              soundEngine.playGlassClick();
              onNavigateToTab?.('contact');
            }}
            className="font-bold underline underline-offset-4 cursor-pointer text-emerald-400 hover:text-emerald-300 transition-colors inline-block"
            title="İletişime Git"
          >
            {part}
          </button>
        );
      }

      if (lower.startsWith('makale') || lower.startsWith('article')) {
        return (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              soundEngine.playGlassClick();
              onNavigateToTab?.('articles');
            }}
            className="font-bold underline underline-offset-4 cursor-pointer text-emerald-400 hover:text-emerald-300 transition-colors inline-block"
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

    if (lower.includes('proje') || lower.includes('project')) {
      buttons.push({
        id: 'projects',
        label: isEn ? 'Explore Projects' : 'Projelere Git',
        icon: <FolderGit2 size={12} />,
        onClick: () => {
          soundEngine.playGlassClick();
          onNavigateToTab?.('projects');
        }
      });
    }

    if (lower.includes('terminal') || lower.includes('powershell') || lower.includes('mod') || lower.includes('mode')) {
      if (isTerminal) {
        buttons.push({
          id: 'switch-normal',
          label: isEn ? 'Switch to Normal' : 'Normal Moda Geç',
          icon: <Layers size={12} />,
          onClick: () => {
            soundEngine.playGlassClick();
            if (onSwitchToNormal) onSwitchToNormal();
            else if (onToggleTheme) onToggleTheme();
          }
        });
      } else {
        buttons.push({
          id: 'switch-terminal',
          label: isEn ? 'Terminal Mode' : 'Terminal Modu',
          icon: <Terminal size={12} />,
          onClick: () => {
            soundEngine.playTerminalKey();
            if (onOpenTerminal) onOpenTerminal();
            else if (onToggleTheme) onToggleTheme();
          }
        });
      }
    }

    if (lower.includes('iletişim') || lower.includes('mail') || lower.includes('contact')) {
      buttons.push({
        id: 'contact',
        label: isEn ? 'Contact' : 'İletişime Geç',
        icon: <Mail size={12} />,
        onClick: () => {
          soundEngine.playGlassClick();
          onNavigateToTab?.('contact');
        }
      });
    }

    if (lower.includes('makale') || lower.includes('article')) {
      buttons.push({
        id: 'articles',
        label: isEn ? 'Articles' : 'Makalelere Git',
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
      className="fixed bottom-3 z-[180] pointer-events-none select-none transition-all duration-700 ease-out"
      style={{
        left: `${positionX}%`,
        transform: 'translateX(-50%)'
      }}
    >
      {/* MODERN GLASS SPEECH DIALOG & FLOATING INPUT */}
      <AnimatePresence>
        {dialogOpen && (
          <div className={`pointer-events-none absolute bottom-[76px] w-[320px] sm:w-[380px] flex flex-col items-center gap-2.5 z-20 ${containerAlignClass}`}>
            
            {/* Bubble Stack */}
            <div className="w-full flex flex-col gap-2.5 items-center">
              <AnimatePresence initial={false}>
                {bubbles.map((item) => {
                  const isCat = item.sender === 'cat';
                  const actionButtons = isCat ? getActionButtons(item.text) : [];

                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 12, scale: 0.94 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -12, scale: 0.9, transition: { duration: 0.25 } }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      className={`relative pointer-events-auto w-full p-4 rounded-2xl border shadow-xl backdrop-blur-xl select-text ${
                        isTerminal 
                          ? 'bg-zinc-950/95 border-emerald-500/40 text-emerald-100' 
                          : 'bg-zinc-950/92 border-white/15 text-zinc-100'
                      }`}
                    >
                      {/* Sender Tag */}
                      <div className="text-[11px] font-semibold mb-1 flex items-center justify-between">
                        <span className={isCat ? "text-emerald-400" : "text-sky-400"}>
                          {isCat ? "🐾 Kedi" : "💬 Sen"}
                        </span>
                        <span className="text-[9px] text-zinc-500 font-mono">
                          {isCat ? 'companion' : 'guest'}
                        </span>
                      </div>

                      {/* Bubble Text */}
                      <p className="text-xs sm:text-[13px] font-normal leading-relaxed break-words">
                        {isCat ? renderFormattedText(item.text) : item.text}
                      </p>

                      {/* Interactive Redirection Buttons inside cat's bubble */}
                      {isCat && actionButtons.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-white/10 w-full flex flex-wrap gap-1.5">
                          {actionButtons.map((btn) => (
                            <button
                              key={btn.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                btn.onClick();
                              }}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 transition-all cursor-pointer shadow-sm active:scale-95"
                            >
                              {btn.icon}
                              <span>{btn.label}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Thinking Indicator */}
              {isThinking && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="pointer-events-auto px-4 py-2 rounded-xl bg-zinc-950/90 border border-white/10 flex items-center gap-2 text-xs font-mono text-zinc-300 shadow-lg"
                >
                  <Loader2 size={13} className="animate-spin text-emerald-400" />
                  <span>Düşünüyorum... 🐾</span>
                </motion.div>
              )}
            </div>

            {/* INPUT FORM */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="w-full flex items-center gap-1.5 pointer-events-auto"
            >
              <div className={`flex-1 flex items-center gap-2 px-3.5 py-2 rounded-xl shadow-lg backdrop-blur-xl border transition-all ${
                isTerminal
                  ? 'bg-zinc-950/95 border-emerald-500/40 text-emerald-200 focus-within:border-emerald-400'
                  : 'bg-zinc-950/90 border-white/15 text-white focus-within:border-emerald-400'
              }`}>
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder={isEn ? "Ask the cat a question... 🐾" : "Kediciğe bir soru sor... 🐾"}
                  disabled={isThinking}
                  className="flex-1 min-w-0 bg-transparent text-xs outline-hidden placeholder:text-zinc-500"
                />
                <button
                  type="submit"
                  disabled={isThinking || !inputQuery.trim()}
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                    inputQuery.trim() && !isThinking
                      ? 'bg-emerald-500 text-zinc-950 hover:bg-emerald-400 cursor-pointer shadow-sm'
                      : 'bg-white/5 text-zinc-600 cursor-not-allowed'
                  }`}
                  title={isEn ? "Send" : "Gönder"}
                >
                  <Send size={11} />
                </button>
              </div>
            </form>

            {/* PRESET QUESTIONS */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pointer-events-auto w-full">
              {PRESET_QUERIES.map((q, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (q === "Normal Moda Geç" || q === "Switch to Normal") {
                      soundEngine.playGlassClick();
                      if (onSwitchToNormal) onSwitchToNormal();
                      else if (onToggleTheme) onToggleTheme();
                      addBubbleStrictMaxTwo({
                        id: `cat-${Date.now()}`,
                        sender: 'cat',
                        text: isEn ? "Meow! Switched back to normal portfolio view! 🐾" : "Miyav! Normal portfolyo görünümüne geri döndük! 🐾"
                      });
                    } else if (q === "Terminal Modu" || q === "Terminal Mode") {
                      if (isTerminal) {
                        soundEngine.playGlassClick();
                        if (onSwitchToNormal) onSwitchToNormal();
                        else if (onToggleTheme) onToggleTheme();
                      } else {
                        soundEngine.playTerminalKey();
                        if (onOpenTerminal) onOpenTerminal();
                        else if (onToggleTheme) onToggleTheme();
                      }
                    } else {
                      handleSendMessage(q);
                    }
                  }}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-medium bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/10 transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  {q}
                </button>
              ))}
            </div>

          </div>
        )}
      </AnimatePresence>

      {/* Floating Paw & Purr animation on pet (zero heart clues) */}
      <AnimatePresence>
        {showPurrNote && (
          <motion.div
            initial={{ opacity: 1, y: 0, scale: 0.8 }}
            animate={{ opacity: 0, y: -36, scale: 1.15 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.0, ease: "easeOut" }}
            className="absolute -top-7 left-5 text-emerald-400 font-mono text-[11px] font-bold pointer-events-none z-30 flex items-center gap-1 select-none"
          >
            <span>🐾</span>
            <span className="text-[10px] text-emerald-300/80 font-normal italic">purr~</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Love Explosion Hearts for Ayşegül Easter Egg */}
      <AnimatePresence>
        {showLoveExplosion && (
          <div className="absolute -top-14 left-0 right-0 flex justify-center items-center pointer-events-none z-40">
            {[-20, -8, 8, 20].map((xOffset, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 5, scale: 0.5, x: xOffset }}
                animate={{ 
                  opacity: [0, 1, 1, 0], 
                  y: [-5, -45 - idx * 10], 
                  scale: [0.8, 1.3, 1.4, 1.1],
                  rotate: [0, idx % 2 === 0 ? 12 : -12] 
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2.5, delay: idx * 0.15, ease: "easeOut" }}
                className="absolute text-rose-500 text-lg"
              >
                ❤️
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Sleeping 'Zzz' animation */}
      {behavior === 'sleeping' && !dialogOpen && (
        <div className="absolute -top-7 right-0 font-mono text-[10px] text-emerald-400/80 pointer-events-none select-none">
          <motion.span
            animate={{ y: [-1, -8], opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="inline-block"
          >
            zzz...
          </motion.span>
        </div>
      )}

      {/* REFINED MODERN VECTOR CAT ILLUSTRATION */}
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
        title="Emirhan'ın Kedisi (Sohbet etmek için tıkla) 🐾"
      >
        {/* Soft natural ambient contact shadow */}
        <div className="absolute -bottom-1 left-3 right-3 h-2 rounded-full bg-black/40 blur-xs transition-all duration-300 pointer-events-none" />

        {/* Modern Vector Cat SVG */}
        <svg 
          width="76" 
          height="62" 
          viewBox="0 0 76 62" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="relative transition-all duration-300"
        >
          {/* Animated Tail */}
          <motion.path
            d={behavior === 'walking-left' 
              ? "M52 42 C 60 38, 68 32, 66 22 C 64 16, 58 18, 60 26" 
              : behavior === 'walking-right'
              ? "M24 42 C 16 38, 8 32, 10 22 C 12 16, 18 18, 16 26"
              : "M52 42 C 62 40, 68 34, 66 24 C 64 18, 58 20, 61 28"
            }
            stroke={isTerminal ? "#10b981" : "#27272a"}
            strokeWidth="3.2"
            strokeLinecap="round"
            fill="none"
            animate={{
              d: [
                "M52 42 C 62 40, 68 34, 66 24 C 64 18, 58 20, 61 28",
                "M52 42 C 64 42, 70 38, 69 22 C 67 14, 60 18, 62 26",
                "M52 42 C 62 40, 68 34, 66 24 C 64 18, 58 20, 61 28"
              ]
            }}
            transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
          />

          {/* Cat Body */}
          <ellipse 
            cx="38" 
            cy="40" 
            rx="18" 
            ry="12" 
            fill={isTerminal ? "#041f14" : "#18181b"} 
            stroke={isTerminal ? "#10b981" : "#3f3f46"} 
            strokeWidth="1.5"
          />

          {/* Gentle breathing / purr contour */}
          {behavior === 'purring' && (
            <motion.ellipse
              cx="38"
              cy="40"
              rx="18"
              ry="12"
              fill="none"
              stroke={isTerminal ? "#34d399" : "#fbbf24"}
              strokeWidth="0.8"
              strokeDasharray="2 2"
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
            />
          )}

          {/* Cat Paws */}
          {behavior === 'walking-left' || behavior === 'walking-right' ? (
            <motion.g
              animate={{ y: [0, -2, 0] }}
              transition={{ repeat: Infinity, duration: 0.35 }}
            >
              <ellipse cx="28" cy="49" rx="3.5" ry="2" fill={isTerminal ? "#064e3b" : "#27272a"} stroke={isTerminal ? "#10b981" : "#52525b"} strokeWidth="0.8" />
              <ellipse cx="35" cy="50" rx="3.5" ry="2" fill={isTerminal ? "#064e3b" : "#27272a"} stroke={isTerminal ? "#10b981" : "#52525b"} strokeWidth="0.8" />
              <ellipse cx="43" cy="49" rx="3.5" ry="2" fill={isTerminal ? "#064e3b" : "#27272a"} stroke={isTerminal ? "#10b981" : "#52525b"} strokeWidth="0.8" />
              <ellipse cx="49" cy="50" rx="3.5" ry="2" fill={isTerminal ? "#064e3b" : "#27272a"} stroke={isTerminal ? "#10b981" : "#52525b"} strokeWidth="0.8" />
            </motion.g>
          ) : (
            <g>
              <ellipse cx="28" cy="49" rx="3.5" ry="2" fill={isTerminal ? "#064e3b" : "#27272a"} stroke={isTerminal ? "#10b981" : "#52525b"} strokeWidth="0.8" />
              <ellipse cx="37" cy="49.5" rx="3.5" ry="2" fill={isTerminal ? "#064e3b" : "#27272a"} stroke={isTerminal ? "#10b981" : "#52525b"} strokeWidth="0.8" />
              <ellipse cx="46" cy="49" rx="3.5" ry="2" fill={isTerminal ? "#064e3b" : "#27272a"} stroke={isTerminal ? "#10b981" : "#52525b"} strokeWidth="0.8" />
            </g>
          )}

          {/* Cat Head Container */}
          <g>
            {/* Left Ear */}
            <motion.path
              d={behavior === 'walking-left' ? "M26 23 L20 10 L32 17 Z" : "M26 22 L21 11 L33 17 Z"}
              fill={isTerminal ? "#041f14" : "#18181b"}
              stroke={isTerminal ? "#10b981" : "#3f3f46"}
              strokeWidth="1.5"
              animate={isHovered ? { rotate: [-3, 3, -3] } : {}}
              transition={{ repeat: Infinity, duration: 0.8 }}
            />
            {/* Left Ear Inner */}
            <polygon 
              points="25,20 23,13 30,17" 
              fill={isTerminal ? "rgba(16, 185, 129, 0.4)" : "rgba(244, 114, 182, 0.6)"} 
            />

            {/* Right Ear */}
            <motion.path
              d={behavior === 'walking-right' ? "M50 23 L56 10 L44 17 Z" : "M50 22 L55 11 L43 17 Z"}
              fill={isTerminal ? "#041f14" : "#18181b"}
              stroke={isTerminal ? "#10b981" : "#3f3f46"}
              strokeWidth="1.5"
              animate={isHovered ? { rotate: [3, -3, 3] } : {}}
              transition={{ repeat: Infinity, duration: 0.8 }}
            />
            {/* Right Ear Inner */}
            <polygon 
              points="51,20 53,13 46,17" 
              fill={isTerminal ? "rgba(16, 185, 129, 0.4)" : "rgba(244, 114, 182, 0.6)"} 
            />

            {/* Head Round */}
            <circle 
              cx="38" 
              cy="25" 
              r="13" 
              fill={isTerminal ? "#03170e" : "#141416"} 
              stroke={isTerminal ? "#10b981" : "#3f3f46"} 
              strokeWidth="1.5"
            />

            {/* Delicate Whiskers */}
            <line x1="22" y1="27" x2="30" y2="27" stroke={isTerminal ? "rgba(16, 185, 129, 0.6)" : "rgba(255, 255, 255, 0.4)"} strokeWidth="0.8" strokeLinecap="round" />
            <line x1="21" y1="29.5" x2="30" y2="28.5" stroke={isTerminal ? "rgba(16, 185, 129, 0.6)" : "rgba(255, 255, 255, 0.4)"} strokeWidth="0.8" strokeLinecap="round" />
            <line x1="54" y1="27" x2="46" y2="27" stroke={isTerminal ? "rgba(16, 185, 129, 0.6)" : "rgba(255, 255, 255, 0.4)"} strokeWidth="0.8" strokeLinecap="round" />
            <line x1="55" y1="29.5" x2="46" y2="28.5" stroke={isTerminal ? "rgba(16, 185, 129, 0.6)" : "rgba(255, 255, 255, 0.4)"} strokeWidth="0.8" strokeLinecap="round" />

            {/* Eyes */}
            {behavior === 'sleeping' ? (
              <g stroke={isTerminal ? "#34d399" : "#fbbf24"} strokeWidth="1.5" strokeLinecap="round">
                <path d="M31 25 Q33 22 35 25" />
                <path d="M41 25 Q43 22 45 25" />
              </g>
            ) : behavior === 'purring' ? (
              <g stroke={isTerminal ? "#34d399" : "#fbbf24"} strokeWidth="1.5" strokeLinecap="round">
                <path d="M31 24 Q33 27 35 24" />
                <path d="M41 24 Q43 27 45 24" />
              </g>
            ) : (
              <g>
                {/* Left Eye */}
                <ellipse 
                  cx={behavior === 'walking-left' ? "32.5" : behavior === 'walking-right' ? "34.5" : "33.5"} 
                  cy="24.5" 
                  rx="2.6" 
                  ry="3.2" 
                  fill={isTerminal ? "#10b981" : "#f59e0b"} 
                />
                <circle 
                  cx={behavior === 'walking-left' ? "32" : "33"} 
                  cy="23.5" 
                  r="0.9" 
                  fill="#ffffff" 
                />

                {/* Right Eye */}
                <ellipse 
                  cx={behavior === 'walking-left' ? "41.5" : behavior === 'walking-right' ? "43.5" : "42.5"} 
                  cy="24.5" 
                  rx="2.6" 
                  ry="3.2" 
                  fill={isTerminal ? "#10b981" : "#f59e0b"} 
                />
                <circle 
                  cx={behavior === 'walking-left' ? "41" : "42"} 
                  cy="23.5" 
                  r="0.9" 
                  fill="#ffffff" 
                />
              </g>
            )}

            {/* Cute Nose & Mouth */}
            <polygon points="38,28.5 36.8,27.2 39.2,27.2" fill={isTerminal ? "#10b981" : "#f43f5e"} />
            <path 
              d="M38 29 L38 30.5 M38 30.5 C37 31.5 35.5 31 35.5 31 M38 30.5 C39 31.5 40.5 31 40.5 31" 
              stroke={isTerminal ? "#10b981" : "#a1a1aa"} 
              strokeWidth="1" 
              strokeLinecap="round" 
              fill="none" 
            />

            {/* Collar & Tiny Tag */}
            <path 
              d="M32 35 Q38 38 44 35" 
              stroke={isTerminal ? "#059669" : "#f43f5e"} 
              strokeWidth="1.8" 
              strokeLinecap="round" 
              fill="none" 
            />
            <circle 
              cx="38" 
              cy="38" 
              r="1.8" 
              fill={isTerminal ? "#34d399" : "#fbbf24"} 
            />
          </g>
        </svg>

        {/* Micro Tooltip */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-zinc-900/90 text-[9px] font-medium text-zinc-300 border border-white/10 whitespace-nowrap shadow-md">
          {dialogOpen ? 'Kapatmak için tıkla 🐾' : 'Sohbet et 🐾'}
        </div>
      </motion.div>
    </div>
  );
}

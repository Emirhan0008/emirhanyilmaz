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

  // Dynamic preset queries based on current mode so user can toggle back and forth effortlessly
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

    // Fast-path: Check for direct mode switch intents (chat or preset)
    const lowerQuery = query.toLowerCase().trim();
    const cleanNumbersOnly = query.replace(/[\.\s\/\-:,_#*]/g, '');

    // SPECIAL EASTER EGG 1: Check if password "25092025" is provided
    if (cleanNumbersOnly.includes('25092025')) {
      setAwaitingAysegulPassword(false);
      setBehavior('purring');
      setShowHeart(true);
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

    // SPECIAL EASTER EGG 2: Check if user claims to be Ayşegül
    const isAysegulClaim = 
      lowerQuery.includes('ayşegül') || 
      lowerQuery.includes('aysegul') || 
      lowerQuery.includes('aysegül') || 
      lowerQuery.includes('ayşegul') ||
      /\b(ay[şs]eg[uü]l|ay[şs]o)\b/i.test(lowerQuery);

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

    const isTerminalSwitchIntent = 
      lowerQuery.includes('terminal mod') || 
      lowerQuery.includes('terminale geç') || 
      lowerQuery.includes('terminal aç') || 
      lowerQuery.includes('powershell') || 
      lowerQuery.includes('hacker mod') || 
      lowerQuery.includes('switch to terminal');

    const isToggleIntent = 
      lowerQuery === 'mod değiştir' || 
      lowerQuery === 'toggle mode' || 
      lowerQuery === 'tema değiştir';

    if (isNormalSwitchIntent || (isToggleIntent && isTerminal)) {
      soundEngine.playGlassClick();
      if (onSwitchToNormal) {
        onSwitchToNormal();
      } else if (onToggleTheme) {
        onToggleTheme();
      }
      const reply = isEn 
        ? "Meow! Switched back to the liquid glass view! 🐾✨" 
        : "Miyav! Normal sıvı cam arayüzüne geri döndük! 🐾✨";
      addBubbleStrictMaxTwo({
        id: `cat-${Date.now()}`,
        sender: 'cat',
        text: reply
      });
      return;
    }

    if (isTerminalSwitchIntent || (isToggleIntent && !isTerminal)) {
      soundEngine.playTerminalKey();
      if (onOpenTerminal) {
        onOpenTerminal();
      } else if (onToggleTheme) {
        onToggleTheme();
      }
      const reply = isEn 
        ? "Meow! PowerShell Terminal mode engaged! Happy hacking! ⚡🐾" 
        : "Miyav! PowerShell Terminal moduna geçtik, keyifli keşifler! ⚡🐾";
      addBubbleStrictMaxTwo({
        id: `cat-${Date.now()}`,
        sender: 'cat',
        text: reply
      });
      return;
    }

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
    const regex = /(projeler(?:i|de|den|e)?|terminal(?:e|de|den)?|powershell|normal\s*mod(?:a|da|dan)?|normal\s*arayüz(?:e|de|den)?|normal\s*pencere(?:ye|de|den)?|iletişim(?:e|de|den)?|makaleler(?:e|de|den)?)/gi;
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

      if (lower.includes('normal')) {
        return (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              soundEngine.playGlassClick();
              if (onSwitchToNormal) {
                onSwitchToNormal();
              } else if (onToggleTheme) {
                onToggleTheme();
              }
            }}
            className={`font-bold underline underline-offset-4 cursor-pointer transition-colors inline-block ${
              isTerminal ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-600 hover:text-emerald-500'
            }`}
            title={isEn ? "Switch to Normal Mode" : "Normal Moda Geç"}
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
              if (isTerminal) {
                soundEngine.playGlassClick();
                if (onSwitchToNormal) {
                  onSwitchToNormal();
                } else if (onToggleTheme) {
                  onToggleTheme();
                }
              } else {
                soundEngine.playTerminalKey();
                if (onOpenTerminal) {
                  onOpenTerminal();
                } else if (onToggleTheme) {
                  onToggleTheme();
                }
              }
            }}
            className={`font-bold underline underline-offset-4 cursor-pointer transition-colors inline-block ${
              isTerminal ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-600 hover:text-emerald-500'
            }`}
            title={isTerminal ? (isEn ? "Switch to Normal Mode" : "Normal Moda Geç") : (isEn ? "Switch to Terminal" : "Terminal Moduna Geç")}
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

    if (lower.includes('terminal') || lower.includes('powershell') || lower.includes('mod') || lower.includes('mode') || lower.includes('normal')) {
      if (isTerminal) {
        buttons.push({
          id: 'switch-normal',
          label: isEn ? 'Switch to Normal' : 'Normal Moda Geç',
          icon: <Layers size={12} />,
          onClick: () => {
            soundEngine.playGlassClick();
            if (onSwitchToNormal) {
              onSwitchToNormal();
            } else if (onToggleTheme) {
              onToggleTheme();
            }
          }
        });
      } else {
        buttons.push({
          id: 'switch-terminal',
          label: isEn ? 'Switch Mode (Terminal)' : 'Mod Değiştir (Terminal)',
          icon: <Terminal size={12} />,
          onClick: () => {
            soundEngine.playTerminalKey();
            if (onOpenTerminal) {
              onOpenTerminal();
            } else if (onToggleTheme) {
              onToggleTheme();
            }
          }
        });
      }
    }

    if (lower.includes('iletişim') || lower.includes('mail') || lower.includes('eposta') || lower.includes('e-posta') || lower.includes('contact')) {
      buttons.push({
        id: 'contact',
        label: isEn ? 'Contact Emirhan' : 'İletişime Geç',
        icon: <Mail size={12} />,
        onClick: () => {
          soundEngine.playGlassClick();
          onNavigateToTab?.('contact');
        }
      });
    }

    if (lower.includes('makale') || lower.includes('yazı') || lower.includes('article')) {
      buttons.push({
        id: 'articles',
        label: isEn ? 'Read Articles' : 'Makalelere Git',
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
      {/* CLOUD BUBBLE STACK & FLOATING INPUT (Strictly max 2 bubbles, no window background) */}
      <AnimatePresence>
        {dialogOpen && (
          <div className={`pointer-events-none absolute bottom-[78px] w-92 sm:w-[440px] flex flex-col items-center gap-3 z-20 ${containerAlignClass}`}>
            
            {/* Exactly 2 Cloud Bubbles Stack with graceful fade-in & fade-out */}
            <div className="w-full flex flex-col gap-3 items-center">
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
                      className={`relative pointer-events-auto w-full px-12 sm:px-14 py-7 sm:py-8 min-h-[115px] flex flex-col justify-center items-center text-center select-text ${
                        isCat ? 'self-start sm:self-center' : 'self-end sm:self-center'
                      }`}
                    >
                      {/* Comic Cloud SVG Background (Matching pngwing.com.png with PURE WHITE outline & soft shadow) */}
                      <svg 
                        viewBox="0 0 340 200" 
                        preserveAspectRatio="none" 
                        className="absolute -inset-x-6 -inset-y-4 sm:-inset-x-8 sm:-inset-y-5 w-[calc(100%+48px)] sm:w-[calc(100%+64px)] h-[calc(100%+32px)] sm:h-[calc(100%+40px)] -z-10 overflow-visible drop-shadow-[0_14px_32px_rgba(0,0,0,0.65)]"
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
                              ? (isCat ? '#02180e' : '#01120a') 
                              : (isCat ? 'rgba(10, 15, 29, 0.95)' : 'rgba(15, 23, 42, 0.95)')
                          }
                          stroke="#ffffff"
                          strokeWidth="2.8"
                        />
                      </svg>

                      {/* Trailing Comic Thought Bubbles with PURE WHITE outline (like pngwing.com.png) */}
                      {isCat ? (
                        /* Cat's cloud bubbles pointing down-left toward cat */
                        <div className="absolute -bottom-6 left-12 flex flex-col items-center gap-0.5 pointer-events-none">
                          <div className={`w-3.5 h-2.5 rounded-full border-[2.2px] border-white -rotate-25 shadow-xs ${
                            isTerminal ? 'bg-[#02180e]' : 'bg-[#0a0f1d]'
                          }`} />
                          <div className={`w-2.5 h-1.8 rounded-full border-[2px] border-white -rotate-25 ${
                            isTerminal ? 'bg-[#02180e]' : 'bg-[#0a0f1d]'
                          }`} />
                          <div className={`w-1.5 h-1 rounded-full border-[1.6px] border-white -rotate-25 ${
                            isTerminal ? 'bg-[#02180e]' : 'bg-[#0a0f1d]'
                          }`} />
                        </div>
                      ) : (
                        /* Visitor's cloud bubbles pointing down-right */
                        <div className="absolute -bottom-6 right-14 flex flex-col items-center gap-0.5 pointer-events-none">
                          <div className={`w-3.5 h-2.5 rounded-full border-[2.2px] border-white rotate-25 shadow-xs ${
                            isTerminal ? 'bg-[#01120a]' : 'bg-[#0f172a]'
                          }`} />
                          <div className={`w-2.5 h-1.8 rounded-full border-[2px] border-white rotate-25 ${
                            isTerminal ? 'bg-[#01120a]' : 'bg-[#0f172a]'
                          }`} />
                          <div className={`w-1.5 h-1 rounded-full border-[1.6px] border-white rotate-25 ${
                            isTerminal ? 'bg-[#01120a]' : 'bg-[#0f172a]'
                          }`} />
                        </div>
                      )}

                      {/* Content inside cloud - centered in the sweet spot of the cloud */}
                      <div className="relative z-10 w-full max-w-[280px] sm:max-w-[320px] mx-auto flex flex-col items-center text-center">
                        {/* Sender Micro Label */}
                        <div className="text-[11px] font-bold mb-1 flex items-center justify-center gap-1.5">
                          {isCat ? (
                            <span className="text-emerald-400">
                              🐾 Kedi:
                            </span>
                          ) : (
                            <span className="text-cyan-400">
                              💬 Sen:
                            </span>
                          )}
                        </div>

                        {/* Bubble Text (Centered and balanced) */}
                        <p className={`text-xs sm:text-[13px] font-normal leading-relaxed text-center break-words ${
                          isTerminal ? 'text-emerald-200' : 'text-white'
                        }`}>
                          {isCat ? renderFormattedText(item.text) : item.text}
                        </p>

                        {/* Interactive Redirection Buttons inside cat's bubble */}
                        {isCat && actionButtons.length > 0 && (
                          <div className="mt-2.5 pt-2 border-t border-white/15 w-full flex flex-wrap justify-center gap-1.5">
                            {actionButtons.map((btn) => (
                              <button
                                key={btn.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  btn.onClick();
                                }}
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500 hover:bg-emerald-400 text-black shadow-md shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/20"
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
                  className="relative pointer-events-auto px-6 py-3"
                >
                  <svg 
                    viewBox="0 0 200 80" 
                    preserveAspectRatio="none" 
                    className="absolute inset-0 w-full h-full -z-10 overflow-visible drop-shadow-md"
                  >
                    <path
                      d="M 30,40 C 15,25 25,10 45,15 C 60,5 90,5 105,15 C 120,5 150,5 165,15 C 185,15 195,30 185,50 C 195,65 175,75 155,70 C 135,78 110,78 95,70 C 75,78 50,75 40,60 C 20,55 20,45 30,40 Z"
                      fill={isTerminal ? '#02180e' : 'rgba(10, 15, 29, 0.95)'}
                      stroke="#ffffff"
                      strokeWidth="2.4"
                    />
                  </svg>
                  <div className={`flex items-center gap-2 text-xs font-mono font-medium ${
                    isTerminal ? 'text-emerald-400' : 'text-white'
                  }`}>
                    <Loader2 size={13} className="animate-spin text-emerald-400" />
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
              <div className={`flex-1 flex items-center gap-2 px-3.5 py-1.5 rounded-full shadow-2xl backdrop-blur-xl border-[2px] border-white transition-all ${
                isTerminal
                  ? 'bg-black/85 text-emerald-300 focus-within:border-emerald-400'
                  : 'bg-black/80 text-white focus-within:border-emerald-400'
              }`}>
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder={isEn ? "Ask the kitty a question... 🐾" : "Kediciğe bir soru sor... 🐾"}
                  disabled={isThinking}
                  className="flex-1 min-w-0 bg-transparent text-xs outline-hidden placeholder:text-white/50"
                />
                <button
                  type="submit"
                  disabled={isThinking || !inputQuery.trim()}
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all ${
                    inputQuery.trim() && !isThinking
                      ? 'bg-emerald-500 text-black hover:bg-emerald-400 cursor-pointer shadow-sm shadow-emerald-500/40 border border-white/60'
                      : 'bg-white/10 text-white/30 cursor-not-allowed border border-white/20'
                  }`}
                  title={isEn ? "Send" : "Gönder"}
                >
                  <Send size={11} />
                </button>
              </div>
            </form>

            {/* PRESET QUESTIONS (Floating freely under input with solid white outline) */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pointer-events-auto max-w-[350px]">
              {PRESET_QUERIES.map((q, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (q === "Normal Moda Geç" || q === "Switch to Normal") {
                      soundEngine.playGlassClick();
                      if (onSwitchToNormal) {
                        onSwitchToNormal();
                      } else if (onToggleTheme) {
                        onToggleTheme();
                      }
                      addBubbleStrictMaxTwo({
                        id: `cat-${Date.now()}`,
                        sender: 'cat',
                        text: isEn ? "Meow! Switched back to normal liquid glass view! 🐾✨" : "Miyav! Normal sıvı cam arayüzüne geri döndük! 🐾✨"
                      });
                    } else if (q === "Terminal Modu" || q === "Terminal Mode" || q === "Mod Değiştir" || q === "Toggle Mode") {
                      if (isTerminal) {
                        soundEngine.playGlassClick();
                        if (onSwitchToNormal) {
                          onSwitchToNormal();
                        } else if (onToggleTheme) {
                          onToggleTheme();
                        }
                        addBubbleStrictMaxTwo({
                          id: `cat-${Date.now()}`,
                          sender: 'cat',
                          text: isEn ? "Meow! Switched back to normal liquid glass view! 🐾✨" : "Miyav! Normal sıvı cam arayüzüne geri döndük! 🐾✨"
                        });
                      } else {
                        soundEngine.playTerminalKey();
                        if (onOpenTerminal) {
                          onOpenTerminal();
                        } else if (onToggleTheme) {
                          onToggleTheme();
                        }
                        addBubbleStrictMaxTwo({
                          id: `cat-${Date.now()}`,
                          sender: 'cat',
                          text: isEn ? "Meow! PowerShell Terminal mode engaged! ⚡🐾" : "Miyav! PowerShell Terminal moduna geçtik, keyifli keşifler! ⚡🐾"
                        });
                      }
                    } else {
                      handleSendMessage(q);
                    }
                  }}
                  className={`px-3 py-1 rounded-full text-[10px] font-semibold backdrop-blur-md border-[2px] border-white shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer ${
                    isTerminal
                      ? 'bg-black/85 text-emerald-300 hover:text-white hover:border-emerald-400'
                      : 'bg-black/80 text-white hover:text-emerald-300 hover:border-emerald-400'
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

      {/* Love Explosion Hearts for Ayşegül Easter Egg */}
      <AnimatePresence>
        {showLoveExplosion && (
          <div className="absolute -top-16 left-0 right-0 flex justify-center items-center pointer-events-none z-40">
            {[-25, -10, 10, 25].map((xOffset, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10, scale: 0.5, x: xOffset }}
                animate={{ 
                  opacity: [0, 1, 1, 0], 
                  y: [-10, -50 - idx * 12], 
                  scale: [0.8, 1.4, 1.6, 1.2],
                  rotate: [0, idx % 2 === 0 ? 15 : -15] 
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2.8, delay: idx * 0.2, ease: "easeOut" }}
                className="absolute text-rose-500 drop-shadow-[0_0_14px_rgba(244,63,94,0.95)] text-xl"
              >
                ❤️
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Sleeping 'Zzz' animation */}
      {behavior === 'sleeping' && !dialogOpen && (
        <div className="absolute -top-9 right-1 font-mono font-bold text-xs text-amber-400/90 pointer-events-none select-none">
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
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="Emirhan'ın Siber Kedisi (Açmak / Kapatmak için tıkla) 🐾"
      >
        {/* Glow halo under cat (Distinct warm amber/gold puddle that pops against green and dark blue) */}
        <div className="absolute -bottom-1 -left-4 -right-4 h-5 rounded-full blur-md bg-amber-500/45 shadow-[0_0_20px_rgba(245,158,11,0.55)] transition-all duration-300" />

        {/* Dynamic SVG Animated Cat with distinctive Golden Amber outline palette */}
        <svg 
          width="84" 
          height="74" 
          viewBox="0 0 64 56" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="relative drop-shadow-[0_12px_22px_rgba(245,158,11,0.35)]"
        >
          {/* Animated Tail */}
          <motion.path
            d={behavior === 'walking-left' 
              ? "M42 38 C 48 34, 56 30, 54 20 C 52 14, 46 16, 48 24" 
              : behavior === 'walking-right'
              ? "M18 38 C 12 34, 4 30, 6 20 C 8 14, 14 16, 12 24"
              : "M42 38 C 50 36, 56 32, 54 22 C 52 16, 47 18, 49 26"
            }
            stroke="#fbbf24"
            strokeWidth="3.8"
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
            fill={isTerminal ? "#041b12" : "#0a0f1d"} 
            stroke="#fbbf24" 
            strokeWidth="2.4"
          />

          {/* Cyber Accent Circuit lines on back */}
          <path
            d="M26 33 L32 30 L38 33"
            stroke="rgba(251, 191, 36, 0.7)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />

          {/* Cat Paws / Legs */}
          {behavior === 'walking-left' || behavior === 'walking-right' ? (
            <motion.g
              animate={{ y: [0, -2, 0] }}
              transition={{ repeat: Infinity, duration: 0.4 }}
            >
              <ellipse cx="23" cy="45" rx="3.5" ry="2" fill="#fef08a" stroke="#d97706" strokeWidth="0.8" />
              <ellipse cx="30" cy="46" rx="3.5" ry="2" fill="#fde047" stroke="#d97706" strokeWidth="0.8" />
              <ellipse cx="37" cy="45" rx="3.5" ry="2" fill="#fef08a" stroke="#d97706" strokeWidth="0.8" />
              <ellipse cx="43" cy="46" rx="3.5" ry="2" fill="#fde047" stroke="#d97706" strokeWidth="0.8" />
            </motion.g>
          ) : (
            <g>
              <ellipse cx="24" cy="45" rx="3.5" ry="2" fill="#fde047" stroke="#d97706" strokeWidth="0.8" />
              <ellipse cx="32" cy="45.5" rx="3.5" ry="2" fill="#fef08a" stroke="#d97706" strokeWidth="0.8" />
              <ellipse cx="40" cy="45" rx="3.5" ry="2" fill="#fde047" stroke="#d97706" strokeWidth="0.8" />
            </g>
          )}

          {/* Cat Head Container */}
          <g>
            {/* Left Ear */}
            <motion.path
              d={behavior === 'walking-left' ? "M20 19 L15 6 L26 13 Z" : "M20 18 L16 7 L27 13 Z"}
              fill={isTerminal ? "#041b12" : "#0a0f1d"}
              stroke="#fbbf24"
              strokeWidth="2.2"
              animate={isHovered ? { rotate: [-4, 4, -4] } : {}}
              transition={{ repeat: Infinity, duration: 0.8 }}
            />
            {/* Left Ear Inner */}
            <polygon 
              points="19,16 17,9 24,13" 
              fill="rgba(244, 114, 182, 0.75)" 
            />

            {/* Right Ear */}
            <motion.path
              d={behavior === 'walking-right' ? "M44 19 L49 6 L38 13 Z" : "M44 18 L48 7 L37 13 Z"}
              fill={isTerminal ? "#041b12" : "#0a0f1d"}
              stroke="#fbbf24"
              strokeWidth="2.2"
              animate={isHovered ? { rotate: [4, -4, 4] } : {}}
              transition={{ repeat: Infinity, duration: 0.8 }}
            />
            {/* Right Ear Inner */}
            <polygon 
              points="45,16 47,9 40,13" 
              fill="rgba(244, 114, 182, 0.75)" 
            />

            {/* Head Round */}
            <circle 
              cx="32" 
              cy="21" 
              r="12.5" 
              fill={isTerminal ? "#02120c" : "#060913"} 
              stroke="#fbbf24" 
              strokeWidth="2.4"
            />

            {/* Whiskers */}
            <line x1="16" y1="23" x2="24" y2="23" stroke="#fef08a" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="15" y1="26" x2="24" y2="25" stroke="#fef08a" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="48" y1="23" x2="40" y2="23" stroke="#fef08a" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="49" y1="26" x2="40" y2="25" stroke="#fef08a" strokeWidth="1.2" strokeLinecap="round" />

            {/* Eyes - Glowing Amber Gold */}
            {behavior === 'sleeping' ? (
              <g stroke="#fbbf24" strokeWidth="2" strokeLinecap="round">
                <path d="M26 21 Q28 18 30 21" />
                <path d="M34 21 Q36 18 38 21" />
              </g>
            ) : (
              <g>
                <ellipse 
                  cx={behavior === 'walking-left' ? "26.5" : behavior === 'walking-right' ? "28.5" : "28"} 
                  cy="20.5" 
                  rx="2.8" 
                  ry="3.4" 
                  fill="#f59e0b" 
                  stroke="#fde047"
                  strokeWidth="0.8"
                />
                <circle cx={behavior === 'walking-left' ? "26" : "27.5"} cy="19.5" r="1.1" fill="#ffffff" />

                <ellipse 
                  cx={behavior === 'walking-left' ? "34.5" : behavior === 'walking-right' ? "36.5" : "36"} 
                  cy="20.5" 
                  rx="2.8" 
                  ry="3.4" 
                  fill="#f59e0b" 
                  stroke="#fde047"
                  strokeWidth="0.8"
                />
                <circle cx={behavior === 'walking-left' ? "34" : "35.5"} cy="19.5" r="1.1" fill="#ffffff" />
              </g>
            )}

            {/* Cute Coral Nose & Mouth */}
            <polygon points="32,24.5 30.8,23 33.2,23" fill="#f43f5e" />
            <path 
              d="M32 25 L32 26.5 M32 26.5 C31 27.5 29.5 27 29.5 27 M32 26.5 C33 27.5 34.5 27 34.5 27" 
              stroke="#fbbf24" 
              strokeWidth="1.2" 
              strokeLinecap="round" 
              fill="none" 
            />

            {/* Glowing Cyber Collar & Golden Tag */}
            <path 
              d="M26 31 Q32 34 38 31" 
              stroke="#ec4899" 
              strokeWidth="2.4" 
              strokeLinecap="round"
              fill="none"
            />
            <circle 
              cx="32" 
              cy="34" 
              r="2.4" 
              fill="#fbbf24" 
              stroke="#ffffff"
              strokeWidth="0.8"
              className="animate-pulse"
            />
          </g>
        </svg>

        {/* Micro Interaction Tooltip badge */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-black/90 text-[9px] font-bold text-amber-300 border border-amber-400/60 whitespace-nowrap shadow-md">
          {dialogOpen ? 'Kapatmak için tıkla 🐾' : 'Konuşmak için tıkla 🐾'}
        </div>
      </motion.div>
    </div>
  );
}

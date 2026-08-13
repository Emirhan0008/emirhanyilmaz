import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, X, Send, Sparkles, MessageSquare, ArrowRight, Wand2, RefreshCw } from 'lucide-react';
import { soundEngine } from '../utils/audioSynth';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

interface AiAssistantDrawerProps {
  onNavigateToTab: (tab: 'profile' | 'projects' | 'articles' | 'contact') => void;
  onOpenEstimator?: () => void;
  onFillContactMessage?: (msg: string) => void;
}

const PRESET_QUESTIONS = [
  "Emirhan'ın uzmanlık alanları neler?",
  "Bana özel bir AI projesi mimarisi öner",
  "PDR ve Yapay Zeka nasıl entegre ediliyor?",
  "En başarılı 3 projesini özetler misin?"
];

export function AiAssistantDrawer({ onNavigateToTab, onOpenEstimator, onFillContactMessage }: AiAssistantDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Merhaba! Ben Emirhan Yılmaz\'ın Yapay Zeka İkiziyim. Psikolojik Danışmanlık ve Yapay Zeka projeleri, teknik mimariler veya iş birliği fırsatları hakkında bana dilediğinizi sorabilirsiniz!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input.trim();
    if (!query || isLoading) return;

    soundEngine.playGlassClick();
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query })
      });

      const data = await res.json();
      soundEngine.playSwoosh();

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.reply || "Ağ hatası oluştu, lütfen tekrar deneyiniz.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: "Üzgünüm, şu anda yanıt oluşturulamadı. Lütfen doğrudan İletişim Formunu kullanarak Emirhan'a ulaşın.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          soundEngine.playGlassClick();
          setIsOpen(!isOpen);
        }}
        className="fixed bottom-6 right-6 z-40 px-4 py-3 rounded-full liquid-glass-strong border border-emerald-400/40 text-white shadow-2xl flex items-center gap-2.5 cursor-pointer group hover:border-emerald-400/80 transition-all bg-black/80 backdrop-blur-xl"
        id="ai-assistant-trigger"
      >
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-black font-bold shadow-lg">
            <Bot size={18} />
          </div>
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-black" />
        </div>
        <div className="text-left hidden sm:block">
          <span className="text-xs font-extrabold text-white block leading-none">AI Danışman</span>
          <span className="text-[9px] text-emerald-400 font-mono font-semibold">● Canlı Sor / Yanıtla</span>
        </div>
      </motion.button>

      {/* AI Assistant Drawer Panel */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex justify-end p-2 sm:p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="w-full max-w-md h-full rounded-[2rem] liquid-glass-strong border border-white/15 bg-zinc-950/90 shadow-2xl flex flex-col overflow-hidden relative select-text"
            >
              {/* Drawer Header */}
              <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-black/40 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-black font-extrabold shadow-lg">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                      Emirhan AI Danışmanı
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono border border-emerald-500/30">
                        Gemini 2.5
                      </span>
                    </h3>
                    <p className="text-[10px] text-white/60">Yapay zeka ve proje mimarisi asistanınız</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-white/70 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-white/10"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Quick Action Shortcuts Banner */}
              <div className="px-4 py-2 bg-white/5 border-b border-white/5 flex items-center justify-between text-[10px] text-white/70">
                <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <Wand2 size={11} /> Hızlı Araçlar:
                </span>
                <div className="flex items-center gap-2">
                  {onOpenEstimator && (
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        onOpenEstimator();
                      }}
                      className="px-2 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 font-bold transition-all cursor-pointer"
                    >
                      Proje Mimarisi Oluştur
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      onNavigateToTab('contact');
                    }}
                    className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold transition-all cursor-pointer"
                  >
                    İletişime Geç
                  </button>
                </div>
              </div>

              {/* Message History */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3.5 scrollbar-thin">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium rounded-tr-xs shadow-md'
                          : 'bg-white/10 border border-white/10 text-white/95 rounded-tl-xs shadow-inner'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    </div>
                    <span className="text-[9px] text-white/40 mt-1 font-mono px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-center gap-2 text-xs text-emerald-400 p-3 rounded-2xl bg-white/5 border border-white/10 w-fit animate-pulse">
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Emirhan AI yanıtı hazırlıyor...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Preset Question Chips */}
              <div className="p-3 border-t border-white/5 bg-black/20 overflow-x-auto flex items-center gap-2 scrollbar-none shrink-0">
                {PRESET_QUESTIONS.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(q)}
                    disabled={isLoading}
                    className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-emerald-500/20 hover:border-emerald-500/40 text-white/80 hover:text-white border border-white/10 text-[10px] font-medium whitespace-nowrap transition-all shrink-0 cursor-pointer"
                  >
                    💡 {q}
                  </button>
                ))}
              </div>

              {/* Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="p-3.5 border-t border-white/10 bg-black/40 flex items-center gap-2 shrink-0"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Yapay zeka asistanına bir soru sorun..."
                  disabled={isLoading}
                  className="flex-1 py-2.5 px-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/40 focus:outline-hidden focus:ring-1 focus:ring-emerald-400/50"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-extrabold flex items-center justify-center transition-all disabled:opacity-40 cursor-pointer shadow-md shrink-0"
                >
                  <Send size={15} />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

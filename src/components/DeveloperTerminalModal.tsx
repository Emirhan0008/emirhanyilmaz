import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, X, CornerDownLeft, Sparkles, Shield, Cpu } from 'lucide-react';
import { soundEngine } from '../utils/audioSynth';
import { profileData, projects } from '../data';

interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'system';
  text: string;
}

interface DeveloperTerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: 'profile' | 'projects' | 'articles' | 'contact') => void;
  onSelectProject?: (projId: string) => void;
}

export function DeveloperTerminalModal({ isOpen, onClose, onNavigateTab, onSelectProject }: DeveloperTerminalModalProps) {
  const [command, setCommand] = useState('');
  const [showMatrixRain, setShowMatrixRain] = useState(false);
  const [lines, setLines] = useState<TerminalLine[]>([
    { id: '1', type: 'system', text: '===================================================' },
    { id: '2', type: 'system', text: ' EMIRHAN YILMAZ PORTFOLIO OS v2.5 [Terminal Mode]' },
    { id: '3', type: 'system', text: ' Type "help" for a list of available commands.' },
    { id: '4', type: 'system', text: '===================================================' }
  ]);

  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [lines, isOpen]);

  const handleCommand = async (cmdStr: string) => {
    const raw = cmdStr.trim();
    if (!raw) return;

    soundEngine.playGlassClick();
    const cmd = raw.toLowerCase();

    const inputLine: TerminalLine = {
      id: Date.now().toString(),
      type: 'input',
      text: `emirhan@portfolio:~$ ${raw}`
    };

    let responseLines: TerminalLine[] = [];

    if (cmd === 'help') {
      responseLines = [
        { id: 'h1', type: 'output', text: 'Available Commands:' },
        { id: 'h2', type: 'output', text: '  bio        - View profile summary & credentials' },
        { id: 'h3', type: 'output', text: '  projects   - List all featured portfolio projects' },
        { id: 'h4', type: 'output', text: '  skills     - View core technology stack' },
        { id: 'h5', type: 'output', text: '  contact    - Get contact links and email' },
        { id: 'h6', type: 'output', text: '  matrix     - Toggle matrix digital rain effect' },
        { id: 'h7', type: 'output', text: '  ai <query> - Ask AI Assistant a direct question' },
        { id: 'h8', type: 'output', text: '  clear      - Clear terminal console output' },
        { id: 'h9', type: 'output', text: '  exit       - Close terminal mode' }
      ];
    } else if (cmd === 'bio') {
      responseLines = [
        { id: 'b1', type: 'output', text: `Name: ${profileData.name} - ${profileData.title}` },
        { id: 'b2', type: 'output', text: `About: ${profileData.about}` },
        { id: 'b3', type: 'output', text: `AI Specialization: ${profileData.aiProfile.title} (${profileData.aiProfile.certification})` }
      ];
    } else if (cmd === 'projects') {
      responseLines = projects.map(p => ({
        id: `p-${p.id}`,
        type: 'output',
        text: `[${p.id}] ${p.title} (${p.category}) -> Tech: ${p.tech.join(', ')}`
      }));
    } else if (cmd === 'skills') {
      responseLines = [
        { id: 's1', type: 'output', text: `Primary Stack: ${profileData.softwareProfile.language}` },
        { id: 's2', type: 'output', text: `Level: ${profileData.softwareProfile.level}` },
        { id: 's3', type: 'output', text: `Skills: ${profileData.softwareProfile.skills.join(', ')}` }
      ];
    } else if (cmd === 'contact') {
      responseLines = [
        { id: 'c1', type: 'output', text: 'Email: emirhan0008@gmail.com' },
        { id: 'c2', type: 'output', text: 'GitHub: https://github.com' },
        { id: 'c3', type: 'output', text: 'Instagram: https://instagram.com' }
      ];
    } else if (cmd === 'matrix') {
      setShowMatrixRain(!showMatrixRain);
      responseLines = [
        { id: 'm1', type: 'system', text: `Matrix digital rain effect toggled: ${!showMatrixRain ? 'ON' : 'OFF'}` }
      ];
    } else if (cmd === 'clear') {
      setLines([]);
      setCommand('');
      return;
    } else if (cmd === 'exit') {
      onClose();
      setCommand('');
      return;
    } else if (cmd.startsWith('ai ')) {
      const prompt = raw.slice(3);
      setLines(prev => [...prev, inputLine, { id: Date.now().toString(), type: 'system', text: 'Querying Gemini AI...' }]);
      setCommand('');
      
      try {
        const res = await fetch('/api/ai-assistant', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt })
        });
        const data = await res.json();
        setLines(prev => [...prev, { id: (Date.now() + 1).toString(), type: 'output', text: `AI: ${data.reply}` }]);
      } catch (err) {
        setLines(prev => [...prev, { id: (Date.now() + 1).toString(), type: 'output', text: 'AI query failed.' }]);
      }
      return;
    } else {
      responseLines = [
        { id: 'err', type: 'output', text: `Command not recognized: "${raw}". Type "help" for options.` }
      ];
    }

    setLines(prev => [...prev, inputLine, ...responseLines]);
    setCommand('');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-3xl h-[80vh] rounded-[2rem] bg-zinc-950/95 border border-emerald-500/40 shadow-2xl flex flex-col overflow-hidden relative font-mono select-text"
        >
          {/* Header */}
          <div className="p-4 bg-black/80 border-b border-white/10 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <Terminal size={18} className="text-emerald-400" />
              <span className="text-xs font-bold text-emerald-400">emirhan@portfolio-os:~$</span>
              <span className="text-[10px] text-white/50">(`Ctrl + ~` to exit)</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowMatrixRain(!showMatrixRain)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border cursor-pointer transition-all ${
                  showMatrixRain ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50' : 'bg-white/5 text-white/60 border-white/10'
                }`}
              >
                Matrix FX
              </button>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Terminal Output */}
          <div className="flex-1 p-5 overflow-y-auto space-y-2 text-xs text-emerald-300/90 leading-relaxed scrollbar-thin relative">
            {showMatrixRain && (
              <div className="absolute inset-0 pointer-events-none opacity-15 overflow-hidden font-mono text-[10px] text-emerald-400 select-none">
                01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
                1010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
              </div>
            )}

            {lines.map((l) => (
              <div
                key={l.id}
                className={`${
                  l.type === 'input'
                    ? 'text-white font-bold'
                    : l.type === 'system'
                    ? 'text-emerald-500 font-semibold'
                    : 'text-emerald-300/90'
                }`}
              >
                {l.text}
              </div>
            ))}
            <div ref={terminalEndRef} />
          </div>

          {/* Input Line */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCommand(command);
            }}
            className="p-3 bg-black border-t border-white/10 flex items-center gap-2 shrink-0"
          >
            <span className="text-emerald-400 font-bold text-xs">$</span>
            <input
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              placeholder="Type a command (e.g. 'help', 'projects', 'ai ...')"
              className="flex-1 bg-transparent text-xs text-white focus:outline-hidden font-mono placeholder-white/20"
              autoFocus
            />
            <button type="submit" className="text-emerald-400 hover:text-emerald-300 cursor-pointer">
              <CornerDownLeft size={16} />
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

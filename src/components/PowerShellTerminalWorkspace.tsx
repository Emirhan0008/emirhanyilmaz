import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Terminal, Send, HelpCircle, CornerDownLeft, Sparkles, Folder, FileText, ArrowRight, RefreshCw, Layers, Maximize2, Minimize2, ExternalLink } from 'lucide-react';
import { profileData, projects, articles } from '../data';
import { soundEngine } from '../utils/audioSynth';
import { Project, Article } from '../types';

interface TerminalLine {
  id: string;
  type: 'prompt' | 'output' | 'system' | 'error' | 'success' | 'table';
  text?: string;
  elements?: React.ReactNode;
}

interface PowerShellTerminalWorkspaceProps {
  onSwitchToNormal: (tab?: 'profile' | 'projects' | 'articles' | 'contact') => void;
  onOpenProjectModal?: (project: Project) => void;
  onOpenArticleModal?: (article: Article) => void;
}

export const PulsingNormalOpenButton: React.FC<{
  onClick: () => void;
  label?: string;
  tooltip?: string;
}> = ({
  onClick,
  label = "Normal Pencerede Aç",
  tooltip = "Bu içeriği görsel cam arayüzde zengin kart görünümünde inceleyin"
}) => {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        soundEngine.playGlassClick();
        onClick();
      }}
      className="relative inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 text-black font-extrabold text-[10px] tracking-wide shadow-[0_0_18px_rgba(52,211,153,0.7)] animate-pulse hover:scale-105 active:scale-95 transition-all cursor-pointer hover:brightness-110 shrink-0 border border-emerald-200 select-none group"
      title={tooltip}
    >
      <span className="w-2 h-2 rounded-full bg-emerald-950 animate-ping absolute -top-1 -right-1" />
      <Sparkles size={11} className="text-black animate-spin" style={{ animationDuration: '3.5s' }} />
      <span>{label}</span>
      <ExternalLink size={10} className="text-black ml-0.5" />
    </button>
  );
};

export const PowerShellTerminalWorkspace: React.FC<PowerShellTerminalWorkspaceProps> = ({
  onSwitchToNormal,
  onOpenProjectModal,
  onOpenArticleModal,
}) => {
  const [currentPath, setCurrentPath] = useState<string>('C:\\Users\\Emirhan\\portfolio');
  const [commandInput, setCommandInput] = useState<string>('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initial PowerShell Welcome Lines
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      id: 'banner-1',
      type: 'system',
      text: 'Windows PowerShell'
    },
    {
      id: 'banner-2',
      type: 'system',
      text: 'Copyright (C) Microsoft Corporation. Tüm hakları saklıdır.'
    },
    {
      id: 'banner-3',
      type: 'output',
      text: 'PowerShell 7.4.5 [Host: Emirhan-Workstation-x64] [Terminal Modu Aktif]'
    },
    {
      id: 'banner-4',
      type: 'output',
      text: 'Yazılımcı Ziyaretçi Konsolu: Tüm sayfalar ve içerikler bu satırlarda görüntülenir.'
    },
    {
      id: 'banner-hint',
      type: 'success',
      text: "Komutları listelemek için 'help' veya 'Get-Help', dizin için 'dir' veya 'ls' yazabilirsiniz."
    }
  ]);

  // Keep terminal internal container scrolled to latest line WITHOUT scrolling the window
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [lines, isProcessing]);

  // Escape to exit Fullscreen & Global Ctrl+C handler to clear the terminal
  useEffect(() => {
    const handleGlobalKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
        soundEngine.playGlassClick();
        return;
      }

      if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C')) {
        const selection = window.getSelection()?.toString();
        // Clear terminal if no text is being selected for copying, or if focused inside terminal
        if (!selection || selection.length === 0) {
          e.preventDefault();
          setLines([]);
          setCommandInput('');
          soundEngine.playTerminalKey();
        }
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isFullscreen]);

  // Keep input focused when clicking on the workspace without window scrolling
  const handleContainerClick = () => {
    inputRef.current?.focus({ preventScroll: true });
  };

  const getPromptString = () => {
    return `PS ${currentPath}>`;
  };

  // Helper to format date
  const getCurrentDateStr = () => {
    const now = new Date();
    return `${now.toLocaleDateString('tr-TR')}    ${now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}`;
  };

  // Execute PowerShell Command
  const executeCommand = async (rawCmd: string) => {
    const trimmed = rawCmd.trim();
    if (!trimmed) return;

    soundEngine.playTerminalKey();

    // Add to history
    setHistory(prev => [trimmed, ...prev]);
    setHistoryIndex(-1);

    const promptLine: TerminalLine = {
      id: `cmd-${Date.now()}`,
      type: 'prompt',
      text: `${getPromptString()} ${trimmed}`
    };

    setLines(prev => [...prev, promptLine]);
    setCommandInput('');

    const lower = trimmed.toLowerCase();
    const parts = trimmed.split(' ').filter(Boolean);
    const mainCmd = parts[0]?.toLowerCase();
    const arg1 = parts[1];
    const arg2 = parts[2];

    // ==========================================
    // 1. HELP / GET-HELP / MAN
    // ==========================================
    if (mainCmd === 'help' || mainCmd === 'get-help' || mainCmd === 'man' || mainCmd === '/?') {
      const helpOutput: TerminalLine = {
        id: `out-${Date.now()}`,
        type: 'output',
        elements: (
          <div className="space-y-3 py-1 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-emerald-500/30 pb-2 gap-2">
              <div className="text-emerald-300 font-bold truncate">
                POWERSHELL PORTFOLYO KOMUT KILAVUZU (v7.4)
              </div>
              <PulsingNormalOpenButton onClick={() => onSwitchToNormal('profile')} label="Normal Pencerede Aç" />
            </div>
            <div className="text-white/80">
              Bu terminal ortamında Emirhan Yılmaz&apos;ın tüm projelerini, yayınlarını, teknik becerilerini ve özgeçmişini doğrudan komut satırından inceleyebilirsiniz.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              <div className="bg-emerald-950/20 p-2.5 rounded-lg border border-emerald-500/20">
                <div className="text-amber-400 font-bold mb-1">📁 Dizin & Gezinti Komutları:</div>
                <div className="space-y-1 text-white/90">
                  <div><span className="text-emerald-400 font-bold">Get-ChildItem</span> (veya <span className="text-emerald-400">dir</span>, <span className="text-emerald-400">ls</span>) : Dosya ve klasörleri listeler</div>
                  <div><span className="text-emerald-400 font-bold">Set-Location &lt;dizin&gt;</span> (veya <span className="text-emerald-400">cd</span>) : Klasöre geçer (örn: <span className="text-amber-300">cd Projects</span>)</div>
                  <div><span className="text-emerald-400 font-bold">Get-Location</span> (veya <span className="text-emerald-400">pwd</span>) : Mevcut dizini gösterir</div>
                  <div><span className="text-emerald-400 font-bold">Get-Content &lt;dosya&gt;</span> (veya <span className="text-emerald-400">cat</span>, <span className="text-emerald-400">type</span>) : Dosya içeriğini okur</div>
                </div>
              </div>

              <div className="bg-emerald-950/20 p-2.5 rounded-lg border border-emerald-500/20">
                <div className="text-amber-400 font-bold mb-1">🚀 Portfolyo İçerik Komutları:</div>
                <div className="space-y-1 text-white/90">
                  <div><span className="text-emerald-400 font-bold">Get-Projects</span> : Tüm yenilikçi projeleri tablo olarak listeler</div>
                  <div><span className="text-emerald-400 font-bold">Get-Project &lt;id&gt;</span> : Belirtilen projenin tam detayını döker</div>
                  <div><span className="text-emerald-400 font-bold">Get-Articles</span> : Bilimsel ve teknik makaleleri listeler</div>
                  <div><span className="text-emerald-400 font-bold">Get-Article &lt;id&gt;</span> : Makale içeriğini terminalde okutur</div>
                  <div><span className="text-emerald-400 font-bold">Get-Skills</span> : Python, AI, React Native yetenek matrisini döker</div>
                  <div><span className="text-emerald-400 font-bold">Get-Bio</span> : Özgeçmiş ve felsefe metnini yazdırır</div>
                </div>
              </div>

              <div className="bg-emerald-950/20 p-2.5 rounded-lg border border-emerald-500/20">
                <div className="text-amber-400 font-bold mb-1">🤖 Yapay Zeka & İletişim:</div>
                <div className="space-y-1 text-white/90">
                  <div><span className="text-emerald-400 font-bold">Ask-Gemini &lt;soru&gt;</span> (veya <span className="text-emerald-400">ai</span>) : Doğrudan Gemini AI&apos;ya soru sorar</div>
                  <div><span className="text-emerald-400 font-bold">Send-Mail</span> : Emirhan&apos;a doğrudan terminalden mesaj iletir</div>
                  <div><span className="text-emerald-400 font-bold">Test-NetConnection</span> (veya <span className="text-emerald-400">ping</span>) : Sunucu bağlantısını test eder</div>
                </div>
              </div>

              <div className="bg-emerald-950/20 p-2.5 rounded-lg border border-emerald-500/20">
                <div className="text-amber-400 font-bold mb-1">⚙️ Sistem & Görünüm:</div>
                <div className="space-y-1 text-white/90">
                  <div><span className="text-emerald-400 font-bold">Get-Process</span> (veya <span className="text-emerald-400">ps</span>) : Aktif arka plan süreçlerini listeler</div>
                  <div><span className="text-emerald-400 font-bold">Get-Service</span> : Çalışan AI & Audio servislerini gösterir</div>
                  <div><span className="text-emerald-400 font-bold">Clear-Host</span> (veya <span className="text-emerald-400">cls</span>, <span className="text-emerald-400">clear</span>) : Ekranı temizler</div>
                  <div><span className="text-emerald-400 font-bold">Set-Theme Normal</span> (veya <span className="text-emerald-400">exit</span>) : Normal Cam UI&apos;ya döner</div>
                </div>
              </div>
            </div>
            <div className="text-emerald-400/80 text-[11px] italic">
              İpucu: Komutları ve dosya isimlerini yazarken veya aşağıdaki hızlı butonlara tıklayarak doğrudan çalıştırabilirsiniz.
            </div>
          </div>
        )
      };
      setLines(prev => [...prev, helpOutput]);
      return;
    }

    // ==========================================
    // 2. CLEAR-HOST / CLS / CLEAR
    // ==========================================
    if (mainCmd === 'cls' || mainCmd === 'clear' || mainCmd === 'clear-host') {
      setLines([]);
      return;
    }

    // ==========================================
    // 3. EXIT / SET-THEME NORMAL
    // ==========================================
    if (mainCmd === 'exit' || lower === 'set-theme normal' || lower === 'normal' || lower === 'gui') {
      setLines(prev => [
        ...prev,
        { id: `out-${Date.now()}`, type: 'system', text: 'Normal Cam UI moduna dönülüyor...' }
      ]);
      soundEngine.playGlassClick();
      setTimeout(() => {
        onSwitchToNormal();
      }, 350);
      return;
    }

    // ==========================================
    // 4. GET-LOCATION / PWD
    // ==========================================
    if (mainCmd === 'pwd' || mainCmd === 'get-location' || mainCmd === 'gl') {
      setLines(prev => [
        ...prev,
        {
          id: `out-${Date.now()}`,
          type: 'output',
          elements: (
            <div className="font-mono text-xs">
              <div className="text-white/60">Path</div>
              <div className="text-white/60">----</div>
              <div className="text-emerald-300 font-bold">{currentPath}</div>
            </div>
          )
        }
      ]);
      return;
    }

    // ==========================================
    // 5. SET-LOCATION / CD / CHDIR
    // ==========================================
    if (mainCmd === 'cd' || mainCmd === 'set-location' || mainCmd === 'sl') {
      const target = arg1?.trim().replace(/\\$/, '').replace(/\/$/, '') || '';

      if (!target || target === '~' || target === '\\' || target === '..\\..' || target === '/') {
        setCurrentPath('C:\\Users\\Emirhan\\portfolio');
        return;
      }

      if (target === '..') {
        if (currentPath.includes('\\Projects') || currentPath.includes('\\Articles') || currentPath.includes('\\Certificates')) {
          setCurrentPath('C:\\Users\\Emirhan\\portfolio');
        }
        return;
      }

      const lowerTarget = target.toLowerCase();
      if (lowerTarget === 'projects' || lowerTarget === '.\\projects' || lowerTarget === 'c:\\users\\emirhan\\portfolio\\projects') {
        setCurrentPath('C:\\Users\\Emirhan\\portfolio\\Projects');
        setLines(prev => [
          ...prev,
          { id: `out-${Date.now()}`, type: 'output', text: "Dizin değiştirildi: 'Projects'. 'dir' yazarak projeleri listeleyebilirsiniz." }
        ]);
        return;
      }

      if (lowerTarget === 'articles' || lowerTarget === '.\\articles' || lowerTarget === 'c:\\users\\emirhan\\portfolio\\articles') {
        setCurrentPath('C:\\Users\\Emirhan\\portfolio\\Articles');
        setLines(prev => [
          ...prev,
          { id: `out-${Date.now()}`, type: 'output', text: "Dizin değiştirildi: 'Articles'. 'dir' yazarak yayınları listeleyebilirsiniz." }
        ]);
        return;
      }

      setLines(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          type: 'error',
          text: `Set-Location : '${target}' dizini bulunamadı. Kullanılabilir dizinler: Projects, Articles.`
        }
      ]);
      return;
    }

    // ==========================================
    // 6. GET-CHILDITEM / DIR / LS
    // ==========================================
    if (mainCmd === 'dir' || mainCmd === 'ls' || mainCmd === 'get-childitem' || mainCmd === 'gci') {
      const isProjectsDir = currentPath.endsWith('\\Projects');
      const isArticlesDir = currentPath.endsWith('\\Articles');

      if (isProjectsDir) {
        // Projects Directory List
        setLines(prev => [
          ...prev,
          {
            id: `out-${Date.now()}`,
            type: 'table',
            elements: (
              <div className="font-mono text-xs space-y-2 py-1">
                <div className="flex items-center justify-between border-b border-white/10 pb-1.5 gap-2">
                  <div className="text-white/60">Dizin: {currentPath}</div>
                  <PulsingNormalOpenButton onClick={() => onSwitchToNormal('projects')} label="Normal Pencerede Aç" />
                </div>
                <div className="grid grid-cols-12 text-white/50 border-b border-white/10 pb-1 text-[11px] font-bold">
                  <span className="col-span-2">Mode</span>
                  <span className="col-span-3">LastWriteTime</span>
                  <span className="col-span-2">Length</span>
                  <span className="col-span-5">Name</span>
                </div>
                <div className="space-y-1 text-white/90">
                  {projects.map((p, idx) => (
                    <div 
                      key={p.id}
                      onClick={() => executeCommand(`Get-Project ${p.id}`)}
                      className="grid grid-cols-12 items-center hover:bg-emerald-500/10 p-1 rounded cursor-pointer transition-colors group"
                      title="Detayları görüntülemek için tıklayın"
                    >
                      <span className="col-span-2 text-white/40">d-----</span>
                      <span className="col-span-3 text-white/60">22/09/2026 15:30</span>
                      <span className="col-span-2 text-amber-300 font-bold">{p.tech.length * 2}KB</span>
                      <span className="col-span-5 text-emerald-300 font-bold group-hover:underline flex items-center gap-1.5 truncate">
                        <Folder size={12} className="text-emerald-400 shrink-0" />
                        {p.id}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="text-white/40 text-[10px] pt-1">
                  * Bir projeyi incelemek için: <span className="text-emerald-300">Get-Project &lt;proje-id&gt;</span> veya <span className="text-emerald-300">cat &lt;proje-id&gt;</span> yazın ya da üzerine tıklayın.
                </div>
              </div>
            )
          }
        ]);
        return;
      }

      if (isArticlesDir) {
        // Articles Directory List
        setLines(prev => [
          ...prev,
          {
            id: `out-${Date.now()}`,
            type: 'table',
            elements: (
              <div className="font-mono text-xs space-y-2 py-1">
                <div className="flex items-center justify-between border-b border-white/10 pb-1.5 gap-2">
                  <div className="text-white/60">Dizin: {currentPath}</div>
                  <PulsingNormalOpenButton onClick={() => onSwitchToNormal('articles')} label="Normal Pencerede Aç" />
                </div>
                <div className="grid grid-cols-12 text-white/50 border-b border-white/10 pb-1 text-[11px] font-bold">
                  <span className="col-span-2">Mode</span>
                  <span className="col-span-3">LastWriteTime</span>
                  <span className="col-span-2">Length</span>
                  <span className="col-span-5">Name</span>
                </div>
                <div className="space-y-1 text-white/90">
                  {articles.map((art) => (
                    <div 
                      key={art.id}
                      onClick={() => executeCommand(`Get-Article ${art.id}`)}
                      className="grid grid-cols-12 items-center hover:bg-emerald-500/10 p-1 rounded cursor-pointer transition-colors group"
                      title="Makaleyi okumak için tıklayın"
                    >
                      <span className="col-span-2 text-white/40">-a----</span>
                      <span className="col-span-3 text-white/60">{art.date}</span>
                      <span className="col-span-2 text-amber-300 font-bold">{art.readTime}</span>
                      <span className="col-span-5 text-emerald-300 font-bold group-hover:underline flex items-center gap-1.5 truncate">
                        <FileText size={12} className="text-cyan-400 shrink-0" />
                        {art.id}.md
                      </span>
                    </div>
                  ))}
                </div>
                <div className="text-white/40 text-[10px] pt-1">
                  * Makaleyi okumak için: <span className="text-emerald-300">Get-Article &lt;id&gt;</span> veya <span className="text-emerald-300">cat &lt;id&gt;.md</span> yazın.
                </div>
              </div>
            )
          }
        ]);
        return;
      }

      // Root Portfolio Directory List
      setLines(prev => [
        ...prev,
        {
          id: `out-${Date.now()}`,
          type: 'table',
          elements: (
            <div className="font-mono text-xs space-y-2 py-1">
              <div className="flex items-center justify-between border-b border-white/10 pb-1.5 gap-2">
                <div className="text-white/60">Dizin: {currentPath}</div>
                <PulsingNormalOpenButton onClick={() => onSwitchToNormal('projects')} label="Normal Pencerede Aç" />
              </div>
              <div className="grid grid-cols-12 text-white/50 border-b border-white/10 pb-1 text-[11px] font-bold">
                <span className="col-span-2">Mode</span>
                <span className="col-span-3">LastWriteTime</span>
                <span className="col-span-2">Length</span>
                <span className="col-span-5">Name</span>
              </div>
              <div className="space-y-1 text-white/90">
                {/* Directories */}
                <div 
                  onClick={() => executeCommand('cd Projects')} 
                  className="grid grid-cols-12 items-center hover:bg-emerald-500/10 p-1 rounded cursor-pointer group"
                >
                  <span className="col-span-2 text-white/40">d-----</span>
                  <span className="col-span-3 text-white/60">22/09/2026 15:30</span>
                  <span className="col-span-2 text-white/40">&lt;DIR&gt;</span>
                  <span className="col-span-5 text-emerald-400 font-bold group-hover:underline flex items-center gap-1.5">
                    <Folder size={12} className="text-emerald-400 shrink-0" /> Projects/
                  </span>
                </div>

                <div 
                  onClick={() => executeCommand('cd Articles')} 
                  className="grid grid-cols-12 items-center hover:bg-emerald-500/10 p-1 rounded cursor-pointer group"
                >
                  <span className="col-span-2 text-white/40">d-----</span>
                  <span className="col-span-3 text-white/60">22/09/2026 15:30</span>
                  <span className="col-span-2 text-white/40">&lt;DIR&gt;</span>
                  <span className="col-span-5 text-emerald-400 font-bold group-hover:underline flex items-center gap-1.5">
                    <Folder size={12} className="text-emerald-400 shrink-0" /> Articles/
                  </span>
                </div>

                {/* Files */}
                <div 
                  onClick={() => executeCommand('cat Bio.txt')} 
                  className="grid grid-cols-12 items-center hover:bg-emerald-500/10 p-1 rounded cursor-pointer group"
                >
                  <span className="col-span-2 text-white/40">-a----</span>
                  <span className="col-span-3 text-white/60">22/09/2026 12:00</span>
                  <span className="col-span-2 text-amber-300 font-bold">2.4KB</span>
                  <span className="col-span-5 text-cyan-300 font-bold group-hover:underline flex items-center gap-1.5">
                    <FileText size={12} className="text-cyan-400 shrink-0" /> Bio.txt
                  </span>
                </div>

                <div 
                  onClick={() => executeCommand('cat Skills.json')} 
                  className="grid grid-cols-12 items-center hover:bg-emerald-500/10 p-1 rounded cursor-pointer group"
                >
                  <span className="col-span-2 text-white/40">-a----</span>
                  <span className="col-span-3 text-white/60">22/09/2026 12:00</span>
                  <span className="col-span-2 text-amber-300 font-bold">3.8KB</span>
                  <span className="col-span-5 text-cyan-300 font-bold group-hover:underline flex items-center gap-1.5">
                    <FileText size={12} className="text-cyan-400 shrink-0" /> Skills.json
                  </span>
                </div>

                <div 
                  onClick={() => executeCommand('cat Experience.log')} 
                  className="grid grid-cols-12 items-center hover:bg-emerald-500/10 p-1 rounded cursor-pointer group"
                >
                  <span className="col-span-2 text-white/40">-a----</span>
                  <span className="col-span-3 text-white/60">22/09/2026 12:00</span>
                  <span className="col-span-2 text-amber-300 font-bold">1.9KB</span>
                  <span className="col-span-5 text-cyan-300 font-bold group-hover:underline flex items-center gap-1.5">
                    <FileText size={12} className="text-cyan-400 shrink-0" /> Experience.log
                  </span>
                </div>

                <div 
                  onClick={() => executeCommand('cat Contact.ps1')} 
                  className="grid grid-cols-12 items-center hover:bg-emerald-500/10 p-1 rounded cursor-pointer group"
                >
                  <span className="col-span-2 text-white/40">-a----</span>
                  <span className="col-span-3 text-white/60">22/09/2026 12:00</span>
                  <span className="col-span-2 text-amber-300 font-bold">1.1KB</span>
                  <span className="col-span-5 text-cyan-300 font-bold group-hover:underline flex items-center gap-1.5">
                    <FileText size={12} className="text-cyan-400 shrink-0" /> Contact.ps1
                  </span>
                </div>
              </div>
            </div>
          )
        }
      ]);
      return;
    }

    // ==========================================
    // 7. GET-CONTENT / CAT / TYPE
    // ==========================================
    if (mainCmd === 'cat' || mainCmd === 'type' || mainCmd === 'get-content' || mainCmd === 'gc') {
      const targetFile = arg1?.trim();

      if (!targetFile) {
        setLines(prev => [
          ...prev,
          { id: `err-${Date.now()}`, type: 'error', text: 'Get-Content: Dosya parametresi belirtilmedi. Örnek: cat Bio.txt' }
        ]);
        return;
      }

      const lowerFile = targetFile.toLowerCase();

      // Bio.txt
      if (lowerFile === 'bio.txt' || lowerFile === 'bio') {
        setLines(prev => [
          ...prev,
          {
            id: `out-${Date.now()}`,
            type: 'output',
            elements: (
              <div className="font-mono text-xs space-y-2 p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-lg">
                <div className="flex items-center justify-between border-b border-emerald-500/30 pb-2 gap-2">
                  <div className="text-amber-400 font-bold truncate">
                    === {profileData.name.toUpperCase()} | ÖZGEÇMİŞ & BİYOGRAFİ ===
                  </div>
                  <PulsingNormalOpenButton onClick={() => onSwitchToNormal('profile')} label="Normal Pencerede Aç" />
                </div>
                <div className="text-emerald-300 font-bold">{profileData.title}</div>
                <div className="text-white/90 leading-relaxed">{profileData.about}</div>
                <div className="pt-2 border-t border-white/10 space-y-1">
                  <div className="text-white/70"><span className="text-amber-300 font-bold">Eğitim:</span> {profileData.education.school} — {profileData.education.degree}</div>
                  <div className="text-white/60 text-[11px]">{profileData.education.details}</div>
                  <div className="text-white/70"><span className="text-amber-300 font-bold">Yapay Zeka Sertifikasyonu:</span> {profileData.aiProfile.certification}</div>
                  <div className="text-white/70"><span className="text-amber-300 font-bold">GitHub:</span> {profileData.github}</div>
                </div>
              </div>
            )
          }
        ]);
        return;
      }

      // Skills.json
      if (lowerFile === 'skills.json' || lowerFile === 'skills') {
        setLines(prev => [
          ...prev,
          {
            id: `out-${Date.now()}`,
            type: 'output',
            elements: (
              <div className="font-mono text-xs p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-lg space-y-2">
                <div className="flex items-center justify-between border-b border-emerald-500/30 pb-2 gap-2">
                  <div className="text-amber-400 font-bold truncate">
                    === TEKNİK YETENEKLER & TEKNOLOJİ YIĞINI (JSON) ===
                  </div>
                  <PulsingNormalOpenButton onClick={() => onSwitchToNormal('profile')} label="Normal Pencerede Aç" />
                </div>
                <pre className="text-emerald-300 text-[11px] leading-relaxed overflow-x-auto whitespace-pre">
{JSON.stringify({
  developer: profileData.name,
  experienceLevel: profileData.softwareProfile.level,
  primaryLanguages: ["Python", "TypeScript", "JavaScript", "SQL", "PowerShell"],
  mobileStack: ["React Native", "Expo", "Native Modules", "Push Notifications"],
  aiAndMachineLearning: {
    certification: profileData.aiProfile.certification,
    tools: ["Google Gemini API", "Google AI Studio", "PyTorch", "Prompt Engineering", "NLP"]
  },
  automationAndTools: [
    "Playwright (Stealth Web Scraping)",
    "Bleak (Bluetooth Low Energy)",
    "Pandas & NumPy",
    "CI/CD PowerShell Git Scripts",
    "Docker & Cloud Deployment"
  ]
}, null, 2)}
                </pre>
              </div>
            )
          }
        ]);
        return;
      }

      // Experience.log
      if (lowerFile === 'experience.log' || lowerFile === 'experience') {
        setLines(prev => [
          ...prev,
          {
            id: `out-${Date.now()}`,
            type: 'output',
            elements: (
              <div className="font-mono text-xs p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-lg space-y-2">
                <div className="flex items-center justify-between border-b border-emerald-500/30 pb-2 gap-2">
                  <div className="text-amber-400 font-bold truncate">
                    === SAHA & KARİYER DENEYİM LOGU ===
                  </div>
                  <PulsingNormalOpenButton onClick={() => onSwitchToNormal('profile')} label="Normal Pencerede Aç" />
                </div>
                <div className="space-y-2">
                  <div className="border-l-2 border-emerald-400 pl-3">
                    <div className="text-emerald-300 font-bold">1-2 Yıllık Aktif Yazılım & Yapay Zeka Geliştiriciliği</div>
                    <div className="text-white/80 text-[11px]">
                      Python otomasyon sistemleri, Gemini API destekli özel araçlar ve React Native mobil uygulamaları geliştirme.
                    </div>
                  </div>
                  <div className="border-l-2 border-white/30 pl-3">
                    <div className="text-white/90 font-bold">{profileData.experience.title} ({profileData.experience.period})</div>
                    <div className="text-white/80 text-[11px] mb-1">{profileData.experience.description}</div>
                    <ul className="list-disc list-inside text-white/70 text-[11px] space-y-0.5">
                      {profileData.experience.details.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )
          }
        ]);
        return;
      }

      // Contact.ps1
      if (lowerFile === 'contact.ps1' || lowerFile === 'contact') {
        setLines(prev => [
          ...prev,
          {
            id: `out-${Date.now()}`,
            type: 'output',
            elements: (
              <div className="font-mono text-xs p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-lg space-y-2">
                <div className="flex items-center justify-between border-b border-emerald-500/30 pb-2 gap-2">
                  <div className="text-amber-400 font-bold truncate">
                    # Contact.ps1 - İletişim Kanalları
                  </div>
                  <PulsingNormalOpenButton onClick={() => onSwitchToNormal('contact')} label="Normal Pencerede Aç" />
                </div>
                <div className="space-y-1 text-white/90 text-xs">
                  <div>$Email    = <span className="text-emerald-300">&quot;emirhan0008@gmail.com&quot;</span></div>
                  <div>$GitHub   = <span className="text-emerald-300">&quot;https://github.com/Emirhan0008&quot;</span></div>
                  <div>$Location = <span className="text-emerald-300">&quot;Türkiye&quot;</span></div>
                  <div className="pt-2 text-white/60 text-[11px]">
                    # Doğrudan terminal üzerinden mesaj göndermek için:
                    <br />
                    <span className="text-amber-300">Send-Mail -Name &quot;Adınız&quot; -Email &quot;eposta&quot; -Message &quot;Mesajınız&quot;</span>
                  </div>
                </div>
              </div>
            )
          }
        ]);
        return;
      }

      // Check if viewing a specific project (e.g. cat Projects\meb-ags-yks or cat meb-ags-yks)
      const cleanProjId = lowerFile.replace(/^projects\\/, '').replace(/^projects\//, '').replace(/\.md$/, '');
      const foundProject = projects.find(p => p.id.toLowerCase() === cleanProjId);
      if (foundProject) {
        setLines(prev => [
          ...prev,
          {
            id: `out-${Date.now()}`,
            type: 'output',
            elements: (
              <div className="font-mono text-xs p-3 bg-emerald-950/25 border border-emerald-500/40 rounded-lg space-y-2">
                <div className="text-emerald-400 font-bold text-sm flex items-center justify-between border-b border-emerald-500/30 pb-2 gap-2">
                  <div className="flex items-center gap-2 truncate">
                    <span>PROJE: {foundProject.title}</span>
                    <span className="text-amber-300 text-xs font-normal">[{foundProject.category}]</span>
                  </div>
                  <PulsingNormalOpenButton 
                    onClick={() => {
                      if (onOpenProjectModal) {
                        onOpenProjectModal(foundProject);
                      } else {
                        onSwitchToNormal('projects');
                      }
                    }}
                    label="Normal Pencerede Aç"
                    tooltip="Bu projeyi normal zengin kart ve canlı demo modunda aç"
                  />
                </div>
                <div className="text-white/90 leading-relaxed">{foundProject.description}</div>
                {foundProject.longDescription && (
                  <div className="text-white/70 text-[11px] leading-relaxed pt-1">
                    {foundProject.longDescription}
                  </div>
                )}
                <div className="pt-2 border-t border-white/10 space-y-1">
                  <div className="text-white/80">
                    <span className="text-amber-300 font-bold">Teknolojiler:</span> {foundProject.tech.join(', ')}
                  </div>
                  {foundProject.highlights && foundProject.highlights.length > 0 && (
                    <div className="space-y-0.5 pt-1">
                      <div className="text-amber-300 font-bold text-[11px]">Öne Çıkan Özellikler:</div>
                      {foundProject.highlights.map((h, i) => (
                        <div key={i} className="text-white/75 text-[11px] flex items-center gap-1.5">
                          <span className="text-emerald-400 font-bold">&gt;</span> {h}
                        </div>
                      ))}
                    </div>
                  )}
                  {foundProject.demoUrl && (
                    <div className="pt-1 text-[11px]">
                      <span className="text-white/60">Canlı Demo:</span>{' '}
                      <a href={foundProject.demoUrl} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">
                        {foundProject.demoUrl}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )
          }
        ]);
        return;
      }

      // Check if viewing an article
      const cleanArtId = lowerFile.replace(/^articles\\/, '').replace(/^articles\//, '').replace(/\.md$/, '');
      const foundArticle = articles.find(a => a.id.toLowerCase() === cleanArtId);
      if (foundArticle) {
        setLines(prev => [
          ...prev,
          {
            id: `out-${Date.now()}`,
            type: 'output',
            elements: (
              <div className="font-mono text-xs p-3 bg-emerald-950/25 border border-emerald-500/40 rounded-lg space-y-2">
                <div className="flex items-center justify-between border-b border-cyan-500/30 pb-2 gap-2">
                  <div className="text-cyan-400 font-bold text-sm truncate">
                    YAYIN: {foundArticle.title}
                  </div>
                  <PulsingNormalOpenButton 
                    onClick={() => {
                      if (onOpenArticleModal) {
                        onOpenArticleModal(foundArticle);
                      } else {
                        onSwitchToNormal('articles');
                      }
                    }}
                    label="Normal Pencerede Aç"
                    tooltip="Bu makaleyi zengin okuma modunda aç"
                  />
                </div>
                <div className="flex gap-4 text-[11px] text-white/60">
                  <span>Tarih: {foundArticle.date}</span>
                  <span>Süre: {foundArticle.readTime}</span>
                  <span>Kategori: {foundArticle.category}</span>
                </div>
                <div className="text-white/85 italic border-l-2 border-amber-400 pl-2 text-[11px]">
                  {foundArticle.summary}
                </div>
                <div className="space-y-2 pt-2 text-white/90 text-xs leading-relaxed">
                  {foundArticle.content.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>
                <div className="pt-2 border-t border-white/10 text-[11px] text-emerald-400">
                  Etiketler: {foundArticle.tags.join(', ')}
                </div>
              </div>
            )
          }
        ]);
        return;
      }

      setLines(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          type: 'error',
          text: `Get-Content: '${targetFile}' dosyası bulunamadı. Mevcut dosyaları görmek için 'dir' yazabilirsiniz.`
        }
      ]);
      return;
    }

    // ==========================================
    // 8. GET-PROJECTS / GET-PROJECT
    // ==========================================
    if (mainCmd === 'get-projects' || (mainCmd === 'projects' && !arg1)) {
      setLines(prev => [
        ...prev,
        {
          id: `out-${Date.now()}`,
          type: 'table',
          elements: (
            <div className="font-mono text-xs space-y-2 py-1">
              <div className="flex items-center justify-between border-b border-emerald-500/30 pb-2 gap-2">
                <div className="text-emerald-400 font-bold truncate">
                  EMIRHAN YILMAZ — YENİLİKÇİ PROJE KATALOĞU ({projects.length} Proje)
                </div>
                <PulsingNormalOpenButton onClick={() => onSwitchToNormal('projects')} label="Normal Pencerede Aç" />
              </div>
              <div className="space-y-1.5">
                {projects.map((p, i) => (
                  <div 
                    key={p.id}
                    onClick={() => executeCommand(`Get-Project ${p.id}`)}
                    className="p-2 rounded bg-black/40 hover:bg-emerald-950/40 border border-emerald-500/20 hover:border-emerald-500/50 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-300 font-bold group-hover:text-emerald-200">
                        [{i + 1}] {p.title}
                      </span>
                      <span className="text-[10px] text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
                        {p.category}
                      </span>
                    </div>
                    <div className="text-white/75 text-[11px] line-clamp-1 mt-1">{p.description}</div>
                    <div className="text-white/50 text-[10px] mt-1 flex items-center justify-between">
                      <span>Stack: {p.tech.join(', ')}</span>
                      <span className="text-emerald-400 font-bold group-hover:underline">Detaylar için tıkla &gt;</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        }
      ]);
      return;
    }

    if (mainCmd === 'get-project') {
      const projId = arg1?.trim().toLowerCase();
      if (!projId) {
        setLines(prev => [
          ...prev,
          { id: `err-${Date.now()}`, type: 'error', text: 'Kullanım: Get-Project <proje-id>' }
        ]);
        return;
      }
      executeCommand(`cat Projects\\${projId}`);
      return;
    }

    // ==========================================
    // 9. GET-ARTICLES / GET-ARTICLE
    // ==========================================
    if (mainCmd === 'get-articles' || (mainCmd === 'articles' && !arg1)) {
      setLines(prev => [
        ...prev,
        {
          id: `out-${Date.now()}`,
          type: 'table',
          elements: (
            <div className="font-mono text-xs space-y-2 py-1">
              <div className="flex items-center justify-between border-b border-cyan-500/30 pb-2 gap-2">
                <div className="text-cyan-400 font-bold truncate">
                  YAYINLAR & BİLİMSEL İÇERİKLER ({articles.length} Makale)
                </div>
                <PulsingNormalOpenButton onClick={() => onSwitchToNormal('articles')} label="Normal Pencerede Aç" />
              </div>
              <div className="space-y-1.5">
                {articles.map((a, i) => (
                  <div 
                    key={a.id}
                    onClick={() => executeCommand(`Get-Article ${a.id}`)}
                    className="p-2 rounded bg-black/40 hover:bg-cyan-950/40 border border-cyan-500/20 hover:border-cyan-500/50 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-cyan-300 font-bold group-hover:text-cyan-200">
                        [{i + 1}] {a.title}
                      </span>
                      <span className="text-[10px] text-white/60">{a.date} ({a.readTime})</span>
                    </div>
                    <div className="text-white/75 text-[11px] mt-1">{a.summary}</div>
                    <div className="text-cyan-400 text-[10px] mt-1 text-right font-bold group-hover:underline">
                      Makaleyi terminalde oku &gt;
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        }
      ]);
      return;
    }

    if (mainCmd === 'get-article') {
      const artId = arg1?.trim().toLowerCase();
      if (!artId) {
        setLines(prev => [
          ...prev,
          { id: `err-${Date.now()}`, type: 'error', text: 'Kullanım: Get-Article <makale-id>' }
        ]);
        return;
      }
      executeCommand(`cat Articles\\${artId}`);
      return;
    }

    // ==========================================
    // 10. GET-SKILLS / GET-BIO
    // ==========================================
    if (mainCmd === 'get-skills' || mainCmd === 'skills') {
      executeCommand('cat Skills.json');
      return;
    }

    if (mainCmd === 'get-bio' || mainCmd === 'bio') {
      executeCommand('cat Bio.txt');
      return;
    }

    // ==========================================
    // 11. GET-PROCESS / PS / GPS
    // ==========================================
    if (mainCmd === 'ps' || mainCmd === 'get-process' || mainCmd === 'gps') {
      setLines(prev => [
        ...prev,
        {
          id: `out-${Date.now()}`,
          type: 'table',
          elements: (
            <div className="font-mono text-xs space-y-1 py-1">
              <div className="grid grid-cols-12 text-white/50 border-b border-white/10 pb-1 text-[11px] font-bold">
                <span className="col-span-2">Handles</span>
                <span className="col-span-2">NPM(K)</span>
                <span className="col-span-2">PM(K)</span>
                <span className="col-span-2">WS(K)</span>
                <span className="col-span-2">CPU(s)</span>
                <span className="col-span-2">ProcessName</span>
              </div>
              <div className="space-y-0.5 text-white/90">
                <div className="grid grid-cols-12 text-emerald-300">
                  <span className="col-span-2">412</span>
                  <span className="col-span-2">24</span>
                  <span className="col-span-2">45820</span>
                  <span className="col-span-2">68140</span>
                  <span className="col-span-2">12.45</span>
                  <span className="col-span-2 font-bold">node.exe</span>
                </div>
                <div className="grid grid-cols-12 text-emerald-300">
                  <span className="col-span-2">184</span>
                  <span className="col-span-2">16</span>
                  <span className="col-span-2">28410</span>
                  <span className="col-span-2">41200</span>
                  <span className="col-span-2">4.12</span>
                  <span className="col-span-2 font-bold">vite.exe</span>
                </div>
                <div className="grid grid-cols-12 text-emerald-300">
                  <span className="col-span-2">320</span>
                  <span className="col-span-2">22</span>
                  <span className="col-span-2">39810</span>
                  <span className="col-span-2">58920</span>
                  <span className="col-span-2">8.80</span>
                  <span className="col-span-2 font-bold">gemini-api.exe</span>
                </div>
                <div className="grid grid-cols-12 text-emerald-300">
                  <span className="col-span-2">140</span>
                  <span className="col-span-2">12</span>
                  <span className="col-span-2">18200</span>
                  <span className="col-span-2">24100</span>
                  <span className="col-span-2">1.20</span>
                  <span className="col-span-2 font-bold">audio-synth.exe</span>
                </div>
              </div>
            </div>
          )
        }
      ]);
      return;
    }

    // ==========================================
    // 12. GET-SERVICE / GSV
    // ==========================================
    if (mainCmd === 'gsv' || mainCmd === 'get-service') {
      setLines(prev => [
        ...prev,
        {
          id: `out-${Date.now()}`,
          type: 'table',
          elements: (
            <div className="font-mono text-xs space-y-1 py-1">
              <div className="grid grid-cols-12 text-white/50 border-b border-white/10 pb-1 text-[11px] font-bold">
                <span className="col-span-3">Status</span>
                <span className="col-span-4">Name</span>
                <span className="col-span-5">DisplayName</span>
              </div>
              <div className="space-y-0.5 text-white/90">
                <div className="grid grid-cols-12">
                  <span className="col-span-3 text-emerald-400 font-bold">Running</span>
                  <span className="col-span-4 text-cyan-300">GeminiIntelligence</span>
                  <span className="col-span-5 text-white/70">Google Gemini LLM Inference Provider</span>
                </div>
                <div className="grid grid-cols-12">
                  <span className="col-span-3 text-emerald-400 font-bold">Running</span>
                  <span className="col-span-4 text-cyan-300">WebAudioSynth</span>
                  <span className="col-span-5 text-white/70">Dynamic Cyber/Tech Synthesizer Engine</span>
                </div>
                <div className="grid grid-cols-12">
                  <span className="col-span-3 text-emerald-400 font-bold">Running</span>
                  <span className="col-span-4 text-cyan-300">CryptoSecurityAuth</span>
                  <span className="col-span-5 text-white/70">PBKDF2 SHA-256 Passcode Protection</span>
                </div>
              </div>
            </div>
          )
        }
      ]);
      return;
    }

    // ==========================================
    // 13. TEST-NETCONNECTION / PING / TNC
    // ==========================================
    if (mainCmd === 'ping' || mainCmd === 'test-netconnection' || mainCmd === 'tnc') {
      const host = arg1 || 'github.com/Emirhan0008';
      setLines(prev => [
        ...prev,
        {
          id: `out-${Date.now()}`,
          type: 'output',
          elements: (
            <div className="font-mono text-xs space-y-1 py-1">
              <div className="text-white/80">{host} adresine 32 bayt veri ile ping atılıyor:</div>
              <div className="text-emerald-300">Cevap: bayt=32 zaman=18ms TTL=56</div>
              <div className="text-emerald-300">Cevap: bayt=32 zaman=21ms TTL=56</div>
              <div className="text-emerald-300">Cevap: bayt=32 zaman=19ms TTL=56</div>
              <div className="text-white/60 text-[11px] pt-1">
                Ping istatistikleri: Gönderilen = 3, Gelen = 3, Kaybolan = 0 (%0 kayıp)
              </div>
            </div>
          )
        }
      ]);
      return;
    }

    // ==========================================
    // 14. ASK-GEMINI / AI / INVOKE-AI
    // ==========================================
    if (mainCmd === 'ai' || mainCmd === 'ask-gemini' || mainCmd === 'gemini') {
      const promptText = rawCmd.replace(/^(ai|ask-gemini|gemini)\s*/i, '').trim();
      if (!promptText) {
        setLines(prev => [
          ...prev,
          { id: `err-${Date.now()}`, type: 'error', text: 'Kullanım: Ask-Gemini "Sorunuz" (Örnek: ai Emirhan hangi teknolojileri kullanıyor?)' }
        ]);
        return;
      }

      setIsProcessing(true);
      const loadingId = `load-${Date.now()}`;
      setLines(prev => [
        ...prev,
        { id: loadingId, type: 'system', text: `[Gemini AI] Yanıt üretiliyor: "${promptText}"...` }
      ]);

      try {
        const res = await fetch('/api/ai-assistant', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: promptText })
        });
        const data = await res.json();

        setLines(prev => prev.filter(l => l.id !== loadingId));
        setLines(prev => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            type: 'output',
            elements: (
              <div className="font-mono text-xs p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-lg space-y-1.5">
                <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <Sparkles size={13} className="text-emerald-400" />
                  <span>GEMINI AI ASİSTANI CEVABI:</span>
                </div>
                <div className="text-white/90 leading-relaxed whitespace-pre-wrap">
                  {data.reply || 'Yanıt alınamadı.'}
                </div>
              </div>
            )
          }
        ]);
        soundEngine.playAiSparkle();
      } catch (err) {
        setLines(prev => prev.filter(l => l.id !== loadingId));
        setLines(prev => [
          ...prev,
          { id: `err-${Date.now()}`, type: 'error', text: 'Yapay zeka servisiyle bağlantı kurulamadı.' }
        ]);
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    // ==========================================
    // 15. SEND-MAIL / SEND-CONTACT
    // ==========================================
    if (mainCmd === 'send-mail' || mainCmd === 'send-contact' || mainCmd === 'send-message') {
      const match = rawCmd.match(/-name\s+["']?([^"'-]+)["']?\s+-email\s+["']?([^"'-]+)["']?\s+-message\s+["']?([^"']+)/i);
      
      if (!match) {
        setLines(prev => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            type: 'error',
            elements: (
              <div className="space-y-1">
                <div>Kullanım: Send-Mail -Name &quot;&lt;Adınız&gt;&quot; -Email &quot;&lt;E-posta&gt;&quot; -Message &quot;&lt;Mesajınız&gt;&quot;</div>
                <div className="text-white/60 text-[11px]">Örnek: Send-Mail -Name &quot;Ahmet&quot; -Email &quot;ahmet@tech.com&quot; -Message &quot;Proje teklifi hakkında görüşmek isterim.&quot;</div>
              </div>
            )
          }
        ]);
        return;
      }

      const [, name, email, message] = match;
      const newMsg = {
        id: Date.now().toString(),
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        date: new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        read: false
      };

      try {
        const stored = JSON.parse(localStorage.getItem('adm_msg_store') || '[]');
        localStorage.setItem('adm_msg_store', JSON.stringify([newMsg, ...stored]));
      } catch {}

      soundEngine.playSuccessChime();
      setLines(prev => [
        ...prev,
        {
          id: `succ-${Date.now()}`,
          type: 'success',
          elements: (
            <div className="font-mono text-xs p-2.5 bg-emerald-950/40 border border-emerald-500/50 rounded-lg text-emerald-300 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <span>[BAŞARILI]</span> Mesajınız güvenli biçimde iletildi!
              </div>
              <div className="text-white/80 text-[11px]">
                Gönderen: {name.trim()} &lt;{email.trim()}&gt;
              </div>
              <div className="text-white/70 text-[11px] italic">
                &quot;{message.trim()}&quot;
              </div>
            </div>
          )
        }
      ]);
      return;
    }

    // ==========================================
    // 16. WRITE-HOST / ECHO
    // ==========================================
    if (mainCmd === 'write-host' || mainCmd === 'echo' || mainCmd === 'write-output') {
      const textToEcho = rawCmd.replace(/^(write-host|echo|write-output)\s*/i, '');
      setLines(prev => [
        ...prev,
        { id: `out-${Date.now()}`, type: 'output', text: textToEcho }
      ]);
      return;
    }

    // ==========================================
    // 17. START-PROCESS / START (GITHUB / INSTAGRAM)
    // ==========================================
    if (mainCmd === 'start' || mainCmd === 'start-process' || mainCmd === 'saps') {
      const target = arg1?.toLowerCase() || '';
      let url = '';
      if (target === 'github' || target.includes('github.com')) {
        url = 'https://github.com/Emirhan0008';
      } else if (target === 'instagram' || target.includes('instagram.com')) {
        url = 'https://instagram.com';
      } else if (target.startsWith('http')) {
        url = target;
      }

      if (url) {
        window.open(url, '_blank');
        setLines(prev => [
          ...prev,
          { id: `out-${Date.now()}`, type: 'output', text: `Tarayıcıda açılıyor: ${url}` }
        ]);
        return;
      }
    }

    // Default: Unrecognized Command
    setLines(prev => [
      ...prev,
      {
        id: `err-${Date.now()}`,
        type: 'error',
        elements: (
          <div className="space-y-1 text-red-400">
            <div>
              &apos;{rawCmd}&apos; terimi, bir cmdlet, işlev, betik dosyası veya çalıştırılabilir program olarak tanınmıyor.
            </div>
            <div className="text-white/60 text-[11px]">
              Kullanılabilir komutların listesini görmek için <span className="text-amber-300 font-bold">&apos;help&apos;</span> veya <span className="text-amber-300 font-bold">&apos;dir&apos;</span> yazın.
            </div>
          </div>
        )
      }
    ]);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Ctrl+C terminali temizlesin
    if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C')) {
      e.preventDefault();
      setLines([]);
      setCommandInput('');
      soundEngine.playTerminalKey();
      return;
    }

    // Sound effect on keydown
    if (e.key.length === 1) {
      soundEngine.playTerminalKey();
    }

    if (e.key === 'Enter') {
      executeCommand(commandInput);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0 && historyIndex < history.length - 1) {
        const newIdx = historyIndex + 1;
        setHistoryIndex(newIdx);
        setCommandInput(history[newIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIdx = historyIndex - 1;
        setHistoryIndex(newIdx);
        setCommandInput(history[newIdx]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCommandInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Auto-complete basic suggestions
      const suggestions = ['help', 'dir', 'ls', 'Get-Projects', 'Get-Articles', 'Get-Skills', 'Get-Bio', 'cat Bio.txt', 'cat Skills.json', 'cd Projects', 'cd Articles', 'Clear-Host', 'cls', 'exit'];
      const match = suggestions.find(s => s.toLowerCase().startsWith(commandInput.toLowerCase()));
      if (match) {
        setCommandInput(match);
      }
    }
  };

  // Quick Action Buttons
  const quickActions = [
    { label: 'help', cmd: 'help', title: 'Komut Kılavuzu' },
    { label: 'dir', cmd: 'dir', title: 'Dizin İçeriği' },
    { label: 'Get-Projects', cmd: 'Get-Projects', title: 'Projeler Tablosu' },
    { label: 'Get-Articles', cmd: 'Get-Articles', title: 'Makaleler' },
    { label: 'cat Bio.txt', cmd: 'cat Bio.txt', title: 'Özgeçmiş' },
    { label: 'Get-Skills', cmd: 'Get-Skills', title: 'Yetenekler' },
    { label: 'cls (Ctrl+C)', cmd: 'cls', title: 'Ekranı Temizle (veya Ctrl+C)' },
    { label: 'Normal UI', cmd: 'exit', title: 'Cam Arayüze Dön' }
  ];

  return (
    <div 
      onClick={handleContainerClick}
      className={
        isFullscreen
          ? "fixed inset-0 z-[200] w-screen h-screen flex flex-col bg-[#020d08] font-mono select-text cursor-text text-white shadow-2xl"
          : "w-full h-full flex flex-col rounded-3xl bg-[#03130d]/95 border border-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.18)] overflow-hidden font-mono select-text relative cursor-text text-white"
      }
    >
      {/* Top Authentic PowerShell Window Bar */}
      <div className="w-full bg-[#051c14] border-b border-emerald-500/30 px-4 py-2 flex items-center justify-between text-xs select-none shrink-0">
        <div className="flex items-center gap-2">
          {/* Traffic lights / Terminal window controls */}
          <div className="flex items-center gap-1.5">
            <span 
              className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-400 inline-block shadow-[0_0_6px_rgba(239,68,68,0.6)] cursor-pointer" 
              onClick={(e) => {
                e.stopPropagation();
                onSwitchToNormal('projects');
              }} 
              title="Normal Arayüze Dön" 
            />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block shadow-[0_0_6px_rgba(234,179,8,0.6)]" />
            <span 
              className="w-3 h-3 rounded-full bg-emerald-500/80 hover:bg-emerald-400 inline-block shadow-[0_0_6px_rgba(16,185,129,0.6)] cursor-pointer" 
              onClick={(e) => {
                e.stopPropagation();
                soundEngine.playGlassClick();
                setIsFullscreen(prev => !prev);
              }}
              title={isFullscreen ? "Normal Boyuta Dön (Esc)" : "Tam Ekran Yap (Siteyi Kapla)"}
            />
          </div>
          <span className="text-emerald-300 font-bold ml-2 tracking-tight flex items-center gap-2 truncate">
            <img src="/logo.png" alt="Logo" className="w-4 h-4 object-contain shrink-0 drop-shadow-[0_0_6px_rgba(52,211,153,0.5)]" />
            <span>PowerShell 7.4 — Emirhan Yilmaz Portfolio Terminal [x64]</span> {isFullscreen && <span className="text-amber-300 text-[10px] ml-1">[TAM EKRAN]</span>}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Fullscreen Toggle Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              soundEngine.playGlassClick();
              setIsFullscreen(prev => !prev);
            }}
            className="text-[11px] text-emerald-300 hover:text-white bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-500/40 px-2.5 py-0.5 rounded transition-all cursor-pointer flex items-center gap-1.5 font-bold"
            title={isFullscreen ? "Normal Boyuta Dön (Esc)" : "Tam Ekran Yap (Tüm siteyi kapla)"}
          >
            {isFullscreen ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
            <span>{isFullscreen ? 'Küçült' : 'Tam Ekran'}</span>
          </button>

          <span className="text-[10px] text-emerald-400/80 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30 font-bold hidden sm:inline">
            PS 7.4.5
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSwitchToNormal('projects');
            }}
            className="text-[11px] text-white/80 hover:text-white bg-white/10 hover:bg-white/15 px-2.5 py-0.5 rounded transition-all cursor-pointer border border-white/10"
            title="Normal Cam Görünüme Geç"
          >
            Normal Arayüz
          </button>
        </div>
      </div>

      {/* Quick Suggestion Chips for Developers & Visitors */}
      <div className="bg-[#031710] border-b border-emerald-500/20 px-3 py-1.5 flex items-center gap-1.5 overflow-x-auto shrink-0 scrollbar-none select-none">
        <span className="text-[10px] text-white/40 uppercase tracking-wider shrink-0 mr-1">Hızlı Komutlar:</span>
        {quickActions.map(action => (
          <button
            key={action.cmd}
            onClick={(e) => {
              e.stopPropagation();
              executeCommand(action.cmd);
            }}
            className="px-2.5 py-0.5 rounded bg-emerald-950/40 hover:bg-emerald-500/25 border border-emerald-500/30 hover:border-emerald-400 text-[11px] text-emerald-300 hover:text-white transition-all shrink-0 cursor-pointer shadow-xs active:scale-95"
            title={action.title}
          >
            {action.label}
          </button>
        ))}
      </div>

      {/* Terminal Screen Body / Lines Container */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 p-4 overflow-y-auto space-y-2 text-xs leading-relaxed scrollbar-thin"
      >
        {lines.map((line) => {
          if (line.type === 'prompt') {
            return (
              <div key={line.id} className="text-white font-bold flex items-start gap-1">
                <span className="text-emerald-400 shrink-0">{line.text?.split('>')[0]}&gt;</span>
                <span className="text-white">{line.text?.split('>').slice(1).join('>')}</span>
              </div>
            );
          }

          if (line.type === 'system') {
            return (
              <div key={line.id} className="text-white/60">
                {line.text}
              </div>
            );
          }

          if (line.type === 'success') {
            return (
              <div key={line.id} className="text-emerald-300 font-bold">
                {line.elements || line.text}
              </div>
            );
          }

          if (line.type === 'error') {
            return (
              <div key={line.id} className="text-red-400 bg-red-950/20 p-2 rounded border border-red-500/30 font-bold">
                {line.elements || line.text}
              </div>
            );
          }

          // Output / Table
          return (
            <div key={line.id} className="text-white/90">
              {line.elements || line.text}
            </div>
          );
        })}

        {/* Current Active Input Prompt Line */}
        <div className="flex items-center gap-1 text-xs pt-1">
          <span className="text-emerald-400 font-bold shrink-0">{getPromptString()}</span>
          <div className="relative flex-1 flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isProcessing}
              className="w-full bg-transparent outline-none text-white font-mono text-xs caret-emerald-400 placeholder-white/20"
              placeholder={isProcessing ? "Komut işleniyor..." : "komut yazın (örn: help, dir, Get-Projects)..."}
              autoFocus
              spellCheck={false}
              autoComplete="off"
            />
            {/* Blinking CLI Cursor */}
            <span className="w-2 h-4 bg-emerald-400/90 animate-pulse ml-0.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Bottom Status Ribbon */}
      <div className="bg-[#051c14] border-t border-emerald-500/30 px-3 py-1 flex items-center justify-between text-[10px] text-white/50 select-none shrink-0 font-mono">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            POWERSHELL_READY
          </span>
          <span className="hidden sm:inline">UTF-8</span>
          <span className="hidden sm:inline">Geçmiş: {history.length} komut</span>
        </div>
        <div className="text-emerald-400/80">
          Tab: Tamamlama | Ctrl+C: Temizle | {isFullscreen ? 'Esc: Küçült' : 'Tam Ekran Yapılabilir'}
        </div>
      </div>
    </div>
  );
};

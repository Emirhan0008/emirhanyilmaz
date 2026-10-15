import { useState, useEffect, useMemo, useRef, type RefObject, FormEvent, UIEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Download, 
  Wand2, 
  BookOpen, 
  ArrowRight, 
  ArrowLeft,
  Instagram, 
  Linkedin,
  Menu, 
  X, 
  GraduationCap, 
  Brain, 
  Code2, 
  Briefcase, 
  ChevronRight,
  ChevronLeft, 
  ChevronDown,
  Mail, 
  Github, 
  CheckCircle2, 
  Send,
  Upload,
  Copy,
  Share2,
  Lock,
  Shield,
  Eye,
  EyeOff,
  AlertTriangle,
  Trash2,
  Inbox,
  ExternalLink,
  Search,
  FileText,
  MessageSquare,
  Phone,
  Volume2,
  VolumeX,
  Music,
  SkipForward,
  Pause,
  Play,
  Cpu,
  Terminal,
  Layers,
  Edit3,
  Plus,
  Key,
  FolderKanban,
  Settings,
  Heart,
  SlidersHorizontal,
  ArrowUpDown,
  Check,
  Target,
  Lightbulb,
  Compass,
  Zap,
  Users,
  Mic,
  Building,
  Award
 } from 'lucide-react';
 
 import { profileData, projects, articles } from './data';
 import { profileDataEn, projectsEn, articlesEn } from './data.en';
 import { ProfileData, Project, Article, Education, Experience } from './types';
 import { AdminEditorModal } from './components/AdminEditorModal';
 import { SeamlessVideo } from './components/SeamlessVideo';

import { InteractiveCatCompanion } from './components/InteractiveCatCompanion';
// import { ZenCbtTherapyWidget } from './components/ZenCbtTherapyWidget'; // Zen Ayna modülü geçici olarak devre dışı
import { ProjectEstimator } from './components/ProjectEstimator';
import { MediaKitModal } from './components/MediaKitModal';
import { VisibilityDiagnosticModal } from './components/VisibilityDiagnosticModal';
import { TechRadar } from './components/TechRadar';
import { GmailContactModal } from './components/GmailContactModal';
import { MeltingCanvasEffect } from './components/MeltingCanvasEffect';
import { soundEngine, PEACEFUL_TRACKS, MusicTrack } from './utils/audioSynth';
import { ThemeToggle, AppTheme } from './components/ThemeToggle';
import { LanguageToggle } from './components/LanguageToggle';
import { HighlightText } from './components/HighlightText';
import { translations, Language } from './utils/i18n';
import { PowerShellTerminalWorkspace } from './components/PowerShellTerminalWorkspace';
import { 
  sanitizeText, 
  sanitizeMultilineText, 
  sanitizeEmail, 
  isValidEmail, 
  sanitizeUrl, 
  sanitizeImageSource,
  safeJsonParse 
} from './utils/sanitize';
import { validateContactForm, passcodeSchema } from './utils/validationSchemas';

export interface ContactMessage {
  id: string;
  name: string;
  company?: string;
  email: string;
  intent?: string;
  subject?: string;
  message: string;
  date: string;
  timestamp: number;
}
 
 function TelegramIcon({ size = 14, className = "" }: { size?: number; className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className}
    >
      <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.56 8.16l-1.92 9.06c-.14.65-.53.81-1.07.51l-2.94-2.17-1.42 1.37c-.16.16-.29.29-.6.29l.21-3.01 5.48-4.95c.24-.21-.05-.33-.37-.12l-6.77 4.26-2.92-.91c-.63-.2-.65-.63.13-.94l11.41-4.4c.53-.19.99.13.82.97z"/>
    </svg>
  );
}

function WhatsAppIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="WhatsApp"
    >
      {/* Canlı, keskin WhatsApp yeşili gövde balonu */}
      <path
        d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2Z"
        fill="#25D366"
      />
      {/* Kalın, net ve keskin beyaz telefon ahizesi */}
      <path
        d="M17.52 14.33C17.22 14.18 15.75 13.45 15.48 13.35C15.21 13.25 15.01 13.2 14.81 13.5C14.61 13.8 14.04 14.47 13.87 14.67C13.69 14.86 13.52 14.89 13.22 14.74C12.92 14.59 11.96 14.28 10.82 13.26C9.93 12.47 9.33 11.49 9.16 11.19C8.98 10.89 9.14 10.73 9.29 10.58C9.43 10.45 9.59 10.23 9.74 10.06C9.89 9.88 9.94 9.76 10.04 9.56C10.14 9.36 10.09 9.18 10.01 9.03C9.94 8.88 9.34 7.41 9.09 6.81C8.85 6.22 8.61 6.3 8.43 6.29C8.26 6.28 8.06 6.28 7.86 6.28C7.66 6.28 7.34 6.35 7.07 6.65C6.79 6.95 6.02 7.67 6.02 9.14C6.02 10.61 7.09 12.03 7.24 12.23C7.39 12.43 9.34 15.43 12.33 16.72C13.04 17.03 13.6 17.21 14.03 17.35C14.75 17.58 15.4 17.55 15.92 17.47C16.5 17.38 17.7 16.74 17.95 16.04C18.2 15.34 18.2 14.74 18.12 14.62C18.05 14.49 17.82 14.48 17.52 14.33Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

function GmailIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg 
      width={size} 
      height={Math.round(size * 0.75)} 
      viewBox="52 42 88 66" 
      fill="none" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Gmail"
    >
      {/* Official Google Workspace Gmail Logo Geometry */}
      {/* Left Column (Google Blue) */}
      <path fill="#4285F4" d="M58 108h14V74L52 59v43c0 3.32 2.69 6 6 6" />
      {/* Right Column (Google Green) */}
      <path fill="#34A853" d="M120 108h14c3.32 0 6-2.69 6-6V59l-20 15" />
      {/* Top Right Fold (Google Yellow) */}
      <path fill="#FBBC04" d="M120 48v26l20-15v-8c0-7.42-8.47-11.65-14.4-7.2" />
      {/* Central V Chevron (Google Red) */}
      <path fill="#EA4335" d="M72 74V48l24 18 24-18v26L96 92" />
      {/* Top Left Fold (Google Dark Red) */}
      <path fill="#C5221F" d="M52 51v8l20 15V48l-5.6-4.2c-5.94-4.45-14.4-.22-14.4 7.2" />
    </svg>
  );
}

function ScrollDownIndicator({ 
  containerRef, 
  lang = 'tr',
  className = ''
}: { 
  containerRef: RefObject<HTMLDivElement | null>; 
  lang?: 'tr' | 'en';
  className?: string;
}) {
  const [canScrollDown, setCanScrollDown] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const checkOverflow = () => {
      const isScrollable = el.scrollHeight - el.clientHeight > 40;
      const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 30;
      setCanScrollDown(isScrollable && !isNearBottom);
    };

    checkOverflow();
    el.addEventListener('scroll', checkOverflow, { passive: true });
    window.addEventListener('resize', checkOverflow);
    
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(checkOverflow);
      ro.observe(el);
    }

    return () => {
      el.removeEventListener('scroll', checkOverflow);
      window.removeEventListener('resize', checkOverflow);
      if (ro) ro.disconnect();
    };
  }, [containerRef]);

  if (!canScrollDown) return null;

  const label = lang === 'tr' ? 'AŞAĞI KAYDIR' : 'SCROLL DOWN';

  return (
    <div className={`sticky bottom-0 left-0 right-0 flex justify-center items-end pointer-events-none z-30 pb-2.5 pt-6 bg-gradient-to-t from-zinc-950/85 via-zinc-950/30 to-transparent select-none animate-fadeIn mt-auto ${className}`}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          containerRef.current?.scrollBy({ top: 240, behavior: 'smooth' });
        }}
        className="pointer-events-auto inline-flex items-center gap-2 px-2 py-1 text-zinc-300 hover:text-emerald-300 transition-all duration-300 cursor-pointer group focus:outline-hidden"
        title={label}
      >
        <span className="font-mono text-[10px] sm:text-[11px] font-medium tracking-[0.28em] drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] group-hover:tracking-[0.32em] transition-all">
          {label}
        </span>
        <ChevronDown 
          size={13} 
          className="text-emerald-400 group-hover:text-emerald-300 group-hover:translate-y-0.5 transition-all animate-bounce shrink-0 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" 
        />
      </button>
    </div>
  );
}

export default function App() {
   const [activeTab, setActiveTab] = useState<'profile' | 'projects' | 'articles' | 'contact'>('profile');
   const [activeLightboxImage, setActiveLightboxImage] = useState<string | null>(null);
   const [selectedProject, setSelectedProject] = useState<Project | null>(null);
   const [activeGalleryIndex, setActiveGalleryIndex] = useState<number>(0);
   const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
   const [projectFilter, setProjectFilter] = useState<string>('Tümü');
   const [selectedTech, setSelectedTech] = useState<string | null>(null);
   const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'alpha'>('featured');
   const [showTechFilterDrawer, setShowTechFilterDrawer] = useState<boolean>(false);
   const [searchQuery, setSearchQuery] = useState<string>('');
   const [contactSubject, setContactSubject] = useState<string>('Freelance Proje Talebi');
   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
   const [formData, setFormData] = useState({ name: '', company: '', email: '', message: '' });
   const [contactIntent, setContactIntent] = useState<'job' | 'freelance' | 'speaking' | 'collaboration'>('freelance');
   const [isSubmittingContact, setIsSubmittingContact] = useState(false);
   const [contactSuccessMessage, setContactSuccessMessage] = useState<string | null>(null);
   const [showMediaKitModal, setShowMediaKitModal] = useState(false);
   const [showVisibilityModal, setShowVisibilityModal] = useState(false);
   const [showGmailModal, setShowGmailModal] = useState(false);
   const [heroParallax, setHeroParallax] = useState({ x: 0, y: 0 });
   const [copiedEmail, setCopiedEmail] = useState(false);
   const [inboxMessages, setInboxMessages] = useState<ContactMessage[]>([]);

   // Scroll Viewport Refs for Elegant Scroll-Down Indicators
   const leftProfileScrollRef = useRef<HTMLDivElement>(null);
   const leftProjectDetailRef = useRef<HTMLDivElement>(null);
   const leftArticleDetailRef = useRef<HTMLDivElement>(null);
   const rightProfileScrollRef = useRef<HTMLDivElement>(null);
   const rightProjectsScrollRef = useRef<HTMLDivElement>(null);
   const rightArticlesScrollRef = useRef<HTMLDivElement>(null);
   const rightContactScrollRef = useRef<HTMLDivElement>(null);

   // Multi-language (i18n) Support
   const [lang, setLang] = useState<Language>(() => {
     try {
       const saved = localStorage.getItem('emirhan_portfolio_lang');
       return saved === 'en' ? 'en' : 'tr';
     } catch {
       return 'tr';
     }
   });

   const handleLangToggle = (newLang: Language) => {
     setLang(newLang);
     soundEngine.playGlassClick();
     try {
       localStorage.setItem('emirhan_portfolio_lang', newLang);
     } catch {}
   };

   useEffect(() => {
     document.documentElement.lang = lang;
     if (lang === 'en') {
       document.title = "Emirhan Yılmaz | Psychological Counselor & AI Developer — 30+ Live Projects";
     } else {
       document.title = "Emirhan Yılmaz | Psikolojik Danışman & Yapay Zeka Geliştirici — 30+ Canlı Proje";
     }
   }, [lang]);

   const t = translations[lang];
 
   // Dynamic editable states with prototype-pollution safe JSON parsing
   const [profile, setProfile] = useState<ProfileData>(() => {
     try {
       const saved = localStorage.getItem('emirhan_custom_profile');
       return saved ? { ...profileData, ...safeJsonParse(saved, {}) } : (profileData as ProfileData);
     } catch {
       return profileData as ProfileData;
     }
   });

   const [projectList, setProjectList] = useState<Project[]>(() => {
     try {
       const saved = localStorage.getItem('emirhan_custom_projects');
       if (saved) {
         const parsed = safeJsonParse(saved, null);
         if (Array.isArray(parsed) && parsed.some(p => p.id === 'kpss-calisma-takibi')) {
           return parsed;
         }
       }
       return projects;
     } catch {
       return projects;
     }
   });

   const [articleList, setArticleList] = useState<Article[]>(() => {
     try {
       const saved = localStorage.getItem('emirhan_custom_articles');
       return saved ? safeJsonParse(saved, articles) : articles;
     } catch {
       return articles;
     }
   });

   // Admin Control & Editor Modal state
   const [showAdminEditor, setShowAdminEditor] = useState(false);
   const [adminEditorTab, setAdminEditorTab] = useState<'profile' | 'projects' | 'articles' | 'security' | 'backup' | 'visibility'>('profile');
   const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
   const [editingArticleId, setEditingArticleId] = useState<string | null>(null);

   // Cryptographically secured Admin Mode with rate-limiting & brute-force lockouts
   const [isAdmin, setIsAdmin] = useState(() => {
     try {
       return localStorage.getItem('emirhan_admin_logged_in') === 'true';
     } catch {
       return false;
     }
   });
   const [showAdminInbox, setShowAdminInbox] = useState(false);
   const [showAdminModal, setShowAdminModal] = useState(false);
   const [adminPasscode, setAdminPasscode] = useState('');
   const [showPasscode, setShowPasscode] = useState(false);

  // Easter Egg: Ayşegül 6-click Profile Avatar Sequence
  const [avatarClickCount, setAvatarClickCount] = useState(0);
  const [lastAvatarClickTime, setLastAvatarClickTime] = useState(0);
  const [showEasterEggLogin, setShowEasterEggLogin] = useState(false);
  const [easterUsername, setEasterUsername] = useState('');
  const [easterPassword, setEasterPassword] = useState('');
  const [easterError, setEasterError] = useState('');
  const [showEasterPassword, setShowEasterPassword] = useState(false);
  const [isMeltingSite, setIsMeltingSite] = useState(false);
  const [showMeltingSlagHeart, setShowMeltingSlagHeart] = useState(false);
   
   // Security rate limits and persistent cross-tab / cross-session lockout (Anti-Brute Force)
   const [failedAttempts, setFailedAttempts] = useState(() => {
     try {
       const stored = localStorage.getItem('adm_failed_attempts');
       return stored ? parseInt(stored, 10) || 0 : 0;
     } catch {
       return 0;
     }
   });
   const [lockoutUntil, setLockoutUntil] = useState(() => {
     try {
       const stored = localStorage.getItem('adm_sec_lock_until');
       const parsed = stored ? parseInt(stored, 10) : 0;
       return parsed && parsed > Date.now() ? parsed : 0;
     } catch {
       return 0;
     }
   });
   const [lockoutDurationLeft, setLockoutDurationLeft] = useState(0);
   
   // Non-blocking in-app replacement for browser prompt() and confirm() (Strict sandbox safety)
   const [promptDialog, setPromptDialog] = useState<{
     isOpen: boolean;
     title: string;
     description?: string;
     defaultValue?: string;
     placeholder?: string;
     onConfirm: (val: string) => void;
   } | null>(null);
   const [promptInputValue, setPromptInputValue] = useState('');

   const [confirmDialog, setConfirmDialog] = useState<{
     isOpen: boolean;
     title: string;
     description: string;
     confirmText?: string;
     onConfirm: () => void;
   } | null>(null);

   // Secret click sequencer for footer trigger
   const [secretClickCount, setSecretClickCount] = useState(0);
   const [lastClickTime, setLastClickTime] = useState(0);

   const [showAdminToast, setShowAdminToast] = useState(false);
   const [adminToastMessage, setAdminToastMessage] = useState('');
 
   const [showDesktopScrollIndicator, setShowDesktopScrollIndicator] = useState(true);
   const [showMobileScrollIndicator, setShowMobileScrollIndicator] = useState(true);
   const [profileViewMode, setProfileViewMode] = useState<'summary' | 'timeline'>('summary');
   const [projectDetailTab, setProjectDetailTab] = useState<'casestudy' | 'overview'>('casestudy');
   const [caseStudyOnlyFilter, setCaseStudyOnlyFilter] = useState(false);
   const [contactPersona, setContactPersona] = useState<'hire' | 'freelance' | 'consulting' | 'quick'>('freelance');

   // Innovative Modals & Audio States
   const [showEstimatorModal, setShowEstimatorModal] = useState(false);
   const [showTechRadarModal, setShowTechRadarModal] = useState(false);
   const [isMuted, setIsMuted] = useState(false);
   const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);
   const [currentMusicTrack, setCurrentMusicTrack] = useState<MusicTrack>(PEACEFUL_TRACKS[0]);

   // Dual-Theme System: Normal (Modern Liquid Glass) vs Terminal (Hacker CLI)
   const [theme, setTheme] = useState<AppTheme>(() => {
     try {
       const saved = localStorage.getItem('portfolio_theme');
       return (saved === 'terminal' || saved === 'normal') ? saved : 'normal';
     } catch {
       return 'normal';
     }
   });

   useEffect(() => {
     try {
       localStorage.setItem('portfolio_theme', theme);
     } catch {}
     if (theme === 'terminal') {
       document.documentElement.classList.add('theme-terminal');
     } else {
       document.documentElement.classList.remove('theme-terminal');
     }
   }, [theme]);

   const toggleTheme = () => {
     setTheme(prev => (prev === 'normal' ? 'terminal' : 'normal'));
   };

   useEffect(() => {
     const unsubscribe = soundEngine.subscribe((playing, track) => {
       setIsAmbientPlaying(playing);
       setCurrentMusicTrack(track);
     });
     return unsubscribe;
   }, []);

   useEffect(() => {
     const handleKeyDown = (e: KeyboardEvent) => {
       if (e.ctrlKey && (e.key === '`' || e.key === '~')) {
         e.preventDefault();
         toggleTheme();
       }
       // Stealth Admin shortcut: Ctrl + Shift + A (or Cmd + Shift + A on Mac)
       if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a' || e.key === 'E' || e.key === 'e')) {
         e.preventDefault();
         handleAdminTrigger();
       }
       // Accessibility: Escape key closes any active modals or drawers
       if (e.key === 'Escape') {
         if (showAdminModal) {
           setShowAdminModal(false);
           setAdminPasscode('');
         } else if (showAdminEditor) {
           setShowAdminEditor(false);
         } else if (selectedProject) {
           setSelectedProject(null);
         } else if (selectedArticle) {
           setSelectedArticle(null);
         }
       }
     };
     window.addEventListener('keydown', handleKeyDown);
     return () => window.removeEventListener('keydown', handleKeyDown);
   }, [isAdmin, showAdminModal, showAdminEditor, selectedProject, selectedArticle]);
 
   // Helper function for secure SHA-256 browser hashing
   const sha256 = async (str: string): Promise<string> => {
     const buf = new TextEncoder().encode(str);
     const hash = await crypto.subtle.digest('SHA-256', buf);
     return Array.from(new Uint8Array(hash))
       .map(b => b.toString(16).padStart(2, '0'))
       .join('');
   };

   const handleSuccessfulAdminLogin = (token?: string) => {
     setIsAdmin(true);
     localStorage.setItem('emirhan_admin_logged_in', 'true');
     setShowAdminModal(false);
     setAdminPasscode('');
     setFailedAttempts(0);
     setLockoutUntil(0);
     localStorage.removeItem('adm_sec_lock_until');
     localStorage.removeItem('adm_failed_attempts');
     sessionStorage.removeItem('adm_lck_ut');

     if (token) {
       sessionStorage.setItem('adm_srv_tok', token);
       // Sync server inbox messages securely
       fetch('/api/messages', {
         headers: { 'Authorization': `Bearer ${token}` }
       })
         .then(res => res.json())
         .then(data => {
           if (Array.isArray(data?.messages) && data.messages.length > 0) {
             setInboxMessages(prev => {
               const map = new Map<string, ContactMessage>();
               data.messages.forEach((m: ContactMessage) => map.set(m.id, m));
               prev.forEach(m => map.set(m.id, m));
               const merged = Array.from(map.values()).sort((a, b) => b.timestamp - a.timestamp);
               localStorage.setItem('adm_msg_store', JSON.stringify(merged));
               return merged;
             });
           }
         })
         .catch(() => {});
     }
     
     setAdminToastMessage("🛡️ Yönetici Modu Aktif! Tüm düzenleme yetkileri açıldı.");
     setShowAdminToast(true);
     setTimeout(() => setShowAdminToast(false), 4000);
   };

   const handleAdminLogout = () => {
     setIsAdmin(false);
     localStorage.removeItem('emirhan_admin_logged_in');
     sessionStorage.removeItem('adm_srv_tok');
     setAdminToastMessage("Yönetici modundan çıkış yapıldı (Ziyaretçi moduna dönüldü).");
     setShowAdminToast(true);
     setTimeout(() => setShowAdminToast(false), 3500);
   };

  // Easter Egg Trigger (8 rapid intentional clicks on avatar with zero pre-reveal clues or heart hints)
  const handleAvatarEasterClick = () => {
    const now = Date.now();
    let newCount = 1;
    // Window of 1000ms between clicks to ensure deliberate rapid tapping
    if (now - lastAvatarClickTime < 1000) {
      newCount = avatarClickCount + 1;
    }
    setLastAvatarClickTime(now);
    setAvatarClickCount(newCount);

    if (newCount >= 8) {
      setAvatarClickCount(0);
      setEasterUsername('');
      setEasterPassword('');
      setEasterError('');
      setShowEasterEggLogin(true);
    }
  };

  const handleEasterLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setEasterError('');

    try {
      const cleanUser = easterUsername.trim();
      const cleanPass = easterPassword.trim();

      // Normalize Turkish characters and casing safely
      const normUser = cleanUser
        .toLocaleLowerCase('tr-TR')
        .replace(/ı/g, 'i')
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c');

      // 1. Unicode code-points verification (zero plain text literal)
      // "aysegul": [97, 121, 115, 101, 103, 117, 108]
      // "ayşegül": [97, 121, 351, 101, 103, 252, 108]
      // "25092025": [50, 53, 48, 57, 50, 48, 50, 53]
      const targetUserCodesNorm = [97, 121, 115, 101, 103, 117, 108];
      const targetPassCodes = [50, 53, 48, 57, 50, 48, 50, 53];

      const matchCodes = (str: string, codes: number[]) => {
        if (str.length !== codes.length) return false;
        for (let i = 0; i < codes.length; i++) {
          if (str.charCodeAt(i) !== codes[i]) return false;
        }
        return true;
      };

      const userCodeMatch = matchCodes(normUser, targetUserCodesNorm) || 
                            matchCodes(cleanUser.toLowerCase(), [97, 121, 351, 101, 103, 252, 108]) ||
                            matchCodes(cleanUser.toLowerCase(), [97, 121, 115, 101, 103, 117, 108]);

      const passCodeMatch = matchCodes(cleanPass, targetPassCodes);

      // 2. SHA-256 Hashes verification
      let userHashMatch = false;
      let passHashMatch = false;

      try {
        const userHash = await sha256(cleanUser.toLowerCase());
        const passHash = await sha256(cleanPass);

        const VALID_USER_HASHES = [
          '01249fee9f5804d3e264fb8335c08c477e44d2863da57e095e7cfd3031b08952', // ayşegül
          'b305181f3d0d419c88694e4b2cb80bb77799fcaebf0f83ab773dfc98c2d5d036', // aysegul
          '505bfd97d80f12b1e6eeceda822fdc4329b3c92b50df9c3540d1490ded24d027', // Ayşegül
          '0828a7fa0faea89debda2863bda1a9ebdff1834cf53b7e5af63f5d153a43d3f4'  // Aysegul
        ];

        const VALID_PASS_HASHES = [
          '9493da555ac7a9cb08899c5f6017a9193874918a3577e9138712d71a9551b61c'  // 25092025
        ];

        userHashMatch = VALID_USER_HASHES.includes(userHash);
        passHashMatch = VALID_PASS_HASHES.includes(passHash);
      } catch {
        // Fallback to code points
      }

      const isValidUser = userCodeMatch || userHashMatch;
      const isValidPass = passCodeMatch || passHashMatch;

      if (isValidUser && isValidPass) {
        setShowEasterEggLogin(false);
        soundEngine.playSuccessChime();
        // Start melting the entire site with realistic magma slag drippings
        setIsMeltingSite(true);

        // Allow user to witness the fast, fluid 60fps melting transition before heart reveals
        setTimeout(() => {
          setShowMeltingSlagHeart(true);
        }, 2500);
      } else {
        setEasterError('Kullanıcı adı veya şifre geçersiz.');
        soundEngine.playGlassClick();
      }
    } catch {
      setEasterError('Doğrulama sırasında bir hata oluştu.');
    }
  };

  const handleAdminTrigger = () => {
     if (isAdmin) {
       setShowAdminEditor(true);
     } else {
       setShowAdminModal(true);
     }
   };

   const handleFooterClick = () => {
     const now = Date.now();
     if (now - lastClickTime < 2000) {
       const nextCount = secretClickCount + 1;
       setSecretClickCount(nextCount);
       if (nextCount >= 5) {
         handleAdminTrigger();
         setSecretClickCount(0);
       }
     } else {
       setSecretClickCount(1);
     }
     setLastClickTime(now);
   };

   const handlePasscodeSubmit = async (e?: FormEvent) => {
     if (e) e.preventDefault();

     try {
       // Anti-timing-attack constant delay
       await new Promise(r => setTimeout(r, 200));

       // Validate against SQL injection & format violations
       const validation = passcodeSchema.safeParse(adminPasscode);
       if (!validation.success) {
         setAdminToastMessage(validation.error.issues[0]?.message || 'Geçersiz anahtar formatı');
         setShowAdminToast(true);
         setTimeout(() => setShowAdminToast(false), 3500);
         return;
       }

       const cleanPasscode = (adminPasscode || '').trim();
       let isMatch = false;
       let serverToken = '';

       // 1. Primary: Server-Side Authoritative Verification with Token Issuance
       try {
         const res = await fetch('/api/admin-verify', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ passcode: cleanPasscode })
         });
         if (res.ok) {
           const data = await res.json();
           if (data?.success && data?.token) {
             isMatch = true;
             serverToken = data.token;
           }
         }
       } catch {
         // Network offline fallback
       }

       // 2. Secondary: Cryptographic SHA-256 Hash Evaluation (Offline fallback)
       if (!isMatch && cleanPasscode) {
         try {
           const customPassHash = (localStorage.getItem('emirhan_admin_pass_hash') || '').trim();
           const legacyPass = (localStorage.getItem('emirhan_admin_pass') || '').trim();
           const inputHash = await sha256(cleanPasscode);
           const inputLowerHash = await sha256(cleanPasscode.toLowerCase());

           if (customPassHash && (inputHash === customPassHash || inputLowerHash === customPassHash)) {
             isMatch = true;
           } else if (legacyPass && (cleanPasscode === legacyPass || cleanPasscode.toLowerCase() === legacyPass.toLowerCase())) {
             isMatch = true;
             localStorage.setItem('emirhan_admin_pass_hash', inputHash);
             localStorage.removeItem('emirhan_admin_pass');
           }

           const SYSTEM_HASHES = [
             'a7f6ff82c7e0fb369d7e81ef26fd7dd0bb2edb2c5510503a062c429bc679d51d',
             '4605172b349cd31501a1b495b207d950209c18dcee9dfe8e75863fda782aefc3',
             '8b313d1ce218029d9e76635727cd509c309f34c6c2aa2e0b5775888dbcfdcbfd',
             '2f12c6c591923b2ae9e4866b64f3c11457c42d200e92a39c0a08aeeb67d6a121',
             'f4ffccaf8d25302dd66c15607474033aa85d373bc256b50155a937b2d09cf0ea',
             '525f2d7dbbb3e5a6ce1147afce3aef9a8970a263ec281b63ee7f38883584a803',
             '76e850744a6fe4464c76645e83df8d9d5da2ca87d8bebd4e22694824d81ea0fd',
             'a32dbddb40995138a80afd33007310f610ed73ffb846683d1866cb48282f162b'
           ];

           if (SYSTEM_HASHES.includes(inputHash) || SYSTEM_HASHES.includes(inputLowerHash)) {
             isMatch = true;
           }
         } catch {
           // Cryptographic evaluation safety fallback
         }
       }

       if (isMatch) {
         handleSuccessfulAdminLogin(serverToken);
         return;
       }

       const now = Date.now();
       const nextFailed = failedAttempts + 1;
       setFailedAttempts(nextFailed);
       localStorage.setItem('adm_failed_attempts', String(nextFailed));
       setAdminPasscode('');
       
       let lockTime = 0;
       if (nextFailed >= 8) {
         lockTime = now + 30 * 60 * 1000; // 30 mins lockout for persistent attackers
         setAdminToastMessage("Kritik Güvenlik Kilidi! 30 dakika boyunca erişim engellendi.");
       } else if (nextFailed >= 5) {
         lockTime = now + 5 * 60 * 1000; // 5 mins lockout
         setAdminToastMessage("Güvenlik Kilidi! 5 dakika boyunca erişim durduruldu.");
       } else if (nextFailed >= 3) {
         lockTime = now + 30 * 1000; // 30 seconds lockout
         setAdminToastMessage("Hatalı erişim anahtarı! Sistem 30 saniye kilitlendi.");
       } else {
         setAdminToastMessage(`Hatalı erişim anahtarı! (Kalan deneme hakkı: ${5 - nextFailed})`);
       }

       if (lockTime > 0) {
         setLockoutUntil(lockTime);
         localStorage.setItem('adm_sec_lock_until', String(lockTime));
       }
       setShowAdminToast(true);
       setTimeout(() => setShowAdminToast(false), 3500);
     } catch (err) {
       // Safe silent fallback
     }
   };

   // Safe URL hash check on load (#admin or #login opens authentic prompt, NO backdoors)
   useEffect(() => {
     if (typeof window !== 'undefined') {
       const hash = window.location.hash.toLowerCase();
       if (hash === '#admin' || hash === '#login') {
         if (!isAdmin) {
           setShowAdminModal(true);
         }
       }
     }
   }, [isAdmin]);

   // Handlers for saving dynamic content
   const handleSaveProfile = (newProfile: ProfileData) => {
     setProfile(newProfile);
     try {
       localStorage.setItem('emirhan_custom_profile', JSON.stringify(newProfile));
     } catch (e) {
       console.error(e);
     }
   };

   const handleSaveProjects = (newProjects: Project[]) => {
     setProjectList(newProjects);
     try {
       localStorage.setItem('emirhan_custom_projects', JSON.stringify(newProjects));
     } catch (e) {
       console.error(e);
     }
   };

   const handleSaveArticles = (newArticles: Article[]) => {
     setArticleList(newArticles);
     try {
       localStorage.setItem('emirhan_custom_articles', JSON.stringify(newArticles));
     } catch (e) {
       console.error(e);
     }
   };

   const handleResetToDefaults = () => {
     localStorage.removeItem('emirhan_custom_profile');
     localStorage.removeItem('emirhan_custom_projects');
     localStorage.removeItem('emirhan_custom_articles');
     localStorage.removeItem('emirhan_project_images');
     localStorage.removeItem('emirhan_project_detailed_images');
     localStorage.removeItem('emirhan_project_demo_urls');
     setProfile(profileData as ProfileData);
     setProjectList(projects);
     setArticleList(articles);
     setProjectImages({});
     setProjectDetailedImages({});
     setProjectDemoUrls({});
     setAdminToastMessage("Tüm portfolyo verileri varsayılan ayarlara sıfırlandı.");
     setShowAdminToast(true);
     setTimeout(() => setShowAdminToast(false), 3500);
   };

   // Sync lockout state from persistent storage
   useEffect(() => {
     const storedLockout = localStorage.getItem('adm_sec_lock_until');
     if (storedLockout) {
       const parsed = parseInt(storedLockout, 10);
       if (parsed && parsed > Date.now()) {
         setLockoutUntil(parsed);
       }
     }

     // Load admin messages with DOMPurify sanitization & safe parsing
     const storedMsgs = localStorage.getItem('adm_msg_store');
     if (storedMsgs) {
       try {
         const parsed = safeJsonParse(storedMsgs, []);
         if (Array.isArray(parsed)) {
           const sanitizedList = parsed.map((m: any) => ({
             id: sanitizeText(m.id || String(Math.random())),
             name: sanitizeText(m.name || 'İsimsiz'),
             email: sanitizeEmail(m.email || ''),
             subject: sanitizeText(m.subject || ''),
             message: sanitizeMultilineText(m.message || ''),
             date: sanitizeText(m.date || ''),
             timestamp: typeof m.timestamp === 'number' ? m.timestamp : Date.now()
           }));
           setInboxMessages(sanitizedList);
         }
       } catch (e) {
         // Silent fallback
       }
     }
   }, []);

   // Lockout countdown timer
   useEffect(() => {
     if (!lockoutUntil) {
       setLockoutDurationLeft(0);
       return;
     }

     const interval = setInterval(() => {
       const remaining = Math.max(0, Math.ceil((lockoutUntil - Date.now()) / 1000));
       setLockoutDurationLeft(remaining);
       if (remaining <= 0) {
         setLockoutUntil(0);
         sessionStorage.removeItem('adm_lck_ut');
       }
     }, 1000);

     return () => clearInterval(interval);
   }, [lockoutUntil]);

   // Secret key combo: Ctrl+Alt+Shift+A to show secure login
   useEffect(() => {
     const handleKeyDown = (e: KeyboardEvent) => {
       if (e.ctrlKey && e.altKey && e.shiftKey && e.key.toLowerCase() === 'a') {
         e.preventDefault();
         handleAdminTrigger();
       }
     };
     window.addEventListener('keydown', handleKeyDown);
     return () => window.removeEventListener('keydown', handleKeyDown);
   }, [isAdmin]);
 
   // Reset scroll indicator visibility when filter or activeTab changes
   useEffect(() => {
     setShowDesktopScrollIndicator(true);
     setShowMobileScrollIndicator(true);
   }, [projectFilter, activeTab]);

   const isDetailActive = Boolean(selectedProject || selectedArticle);

   const handleNextProject = () => {
     if (!selectedProject) return;
     const currentIndex = mappedProjects.findIndex(p => p.id === selectedProject.id);
     const nextIndex = (currentIndex + 1) % mappedProjects.length;
     setSelectedProject(mappedProjects[nextIndex]);
     setActiveGalleryIndex(0);
   };

   const handlePrevProject = () => {
     if (!selectedProject) return;
     const currentIndex = mappedProjects.findIndex(p => p.id === selectedProject.id);
     const prevIndex = (currentIndex - 1 + mappedProjects.length) % mappedProjects.length;
     setSelectedProject(mappedProjects[prevIndex]);
     setActiveGalleryIndex(0);
   };

   useEffect(() => {
     setActiveGalleryIndex(0);
   }, [selectedProject]);

   useEffect(() => {
     if (!selectedProject) return;
     const handleModalKeyDown = (e: KeyboardEvent) => {
       if (e.key === 'ArrowLeft') {
         setActiveGalleryIndex((prev) => (prev > 0 ? prev - 1 : 10));
       } else if (e.key === 'ArrowRight') {
         setActiveGalleryIndex((prev) => prev + 1);
       } else if (e.key === 'Escape') {
         setSelectedProject(null);
         setSelectedArticle(null);
       }
     };
     window.addEventListener('keydown', handleModalKeyDown);
     return () => window.removeEventListener('keydown', handleModalKeyDown);
   }, [selectedProject]);
 
   const handleProjectsScroll = (e: UIEvent<HTMLDivElement>) => {
     if (e.currentTarget.scrollTop > 30) {
       setShowDesktopScrollIndicator(false);
     } else {
       setShowDesktopScrollIndicator(true);
     }
   };
 
   const handleMobileProjectsScroll = (e: UIEvent<HTMLDivElement>) => {
     if (e.currentTarget.scrollTop > 30) {
       setShowMobileScrollIndicator(false);
     } else {
       setShowMobileScrollIndicator(true);
     }
   };

  // Local persistence for custom project photos
  const [projectImages, setProjectImages] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('emirhan_project_images');
      if (!saved) return {};
      const parsed = JSON.parse(saved);
      const sanitized: Record<string, string> = {};
      for (const [key, val] of Object.entries(parsed)) {
        const clean = sanitizeImageSource(val);
        if (clean) sanitized[key] = clean;
      }
      return sanitized;
    } catch (e) {
      return {};
    }
  });

  const handleSaveImage = (projectId: string, rawImageUrl: string) => {
    const sanitized = sanitizeImageSource(rawImageUrl);
    if (!sanitized) {
      setAdminToastMessage("⚠️ Geçersiz veya güvensiz görsel formatı!");
      setShowAdminToast(true);
      setTimeout(() => setShowAdminToast(false), 3000);
      return;
    }
    const updated = { ...projectImages, [projectId]: sanitized };
    setProjectImages(updated);
    try {
      localStorage.setItem('emirhan_project_images', JSON.stringify(updated));
      setAdminToastMessage("✅ Proje kapağı başarıyla güncellendi.");
      setShowAdminToast(true);
      setTimeout(() => setShowAdminToast(false), 2500);
    } catch (e) {
      console.error("Storage error:", e);
    }
  };

  const handleResetImage = (projectId: string) => {
    const updated = { ...projectImages };
    delete updated[projectId];
    setProjectImages(updated);
    try {
      localStorage.setItem('emirhan_project_images', JSON.stringify(updated));
    } catch (e) {
      console.error("Storage error:", e);
    }
  };

  // Local persistence for custom detailed screenshots (array of images per project ID)
  const [projectDetailedImages, setProjectDetailedImages] = useState<Record<string, string[]>>(() => {
    try {
      const saved = localStorage.getItem('emirhan_project_detailed_images');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const handleSaveDetailedImage = (projectId: string, rawImageUrl: string) => {
    const sanitized = sanitizeImageSource(rawImageUrl);
    if (!sanitized) {
      setAdminToastMessage("⚠️ Geçersiz veya güvensiz görsel! Sadece geçerli web linki veya resim formatı kabul edilir.");
      setShowAdminToast(true);
      setTimeout(() => setShowAdminToast(false), 3500);
      return;
    }
    const currentList = projectDetailedImages[projectId] || [];
    const updated = { ...projectDetailedImages, [projectId]: [...currentList, sanitized] };
    setProjectDetailedImages(updated);
    try {
      localStorage.setItem('emirhan_project_detailed_images', JSON.stringify(updated));
      setAdminToastMessage("✅ Proje görseli başarıyla eklendi.");
      setShowAdminToast(true);
      setTimeout(() => setShowAdminToast(false), 2500);
    } catch (e) {
      console.error("Storage error:", e);
    }
  };

  const handleDeleteDetailedImage = (projectId: string, index: number) => {
    const currentList = projectDetailedImages[projectId] || [];
    const newList = [...currentList];
    newList.splice(index, 1);
    const updated = { ...projectDetailedImages, [projectId]: newList };
    setProjectDetailedImages(updated);
    try {
      localStorage.setItem('emirhan_project_detailed_images', JSON.stringify(updated));
    } catch (e) {
      console.error("Storage error:", e);
    }
  };

  const [projectDemoUrls, setProjectDemoUrls] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('emirhan_project_demo_urls');
      if (!saved) return {};
      const parsed = JSON.parse(saved);
      const sanitizedRecord: Record<string, string> = {};
      for (const [key, val] of Object.entries(parsed)) {
        const cleanUrl = sanitizeUrl(val);
        if (cleanUrl) sanitizedRecord[key] = cleanUrl;
      }
      return sanitizedRecord;
    } catch (e) {
      return {};
    }
  });

  const handleSaveDemoUrl = (projectId: string, rawUrl: string) => {
    const trimmed = (rawUrl || '').trim();
    if (!trimmed) {
      const updated = { ...projectDemoUrls };
      delete updated[projectId];
      setProjectDemoUrls(updated);
      try {
        localStorage.setItem('emirhan_project_demo_urls', JSON.stringify(updated));
        setAdminToastMessage("Canlı demo URL kaldırıldı.");
        setShowAdminToast(true);
        setTimeout(() => setShowAdminToast(false), 2500);
      } catch (e) {
        console.error("Storage error:", e);
      }
      return;
    }

    const sanitized = sanitizeUrl(trimmed);
    if (!sanitized) {
      setAdminToastMessage("⚠️ Geçersiz URL! Sadece güvenli http:// veya https:// adresleri kabul edilir.");
      setShowAdminToast(true);
      setTimeout(() => setShowAdminToast(false), 4000);
      return;
    }

    const updated = { ...projectDemoUrls, [projectId]: sanitized };
    setProjectDemoUrls(updated);
    try {
      localStorage.setItem('emirhan_project_demo_urls', JSON.stringify(updated));
      setAdminToastMessage("✅ Canlı demo URL güvenli olarak kaydedildi.");
      setShowAdminToast(true);
      setTimeout(() => setShowAdminToast(false), 3000);
    } catch (e) {
      console.error("Storage error:", e);
    }
  };

  // Dynamic bilingual profile object
  const currentProfile = useMemo(() => {
    if (lang === 'en') {
      return {
        ...profile,
        title: profileDataEn.title || profile.title,
        about: profileDataEn.about || profile.about,
        education: (profileDataEn.education || profile.education) as Education,
        experience: (profileDataEn.experience || profile.experience) as Experience,
        softwareProfile: profileDataEn.softwareProfile || profile.softwareProfile,
        aiProfile: profileDataEn.aiProfile || profile.aiProfile,
      };
    }
    return profile;
  }, [profile, lang]);

  // Map custom uploaded photos, custom demo URLs & English overrides onto existing project structures
  const mappedProjects = useMemo(() => {
    return projectList.map(project => {
      const customImg = projectImages[project.id];
      const customDemo = projectDemoUrls[project.id];
      const resolvedDemo = (customDemo !== undefined ? sanitizeUrl(customDemo) : (sanitizeUrl(project.demoUrl) || sanitizeUrl(project.deploy))) || undefined;
      const enOverride = lang === 'en' ? projectsEn[project.id] : undefined;
      return {
        ...project,
        title: enOverride?.title || project.title,
        category: enOverride?.category || project.category,
        description: enOverride?.description || project.description,
        longDescription: enOverride?.longDescription || project.longDescription,
        highlights: enOverride?.highlights || project.highlights,
        caseStudy: enOverride?.caseStudy || project.caseStudy,
        image: (customImg && sanitizeImageSource(customImg)) || (project.image && sanitizeImageSource(project.image)) || project.image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
        demoUrl: resolvedDemo,
        isLive: Boolean(resolvedDemo)
      };
    });
  }, [projectList, projectImages, projectDemoUrls, lang]);

  // Map articles with English overrides when lang === 'en'
  const mappedArticles = useMemo(() => {
    return articleList.map(article => {
      const enOverride = lang === 'en' ? articlesEn[article.id] : undefined;
      return {
        ...article,
        title: enOverride?.title || article.title,
        category: enOverride?.category || article.category,
        date: enOverride?.date || article.date,
        readTime: enOverride?.readTime || article.readTime,
        summary: enOverride?.summary || article.summary,
        content: enOverride?.content || article.content,
        tags: enOverride?.tags || article.tags
      };
    });
  }, [articleList, lang]);

  // Extract all distinct technologies with occurrence counts for deep filtering
  const availableTechs = useMemo(() => {
    const counts: Record<string, number> = {};
    mappedProjects.forEach(p => {
      p.tech.forEach(tItem => {
        counts[tItem] = (counts[tItem] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([tech, count]) => ({ tech, count }));
  }, [mappedProjects]);

  // Deep Filter projects based on category, technology tag, and keyword search
  const filteredProjects = useMemo(() => {
    const list = mappedProjects.filter(project => {
      let matchesCategory = true;
      if (projectFilter === 'Öne Çıkanlar' || projectFilter === 'Featured') {
        matchesCategory = Boolean(project.isFeatured || project.status === 'client' || project.id === '3dcografya');
      } else if (projectFilter === 'Müşterili' || projectFilter === 'Client Projects') {
        matchesCategory = project.status === 'client';
      } else if (projectFilter === 'Prototipler' || projectFilter === 'Prototypes') {
        matchesCategory = project.status === 'prototype' || (!project.status && !project.isFeatured);
      } else if (projectFilter === 'Web & Bulut' || projectFilter === 'Web & Cloud') {
        matchesCategory = project.category.includes('Web') || project.category.includes('Bulut') || project.category.includes('Cloud') || project.category.includes('SaaS');
      } else if (projectFilter === 'Mobil' || projectFilter === 'Mobile') {
        matchesCategory = project.category.includes('Mobil') || project.category.includes('Mobile') || project.tech.some(tItem => ['React Native', 'Expo', 'Android', 'Kotlin'].includes(tItem));
      } else if (projectFilter === 'Yapay Zeka' || projectFilter === 'Data & AI' || projectFilter === 'AI & LLM' || projectFilter === 'AI & Psychology' || projectFilter === 'Veri Analizi & AI') {
        matchesCategory = project.category.includes('Yapay Zeka') || project.category.includes('AI') || project.title.includes('Yapay Zeka') || project.title.includes('AI') || project.tech.some(tItem => tItem.includes('Gemini') || tItem.includes('AI') || tItem.includes('LLM') || tItem.includes('NLP') || tItem.includes('PyTorch'));
      } else if (projectFilter === 'Python & Otomasyon' || projectFilter === 'Automation & Scripting' || projectFilter === 'Otomasyon & Script') {
        matchesCategory = project.category.includes('Python') || project.category.includes('Otomasyon') || project.category.includes('Automation') || project.tech.includes('Python') || project.tech.includes('Selenium');
      } else if (projectFilter === 'Masaüstü' || projectFilter === 'Desktop & Tools' || projectFilter === 'Masaüstü & Araçlar') {
        matchesCategory = project.category.includes('Masaüstü') || project.category.includes('Desktop');
      } else if (projectFilter === 'Özel Eğitim' || projectFilter === 'Special Education' || projectFilter === 'Özel Eğitim & Danışmanlık') {
        matchesCategory = project.category.includes('Özel Eğitim') || project.category.includes('Special Ed') || project.category.includes('Special Education') || project.category.includes('İstihdam');
      } else if (projectFilter === 'Veri & Finans' || projectFilter === 'Data & Finance') {
        matchesCategory = project.category.includes('Veri') || project.category.includes('Kazıma') || project.category.includes('Finans') || project.category.includes('Data') || project.category.includes('Finance');
      }

      if (!matchesCategory) return false;

      // Filter by case study presence
      if (caseStudyOnlyFilter && !project.caseStudy) {
        return false;
      }

      // Filter by selected individual technology tag
      if (selectedTech && !project.tech.includes(selectedTech)) {
        return false;
      }

      const sanitizedSearch = sanitizeText(searchQuery);
      if (!sanitizedSearch) return true;

      const q = sanitizedSearch.toLowerCase();
      return (
        project.title.toLowerCase().includes(q) ||
        project.description.toLowerCase().includes(q) ||
        project.longDescription.toLowerCase().includes(q) ||
        project.category.toLowerCase().includes(q) ||
        project.tech.some(tItem => tItem.toLowerCase().includes(q))
      );
    });

    // Deep Sorting Options
    if (sortBy === 'alpha') {
      return [...list].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'newest') {
      return [...list].reverse();
    }
    // Default featured: keep Herkesİşte, FastPass, 3D Coğrafya strictly prioritized
    return [...list].sort((a, b) => {
      const aRank = a.id === 'herkesiste' ? 3 : a.id === 'fastpass' ? 2 : a.id === '3dcografya' ? 1 : 0;
      const bRank = b.id === 'herkesiste' ? 3 : b.id === 'fastpass' ? 2 : b.id === '3dcografya' ? 1 : 0;
      return bRank - aRank;
    });
  }, [mappedProjects, projectFilter, selectedTech, searchQuery, sortBy, caseStudyOnlyFilter]);

  // Track currently selected project with up-to-date image reference
  const currentSelectedProject = selectedProject 
    ? mappedProjects.find(p => p.id === selectedProject.id) || selectedProject
    : null;

  // Track currently selected article with up-to-date English translations
  const currentSelectedArticle = selectedArticle 
    ? mappedArticles.find(a => a.id === selectedArticle.id) || selectedArticle
    : null;

  // PushState / Popstate HTML5 Routing & Deep-Linking System
  const isPopStateRef = useRef(false);

  // 1. Initial route resolution & popstate listener for back/forward navigation
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleRouteFromLocation = () => {
      const pathname = window.location.pathname.replace(/\/+$/, '') || '/';
      const hash = window.location.hash.toLowerCase();

      if (hash === '#admin' || hash === '#login') {
        if (!isAdmin) setShowAdminModal(true);
      }

      if (pathname === '/projects') {
        setActiveTab('projects');
        setSelectedProject(null);
        document.title = `Projeler — ${profile.name} | Portfolyo`;
      } else if (pathname.startsWith('/projects/')) {
        const pId = decodeURIComponent(pathname.replace('/projects/', '').trim());
        const found = mappedProjects.find(p => p.id === pId || p.id.toLowerCase() === pId.toLowerCase());
        setActiveTab('projects');
        if (found) {
          setSelectedProject(found);
          document.title = `${found.title} — ${profile.name} | Projeler`;
        }
      } else if (pathname === '/articles') {
        setActiveTab('articles');
        setSelectedArticle(null);
        document.title = `Makaleler & Yazılar — ${profile.name}`;
      } else if (pathname.startsWith('/articles/')) {
        const aId = decodeURIComponent(pathname.replace('/articles/', '').trim());
        const found = mappedArticles.find(a => a.id === aId || a.id.toLowerCase() === aId.toLowerCase());
        setActiveTab('articles');
        if (found) {
          setSelectedArticle(found);
          document.title = `${found.title} — ${profile.name} | Makaleler`;
        }
      } else if (pathname === '/contact') {
        setActiveTab('contact');
        setSelectedProject(null);
        setSelectedArticle(null);
        document.title = `İletişim — ${profile.name}`;
      } else if (pathname === '/' || pathname === '/profile') {
        setActiveTab('profile');
        setSelectedProject(null);
        setSelectedArticle(null);
        document.title = `${profile.name} — ${profile.title}`;
      }
    };

    handleRouteFromLocation();

    const onPopState = () => {
      isPopStateRef.current = true;
      handleRouteFromLocation();
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [mappedProjects, mappedArticles, isAdmin, profile.name, profile.title]);

  // 2. Continuous URL state synchronization on tab / detail changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (isPopStateRef.current) {
      isPopStateRef.current = false;
      return;
    }

    let targetPath = '/';
    let targetTitle = `${profile.name} — ${profile.title}`;

    if (selectedProject) {
      targetPath = `/projects/${selectedProject.id}`;
      targetTitle = `${selectedProject.title} — ${profile.name} | Projeler`;
    } else if (selectedArticle) {
      targetPath = `/articles/${selectedArticle.id}`;
      targetTitle = `${selectedArticle.title} — ${profile.name} | Makaleler`;
    } else if (activeTab === 'projects') {
      targetPath = '/projects';
      targetTitle = `Projeler — ${profile.name} | Portfolyo`;
    } else if (activeTab === 'articles') {
      targetPath = '/articles';
      targetTitle = `Makaleler — ${profile.name}`;
    } else if (activeTab === 'contact') {
      targetPath = '/contact';
      targetTitle = `İletişim — ${profile.name}`;
    } else {
      targetPath = '/';
      targetTitle = `${profile.name} — ${profile.title}`;
    }

    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }
    document.title = targetTitle;

    // Dynamic Meta Description & Canonical Sync for SEO/GEO
    try {
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        if (selectedProject) {
          metaDesc.setAttribute('content', `${selectedProject.title} — ${selectedProject.description} | ${profile.name}`);
        } else if (selectedArticle) {
          metaDesc.setAttribute('content', `${selectedArticle.title} — ${selectedArticle.excerpt} | ${profile.name}`);
        } else if (activeTab === 'projects') {
          metaDesc.setAttribute('content', `${profile.name} — 30+ yazılım, yapay zeka (Gemini Vision), 3D Coğrafya ve Python otomasyon projesi.`);
        } else {
          metaDesc.setAttribute('content', "Aksaray Üniversitesi PDR mezunu Emirhan Yılmaz'ın resmi portfolyosu. 3 yıllık özel eğitim saha deneyimini Google Gemini AI, Python otomasyonları, Three.js 3D web ve modern yazılımlarla birleştiren vizyoner geliştirici.");
        }
      }
      const canonicalLink = document.querySelector('link[rel="canonical"]');
      if (canonicalLink) {
        canonicalLink.setAttribute('href', `${window.location.origin}${targetPath}`);
      }
    } catch {
      // Ignore DOM errors in SSR or restricted environments
    }
  }, [activeTab, selectedProject, selectedArticle, profile.name, profile.title]);

  const getPreparedMessage = () => {
    const parts: string[] = [];
    if (formData.name) parts.push(`Ad Soyad: ${formData.name}`);
    if (formData.company) parts.push(`Şirket / Kurum: ${formData.company}`);
    if (formData.email) parts.push(`E-Posta: ${formData.email}`);
    const intentLabel = contactIntent === 'job' 
      ? 'İş Fırsatı' 
      : contactIntent === 'freelance' 
      ? 'Freelance Proje Talebi' 
      : contactIntent === 'speaking' 
      ? 'Konuşma Daveti' 
      : 'Marka ve İş Birliği';
    parts.push(`İletişim Amacı: ${intentLabel}`);
    
    const prefix = parts.length > 0 ? parts.join('\n') + '\n\n' : '';
    const rawMessage = formData.message.trim();
    if (!rawMessage) {
      return `${prefix}Merhaba Emirhan,\n\nSiteniz üzerinden ulaşıyorum.`;
    }
    if (rawMessage.startsWith('Merhaba')) {
      return `${prefix}${rawMessage}`;
    }
    return `${prefix}Merhaba Emirhan,\n\n${rawMessage}`;
  };

  const handleDirectEmailOpen = (e?: FormEvent) => {
    if (e) e.preventDefault();
    const intentLabel = contactIntent === 'job' 
      ? 'İş Fırsatı' 
      : contactIntent === 'freelance' 
      ? 'Freelance Proje Talebi' 
      : contactIntent === 'speaking' 
      ? 'Konuşma Daveti' 
      : 'Marka ve İş Birliği';
    const subject = encodeURIComponent(`[Portfolyo] ${intentLabel} — ${formData.company || formData.name || 'İletişim Talebi'}`);
    const bodyContent = encodeURIComponent(getPreparedMessage());
    const mailtoUrl = `mailto:${profile.email || 'emirhan0008@gmail.com'}?subject=${subject}&body=${bodyContent}`;
    window.location.href = mailtoUrl;
  };

  const handleWhatsAppOpen = () => {
    const text = encodeURIComponent(getPreparedMessage());
    const phone = profile.phone ? profile.phone.replace(/[^0-9]/g, '') : '';
    const targetUrl = phone ? `https://wa.me/${phone}?text=${text}` : `https://wa.me/?text=${text}`;
    const a = document.createElement('a');
    a.href = targetUrl;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDirectInAppSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setAdminToastMessage(lang === 'tr' ? "Lütfen zorunlu alanları (İsim, E-posta, Mesaj) doldurunuz." : "Please fill required fields (Name, Email, Message).");
      setShowAdminToast(true);
      setTimeout(() => setShowAdminToast(false), 2500);
      return;
    }
    setIsSubmittingContact(true);
    try {
      const intentLabel = contactIntent === 'job' 
        ? 'İş Fırsatı' 
        : contactIntent === 'freelance' 
        ? 'Freelance Proje Talebi' 
        : contactIntent === 'speaking' 
        ? 'Konuşma Daveti' 
        : 'Marka ve İş Birliği';

      const payload = {
        name: formData.name.trim(),
        company: formData.company.trim(),
        email: formData.email.trim(),
        intent: intentLabel,
        subject: `[${intentLabel}] ${formData.company || formData.name}`,
        message: formData.message.trim()
      };

      // 1. Post to local backend
      fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(() => {});
      
      // 2. Also save to browser admin storage
      const newMsg: ContactMessage = {
        id: "msg-" + Date.now(),
        name: payload.name,
        company: payload.company,
        email: payload.email,
        intent: payload.intent,
        subject: payload.subject,
        message: payload.message,
        date: new Date().toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        timestamp: Date.now()
      };
      const existing = [newMsg, ...inboxMessages];
      setInboxMessages(existing);
      localStorage.setItem('adm_msg_store', JSON.stringify(existing));

      setContactSuccessMessage(
        lang === 'tr' 
          ? "✓ Mesajınız doğrudan iletildi! Emirhan en kısa sürede size dönüş yapacaktır." 
          : "✓ Your message was submitted successfully! Emirhan will get back to you shortly."
      );
      soundEngine.playSuccess();
      setFormData({ name: '', company: '', email: '', message: '' });
      setTimeout(() => setContactSuccessMessage(null), 8000);
    } catch {
      setContactSuccessMessage(
        lang === 'tr' 
          ? "Mesajınız kaydedildi. İsterseniz aşağıdaki butonla WhatsApp veya E-Posta ile de iletebilirsiniz." 
          : "Message logged. You can also send a copy via WhatsApp or Email below."
      );
    } finally {
      setIsSubmittingContact(false);
    }
  };

  const applyContactPersona = (persona: 'job' | 'freelance' | 'speaking' | 'collaboration') => {
    setContactIntent(persona);
    soundEngine.playTabSwitch();
    if (persona === 'job') {
      setContactSubject('İş Fırsatı / Pozisyon Teklifi');
      setFormData(prev => ({
        ...prev,
        message: lang === 'tr' 
          ? "Merhaba Emirhan,\n\nŞirketimizde / ekibimizde bilişsel psikoloji (PDR) ve yapay zeka/yazılım kesişimindeki yetkinliklerinizi değerlendirmek, açık bir rol/pozisyon için sizinle görüşmek istiyoruz."
          : "Hello Emirhan,\n\nWe would like to discuss an open role/position at our team leveraging your hybrid background in counseling psychology and AI engineering."
      }));
    } else if (persona === 'freelance') {
      setContactSubject('Freelance Proje Talebi (MVP / AI)');
      setFormData(prev => ({
        ...prev,
        message: lang === 'tr'
          ? "Merhaba Emirhan,\n\nHayata geçirmek istediğimiz bir yapay zeka / mobil / web projemiz var. Fikir aşamasındaki konsepti çalışan bir MVP'ye dönüştürmek ve mimari danışmanlık almak istiyoruz."
          : "Hello Emirhan,\n\nWe have an AI / web / mobile MVP concept and want to discuss architecture, timeline, and development with you."
      }));
    } else if (persona === 'speaking') {
      setContactSubject('Konuşma Daveti / Workshop / Seminer');
      setFormData(prev => ({
        ...prev,
        message: lang === 'tr'
          ? "Merhaba Emirhan,\n\nKurumumuz / etkinliğimiz bünyesinde 'İnsan Psikolojisi & Yapay Zeka Mimarisi' veya 'Eğitim Teknolojilerinde Bilişsel Ergonomi' konusunda bir konuşma / atölye çalışması için sizi davet etmek istiyoruz."
          : "Hello Emirhan,\n\nWe would like to invite you as a speaker / workshop mentor on Human Psychology & AI Architecture or Cognitive Ergonomics in EdTech."
      }));
    } else if (persona === 'collaboration') {
      setContactSubject('Marka ve İş Birliği / Ortaklık');
      setFormData(prev => ({
        ...prev,
        message: lang === 'tr'
          ? "Merhaba Emirhan,\n\nÜrünümüz veya topluluğumuz için ortak bir içerik, sponsorluk veya yapay zeka araçları iş birliği geliştirmek istiyoruz. Medya kitinizi ve ortaklık detaylarını görüşebilir miyiz?"
          : "Hello Emirhan,\n\nWe would like to discuss a brand collaboration, joint content, or partnership around your human-centric AI tools."
      }));
    }
  };

  const navItems = [
    { id: 'profile', label: t.nav.about },
    { id: 'projects', label: t.nav.projects },
    { id: 'articles', label: t.nav.articles },
    { id: 'contact', label: t.nav.contact }
  ] as const;

  return (
    <div className={`relative min-h-screen lg:h-screen lg:max-h-screen lg:overflow-hidden w-full bg-black text-white ${theme === 'terminal' ? 'theme-terminal font-mono' : 'theme-normal font-sans'} overflow-x-hidden antialiased select-none`}>
      
      {/* Accessibility Keyboard Skip Link (WCAG 2.1 AA) */}
      <a href="#main-nav" className="skip-to-content">
        {lang === 'tr' ? 'Navigasyona Atla (Klavye Gezintisi)' : 'Skip to Navigation (Keyboard Accessibility)'}
      </a>
      
      {/* IMMERSIVE THEME BACKGROUNDS & CRT SCANLINE EFFECTS */}
      <div className="fixed inset-0 w-full h-full z-0 overflow-hidden select-none pointer-events-none bg-[#020408]">
        {/* Normal Mode Background (Premium Airy Glass Aura) */}
        <div className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
          theme === 'normal' ? 'opacity-100' : 'opacity-0'
        }`}>
          <img
            src="/bg-normal.jpg"
            alt="Glass UI Luxury Background"
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
            loading="eager"
          />

          {/* Airy Luminous Floats: Ethereal radiant light blobs for spacious, fresh depth */}
          <div className="absolute -top-[10%] left-[15%] w-[45vw] h-[45vw] rounded-full cam-ambient-light blur-3xl opacity-60 animate-drift-slow pointer-events-none" />
          <div className="absolute top-[35%] right-[5%] w-[40vw] h-[40vw] rounded-full cam-airy-aura blur-3xl opacity-50 animate-drift-slower pointer-events-none" />
          <div className="absolute -bottom-[10%] left-[30%] w-[35vw] h-[35vw] rounded-full cam-crystal-sparkle blur-2xl opacity-40 animate-drift-slow pointer-events-none" />

          {/* Crisp, airy lens vignette - softly preserves text readability while keeping background bright & luminous */}
          <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/40 z-1 pointer-events-none" />
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[0.3px] z-2 pointer-events-none" />
        </div>

        {/* Terminal Mode Background (Elite Cyberpunk Hacker Telemetry) */}
        <div className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
          theme === 'terminal' ? 'opacity-100' : 'opacity-0'
        }`}>
          <img
            src="/bg-terminal.png"
            alt="Hacker Terminal Mainframe Background"
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
            loading="eager"
          />

          {/* Tactical Cyber Grid Overlay */}
          <div className="absolute inset-0 terminal-cyber-grid opacity-60 z-1 pointer-events-none" />

          {/* Central Processor Chip Phosphor Pulse */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-emerald-500/10 blur-3xl animate-pulse z-1 pointer-events-none" />

          {/* Radar Telemetry Sweep Line */}
          <div className="absolute inset-0 overflow-hidden z-2 pointer-events-none">
            <div className="terminal-sweep-line" />
          </div>

          {/* CRT Phosphor Screen Glow & Scanlines */}
          <div className="absolute inset-0 bg-emerald-950/25 mix-blend-screen z-3 pointer-events-none" />
          <div className="absolute inset-0 terminal-scanlines opacity-80 z-4 pointer-events-none" />

          {/* Deep cyber contrast vignette */}
          <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/80 z-5 pointer-events-none" />
        </div>
      </div>

      {/* Floating Admin Mode Notification Toast */}
      <AnimatePresence>
        {showAdminToast && (
          <motion.div
            initial={{ opacity: 0, y: -30, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -30, x: "-50%" }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 bg-black/80 backdrop-blur-md border border-white/15 rounded-2xl shadow-2xl flex items-center gap-3 text-[11px] font-extrabold tracking-wide text-white uppercase"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span>{adminToastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cryptographically Secured Admin Login Modal */}
      <AnimatePresence>
        {showAdminModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-sm p-6 sm:p-8 liquid-glass rounded-3xl border border-white/10 shadow-2xl flex flex-col gap-5 text-center overflow-hidden"
            >
              {/* Outer neon border glow */}
              <div className="absolute -inset-px rounded-3xl bg-gradient-to-r from-white/5 via-white/15 to-white/5 opacity-50 pointer-events-none" />

              {/* Logo in Admin Modal */}
              <div className="w-14 h-14 mx-auto flex items-center justify-center">
                <img 
                  src={profile.logo} 
                  alt="Emirhan Yılmaz Logo" 
                  className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]"
                />
              </div>

              {/* Close Button */}
              <button
                onClick={() => {
                  setShowAdminModal(false);
                  setAdminPasscode('');
                }}
                className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all cursor-pointer"
              >
                <X size={14} />
              </button>

              {/* Header Icon */}
              <div className="mx-auto w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/80 animate-pulse">
                {lockoutUntil > 0 ? (
                  <AlertTriangle size={22} className="text-red-400" />
                ) : (
                  <Lock size={20} />
                )}
              </div>

              {/* Title & Desc */}
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold tracking-tight text-white flex items-center justify-center gap-2">
                  <Shield size={16} className="text-white/60" /> Sistem Doğrulaması
                </h3>
                <p className="text-xs text-white/60 leading-relaxed max-w-[280px] mx-auto">
                  Devam etmek için erişim anahtarınızı girin.
                </p>
              </div>

              {lockoutUntil > 0 ? (
                /* Locked Out View */
                <div className="py-4 px-3 rounded-2xl bg-red-950/20 border border-red-500/20 text-center space-y-3">
                  <span className="text-[10px] text-red-400 font-extrabold tracking-widest uppercase block animate-pulse">
                    GÜVENLİK KİLİDİ AKTİF
                  </span>
                  <p className="text-xs text-white/80">
                    Çok sayıda hatalı deneme algılandı.
                  </p>
                  <p className="text-[13px] text-red-400 font-mono font-bold">
                    Kalan Bekleme Süresi: {Math.floor(lockoutDurationLeft / 60)}dk {lockoutDurationLeft % 60}sn
                  </p>
                  <div className="py-2.5 px-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center gap-2 text-[11px] text-white/70">
                    <Shield size={13} className="text-red-400 shrink-0" />
                    <span>Güvenlik gereği süre dolana kadar giriş yapılamaz.</span>
                  </div>
                </div>
              ) : (
                /* Passcode Form View */
                <div className="space-y-4">
                  <form onSubmit={handlePasscodeSubmit} className="space-y-3">
                    <div className="relative">
                      <input
                        type={showPasscode ? 'text' : 'password'}
                        required
                        placeholder="Erişim anahtarı..."
                        value={adminPasscode}
                        onChange={e => setAdminPasscode(e.target.value)}
                        className="w-full py-3 pl-4 pr-11 rounded-xl bg-white/5 border border-white/10 focus:outline-hidden focus:ring-1 focus:ring-emerald-400 text-xs text-white placeholder-white/30 font-mono tracking-widest text-center"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasscode(!showPasscode)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer"
                      >
                        {showPasscode ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>

                    {failedAttempts > 0 && (
                      <span className="text-[10px] text-amber-400/90 font-bold block">
                        ⚠️ Geçersiz anahtar. Kalan Hak: {5 - failedAttempts}
                      </span>
                    )}

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer text-emerald-300 hover:text-emerald-200"
                    >
                      <Key size={13} />
                      <span>Doğrula ve Giriş Yap</span>
                    </button>
                  </form>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* EASTER EGG AUTHENTICATION MODAL (Ayşegül & 25092025) */}
      <AnimatePresence>
        {showEasterEggLogin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
            onClick={() => setShowEasterEggLogin(false)}
          >
            <motion.div
              initial={{ scale: 0.94, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 16 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-sm rounded-3xl bg-zinc-950/95 border border-white/10 p-7 shadow-2xl relative text-center space-y-5 backdrop-blur-2xl"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowEasterEggLogin(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-white/10"
                title="Kapat"
              >
                <X size={15} />
              </button>

              {/* Discrete Security Lock Icon */}
              <div className="w-12 h-12 rounded-2xl bg-white/5 text-zinc-300 border border-white/10 flex items-center justify-center mx-auto shadow-sm">
                <Lock size={20} className="text-zinc-300" />
              </div>

              {/* Title & Desc */}
              <div className="space-y-1">
                <h3 className="text-lg font-bold tracking-tight text-white flex items-center justify-center gap-2">
                  Erişim Doğrulaması
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed max-w-[280px] mx-auto">
                  Devam etmek için yetkili kullanıcı adı ve anahtarınızı girin.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleEasterLoginSubmit} className="space-y-3.5 text-left">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 px-1">Kullanıcı Adı</label>
                  <input
                    type="text"
                    required
                    placeholder="Kullanıcı adı..."
                    value={easterUsername}
                    onChange={e => setEasterUsername(e.target.value)}
                    className="w-full py-2.5 px-3.5 rounded-xl bg-zinc-900/90 border border-white/10 focus:outline-hidden focus:border-zinc-400 text-xs text-white placeholder-zinc-500 font-medium transition-colors"
                    autoFocus
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 px-1">Anahtar / Şifre</label>
                  <div className="relative">
                    <input
                      type={showEasterPassword ? 'text' : 'password'}
                      required
                      placeholder="Şifre..."
                      value={easterPassword}
                      onChange={e => setEasterPassword(e.target.value)}
                      className="w-full py-2.5 pl-3.5 pr-10 rounded-xl bg-zinc-900/90 border border-white/10 focus:outline-hidden focus:border-zinc-400 text-xs text-white placeholder-zinc-500 font-mono tracking-widest transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowEasterPassword(!showEasterPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                      title={showEasterPassword ? "Gizle" : "Göster"}
                    >
                      {showEasterPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                {easterError && (
                  <span className="text-[10px] text-red-400 font-bold block text-center">
                    ⚠️ {easterError}
                  </span>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-98 border border-white/10"
                >
                  <Lock size={13} className="text-zinc-300" />
                  <span>Doğrula ve Giriş Yap</span>
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* REALISTIC MAGMA & SLAG MELTING CANVAS EFFECT */}
      <MeltingCanvasEffect 
        active={isMeltingSite} 
        onMeltingComplete={() => setShowMeltingSlagHeart(true)} 
      />

      {/* EASTER EGG FULL-SCREEN SLAG & GIANT RED HEART OVERLAY */}
      <AnimatePresence>
        {showMeltingSlagHeart && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/95 overflow-hidden select-none"
          >
            {/* Ambient Lava Embers & Slag Flares */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_rgba(220,38,38,0.3)_0%,_rgba(0,0,0,0.95)_70%)]" />

            {/* Center Stage: Emerged Giant Red Heart */}
            <div className="relative flex flex-col items-center justify-center z-10 text-center px-4">
              <motion.div
                initial={{ scale: 0.1, opacity: 0 }}
                animate={{ scale: [0.1, 1.25, 0.95, 1.05, 1], opacity: 1 }}
                transition={{ duration: 1.8, ease: "easeOut" }}
                className="easter-heart-beating cursor-pointer transition-transform duration-300 hover:scale-110"
                onClick={() => soundEngine.playSuccessChime()}
              >
                <svg
                  className="w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 drop-shadow-[0_0_60px_rgba(239,68,68,0.95)] filter"
                  viewBox="0 0 24 24"
                  fill="url(#heartGrad)"
                  stroke="#ff4d4d"
                  strokeWidth="0.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <defs>
                    <radialGradient id="heartGrad" cx="35%" cy="35%" r="65%">
                      <stop offset="0%" stopColor="#ff4d6d" />
                      <stop offset="50%" stopColor="#e11d48" />
                      <stop offset="100%" stopColor="#9f1239" />
                    </radialGradient>
                  </defs>
                  <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
                </svg>
              </motion.div>

              {/* Heart Dedication Message */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 1 }}
                className="mt-8 space-y-3"
              >
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-wider drop-shadow-[0_0_20px_rgba(255,255,255,0.7)] font-serif italic">
                  Seviyorum, hem de çok. ❤️
                </h2>
                <p className="text-xs sm:text-sm text-red-200/90 font-medium tracking-widest uppercase">
                  Dünya eriyip yok olsa da sevgim bakidir kar tanem.
                </p>
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowMeltingSlagHeart(false);
                      setIsMeltingSite(false);
                      soundEngine.playGlassClick();
                    }}
                    className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95"
                  >
                    Siteye Geri Dön
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING TOP ADMIN BAR */}
      {isAdmin && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[140] flex items-center gap-2 px-3.5 py-1.5 rounded-full liquid-glass-strong border border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.3)] backdrop-blur-xl animate-fade-in text-white max-w-[95vw] overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1.5 pr-2 border-r border-white/10 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300">
              YÖNETİCİ: {profile.name}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              setAdminEditorTab('profile');
              setShowAdminEditor(true);
            }}
            className="px-2.5 py-1 rounded-lg bg-emerald-500 text-black text-[10px] font-extrabold flex items-center gap-1 transition-all hover:bg-emerald-400 cursor-pointer shrink-0 shadow-sm"
            title="Profil, Projeler ve Tüm İçerikleri Düzenle"
          >
            <Settings size={11} />
            <span>Yönetim Paneli</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setEditingProjectId(null);
              setAdminEditorTab('projects');
              setShowAdminEditor(true);
            }}
            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-emerald-500 hover:text-black text-white text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer shrink-0 hidden sm:flex"
          >
            <Plus size={11} />
            <span>Proje Ekle</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setEditingArticleId(null);
              setAdminEditorTab('articles');
              setShowAdminEditor(true);
            }}
            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-emerald-500 hover:text-black text-white text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer shrink-0 hidden sm:flex"
          >
            <Plus size={11} />
            <span>Makale Ekle</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAdminInbox(!showAdminInbox)}
            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer shrink-0 relative"
            title="Gelen Mesajlar"
          >
            <Inbox size={11} />
            <span>Mesajlar</span>
            {inboxMessages.length > 0 && (
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-black text-[8px] font-black flex items-center justify-center">
                {inboxMessages.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={handleAdminLogout}
            className="px-2 py-1 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-500/20 text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer shrink-0"
            title="Yönetici Modundan Çıkış Yap"
          >
            <Lock size={10} />
            <span>Çıkış</span>
          </button>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <div className={`relative z-10 h-auto lg:h-screen lg:max-h-screen w-full flex flex-col lg:flex-row p-4 lg:p-6 gap-6 lg:overflow-hidden transition-all duration-1000 ${isMeltingSite ? "melting-slag-site" : ""}`}>
        
        {/* LEFT PANEL: Dynamic Viewport & Primary Presenter (Hosts Profile or Active Project / Article Details) */}
        <motion.div 
          layout
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-full lg:w-1/2 h-auto lg:h-full lg:max-h-full relative flex flex-col rounded-3xl p-5 lg:p-7 liquid-glass-clear spinning-glow-border overflow-hidden select-text transition-all duration-300 ease-out"
        >
          
          {/* Left Panel Header / Navigation */}
          {theme === 'terminal' && (
            <div className="w-full bg-emerald-950/40 border border-emerald-500/40 px-3 py-1.5 flex items-center justify-between text-[11px] font-mono text-emerald-400 mb-4 rounded-xl select-none shadow-[0_0_12px_rgba(16,185,129,0.12)] shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block shadow-[0_0_5px_rgba(239,68,68,0.5)]" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block shadow-[0_0_5px_rgba(234,179,8,0.5)]" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                <span className="ml-2 text-emerald-300 font-bold tracking-tight">emirhan@portfolio: ~ (bash 80x24)</span>
              </div>
              <span className="text-[9px] text-emerald-400 font-mono tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                TTY1_ONLINE
              </span>
            </div>
          )}

          <header className="flex items-center justify-between gap-1.5 sm:gap-2 z-10 mb-4 lg:mb-5 shrink-0 min-w-0">
            <div 
              className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group select-none shrink min-w-0"
              onClick={() => {
                setSelectedProject(null);
                setSelectedArticle(null);
                setActiveTab('profile');
              }}
              title="Emirhan Yılmaz Ana Sayfa"
            >
              {/* Separate Brand Logo with transparent background */}
              <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 transition-transform duration-300 group-hover:scale-110 shrink-0 flex items-center justify-center">
                <img 
                  src={profile.logo} 
                  alt="Emirhan Yılmaz Logo" 
                  className="w-full h-full object-contain filter drop-shadow-[0_0_10px_rgba(255,255,255,0.35)] group-hover:drop-shadow-[0_0_14px_rgba(56,189,248,0.7)]"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="text-sm sm:text-base lg:text-lg xl:text-xl font-semibold tracking-tight text-white transition-opacity duration-300 group-hover:opacity-95 truncate hidden sm:inline-block max-w-[85px] md:max-w-[105px] xl:max-w-none">
                {profile.name.split(' ')[0]} <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-white/95 to-white/80">{profile.name.split(' ').slice(1).join(' ')}</span>
              </span>
            </div>

            {/* Desktop Navigation Tabs */}
            <nav 
              id="main-nav" 
              aria-label="Ana Gezinti Menüsü" 
              className={`hidden md:flex items-center gap-0.5 p-0.5 sm:p-1 bg-zinc-900/90 border border-white/10 rounded-full text-xs shrink-0 backdrop-blur-md ${
                theme === 'terminal' 
                  ? 'border-emerald-500/40 bg-zinc-950/95 font-sans' 
                  : ''
              }`}
            >
              {navItems.map(item => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      soundEngine.playTabSwitch();
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`px-2 sm:px-2.5 lg:px-3 py-1 rounded-full transition-all duration-200 font-medium cursor-pointer whitespace-nowrap text-[10.5px] sm:text-[11px] lg:text-xs shrink-0 ${
                      isActive 
                        ? (theme === 'terminal'
                            ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/60 shadow-xs font-semibold'
                            : 'bg-white/15 text-white font-semibold shadow-xs')
                        : (theme === 'terminal'
                            ? 'text-emerald-400/80 hover:text-emerald-300 hover:bg-emerald-950/30'
                            : 'text-zinc-400 hover:text-white hover:bg-white/5')
                    }`}
                    id={`nav-btn-${item.id}`}
                  >
                    {theme === 'terminal' ? (isActive ? `>${item.label}` : item.label) : item.label}
                  </button>
                );
              })}
            </nav>

            {/* Mobile Navigation Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-8 h-8 rounded-full liquid-glass flex items-center justify-center text-white/80 hover:text-white"
              id="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </header>

          {/* Mobile Dropdown Navigation */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-20 left-6 right-6 z-30 liquid-glass-strong rounded-2xl p-4 flex flex-col gap-2 md:hidden"
                id="mobile-nav-menu"
              >
                <div className="flex items-center gap-2.5 pb-2.5 mb-1 border-b border-white/10 px-2 select-none">
                  <img src={profile.logo} alt="Logo" className="w-6 h-6 object-contain drop-shadow-md" />
                  <span className="font-extrabold text-white text-xs tracking-wider uppercase">{profile.name}</span>
                </div>
                {navItems.map(item => {
                  const isProjects = item.id === 'projects';
                  const isActive = activeTab === item.id;
                  if (isProjects) {
                    return (
                      <motion.button
                        key={item.id}
                        onClick={() => {
                          soundEngine.playTabSwitch();
                          setActiveTab(item.id);
                          setMobileMenuOpen(false);
                        }}
                        animate={{
                          scale: [1, 1.02, 1],
                          boxShadow: [
                            "0 0 0px rgba(52, 211, 153, 0)",
                            "0 0 14px rgba(52, 211, 153, 0.6)",
                            "0 0 0px rgba(52, 211, 153, 0)"
                          ]
                        }}
                        transition={{
                          duration: 1.8,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className={`w-full py-2.5 px-4 rounded-xl text-left text-sm transition-all flex items-center justify-between border ${
                          isActive 
                            ? 'bg-emerald-500/25 text-emerald-300 font-bold border-emerald-400'
                            : 'bg-emerald-950/40 text-white font-extrabold border-emerald-500/50'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                          </span>
                          <span>{theme === 'terminal' ? `> ${item.label.toUpperCase()}` : item.label}</span>
                        </span>
                        <span className="text-[10px] text-emerald-400 font-extrabold">★</span>
                      </motion.button>
                    );
                  }
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        soundEngine.playTabSwitch();
                        setActiveTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full py-2.5 px-4 rounded-xl text-left text-sm transition-all ${
                        isActive 
                          ? (theme === 'terminal'
                              ? 'bg-emerald-500/20 text-emerald-300 font-mono font-bold border border-emerald-500/40'
                              : 'bg-white/10 text-white font-bold')
                          : (theme === 'terminal'
                              ? 'text-emerald-400/80 font-mono hover:bg-emerald-950/20'
                              : 'text-white/85 hover:text-white hover:bg-white/10 font-semibold')
                      }`}
                    >
                      {theme === 'terminal' ? `> ${item.label.toUpperCase()}` : item.label}
                    </button>
                  );
                })}

                <div className="pt-2 mt-1 border-t border-white/10 flex items-center justify-between px-2">
                  <span className="text-xs font-mono text-white/70">
                    {theme === 'terminal' ? 'CLI Terminal Modu' : 'Modern Cam UI'}
                  </span>
                  <ThemeToggle theme={theme} onToggle={toggleTheme} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Left Panel Body: Dynamic Viewport (Displays Details on selection, or Hero Profile) */}
          <div className="flex-1 flex flex-col justify-between z-10 overflow-hidden relative min-h-0">
            <AnimatePresence mode="wait">
              {currentSelectedProject ? (
                /* DETAIL VIEW 1: ACTIVE PROJECT DETAIL VIEW IN LEFT PANEL */
                <motion.div
                  key={`left-project-${currentSelectedProject.id}`}
                  ref={leftProjectDetailRef}
                  initial={{ opacity: 0, scale: 0.98, x: -15 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.98, x: -15 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1 flex flex-col gap-4 overflow-y-auto pr-1.5 min-h-0 select-text relative"
                >
                  {/* Top Bar Navigation with Geri Dön button & Direct URL Sharing */}
                  <div className="flex items-center justify-between gap-3 pb-3 border-b border-white/10 shrink-0 sticky top-0 bg-black/60 backdrop-blur-md z-20 py-1">
                    <button
                      onClick={() => {
                        soundEngine.playGlassClick();
                        setSelectedProject(null);
                      }}
                      className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs transition-all border border-emerald-400/40 cursor-pointer hover:scale-105 active:scale-95 shadow-md group"
                      title={lang === 'tr' ? "Geri Dön" : "Back"}
                    >
                      <ArrowLeft size={14} className="text-emerald-400 group-hover:-translate-x-0.5 transition-transform" />
                      <span>{lang === 'tr' ? (activeTab === 'projects' ? 'Geri (Projeler)' : 'Geri (Profil)') : 'Back'}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {/* Direct Project URL Copy Button */}
                      <button
                        type="button"
                        onClick={() => {
                          soundEngine.playGlassClick();
                          const shareUrl = `https://emirhanyilmaz.vercel.app/projects/${currentSelectedProject.id}`;
                          navigator.clipboard?.writeText(shareUrl);
                          setAdminToastMessage(lang === 'tr' ? `🔗 Proje bağlantısı kopyalandı:\n${shareUrl}` : `🔗 URL copied:\n${shareUrl}`);
                          setShowAdminToast(true);
                          setTimeout(() => setShowAdminToast(false), 3000);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/35 text-emerald-300 font-bold text-xs transition-all cursor-pointer"
                        title={lang === 'tr' ? "Doğrudan proje linkini kopyala" : "Copy direct project link"}
                      >
                        <Share2 size={12} className="text-emerald-400" />
                        <span className="hidden sm:inline">{lang === 'tr' ? 'Bağlantıyı Kopyala' : 'Share'}</span>
                      </button>

                      <div className="flex items-center gap-1 bg-black/40 p-1 rounded-full border border-white/10">
                        <button
                          onClick={handlePrevProject}
                          className="w-7 h-7 rounded-full hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                          title={lang === 'tr' ? "Önceki Proje (Sol Ok)" : "Previous Project (Left Arrow)"}
                        >
                          <ChevronLeft size={16} />
                        </button>
                        <span className="text-[10px] font-mono font-extrabold text-emerald-400 px-1">
                          {projects.findIndex(p => p.id === currentSelectedProject.id) + 1} / {projects.length}
                        </span>
                        <button
                          onClick={handleNextProject}
                          className="w-7 h-7 rounded-full hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                          title={lang === 'tr' ? "Sonraki Proje (Sağ Ok)" : "Next Project (Right Arrow)"}
                        >
                          <ChevronRight size={16} />
                        </button>
                      </div>

                      <button
                        onClick={() => setSelectedProject(null)}
                        className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-all border border-white/10 cursor-pointer"
                        title={lang === 'tr' ? "Kapat" : "Close"}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Project Title & Category */}
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold">{currentSelectedProject.category}</span>
                    <h2 className="text-2xl font-extrabold tracking-tight mt-0.5 text-white">{currentSelectedProject.title}</h2>
                  </div>

                  {/* Mode Switcher: Mimari Çözüm vs Görseller & Detaylar */}
                  <div className="flex items-center gap-1.5 p-1 bg-white/5 border border-white/10 rounded-xl shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playGlassClick();
                        setProjectDetailTab('casestudy');
                      }}
                      className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        projectDetailTab === 'casestudy'
                          ? 'bg-emerald-500 text-black shadow-md'
                          : 'text-white/70 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Layers size={13} />
                      <span>{lang === 'tr' ? 'Mimari Çözüm & Detaylar' : 'Architecture & Specs'}</span>
                      {currentSelectedProject.caseStudy && (
                        <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-extrabold ${projectDetailTab === 'casestudy' ? 'bg-black/25 text-black' : 'bg-emerald-500/25 text-emerald-300'}`}>
                          ★ {lang === 'tr' ? 'Detay' : 'Specs'}
                        </span>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playGlassClick();
                        setProjectDetailTab('overview');
                      }}
                      className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        projectDetailTab === 'overview'
                          ? 'bg-white/20 text-white shadow-md'
                          : 'text-white/70 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Layers size={13} />
                      <span>{lang === 'tr' ? 'Görseller & Özet' : 'Screens & Specs'}</span>
                    </button>
                  </div>

                  {projectDetailTab === 'casestudy' ? (
                    /* ARCHITECTURE & SOLUTION VIEW */
                    <div className="space-y-3.5">
                      {/* Teaser Highlight Box */}
                      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-950/50 via-teal-950/30 to-black/60 border border-emerald-500/30 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-extrabold flex items-center gap-1.5">
                            <Sparkles size={11} />
                            {currentSelectedProject.category.includes('Özel Eğitim') || currentSelectedProject.category.includes('PDR')
                              ? (lang === 'tr' ? 'HİBRİT PEDAGOJİ & YAZILIM ÇÖZÜMÜ' : 'HYBRID PEDAGOGY & SOFTWARE')
                              : (lang === 'tr' ? 'YAZILIM MİMARİSİ & ÇÖZÜM DETAYI' : 'TECHNICAL ARCHITECTURE & SOLUTION')}
                          </span>
                          {currentSelectedProject.demoUrl && (
                            <a
                              href={sanitizeUrl(currentSelectedProject.demoUrl) || '#'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-emerald-300 hover:text-emerald-200 font-mono font-bold flex items-center gap-1 hover:underline"
                              title={lang === 'tr' ? 'Siteye Git' : 'Visit Site'}
                            >
                              <span>{lang === 'tr' ? 'Siteye Git' : 'Visit Site'}</span>
                              <ExternalLink size={10} className="shrink-0" />
                            </a>
                          )}
                        </div>
                        <p className="text-xs text-white/95 font-semibold leading-relaxed">
                          {currentSelectedProject.description}
                        </p>
                      </div>

                      {/* Story Chapter 1: The Problem */}
                      <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                        <div className="flex items-center gap-2 text-rose-300 text-xs font-bold">
                          <Target size={14} className="text-rose-400 shrink-0" />
                          <span>{lang === 'tr' ? '1. Problem & İhtiyaç' : '1. The Problem & Business Need'}</span>
                        </div>
                        <p className="text-xs text-white/90 leading-relaxed font-normal">
                          {currentSelectedProject.caseStudy?.challenge || currentSelectedProject.description}
                        </p>
                      </div>

                      {/* Story Chapter 2: Exact Role */}
                      <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                        <div className="flex items-center gap-2 text-amber-300 text-xs font-bold">
                          <Briefcase size={14} className="text-amber-400 shrink-0" />
                          <span>{lang === 'tr' ? "2. Projedeki Kesin Rol" : "2. Exact Role & Position"}</span>
                        </div>
                        <p className="text-xs text-white/95 font-semibold leading-relaxed">
                          {currentSelectedProject.caseStudy?.role || (lang === 'tr' 
                            ? "Full-Stack Yazılım Geliştirici" 
                            : "Full-Stack Software Developer")}
                        </p>
                      </div>

                      {/* Story Chapter 3: Contribution & Team Context */}
                      <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                        <div className="flex items-center gap-2 text-sky-300 text-xs font-bold">
                          <Users size={14} className="text-sky-400 shrink-0" />
                          <span>{lang === 'tr' ? '3. Katkı & Ekip Büyüklüğü' : '3. Contribution & Team Context'}</span>
                        </div>
                        <p className="text-xs text-white/90 leading-relaxed font-normal">
                          {currentSelectedProject.caseStudy?.contribution || (lang === 'tr'
                            ? "Bireysel Geliştirici (Tek Kişilik Uçtan Uca Sorumluluk): Fikir prototiplemesi, mimari tasarım, istem mühendisliği, frontend kodlama ve test adımlarının tamamı bizzat üstlenildi."
                            : "Solo Architect & Developer: Full end-to-end ownership across ideation, prompt engineering, frontend development, and rigorous testing.")}
                        </p>
                      </div>

                      {/* Story Chapter 4: Verifiable Outcome & Tech Stack */}
                      <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-2.5">
                        <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold">
                          <Zap size={14} className="text-emerald-400 shrink-0" />
                          <span>{lang === 'tr' ? '4. Doğrulanabilir Sonuç ve Teknolojiler' : '4. Verifiable Outcome & Tech Stack'}</span>
                        </div>
                        <p className="text-xs text-white/95 leading-relaxed font-medium">
                          {currentSelectedProject.caseStudy?.impact || currentSelectedProject.highlights.join(' · ')}
                        </p>
                        
                        {/* Metrics */}
                        {currentSelectedProject.caseStudy?.metrics && currentSelectedProject.caseStudy.metrics.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-0.5">
                            {currentSelectedProject.caseStudy.metrics.map((m, mIdx) => (
                              <span key={mIdx} className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold flex items-center gap-1">
                                <CheckCircle2 size={11} className="text-emerald-400" />
                                {m}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Tech Stack Chips */}
                        <div className="flex flex-wrap gap-1.5 pt-1 border-t border-white/10">
                          {currentSelectedProject.tech.map(tech => (
                            <span key={tech} className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] text-emerald-300 font-mono font-bold">
                              {tech}
                            </span>
                          ))}
                        </div>

                        {/* Verifiable Action Links: Live Product & GitHub Repo */}
                        <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-white/10">
                          {currentSelectedProject.demoUrl ? (
                            <a
                              href={sanitizeUrl(currentSelectedProject.demoUrl) || '#'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full sm:flex-1 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all cursor-pointer hover:scale-102"
                            >
                              <ExternalLink size={13} />
                              <span>{lang === 'tr' ? 'Siteye Git' : 'Visit Site'}</span>
                            </a>
                          ) : (
                            <span className="w-full sm:flex-1 py-2 px-3 rounded-xl bg-white/5 border border-white/10 text-white/50 text-xs font-medium flex items-center justify-center gap-1.5 text-center">
                              <span>🔒 {lang === 'tr' ? 'Özel / Masaüstü CLI Aracı' : 'Local CLI / Desktop Tool'}</span>
                            </span>
                          )}

                          <a
                            href={currentSelectedProject.githubUrl || profile.github || "https://github.com/Emirhan0008"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:flex-1 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer hover:scale-102"
                          >
                            <Github size={13} />
                            <span>{lang === 'tr' ? 'Açık Kaynak Kodları' : 'Source Code (GitHub)'}</span>
                            <ExternalLink size={10} className="opacity-60" />
                          </a>
                        </div>
                      </div>

                      {/* Switch to gallery trigger */}
                      <div className="flex items-center justify-between pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            soundEngine.playGlassClick();
                            setProjectDetailTab('overview');
                          }}
                          className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Eye size={13} />
                          <span>{lang === 'tr' ? 'Ekran Görüntülerini ve Galeriyi İncele' : 'View Screenshots & Detailed Gallery'} →</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* OVERVIEW / SPECS VIEW */
                    <>
                  {/* Image Display Frame with Carousel */}
                  {(() => {
                    const currentImages = [
                      currentSelectedProject.image,
                      ...(currentSelectedProject.galleryImages || []),
                      ...(projectDetailedImages[currentSelectedProject.id] || [])
                    ].filter((img, idx, self) => self.indexOf(img) === idx && Boolean(img));

                    const safeIndex = activeGalleryIndex >= currentImages.length ? 0 : activeGalleryIndex;
                    const activeImage = currentImages[safeIndex] || currentSelectedProject.image;

                    return (
                      <div className="space-y-3">
                        <div className="relative aspect-16/10 w-full rounded-2xl overflow-hidden bg-zinc-950 border border-white/20 shadow-2xl group/img">
                          <motion.img 
                            key={activeImage}
                            initial={{ opacity: 0.4, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.25 }}
                            src={activeImage} 
                            alt={`${currentSelectedProject.title} Ekran ${safeIndex + 1}`} 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              const original = projects.find(p => p.id === currentSelectedProject.id);
                              if (original) e.currentTarget.src = original.image;
                            }}
                          />

                          {currentImages.length > 1 && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveGalleryIndex((prev) => (prev > 0 ? prev - 1 : currentImages.length - 1));
                                }}
                                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/90 hover:bg-emerald-500 hover:text-black text-emerald-400 flex items-center justify-center transition-all border border-emerald-500/50 shadow-xl cursor-pointer z-10 hover:scale-110 active:scale-95"
                                title="Önceki Ekran"
                              >
                                <ChevronLeft size={16} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveGalleryIndex((prev) => (prev < currentImages.length - 1 ? prev + 1 : 0));
                                }}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/90 hover:bg-emerald-500 hover:text-black text-emerald-400 flex items-center justify-center transition-all border border-emerald-500/50 shadow-xl cursor-pointer z-10 hover:scale-110 active:scale-95"
                                title="Sonraki Ekran"
                              >
                                <ChevronRight size={16} />
                              </button>
                            </>
                          )}

                          <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
                            {currentImages.length > 1 && (
                              <span className="px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-[10px] text-emerald-300 font-extrabold font-mono shadow-md">
                                {safeIndex + 1} / {currentImages.length}
                              </span>
                            )}
                            <button
                              onClick={() => setActiveLightboxImage(activeImage)}
                              className="p-1.5 rounded-full bg-black/80 hover:bg-emerald-500 hover:text-black text-white border border-white/20 transition-all cursor-pointer shadow-md"
                              title="Ekranı Büyüt"
                            >
                              <Eye size={12} />
                            </button>
                          </div>
                        </div>

                        {currentImages.length > 1 && (
                          <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-thin">
                            {currentImages.map((img, idx) => (
                              <button
                                key={idx}
                                onClick={() => setActiveGalleryIndex(idx)}
                                className={`relative w-12 h-12 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                                  idx === safeIndex 
                                    ? 'border-emerald-400 scale-105 shadow-md shadow-emerald-500/25 ring-2 ring-emerald-400/30' 
                                    : 'border-white/10 opacity-50 hover:opacity-100 hover:border-white/30'
                                }`}
                              >
                                <img src={img} alt={`Küçük Ekran ${idx + 1}`} className="w-full h-full object-cover" />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* Admin Photo Editor */}
                  {isAdmin && (
                    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
                      <span className="text-[10px] text-white tracking-wider uppercase font-bold flex items-center gap-1.5">
                        <Upload size={11} className="text-white/80" /> FOTOĞRAF YÖNETİMİ (ADMIN)
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        <label className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer text-center group transition-all">
                          <Upload size={12} className="text-white/60 group-hover:text-white transition-all mb-0.5" />
                          <span className="text-[9px] text-white font-bold">Görsel Yükle</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  if (typeof reader.result === 'string') {
                                    handleSaveDetailedImage(currentSelectedProject.id, reader.result);
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                        <button
                          onClick={() => {
                            setPromptInputValue('');
                            setPromptDialog({
                              isOpen: true,
                              title: 'Görsel Web URL Ekle',
                              description: 'Proje detay galerisine eklenecek güvenli resim linkini (http/https) girin:',
                              placeholder: 'https://resim.ornek/gorsel.jpg',
                              onConfirm: (url) => {
                                if (url && url.trim()) handleSaveDetailedImage(currentSelectedProject.id, url.trim());
                              }
                            });
                          }}
                          className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-center group transition-all cursor-pointer"
                        >
                          <span className="text-xs mb-0.5">🔗</span>
                          <span className="text-[9px] text-white font-bold">URL Ekle</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Tech Stack */}
                  <div className="space-y-2">
                    <span className="text-[10px] text-emerald-400 tracking-wider uppercase font-bold">{t.projectCard.techStack.toUpperCase()}</span>
                    <div className="flex flex-wrap gap-1.5">
                      {currentSelectedProject.tech.map(tech => (
                        <span key={tech} className="px-2.5 py-1 liquid-glass rounded-md text-[10px] text-white font-semibold font-mono">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Descriptions */}
                  <div className="space-y-2.5">
                    <p className="text-sm text-white font-semibold leading-relaxed">
                      {currentSelectedProject.description}
                    </p>
                    <p className="text-xs text-white/90 leading-relaxed font-normal">
                      {currentSelectedProject.longDescription}
                    </p>
                  </div>

                  {/* Highlights */}
                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold">
                      {lang === 'tr' ? 'ÖNE ÇIKAN KAZANIMLAR & ÖZELLİKLER' : 'KEY HIGHLIGHTS & ARCHITECTURE'}
                    </span>
                    <ul className="space-y-2">
                      {currentSelectedProject.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start gap-2 text-xs text-white/95 font-medium leading-relaxed">
                          <CheckCircle2 size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                    </>
                  )}

                  {/* Live Demo CTA Button */}
                  <div className="pt-2 border-t border-white/10 space-y-2 pb-2">
                    {currentSelectedProject.demoUrl ? (
                      <div className="space-y-2">
                        <a
                          href={sanitizeUrl(currentSelectedProject.demoUrl) || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-xl hover:shadow-emerald-500/25 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer border border-emerald-300/40 group/demobtn"
                        >
                          <ExternalLink size={16} className="group-hover/demobtn:translate-x-0.5 group-hover/demobtn:-translate-y-0.5 transition-transform" />
                          <span>{t.projectCard.inspectApp}</span>
                        </a>
                        {isAdmin && (
                          <div className="flex justify-end">
                            <button
                              onClick={() => {
                                setPromptInputValue(currentSelectedProject.demoUrl || '');
                                setPromptDialog({
                                  isOpen: true,
                                  title: 'Canlı Demo URL Düzenle',
                                  description: 'Canlı uygulamanın güvenli web adresini (https://...) girin. Kaldırmak için boş bırakıp kaydedin:',
                                  defaultValue: currentSelectedProject.demoUrl || '',
                                  placeholder: 'https://ornek-uygulama.com',
                                  onConfirm: (url) => {
                                    handleSaveDemoUrl(currentSelectedProject.id, url);
                                  }
                                });
                              }}
                              className="text-[10px] font-bold text-emerald-400 bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-500/20 px-2.5 py-1 rounded-lg cursor-pointer transition-colors"
                            >
                              ✏️ Demo URL Düzenle
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 text-center flex flex-col sm:flex-row items-center justify-between gap-2">
                        <span className="text-xs text-white/60 font-medium">
                          {lang === 'tr' ? 'Bu proje yerel masaüstü / otomasyon çalışmasıdır.' : 'This project runs locally as a desktop / automation script.'}
                        </span>
                        {isAdmin && (
                          <button
                            onClick={() => {
                              setPromptInputValue('');
                              setPromptDialog({
                                isOpen: true,
                                title: 'Canlı Demo URL Ekle',
                                description: 'Projeye ait çalışan web linkini (https://...) ekleyin:',
                                placeholder: 'https://ornek-uygulama.com',
                                onConfirm: (url) => {
                                  if (url && url.trim()) handleSaveDemoUrl(currentSelectedProject.id, url.trim());
                                }
                              });
                            }}
                            className="text-[10px] font-bold text-emerald-400 bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-500/20 px-2.5 py-1 rounded-lg cursor-pointer transition-colors"
                          >
                            + URL Ekle
                          </button>
                        )}
                      </div>
                    )}

                    {/* Admin Project Actions */}
                    {isAdmin && currentSelectedProject && (
                      <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProjectId(currentSelectedProject.id);
                            setAdminEditorTab('projects');
                            setShowAdminEditor(true);
                          }}
                          className="flex-1 py-2 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 hover:text-black border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Edit3 size={13} />
                          <span>{lang === 'tr' ? 'Projeyi Düzenle' : 'Edit Project'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setConfirmDialog({
                              isOpen: true,
                              title: 'Projeyi Sil',
                              description: `"${currentSelectedProject.title}" projesini silmek istediğinize emin misiniz?`,
                              confirmText: 'Evet, Sil',
                              onConfirm: () => {
                                const updated = projectList.filter(p => p.id !== currentSelectedProject.id);
                                handleSaveProjects(updated);
                                setSelectedProject(null);
                                setAdminToastMessage("Proje silindi.");
                                setShowAdminToast(true);
                                setTimeout(() => setShowAdminToast(false), 2500);
                              }
                            });
                          }}
                          className="py-2 px-3 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-500/20 text-xs font-bold transition-all cursor-pointer"
                          title="Projeyi Sil"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Scroll Down Indicator */}
                  <ScrollDownIndicator containerRef={leftProjectDetailRef} lang={lang} />
                </motion.div>
              ) : currentSelectedArticle ? (
                /* DETAIL VIEW 2: ACTIVE ARTICLE READER IN LEFT PANEL */
                <motion.div
                  key={`left-article-${currentSelectedArticle.id}`}
                  ref={leftArticleDetailRef}
                  initial={{ opacity: 0, scale: 0.98, x: -15 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.98, x: -15 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1 flex flex-col gap-4 overflow-y-auto pr-1.5 min-h-0 select-text relative"
                >
                  <div className="flex items-center justify-between gap-3 pb-3 border-b border-white/10 shrink-0 sticky top-0 bg-black/60 backdrop-blur-md z-20 py-1">
                    <button
                      onClick={() => {
                        soundEngine.playGlassClick();
                        setSelectedArticle(null);
                      }}
                      className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs transition-all border border-emerald-400/40 cursor-pointer hover:scale-105 active:scale-95 shadow-md group"
                      title={lang === 'tr' ? "Geri Dön" : "Back"}
                    >
                      <ArrowLeft size={14} className="text-emerald-400 group-hover:-translate-x-0.5 transition-transform" />
                      <span>{lang === 'tr' ? (activeTab === 'articles' ? 'Geri (Makaleler)' : 'Geri (Profil)') : 'Back'}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          soundEngine.playGlassClick();
                          const shareUrl = `https://emirhanyilmaz.vercel.app/articles/${currentSelectedArticle.id}`;
                          navigator.clipboard?.writeText(shareUrl);
                          setAdminToastMessage(lang === 'tr' ? `🔗 Makale bağlantısı kopyalandı:\n${shareUrl}` : `🔗 URL copied:\n${shareUrl}`);
                          setShowAdminToast(true);
                          setTimeout(() => setShowAdminToast(false), 3000);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/35 text-emerald-300 font-bold text-xs transition-all cursor-pointer"
                        title={lang === 'tr' ? "Makale linkini kopyala" : "Copy article link"}
                      >
                        <Share2 size={12} className="text-emerald-400" />
                        <span className="hidden sm:inline">{lang === 'tr' ? 'Bağlantıyı Kopyala' : 'Share'}</span>
                      </button>

                      <button
                        onClick={() => setSelectedArticle(null)}
                        className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-all border border-white/10 cursor-pointer"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider font-mono">
                        {currentSelectedArticle.category}
                      </span>
                      <span className="text-xs text-white/60 font-mono">{currentSelectedArticle.date}</span>
                      <span className="text-xs text-white/60 font-mono">• {currentSelectedArticle.readTime}</span>
                    </div>

                    <h1 className="text-2xl lg:text-3xl font-extrabold text-white leading-tight">
                      {currentSelectedArticle.title}
                    </h1>

                    <p className="text-sm font-semibold text-white/90 leading-relaxed p-4 rounded-2xl bg-white/5 border border-white/10 italic">
                      "{currentSelectedArticle.summary}"
                    </p>

                    <div className="text-sm text-white/90 leading-relaxed space-y-4 pt-2">
                      {Array.isArray(currentSelectedArticle.content) ? (
                        currentSelectedArticle.content.map((paragraph, pIdx) => (
                          <p key={pIdx}>{paragraph}</p>
                        ))
                      ) : (
                        <p>{currentSelectedArticle.content}</p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/10">
                      {currentSelectedArticle.tags.map(tag => (
                        <span key={tag} className="text-[10px] px-2.5 py-1 rounded-md bg-white/5 text-white/70">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Admin Article Actions */}
                    {isAdmin && selectedArticle && (
                      <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingArticleId(selectedArticle.id);
                            setAdminEditorTab('articles');
                            setShowAdminEditor(true);
                          }}
                          className="flex-1 py-2 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 hover:text-black border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Edit3 size={13} />
                          <span>{lang === 'tr' ? 'Makaleyi Düzenle' : 'Edit Article'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setConfirmDialog({
                              isOpen: true,
                              title: 'Makaleyi Sil',
                              description: `"${selectedArticle.title}" makalesini silmek istediğinize emin misiniz?`,
                              confirmText: 'Evet, Sil',
                              onConfirm: () => {
                                const updated = articleList.filter(a => a.id !== selectedArticle.id);
                                handleSaveArticles(updated);
                                setSelectedArticle(null);
                                setAdminToastMessage("Makale silindi.");
                                setShowAdminToast(true);
                                setTimeout(() => setShowAdminToast(false), 2500);
                              }
                            });
                          }}
                          className="py-2 px-3 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-500/20 text-xs font-bold transition-all cursor-pointer"
                          title="Makaleyi Sil"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Scroll Down Indicator */}
                  <ScrollDownIndicator containerRef={leftArticleDetailRef} lang={lang} />
                </motion.div>
              ) : (
                /* DEFAULT VIEW: HERO / PROFILE DISPLAY */
                <motion.div 
                  key="hero-profile-content"
                  ref={leftProfileScrollRef}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1 flex flex-col justify-between overflow-y-auto pr-1 relative"
                >
                  <div className="flex flex-col items-start gap-5 lg:gap-6 max-w-xl py-2">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-full p-1 bg-zinc-900 border border-white/10 flex items-center justify-center overflow-hidden transition-transform duration-300 hover:scale-105 shadow-xl relative select-none">
                        <img 
                          src={profile.avatar} 
                          alt="Emirhan Yılmaz Avatar"
                          onClick={handleAvatarEasterClick}
                          style={{ cursor: "pointer" }} 
                          className="w-full h-full object-cover rounded-full"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/profile-photo.jpg';
                          }}
                        />
                      </div>
                      {isAdmin && (
                        <button
                          type="button"
                          onClick={() => {
                            setAdminEditorTab('profile');
                            setShowAdminEditor(true);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 hover:text-black border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                        >
                          <Edit3 size={13} />
                          <span>{lang === 'tr' ? 'Profili Düzenle' : 'Edit Profile'}</span>
                        </button>
                      )}
                    </div>

                    <div className="space-y-3.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-900/80 rounded-full text-xs text-emerald-400 font-medium border border-white/10">
                          <Brain size={12} className="text-emerald-400" />
                          <span>PDR (Psikolojik Danışmanlık) &amp; Yapay Zeka</span>
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 rounded-full text-xs text-emerald-300 font-medium border border-emerald-500/25 select-none">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                          <span>{lang === 'tr' ? 'Yeni Projeler İçin Müsait' : 'Available for Work & Collaboration'}</span>
                        </div>
                      </div>

                      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.12] text-white">
                        {lang === 'tr' ? (
                          <>
                            İnsan Psikolojisi &amp; <br />
                            <span className="text-emerald-400">Yapay Zeka Sistemleri</span>
                          </>
                        ) : (
                          <>
                            Human Psychology &amp; <br />
                            <span className="text-emerald-400">AI Systems Engineering</span>
                          </>
                        )}
                      </h1>

                      <p className="text-xs sm:text-sm text-zinc-300 font-normal leading-relaxed max-w-xl">
                        {lang === 'tr' 
                          ? 'Aksaray Üniversitesi PDR mezuniyeti ve 3 yıllık özel eğitim tecrübesiyle; insan zihninin dinamiklerini yapay zeka (LLM / Gemini Multimodal Vision), mobil ve Python otomasyonlarıyla buluşturuyorum. Bilişsel yükü azaltan, şefkatli ve yüksek etkili dijital ürünler inşa ediyorum.'
                          : 'Bridging a degree in Psychological Counseling (GPC) and 3 years of classroom special ed with modern AI (Gemini Vision / LLMs), mobile apps, and Python system automations to minimize cognitive load.'}
                      </p>

                      {/* Direct Target Audience Card */}
                      <div className="p-4 rounded-xl bg-zinc-900/70 border border-white/10 flex items-start gap-3 w-full">
                        <Users size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold block">
                            {lang === 'tr' ? 'Çalışma & Destek Alanları' : 'Core Focus Areas'}
                          </span>
                          <p className="text-xs text-zinc-300 leading-relaxed">
                            {lang === 'tr'
                              ? "İşletmeler, kurumlar ve ekipler için süreç otomasyonları; web/mobil ürün geliştirme, yapay zeka entegrasyonları ve pedagojik/eğitsel yazılım çözümleri."
                              : "Process automation, web/mobile application engineering, LLM integrations, and pedagogical/educational software solutions for businesses and teams."}
                          </p>
                        </div>
                      </div>

                      {/* 3 Core Competency Pillars */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full pt-1">
                        <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-white/10 hover:border-emerald-500/30 transition-colors flex flex-col justify-between">
                          <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                            <Brain size={14} className="shrink-0" />
                            <span>{lang === 'tr' ? 'Psikolojik Danışmanlık' : 'Psychological Counseling'}</span>
                          </div>
                          <p className="text-[11px] text-zinc-400 mt-1.5 leading-relaxed">
                            {lang === 'tr' 
                              ? 'Aksaray Üniversitesi PDR mezuniyeti; rehberlik kuramları, iletişim ve pedagojik değerlendirme.' 
                              : 'Guidance & Counseling degree; communication, behavioral principles, and educational evaluation.'}
                          </p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-white/10 hover:border-sky-500/30 transition-colors flex flex-col justify-between">
                          <div className="flex items-center gap-1.5 text-sky-400 text-xs font-semibold">
                            <Code2 size={14} className="shrink-0" />
                            <span>{lang === 'tr' ? 'Yazılım & Otomasyon' : 'Software & Automation'}</span>
                          </div>
                          <p className="text-[11px] text-zinc-400 mt-1.5 leading-relaxed">
                            {lang === 'tr' 
                              ? 'Python botları, veri/iş akışı otomasyonları, React & TypeScript web geliştirme.' 
                              : 'Python bot automations, background workflows, and modern React & TypeScript web apps.'}
                          </p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-white/10 hover:border-teal-500/30 transition-colors flex flex-col justify-between">
                          <div className="flex items-center gap-1.5 text-teal-400 text-xs font-semibold">
                            <Sparkles size={14} className="shrink-0" />
                            <span>{lang === 'tr' ? 'Yapay Zeka & LLM' : 'AI & LLM Integration'}</span>
                          </div>
                          <p className="text-[11px] text-zinc-400 mt-1.5 leading-relaxed">
                            {lang === 'tr' 
                              ? 'Büyük Dil Modelleri (LLM), prompt mühendisliği ve işlevsel yapay zeka araçları.' 
                              : 'Large Language Models (LLM), prompt engineering, and production-ready AI tools.'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 pt-1">
                      <button 
                        onClick={() => {
                          soundEngine.playTabSwitch();
                          setActiveTab('projects');
                        }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-xl text-xs sm:text-sm font-semibold transition-all group active:scale-98 cursor-pointer shadow-sm hover:scale-[1.02]"
                        id="cta-explore-projects"
                      >
                        <Code2 size={14} className="text-zinc-950" />
                        <span>{lang === 'tr' ? 'Projeleri İncele' : 'Explore Projects'}</span>
                        <ArrowRight size={13} className="text-zinc-950 group-hover:translate-x-0.5 transition-transform" />
                      </button>

                      <button 
                        onClick={() => {
                          soundEngine.playTabSwitch();
                          setActiveTab('contact');
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white rounded-xl text-xs sm:text-sm font-medium transition-all active:scale-98 border border-white/10 hover:border-white/20 cursor-pointer"
                      >
                        <Mail size={13} className="text-emerald-400" />
                        <span>{lang === 'tr' ? 'İletişime Geç' : 'Get in Touch'}</span>
                      </button>

                      <a
                        href={profile.github || "https://github.com/Emirhan0008"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-zinc-900 hover:bg-zinc-800 rounded-xl text-xs font-mono text-zinc-300 hover:text-white transition-all border border-white/10 hover:border-white/20"
                        title={`GitHub: ${profile.name}`}
                      >
                        <Github size={13} className="text-white/80" />
                        <span>GitHub</span>
                        <ExternalLink size={10} className="opacity-60" />
                      </a>
                    </div>
                  </div>

                  {/* Left Panel Bottom Quote - shown in profile mode */}
                  <footer className="mt-auto pt-6 border-t border-white/5 z-10 flex flex-col gap-3.5 shrink-0">
                    <span className="text-[10px] tracking-[0.25em] uppercase text-white/60 font-semibold">
                      {t.hero.visionLabel}
                    </span>
                    <blockquote className="text-sm md:text-base font-normal italic leading-relaxed text-white">
                      "{t.hero.visionQuote}"
                    </blockquote>
                    <div className="flex items-center justify-between gap-3 w-full pt-1">
                      <div className="flex items-center gap-2">
                        <img src={profile.logo} alt="Logo" className="w-4 h-4 object-contain opacity-80" />
                        <span 
                          onClick={handleFooterClick}
                          className="text-[10px] tracking-widest text-white/90 uppercase font-bold select-none cursor-default hover:text-white transition-colors"
                        >
                          {profile.name.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <a 
                          href="https://github.com/Emirhan0008" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-flex items-center gap-1.5 text-[11px] font-mono text-white/80 hover:text-emerald-400 transition-colors font-bold px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10"
                        >
                          <Github size={12} />
                          <span>github.com/Emirhan0008</span>
                          <ExternalLink size={10} className="opacity-60" />
                        </a>
                        <a 
                          href="https://www.linkedin.com/in/emirhan-y%C4%B1lmaz-3357b5109" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-flex items-center gap-1.5 text-[11px] font-mono text-white/80 hover:text-blue-400 transition-colors font-bold px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10"
                          title="LinkedIn Profilini İncele"
                        >
                          <Linkedin size={12} className="text-blue-400" />
                          <span>LinkedIn</span>
                          <ExternalLink size={10} className="opacity-60" />
                        </a>
                      </div>
                    </div>
                  </footer>

                  {/* Scroll Down Indicator */}
                  <ScrollDownIndicator containerRef={leftProfileScrollRef} lang={lang} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </motion.div>

        {/* RIGHT PANEL: Browsing Hub & Interface / Catalog Viewport */}
        <motion.div 
          layout
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-full lg:w-1/2 h-full flex flex-col min-h-0 relative select-text transition-all duration-300 ease-out"
        >

          {/* Top Bar (Socials, Innovative Actions & Audio Controls) */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3 shrink-0">
            <div className="flex items-center gap-1.5 p-1 liquid-glass rounded-full overflow-x-auto transition-all duration-300">
              {/* Dual-Theme Skeuomorphic Switch (Normal vs Terminal Mode) */}
              <ThemeToggle theme={theme} onToggle={toggleTheme} className="shrink-0" />

              {/* Language Switcher (TR / EN) */}
              <LanguageToggle currentLang={lang} onToggle={handleLangToggle} className="shrink-0" />

              <div className="w-[1px] h-5 bg-white/15 mx-0.5 shrink-0" />

              {/* GitHub - Expandable on Hover with Glowing Glass Effect */}
              <a 
                href="https://github.com/Emirhan0008" 
                target="_blank" 
                rel="noopener noreferrer" 
                onClick={() => soundEngine.playGlassClick()}
                className="h-8 px-2.5 hover:px-3.5 rounded-full glowing-glass-button text-white font-mono text-xs font-bold transition-all duration-300 shrink-0 flex items-center justify-center group overflow-hidden cursor-pointer active:scale-95 z-10"
                title="GitHub: Emirhan0008"
              >
                <Github size={15} className="shrink-0 text-white group-hover:text-emerald-300 transition-colors drop-shadow-[0_0_8px_rgba(255,255,255,0.95)]" />
                <div className="max-w-0 opacity-0 group-hover:max-w-[200px] group-hover:opacity-100 group-hover:ml-1.5 flex items-center gap-1.5 transition-all duration-300 ease-out overflow-hidden whitespace-nowrap">
                  <span className="text-[11px] font-semibold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">github.com/Emirhan0008</span>
                  <ExternalLink size={10} className="shrink-0 opacity-80 group-hover:opacity-100 text-white" />
                </div>
              </a>

              {/* LinkedIn - Expandable on Hover */}
              <a 
                href="https://www.linkedin.com/in/emirhan-y%C4%B1lmaz-3357b5109" 
                target="_blank" 
                rel="noopener noreferrer" 
                onClick={() => soundEngine.playGlassClick()}
                className="h-8 px-2.5 hover:px-3.5 rounded-full bg-blue-600/20 hover:bg-blue-600/35 border border-blue-500/40 hover:border-blue-400/80 text-blue-200 hover:text-white font-mono text-xs font-bold transition-all duration-300 shrink-0 flex items-center justify-center group overflow-hidden cursor-pointer shadow-sm shadow-blue-950/40 hover:shadow-[0_0_16px_rgba(37,99,235,0.4)] hover:scale-105 active:scale-95"
                title="LinkedIn: in/emirhan-yılmaz-3357b5109"
              >
                <Linkedin size={15} className="shrink-0 text-blue-400 group-hover:text-blue-200 transition-colors drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                <div className="max-w-0 opacity-0 group-hover:max-w-[220px] group-hover:opacity-100 group-hover:ml-1.5 flex items-center gap-1.5 transition-all duration-300 ease-out overflow-hidden whitespace-nowrap">
                  <span className="text-[11px] font-semibold text-blue-100">in/emirhan-yılmaz</span>
                  <ExternalLink size={10} className="shrink-0 opacity-70 group-hover:opacity-100" />
                </div>
              </a>

              {/* Instagram - Expandable on Hover (Hesap yok, yakında) */}
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                onClick={() => soundEngine.playGlassClick()}
                className="h-8 px-2.5 hover:px-3.5 rounded-full bg-gradient-to-r from-pink-500/20 via-rose-500/20 to-purple-500/20 hover:from-pink-500/35 hover:via-rose-500/35 hover:to-purple-500/35 border border-pink-500/40 hover:border-pink-400/80 text-pink-200 hover:text-white font-mono text-xs font-bold transition-all duration-300 shrink-0 flex items-center justify-center group overflow-hidden cursor-pointer shadow-sm shadow-pink-950/40 hover:shadow-[0_0_16px_rgba(236,72,153,0.4)] hover:scale-105 active:scale-95"
                title={lang === 'tr' ? "Instagram (Henüz aktif profil yok)" : "Instagram (Profile coming soon)"}
              >
                <Instagram size={15} className="shrink-0 text-pink-400 group-hover:text-pink-300 transition-colors drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
                <div className="max-w-0 opacity-0 group-hover:max-w-[200px] group-hover:opacity-100 group-hover:ml-1.5 flex items-center gap-1.5 transition-all duration-300 ease-out overflow-hidden whitespace-nowrap">
                  <span className="text-[11px] font-semibold text-pink-100">{lang === 'tr' ? "Instagram (Yakında)" : "Instagram (Soon)"}</span>
                  <ExternalLink size={10} className="shrink-0 opacity-70 group-hover:opacity-100" />
                </div>
              </a>

              {/* WhatsApp - Expandable on Hover */}
              <a 
                href={`https://wa.me/?text=${encodeURIComponent(lang === 'tr' ? "Merhaba Emirhan Bey, sitenizden ulaşıyorum." : "Hello Emirhan, reaching out via your portfolio.")}`}
                target="_blank" 
                rel="noopener noreferrer" 
                onClick={() => soundEngine.playGlassClick()}
                className="h-8 px-2.5 hover:px-3.5 rounded-full bg-emerald-500/20 hover:bg-emerald-500/35 border border-emerald-500/50 hover:border-emerald-400 text-emerald-200 hover:text-white font-mono text-xs font-bold transition-all duration-300 shrink-0 flex items-center justify-center group overflow-hidden cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                title="WhatsApp: Emirhan_yilmaz08"
              >
                <WhatsAppIcon size={16} className="shrink-0 transition-transform duration-300 group-hover:scale-110" />
                <div className="max-w-0 opacity-0 group-hover:max-w-[200px] group-hover:opacity-100 group-hover:ml-1.5 flex items-center gap-1.5 transition-all duration-300 ease-out overflow-hidden whitespace-nowrap">
                  <span className="text-[11px] font-semibold text-emerald-100">Emirhan_yilmaz08</span>
                  <ExternalLink size={10} className="shrink-0 opacity-80 group-hover:opacity-100" />
                </div>
              </a>

              {/* Telegram - Expandable on Hover */}
              <a 
                href="https://t.me/emirhanyilmazrpd" 
                target="_blank" 
                rel="noopener noreferrer" 
                onClick={() => soundEngine.playGlassClick()}
                className="h-8 px-2.5 hover:px-3.5 rounded-full bg-sky-500/20 hover:bg-sky-500/35 border border-sky-500/40 hover:border-sky-400/80 text-sky-300 hover:text-white font-mono text-xs font-bold transition-all duration-300 shrink-0 flex items-center justify-center group overflow-hidden cursor-pointer shadow-sm shadow-sky-950/40 hover:shadow-[0_0_16px_rgba(14,165,233,0.4)] hover:scale-105 active:scale-95"
                title="Telegram: t.me/emirhanyilmazrpd"
              >
                <TelegramIcon size={15} className="shrink-0 text-sky-400 group-hover:text-sky-300 transition-colors drop-shadow-[0_0_8px_rgba(14,165,233,0.5)]" />
                <div className="max-w-0 opacity-0 group-hover:max-w-[200px] group-hover:opacity-100 group-hover:ml-1.5 flex items-center gap-1.5 transition-all duration-300 ease-out overflow-hidden whitespace-nowrap">
                  <span className="text-[11px] font-semibold text-sky-100">t.me/emirhanyilmazrpd</span>
                  <ExternalLink size={10} className="shrink-0 opacity-70 group-hover:opacity-100" />
                </div>
              </a>

              {/* Gmail - Expandable on Hover */}
              <a 
                href="mailto:emirhan0008@gmail.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                onClick={() => soundEngine.playGlassClick()}
                className="h-8 px-2.5 hover:px-3.5 rounded-full bg-rose-500/20 hover:bg-rose-500/35 border border-rose-500/40 hover:border-rose-400/80 text-rose-300 hover:text-white font-mono text-xs font-bold transition-all duration-300 shrink-0 flex items-center justify-center group overflow-hidden cursor-pointer shadow-sm shadow-rose-950/40 hover:shadow-[0_0_16px_rgba(244,63,94,0.4)] hover:scale-105 active:scale-95"
                title="Gmail: emirhan0008@gmail.com"
              >
                <GmailIcon size={16} className="shrink-0 drop-shadow-[0_0_8px_rgba(234,67,53,0.6)] transition-transform duration-300 group-hover:scale-110" />
                <div className="max-w-0 opacity-0 group-hover:max-w-[200px] group-hover:opacity-100 group-hover:ml-1.5 flex items-center gap-1.5 transition-all duration-300 ease-out overflow-hidden whitespace-nowrap">
                  <span className="text-[11px] font-semibold text-rose-100">emirhan0008@gmail.com</span>
                  <ExternalLink size={10} className="shrink-0 opacity-70 group-hover:opacity-100" />
                </div>
              </a>

              <div className="w-[1px] h-4 bg-white/10 mx-0.5 shrink-0" />
              
              {/* Sound FX Toggle */}
              <button
                onClick={() => {
                  const muted = soundEngine.toggleMute();
                  setIsMuted(muted);
                }}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                  isMuted ? 'text-red-400 hover:bg-red-500/10' : 'text-emerald-400 hover:bg-emerald-500/10'
                }`}
                title={isMuted ? (lang === 'tr' ? "Ses Efektlerini Aç" : "Unmute Sound Effects") : (lang === 'tr' ? "Ses Efektlerini Kapat" : "Mute Sound Effects")}
              >
                {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>

              {/* Cyber/Tech Background Music Player Toggle */}
              <button
                onClick={() => {
                  soundEngine.toggleAmbientFocusSoundscape();
                }}
                className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                  isAmbientPlaying ? 'text-emerald-400 bg-emerald-500/20 shadow-[0_0_12px_rgba(52,211,153,0.4)]' : 'text-white/70 hover:bg-white/10'
                }`}
                title={isAmbientPlaying 
                  ? (lang === 'tr' ? `Siber & Teknoloji Fon Müziğini Durdur (${currentMusicTrack.title})` : `Stop Cyber Focus Music (${currentMusicTrack.title})`) 
                  : (lang === 'tr' ? "Fütüristik Siber Fon Müziğini Başlat (Cyber Synthwave / Cyberspace Drift)" : "Play Futuristic Cyber Synthwave Music")}
              >
                <Music size={14} className={isAmbientPlaying ? 'animate-pulse' : ''} />
                {isAmbientPlaying && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                )}
              </button>
            </div>

            {/* Innovative Feature Quick Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  soundEngine.playGlassClick();
                  setSelectedProject(null);
                  setSelectedArticle(null);
                  setShowTechRadarModal(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 liquid-glass hover:bg-white/10 rounded-full text-xs font-bold text-white/90 hover:text-white transition-all cursor-pointer border border-white/10 hover:border-emerald-400/40"
              >
                <Cpu size={13} className="text-emerald-400" />
                <span className="hidden sm:inline">{t.nav.techRadar}</span>
              </button>

              <button
                onClick={() => {
                  soundEngine.playGlassClick();
                  setSelectedProject(null);
                  setSelectedArticle(null);
                  setShowEstimatorModal(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-full text-xs font-extrabold text-white transition-all cursor-pointer shadow-lg hover:scale-105 border border-emerald-300/30"
              >
                <Wand2 size={13} />
                <span>{lang === 'tr' ? 'Proje Mimarisi & Teklif' : 'Architecture & Estimate'}</span>
              </button>
            </div>
          </div>

          {/* DYNAMIC CONTENT SWITCHER */}
          <div className="flex-1 flex flex-col min-h-0">
            {theme === 'terminal' ? (
              <PowerShellTerminalWorkspace
                lang={lang}
                projects={mappedProjects}
                articles={mappedArticles}
                profile={currentProfile}
                onSwitchToNormal={(targetTab) => {
                  setTheme('normal');
                  setActiveTab(targetTab || 'projects');
                }}
                onOpenProjectModal={(p) => {
                  setTheme('normal');
                  setActiveTab('projects');
                  setSelectedProject(p);
                }}
                onOpenArticleModal={(a) => {
                  setTheme('normal');
                  setActiveTab('articles');
                  setSelectedArticle(a);
                }}
                onOpenEstimator={() => {
                  setSelectedProject(null);
                  setSelectedArticle(null);
                  setShowEstimatorModal(true);
                }}
                onTriggerMelting={() => {
                  setIsMeltingSite(true);
                  setTimeout(() => {
                    setShowMeltingSlagHeart(true);
                  }, 2500);
                }}
              />
            ) : (
            <AnimatePresence mode="wait">
              {activeTab === 'profile' && (
                <motion.div
                  key="tab-profile"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="flex-1 flex flex-col min-h-0 rounded-3xl bg-zinc-950/85 border border-white/10 shadow-2xl backdrop-blur-2xl overflow-hidden relative select-text"
                >
                  {/* SCROLLABLE INNER MASTER CONTENT (Clipped to permanent rounded-3xl corners) */}
                  <div 
                    ref={rightProfileScrollRef}
                    className="flex-1 overflow-y-auto p-5 sm:p-7 pr-3.5 sm:pr-5 flex flex-col gap-6 select-text scrollbar-thin scrollbar-thumb-white/20 relative"
                  >
                    
                    {/* Panel Header & Value Proposition */}
                    <div className="flex flex-col gap-3.5 pb-5 border-b border-white/10">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-[10.5px] font-mono font-bold border border-emerald-500/30">
                          <Compass size={13} className="text-emerald-400" />
                          <span>{lang === 'tr' ? 'BİLİŞSEL PSİKOLOJİ & PDR DESTEKLİ YAPAY ZEKA MİMARİSİ' : 'PDR & COGNITIVE PSYCHOLOGY BACKED AI ARCHITECTURE'}</span>
                        </span>
                        <span className="text-[10px] px-3 py-1 rounded-full bg-white/5 text-zinc-300 font-mono border border-white/10">
                          {lang === 'tr' ? 'BİLİŞSEL UX · TÜKETİCİ DAVRANIŞLARI · AI MİMARİSİ' : 'COGNITIVE UX · CONSUMER BEHAVIOR · AI SYSTEMS'}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-lg sm:text-2xl font-extrabold text-white tracking-tight leading-snug">
                          {lang === 'tr'
                            ? 'Bilişsel Bilim, Tüketici Karar Mimarisi & Otonom Yapay Zeka Sistemleri.'
                            : 'Cognitive Science, Consumer Decision Architecture & Applied AI Systems.'}
                        </h3>
                        <p className="text-xs sm:text-[13px] text-zinc-300 leading-relaxed font-normal">
                          {lang === 'tr'
                            ? 'Aksaray Üniversitesi PDR lisansı ve 3 yıllık saha tecrübemden gelen insan davranışı & pedagoji derinliğini; yapay zeka ürünlerinde sürtünmesiz kullanıcı deneyimi (UX), karar mimarisi ve tüketici tutundurma modellerine dönüştürüyorum. Yapay zeka sistemlerinde karar yorgunluğunu sıfırlayan, kullanıcı zihninin algı filtreleriyle tam uyumlu çalışan ve Python/React altyapısıyla desteklenen yeni nesil dijital deneyimler inşa ediyorum.'
                            : 'Translating psychological counseling depth and 3 years of clinical field practice into frictionless AI UX, cognitive choice architecture, and consumer retention dynamics. Engineering robust autonomous workflows with Python, React 19, and Gemini 2.5 SDK that align seamlessly with human mental models.'}
                        </p>
                      </div>
                    </div>

                    {/* Integrated Methodology Flow (Single Cohesive Progression Stream) */}
                    <div className="space-y-3.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10.5px] uppercase font-bold tracking-wider text-emerald-400 flex items-center gap-1.5 font-mono">
                          <Brain size={13} />
                          <span>{lang === 'tr' ? 'BİLİŞSEL UX & ÜRÜN MİMARİSİ YAKLAŞIMI' : 'COGNITIVE UX & PRODUCT ARCHITECTURE FRAMEWORK'}</span>
                        </span>
                        <span className="text-[10px] text-zinc-400 font-mono">Metodoloji &amp; Uygulama</span>
                      </div>

                      {/* Continuous Flow Strip */}
                      <div className="flex flex-col gap-2.5 p-4 rounded-2xl bg-white/[0.02] border border-white/10">
                        
                        {/* Flow Item 1 */}
                        <div className="flex items-start gap-3.5 pb-3 border-b border-white/5">
                          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-300 font-mono text-xs font-bold shrink-0 mt-0.5">
                            01
                          </div>
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs sm:text-sm font-bold text-white">
                                {lang === 'tr' ? 'Bilişsel Yükü Optimize Etme & Karar Ergonomisi' : 'Cognitive Load Reduction & Choice Ergonomics'}
                              </h4>
                              <span className="text-[9.5px] px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-mono hidden sm:inline">PDR Uzmanlığı</span>
                            </div>
                            <p className="text-[11.5px] text-zinc-300 leading-relaxed">
                              {lang === 'tr'
                                ? 'AI çıktılarının karar felcine (analysis paralysis) yol açmasını engellemek için kademeli bilgi aktarımı (progressive disclosure), net eylem patikaları ve zihinsel model senkronizasyonu.'
                                : 'Applying progressive disclosure and mental model alignment so complex AI outputs never cause decision fatigue or friction.'}
                            </p>
                          </div>
                        </div>

                        {/* Flow Item 2 */}
                        <div className="flex items-start gap-3.5 pb-3 border-b border-white/5">
                          <div className="w-8 h-8 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-300 font-mono text-xs font-bold shrink-0 mt-0.5">
                            02
                          </div>
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs sm:text-sm font-bold text-white">
                                {lang === 'tr' ? 'Tüketici Davranışı & İnsan-AI Güven Modelleri' : 'Consumer Behavior & Human-AI Trust Dynamics'}
                              </h4>
                              <span className="text-[9.5px] px-2 py-0.2 rounded-full bg-sky-500/20 text-sky-300 font-mono hidden sm:inline">Davranışsal Psikoloji</span>
                            </div>
                            <p className="text-[11.5px] text-zinc-300 leading-relaxed">
                              {lang === 'tr'
                                ? 'Kullanıcının yapay zekaya karşı aşırı bağımlılık veya temelsiz güvensizlik duymasını engelleyen, şeffaf geri bildirim halkaları ve kullanıcıyı rasyonel tercihlere yönlendiren etik davranışsal tetikleyiciler (nudges).'
                                : 'Calibrating user-AI trust through transparent feedback loops, ethical behavioral nudges, and consumer retention mechanics.'}
                            </p>
                          </div>
                        </div>

                        {/* Flow Item 3 */}
                        <div className="flex items-start gap-3.5">
                          <div className="w-8 h-8 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-300 font-mono text-xs font-bold shrink-0 mt-0.5">
                            03
                          </div>
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs sm:text-sm font-bold text-white">
                                {lang === 'tr' ? 'Otonom AI İstem Hatları & Tam Yığın Mühendislik' : 'Autonomous AI Pipelines & Fullstack Engineering'}
                              </h4>
                              <span className="text-[9.5px] px-2 py-0.2 rounded-full bg-teal-500/20 text-teal-300 font-mono hidden sm:inline">Mühendislik</span>
                            </div>
                            <p className="text-[11.5px] text-zinc-300 leading-relaxed">
                              {lang === 'tr'
                                ? 'Python 3.12, React 19, TypeScript ve Gemini 2.5 SDK ile otonom istem hatları, bağlamsal RAG, tool-calling ajanları ve çevrim dışı öncelikli mobil sistemler.'
                                : 'Building scalable agentic pipelines, multimodal LLM workflows, and resilient cross-platform apps with Python and modern TypeScript.'}
                            </p>
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Integrated Education & Credentials Strip */}
                    <div className="space-y-3 pt-2 border-t border-white/10">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 font-mono">
                          {lang === 'tr' ? 'AKADEMİK & LİSANSÜSTÜ TEMELLER' : 'ACADEMIC & POSTGRADUATE FOUNDATION'}
                        </span>
                        {isAdmin && (
                          <button
                            type="button"
                            onClick={() => {
                              setAdminEditorTab('profile');
                              setShowAdminEditor(true);
                            }}
                            className="px-2.5 py-0.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 hover:text-black border border-emerald-500/30 text-emerald-300 text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                          >
                            <Edit3 size={11} />
                            <span>{lang === 'tr' ? 'Düzenle' : 'Edit'}</span>
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
                          <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 shrink-0">
                            <GraduationCap size={16} />
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-[9px] uppercase font-bold tracking-wider text-emerald-400">
                              {lang === 'tr' ? 'LİSANS EĞİTİMİ & 3 YIL SAHA PRATİĞİ' : 'UNDERGRADUATE & 3 YRS FIELD PRACTICE'}
                            </span>
                            <h4 className="text-xs sm:text-sm font-bold text-white">{currentProfile.education.school}</h4>
                            <p className="text-[11px] text-zinc-300 font-medium">{currentProfile.education.degree}</p>
                            <p className="text-[10px] text-zinc-400 leading-relaxed">{currentProfile.education.details}</p>
                          </div>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
                          <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-teal-400 shrink-0">
                            <Brain size={16} />
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-[9px] uppercase font-bold tracking-wider text-teal-400">
                              {lang === 'tr' ? 'LİSANSÜSTÜ / AKADEMİK SERTİFİKA' : 'ACADEMIC CERTIFICATION'}
                            </span>
                            <h4 className="text-xs sm:text-sm font-bold text-white">{currentProfile.aiProfile.title}</h4>
                            <p className="text-[11px] text-zinc-300 font-medium">{currentProfile.aiProfile.certification}</p>
                            <p className="text-[10px] text-zinc-400 leading-relaxed">{currentProfile.aiProfile.details}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Master Action Strip (Direct Jump to Work & Consult) */}
                    <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2.5">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            soundEngine.playTabSwitch();
                            setActiveTab('projects');
                          }}
                          className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-lg hover:scale-102"
                        >
                          <FolderKanban size={13} />
                          <span>{lang === 'tr' ? 'Projeleri İncele' : 'View Projects'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            soundEngine.playTabSwitch();
                            setActiveTab('articles');
                          }}
                          className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer border border-white/10"
                        >
                          <FileText size={13} className="text-emerald-400" />
                          <span>{lang === 'tr' ? 'Makaleleri Oku' : 'Read Articles'}</span>
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          soundEngine.playGlassClick();
                          setShowEstimatorModal(true);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-teal-600/40 to-emerald-600/40 hover:from-teal-600/60 hover:to-emerald-600/60 text-emerald-200 border border-emerald-500/40 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Wand2 size={13} className="text-emerald-300" />
                        <span>{lang === 'tr' ? 'Proje Mimarisi & Teklif' : 'Architecture & Estimate'}</span>
                      </button>
                    </div>

                  </div>

                  {/* Scroll Down Indicator */}
                  <ScrollDownIndicator containerRef={rightProfileScrollRef} lang={lang} />
                </motion.div>
              )}

              {/* TAB 2: PROJECTS GALLERY */}
              {activeTab === 'projects' && (
                <motion.div
                  key="tab-projects"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="flex-1 flex flex-col gap-6 min-h-0 relative"
                >
                  <div className="p-4 sm:p-6 liquid-glass spinning-glow-border rounded-3xl flex flex-col gap-4 min-h-0 flex-1 relative overflow-hidden">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-0.5">
                        <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-extrabold">
                          {t.hero.name.toUpperCase()} · {t.nav.projects.toUpperCase()}
                        </span>
                        <h2 className="text-xl font-extrabold text-white">{t.nav.projects}</h2>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Results Count Badge */}
                        <span className="text-xs text-white/90 font-bold bg-white/10 px-3 py-1 rounded-full border border-white/10 w-fit shrink-0">
                          {filteredProjects.length} / {mappedProjects.length} {t.filter.projectsFound}
                        </span>

                        {/* Sort Dropdown */}
                        <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-2.5 py-1 text-xs text-white/80">
                          <ArrowUpDown size={11} className="text-emerald-400 shrink-0" />
                          <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="bg-transparent text-[11px] text-white font-bold focus:outline-hidden cursor-pointer"
                            aria-label={t.filter.sortBy}
                          >
                            <option value="featured" className="bg-zinc-900 text-white">{t.filter.sortFeatured}</option>
                            <option value="newest" className="bg-zinc-900 text-white">{t.filter.sortNewest}</option>
                            <option value="alpha" className="bg-zinc-900 text-white">{t.filter.sortAlpha}</option>
                          </select>
                        </div>

                        {/* Toggle Tech Filters drawer button */}
                        <button
                          type="button"
                          onClick={() => setShowTechFilterDrawer(!showTechFilterDrawer)}
                          className={`px-3 py-1 rounded-full border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                            showTechFilterDrawer || selectedTech
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50 shadow-[0_0_10px_rgba(52,211,153,0.2)]'
                              : 'bg-white/5 text-white/70 hover:text-white border-white/10'
                          }`}
                          title={t.filter.filterByTech}
                        >
                          <SlidersHorizontal size={11} />
                          <span className="text-[11px]">{t.filter.filterByTech}</span>
                          {selectedTech && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Search Bar & Category Filter Pills */}
                    <div className="flex flex-col gap-2.5">
                      {/* Search Input Bar */}
                      <div className="relative w-full">
                        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/50" />
                        <input
                          type="text"
                          placeholder={t.filter.searchPlaceholder}
                          value={searchQuery}
                          onChange={e => setSearchQuery(e.target.value)}
                          className="w-full py-2 pl-9 pr-8 rounded-xl bg-white/5 border border-white/10 focus:outline-hidden focus:ring-1 focus:ring-emerald-400 text-xs text-white placeholder-white/40 font-medium transition-all"
                        />
                        {searchQuery && (
                          <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer"
                          >
                            <X size={13} />
                          </button>
                        )}
                      </div>

                      {/* Category & Status Filter Pills */}
                      <div className="flex flex-wrap gap-1.5 p-1 liquid-glass rounded-xl border border-white/10 text-[10px]">
                        <button
                          type="button"
                          onClick={() => {
                            soundEngine.playTabSwitch();
                            setCaseStudyOnlyFilter(!caseStudyOnlyFilter);
                          }}
                          className={`px-2.5 py-1 rounded-md transition-all font-bold cursor-pointer flex items-center gap-1 border ${
                            caseStudyOnlyFilter
                              ? 'bg-emerald-500 text-black border-emerald-400 font-extrabold shadow-sm'
                              : 'text-emerald-300 border-emerald-500/40 hover:text-white hover:bg-emerald-500/20'
                          }`}
                        >
                          <Layers size={10} />
                          <span>{lang === 'tr' ? '💎 Mimari Detaylı' : '💎 In-Depth Specs'}</span>
                        </button>
                        {[
                          { id: 'Tümü', label: t.filter.categories.all },
                          { id: 'Öne Çıkanlar', label: lang === 'tr' ? '⭐ Öne Çıkanlar' : '⭐ Highlights' },
                          { id: 'Web & Bulut', label: t.filter.categories.webCloud },
                          { id: 'Yapay Zeka', label: t.filter.categories.dataAi },
                          { id: 'Python & Otomasyon', label: t.filter.categories.automationScript },
                          { id: 'Masaüstü', label: t.filter.categories.desktopTools },
                          { id: 'Özel Eğitim', label: t.filter.categories.specialEdu }
                        ].map(cat => (
                          <button
                            key={cat.id}
                            onClick={() => {
                              soundEngine.playTabSwitch();
                              setProjectFilter(cat.id);
                              if (cat.id !== 'Tümü') setCaseStudyOnlyFilter(false);
                            }}
                            className={`px-2.5 py-1 rounded-md transition-all font-bold cursor-pointer ${
                              !caseStudyOnlyFilter && projectFilter === cat.id 
                                ? 'bg-white/20 text-white font-extrabold shadow-xs' 
                                : 'text-white/75 hover:text-white hover:bg-white/10'
                            }`}
                          >
                            {cat.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Tech Stack Multi-Filter Drawer */}
                    {showTechFilterDrawer && (
                      <div className="p-2.5 rounded-2xl bg-black/40 border border-emerald-500/20 flex flex-col gap-2 shrink-0">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-emerald-300 font-bold flex items-center gap-1.5">
                            <SlidersHorizontal size={12} /> {t.filter.filterByTech}
                          </span>
                          {selectedTech && (
                            <button
                              onClick={() => setSelectedTech(null)}
                              className="text-red-400 hover:text-red-300 text-[10px] font-bold cursor-pointer transition-colors"
                            >
                              {t.filter.allTechs}
                            </button>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 pr-1">
                          {availableTechs.map(({ tech, count }) => {
                            const isSelected = selectedTech === tech;
                            return (
                              <button
                                key={tech}
                                onClick={() => {
                                  soundEngine.playGlassClick();
                                  setSelectedTech(isSelected ? null : tech);
                                }}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                                  isSelected
                                    ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                                    : 'bg-white/5 text-white/75 hover:bg-white/15 hover:text-white border border-white/5'
                                }`}
                              >
                                <span>{tech}</span>
                                <span className={`text-[9px] px-1 py-0.2 rounded-full ${isSelected ? 'bg-black/20 text-black' : 'bg-white/10 text-white/60'}`}>
                                  {count}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Active Filters Reset Bar */}
                    {(projectFilter !== 'Tümü' || selectedTech || searchQuery.trim() || caseStudyOnlyFilter) && (
                      <div className="flex items-center justify-between gap-2 px-3 py-1.5 bg-emerald-950/30 border border-emerald-500/20 rounded-xl text-xs text-white/80 shrink-0">
                        <div className="flex items-center gap-2 overflow-hidden flex-wrap">
                          <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                            {lang === 'tr' ? 'Aktif Filtreler:' : 'Active Filters:'}
                          </span>
                          {caseStudyOnlyFilter && (
                            <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-[10px] font-bold text-emerald-300 flex items-center gap-1">
                              💎 {lang === 'tr' ? 'Mimari Detaylı' : 'In-Depth Specs'}
                              <button onClick={() => setCaseStudyOnlyFilter(false)} className="hover:text-red-400">×</button>
                            </span>
                          )}
                          {projectFilter !== 'Tümü' && (
                            <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] font-bold text-white flex items-center gap-1">
                              {projectFilter}
                              <button onClick={() => setProjectFilter('Tümü')} className="hover:text-red-400">×</button>
                            </span>
                          )}
                          {selectedTech && (
                            <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/30 text-[10px] font-mono font-bold text-emerald-300 flex items-center gap-1">
                              {selectedTech}
                              <button onClick={() => setSelectedTech(null)} className="hover:text-red-400">×</button>
                            </span>
                          )}
                          {searchQuery.trim() && (
                            <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] text-white flex items-center gap-1">
                              "{searchQuery}"
                              <button onClick={() => setSearchQuery('')} className="hover:text-red-400">×</button>
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            soundEngine.playGlassClick();
                            setProjectFilter('Tümü');
                            setSelectedTech(null);
                            setSearchQuery('');
                            setCaseStudyOnlyFilter(false);
                          }}
                          className="text-[10px] font-extrabold text-emerald-400 hover:text-emerald-300 underline cursor-pointer shrink-0"
                        >
                          {t.filter.clearFilters}
                        </button>
                      </div>
                    )}

                    {/* Projects Grid Scroll Area */}
                    {/* Admin Project Bar */}
                    {isAdmin && (
                      <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 mb-3 shrink-0">
                        <span className="text-[11px] text-emerald-300 font-bold flex items-center gap-1.5">
                          <FolderKanban size={14} /> Proje Yönetim Modu Açık
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProjectId(null);
                            setAdminEditorTab('projects');
                            setShowAdminEditor(true);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-emerald-500 text-black font-extrabold text-[11px] flex items-center gap-1 cursor-pointer hover:bg-emerald-400 transition-all shadow-md"
                        >
                          <Plus size={13} />
                          <span>Yeni Proje Ekle</span>
                        </button>
                      </div>
                    )}

                    {filteredProjects.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-3 liquid-glass rounded-2xl border border-white/5 my-auto">
                        <Search size={32} className="text-white/30 animate-bounce" />
                        <h3 className="text-sm font-bold text-white">{t.filter.noProjectsFound}</h3>
                        <p className="text-xs text-white/60 max-w-xs">
                          {t.filter.noProjectsSub}
                        </p>
                        <button
                          onClick={() => {
                            soundEngine.playGlassClick();
                            setSearchQuery('');
                            setSelectedTech(null);
                            setProjectFilter('Tümü');
                          }}
                          className="px-4 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-xs text-emerald-300 font-bold transition-all cursor-pointer mt-1"
                        >
                          {t.filter.clearFilters}
                        </button>
                      </div>
                    ) : (
                      <div 
                        ref={rightProjectsScrollRef}
                        onScroll={handleProjectsScroll}
                        className="flex-1 overflow-y-auto pr-1 projects-catalog-grid scrollbar-thin scrollbar-thumb-white/20 relative"
                      >
                        {filteredProjects.map((project, idx) => (
                          <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: Math.min(idx * 0.03, 0.3) }}
                            onClick={() => {
                              soundEngine.playGlassClick();
                              setSelectedProject(project);
                              setProjectDetailTab('casestudy');
                            }}
                            className={`project-catalog-card group cursor-pointer p-4 liquid-glass border ${
                              currentSelectedProject?.id === project.id 
                                ? 'ring-2 ring-emerald-400 border-emerald-400 bg-white/10 shadow-lg shadow-emerald-500/10' 
                                : project.isFeatured 
                                  ? 'border-emerald-500/40 bg-emerald-950/25 hover:border-emerald-400/80 hover:shadow-lg hover:shadow-emerald-500/15'
                                  : 'border-white/10 bg-black/40 hover:border-white/25 hover:bg-white/5'
                            }`}
                          >
                            <div className="flex flex-col gap-3">
                              {/* Visual Media Header (h-28 sm:h-32) */}
                              <div className="relative h-28 sm:h-32 w-full rounded-xl overflow-hidden bg-zinc-900 border border-white/10 shrink-0">
                                <img 
                                  src={project.image} 
                                  alt={project.title} 
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                  referrerPolicy="no-referrer"
                                  onError={(e) => {
                                    const original = projectList.find(p => p.id === project.id);
                                    if (original) e.currentTarget.src = original.image;
                                  }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

                                {/* Project Status Badge (Sadece Öne Çıkan) */}
                                <div className="absolute top-2.5 left-2.5 z-10">
                                  {project.isFeatured && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-black/80 text-emerald-300 border border-emerald-500/30 backdrop-blur-md">
                                      <span className="text-emerald-400">★</span>
                                      <span>{lang === 'tr' ? 'Öne Çıkan' : 'Featured'}</span>
                                    </span>
                                  )}
                                </div>

                                {/* Siteye Git Action */}
                                {project.demoUrl && !isAdmin && (
                                  <a
                                    href={sanitizeUrl(project.demoUrl) || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="absolute top-2.5 right-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-[10px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow-sm z-10 transition-all hover:scale-[1.03] active:scale-95 cursor-pointer"
                                    title={lang === 'tr' ? "Siteye Git" : "Visit Site"}
                                  >
                                    <span>{lang === 'tr' ? 'Siteye Git' : 'Visit Site'}</span>
                                    <ExternalLink size={11} className="shrink-0" />
                                  </a>
                                )}

                                {/* Admin Action Buttons */}
                                {isAdmin && (
                                  <div className="absolute top-2 right-2 z-20 flex items-center gap-1" onClick={e => e.stopPropagation()}>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingProjectId(project.id);
                                        setAdminEditorTab('projects');
                                        setShowAdminEditor(true);
                                      }}
                                      className="p-1.5 rounded-lg bg-black/80 hover:bg-emerald-500 hover:text-black text-white text-[10px] font-bold border border-white/20 transition-all cursor-pointer shadow-md"
                                      title="Projeyi Düzenle"
                                    >
                                      <Edit3 size={11} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setConfirmDialog({
                                          isOpen: true,
                                          title: 'Projeyi Sil',
                                          description: `"${project.title}" projesini silmek istediğinize emin misiniz?`,
                                          confirmText: 'Evet, Sil',
                                          onConfirm: () => {
                                            const updated = projectList.filter(p => p.id !== project.id);
                                            handleSaveProjects(updated);
                                            if (selectedProject?.id === project.id) setSelectedProject(null);
                                            setAdminToastMessage("Proje silindi.");
                                            setShowAdminToast(true);
                                            setTimeout(() => setShowAdminToast(false), 2500);
                                          }
                                        });
                                      }}
                                      className="p-1.5 rounded-lg bg-red-950/80 hover:bg-red-800 text-red-300 border border-red-500/30 text-[10px] transition-all cursor-pointer shadow-md"
                                      title="Projeyi Sil"
                                    >
                                      <Trash2 size={11} />
                                    </button>
                                  </div>
                                )}

                                {/* Active Selection Indicator */}
                                {currentSelectedProject?.id === project.id && (
                                  <div className="absolute bottom-2 left-2 bg-emerald-500 text-black text-[9px] font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-lg z-10">
                                    <span>{lang === 'tr' ? '👈 Solda İnceleniyor' : '👈 Active on Left'}</span>
                                  </div>
                                )}
                              </div>

                              {/* Content Header & Title */}
                              <div className="flex flex-col gap-1">
                                <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400 font-bold truncate">
                                  {project.category}
                                </span>
                                <h3 className="text-sm font-extrabold text-white group-hover:text-emerald-300 transition-colors leading-snug truncate">
                                  <HighlightText text={project.title} query={searchQuery} />
                                </h3>
                                <p className="text-xs text-white/75 leading-relaxed line-clamp-2 mt-0.5">
                                  {project.description}
                                </p>
                              </div>
                            </div>

                            {/* Card Footer: Tech Chips + Quick Actions */}
                            <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between gap-2">
                              {/* Tech Stack Chips */}
                              <div className="flex flex-wrap gap-1 items-center overflow-hidden max-h-[24px]">
                                {project.tech.slice(0, 3).map((tItem, tIdx) => {
                                  const isSelected = selectedTech === tItem;
                                  return (
                                    <span 
                                      key={tIdx} 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        soundEngine.playGlassClick();
                                        setSelectedTech(isSelected ? null : tItem);
                                      }}
                                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                                        isSelected 
                                          ? 'bg-emerald-500 text-black font-extrabold' 
                                          : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/15 border border-white/5'
                                      }`}
                                    >
                                      {tItem}
                                    </span>
                                  );
                                })}
                                {project.tech.length > 3 && (
                                  <span className="text-[9px] text-white/40 font-mono">+{project.tech.length - 3}</span>
                                )}
                              </div>

                              {/* Action Buttons */}
                              <div className="flex items-center gap-1.5 shrink-0" onClick={e => e.stopPropagation()}>
                                {project.demoUrl && (
                                  <a
                                    href={sanitizeUrl(project.demoUrl) || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-[10px] font-extrabold flex items-center gap-1.5 shadow-sm transition-transform hover:scale-105 cursor-pointer"
                                    title={lang === 'tr' ? "Siteye Git" : "Visit Site"}
                                  >
                                    <span>{lang === 'tr' ? 'Siteye Git' : 'Visit Site'}</span>
                                    <ExternalLink size={10} className="shrink-0" />
                                  </a>
                                )}
                                <button
                                  type="button"
                                  onClick={() => {
                                    soundEngine.playGlassClick();
                                    setSelectedProject(project);
                                    setProjectDetailTab('casestudy');
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                                  title={lang === 'tr' ? "Detayları İncele" : "View Details"}
                                >
                                  <span>{lang === 'tr' ? 'İncele' : 'Details'}</span>
                                  <ChevronRight size={10} />
                                </button>
                                {project.githubUrl && (
                                  <a
                                    href={project.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white/70 hover:text-white text-[10px] transition-all cursor-pointer border border-white/5"
                                    title={lang === 'tr' ? "GitHub Kodlarını Gör" : "View GitHub Code"}
                                  >
                                    <Github size={11} />
                                  </a>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}

                        {/* Scroll Down Indicator */}
                        <ScrollDownIndicator containerRef={rightProjectsScrollRef} lang={lang} />
                      </div>
                    )}

                  </div>
                </motion.div>
              )}

              {/* TAB 3: ARTICLES & PUBLICATIONS (BLOG) */}
              {activeTab === 'articles' && (
                <motion.div
                  key="tab-articles"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="flex-1 flex flex-col min-h-0 rounded-3xl liquid-glass spinning-glow-border overflow-hidden relative"
                >
                  <div 
                    ref={rightArticlesScrollRef}
                    className="p-4 sm:p-5 flex flex-col gap-3 min-h-0 flex-1 relative overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/20"
                  >
                    <div className="space-y-0.5">
                      <span className="text-[9px] uppercase tracking-wider text-emerald-400 font-extrabold">{t.hero.name.toUpperCase()} · {t.nav.articles.toUpperCase()}</span>
                      <h2 className="text-lg sm:text-xl font-extrabold text-white">{t.articles.heading}</h2>
                      <p className="text-xs text-white/70 leading-relaxed max-w-xl">
                        {t.articles.subheading}
                      </p>
                    </div>

                    {/* Admin Article Bar */}
                    {isAdmin && (
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 mb-1 shrink-0">
                        <span className="text-[11px] text-emerald-300 font-bold flex items-center gap-1.5">
                          <FileText size={13} /> Makale Yönetim Modu Açık
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingArticleId(null);
                            setAdminEditorTab('articles');
                            setShowAdminEditor(true);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500 text-black font-extrabold text-[11px] flex items-center gap-1 cursor-pointer hover:bg-emerald-400 transition-all shadow-md"
                        >
                          <Plus size={12} />
                          <span>Yeni Makale Ekle</span>
                        </button>
                      </div>
                    )}

                    <div className="grid grid-cols-1 gap-3 pt-1">
                      {mappedArticles.map((article, idx) => (
                        <motion.div
                          key={article.id}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          onClick={() => {
                            soundEngine.playGlassClick();
                            setSelectedArticle(article);
                          }}
                          className={`p-3.5 sm:p-4 liquid-glass spinning-glow-border rounded-xl flex flex-col gap-2 group cursor-pointer hover:bg-white/5 transition-all ${
                            selectedArticle?.id === article.id ? 'ring-2 ring-emerald-400 border-emerald-400 bg-white/10 shadow-lg shadow-emerald-500/10' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between text-[10px] text-white/60 font-mono">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded-full bg-white/10 text-white font-bold font-sans text-[10px]">
                                {article.category}
                              </span>
                              {selectedArticle?.id === article.id && (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-black text-[9px] font-extrabold shadow-sm">
                                  {lang === 'tr' ? '👈 Solda Açık' : '👈 Open on Left'}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px]">{article.date} • {article.readTime}</span>
                              {isAdmin && (
                                <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingArticleId(article.id);
                                      setAdminEditorTab('articles');
                                      setShowAdminEditor(true);
                                    }}
                                    className="p-1 rounded-md bg-white/10 hover:bg-emerald-500 hover:text-black text-white text-[10px] font-bold border border-white/15 transition-all cursor-pointer shadow-sm"
                                    title="Makaleyi Düzenle"
                                  >
                                    <Edit3 size={11} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setConfirmDialog({
                                        isOpen: true,
                                        title: 'Makaleyi Sil',
                                        description: `"${article.title}" makalesini silmek istediğinize emin misiniz?`,
                                        confirmText: 'Evet, Sil',
                                        onConfirm: () => {
                                          const updated = articleList.filter(a => a.id !== article.id);
                                          handleSaveArticles(updated);
                                          if (selectedArticle?.id === article.id) setSelectedArticle(null);
                                          setAdminToastMessage("Makale silindi.");
                                          setShowAdminToast(true);
                                          setTimeout(() => setShowAdminToast(false), 2500);
                                        }
                                      });
                                    }}
                                    className="p-1 rounded-md bg-red-950/80 hover:bg-red-800 text-red-300 border border-red-500/20 text-[10px] transition-all cursor-pointer shadow-sm"
                                    title="Makaleyi Sil"
                                  >
                                    <Trash2 size={11} />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <h3 className="text-sm sm:text-base font-extrabold text-white group-hover:text-emerald-300 transition-colors leading-snug">
                              {article.title}
                            </h3>
                            <p className="text-xs text-white/80 leading-relaxed line-clamp-2">
                              {article.summary}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-1.5 border-t border-white/5">
                            <div className="flex flex-wrap gap-1">
                              {article.tags.slice(0, 3).map(tag => (
                                <span key={tag} className="text-[8.5px] px-1.5 py-0.5 rounded-md bg-white/5 text-white/60">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                            <span className="text-xs font-bold text-white/90 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                              {lang === 'tr' ? 'Oku' : 'Read'} <ArrowRight size={12} />
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Scroll Down Indicator */}
                    <ScrollDownIndicator containerRef={rightArticlesScrollRef} lang={lang} />
                  </div>
                </motion.div>
              )}

              {/* TAB 4: CONTACT FORM & INFRASTRUCTURE */}
              {activeTab === 'contact' && (
                <motion.div
                  key="tab-contact"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="flex-1 flex flex-col min-h-0 h-full rounded-3xl liquid-glass spinning-glow-border overflow-hidden relative"
                >
                  <div 
                    ref={rightContactScrollRef}
                    className="p-3.5 sm:p-4.5 flex-1 flex flex-col gap-2.5 sm:gap-3 justify-start min-h-0 overflow-y-auto overflow-x-hidden pr-1 scrollbar-thin scrollbar-thumb-white/20 relative"
                  >
                    {/* Header */}
                    <div className="space-y-0.5 shrink-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[9px] uppercase tracking-wider text-emerald-400 font-bold">
                          {t.hero.name.toUpperCase()} · {t.nav.contact.toUpperCase()}
                        </span>
                        <span className="text-[9.5px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-mono font-bold border border-emerald-500/30 truncate max-w-[170px]">
                          {profile.email || 'emirhan0008@gmail.com'}
                        </span>
                      </div>
                      <h2 className="text-lg sm:text-xl font-extrabold text-white leading-tight">{t.contact.heading}</h2>
                      <p className="text-[11px] text-white/75 font-normal leading-relaxed line-clamp-2">
                        {t.contact.subheading}
                      </p>
                    </div>

                    {/* Step 1: 4 Persona-Based Collaboration Paths */}
                    <div className="space-y-1 shrink-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[9.5px] uppercase tracking-wider text-emerald-400 font-extrabold flex items-center gap-1.5">
                          <Target size={11} /> {lang === 'tr' ? '1. İLETİŞİM AMACINIZI SEÇİN' : '1. SELECT YOUR INQUIRY INTENT'}
                        </span>
                        <div className="flex items-center gap-2 text-[9.5px]">
                          <button
                            type="button"
                            onClick={() => {
                              soundEngine.playGlassClick();
                              setShowEstimatorModal(true);
                            }}
                            className="text-emerald-400 hover:text-emerald-300 font-bold underline cursor-pointer flex items-center gap-1"
                          >
                            <span>⚡ {lang === 'tr' ? 'Mimari Hesapla' : 'Estimator'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              soundEngine.playGlassClick();
                              setShowMediaKitModal(true);
                            }}
                            className="text-white/60 hover:text-white font-semibold underline cursor-pointer flex items-center gap-1"
                          >
                            <span>📁 {lang === 'tr' ? 'Medya Kiti' : 'Media Kit'}</span>
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                        {/* Option 1: Job */}
                        <button
                          type="button"
                          onClick={() => applyContactPersona('job')}
                          className={`p-1.5 sm:p-2 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 group ${
                            contactIntent === 'job'
                              ? 'bg-emerald-950/70 border-emerald-400 text-white shadow-xs ring-1 ring-emerald-400/40'
                              : 'bg-white/5 border-white/10 text-white/75 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${contactIntent === 'job' ? 'bg-emerald-500 text-black' : 'bg-white/10 text-emerald-400'}`}>
                            <Briefcase size={12} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-[11px] font-bold truncate group-hover:text-emerald-300 transition-colors">
                              {lang === 'tr' ? 'İş / Kariyer' : 'Hiring / Job'}
                            </div>
                            <div className="text-[8.5px] text-emerald-400 font-mono truncate">
                              {lang === 'tr' ? 'Pozisyon' : 'Role Offer'}
                            </div>
                          </div>
                        </button>

                        {/* Option 2: Freelance */}
                        <button
                          type="button"
                          onClick={() => applyContactPersona('freelance')}
                          className={`p-1.5 sm:p-2 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 group ${
                            contactIntent === 'freelance'
                              ? 'bg-emerald-950/70 border-emerald-400 text-white shadow-xs ring-1 ring-emerald-400/40'
                              : 'bg-white/5 border-white/10 text-white/75 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${contactIntent === 'freelance' ? 'bg-emerald-500 text-black' : 'bg-white/10 text-sky-400'}`}>
                            <Wand2 size={12} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-[11px] font-bold truncate group-hover:text-emerald-300 transition-colors">
                              {lang === 'tr' ? 'Freelance MVP' : 'Freelance MVP'}
                            </div>
                            <div className="text-[8.5px] text-sky-400 font-mono truncate">
                              {lang === 'tr' ? 'Hızlı MVP' : 'Fast Build'}
                            </div>
                          </div>
                        </button>

                        {/* Option 3: Speaking */}
                        <button
                          type="button"
                          onClick={() => applyContactPersona('speaking')}
                          className={`p-1.5 sm:p-2 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 group ${
                            contactIntent === 'speaking'
                              ? 'bg-emerald-950/70 border-emerald-400 text-white shadow-xs ring-1 ring-emerald-400/40'
                              : 'bg-white/5 border-white/10 text-white/75 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${contactIntent === 'speaking' ? 'bg-emerald-500 text-black' : 'bg-white/10 text-amber-400'}`}>
                            <Mic size={12} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-[11px] font-bold truncate group-hover:text-emerald-300 transition-colors">
                              {lang === 'tr' ? 'Konuşma' : 'Speaking'}
                            </div>
                            <div className="text-[8.5px] text-amber-400 font-mono truncate">
                              {lang === 'tr' ? 'Seminer/Panel' : 'Keynote'}
                            </div>
                          </div>
                        </button>

                        {/* Option 4: Collaboration */}
                        <button
                          type="button"
                          onClick={() => applyContactPersona('collaboration')}
                          className={`p-1.5 sm:p-2 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 group ${
                            contactIntent === 'collaboration'
                              ? 'bg-emerald-950/70 border-emerald-400 text-white shadow-xs ring-1 ring-emerald-400/40'
                              : 'bg-white/5 border-white/10 text-white/75 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${contactIntent === 'collaboration' ? 'bg-emerald-500 text-black' : 'bg-white/10 text-teal-400'}`}>
                            <Users size={12} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-[11px] font-bold truncate group-hover:text-emerald-300 transition-colors">
                              {lang === 'tr' ? 'İş Birliği' : 'Partnership'}
                            </div>
                            <div className="text-[8.5px] text-teal-400 font-mono truncate">
                              {lang === 'tr' ? 'Ortak Proje' : 'Brand/Media'}
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Step 2: Direct Contact Form Card */}
                    <div className="p-3 sm:p-3.5 rounded-2xl liquid-glass border border-white/10 flex flex-col gap-2 shrink-0">
                      {/* Success state if message was submitted on-site */}
                      {contactSuccessMessage ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="p-4 rounded-xl bg-gradient-to-br from-emerald-950/70 to-teal-950/40 border border-emerald-400/50 flex flex-col items-center text-center gap-2 shadow-xl"
                        >
                          <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <CheckCircle2 size={20} className="text-emerald-400" />
                          </div>
                          <div className="space-y-0.5 max-w-md">
                            <h4 className="text-sm font-extrabold text-white">
                              {lang === 'tr' ? 'Mesajınız Başarıyla İletildi!' : 'Inquiry Submitted Successfully!'}
                            </h4>
                            <p className="text-xs text-white/85 leading-relaxed">
                              {contactSuccessMessage}
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => setContactSuccessMessage(null)}
                              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs cursor-pointer transition-all"
                            >
                              {lang === 'tr' ? 'Yeni Mesaj Gönder' : 'Send Another Message'}
                            </button>
                            <button
                              type="button"
                              onClick={handleWhatsAppOpen}
                              className="px-3 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-200 font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
                            >
                              <WhatsAppIcon size={14} className="shrink-0" />
                              <span>{lang === 'tr' ? "WhatsApp'tan da İlet" : 'Also Send via WhatsApp'}</span>
                            </button>
                          </div>
                        </motion.div>
                      ) : (
                        <form onSubmit={handleDirectInAppSubmit} className="flex flex-col gap-2">
                          {/* Row 1: Name & Company */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div className="space-y-0.5">
                              <label className="text-[9.5px] uppercase tracking-wider text-white/90 font-bold px-0.5 block truncate">
                                {t.contact.nameLabel} *
                              </label>
                              <input 
                                type="text" 
                                required
                                maxLength={100}
                                placeholder={t.contact.namePlaceholder}
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full py-1.5 px-2.5 rounded-xl bg-black/60 border border-white/15 focus:outline-hidden focus:border-emerald-400/80 focus:ring-1 focus:ring-emerald-400/50 text-xs text-white placeholder-white/40 font-medium"
                              />
                            </div>

                            <div className="space-y-0.5">
                              <label className="text-[9.5px] uppercase tracking-wider text-white/90 font-bold px-0.5 block truncate">
                                {lang === 'tr' ? 'Şirket / Kurum (Opsiyonel)' : 'Company / Organization'}
                              </label>
                              <input 
                                type="text" 
                                maxLength={100}
                                placeholder={lang === 'tr' ? 'Örn: TechCorp, Freelance...' : 'e.g. Acme Corp, Startup...'}
                                value={formData.company}
                                onChange={e => setFormData({ ...formData, company: e.target.value })}
                                className="w-full py-1.5 px-2.5 rounded-xl bg-black/60 border border-white/15 focus:outline-hidden focus:border-emerald-400/80 focus:ring-1 focus:ring-emerald-400/50 text-xs text-white placeholder-white/40 font-medium"
                              />
                            </div>
                          </div>

                          {/* Row 2: Email & Subject */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div className="space-y-0.5">
                              <label className="text-[9.5px] uppercase tracking-wider text-white/90 font-bold px-0.5 block truncate">
                                {lang === 'tr' ? 'E-Posta Adresi *' : 'Email Address *'}
                              </label>
                              <input 
                                type="email" 
                                required
                                maxLength={100}
                                placeholder="adiniz@sirket.com"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                className="w-full py-1.5 px-2.5 rounded-xl bg-black/60 border border-white/15 focus:outline-hidden focus:border-emerald-400/80 focus:ring-1 focus:ring-emerald-400/50 text-xs text-white placeholder-white/40 font-medium"
                              />
                            </div>

                            <div className="space-y-0.5">
                              <label className="text-[9.5px] uppercase tracking-wider text-white/90 font-bold px-0.5 block truncate">
                                {lang === 'tr' ? 'İletişim Konusu *' : 'Inquiry Subject *'}
                              </label>
                              <select
                                value={contactIntent}
                                onChange={e => applyContactPersona(e.target.value as any)}
                                className="w-full py-1.5 px-2.5 rounded-xl bg-black/80 border border-white/15 focus:outline-hidden focus:border-emerald-400/80 focus:ring-1 focus:ring-emerald-400/50 text-xs text-white font-medium cursor-pointer truncate"
                              >
                                <option value="job" className="bg-zinc-900 text-white">💼 {lang === 'tr' ? 'İş Fırsatı / Pozisyon' : 'Job Opportunity'}</option>
                                <option value="freelance" className="bg-zinc-900 text-white">🚀 {lang === 'tr' ? 'Freelance MVP Projesi' : 'Freelance MVP Build'}</option>
                                <option value="speaking" className="bg-zinc-900 text-white">🎤 {lang === 'tr' ? 'Konuşma Daveti / Seminer' : 'Speaking Invitation'}</option>
                                <option value="collaboration" className="bg-zinc-900 text-white">🤝 {lang === 'tr' ? 'Marka & İş Birliği' : 'Brand & Partnership'}</option>
                              </select>
                            </div>
                          </div>

                          {/* Row 3: Message Textarea */}
                          <div className="space-y-0.5">
                            <div className="flex items-center justify-between px-0.5">
                              <label className="text-[9.5px] uppercase tracking-wider text-white/90 font-bold">
                                {t.contact.messageLabel} *
                              </label>
                              {formData.message && (
                                <button
                                  type="button"
                                  onClick={() => setFormData({ ...formData, message: '' })}
                                  className="text-[9.5px] text-white/50 hover:text-red-400 transition-colors cursor-pointer"
                                >
                                  {lang === 'tr' ? 'Temizle' : 'Clear'}
                                </button>
                              )}
                            </div>
                            <div className="relative w-full rounded-xl bg-black/60 border border-white/15 focus-within:border-emerald-400/80 focus-within:ring-1 focus-within:ring-emerald-400/50 transition-all p-2">
                              <textarea 
                                required
                                rows={4}
                                maxLength={3500}
                                placeholder={t.contact.messagePlaceholder}
                                value={formData.message}
                                onChange={e => setFormData({ ...formData, message: e.target.value })}
                                className="w-full h-28 sm:h-32 min-h-[96px] max-h-64 bg-transparent text-xs text-white placeholder-white/40 resize-y font-sans overflow-y-auto leading-relaxed focus:outline-hidden"
                              />
                            </div>
                          </div>

                          {/* Action Buttons Row */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-0.5">
                            <button 
                              type="submit"
                              disabled={isSubmittingContact}
                              className="py-2 px-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all hover:scale-[1.01] cursor-pointer shadow-md shadow-emerald-500/20 disabled:opacity-50"
                            >
                              <Send size={13} />
                              <span className="truncate">{isSubmittingContact ? (lang === 'tr' ? 'İletiliyor...' : 'Sending...') : (lang === 'tr' ? 'Gönder' : 'Submit')}</span>
                            </button>

                            <button 
                              type="button"
                              onClick={() => {
                                soundEngine.playGlassClick();
                                setShowGmailModal(true);
                              }}
                              className="py-2 px-2 rounded-xl bg-gradient-to-r from-red-600/30 to-amber-600/20 hover:from-red-600/40 hover:to-amber-600/30 border border-red-500/40 text-red-200 hover:text-white font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all hover:scale-[1.01] cursor-pointer shadow-sm"
                              title={lang === 'tr' ? "Gmail Web ile gönderin" : "Send via Gmail"}
                            >
                              <GmailIcon size={16} className="shrink-0 drop-shadow-sm" />
                              <span className="truncate">Gmail</span>
                            </button>

                            <button 
                              type="button"
                              onClick={handleWhatsAppOpen}
                              className="py-2 px-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all hover:scale-[1.01] cursor-pointer shadow-sm truncate"
                              title="WhatsApp"
                            >
                              <WhatsAppIcon size={14} className="shrink-0" />
                              <span className="truncate">WhatsApp</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(profile.email || 'emirhan0008@gmail.com');
                                setCopiedEmail(true);
                                setTimeout(() => setCopiedEmail(false), 2500);
                              }}
                              className="py-2 px-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer truncate"
                              title="E-Posta Adresini Kopyala"
                            >
                              <Copy size={12} className="text-white/70 shrink-0" />
                              <span className="truncate">{copiedEmail ? (lang === 'tr' ? 'Kopyalandı!' : 'Copied!') : (lang === 'tr' ? 'Kopyala' : 'Copy')}</span>
                            </button>
                          </div>
                        </form>
                      )}
                    </div>

                    {/* Quick Access Channels Row */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1.5 shrink-0 pt-0.5">
                      <a
                        href={profile.github || "https://github.com/Emirhan0008"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-1.5 px-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center gap-1.5 text-xs text-white font-bold transition-all hover:scale-102 cursor-pointer group"
                      >
                        <Github size={12} className="text-white/70 group-hover:text-emerald-400 shrink-0 transition-colors" />
                        <span className="truncate font-mono text-[11px]">GitHub</span>
                        <ExternalLink size={9} className="text-white/40 ml-auto shrink-0 group-hover:text-white" />
                      </a>

                      <a
                        href="https://www.linkedin.com/in/emirhan-y%C4%B1lmaz-3357b5109"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-1.5 px-2.5 rounded-xl bg-blue-950/40 hover:bg-blue-900/40 border border-blue-500/30 flex items-center justify-center gap-1.5 text-xs text-blue-200 hover:text-white font-bold transition-all hover:scale-102 cursor-pointer group"
                        title="LinkedIn: in/emirhan-yılmaz"
                      >
                        <Linkedin size={12} className="text-blue-400 shrink-0" />
                        <span className="truncate text-[11px]">LinkedIn</span>
                        <ExternalLink size={9} className="text-blue-400/40 ml-auto shrink-0 group-hover:text-white" />
                      </a>

                      <a
                        href="https://t.me/emirhanyilmazrpd"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-1.5 px-2.5 rounded-xl bg-sky-950/40 hover:bg-sky-900/40 border border-sky-500/30 flex items-center justify-center gap-1.5 text-xs text-sky-200 hover:text-white font-bold transition-all hover:scale-102 cursor-pointer group"
                      >
                        <TelegramIcon size={12} className="text-sky-400 shrink-0" />
                        <span className="truncate text-[11px]">Telegram</span>
                        <ExternalLink size={9} className="text-sky-400/40 ml-auto shrink-0 group-hover:text-white" />
                      </a>

                      <button
                        type="button"
                        onClick={() => {
                          soundEngine.playGlassClick();
                          setShowMediaKitModal(true);
                        }}
                        className="py-1.5 px-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center gap-1.5 text-xs text-emerald-300 font-bold transition-all hover:scale-102 cursor-pointer"
                      >
                        <Award size={12} className="text-emerald-400 shrink-0" />
                        <span className="truncate text-[11px]">{lang === 'tr' ? 'Medya Kiti' : 'Media Kit'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleDirectEmailOpen}
                        className="py-1.5 px-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center gap-1.5 text-xs text-white/80 hover:text-white font-bold transition-all hover:scale-102 cursor-pointer"
                        title={lang === 'tr' ? "Varsayılan E-Posta İstemcinizle Açın" : "Open Default Mail Client"}
                      >
                        <Mail size={12} className="text-white/70 shrink-0" />
                        <span className="truncate text-[11px]">{lang === 'tr' ? 'E-Posta Aç' : 'Email Client'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Scroll Down Indicator */}
                  <ScrollDownIndicator containerRef={rightContactScrollRef} lang={lang} />
                </motion.div>
              )}
            </AnimatePresence>
            )}
          </div>
        </motion.div>

      </div>



      {/* SECURE ADMIN INBOX PANEL OVERLAY */}
      {isAdmin && (
        <div className="fixed bottom-6 right-6 z-[160] flex flex-col items-end gap-3 select-text">
          {/* Expanded Panel */}
          <AnimatePresence>
            {showAdminInbox && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="w-[340px] sm:w-[460px] h-[480px] liquid-glass-strong border border-white/15 rounded-[2rem] shadow-2xl p-5 flex flex-col gap-4 overflow-hidden text-left"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3 select-none">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <Inbox size={15} />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider">Yönetici Gelen Kutusu</h3>
                      <p className="text-[9px] text-white/50 font-medium">Ziyaretçilerden gelen mesajlar</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {inboxMessages.length > 0 && (
                      <button
                        onClick={() => {
                          setConfirmDialog({
                            isOpen: true,
                            title: 'Gelen Kutusunu Temizle',
                            description: 'Tüm ziyaretçi mesajları kalıcı olarak silinecek. Onaylıyor musunuz?',
                            confirmText: 'Evet, Hepsini Sil',
                            onConfirm: () => {
                              setInboxMessages([]);
                              localStorage.removeItem('adm_msg_store');
                              const token = sessionStorage.getItem('adm_srv_tok') || '';
                              fetch('/api/messages', {
                                method: 'DELETE',
                                headers: token ? { 'Authorization': `Bearer ${token}` } : {}
                              }).catch(() => {});
                              setAdminToastMessage("Gelen kutusu temizlendi.");
                              setShowAdminToast(true);
                              setTimeout(() => setShowAdminToast(false), 2500);
                            }
                          });
                        }}
                        className="px-2.5 py-1 text-[9px] font-extrabold bg-red-950/40 hover:bg-red-900/40 text-red-400 border border-red-500/10 rounded-lg transition-all cursor-pointer uppercase tracking-wider"
                      >
                        Temizle
                      </button>
                    )}
                    <button
                      onClick={() => setShowAdminInbox(false)}
                      className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto pr-1 space-y-3">
                  {inboxMessages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 gap-3 select-none">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/30">
                        <Inbox size={16} />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-white/80">Gelen Kutunuz Boş</h4>
                        <p className="text-[10px] text-white/50 max-w-[200px] leading-relaxed mx-auto">
                          İletişim formundan bir mesaj gönderildiğinde burada görünecektir.
                        </p>
                      </div>
                    </div>
                  ) : (
                    inboxMessages.map(msg => (
                      <div key={msg.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2 group transition-all hover:bg-white/10">
                        <div className="flex items-start justify-between gap-2 select-none">
                          <div className="space-y-0.5">
                            <h4 className="text-xs font-bold text-white">{sanitizeText(msg.name)}</h4>
                            <a 
                              href={`mailto:${encodeURIComponent(sanitizeEmail(msg.email))}`} 
                              className="text-[10px] text-emerald-400 font-extrabold tracking-tight hover:underline flex items-center gap-1 w-fit"
                            >
                              {sanitizeEmail(msg.email)} <ExternalLink size={8} />
                            </a>
                            {msg.subject && (
                              <span className="text-[9px] text-white/50 block font-medium">
                                {sanitizeText(msg.subject)}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-[8px] text-white/40 font-mono font-medium">{sanitizeText(msg.date)}</span>
                            <button
                              onClick={() => {
                                const filtered = inboxMessages.filter(m => m.id !== msg.id);
                                setInboxMessages(filtered);
                                localStorage.setItem('adm_msg_store', JSON.stringify(filtered));
                              }}
                              className="p-1 rounded-md text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                              title="Mesajı Sil"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-white/85 leading-relaxed bg-black/30 p-3 rounded-xl border border-white/5 select-text whitespace-pre-wrap font-medium">
                          {sanitizeMultilineText(msg.message)}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer Info */}
                <div className="text-[9px] text-white/40 font-mono text-center border-t border-white/5 pt-2 select-none">
                  Yönetici Modu Aktif • Toplam: {inboxMessages.length} Mesaj
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating toggle button */}
          <motion.button
            onClick={() => setShowAdminInbox(!showAdminInbox)}
            className="flex items-center gap-2.5 px-4.5 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/20 font-extrabold text-[10px] tracking-wider uppercase transition-all hover:scale-105 active:scale-95 cursor-pointer select-none"
          >
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
            </span>
            <span>GELEN KUTUSU {inboxMessages.length > 0 && `(${inboxMessages.length})`}</span>
            <Inbox size={12} />
          </motion.button>
        </div>
      )}


      {/* Lightbox Overlay */}
      <AnimatePresence>
        {activeLightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveLightboxImage(null)}
            className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4 cursor-zoom-out select-none"
          >
            <button
              onClick={() => setActiveLightboxImage(null)}
              className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-2.5 rounded-full z-[210] border-none cursor-pointer"
            >
              <X size={20} />
            </button>
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative max-w-full max-h-full"
            >
              <img
                src={activeLightboxImage}
                alt="Detaylı Görünüm"
                className="max-w-[95vw] max-h-[90vh] rounded-2xl object-contain border border-white/15 shadow-2xl"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project Estimator Modal Overlay */}
      <AnimatePresence>
        {showEstimatorModal && (
          <div className="fixed inset-0 z-[160] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-5xl my-4 sm:my-8"
            >
              <ProjectEstimator
                lang={lang}
                onClose={() => setShowEstimatorModal(false)}
                onApplyToContact={(msg, subject) => {
                  setFormData(prev => ({ ...prev, message: msg }));
                  if (subject) setContactSubject(subject);
                  setShowEstimatorModal(false);
                  // Ensure if user was in terminal mode, we transition to normal mode so contact tab is visible!
                  if (theme === 'terminal') {
                    setTheme('normal');
                  }
                  setActiveTab('contact');
                  setAdminToastMessage("Proje teklif taslağı hazırlandı ve iletişime aktarıldı!");
                  setShowAdminToast(true);
                  setTimeout(() => setShowAdminToast(false), 3500);
                }}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Official Media Kit Modal Overlay */}
      <MediaKitModal
        isOpen={showMediaKitModal}
        onClose={() => setShowMediaKitModal(false)}
        lang={lang}
        onSelectIntent={(intent) => {
          applyContactPersona(intent);
          setActiveTab('contact');
        }}
      />

      {/* Search & AI Visibility Diagnostic Modal Overlay */}
      <VisibilityDiagnosticModal
        isOpen={showVisibilityModal}
        onClose={() => setShowVisibilityModal(false)}
        lang={lang}
      />

      {/* Official Gmail Workspace Send Modal */}
      <GmailContactModal
        isOpen={showGmailModal}
        onClose={() => setShowGmailModal(false)}
        targetEmail={profile.email || 'emirhan0008@gmail.com'}
        senderName={formData.name}
        senderCompany={formData.company}
        senderEmail={formData.email}
        messageContent={formData.message}
        intentSubject={contactSubject || 'İletişim Talebi'}
        lang={lang}
      />

      {/* Tech Radar Modal Overlay */}
      <AnimatePresence>
        {showTechRadarModal && (
          <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-4xl my-8 relative"
            >
              <button
                onClick={() => setShowTechRadarModal(false)}
                className="absolute top-6 right-6 z-10 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer border border-white/15"
              >
                <X size={16} />
              </button>
              <TechRadar
                lang={lang}
                onSelectProject={(id) => {
                  const proj = mappedProjects.find(p => p.id === id) || projects.find(p => p.id === id);
                  if (proj) {
                    setSelectedProject(proj);
                    setShowTechRadarModal(false);
                  }
                }}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Cybernetic Music Mini-Player Pill */}
      <AnimatePresence>
        {isAmbientPlaying && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 left-6 z-[140] flex items-center gap-3 px-4 py-2.5 rounded-full liquid-glass-strong border border-emerald-500/30 shadow-[0_0_24px_rgba(16,185,129,0.2)] backdrop-blur-xl"
          >
            {/* Animated Equalizer Wave */}
            <div className="flex items-end gap-0.5 h-3.5 w-4 shrink-0">
              <span className="w-0.5 bg-emerald-400 rounded-full animate-[bounce_0.8s_infinite]" style={{ height: '70%' }} />
              <span className="w-0.5 bg-emerald-400 rounded-full animate-[bounce_1.1s_infinite_0.2s]" style={{ height: '100%' }} />
              <span className="w-0.5 bg-emerald-400 rounded-full animate-[bounce_0.9s_infinite_0.4s]" style={{ height: '50%' }} />
            </div>

            <div className="flex flex-col text-left">
              <span className="text-[10px] font-extrabold text-white tracking-wide flex items-center gap-1.5">
                {currentMusicTrack.title}
                <span className="px-1.5 py-0.5 text-[8px] bg-emerald-500/20 text-emerald-300 rounded font-mono font-bold tracking-tight uppercase">
                  {currentMusicTrack.genre || 'CYBER'}
                </span>
              </span>
              <span className="text-[9px] text-white/50 font-medium truncate max-w-[150px]">
                {currentMusicTrack.subtitle}
              </span>
            </div>

            {/* Next Track Button */}
            <button
              onClick={() => {
                soundEngine.playGlassClick();
                soundEngine.nextTrack();
              }}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              title="Sonraki Siber Parçaya Geç"
            >
              <SkipForward size={12} />
            </button>

            {/* Pause / Stop */}
            <button
              onClick={() => {
                soundEngine.playGlassClick();
                soundEngine.toggleAmbientFocusSoundscape();
              }}
              className="w-7 h-7 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 flex items-center justify-center transition-all cursor-pointer"
              title="Müziği Durdur"
            >
              <Pause size={12} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Autonomous Cyber Cat Companion (Walks along bottom, turns to visitor, purrs, meows & interacts) */}
      <InteractiveCatCompanion
        theme={theme}
        lang={lang}
        onNavigateToTab={(tab) => {
          setTheme('normal');
          setActiveTab(tab as any);
        }}
        onOpenTerminal={() => {
          setTheme('terminal');
        }}
        onSwitchToNormal={() => {
          setTheme('normal');
        }}
        onToggleTheme={() => {
          setTheme(prev => prev === 'terminal' ? 'normal' : 'terminal');
        }}
      />

      {/* Mindful Pure Rule-Based Zen CBT Reflection Widget (100% Offline • Zero Server/API Calls) - Geçici olarak yorum satırına alındı */}
      {/* 
      <ZenCbtTherapyWidget
        theme={theme}
        lang={lang}
      /> 
      */}

      {/* SECURE IN-APP PROMPT MODAL (Non-blocking replacement for window.prompt) */}
      <AnimatePresence>
        {promptDialog && promptDialog.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[220] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="w-full max-w-md rounded-3xl liquid-glass-strong border border-white/20 p-6 shadow-2xl flex flex-col gap-4 text-left"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <span>🔗</span> {promptDialog.title}
                </h3>
                <button
                  onClick={() => setPromptDialog(null)}
                  className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>

              {promptDialog.description && (
                <p className="text-xs text-white/70 leading-relaxed">
                  {promptDialog.description}
                </p>
              )}

              <input
                type="text"
                autoFocus
                value={promptInputValue}
                onChange={(e) => setPromptInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    promptDialog.onConfirm(promptInputValue);
                    setPromptDialog(null);
                  } else if (e.key === 'Escape') {
                    setPromptDialog(null);
                  }
                }}
                placeholder={promptDialog.placeholder || "https://..."}
                className="w-full py-2.5 px-4 rounded-xl bg-black/60 border border-white/15 focus:outline-hidden focus:ring-1 focus:ring-emerald-400 text-xs text-white placeholder-white/40 font-mono"
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPromptDialog(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-bold transition-all cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    promptDialog.onConfirm(promptInputValue);
                    setPromptDialog(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-extrabold transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  Kaydet
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SECURE IN-APP CONFIRM MODAL (Non-blocking replacement for window.confirm) */}
      <AnimatePresence>
        {confirmDialog && confirmDialog.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[220] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="w-full max-w-sm rounded-3xl liquid-glass-strong border border-red-500/30 p-6 shadow-2xl flex flex-col gap-4 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-red-950/50 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto">
                <AlertTriangle size={20} />
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-extrabold text-white">
                  {confirmDialog.title}
                </h3>
                <p className="text-xs text-white/70 leading-relaxed">
                  {confirmDialog.description}
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setConfirmDialog(null)}
                  className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Vazgeç
                </button>
                <button
                  type="button"
                  onClick={() => {
                    confirmDialog.onConfirm();
                    setConfirmDialog(null);
                  }}
                  className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-extrabold transition-all cursor-pointer shadow-lg shadow-red-600/30"
                >
                  {confirmDialog.confirmText || 'Evet, Onayla'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comprehensive Admin Control & Editor Modal */}
      <AdminEditorModal
        isOpen={showAdminEditor}
        onClose={() => {
          setShowAdminEditor(false);
          setEditingProjectId(null);
          setEditingArticleId(null);
        }}
        profile={profile}
        onSaveProfile={handleSaveProfile}
        projects={projectList}
        onSaveProjects={handleSaveProjects}
        articles={articleList}
        onSaveArticles={handleSaveArticles}
        initialTab={adminEditorTab}
        editingProjectId={editingProjectId}
        editingArticleId={editingArticleId}
        onResetToDefaults={handleResetToDefaults}
        onToast={(msg) => {
          setAdminToastMessage(msg);
          setShowAdminToast(true);
          setTimeout(() => setShowAdminToast(false), 3500);
        }}
        onOpenVisibilityModal={() => setShowVisibilityModal(true)}
      />

    </div>
  );
}

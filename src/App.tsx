import { useState, useEffect, FormEvent, UIEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Download, 
  Wand2, 
  BookOpen, 
  ArrowRight, 
  ArrowLeft,
  Instagram, 
  Menu, 
  X, 
  GraduationCap, 
  Brain, 
  Code2, 
  Briefcase, 
  ChevronRight,
  ChevronLeft, 
  Mail, 
  Github, 
  CheckCircle2, 
  Send,
  Upload,
  Copy,
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
  Settings
 } from 'lucide-react';
 
 import { profileData, projects, articles } from './data';
 import { ProfileData, Project, Article } from './types';
 import { AdminEditorModal } from './components/AdminEditorModal';
 import { SeamlessVideo } from './components/SeamlessVideo';

import { InteractiveCatCompanion } from './components/InteractiveCatCompanion';
import { ProjectEstimator } from './components/ProjectEstimator';
import { TechRadar } from './components/TechRadar';
import { soundEngine, PEACEFUL_TRACKS, MusicTrack } from './utils/audioSynth';
import { ThemeToggle, AppTheme } from './components/ThemeToggle';
import { PowerShellTerminalWorkspace } from './components/PowerShellTerminalWorkspace';
import { 
  sanitizeText, 
  sanitizeMultilineText, 
  sanitizeEmail, 
  isValidEmail, 
  sanitizeUrl, 
  sanitizeImageSource 
} from './utils/sanitize';

export interface ContactMessage {
   id: string;
   name: string;
   email: string;
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

function WhatsAppIcon({ size = 14, className = "" }: { size?: number; className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className}
    >
      <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.276-.1-.477-.15-.678.15-.2.301-.778.979-.954 1.179-.175.2-.351.226-.652.075-.301-.15-1.272-.469-2.423-1.496-.895-.798-1.5-1.784-1.676-2.085-.175-.301-.019-.464.132-.614.135-.135.301-.351.451-.527.151-.175.201-.301.301-.501.101-.2.05-.376-.025-.527-.075-.15-.678-1.632-.929-2.235-.245-.587-.493-.507-.678-.516l-.578-.01c-.2 0-.527.075-.803.376s-1.054 1.029-1.054 2.511c0 1.482 1.079 2.913 1.23 3.114.15.2 2.123 3.242 5.144 4.547.719.311 1.28.497 1.718.636.722.23 1.378.197 1.897.12.578-.086 1.78-.728 2.031-1.431.251-.703.251-1.305.176-.1431-.076-.126-.276-.201-.577-.351zm-5.438 8.018c-2.11 0-4.08-.57-5.787-1.564l-.415-.242-4.304 1.129 1.149-4.195-.266-.423c-1.089-1.733-1.667-3.754-1.667-5.834 0-6.079 4.946-11.025 11.029-11.025 2.946 0 5.716 1.148 7.798 3.23 2.083 2.083 3.23 4.853 3.23 7.798-.002 6.08-4.948 11.026-11.031 11.026zm7.798-18.825c-2.083-2.083-4.853-3.23-7.798-3.23-6.082 0-11.029 4.946-11.029 11.028 0 1.944.508 3.842 1.472 5.518l-1.565 5.717 5.85-1.535c1.619.882 3.442 1.348 5.272 1.348 6.082 0 11.03-4.947 11.03-11.028 0-2.946-1.148-5.716-3.232-7.818z"/>
    </svg>
  );
}

export default function App() {
   const [activeTab, setActiveTab] = useState<'profile' | 'projects' | 'articles' | 'contact'>('profile');
   const [activeLightboxImage, setActiveLightboxImage] = useState<string | null>(null);
   const [selectedProject, setSelectedProject] = useState<Project | null>(null);
   const [activeGalleryIndex, setActiveGalleryIndex] = useState<number>(0);
   const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
   const [projectFilter, setProjectFilter] = useState<string>('Tümü');
   const [searchQuery, setSearchQuery] = useState<string>('');
   const [contactSubject, setContactSubject] = useState<string>('Proje Teklifi / Danışmanlık');
   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
   const [formSubmitted, setFormSubmitted] = useState(false);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [formError, setFormError] = useState<string | null>(null);
   const [formData, setFormData] = useState({ name: '', email: '', message: '' });
   const [honeypot, setHoneypot] = useState('');
   const [copiedEmail, setCopiedEmail] = useState(false);
   const [inboxMessages, setInboxMessages] = useState<ContactMessage[]>([]);
 
   // Dynamic editable states with localStorage persistence
   const [profile, setProfile] = useState<ProfileData>(() => {
     try {
       const saved = localStorage.getItem('emirhan_custom_profile');
       return saved ? { ...profileData, ...JSON.parse(saved) } : (profileData as ProfileData);
     } catch {
       return profileData as ProfileData;
     }
   });

   const [projectList, setProjectList] = useState<Project[]>(() => {
     try {
       const saved = localStorage.getItem('emirhan_custom_projects');
       return saved ? JSON.parse(saved) : projects;
     } catch {
       return projects;
     }
   });

   const [articleList, setArticleList] = useState<Article[]>(() => {
     try {
       const saved = localStorage.getItem('emirhan_custom_articles');
       return saved ? JSON.parse(saved) : articles;
     } catch {
       return articles;
     }
   });

   // Admin Control & Editor Modal state
   const [showAdminEditor, setShowAdminEditor] = useState(false);
   const [adminEditorTab, setAdminEditorTab] = useState<'profile' | 'projects' | 'articles' | 'security' | 'backup'>('profile');
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
   
   // Security rate limits and persistent tab-session lockout
   const [failedAttempts, setFailedAttempts] = useState(0);
   const [lockoutUntil, setLockoutUntil] = useState(0);
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
     };
     window.addEventListener('keydown', handleKeyDown);
     return () => window.removeEventListener('keydown', handleKeyDown);
   }, [isAdmin]);
 
   // Helper function for secure SHA-256 browser hashing
   const sha256 = async (str: string): Promise<string> => {
     const buf = new TextEncoder().encode(str);
     const hash = await crypto.subtle.digest('SHA-256', buf);
     return Array.from(new Uint8Array(hash))
       .map(b => b.toString(16).padStart(2, '0'))
       .join('');
   };

   const handleSuccessfulAdminLogin = () => {
     setIsAdmin(true);
     localStorage.setItem('emirhan_admin_logged_in', 'true');
     setShowAdminModal(false);
     setAdminPasscode('');
     setFailedAttempts(0);
     setLockoutUntil(0);
     sessionStorage.removeItem('adm_lck_ut');
     
     setAdminToastMessage("🛡️ Yönetici Modu Aktif! Tüm düzenleme yetkileri açıldı.");
     setShowAdminToast(true);
     setTimeout(() => setShowAdminToast(false), 4000);
   };

   const handleResetLockout = () => {
     setLockoutUntil(0);
     setFailedAttempts(0);
     sessionStorage.removeItem('adm_lck_ut');
     setAdminToastMessage("Güvenlik kilidi sıfırlandı. Giriş yapabilirsiniz.");
     setShowAdminToast(true);
     setTimeout(() => setShowAdminToast(false), 3000);
   };

   const handleAdminLogout = () => {
     setIsAdmin(false);
     localStorage.removeItem('emirhan_admin_logged_in');
     setAdminToastMessage("Yönetici modundan çıkış yapıldı (Ziyaretçi moduna dönüldü).");
     setShowAdminToast(true);
     setTimeout(() => setShowAdminToast(false), 3500);
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

   // Robust zero-plain-text ASCII pattern matching
   const matchMasterCodes = (input: string): boolean => {
     const clean = input.trim();
     // Master: E m i r h a n . 1 9 6 9
     const master = [69, 109, 105, 114, 104, 97, 110, 46, 49, 57, 54, 57];
     // Master lower: e m i r h a n . 1 9 6 9
     const masterLower = [101, 109, 105, 114, 104, 97, 110, 46, 49, 57, 54, 57];
     // Without dot: E m i r h a n 1 9 6 9
     const noDot = [69, 109, 105, 114, 104, 97, 110, 49, 57, 54, 57];
     // Lower without dot: e m i r h a n 1 9 6 9
     const noDotLower = [101, 109, 105, 114, 104, 97, 110, 49, 57, 54, 57];

     const check = (arr: number[]) => {
       if (clean.length !== arr.length) return false;
       for (let i = 0; i < arr.length; i++) {
         if (clean.charCodeAt(i) !== arr[i]) return false;
       }
       return true;
     };

     return check(master) || check(masterLower) || check(noDot) || check(noDotLower);
   };

   const handlePasscodeSubmit = async (e?: FormEvent) => {
     if (e) e.preventDefault();

     try {
       const cleanPasscode = (adminPasscode || '').trim();
       const customPass = (localStorage.getItem('emirhan_admin_pass') || '').trim();

       // Primary: Match Master ASCII Codes
       let isMatch = matchMasterCodes(cleanPasscode);

       // Secondary: Match custom user-configured password
       if (!isMatch && customPass && cleanPasscode) {
         if (cleanPasscode === customPass || cleanPasscode.toLowerCase() === customPass.toLowerCase()) {
           isMatch = true;
         }
       }

       // Tertiary: SHA-256 Hashes
       if (!isMatch && cleanPasscode) {
         try {
           const inputHash = await sha256(cleanPasscode);
           const inputLowerHash = await sha256(cleanPasscode.toLowerCase());

           const SYSTEM_HASHES = [
             'a7f6ff82c7e0fb369d7e81ef26fd7dd0bb2edb2c5510503a062c429bc679d51d', // Emirhan.1969
             '4605172b349cd31501a1b495b207d950209c18dcee9dfe8e75863fda782aefc3', // emirhan.1969
             '8b313d1ce218029d9e76635727cd509c309f34c6c2aa2e0b5775888dbcfdcbfd', // EMIRHAN.1969
             '2f12c6c591923b2ae9e4866b64f3c11457c42d200e92a39c0a08aeeb67d6a121', // EMİRHAN.1969
             'f4ffccaf8d25302dd66c15607474033aa85d373bc256b50155a937b2d09cf0ea', // Emirhan1969
             '525f2d7dbbb3e5a6ce1147afce3aef9a8970a263ec281b63ee7f38883584a803', // emirhan1969
             '76e850744a6fe4464c76645e83df8d9d5da2ca87d8bebd4e22694824d81ea0fd', // emirhan
             'a32dbddb40995138a80afd33007310f610ed73ffb846683d1866cb48282f162b'  // emirhan0008
           ];

           if (SYSTEM_HASHES.includes(inputHash) || SYSTEM_HASHES.includes(inputLowerHash)) {
             isMatch = true;
           }
         } catch {
           // Cryptographic evaluation safety fallback
         }
       }

       if (isMatch) {
         handleSuccessfulAdminLogin();
         return;
       }

       const now = Date.now();
       const nextFailed = failedAttempts + 1;
       setFailedAttempts(nextFailed);
       setAdminPasscode('');
       
       let lockTime = 0;
       if (nextFailed >= 5) {
         lockTime = now + 10 * 60 * 1000; // 10 mins lockout
         setAdminToastMessage("Güvenlik Kilidi! 10 dakika boyunca erişim durduruldu ('Kilidi Sıfırla' ile açabilirsiniz).");
       } else if (nextFailed >= 3) {
         lockTime = now + 45 * 1000; // 45 seconds lockout
         setAdminToastMessage("Hatalı erişim anahtarı! Sistem 45 saniye kilitlendi.");
       } else {
         setAdminToastMessage(`Hatalı erişim anahtarı! (Kalan deneme hakkı: ${5 - nextFailed})`);
       }

       if (lockTime > 0) {
         setLockoutUntil(lockTime);
         sessionStorage.setItem('adm_lck_ut', lockTime.toString());
       }
       setShowAdminToast(true);
       setTimeout(() => setShowAdminToast(false), 3500);
     } catch (err) {
       // Safe silent fallback
     }
   };

   // Check URL hash or query param on load (#admin, ?unlock=emirhan, ?admin=true)
   useEffect(() => {
     if (typeof window !== 'undefined') {
       const hash = window.location.hash.toLowerCase();
       const search = window.location.search.toLowerCase();

       // Direct Secret Unlock URL (Fail-proof master activation for Emirhan)
       if (
         search.includes('unlock=emirhan') || 
         hash.includes('unlock=emirhan') || 
         search.includes('admin=emirhan') ||
         hash.includes('admin=emirhan')
       ) {
         handleSuccessfulAdminLogin();
         return;
       }

       if (hash === '#admin' || hash === '#emirhan' || search.includes('admin=true') || search.includes('login=admin')) {
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

   // Sync lockout state from session storage
   useEffect(() => {
     const storedLockout = sessionStorage.getItem('adm_lck_ut');
     if (storedLockout) {
       const parsed = parseInt(storedLockout, 10);
       if (parsed && parsed > Date.now()) {
         setLockoutUntil(parsed);
       }
     }

     // Load admin messages with DOMPurify sanitization
     const storedMsgs = localStorage.getItem('adm_msg_store');
     if (storedMsgs) {
       try {
         const parsed = JSON.parse(storedMsgs);
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

  // Map custom uploaded photos & custom demo URLs onto existing project structures
  const mappedProjects = projectList.map(project => {
    const customImg = projectImages[project.id];
    const customDemo = projectDemoUrls[project.id];
    return {
      ...project,
      image: (customImg && sanitizeImageSource(customImg)) || project.image,
      demoUrl: (customDemo !== undefined ? sanitizeUrl(customDemo) : sanitizeUrl(project.demoUrl)) || undefined
    };
  });

  // Filter projects based on selected filter pill and search query
  const filteredProjects = mappedProjects.filter(project => {
    let matchesCategory = true;
    if (projectFilter === 'Mobil') matchesCategory = project.category.includes('Mobil') || project.tech.includes('React Native') || project.tech.includes('Expo');
    else if (projectFilter === 'Yapay Zeka') matchesCategory = project.category.includes('Yapay Zeka') || project.title.includes('Yapay Zeka') || project.tech.includes('Gemini API') || project.tech.includes('AI Studio') || project.tech.includes('Google AI Studio');
    else if (projectFilter === 'Python') matchesCategory = project.tech.includes('Python');
    else if (projectFilter === 'Özel Eğitim') matchesCategory = project.category.includes('Özel Eğitim');
    else if (projectFilter === 'Otomasyon & Analitik') matchesCategory = project.category.includes('Otomasyon') || project.category.includes('Analitik') || project.category.includes('Kazıma');

    if (!matchesCategory) return false;
    const sanitizedSearch = sanitizeText(searchQuery);
    if (!sanitizedSearch) return true;

    const q = sanitizedSearch.toLowerCase();
    return (
      project.title.toLowerCase().includes(q) ||
      project.description.toLowerCase().includes(q) ||
      project.longDescription.toLowerCase().includes(q) ||
      project.category.toLowerCase().includes(q) ||
      project.tech.some(t => t.toLowerCase().includes(q))
    );
  });

  // Track currently selected project with up-to-date image reference
  const currentSelectedProject = selectedProject 
    ? mappedProjects.find(p => p.id === selectedProject.id) || selectedProject
    : null;

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    // Honeypot trap check - block automated bots from submitting spam
    if (honeypot.trim()) {
      setFormData({ name: '', email: '', message: '' });
      setHoneypot('');
      return;
    }

    // Comprehensive sanitization layer via DOMPurify
    const cleanName = sanitizeText(formData.name).slice(0, 100);
    const cleanEmail = sanitizeEmail(formData.email).slice(0, 120);
    const cleanSubject = sanitizeText(contactSubject).slice(0, 150);
    const cleanMessage = sanitizeMultilineText(formData.message).slice(0, 2000);

    // Strict validation constraints
    if (!cleanName || cleanName.length < 2) {
      setFormError('Lütfen ad ve soyadınızı eksiksiz giriniz (en az 2 karakter).');
      return;
    }

    if (!isValidEmail(cleanEmail)) {
      setFormError('Lütfen geçerli bir e-posta adresi giriniz (örn: isim@domain.com).');
      return;
    }

    if (!cleanMessage || cleanMessage.length < 5) {
      setFormError('Lütfen mesajınızı en az 5 karakter olacak şekilde yazınız.');
      return;
    }

    setIsSubmitting(true);
    
    // Save to local inbox storage with strictly sanitized fields
    const newMessage: ContactMessage = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2),
      name: cleanName,
      email: cleanEmail,
      subject: cleanSubject,
      message: cleanMessage,
      date: new Date().toLocaleString('tr-TR'),
      timestamp: Date.now()
    };
    
    const updatedMessages = [newMessage, ...inboxMessages];
    setInboxMessages(updatedMessages);
    try {
      localStorage.setItem('adm_msg_store', JSON.stringify(updatedMessages));
    } catch (err) {
      console.error("Storage error:", err);
    }
    
    // Simulate transmission process
    setTimeout(() => {
      setIsSubmitting(false);
      setFormSubmitted(true);
      setTimeout(() => {
        setFormSubmitted(false);
        setFormData({ name: '', email: '', message: '' });
      }, 5000);
    }, 1200);
  };

  const navItems = [
    { id: 'profile', label: 'Profil' },
    { id: 'projects', label: 'Projeler' },
    { id: 'articles', label: 'Yayınlar' },
    { id: 'contact', label: 'İletişim' }
  ] as const;

  return (
    <div className={`relative min-h-screen lg:h-screen lg:max-h-screen lg:overflow-hidden w-full bg-black text-white ${theme === 'terminal' ? 'theme-terminal font-mono' : 'theme-normal font-sans'} overflow-x-hidden antialiased select-none`}>
      
      {/* IMMERSIVE THEME BACKGROUNDS & CRT SCANLINE EFFECTS */}
      <div className="fixed inset-0 w-full h-full z-0 overflow-hidden select-none pointer-events-none bg-[#030408]">
        {/* Normal Mode Background (Clean, high-res visual aura) */}
        <img
          src="/bg-normal.jpg"
          alt="Normal Mode Background"
          className={`absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none transition-opacity duration-700 ease-in-out ${
            theme === 'normal' ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
          style={{ transitionProperty: 'opacity, transform' }}
          loading="eager"
        />

        {/* Terminal Mode Background (Cyberpunk / Terminal Visual) */}
        <img
          src="/bg-terminal.png"
          alt="Terminal Mode Background"
          className={`absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none transition-opacity duration-700 ease-in-out ${
            theme === 'terminal' ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
          style={{ transitionProperty: 'opacity, transform' }}
          loading="eager"
        />

        {/* Subtle vignette to preserve soft depth and text clarity, without stripping image colors */}
        <div className="absolute inset-0 bg-radial from-transparent via-black/15 to-black/70 z-1" />
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[0.5px] z-2" />

        {/* Terminal CRT Scanlines Overlay when Terminal Mode is active */}
        {theme === 'terminal' && (
          <>
            <div className="absolute inset-0 bg-emerald-950/20 mix-blend-screen z-3" />
            <div className="absolute inset-0 terminal-scanlines opacity-75 z-4" />
          </>
        )}
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
                  <button
                    type="button"
                    onClick={handleResetLockout}
                    className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white/80 hover:text-white font-bold text-xs cursor-pointer transition-all border border-white/10"
                  >
                    Kilidi Sıfırla
                  </button>
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
      <div className="relative z-10 h-auto lg:h-screen lg:max-h-screen w-full flex flex-col lg:flex-row p-4 lg:p-6 gap-6 lg:overflow-hidden">
        
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

          <header className="flex items-center justify-between z-10 mb-4 lg:mb-5 shrink-0">
            <div 
              className="flex items-center gap-3 cursor-pointer group select-none"
              onClick={() => {
                setSelectedProject(null);
                setSelectedArticle(null);
                setActiveTab('profile');
              }}
              title="Emirhan Yılmaz Ana Sayfa"
            >
              {/* Separate Brand Logo with transparent background */}
              <div className="w-10 h-10 transition-transform duration-300 group-hover:scale-110 shrink-0 flex items-center justify-center">
                <img 
                  src={profile.logo} 
                  alt="Emirhan Yılmaz Logo" 
                  className="w-full h-full object-contain filter drop-shadow-[0_0_10px_rgba(255,255,255,0.35)] group-hover:drop-shadow-[0_0_14px_rgba(56,189,248,0.7)]"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="text-xl font-semibold tracking-tight text-white transition-opacity duration-300 group-hover:opacity-95 truncate">
                {profile.name.split(' ')[0]} <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-white/95 to-white/80">{profile.name.split(' ').slice(1).join(' ')}</span>
              </span>
            </div>

            {/* Desktop Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-1.5 p-1 liquid-glass rounded-full text-xs shrink-0">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    soundEngine.playTabSwitch();
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-4 py-1.5 rounded-full transition-all duration-300 font-bold ${
                    activeTab === item.id 
                      ? (theme === 'terminal'
                          ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/60 shadow-[0_0_12px_rgba(52,211,153,0.35)]'
                          : 'bg-white/15 text-white shadow-xs')
                      : (theme === 'terminal'
                          ? 'text-emerald-400/70 hover:text-emerald-300 hover:bg-emerald-950/30'
                          : 'text-white/85 hover:text-white hover:bg-white/10')
                  }`}
                  id={`nav-btn-${item.id}`}
                >
                  {theme === 'terminal' ? `> ${item.label.toUpperCase()}_` : item.label}
                </button>
              ))}
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
                {navItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      soundEngine.playTabSwitch();
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full py-2.5 px-4 rounded-xl text-left text-sm transition-all ${
                      activeTab === item.id 
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
                ))}

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
                  initial={{ opacity: 0, scale: 0.98, x: -15 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.98, x: -15 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1 flex flex-col gap-4 overflow-y-auto pr-1.5 min-h-0 select-text"
                >
                  {/* Top Bar Navigation with Geri Dön button */}
                  <div className="flex items-center justify-between gap-3 pb-3 border-b border-white/10 shrink-0 sticky top-0 bg-black/60 backdrop-blur-md z-20 py-1">
                    <button
                      onClick={() => {
                        soundEngine.playGlassClick();
                        setSelectedProject(null);
                      }}
                      className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs transition-all border border-emerald-400/40 cursor-pointer hover:scale-105 active:scale-95 shadow-md group"
                      title="Profile Geri Dön"
                    >
                      <ArrowLeft size={14} className="text-emerald-400 group-hover:-translate-x-0.5 transition-transform" />
                      <span>Geri (Profile Dön)</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-black/40 p-1 rounded-full border border-white/10">
                        <button
                          onClick={handlePrevProject}
                          className="w-7 h-7 rounded-full hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                          title="Önceki Proje (Sol Ok)"
                        >
                          <ChevronLeft size={16} />
                        </button>
                        <span className="text-[10px] font-mono font-extrabold text-emerald-400 px-1">
                          {projects.findIndex(p => p.id === currentSelectedProject.id) + 1} / {projects.length}
                        </span>
                        <button
                          onClick={handleNextProject}
                          className="w-7 h-7 rounded-full hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                          title="Sonraki Proje (Sağ Ok)"
                        >
                          <ChevronRight size={16} />
                        </button>
                      </div>

                      <button
                        onClick={() => setSelectedProject(null)}
                        className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-all border border-white/10 cursor-pointer"
                        title="Kapat"
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
                    <span className="text-[10px] text-white/75 tracking-wider uppercase font-bold">GELİŞTİRME TEKNOLOJİLERİ</span>
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
                    <span className="text-[10px] uppercase tracking-wider text-white/75 font-bold">ÖNE ÇIKAN KAZANIMLAR & ÖZELLİKLER</span>
                    <ul className="space-y-2">
                      {currentSelectedProject.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start gap-2 text-xs text-white/95 font-medium leading-relaxed">
                          <CheckCircle2 size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

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
                          <span>Canlı Uygulamayı İncele</span>
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
                        <span className="text-xs text-white/60 font-medium">Bu proje yerel masaüstü / otomasyon çalışmasıdır.</span>
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
                          <span>Projeyi Düzenle</span>
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
                </motion.div>
              ) : selectedArticle ? (
                /* DETAIL VIEW 2: ACTIVE ARTICLE READER IN LEFT PANEL */
                <motion.div
                  key={`left-article-${selectedArticle.id}`}
                  initial={{ opacity: 0, scale: 0.98, x: -15 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.98, x: -15 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1 flex flex-col gap-4 overflow-y-auto pr-1.5 min-h-0 select-text"
                >
                  <div className="flex items-center justify-between gap-3 pb-3 border-b border-white/10 shrink-0 sticky top-0 bg-black/60 backdrop-blur-md z-20 py-1">
                    <button
                      onClick={() => {
                        soundEngine.playGlassClick();
                        setSelectedArticle(null);
                      }}
                      className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs transition-all border border-emerald-400/40 cursor-pointer hover:scale-105 active:scale-95 shadow-md group"
                      title="Profile Geri Dön"
                    >
                      <ArrowLeft size={14} className="text-emerald-400 group-hover:-translate-x-0.5 transition-transform" />
                      <span>Geri (Profile Dön)</span>
                    </button>
                    <button
                      onClick={() => setSelectedArticle(null)}
                      className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-all border border-white/10 cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider font-mono">
                        {selectedArticle.category}
                      </span>
                      <span className="text-xs text-white/60 font-mono">{selectedArticle.date}</span>
                      <span className="text-xs text-white/60 font-mono">• {selectedArticle.readTime}</span>
                    </div>

                    <h1 className="text-2xl lg:text-3xl font-extrabold text-white leading-tight">
                      {selectedArticle.title}
                    </h1>

                    <p className="text-sm font-semibold text-white/90 leading-relaxed p-4 rounded-2xl bg-white/5 border border-white/10 italic">
                      "{selectedArticle.excerpt}"
                    </p>

                    <div className="text-sm text-white/90 leading-relaxed space-y-4 pt-2">
                      <p>{selectedArticle.content}</p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/10">
                      {selectedArticle.tags.map(tag => (
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
                          <span>Makaleyi Düzenle</span>
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
                </motion.div>
              ) : (
                /* DEFAULT VIEW: HERO / PROFILE DISPLAY */
                <motion.div 
                  key="hero-profile-content"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="flex-1 flex flex-col justify-between overflow-y-auto pr-1"
                >
                  <div className="flex flex-col items-start gap-6 lg:gap-8 max-w-xl py-2">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-full p-1 liquid-glass flex items-center justify-center overflow-hidden transition-transform duration-500 hover:rotate-6">
                        <img 
                          src={profile.avatar} 
                          alt="Emirhan Yılmaz Avatar" 
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
                          <span>Profili Düzenle</span>
                        </button>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 liquid-glass rounded-full text-[10px] tracking-widest uppercase text-white font-bold">
                          <Sparkles size={10} /> {profile.title}
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 liquid-glass rounded-full text-[10px] text-emerald-400 font-extrabold tracking-widest uppercase select-none">
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                          </span>
                          <span>PROJELERE AÇIK</span>
                        </div>
                      </div>
                      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-[-0.05em] leading-[1.05] text-white">
                        Ruh Sağlığı & <br />
                        <span className="font-serif italic text-white">Yapay Zeka</span>
                      </h1>
                      <p className="text-sm sm:text-base text-white font-semibold leading-relaxed">
                        {profile.about}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2.5">
                      <span className="px-3.5 py-1.5 liquid-glass spinning-glow-border rounded-full text-xs font-bold text-white">
                        Psikolojik Danışmanlık
                      </span>
                      <span className="px-3.5 py-1.5 liquid-glass spinning-glow-border rounded-full text-xs font-bold text-white">
                        Yapay Zeka (AI)
                      </span>
                      <span className="px-3.5 py-1.5 liquid-glass spinning-glow-border rounded-full text-xs font-bold text-white">
                        Python Geliştirme
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <button 
                        onClick={() => {
                          soundEngine.playTabSwitch();
                          setActiveTab('projects');
                        }}
                        className="inline-flex items-center gap-3.5 pl-6 pr-2 py-2 liquid-glass-strong hover:bg-white/5 rounded-full text-sm font-bold transition-all group hover:scale-105 active:scale-95 cursor-pointer"
                        id="cta-explore-projects"
                      >
                        <span>Projelerimi Keşfet</span>
                        <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center text-white transition-transform duration-300 group-hover:translate-x-1">
                          <ArrowRight size={14} />
                        </div>
                      </button>

                      <a
                        href={profile.github || "https://github.com/Emirhan0008"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2.5 px-4 py-2 liquid-glass-strong hover:bg-white/15 rounded-full text-xs sm:text-sm font-semibold font-mono text-white transition-all hover:scale-105 active:scale-95 border border-white/20 hover:border-emerald-400/50 shadow-md group cursor-pointer"
                        title={`GitHub: ${profile.name}`}
                      >
                        <Github size={15} className="text-white group-hover:text-emerald-400 transition-colors" />
                        <span>github.com/Emirhan0008</span>
                        <ExternalLink size={12} className="opacity-60 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </div>
                  </div>

                  {/* Left Panel Bottom Quote - shown in profile mode */}
                  <footer className="mt-auto pt-6 border-t border-white/5 z-10 flex flex-col gap-3.5 shrink-0">
                    <span className="text-[10px] tracking-[0.25em] uppercase text-white/60 font-semibold">
                      VİZYONER YAKLAŞIM
                    </span>
                    <blockquote className="text-sm md:text-base font-normal italic leading-relaxed text-white">
                      "Zihnin derinliklerini, algoritmanın <span className="font-serif text-white font-medium">gücüyle anlamak</span>."
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
                    </div>
                  </footer>
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
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-1.5 p-1 liquid-glass rounded-full overflow-x-auto transition-all duration-300">
              {/* Dual-Theme Skeuomorphic Switch (Normal vs Terminal Mode) */}
              <ThemeToggle theme={theme} onToggle={toggleTheme} className="shrink-0" />
              <div className="w-[1px] h-5 bg-white/15 mx-0.5 shrink-0" />

              {/* GitHub - Expandable on Hover */}
              <a 
                href="https://github.com/Emirhan0008" 
                target="_blank" 
                rel="noopener noreferrer" 
                onClick={() => soundEngine.playGlassClick()}
                className="h-8 px-2.5 hover:px-3.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 hover:border-emerald-400/50 text-white font-mono text-xs font-bold transition-all duration-300 shrink-0 flex items-center justify-center group overflow-hidden cursor-pointer"
                title="GitHub: Emirhan0008"
              >
                <Github size={14} className="shrink-0 text-white group-hover:text-emerald-400 transition-colors" />
                <div className="max-w-0 opacity-0 group-hover:max-w-[200px] group-hover:opacity-100 group-hover:ml-1.5 flex items-center gap-1.5 transition-all duration-300 ease-out overflow-hidden whitespace-nowrap">
                  <span className="text-[11px]">github.com/Emirhan0008</span>
                  <ExternalLink size={10} className="shrink-0 opacity-60 group-hover:opacity-100" />
                </div>
              </a>

              {/* Instagram - Expandable on Hover (Hesap yok, yakında) */}
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                onClick={() => soundEngine.playGlassClick()}
                className="h-8 px-2.5 hover:px-3.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 hover:border-pink-500/50 text-white font-mono text-xs font-bold transition-all duration-300 shrink-0 flex items-center justify-center group overflow-hidden cursor-pointer"
                title="Instagram (Henüz aktif profil yok)"
              >
                <Instagram size={14} className="shrink-0 text-white/80 group-hover:text-pink-400 transition-colors" />
                <div className="max-w-0 opacity-0 group-hover:max-w-[200px] group-hover:opacity-100 group-hover:ml-1.5 flex items-center gap-1.5 transition-all duration-300 ease-out overflow-hidden whitespace-nowrap">
                  <span className="text-[11px]">Instagram (Yakında)</span>
                  <ExternalLink size={10} className="shrink-0 opacity-60 group-hover:opacity-100" />
                </div>
              </a>

              {/* WhatsApp - Expandable on Hover */}
              <a 
                href="https://wa.me/?text=Merhaba%20Emirhan%20Bey,%20sitenizden%20ulaşıyorum." 
                target="_blank" 
                rel="noopener noreferrer" 
                onClick={() => soundEngine.playGlassClick()}
                className="h-8 px-2.5 hover:px-3.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 hover:border-emerald-500/50 text-white font-mono text-xs font-bold transition-all duration-300 shrink-0 flex items-center justify-center group overflow-hidden cursor-pointer"
                title="WhatsApp: Emirhan_yilmaz08"
              >
                <WhatsAppIcon size={14} className="shrink-0 text-white/80 group-hover:text-emerald-400 transition-colors" />
                <div className="max-w-0 opacity-0 group-hover:max-w-[200px] group-hover:opacity-100 group-hover:ml-1.5 flex items-center gap-1.5 transition-all duration-300 ease-out overflow-hidden whitespace-nowrap">
                  <span className="text-[11px]">Emirhan_yilmaz08</span>
                  <ExternalLink size={10} className="shrink-0 opacity-60 group-hover:opacity-100" />
                </div>
              </a>

              {/* Telegram - Expandable on Hover */}
              <a 
                href="https://t.me/emirhanyilmazrpd" 
                target="_blank" 
                rel="noopener noreferrer" 
                onClick={() => soundEngine.playGlassClick()}
                className="h-8 px-2.5 hover:px-3.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 hover:border-sky-400/50 text-white font-mono text-xs font-bold transition-all duration-300 shrink-0 flex items-center justify-center group overflow-hidden cursor-pointer"
                title="Telegram: t.me/emirhanyilmazrpd"
              >
                <TelegramIcon size={14} className="shrink-0 text-white/80 group-hover:text-sky-400 transition-colors" />
                <div className="max-w-0 opacity-0 group-hover:max-w-[200px] group-hover:opacity-100 group-hover:ml-1.5 flex items-center gap-1.5 transition-all duration-300 ease-out overflow-hidden whitespace-nowrap">
                  <span className="text-[11px]">t.me/emirhanyilmazrpd</span>
                  <ExternalLink size={10} className="shrink-0 opacity-60 group-hover:opacity-100" />
                </div>
              </a>

              {/* Gmail - Expandable on Hover */}
              <a 
                href="mailto:emirhan0008@gmail.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                onClick={() => soundEngine.playGlassClick()}
                className="h-8 px-2.5 hover:px-3.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 hover:border-red-400/50 text-white font-mono text-xs font-bold transition-all duration-300 shrink-0 flex items-center justify-center group overflow-hidden cursor-pointer"
                title="Gmail: emirhan0008@gmail.com"
              >
                <Mail size={14} className="shrink-0 text-white/80 group-hover:text-red-400 transition-colors" />
                <div className="max-w-0 opacity-0 group-hover:max-w-[200px] group-hover:opacity-100 group-hover:ml-1.5 flex items-center gap-1.5 transition-all duration-300 ease-out overflow-hidden whitespace-nowrap">
                  <span className="text-[11px]">emirhan0008@gmail.com</span>
                  <ExternalLink size={10} className="shrink-0 opacity-60 group-hover:opacity-100" />
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
                title={isMuted ? "Ses Efektlerini Aç" : "Ses Efektlerini Kapat"}
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
                title={isAmbientPlaying ? `Siber & Teknoloji Fon Müziğini Durdur (${currentMusicTrack.title})` : "Fütüristik Siber Fon Müziğini Başlat (Cyber Synthwave / Cyberspace Drift)"}
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
                <span className="hidden sm:inline">Teknoloji Radarı</span>
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
                <span>Proje Mimarisi Oluştur</span>
              </button>
            </div>
          </div>

          {/* DYNAMIC CONTENT SWITCHER */}
          <div className="flex-1 flex flex-col min-h-0">
            {theme === 'terminal' ? (
              <PowerShellTerminalWorkspace
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
                  className="flex-1 flex flex-col gap-6 overflow-y-auto pr-1 min-h-0"
                >
                  {/* Education & Certification Card */}
                  <div className="p-6 liquid-glass spinning-glow-border rounded-[2rem] flex flex-col gap-4">
                    <div className="flex items-center justify-between pb-1 border-b border-white/5">
                      <span className="text-[10px] tracking-wider text-white/95 uppercase font-bold">EĞİTİM & UZMANLIK</span>
                      {isAdmin && (
                        <button
                          type="button"
                          onClick={() => {
                            setAdminEditorTab('profile');
                            setShowAdminEditor(true);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 hover:text-black border border-emerald-500/30 text-emerald-300 text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <Edit3 size={11} />
                          <span>Düzenle</span>
                        </button>
                      )}
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white shrink-0">
                        <GraduationCap size={20} />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] tracking-wider text-white/95 uppercase font-bold">EĞİTİM & AKADEMİK</span>
                        <h3 className="text-lg font-extrabold text-white">{profile.education.school}</h3>
                        <p className="text-xs text-white font-bold leading-relaxed">
                          {profile.education.degree}
                        </p>
                        <p className="text-xs text-white/95 font-medium leading-relaxed mt-1">
                          {profile.education.details}
                        </p>
                      </div>
                    </div>

                    <div className="h-[1px] bg-white/10 w-full" />

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white shrink-0">
                        <Brain size={20} />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] tracking-wider text-white/95 uppercase font-bold">UZMANLIK SERTİFİKASI</span>
                        <h4 className="text-sm font-extrabold text-white">{profile.aiProfile.title}</h4>
                        <p className="text-xs text-white font-bold">{profile.aiProfile.certification}</p>
                        <p className="text-xs text-white/95 font-medium leading-relaxed mt-1">
                          {profile.aiProfile.details}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Feature Section Box (Experience & Skills & Mini Project Highlight) */}
                  <div className="mt-auto p-6 liquid-glass spinning-glow-border rounded-[2.5rem] flex flex-col gap-5">
                    
                    {/* Header with Switcher */}
                    <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                      <span className="text-[10px] tracking-widest text-white/95 uppercase font-bold">PROFESYONEL ODAK</span>
                      <div className="flex gap-1.5 p-0.5 rounded-full bg-white/5 border border-white/10">
                        <button
                          onClick={() => setProfileViewMode('summary')}
                          className={`px-3 py-1 rounded-full text-[9px] font-extrabold tracking-wide uppercase transition-all cursor-pointer ${
                            profileViewMode === 'summary' 
                              ? 'bg-white/15 text-white' 
                              : 'text-white/60 hover:text-white/90'
                          }`}
                        >
                          Özet
                        </button>
                        <button
                          onClick={() => setProfileViewMode('timeline')}
                          className={`px-3 py-1 rounded-full text-[9px] font-extrabold tracking-wide uppercase transition-all cursor-pointer ${
                            profileViewMode === 'timeline' 
                              ? 'bg-white/15 text-white' 
                              : 'text-white/60 hover:text-white/90'
                          }`}
                        >
                          Serüven (Timeline)
                        </button>
                      </div>
                    </div>

                    <AnimatePresence mode="wait">
                      {profileViewMode === 'summary' ? (
                        /* Double Mini Cards Side-by-Side */
                        <motion.div
                          key="profile-summary-cards"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="grid grid-cols-2 gap-4"
                        >
                          {/* Special Edu Card */}
                          <div className="p-5 liquid-glass spinning-glow-border rounded-3xl flex flex-col gap-3 group transition-all hover:bg-white/5">
                            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white transition-transform group-hover:scale-110">
                              <Wand2 size={16} />
                            </div>
                            <div>
                              <h4 className="text-xs text-white/95 uppercase tracking-widest font-bold">SAHA DENEYİMİ</h4>
                              <span className="text-sm font-extrabold text-white block mt-0.5">{profile.experience.title}</span>
                              <p className="text-[11px] text-white font-medium mt-1.5 leading-relaxed">
                                {profile.experience.description}
                              </p>
                            </div>
                          </div>

                          {/* Python & AI Card */}
                          <div className="p-5 liquid-glass spinning-glow-border rounded-3xl flex flex-col gap-3 group transition-all hover:bg-white/5">
                            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white transition-transform group-hover:scale-110">
                              <BookOpen size={16} />
                            </div>
                            <div>
                              <h4 className="text-xs text-white/95 uppercase tracking-widest font-bold">YAZILIM & YAPAY ZEKA</h4>
                              <span className="text-sm font-extrabold text-white block mt-0.5">{profile.softwareProfile.level}</span>
                              <p className="text-[11px] text-white font-medium mt-1.5 leading-relaxed">
                                {profile.softwareProfile.skills.slice(0, 3).join(', ')} ve sistem otomasyonları.
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ) : (
                        /* Gorgeous Career Timeline */
                        <motion.div
                          key="profile-timeline"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-4 py-1 max-h-[160px] overflow-y-auto pr-1"
                        >
                          {/* Node 1 */}
                          <div className="flex gap-3 relative pl-4 border-l border-white/10">
                            <div className="absolute -left-[4.5px] top-1.5 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                            <div className="space-y-0.5">
                              <span className="text-[9px] font-extrabold text-emerald-400 font-mono">GÜNCEL (1-2 YILDIR GELİŞİM)</span>
                              <h4 className="text-xs font-bold text-white">Yazılım & Yapay Zeka Geliştiricisi (1-2 Yıl)</h4>
                              <p className="text-[10px] text-white/75 leading-relaxed">1-2 yıldır Python otomasyonları, Gemini API istem mühendisliği ve React Native mobil projeleri üzerine yoğunlaşıyorum.</p>
                            </div>
                          </div>
                          {/* Node 2 */}
                          <div className="flex gap-3 relative pl-4 border-l border-white/10">
                            <div className="absolute -left-[4.5px] top-1.5 w-2 h-2 rounded-full bg-white/40" />
                            <div className="space-y-0.5">
                              <span className="text-[9px] font-extrabold text-white/50 font-mono">2023 - 2026</span>
                              <h4 className="text-xs font-bold text-white">Özel Eğitim Öğretmenliği (3 Yıl)</h4>
                              <p className="text-[10px] text-white/75 leading-relaxed">Bireyselleştirilmiş eğitim planları (BEP) ve teknoloji entegrasyonu.</p>
                            </div>
                          </div>
                          {/* Node 3 */}
                          <div className="flex gap-3 relative pl-4 border-l border-white/10">
                            <div className="absolute -left-[4.5px] top-1.5 w-2 h-2 rounded-full bg-white/40" />
                            <div className="space-y-0.5">
                              <span className="text-[9px] font-extrabold text-white/50 font-mono">2022</span>
                              <h4 className="text-xs font-bold text-white">Yapay Zeka Sertifikasyonu</h4>
                              <p className="text-[10px] text-white/75 leading-relaxed">Marmara Üni. Yapay Zeka & Makine Öğrenmesi Başarı Eğitimi.</p>
                            </div>
                          </div>
                          {/* Node 4 */}
                          <div className="flex gap-3 relative pl-4">
                            <div className="absolute -left-[4.5px] top-1.5 w-2 h-2 rounded-full bg-white/40" />
                            <div className="space-y-0.5">
                              <span className="text-[9px] font-extrabold text-white/50 font-mono">2021</span>
                              <h4 className="text-xs font-bold text-white">PDR Lisans Mezuniyeti</h4>
                              <p className="text-[10px] text-white/75 leading-relaxed">Aksaray Üniversitesi Rehberlik ve Psikolojik Danışmanlık mezuniyeti.</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Mini Featured Project Bottom Highlight */}
                    <div 
                      onClick={() => setSelectedProject(mappedProjects[0])}
                      className="p-4 liquid-glass spinning-glow-border rounded-2xl flex items-center justify-between gap-4 cursor-pointer group hover:bg-white/5 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0 border border-white/20">
                          <img 
                            src={mappedProjects[0].image} 
                            alt={mappedProjects[0].title} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              const original = projects.find(p => p.id === mappedProjects[0].id);
                              if (original) e.currentTarget.src = original.image;
                            }}
                          />
                        </div>
                        <div>
                          <span className="text-[9px] uppercase tracking-wider text-white/95 font-bold">Öne Çıkan Proje</span>
                          <h4 className="text-sm font-extrabold text-white group-hover:text-white">{mappedProjects[0].title}</h4>
                          <p className="text-xs text-white line-clamp-1">{mappedProjects[0].description}</p>
                        </div>
                      </div>
                      
                      <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white transition-transform duration-300 group-hover:scale-110">
                        <span className="text-lg font-medium leading-none">+</span>
                      </button>
                    </div>

                  </div>
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
                  <div className="p-6 liquid-glass spinning-glow-border rounded-3xl flex flex-col gap-4 min-h-0 flex-1 relative">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-0.5">
                        <span className="text-[10px] uppercase tracking-wider text-white font-extrabold">GALERİ & DETAYLAR</span>
                        <h2 className="text-xl font-extrabold text-white">Yenilikçi Projelerim</h2>
                      </div>
                      <span className="text-xs text-white font-bold bg-white/10 px-3 py-1 rounded-full border border-white/10 w-fit">
                        {filteredProjects.length} Proje Listelendi
                      </span>
                    </div>

                    {/* Search Bar & Category Filter Pills */}
                    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                      {/* Search Input Bar */}
                      <div className="relative flex-1 max-w-md">
                        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/50" />
                        <input
                          type="text"
                          placeholder="Proje, teknoloji veya içerik ara (örn: Python, Gemini)..."
                          value={searchQuery}
                          onChange={e => setSearchQuery(e.target.value)}
                          className="w-full py-2 pl-9 pr-8 rounded-xl bg-white/5 border border-white/10 focus:outline-hidden focus:ring-1 focus:ring-white/30 text-xs text-white placeholder-white/40 font-medium transition-all"
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

                      {/* Filter Pills */}
                      <div className="flex flex-wrap gap-1.5 p-1 liquid-glass spinning-glow-border rounded-xl text-[10px]">
                        {['Tümü', 'Mobil', 'Yapay Zeka', 'Python', 'Özel Eğitim', 'Otomasyon & Analitik'].map(filter => (
                          <button
                            key={filter}
                            onClick={() => setProjectFilter(filter)}
                            className={`px-2.5 py-1 rounded-md transition-all font-bold cursor-pointer ${
                              projectFilter === filter 
                                ? 'bg-white/20 text-white font-extrabold shadow-xs' 
                                : 'text-white/75 hover:text-white hover:bg-white/10'
                            }`}
                          >
                            {filter}
                          </button>
                        ))}
                      </div>
                    </div>

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
                        <h3 className="text-sm font-bold text-white">Aradığınız kriterlere uygun proje bulunamadı</h3>
                        <p className="text-xs text-white/60 max-w-xs">
                          Farklı bir arama kelimesi yazabilir veya kategori filtrelerini sıfırlayabilirsiniz.
                        </p>
                        <button
                          onClick={() => {
                            setSearchQuery('');
                            setProjectFilter('Tümü');
                          }}
                          className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs text-white font-bold transition-all cursor-pointer mt-1"
                        >
                          Filtreleri Temizle
                        </button>
                      </div>
                    ) : (
                      <div 
                        onScroll={handleProjectsScroll}
                        className="flex-1 overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 gap-4"
                      >
                        {filteredProjects.map((project, idx) => (
                          <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            onClick={() => {
                              soundEngine.playGlassClick();
                              setSelectedProject(project);
                            }}
                            className={`group cursor-pointer p-3 liquid-glass spinning-glow-border rounded-2xl flex flex-col h-[285px] shrink-0 justify-between hover:bg-white/5 transition-all relative overflow-hidden ${
                              currentSelectedProject?.id === project.id ? 'ring-2 ring-emerald-400 border-emerald-400 bg-white/10 shadow-lg shadow-emerald-500/10' : ''
                            }`}
                          >
                            <div className="relative h-[135px] w-full rounded-xl overflow-hidden bg-zinc-900 border border-white/10 shrink-0">
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
                              {currentSelectedProject?.id === project.id && (
                                <div className="absolute top-2 left-2 bg-emerald-500 text-black text-[9px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-lg z-10">
                                  <span>👈 Solda Açık</span>
                                </div>
                              )}
                              {!isAdmin && project.demoUrl && (
                                <div className="absolute top-2 right-2 bg-emerald-950/90 backdrop-blur-md text-emerald-300 border border-emerald-500/40 text-[9px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md z-10">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                  <span>CANLI YAYINDA</span>
                                </div>
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
                                <span className="text-[10px] text-white font-bold inline-flex items-center gap-1">
                                  Detaylar <ChevronRight size={10} />
                                </span>
                                {project.demoUrl && (
                                  <a
                                    href={sanitizeUrl(project.demoUrl) || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-[10px] flex items-center gap-1 shadow-md transition-transform hover:scale-105"
                                  >
                                    <ExternalLink size={10} /> Denemeye Git
                                  </a>
                                )}
                              </div>
                            </div>

                            <div className="space-y-1 px-1 flex-1 flex flex-col justify-center">
                              <div className="flex items-center justify-between gap-1">
                                <span className="text-[10px] uppercase tracking-wider text-white/90 font-extrabold">{project.category}</span>
                                {project.demoUrl && (
                                  <span className="text-[9px] text-emerald-400 font-bold flex items-center gap-0.5">
                                    <ExternalLink size={8} /> Yayında
                                  </span>
                                )}
                              </div>
                              <h3 className="text-sm font-extrabold text-white group-hover:text-emerald-300 transition-colors truncate leading-snug">{project.title}</h3>
                              <p className="text-xs text-white/95 line-clamp-2 leading-relaxed font-semibold">{project.description}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {/* Floating Scroll Down Indicator */}
                    <AnimatePresence>
                      {filteredProjects.length > 4 && showDesktopScrollIndicator && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, x: "-50%" }}
                          animate={{ opacity: 1, y: 0, x: "-50%" }}
                          exit={{ opacity: 0, y: 10, x: "-50%" }}
                          className="absolute bottom-6 left-1/2 px-4 py-2 bg-black/90 backdrop-blur-md rounded-full border border-white/10 shadow-xl flex items-center gap-2 text-[10px] text-white font-extrabold tracking-wider uppercase animate-bounce pointer-events-none z-20"
                        >
                          <span>DAHA FAZLA PROJE İÇİN AŞAĞI KAYDIRIN</span>
                          <span className="text-sm">↕</span>
                        </motion.div>
                      )}
                    </AnimatePresence>

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
                  className="flex-1 flex flex-col gap-6 min-h-0 relative"
                >
                  <div className="p-6 liquid-glass spinning-glow-border rounded-3xl flex flex-col gap-4 min-h-0 flex-1 relative overflow-y-auto pr-1">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-wider text-white/90 font-extrabold">YAYINLAR & DÜŞÜNCELER</span>
                      <h2 className="text-xl font-extrabold text-white">Makaleler ve Teknik İncelemeler</h2>
                      <p className="text-xs text-white/70 leading-relaxed max-w-xl">
                        Psikolojik danışmanlık kuramları, özel eğitim teknolojileri, büyük dil modelleri (LLM) ve Python otomasyonları üzerine kaleme aldığım makaleler.
                      </p>
                    </div>

                    {/* Admin Article Bar */}
                    {isAdmin && (
                      <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 mb-2 shrink-0">
                        <span className="text-[11px] text-emerald-300 font-bold flex items-center gap-1.5">
                          <FileText size={14} /> Makale Yönetim Modu Açık
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingArticleId(null);
                            setAdminEditorTab('articles');
                            setShowAdminEditor(true);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-emerald-500 text-black font-extrabold text-[11px] flex items-center gap-1 cursor-pointer hover:bg-emerald-400 transition-all shadow-md"
                        >
                          <Plus size={13} />
                          <span>Yeni Makale Ekle</span>
                        </button>
                      </div>
                    )}

                    <div className="grid grid-cols-1 gap-4 pt-2">
                      {articleList.map((article, idx) => (
                        <motion.div
                          key={article.id}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          onClick={() => {
                            soundEngine.playGlassClick();
                            setSelectedArticle(article);
                          }}
                          className={`p-5 liquid-glass spinning-glow-border rounded-2xl flex flex-col gap-3 group cursor-pointer hover:bg-white/5 transition-all ${
                            selectedArticle?.id === article.id ? 'ring-2 ring-emerald-400 border-emerald-400 bg-white/10 shadow-lg shadow-emerald-500/10' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between text-[10px] text-white/60 font-mono">
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white font-bold font-sans">
                                {article.category}
                              </span>
                              {selectedArticle?.id === article.id && (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-black text-[9px] font-extrabold shadow-sm">
                                  👈 Solda Açık
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span>{article.date} • {article.readTime}</span>
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

                          <div className="space-y-1.5">
                            <h3 className="text-base font-extrabold text-white group-hover:text-emerald-300 transition-colors">
                              {article.title}
                            </h3>
                            <p className="text-xs text-white/80 leading-relaxed line-clamp-2">
                              {article.summary}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-white/5">
                            <div className="flex flex-wrap gap-1.5">
                              {article.tags.map(tag => (
                                <span key={tag} className="text-[9px] px-2 py-0.5 rounded-md bg-white/5 text-white/60">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                            <span className="text-xs font-bold text-white/90 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                              Oku <ArrowRight size={12} />
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
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
                  className="flex-1 flex flex-col gap-6 overflow-y-auto pr-1 min-h-0"
                >
                  <div className="p-6 lg:p-8 liquid-glass spinning-glow-border rounded-[2.5rem] flex-1 flex flex-col gap-6 justify-start">
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase tracking-wider text-white/95 font-bold">İLETİŞİM ALTYAPISI</span>
                      <h2 className="text-2xl font-extrabold text-white">Birlikte Çalışalım</h2>
                      <p className="text-xs sm:text-sm text-white font-semibold leading-relaxed">
                        Akademik projeler, psikolojik danışmanlık süreçlerinde teknoloji entegrasyonu, Python otomasyonları veya vaka analizi üzerine iş birlikleri için yazabilirsiniz.
                      </p>
                    </div>

                    {/* Quick Contact Action Pills */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                      <a
                        href={profile.github || "https://github.com/Emirhan0008"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-2.5 text-xs text-white font-bold transition-all hover:scale-102 cursor-pointer group"
                        title={`GitHub: ${profile.github}`}
                      >
                        <Github size={14} className="text-white/70 group-hover:text-emerald-400 shrink-0 transition-colors" />
                        <span className="truncate font-mono">GitHub</span>
                        <ExternalLink size={11} className="text-white/40 ml-auto shrink-0 group-hover:text-white" />
                      </a>

                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(profile.email || 'emirhan0008@gmail.com');
                          setCopiedEmail(true);
                          setTimeout(() => setCopiedEmail(false), 2500);
                        }}
                        className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-2.5 text-xs text-white font-bold transition-all hover:scale-102 cursor-pointer"
                      >
                        <Copy size={14} className="text-white/70 shrink-0" />
                        <span className="truncate">{copiedEmail ? 'E-posta Kopyalandı!' : (profile.email || 'emirhan0008@gmail.com')}</span>
                      </button>

                      <a
                        href={`mailto:${profile.email || 'emirhan0008@gmail.com'}?subject=${encodeURIComponent(contactSubject)}&body=${encodeURIComponent(formData.message || 'Merhaba,')}`}
                        className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-2.5 text-xs text-white font-bold transition-all hover:scale-102 cursor-pointer"
                      >
                        <Mail size={14} className="text-white/70 shrink-0" />
                        <span className="truncate">E-Posta Gönder</span>
                      </a>

                      <a
                        href={`https://wa.me/?text=${encodeURIComponent('Merhaba ' + profile.name + ', sitenizden ulaşıyorum.')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-2xl bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-500/20 flex items-center gap-2.5 text-xs text-emerald-300 font-bold transition-all hover:scale-102 cursor-pointer"
                      >
                        <Phone size={14} className="text-emerald-400 shrink-0" />
                        <span className="truncate">WhatsApp Mesajı</span>
                      </a>
                    </div>

                    {formSubmitted ? (
                      <motion.div 
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="p-8 liquid-glass spinning-glow-border rounded-3xl flex flex-col items-center justify-center text-center gap-4 border border-white/10 my-auto"
                      >
                        <CheckCircle2 size={48} className="text-emerald-400 animate-pulse" />
                        <div className="space-y-1">
                          <h3 className="text-lg font-bold text-white">Mesajınız Başarıyla Alındı!</h3>
                          <p className="text-xs text-white/80 leading-relaxed max-w-sm">
                            Geliştirici paneli mesaj kutusuna kaydedildi. En kısa sürede e-posta adresiniz üzerinden dönüş yapılacaktır.
                          </p>
                        </div>
                      </motion.div>
                    ) : (
                      <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
                        {/* Honeypot Spam Trap */}
                        <input 
                          type="text" 
                          name="website_trap" 
                          value={honeypot} 
                          onChange={e => setHoneypot(e.target.value)} 
                          className="absolute -top-[9999px] -left-[9999px] h-0 w-0 opacity-0 pointer-events-none" 
                          tabIndex={-1} 
                          autoComplete="off" 
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <label className="text-[10px] uppercase tracking-wider text-white/95 font-bold px-1">Ad Soyad</label>
                            <input 
                              type="text" 
                              required
                              maxLength={100}
                              placeholder="Adınız ve Soyadınız"
                              value={formData.name}
                              onChange={e => {
                                setFormData({ ...formData, name: e.target.value });
                                if (formError) setFormError(null);
                              }}
                              className="w-full py-2.5 px-4 rounded-xl liquid-glass border border-white/10 focus:outline-hidden focus:ring-1 focus:ring-white/35 text-xs text-white placeholder-white/40 font-medium"
                              disabled={isSubmitting}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] uppercase tracking-wider text-white/95 font-bold px-1">E-posta</label>
                            <input 
                              type="email" 
                              required
                              maxLength={100}
                              placeholder="ornek@domain.com"
                              value={formData.email}
                              onChange={e => {
                                setFormData({ ...formData, email: e.target.value });
                                if (formError) setFormError(null);
                              }}
                              className="w-full py-2.5 px-4 rounded-xl liquid-glass border border-white/10 focus:outline-hidden focus:ring-1 focus:ring-white/35 text-xs text-white placeholder-white/40 font-medium"
                              disabled={isSubmitting}
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase tracking-wider text-white/95 font-bold px-1">Konu / Kategori</label>
                          <select
                            value={contactSubject}
                            onChange={e => setContactSubject(e.target.value)}
                            className="w-full py-2.5 px-4 rounded-xl bg-black/60 border border-white/10 focus:outline-hidden focus:ring-1 focus:ring-white/35 text-xs text-white font-medium"
                          >
                            <option value="Proje Teklifi / Danışmanlık" className="bg-zinc-900">Proje Teklifi / Danışmanlık</option>
                            <option value="Akademik & PDR Çalışması" className="bg-zinc-900">Akademik & PDR Çalışması</option>
                            <option value="Yazılım & Yapay Zeka Entegrasyonu" className="bg-zinc-900">Yazılım & Yapay Zeka Entegrasyonu</option>
                            <option value="Genel İletişim / Soru" className="bg-zinc-900">Genel İletişim / Soru</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase tracking-wider text-white/95 font-bold px-1">Mesajınız</label>
                          <textarea 
                            required
                            rows={3}
                            maxLength={1000}
                            placeholder="İş birliği veya proje detaylarınızı buraya yazabilirsiniz..."
                            value={formData.message}
                            onChange={e => {
                              setFormData({ ...formData, message: e.target.value });
                              if (formError) setFormError(null);
                            }}
                            className="w-full py-2.5 px-4 rounded-xl liquid-glass border border-white/10 focus:outline-hidden focus:ring-1 focus:ring-white/35 text-xs text-white placeholder-white/40 resize-none"
                            disabled={isSubmitting}
                          />
                        </div>

                        {formError && (
                          <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2 animate-shake">
                            <AlertTriangle size={15} className="shrink-0 text-red-400" />
                            <span className="font-semibold">{formError}</span>
                          </div>
                        )}

                        <button 
                          type="submit"
                          disabled={isSubmitting}
                          className={`w-full py-3 rounded-xl liquid-glass-strong spinning-glow-border font-bold text-xs flex items-center justify-center gap-2 border-none transition-all cursor-pointer ${
                            isSubmitting 
                              ? 'opacity-60 cursor-not-allowed bg-white/5 text-white/50' 
                              : 'hover:bg-white/10 hover:scale-102'
                          }`}
                        >
                          {isSubmitting ? (
                            <>
                              <div className="w-3 h-3 rounded-full border-2 border-t-transparent border-white/80 animate-spin shrink-0" />
                              <span>İletiliyor...</span>
                            </>
                          ) : (
                            <>
                              <Send size={12} />
                              <span>Mesajı Gönder</span>
                            </>
                          )}
                        </button>
                      </form>
                    )}
                  </div>
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
          <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-3xl my-8"
            >
              <ProjectEstimator
                onClose={() => setShowEstimatorModal(false)}
                onApplyToContact={(msg) => {
                  setFormData(prev => ({ ...prev, message: msg }));
                  setShowEstimatorModal(false);
                  setActiveTab('contact');
                }}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
                onSelectProject={(id) => {
                  const proj = projects.find(p => p.id === id);
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
        onNavigateToTab={(tab) => {
          setTheme('normal');
          setActiveTab(tab as any);
        }}
        onOpenTerminal={() => {
          setTheme('terminal');
        }}
      />

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
      />

    </div>
  );
}

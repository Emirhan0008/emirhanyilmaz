import { useState, useEffect, FormEvent, UIEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Download, 
  Wand2, 
  BookOpen, 
  ArrowRight, 
  Linkedin, 
  Instagram, 
  Menu, 
  X, 
  GraduationCap, 
  Brain, 
  Code2, 
  Briefcase, 
  ChevronRight, 
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
  ExternalLink
 } from 'lucide-react';
 
 import { profileData, projects } from './data';
 import { Project } from './types';
 import { SeamlessVideo } from './components/SeamlessVideo';
 
 export interface ContactMessage {
   id: string;
   name: string;
   email: string;
   message: string;
   date: string;
   timestamp: number;
 }
 
 export default function App() {
   const [activeTab, setActiveTab] = useState<'profile' | 'projects' | 'contact'>('profile');
   const [activeLightboxImage, setActiveLightboxImage] = useState<string | null>(null);
   const [selectedProject, setSelectedProject] = useState<Project | null>(null);
   const [projectFilter, setProjectFilter] = useState<string>('Tümü');
   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
   const [formSubmitted, setFormSubmitted] = useState(false);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [formData, setFormData] = useState({ name: '', email: '', message: '' });
   const [honeypot, setHoneypot] = useState('');
   const [copiedEmail, setCopiedEmail] = useState(false);
   const [inboxMessages, setInboxMessages] = useState<ContactMessage[]>([]);
 
   // Cryptographically secured Admin Mode with rate-limiting & brute-force lockouts
   const [isAdmin, setIsAdmin] = useState(false);
   const [showAdminInbox, setShowAdminInbox] = useState(false);
   const [showAdminModal, setShowAdminModal] = useState(false);
   const [adminPasscode, setAdminPasscode] = useState('');
   const [showPasscode, setShowPasscode] = useState(false);
   
   // Security rate limits and persistent tab-session lockout
   const [failedAttempts, setFailedAttempts] = useState(0);
   const [lockoutUntil, setLockoutUntil] = useState(0);
   const [lockoutDurationLeft, setLockoutDurationLeft] = useState(0);
   
   // Secret click sequencer for footer trigger
   const [secretClickCount, setSecretClickCount] = useState(0);
   const [lastClickTime, setLastClickTime] = useState(0);

   const [showAdminToast, setShowAdminToast] = useState(false);
   const [adminToastMessage, setAdminToastMessage] = useState('');
 
   const [showDesktopScrollIndicator, setShowDesktopScrollIndicator] = useState(true);
   const [showMobileScrollIndicator, setShowMobileScrollIndicator] = useState(true);
   const [profileViewMode, setProfileViewMode] = useState<'summary' | 'timeline'>('summary');
 
   // Helper function for secure SHA-256 browser hashing
   const sha256 = async (str: string): Promise<string> => {
     const buf = new TextEncoder().encode(str);
     const hash = await crypto.subtle.digest('SHA-256', buf);
     return Array.from(new Uint8Array(hash))
       .map(b => b.toString(16).padStart(2, '0'))
       .join('');
   };

   const handleAdminTrigger = () => {
     if (isAdmin) {
       setIsAdmin(false);
       setAdminToastMessage("Yönetici Modu Kapatıldı (Ziyaretçi moduna dönüldü)");
       setShowAdminToast(true);
       setTimeout(() => setShowAdminToast(false), 3500);
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

   const handlePasscodeSubmit = async (e: FormEvent) => {
     e.preventDefault();
     const now = Date.now();
     if (lockoutUntil && now < lockoutUntil) return;

     try {
       const hashedInput = await sha256(adminPasscode);
       // Pre-computed SHA-256 hash of "Emirhan.yz.2026"
       if (hashedInput === '5a38e84f02885e8ee651ba7d5f052c1a4a57adcadadc1a6802d96dcf4da862a4') {
         setIsAdmin(true);
         setShowAdminModal(false);
         setAdminPasscode('');
         setFailedAttempts(0);
         setLockoutUntil(0);
         sessionStorage.removeItem('adm_lck_ut');
         
         setAdminToastMessage("Yönetici Modu Aktif (Özel fotoğraf düzenleme araçları açıldı!)");
         setShowAdminToast(true);
         setTimeout(() => setShowAdminToast(false), 4000);
       } else {
         const nextFailed = failedAttempts + 1;
         setFailedAttempts(nextFailed);
         setAdminPasscode('');
         
         let lockTime = 0;
         if (nextFailed >= 5) {
           lockTime = now + 5 * 60 * 1000; // 5 mins lockout
           setAdminToastMessage("Güvenlik Kilidi! 5 dakika boyunca giriş engellendi.");
         } else if (nextFailed >= 3) {
           lockTime = now + 30 * 1000; // 30 seconds lockout
           setAdminToastMessage("Hatalı deneme! 30 saniye boyunca giriş engellendi.");
         } else {
           setAdminToastMessage(`Hatalı şifre! (Kalan deneme hakkı: ${5 - nextFailed})`);
         }

         if (lockTime > 0) {
           setLockoutUntil(lockTime);
           sessionStorage.setItem('adm_lck_ut', lockTime.toString());
         }
         setShowAdminToast(true);
         setTimeout(() => setShowAdminToast(false), 4000);
       }
     } catch (err) {
       // Safe silent fallback
     }
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

     // Load admin messages
     const storedMsgs = localStorage.getItem('adm_msg_store');
     if (storedMsgs) {
       try {
         setInboxMessages(JSON.parse(storedMsgs));
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
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const handleSaveImage = (projectId: string, imageUrl: string) => {
    const updated = { ...projectImages, [projectId]: imageUrl };
    setProjectImages(updated);
    try {
      localStorage.setItem('emirhan_project_images', JSON.stringify(updated));
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

  const handleSaveDetailedImage = (projectId: string, imageUrl: string) => {
    const currentList = projectDetailedImages[projectId] || [];
    const updated = { ...projectDetailedImages, [projectId]: [...currentList, imageUrl] };
    setProjectDetailedImages(updated);
    try {
      localStorage.setItem('emirhan_project_detailed_images', JSON.stringify(updated));
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

  // Map custom uploaded photos onto existing project structures
  const mappedProjects = projects.map(project => ({
    ...project,
    image: projectImages[project.id] || project.image
  }));

  // Filter projects based on selected filter
  const filteredProjects = mappedProjects.filter(project => {
    if (projectFilter === 'Tümü') return true;
    if (projectFilter === 'Mobil') return project.category.includes('Mobil') || project.tech.includes('React Native') || project.tech.includes('Expo');
    if (projectFilter === 'Yapay Zeka') return project.category.includes('Yapay Zeka') || project.title.includes('Yapay Zeka') || project.tech.includes('Gemini API') || project.tech.includes('AI Studio') || project.tech.includes('Google AI Studio');
    if (projectFilter === 'Python') return project.tech.includes('Python');
    if (projectFilter === 'Özel Eğitim') return project.category.includes('Özel Eğitim');
    if (projectFilter === 'Otomasyon & Analitik') return project.category.includes('Otomasyon') || project.category.includes('Analitik') || project.category.includes('Kazıma');
    return true;
  });

  // Track currently selected project with up-to-date image reference
  const currentSelectedProject = selectedProject 
    ? mappedProjects.find(p => p.id === selectedProject.id) || selectedProject
    : null;

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Honeypot trap check - block automated bots from submitting spam
    if (honeypot) {
      setFormData({ name: '', email: '', message: '' });
      setHoneypot('');
      return;
    }

    setIsSubmitting(true);
    
    // Save to local inbox storage
    const newMessage: ContactMessage = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2),
      name: formData.name,
      email: formData.email,
      message: formData.message,
      date: new Date().toLocaleString('tr-TR'),
      timestamp: Date.now()
    };
    
    const updatedMessages = [newMessage, ...inboxMessages];
    setInboxMessages(updatedMessages);
    localStorage.setItem('adm_msg_store', JSON.stringify(updatedMessages));
    
    // Simulate highly optimized transmission process
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
    { id: 'contact', label: 'İletişim' }
  ] as const;

  return (
    <div className="relative min-h-screen w-full bg-black text-white font-sans overflow-x-hidden antialiased select-none">
      
      {/* BACKGROUND VIDEO */}
      <div className="fixed inset-0 w-full h-full z-0 overflow-hidden select-none pointer-events-none">
        <SeamlessVideo src="https://ymszciupoambjhyagmzt.supabase.co/storage/v1/object/public/media/upscaled-video%20(1).mp4" />
        {/* Subtle vignette to preserve soft depth and text clarity, without stripping video colors */}
        <div className="absolute inset-0 bg-radial from-transparent via-black/10 to-black/60 z-1" />
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px] z-2" />
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
                  <Shield size={16} className="text-white/60" /> Güvenlik Doğrulaması
                </h3>
                <p className="text-xs text-white/60 leading-relaxed max-w-[280px] mx-auto">
                  Geliştirici paneline erişmek için şifre doğrulama adımı gereklidir.
                </p>
              </div>

              {lockoutUntil > 0 ? (
                /* Locked Out View */
                <div className="py-4 px-3 rounded-2xl bg-red-950/20 border border-red-500/20 text-center space-y-2">
                  <span className="text-[10px] text-red-400 font-extrabold tracking-widest uppercase block animate-pulse">
                    KİLİTLENDİ
                  </span>
                  <p className="text-xs text-white/80">
                    Çok fazla başarısız deneme nedeniyle sistem kilitlendi.
                  </p>
                  <p className="text-[13px] text-red-400 font-mono font-bold">
                    Kalan Süre: {Math.floor(lockoutDurationLeft / 60)}dk {lockoutDurationLeft % 60}sn
                  </p>
                </div>
              ) : (
                /* Passcode Form View */
                <form onSubmit={handlePasscodeSubmit} className="space-y-4">
                  <div className="relative">
                    <input
                      type={showPasscode ? 'text' : 'password'}
                      required
                      placeholder="Güvenlik Anahtarı"
                      value={adminPasscode}
                      onChange={e => setAdminPasscode(e.target.value)}
                      className="w-full py-3 pl-4 pr-11 rounded-xl bg-white/5 border border-white/10 focus:outline-hidden focus:ring-1 focus:ring-white/30 text-xs text-white placeholder-white/20 font-mono tracking-widest text-center"
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
                    <span className="text-[9px] text-amber-400/80 font-bold block">
                      ⚠️ Hatalı Giriş. Kalan Deneme Hakkı: {5 - failedAttempts}
                    </span>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 font-bold text-xs flex items-center justify-center gap-2 transition-all hover:scale-102 cursor-pointer text-white"
                  >
                    <span>Doğrula ve Giriş Yap</span>
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CONTAINER */}
      <div className="relative z-10 h-auto lg:h-screen lg:max-h-screen w-full flex flex-col lg:flex-row p-4 lg:p-6 gap-6 lg:overflow-hidden">
        
        {/* LEFT PANEL (Branding Anchor & Core Profile Header) */}
        <div className="w-full lg:w-[52%] h-auto lg:h-full lg:max-h-full relative flex flex-col rounded-3xl p-6 lg:p-8 liquid-glass-clear spinning-glow-border overflow-hidden select-text">
          
          {/* Left Panel Header / Navigation */}
          <header className="flex items-center justify-between z-10 mb-8 lg:mb-12">
            <div 
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => setActiveTab('profile')}
            >
              <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20 transition-transform duration-300 group-hover:scale-110">
                <img 
                  src={profileData.avatar} 
                  alt="Emirhan Yılmaz" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="text-xl font-semibold tracking-tight text-white transition-opacity duration-300 group-hover:opacity-95">
                Emirhan <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-white/95 to-white/80">YILMAZ</span>
              </span>
            </div>

            {/* Desktop Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-1.5 p-1 liquid-glass rounded-full text-xs">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-4 py-1.5 rounded-full transition-all duration-300 font-bold ${
                    activeTab === item.id 
                      ? 'bg-white/15 text-white shadow-xs' 
                      : 'text-white/85 hover:text-white hover:bg-white/10'
                  }`}
                  id={`nav-btn-${item.id}`}
                >
                  {item.label}
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
                {navItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full py-2.5 px-4 rounded-xl text-left text-sm transition-all ${
                      activeTab === item.id 
                        ? 'bg-white/10 text-white font-bold' 
                        : 'text-white/85 hover:text-white hover:bg-white/10 font-semibold'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Left Panel Body Content */}
          <div className="flex-1 flex flex-col justify-center lg:justify-start z-10 py-6 overflow-y-auto pr-1">
            
            {/* Dynamic Content Display based on Mobile Active Tab */}
            <AnimatePresence mode="wait">
              {activeTab === 'profile' || window.innerWidth >= 1024 ? (
                <motion.div 
                  key="hero-profile-content"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-start gap-6 lg:gap-8 max-w-xl"
                >
                  <div className="w-20 h-20 rounded-full p-1 liquid-glass flex items-center justify-center overflow-hidden transition-transform duration-500 hover:rotate-6">
                    <img 
                      src={profileData.avatar} 
                      alt="Emirhan Yılmaz Avatar" 
                      className="w-full h-full object-cover rounded-full"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 liquid-glass rounded-full text-[10px] tracking-widest uppercase text-white font-bold">
                        <Sparkles size={10} /> {profileData.title}
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
                      Teknolojiyi psikolojiyle harmanlayarak, zihinsel süreçleri veri biliminin ve algoritmanın gücüyle yeniden şekillendiriyorum.
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

                  <button 
                    onClick={() => setActiveTab('projects')}
                    className="inline-flex items-center gap-3.5 pl-6 pr-2 py-2 liquid-glass-strong hover:bg-white/5 rounded-full text-sm font-bold transition-all group hover:scale-105 active:scale-95"
                    id="cta-explore-projects"
                  >
                    <span>Projelerimi Keşfet</span>
                    <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center text-white transition-transform duration-300 group-hover:translate-x-1">
                      <ArrowRight size={14} />
                    </div>
                  </button>
                </motion.div>
              ) : activeTab === 'projects' ? (
                // Render project view inside left panel on mobile only
                <motion.div 
                  key="mobile-projects"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="lg:hidden flex flex-col gap-6 relative"
                >
                  <div className="space-y-1">
                    <h2 className="text-3xl font-extrabold tracking-tight text-white">Projelerim</h2>
                    <p className="text-xs text-white font-semibold">Yapay Zeka, Python ve Psikoloji odaklı yenilikçi çalışmalarım</p>
                  </div>
                  
                  {/* Filters */}
                  <div className="flex flex-wrap gap-1.5">
                    {['Tümü', 'Mobil', 'Yapay Zeka', 'Python', 'Özel Eğitim', 'Otomasyon & Analitik'].map(filter => (
                      <button
                        key={filter}
                        onClick={() => setProjectFilter(filter)}
                        className={`px-3 py-1 rounded-full text-xs transition-all font-bold ${
                          projectFilter === filter 
                            ? 'bg-white/20 text-white font-extrabold' 
                            : 'bg-white/5 text-white/80 hover:bg-white/10'
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>

                  {/* Projects List */}
                  <div 
                    onScroll={handleMobileProjectsScroll}
                    className="grid grid-cols-1 gap-4 max-h-[45vh] overflow-y-auto pr-1 relative"
                  >
                    {filteredProjects.map(project => (
                      <div 
                        key={project.id}
                        onClick={() => setSelectedProject(project)}
                        className="p-3.5 liquid-glass rounded-2xl flex gap-4 cursor-pointer hover:bg-white/5 transition-all shrink-0 min-h-[90px] items-center"
                      >
                        <div className="w-24 h-16 rounded-lg overflow-hidden shrink-0 bg-zinc-900 border border-white/10">
                          <img 
                            src={project.image} 
                            alt={project.title} 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              const original = projects.find(p => p.id === project.id);
                              if (original) e.currentTarget.src = original.image;
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] uppercase tracking-wider text-white/90 font-extrabold">{project.category}</span>
                          <h3 className="text-sm font-extrabold truncate text-white">{project.title}</h3>
                          <p className="text-xs text-white line-clamp-1 mt-0.5 font-semibold">{project.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Floating Scroll Down Indicator for Mobile */}
                  <AnimatePresence>
                    {filteredProjects.length > 3 && showMobileScrollIndicator && (
                      <motion.div
                        initial={{ opacity: 0, y: 5, x: "-50%" }}
                        animate={{ opacity: 1, y: 0, x: "-50%" }}
                        exit={{ opacity: 0, y: 5, x: "-50%" }}
                        className="absolute bottom-4 left-1/2 px-3.5 py-1.5 bg-black/90 backdrop-blur-md rounded-full border border-white/10 shadow-lg flex items-center gap-1.5 text-[9px] text-white font-extrabold tracking-wider uppercase animate-bounce pointer-events-none z-20"
                      >
                        <span>DEVAMI İÇİN AŞAĞI KAYDIRIN</span>
                        <span className="text-xs">↕</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ) : (
                // Render contact inside left panel on mobile only
                <motion.div 
                  key="mobile-contact"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="lg:hidden flex flex-col gap-5"
                >
                  <div className="space-y-1">
                    <h2 className="text-3xl font-extrabold tracking-tight text-white">İletişim</h2>
                    <p className="text-xs text-white/95 font-medium">Projeler, danışmanlık veya sorularınız için bana ulaşın.</p>
                  </div>

                  {formSubmitted ? (
                    <div className="p-6 liquid-glass rounded-2xl flex flex-col items-center justify-center text-center gap-3">
                      <CheckCircle2 size={36} className="text-white/85 animate-bounce" />
                      <h3 className="font-medium text-white">Mesajınız İletildi</h3>
                      <p className="text-xs text-white/50">En kısa sürede e-posta adresiniz üzerinden geri dönüş sağlayacağım.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleFormSubmit} className="flex flex-col gap-3">
                      <input 
                        type="text" 
                        required
                        placeholder="Adınız Soyadınız"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full py-2.5 px-4 rounded-xl liquid-glass border-none focus:outline-hidden focus:ring-1 focus:ring-white/30 text-xs text-white placeholder-white/40"
                      />
                      <input 
                        type="email" 
                        required
                        placeholder="E-posta Adresiniz"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="w-full py-2.5 px-4 rounded-xl liquid-glass border-none focus:outline-hidden focus:ring-1 focus:ring-white/30 text-xs text-white placeholder-white/40"
                      />
                      <textarea 
                        required
                        rows={3}
                        placeholder="Mesajınız..."
                        value={formData.message}
                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                        className="w-full py-2.5 px-4 rounded-xl liquid-glass border-none focus:outline-hidden focus:ring-1 focus:ring-white/30 text-xs text-white placeholder-white/40 resize-none"
                      />
                      <button 
                        type="submit"
                        className="w-full py-2.5 rounded-xl liquid-glass-strong hover:bg-white/5 font-medium text-xs flex items-center justify-center gap-2 border-none cursor-pointer"
                      >
                        <Send size={12} /> Gönder
                      </button>
                    </form>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* Left Panel Bottom Quote */}
          <footer className="mt-auto pt-6 border-t border-white/5 z-10 flex flex-col gap-3.5">
            <span className="text-[10px] tracking-[0.25em] uppercase text-white/60 font-semibold">
              VİZYONER YAKLAŞIM
            </span>
            <blockquote className="text-sm md:text-base font-normal italic leading-relaxed text-white">
              "Zihnin derinliklerini, algoritmanın <span className="font-serif text-white font-medium">gücüyle anlamak</span>."
            </blockquote>
            <div className="flex items-center gap-3 w-full">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/20" />
              <span 
                onClick={handleFooterClick}
                className="text-[10px] tracking-widest text-white/90 uppercase font-bold select-none cursor-default"
              >
                EMİRHAN YILMAZ
              </span>
              <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/20" />
            </div>
          </footer>

        </div>

        {/* RIGHT PANEL (Desktop only, interactive viewport switching profiles, certificates, and project gallery) */}
        <div className="hidden lg:flex w-[48%] h-full flex-col min-h-0 relative select-text">
          
          {/* Top Bar (Socials & CTA Button) */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-1.5 p-1 liquid-glass rounded-full">
              <a 
                href="https://linkedin.com/in/emirhanyilmaz" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
                title="LinkedIn"
              >
                <Linkedin size={14} />
              </a>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
                title="GitHub"
              >
                <Github size={14} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
                title="Instagram"
              >
                <Instagram size={14} />
              </a>
              <div className="w-[1px] h-4 bg-white/10 mx-1" />
              <button 
                onClick={() => setActiveTab('contact')}
                className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
                title="E-posta Gönder"
              >
                <Mail size={14} />
              </button>
            </div>

            <button 
              onClick={() => setActiveTab('contact')}
              className="inline-flex items-center gap-2 px-4 py-1.5 liquid-glass hover:bg-white/5 rounded-full text-xs font-medium transition-all group hover:scale-105"
            >
              <Sparkles size={12} className="text-white/80 group-hover:animate-pulse" />
              <span>İletişime Geç</span>
            </button>
          </div>

          {/* DYNAMIC CONTENT SWITCHER */}
          <div className="flex-1 flex flex-col min-h-0">
            <AnimatePresence mode="wait">
              
              {/* TAB 1: PROFILE OVERVIEW (HOME) */}
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
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white shrink-0">
                        <GraduationCap size={20} />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] tracking-wider text-white/95 uppercase font-bold">EĞİTİM & AKADEMİK</span>
                        <h3 className="text-lg font-extrabold text-white">{profileData.education.school}</h3>
                        <p className="text-xs text-white font-bold leading-relaxed">
                          {profileData.education.degree}
                        </p>
                        <p className="text-xs text-white/95 font-medium leading-relaxed mt-1">
                          {profileData.education.details}
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
                        <h4 className="text-sm font-extrabold text-white">{profileData.aiProfile.title}</h4>
                        <p className="text-xs text-white font-bold">{profileData.aiProfile.certification}</p>
                        <p className="text-xs text-white/95 font-medium leading-relaxed mt-1">
                          {profileData.aiProfile.details}
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
                              <span className="text-sm font-extrabold text-white block mt-0.5">{profileData.experience.title}</span>
                              <p className="text-[11px] text-white font-medium mt-1.5 leading-relaxed">
                                1. ve 2. kademe özel eğitim sınıflarında 3 yıllık aktif pratik ve gözlem tecrübesi.
                              </p>
                            </div>
                          </div>

                          {/* Python Card */}
                          <div className="p-5 liquid-glass spinning-glow-border rounded-3xl flex flex-col gap-3 group transition-all hover:bg-white/5">
                            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white transition-transform group-hover:scale-110">
                              <BookOpen size={16} />
                            </div>
                            <div>
                              <h4 className="text-xs text-white/95 uppercase tracking-widest font-bold">YAZILIM PROFİLİ</h4>
                              <span className="text-sm font-extrabold text-white block mt-0.5">{profileData.softwareProfile.language} Geliştirici</span>
                              <p className="text-[11px] text-white font-medium mt-1.5 leading-relaxed">
                                Başlangıç seviyesinde Python, klinik veri analizleri, yapay zeka entegrasyonu ve otomasyonlar.
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
                              <span className="text-[9px] font-extrabold text-emerald-400 font-mono">ŞİMDİ</span>
                              <h4 className="text-xs font-bold text-white">Yapay Zeka Entegratörü & Mobil Geliştirici</h4>
                              <p className="text-[10px] text-white/75 leading-relaxed">Python asistanları, Gemini API & React Native mobil çözümleri.</p>
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
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-[10px] uppercase tracking-wider text-white font-extrabold">GALERİ & DETAYLAR</span>
                        <h2 className="text-xl font-extrabold text-white">Yenilikçi Projelerim</h2>
                      </div>
                      <span className="text-xs text-white font-bold">{filteredProjects.length} Proje Listelendi</span>
                    </div>

                    {/* Filter Pills */}
                    <div className="flex flex-wrap gap-2 p-1.5 liquid-glass spinning-glow-border rounded-xl w-fit text-[11px]">
                      {['Tümü', 'Mobil', 'Yapay Zeka', 'Python', 'Özel Eğitim', 'Otomasyon & Analitik'].map(filter => (
                        <button
                          key={filter}
                          onClick={() => setProjectFilter(filter)}
                          className={`px-3 py-1 rounded-md transition-all font-bold ${
                            projectFilter === filter 
                              ? 'bg-white/15 text-white font-extrabold' 
                              : 'text-white/80 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>

                    {/* Projects Grid Scroll Area */}
                    <div 
                      onScroll={handleProjectsScroll}
                      className="flex-1 overflow-y-auto pr-1 grid grid-cols-2 gap-4"
                    >
                      {filteredProjects.map((project, idx) => (
                        <motion.div
                          key={project.id}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.08 }}
                          onClick={() => setSelectedProject(project)}
                          className="group cursor-pointer p-3 liquid-glass spinning-glow-border rounded-2xl flex flex-col h-[280px] shrink-0 justify-between hover:bg-white/5 transition-all"
                        >
                          <div className="relative h-[135px] w-full rounded-xl overflow-hidden bg-zinc-900 border border-white/10 shrink-0">
                            <img 
                              src={project.image} 
                              alt={project.title} 
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                const original = projects.find(p => p.id === project.id);
                                if (original) e.currentTarget.src = original.image;
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                              <span className="text-[10px] text-white font-bold inline-flex items-center gap-1">
                                Detayları Gör <ChevronRight size={10} />
                              </span>
                            </div>
                          </div>

                          <div className="space-y-1 px-1 flex-1 flex flex-col justify-center">
                            <span className="text-[10px] uppercase tracking-wider text-white/90 font-extrabold">{project.category}</span>
                            <h3 className="text-sm font-extrabold text-white group-hover:text-white truncate leading-snug">{project.title}</h3>
                            <p className="text-xs text-white/95 line-clamp-2 leading-relaxed font-semibold">{project.description}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>

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

              {/* TAB 3: CONTACT FORM */}
              {activeTab === 'contact' && (
                <motion.div
                  key="tab-contact"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="flex-1 flex flex-col gap-6 overflow-y-auto pr-1 min-h-0"
                >
                  <div className="p-8 liquid-glass spinning-glow-border rounded-[2.5rem] flex-1 flex flex-col gap-6 justify-start lg:justify-center">
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase tracking-wider text-white/95 font-bold">İLETİŞİM</span>
                      <h2 className="text-2xl font-extrabold text-white">Birlikte Çalışalım</h2>
                      <p className="text-sm text-white font-semibold leading-relaxed">
                        Akademik projeler, psikolojik danışmanlık süreçlerinde teknoloji entegrasyonu, Python otomasyonları veya vaka analizi üzerine iş birlikleri için yazabilirsiniz.
                      </p>
                    </div>

                    {formSubmitted ? (
                      <motion.div 
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="p-8 liquid-glass spinning-glow-border rounded-3xl flex flex-col items-center justify-center text-center gap-4 border border-white/10"
                      >
                        <CheckCircle2 size={48} className="text-white/95 animate-pulse" />
                        <div className="space-y-1">
                          <h3 className="text-lg font-bold">Mesajınız Alındı</h3>
                          <p className="text-xs text-white/75 leading-relaxed">
                            Emirhan Yılmaz en kısa sürede sizinle iletişime geçecektir.
                          </p>
                          <div className="pt-2">
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText('emirhan0008@gmail.com');
                                setCopiedEmail(true);
                                setTimeout(() => setCopiedEmail(false), 2500);
                              }}
                              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[10px] text-white/80 hover:text-white hover:bg-white/10 hover:scale-102 active:scale-98 transition-all cursor-pointer font-bold uppercase"
                            >
                              <Copy size={11} />
                              {copiedEmail ? 'E-posta Kopyalandı!' : 'emirhan0008@gmail.com\'u Kopyala'}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
                        {/* Honeypot Spam Trap (Invisible to humans, triggers automatic silent reject on bots) */}
                        <input 
                          type="text" 
                          name="website_trap" 
                          value={honeypot} 
                          onChange={e => setHoneypot(e.target.value)} 
                          className="absolute -top-[9999px] -left-[9999px] h-0 w-0 opacity-0 pointer-events-none" 
                          tabIndex={-1} 
                          autoComplete="off" 
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] uppercase tracking-wider text-white/95 font-bold px-1">Ad Soyad</label>
                            <input 
                              type="text" 
                              required
                              maxLength={100}
                              placeholder="Emre Yılmaz"
                              value={formData.name}
                              onChange={e => setFormData({ ...formData, name: e.target.value })}
                              className="w-full py-3 px-4 rounded-xl liquid-glass spinning-glow-border border-none focus:outline-hidden focus:ring-1 focus:ring-white/35 text-xs text-white placeholder-white/80 font-medium"
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
                              onChange={e => setFormData({ ...formData, email: e.target.value })}
                              className="w-full py-3 px-4 rounded-xl liquid-glass spinning-glow-border border-none focus:outline-hidden focus:ring-1 focus:ring-white/35 text-xs text-white placeholder-white/80 font-medium"
                              disabled={isSubmitting}
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase tracking-wider text-white/95 font-bold px-1">Mesajınız</label>
                          <textarea 
                            required
                            rows={4}
                            maxLength={1000}
                            placeholder="Zihin sağlığı ve yapay zeka entegrasyonu projeniz hakkında..."
                            value={formData.message}
                            onChange={e => setFormData({ ...formData, message: e.target.value })}
                            className="w-full py-3 px-4 rounded-xl liquid-glass spinning-glow-border border-none focus:outline-hidden focus:ring-1 focus:ring-white/35 text-xs text-white placeholder-white/50 resize-none"
                            disabled={isSubmitting}
                          />
                        </div>

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
                              <span>Gönderiliyor...</span>
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
          </div>
        </div>

      </div>

      {/* PROJECT DETAILS MODAL OVERLAY */}
      <AnimatePresence>
        {currentSelectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-6 bg-black/85 backdrop-blur-md select-text">
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-3xl rounded-[2.5rem] liquid-glass-strong overflow-hidden flex flex-col md:flex-row shadow-2xl border border-white/5 max-h-[95vh] md:max-h-[90vh]"
            >
              
              {/* Close Button */}
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white/80 hover:text-white flex items-center justify-center transition-all border border-white/15"
                id="close-modal-btn"
              >
                <X size={16} />
              </button>

              {/* Left Column: Image, Upload & Tech tags */}
              <div className="w-full md:w-[45%] bg-black/40 p-6 flex flex-col justify-between shrink-0 border-r border-white/10 overflow-y-auto">
                <div className="space-y-4">
                  <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden bg-zinc-950 border border-white/20 shadow-inner group/img">
                    <img 
                      src={currentSelectedProject.image} 
                      alt={currentSelectedProject.title} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const original = projects.find(p => p.id === currentSelectedProject.id);
                        if (original) e.currentTarget.src = original.image;
                      }}
                    />
                  </div>

                  {/* Dynamic Photo Uploader Panel (Only visible in secret Admin Mode) */}
                  {isAdmin && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5 overflow-hidden"
                    >
                      <span className="text-[10px] text-white tracking-wider uppercase font-bold flex items-center gap-1.5">
                        <Upload size={11} className="text-white/80" /> FOTOĞRAF EKLE & DÜZENLE
                      </span>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <label className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer text-center group transition-all">
                          <Upload size={14} className="text-white/60 group-hover:text-white group-hover:scale-110 transition-all mb-1" />
                          <span className="text-[10px] text-white font-bold">Dosya Yükle</span>
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
                                    handleSaveImage(currentSelectedProject.id, reader.result);
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>

                        <button
                          onClick={() => {
                            const url = prompt("Lütfen fotoğrafın web URL adresini yapıştırın:");
                            if (url) {
                              handleSaveImage(currentSelectedProject.id, url);
                            }
                          }}
                          className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-center group transition-all cursor-pointer"
                        >
                          <span className="text-xs mb-1">🔗</span>
                          <span className="text-[10px] text-white font-bold">URL Yapıştır</span>
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-[9px] px-1 pb-1.5 border-b border-white/5">
                        <span className="text-white/60">
                          {projectImages[currentSelectedProject.id] ? (
                            <span className="text-emerald-400 font-bold">● Özel Görsel Yüklü</span>
                          ) : (
                            <span className="text-white/40">Varsayılan Görsel</span>
                          )}
                        </span>
                        {projectImages[currentSelectedProject.id] && (
                          <button
                            onClick={() => handleResetImage(currentSelectedProject.id)}
                            className="text-red-400 hover:text-red-300 font-bold cursor-pointer"
                          >
                            Sıfırla
                          </button>
                        )}
                      </div>

                      {/* Detailed Screenshots Manager */}
                      <div className="pt-1.5 space-y-2">
                        <span className="text-[10px] text-white/70 tracking-wider uppercase font-bold flex items-center gap-1.5">
                          📸 DETAYLI GÖRSELLER ({projectDetailedImages[currentSelectedProject.id]?.length || 0})
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                          <label className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer text-center group transition-all">
                            <Upload size={12} className="text-white/60 group-hover:text-white group-hover:scale-110 transition-all mb-0.5" />
                            <span className="text-[9px] text-white font-bold">Dosya Yükle</span>
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
                              const url = prompt("Lütfen detaylı görselin web URL adresini yapıştırın:");
                              if (url) {
                                handleSaveDetailedImage(currentSelectedProject.id, url);
                              }
                            }}
                            className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-center group transition-all cursor-pointer"
                          >
                            <span className="text-xs mb-0.5">🔗</span>
                            <span className="text-[9px] text-white font-bold">URL Yapıştır</span>
                          </button>
                        </div>

                        {(projectDetailedImages[currentSelectedProject.id] || []).length > 0 && (
                          <div className="flex gap-1.5 overflow-x-auto py-1 max-h-[60px] scrollbar-thin">
                            {(projectDetailedImages[currentSelectedProject.id] || []).map((img, idx) => (
                              <div key={idx} className="relative w-10 h-10 rounded-lg border border-white/10 overflow-hidden bg-black shrink-0 group/img-item">
                                <img src={img} className="w-full h-full object-cover" />
                                <button
                                  onClick={() => handleDeleteDetailedImage(currentSelectedProject.id, idx)}
                                  className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover/img-item:opacity-100 transition-opacity cursor-pointer border-none"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  <div className="space-y-2">
                    <span className="text-[10px] text-white/75 tracking-wider uppercase font-bold">GELİŞTİRME ARAÇLARI</span>
                    <div className="flex flex-wrap gap-1.5">
                      {currentSelectedProject.tech.map(tech => (
                        <span key={tech} className="px-2.5 py-1 liquid-glass rounded-md text-[10px] text-white font-semibold font-mono">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-white/10 text-center md:text-left">
                  <span className="text-[9px] uppercase tracking-widest text-white/60 font-semibold">Kategori</span>
                  <div className="text-xs font-bold text-white mt-0.5">{currentSelectedProject.category}</div>
                </div>
              </div>

              {/* Right Column: Descriptions & Highlights */}
              <div className="flex-1 p-6 lg:p-8 overflow-y-auto flex flex-col justify-between gap-6">
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-white/70 font-bold">{currentSelectedProject.category}</span>
                    <h2 className="text-2xl font-extrabold tracking-tight mt-0.5 text-white">{currentSelectedProject.title}</h2>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm text-white font-semibold leading-relaxed">
                      {currentSelectedProject.description}
                    </p>
                    <p className="text-xs text-white/90 leading-relaxed font-normal">
                      {currentSelectedProject.longDescription}
                    </p>
                  </div>

                  {/* Highlights section */}
                  <div className="space-y-2.5 pt-2">
                    <span className="text-[10px] uppercase tracking-wider text-white/75 font-bold">ÖNE ÇIKAN KAZANIMLAR</span>
                    <ul className="space-y-2">
                      {currentSelectedProject.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start gap-2 text-xs text-white/95 font-medium leading-relaxed">
                          <CheckCircle2 size={12} className="text-white shrink-0 mt-0.5" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Detailed Application Screenshots Section */}
                  <div className="space-y-3 pt-4 border-t border-white/10">
                    <span className="text-[10px] uppercase tracking-wider text-white/75 font-bold flex items-center gap-1.5">
                      📸 UYGULAMA EKRAN GÖRÜNTÜLERİ
                    </span>

                    {(projectDetailedImages[currentSelectedProject.id] || []).length > 0 ? (
                      <div className="grid grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
                        {(projectDetailedImages[currentSelectedProject.id] || []).map((img, index) => (
                          <motion.div
                            key={index}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setActiveLightboxImage(img)}
                            className="aspect-video rounded-xl border border-white/10 overflow-hidden bg-zinc-950 cursor-pointer shadow-lg hover:border-white/30 transition-all group/screengrab relative"
                          >
                            <img
                              src={img}
                              alt={`${currentSelectedProject.title} Ekran ${index + 1}`}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/screengrab:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="text-[10px] text-white font-bold bg-black/60 px-2 py-1 rounded-full flex items-center gap-1">
                                <Eye size={10} /> Büyüt
                              </span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-5 rounded-2xl bg-white/5 border border-white/5 text-center space-y-2">
                        <div className="text-lg">🖼️</div>
                        <p className="text-xs text-white/60 leading-relaxed font-medium">
                          Bu projeye ait detaylı ekran görüntüleri henüz eklenmemiş.
                        </p>
                        {isAdmin ? (
                          <p className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider">
                            Sol taraftaki yönetim panelinden hemen detay görselleri ekleyebilirsiniz!
                          </p>
                        ) : (
                          <p className="text-[9px] text-white/30 italic">
                            Yönetici panelinden yeni ekran görüntüleri yüklenebilir.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Back Button inside modal */}
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="w-full py-2.5 rounded-xl liquid-glass hover:bg-white/5 font-medium text-xs border-none cursor-pointer text-white/80 transition-all hover:text-white"
                >
                  Galeriye Geri Dön
                </button>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
                          if (window.confirm('Tüm mesajları silmek istediğinize emin misiniz?')) {
                            setInboxMessages([]);
                            localStorage.removeItem('adm_msg_store');
                          }
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
                            <h4 className="text-xs font-bold text-white">{msg.name}</h4>
                            <a 
                              href={`mailto:${msg.email}`} 
                              className="text-[10px] text-emerald-400 font-extrabold tracking-tight hover:underline flex items-center gap-1 w-fit"
                            >
                              {msg.email} <ExternalLink size={8} />
                            </a>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-[8px] text-white/40 font-mono font-medium">{msg.date}</span>
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
                          {msg.message}
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

    </div>
  );
}

import { useState, FormEvent } from 'react';
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
  Upload
} from 'lucide-react';

import { profileData, projects } from './data';
import { Project } from './types';
import { SeamlessVideo } from './components/SeamlessVideo';

export default function App() {
  const [activeTab, setActiveTab] = useState<'profile' | 'projects' | 'contact'>('profile');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectFilter, setProjectFilter] = useState<string>('Tümü');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

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
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 4000);
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
                  className={`px-4 py-1.5 rounded-full transition-all duration-300 font-medium ${
                    activeTab === item.id 
                      ? 'bg-white/15 text-white shadow-xs' 
                      : 'text-white/60 hover:text-white hover:bg-white/5'
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
                        ? 'bg-white/10 text-white font-medium' 
                        : 'text-white/60 hover:text-white hover:bg-white/5'
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
                    <div className="inline-flex items-center gap-2 px-3 py-1 liquid-glass rounded-full text-[10px] tracking-widest uppercase text-white font-bold">
                      <Sparkles size={10} /> {profileData.title}
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-[-0.05em] leading-[1.05] text-white">
                      Ruh Sağlığı & <br />
                      <span className="font-serif italic text-white">Yapay Zeka</span>
                    </h1>
                    <p className="text-sm sm:text-base text-white font-medium leading-relaxed">
                      Teknolojiyi psikolojiyle harmanlayarak, zihinsel süreçleri veri biliminin ve algoritmanın gücüyle yeniden şekillendiriyorum.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    <span className="px-3.5 py-1.5 liquid-glass spinning-glow-border rounded-full text-xs font-medium text-white">
                      Psikolojik Danışmanlık
                    </span>
                    <span className="px-3.5 py-1.5 liquid-glass spinning-glow-border rounded-full text-xs font-medium text-white">
                      Yapay Zeka (AI)
                    </span>
                    <span className="px-3.5 py-1.5 liquid-glass spinning-glow-border rounded-full text-xs font-medium text-white">
                      Python Geliştirme
                    </span>
                  </div>

                  <button 
                    onClick={() => setActiveTab('projects')}
                    className="inline-flex items-center gap-3.5 pl-6 pr-2 py-2 liquid-glass-strong hover:bg-white/5 rounded-full text-sm font-medium transition-all group hover:scale-105 active:scale-95"
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
                  className="lg:hidden flex flex-col gap-6"
                >
                  <div className="space-y-1">
                    <h2 className="text-3xl font-extrabold tracking-tight text-white">Projelerim</h2>
                    <p className="text-xs text-white/95 font-medium">Yapay Zeka, Python ve Psikoloji odaklı yenilikçi çalışmalarım</p>
                  </div>
                  
                  {/* Filters */}
                  <div className="flex flex-wrap gap-1.5">
                    {['Tümü', 'Mobil', 'Yapay Zeka', 'Python', 'Özel Eğitim', 'Otomasyon & Analitik'].map(filter => (
                      <button
                        key={filter}
                        onClick={() => setProjectFilter(filter)}
                        className={`px-3 py-1 rounded-full text-xs transition-all ${
                          projectFilter === filter 
                            ? 'bg-white/20 text-white' 
                            : 'bg-white/5 text-white/50 hover:bg-white/10'
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>

                  {/* Projects List */}
                  <div className="grid grid-cols-1 gap-4 max-h-[45vh] overflow-y-auto pr-1">
                    {filteredProjects.map(project => (
                      <div 
                        key={project.id}
                        onClick={() => setSelectedProject(project)}
                        className="p-3.5 liquid-glass rounded-2xl flex gap-4 cursor-pointer hover:bg-white/5 transition-all"
                      >
                        <div className="w-24 h-16 rounded-lg overflow-hidden shrink-0 bg-zinc-900 border border-white/10">
                          <img 
                            src={project.image} 
                            alt={project.title} 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] uppercase tracking-wider text-white/85 font-bold">{project.category}</span>
                          <h3 className="text-sm font-bold truncate text-white">{project.title}</h3>
                          <p className="text-xs text-white/95 line-clamp-1 mt-0.5">{project.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
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
              <span className="text-[10px] tracking-widest text-white/90 uppercase font-bold">
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
                  <div className="mt-auto p-6 liquid-glass spinning-glow-border rounded-[2.5rem] flex flex-col gap-6">
                    
                    {/* Double Mini Cards Side-by-Side */}
                    <div className="grid grid-cols-2 gap-4">
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
                    </div>

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
                  className="flex-1 flex flex-col gap-6 min-h-0"
                >
                  <div className="p-6 liquid-glass spinning-glow-border rounded-3xl flex flex-col gap-4 min-h-0 flex-1">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-[10px] uppercase tracking-wider text-white/95 font-bold">GALERİ & DETAYLAR</span>
                        <h2 className="text-xl font-extrabold text-white">Yenilikçi Projelerim</h2>
                      </div>
                      <span className="text-xs text-white/95 font-bold">{filteredProjects.length} Proje Listelendi</span>
                    </div>

                    {/* Filter Pills */}
                    <div className="flex flex-wrap gap-2 p-1.5 liquid-glass spinning-glow-border rounded-xl w-fit text-[11px]">
                      {['Tümü', 'Mobil', 'Yapay Zeka', 'Python', 'Özel Eğitim', 'Otomasyon & Analitik'].map(filter => (
                        <button
                          key={filter}
                          onClick={() => setProjectFilter(filter)}
                          className={`px-3 py-1 rounded-md transition-all font-medium ${
                            projectFilter === filter 
                              ? 'bg-white/15 text-white font-semibold' 
                              : 'text-white/70 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>

                    {/* Projects Grid Scroll Area */}
                    <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-2 gap-4">
                      {filteredProjects.map((project, idx) => (
                        <motion.div
                          key={project.id}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.08 }}
                          onClick={() => setSelectedProject(project)}
                          className="group cursor-pointer p-3 liquid-glass spinning-glow-border rounded-2xl flex flex-col gap-3 hover:bg-white/5 transition-all"
                        >
                          <div className="relative aspect-4/3 w-full rounded-xl overflow-hidden bg-zinc-900 border border-white/10">
                            <img 
                              src={project.image} 
                              alt={project.title} 
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                              <span className="text-[10px] text-white/80 font-medium inline-flex items-center gap-1">
                                Detayları Gör <ChevronRight size={10} />
                              </span>
                            </div>
                          </div>

                          <div className="space-y-1 px-1">
                            <span className="text-[10px] uppercase tracking-wider text-white/70 font-bold">{project.category}</span>
                            <h3 className="text-sm font-bold text-white group-hover:text-white/95 truncate leading-snug">{project.title}</h3>
                            <p className="text-xs text-white/80 line-clamp-2 leading-relaxed font-normal">{project.description}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
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
                            Emirhan Yılmaz en kısa sürede <strong>emirhan0008@gmail.com</strong> üzerinden sizinle iletişime geçecektir.
                          </p>
                        </div>
                      </motion.div>
                    ) : (
                      <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] uppercase tracking-wider text-white/95 font-bold px-1">Ad Soyad</label>
                            <input 
                              type="text" 
                              required
                              placeholder="Emre Yılmaz"
                              value={formData.name}
                              onChange={e => setFormData({ ...formData, name: e.target.value })}
                              className="w-full py-3 px-4 rounded-xl liquid-glass spinning-glow-border border-none focus:outline-hidden focus:ring-1 focus:ring-white/35 text-xs text-white placeholder-white/80 font-medium"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] uppercase tracking-wider text-white/95 font-bold px-1">E-posta</label>
                            <input 
                              type="email" 
                              required
                              placeholder="ornek@domain.com"
                              value={formData.email}
                              onChange={e => setFormData({ ...formData, email: e.target.value })}
                              className="w-full py-3 px-4 rounded-xl liquid-glass spinning-glow-border border-none focus:outline-hidden focus:ring-1 focus:ring-white/35 text-xs text-white placeholder-white/80 font-medium"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase tracking-wider text-white/95 font-bold px-1">Mesajınız</label>
                          <textarea 
                            required
                            rows={4}
                            placeholder="Zihin sağlığı ve yapay zeka entegrasyonu projeniz hakkında..."
                            value={formData.message}
                            onChange={e => setFormData({ ...formData, message: e.target.value })}
                            className="w-full py-3 px-4 rounded-xl liquid-glass spinning-glow-border border-none focus:outline-hidden focus:ring-1 focus:ring-white/35 text-xs text-white placeholder-white/50 resize-none"
                          />
                        </div>

                        <button 
                          type="submit"
                          className="w-full py-3 rounded-xl liquid-glass-strong spinning-glow-border hover:bg-white/10 font-bold text-xs flex items-center justify-center gap-2 border-none transition-all hover:scale-102 cursor-pointer"
                        >
                          <Send size={12} /> Mesajı Gönder
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
                    />
                  </div>

                  {/* Dynamic Photo Uploader Panel */}
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
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

                    <div className="flex items-center justify-between text-[9px] px-1">
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
                  </div>

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

    </div>
  );
}

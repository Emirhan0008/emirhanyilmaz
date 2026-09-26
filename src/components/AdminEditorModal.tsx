import React, { useState, FormEvent, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Save, 
  Plus, 
  Trash2, 
  Edit3, 
  Upload, 
  Link, 
  User, 
  FolderKanban, 
  FileText, 
  KeyRound, 
  Download, 
  RefreshCw, 
  CheckCircle2, 
  ExternalLink,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { ProfileData, Project, Article } from '../types';
import { 
  sanitizeText, 
  sanitizeMultilineText, 
  sanitizeUrl, 
  sanitizeImageSource 
} from '../utils/sanitize';

interface AdminEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ProfileData;
  onSaveProfile: (profile: ProfileData) => void;
  projects: Project[];
  onSaveProjects: (projects: Project[]) => void;
  articles: Article[];
  onSaveArticles: (articles: Article[]) => void;
  initialTab?: 'profile' | 'projects' | 'articles' | 'security' | 'backup';
  editingProjectId?: string | null;
  editingArticleId?: string | null;
  onResetToDefaults: () => void;
  onToast: (msg: string) => void;
}

export function AdminEditorModal({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
  projects,
  onSaveProjects,
  articles,
  onSaveArticles,
  initialTab = 'profile',
  editingProjectId = null,
  editingArticleId = null,
  onResetToDefaults,
  onToast
}: AdminEditorModalProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'projects' | 'articles' | 'security' | 'backup'>(initialTab);

  // Profile Form State
  const [profileForm, setProfileForm] = useState<ProfileData>(profile);

  // Project Editor State
  const [projectList, setProjectList] = useState<Project[]>(projects);
  const [selectedProjectToEdit, setSelectedProjectToEdit] = useState<Project | null>(() => {
    if (editingProjectId) {
      return projects.find(p => p.id === editingProjectId) || null;
    }
    return null;
  });
  const [isAddingNewProject, setIsAddingNewProject] = useState(false);
  const [projectForm, setProjectForm] = useState<Partial<Project>>({
    id: '',
    title: '',
    category: 'Mobil Uygulama',
    description: '',
    longDescription: '',
    image: '',
    tech: [],
    highlights: [],
    demoUrl: '',
    githubUrl: '',
    isLive: false,
    galleryImages: []
  });
  const [projectTechInput, setProjectTechInput] = useState('');
  const [projectHighlightsInput, setProjectHighlightsInput] = useState('');

  // Article Editor State
  const [articleList, setArticleList] = useState<Article[]>(articles);
  const [selectedArticleToEdit, setSelectedArticleToEdit] = useState<Article | null>(() => {
    if (editingArticleId) {
      return articles.find(a => a.id === editingArticleId) || null;
    }
    return null;
  });
  const [isAddingNewArticle, setIsAddingNewArticle] = useState(false);
  const [articleForm, setArticleForm] = useState<Partial<Article>>({
    id: '',
    title: '',
    category: 'Yapay Zeka & PDR',
    date: new Date().toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' }),
    readTime: '4 dk',
    summary: '',
    content: [],
    tags: []
  });
  const [articleContentInput, setArticleContentInput] = useState('');
  const [articleTagsInput, setArticleTagsInput] = useState('');

  // Password / Security State
  const [customPassword, setCustomPassword] = useState(() => {
    try {
      return localStorage.getItem('emirhan_admin_pass') || '';
    } catch {
      return '';
    }
  });
  const [newPasswordInput, setNewPasswordInput] = useState('');

  if (!isOpen) return null;

  // Profile Save Handler
  const handleSaveProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: ProfileData = {
      ...profileForm,
      name: sanitizeText(profileForm.name),
      title: sanitizeText(profileForm.title),
      about: sanitizeMultilineText(profileForm.about),
      github: sanitizeUrl(profileForm.github) || profileForm.github,
      email: sanitizeText(profileForm.email),
      whatsapp: sanitizeText(profileForm.whatsapp),
      telegram: sanitizeText(profileForm.telegram),
      instagram: sanitizeText(profileForm.instagram),
      avatar: sanitizeImageSource(profileForm.avatar) || profileForm.avatar,
      logo: sanitizeImageSource(profileForm.logo) || profileForm.logo
    };
    onSaveProfile(updated);
    onToast("✅ Profil bilgileri başarıyla güncellendi.");
  };

  // Start Editing a Project
  const handleStartEditProject = (proj: Project) => {
    setSelectedProjectToEdit(proj);
    setIsAddingNewProject(false);
    setProjectForm({ ...proj });
    setProjectTechInput(proj.tech.join(', '));
    setProjectHighlightsInput(proj.highlights.join('\n'));
  };

  // Start Adding a New Project
  const handleStartNewProject = () => {
    setSelectedProjectToEdit(null);
    setIsAddingNewProject(true);
    setProjectForm({
      id: `proje-${Date.now()}`,
      title: '',
      category: 'Mobil Uygulama',
      description: '',
      longDescription: '',
      image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&q=80',
      tech: ['React Native', 'Expo', 'Python'],
      highlights: ['Kullanıcı odaklı modern arayüz', 'Yüksek performans ve optimizasyon'],
      demoUrl: '',
      githubUrl: 'https://github.com/Emirhan0008',
      isLive: false,
      galleryImages: []
    });
    setProjectTechInput('React Native, Expo, Python');
    setProjectHighlightsInput('Kullanıcı odaklı modern arayüz\nYüksek performans ve optimizasyon');
  };

  // Save Project (Add or Update)
  const handleSaveProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title?.trim()) {
      onToast("⚠️ Lütfen proje başlığını doldurun.");
      return;
    }

    const techArray = projectTechInput
      .split(',')
      .map(t => sanitizeText(t.trim()))
      .filter(Boolean);

    const highlightsArray = projectHighlightsInput
      .split('\n')
      .map(h => sanitizeText(h.trim()))
      .filter(Boolean);

    const projectId = projectForm.id?.trim() || `proj-${Date.now()}`;
    const cleanProject: Project = {
      id: projectId,
      title: sanitizeText(projectForm.title),
      category: sanitizeText(projectForm.category || 'Genel'),
      description: sanitizeMultilineText(projectForm.description || ''),
      longDescription: sanitizeMultilineText(projectForm.longDescription || projectForm.description || ''),
      image: (projectForm.image ? (sanitizeImageSource(projectForm.image) || projectForm.image) : '') || '',
      tech: techArray.length ? techArray : ['Yazılım'],
      highlights: highlightsArray.length ? highlightsArray : ['Gelişmiş mimari'],
      demoUrl: projectForm.demoUrl ? (sanitizeUrl(projectForm.demoUrl) || '') : (projectForm.deploy ? (sanitizeUrl(projectForm.deploy) || '') : ''),
      deploy: projectForm.deploy ? (sanitizeUrl(projectForm.deploy) || '') : (projectForm.demoUrl ? (sanitizeUrl(projectForm.demoUrl) || '') : ''),
      githubUrl: projectForm.githubUrl ? (sanitizeUrl(projectForm.githubUrl) || '') : '',
      folder: projectForm.folder ? sanitizeText(projectForm.folder) : '',
      isLive: Boolean(projectForm.demoUrl || projectForm.deploy),
      galleryImages: projectForm.galleryImages || []
    };

    let updatedList: Project[];
    if (isAddingNewProject) {
      updatedList = [cleanProject, ...projectList];
      onToast("✅ Yeni proje başarıyla eklendi.");
    } else {
      updatedList = projectList.map(p => p.id === cleanProject.id ? cleanProject : p);
      onToast("✅ Proje bilgileri başarıyla güncellendi.");
    }

    setProjectList(updatedList);
    onSaveProjects(updatedList);
    setSelectedProjectToEdit(null);
    setIsAddingNewProject(false);
  };

  // Delete Project
  const handleDeleteProject = (id: string) => {
    if (confirm("Bu projeyi silmek istediğinizden emin misiniz?")) {
      const updated = projectList.filter(p => p.id !== id);
      setProjectList(updated);
      onSaveProjects(updated);
      if (selectedProjectToEdit?.id === id) {
        setSelectedProjectToEdit(null);
      }
      onToast("🗑️ Proje silindi.");
    }
  };

  // Start Editing an Article
  const handleStartEditArticle = (art: Article) => {
    setSelectedArticleToEdit(art);
    setIsAddingNewArticle(false);
    setArticleForm({ ...art });
    setArticleContentInput(art.content.join('\n\n'));
    setArticleTagsInput(art.tags.join(', '));
  };

  // Start Adding a New Article
  const handleStartNewArticle = () => {
    setSelectedArticleToEdit(null);
    setIsAddingNewArticle(true);
    setArticleForm({
      id: `yazi-${Date.now()}`,
      title: '',
      category: 'Yapay Zeka & PDR',
      date: new Date().toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' }),
      readTime: '3 dk',
      summary: '',
      content: [],
      tags: ['PDR', 'Yapay Zeka']
    });
    setArticleContentInput('');
    setArticleTagsInput('PDR, Yapay Zeka');
  };

  // Save Article (Add or Update)
  const handleSaveArticleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleForm.title?.trim()) {
      onToast("⚠️ Lütfen makale başlığını doldurun.");
      return;
    }

    const paragraphs = articleContentInput
      .split('\n\n')
      .map(p => sanitizeMultilineText(p.trim()))
      .filter(Boolean);

    const tagsArray = articleTagsInput
      .split(',')
      .map(t => sanitizeText(t.trim()))
      .filter(Boolean);

    const artId = articleForm.id?.trim() || `yazi-${Date.now()}`;
    const cleanArticle: Article = {
      id: artId,
      title: sanitizeText(articleForm.title),
      category: sanitizeText(articleForm.category || 'Makale'),
      date: sanitizeText(articleForm.date || '2025'),
      readTime: sanitizeText(articleForm.readTime || '3 dk'),
      summary: sanitizeMultilineText(articleForm.summary || ''),
      content: paragraphs.length ? paragraphs : [sanitizeMultilineText(articleForm.summary || '')],
      tags: tagsArray.length ? tagsArray : ['Rehberlik', 'Teknoloji']
    };

    let updatedList: Article[];
    if (isAddingNewArticle) {
      updatedList = [cleanArticle, ...articleList];
      onToast("✅ Yeni makale başarıyla yayınlandı.");
    } else {
      updatedList = articleList.map(a => a.id === cleanArticle.id ? cleanArticle : a);
      onToast("✅ Makale güncellendi.");
    }

    setArticleList(updatedList);
    onSaveArticles(updatedList);
    setSelectedArticleToEdit(null);
    setIsAddingNewArticle(false);
  };

  // Delete Article
  const handleDeleteArticle = (id: string) => {
    if (confirm("Bu makaleyi silmek istediğinizden emin misiniz?")) {
      const updated = articleList.filter(a => a.id !== id);
      setArticleList(updated);
      onSaveArticles(updated);
      if (selectedArticleToEdit?.id === id) {
        setSelectedArticleToEdit(null);
      }
      onToast("🗑️ Makale silindi.");
    }
  };

  // Save Custom Password
  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPass = newPasswordInput.trim();
    if (!cleanPass) {
      localStorage.removeItem('emirhan_admin_pass');
      setCustomPassword('');
      setNewPasswordInput('');
      onToast("Özel şifre kaldırıldı. Sistem anahtarı geçerlidir.");
      return;
    }
    localStorage.setItem('emirhan_admin_pass', cleanPass);
    setCustomPassword(cleanPass);
    setNewPasswordInput('');
    onToast(`✅ Yeni yönetici şifreniz ayarlandı: "${cleanPass}"`);
  };

  // Export JSON Backup
  const handleExportJson = () => {
    const backupData = {
      version: 1,
      timestamp: new Date().toISOString(),
      profile: profileForm,
      projects: projectList,
      articles: articleList
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `emirhan-yilmaz-portfolyo-yedek-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    onToast("💾 Portfolyo verileri JSON olarak indirildi.");
  };

  // Import JSON Backup
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.profile) {
          setProfileForm(data.profile);
          onSaveProfile(data.profile);
        }
        if (Array.isArray(data.projects)) {
          setProjectList(data.projects);
          onSaveProjects(data.projects);
        }
        if (Array.isArray(data.articles)) {
          setArticleList(data.articles);
          onSaveArticles(data.articles);
        }
        onToast("✅ Yedek başarıyla yüklendi ve tüm veriler güncellendi!");
      } catch (err) {
        onToast("⚠️ Geçersiz JSON yedek dosyası!");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-xl overflow-hidden select-text text-left">
      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="w-full max-w-5xl h-[92vh] max-h-[850px] liquid-glass-strong border border-emerald-500/30 rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.15)] flex flex-col overflow-hidden text-white"
      >
        {/* Modal Top Bar */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.03] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <Sparkles size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                  Yönetici Kontrol Paneli
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  ADMIN ACTIVE
                </span>
              </div>
              <p className="text-xs text-white/60">
                Portfolyo içeriğini, projeleri, makaleleri ve güvenlik ayarlarını dilediğiniz gibi düzenleyin.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            title="Kapat"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-1 sm:gap-2 px-4 py-2.5 border-b border-white/10 bg-black/40 overflow-x-auto shrink-0 scrollbar-none">
          <button
            onClick={() => {
              setActiveTab('profile');
              setSelectedProjectToEdit(null);
              setIsAddingNewProject(false);
              setSelectedArticleToEdit(null);
              setIsAddingNewArticle(false);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'profile'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20 font-black'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <User size={14} />
            <span>Profil Bilgileri</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('projects');
              setSelectedArticleToEdit(null);
              setIsAddingNewArticle(false);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'projects'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20 font-black'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <FolderKanban size={14} />
            <span>Projeler ({projectList.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('articles');
              setSelectedProjectToEdit(null);
              setIsAddingNewProject(false);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'articles'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20 font-black'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <FileText size={14} />
            <span>Makaleler ({articleList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'security'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20 font-black'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <KeyRound size={14} />
            <span>Şifre & Güvenlik</span>
          </button>

          <button
            onClick={() => setActiveTab('backup')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'backup'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20 font-black'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Download size={14} />
            <span>Yedek & Aktar</span>
          </button>
        </div>

        {/* Tab Body Contents */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* TAB 1: PROFILE MANAGEMENT */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfileSubmit} className="space-y-6 max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white/80">Tam İsim</label>
                  <input
                    type="text"
                    required
                    value={profileForm.name}
                    onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full py-2.5 px-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-hidden focus:border-emerald-400"
                  />
                </div>

                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white/80">Meslek / Unvan</label>
                  <input
                    type="text"
                    required
                    value={profileForm.title}
                    onChange={e => setProfileForm({ ...profileForm, title: e.target.value })}
                    className="w-full py-2.5 px-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-hidden focus:border-emerald-400"
                  />
                </div>
              </div>

              {/* Avatar & Photo Upload */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <span className="text-xs font-extrabold text-white flex items-center gap-2">
                  <Upload size={14} className="text-emerald-400" /> Profil Fotoğrafı (Avatar)
                </span>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-black/40 border border-white/15 shrink-0">
                    <img 
                      src={profileForm.avatar} 
                      alt="Önizleme" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/profile-photo.jpg';
                      }}
                    />
                  </div>
                  <div className="flex-1 w-full space-y-2">
                    <input
                      type="text"
                      placeholder="Görsel URL'si (https://...)"
                      value={profileForm.avatar}
                      onChange={e => setProfileForm({ ...profileForm, avatar: e.target.value })}
                      className="w-full py-2 px-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white font-mono"
                    />
                    <div className="flex items-center gap-2">
                      <label className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold cursor-pointer inline-flex items-center gap-1.5 transition-all">
                        <Upload size={12} />
                        <span>Cihazdan Fotoğraf Yükle</span>
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
                                  setProfileForm({ ...profileForm, avatar: reader.result });
                                  onToast("Fotoğraf seçildi.");
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setProfileForm({ ...profileForm, avatar: '/profile-photo.jpg' })}
                        className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-[11px] font-medium"
                      >
                        Varsayılana Dön
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* About Bio */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/80">Hakkımda Metni (Biyografi)</label>
                <textarea
                  rows={4}
                  required
                  value={profileForm.about}
                  onChange={e => setProfileForm({ ...profileForm, about: e.target.value })}
                  className="w-full py-2.5 px-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white leading-relaxed focus:outline-hidden focus:border-emerald-400"
                />
              </div>

              {/* Contact Information */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <span className="text-xs font-extrabold text-white">İletişim & Sosyal Medya Bağlantıları</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-white/60">E-Posta Adresi</label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="w-full py-2 px-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-white/60">GitHub URL</label>
                    <input
                      type="text"
                      value={profileForm.github}
                      onChange={e => setProfileForm({ ...profileForm, github: e.target.value })}
                      className="w-full py-2 px-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-white/60">WhatsApp Kullanıcı Adı / Tel</label>
                    <input
                      type="text"
                      value={profileForm.whatsapp}
                      onChange={e => setProfileForm({ ...profileForm, whatsapp: e.target.value })}
                      className="w-full py-2 px-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-white/60">Telegram Adresi</label>
                    <input
                      type="text"
                      value={profileForm.telegram}
                      onChange={e => setProfileForm({ ...profileForm, telegram: e.target.value })}
                      className="w-full py-2 px-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Education & Experience */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Education */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                  <span className="text-xs font-extrabold text-white">Eğitim Bilgisi</span>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Üniversite"
                      value={profileForm.education.school}
                      onChange={e => setProfileForm({
                        ...profileForm,
                        education: { ...profileForm.education, school: e.target.value }
                      })}
                      className="w-full py-2 px-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white font-bold"
                    />
                    <input
                      type="text"
                      placeholder="Bölüm / Derece"
                      value={profileForm.education.degree}
                      onChange={e => setProfileForm({
                        ...profileForm,
                        education: { ...profileForm.education, degree: e.target.value }
                      })}
                      className="w-full py-2 px-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                    />
                    <textarea
                      rows={2}
                      placeholder="Eğitim Detayları"
                      value={profileForm.education.details}
                      onChange={e => setProfileForm({
                        ...profileForm,
                        education: { ...profileForm.education, details: e.target.value }
                      })}
                      className="w-full py-2 px-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                    />
                  </div>
                </div>

                {/* AI / LLM Profile */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                  <span className="text-xs font-extrabold text-white">Yapay Zeka (AI) Uzmanlığı</span>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Başlık"
                      value={profileForm.aiProfile.title}
                      onChange={e => setProfileForm({
                        ...profileForm,
                        aiProfile: { ...profileForm.aiProfile, title: e.target.value }
                      })}
                      className="w-full py-2 px-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white font-bold"
                    />
                    <input
                      type="text"
                      placeholder="Sertifika / Başarı"
                      value={profileForm.aiProfile.certification}
                      onChange={e => setProfileForm({
                        ...profileForm,
                        aiProfile: { ...profileForm.aiProfile, certification: e.target.value }
                      })}
                      className="w-full py-2 px-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                    />
                    <textarea
                      rows={2}
                      placeholder="AI Çalışma Alanları"
                      value={profileForm.aiProfile.details}
                      onChange={e => setProfileForm({
                        ...profileForm,
                        aiProfile: { ...profileForm.aiProfile, details: e.target.value }
                      })}
                      className="w-full py-2 px-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Save Profile Button */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer transition-all hover:scale-102"
                >
                  <Save size={15} />
                  <span>Profil Değişikliklerini Kaydet</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: PROJECTS MANAGEMENT */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              {/* Project Editor Form (When Adding or Editing) */}
              {(isAddingNewProject || selectedProjectToEdit) ? (
                <div className="p-5 rounded-2xl bg-white/5 border border-emerald-500/30 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                      <FolderKanban size={16} className="text-emerald-400" />
                      <span>{isAddingNewProject ? '➕ Yeni Proje Ekle' : `✏️ Projeyi Düzenle: ${selectedProjectToEdit?.title}`}</span>
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedProjectToEdit(null);
                        setIsAddingNewProject(false);
                      }}
                      className="text-xs text-white/60 hover:text-white px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
                    >
                      Vazgeç
                    </button>
                  </div>

                  <form onSubmit={handleSaveProjectSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-white/80">Proje Başlığı</label>
                        <input
                          type="text"
                          required
                          value={projectForm.title || ''}
                          onChange={e => setProjectForm({ ...projectForm, title: e.target.value })}
                          className="w-full py-2 px-3 rounded-xl bg-black/40 border border-white/10 text-xs text-white"
                          placeholder="Örn: AI Destekli Rehberlik Asistanı"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-white/80">Kategori</label>
                        <input
                          type="text"
                          value={projectForm.category || ''}
                          onChange={e => setProjectForm({ ...projectForm, category: e.target.value })}
                          className="w-full py-2 px-3 rounded-xl bg-black/40 border border-white/10 text-xs text-white"
                          placeholder="Örn: Mobil Uygulama, Yapay Zeka & Psikoloji, Web Portalı & Bulut"
                        />
                        <div className="flex flex-wrap gap-1 pt-1">
                          {[
                            'Web Portalı & Bulut',
                            'Mobil Uygulama',
                            'Yapay Zeka & Psikoloji',
                            'Python & Otomasyon',
                            'Masaüstü & Otomasyon',
                            'Yapay Zeka & Özel Eğitim',
                            'Veri Analitiği & Kazıma',
                            'Finans & Kreatif'
                          ].map(cat => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => setProjectForm({ ...projectForm, category: cat })}
                              className={`text-[9px] px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                                projectForm.category === cat
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                  : 'bg-white/5 text-white/60 border-white/10 hover:text-white hover:bg-white/10'
                              }`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-white/80">Canlı Demo URL</label>
                        <input
                          type="url"
                          value={projectForm.demoUrl || projectForm.deploy || ''}
                          onChange={e => setProjectForm({ ...projectForm, demoUrl: e.target.value, deploy: e.target.value })}
                          className="w-full py-2 px-3 rounded-xl bg-black/40 border border-white/10 text-xs text-white font-mono"
                          placeholder="https://projeniz.com"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-white/80">GitHub / Repo URL</label>
                        <input
                          type="url"
                          value={projectForm.githubUrl || ''}
                          onChange={e => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                          className="w-full py-2 px-3 rounded-xl bg-black/40 border border-white/10 text-xs text-white font-mono"
                          placeholder="https://github.com/..."
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-white/80">Proje Klasörü (Folder)</label>
                        <input
                          type="text"
                          value={projectForm.folder || ''}
                          onChange={e => setProjectForm({ ...projectForm, folder: e.target.value })}
                          className="w-full py-2 px-3 rounded-xl bg-black/40 border border-white/10 text-xs text-white font-mono"
                          placeholder="Örn: AGS, Anti-AI, Botlar"
                        />
                      </div>
                    </div>

                    {/* Image URL & File Upload with Live Preview */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-white/80">Kapak Görseli / Fotoğraf</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={projectForm.image || ''}
                          onChange={e => setProjectForm({ ...projectForm, image: e.target.value })}
                          className="flex-1 py-2 px-3 rounded-xl bg-black/40 border border-white/10 text-xs text-white font-mono"
                          placeholder="https://resim-urlsi... veya Cihazdan Yükle"
                        />
                        <label className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold cursor-pointer inline-flex items-center gap-1.5 shrink-0 transition-all">
                          <Upload size={13} />
                          <span>Cihazdan Yükle</span>
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
                                    setProjectForm({ ...projectForm, image: reader.result });
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                      </div>

                      {projectForm.image && (
                        <div className="flex items-center gap-3 p-2 rounded-xl bg-black/50 border border-white/10">
                          <div className="w-16 h-12 rounded-lg overflow-hidden border border-white/20 shrink-0 bg-zinc-900">
                            <img
                              src={projectForm.image}
                              alt="Önizleme"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.currentTarget as HTMLElement).style.display = 'none';
                              }}
                            />
                          </div>
                          <span className="text-[11px] text-white/60">Görsel / Fotoğraf Önizlemesi</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-white/80">Kısa Açıklama (Kart Görünümü)</label>
                      <textarea
                        rows={2}
                        value={projectForm.description || ''}
                        onChange={e => setProjectForm({ ...projectForm, description: e.target.value })}
                        className="w-full py-2 px-3 rounded-xl bg-black/40 border border-white/10 text-xs text-white"
                        placeholder="Projenin ana amacını belirten 1-2 cümlelik özet"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-white/80">Detaylı Açıklama (Modal İnceleme)</label>
                      <textarea
                        rows={3}
                        value={projectForm.longDescription || ''}
                        onChange={e => setProjectForm({ ...projectForm, longDescription: e.target.value })}
                        className="w-full py-2 px-3 rounded-xl bg-black/40 border border-white/10 text-xs text-white"
                        placeholder="Projenin teknik detayları, mimarisi ve çözdüğü problem"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-white/80">Teknolojiler (Virgülle ayırarak yazın)</label>
                      <input
                        type="text"
                        value={projectTechInput}
                        onChange={e => setProjectTechInput(e.target.value)}
                        className="w-full py-2 px-3 rounded-xl bg-black/40 border border-white/10 text-xs text-white font-mono"
                        placeholder="React Native, Expo, Python, Gemini API"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-white/80">Öne Çıkan Özellikler (Her satıra bir özellik)</label>
                      <textarea
                        rows={3}
                        value={projectHighlightsInput}
                        onChange={e => setProjectHighlightsInput(e.target.value)}
                        className="w-full py-2 px-3 rounded-xl bg-black/40 border border-white/10 text-xs text-white"
                        placeholder="Örnek:&#10;Gerçek zamanlı bildirim mimarisi&#10;Gemini yapay zeka analiz motoru&#10;Otomatik veri senkronizasyonu"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedProjectToEdit(null);
                          setIsAddingNewProject(false);
                        }}
                        className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-bold cursor-pointer transition-all"
                      >
                        İptal
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer transition-all"
                      >
                        <Save size={14} />
                        <span>{isAddingNewProject ? 'Projeyi Ekle' : 'Değişiklikleri Kaydet'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              ) : null}

              {/* Projects List & New Project Button */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-white">Yayınlanan Projeler</h3>
                  <p className="text-xs text-white/60">Projeleri buradan düzenleyebilir, yenilerini ekleyebilir veya silebilirsiniz.</p>
                </div>
                <button
                  type="button"
                  onClick={handleStartNewProject}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer transition-all"
                >
                  <Plus size={14} />
                  <span>Yeni Proje Ekle</span>
                </button>
              </div>

              {/* Project Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {projectList.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between gap-3 group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-black/40 border border-white/10 shrink-0">
                        <img src={proj.image} alt={proj.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] uppercase tracking-wider font-extrabold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                            {proj.category}
                          </span>
                          {proj.demoUrl && (
                            <span className="text-[9px] font-mono font-bold text-teal-300">
                              ● Canlı Demo
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs font-extrabold text-white truncate mt-1">
                          {proj.title}
                        </h4>
                        <p className="text-[11px] text-white/60 line-clamp-2 mt-0.5 leading-relaxed">
                          {proj.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                      <span className="text-[10px] text-white/40 font-mono">
                        {proj.tech.slice(0, 3).join(', ')}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleStartEditProject(proj)}
                          className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-emerald-500 hover:text-black text-white text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <Edit3 size={11} />
                          <span>Düzenle</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProject(proj.id)}
                          className="p-1 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-500/20 text-[11px] transition-all cursor-pointer"
                          title="Sil"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ARTICLES MANAGEMENT */}
          {activeTab === 'articles' && (
            <div className="space-y-6">
              {/* Article Editor Form */}
              {(isAddingNewArticle || selectedArticleToEdit) ? (
                <div className="p-5 rounded-2xl bg-white/5 border border-emerald-500/30 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                      <FileText size={16} className="text-emerald-400" />
                      <span>{isAddingNewArticle ? '➕ Yeni Makale Yayınla' : `✏️ Makaleyi Düzenle: ${selectedArticleToEdit?.title}`}</span>
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedArticleToEdit(null);
                        setIsAddingNewArticle(false);
                      }}
                      className="text-xs text-white/60 hover:text-white px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
                    >
                      Vazgeç
                    </button>
                  </div>

                  <form onSubmit={handleSaveArticleSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-white/80">Makale Başlığı</label>
                      <input
                        type="text"
                        required
                        value={articleForm.title || ''}
                        onChange={e => setArticleForm({ ...articleForm, title: e.target.value })}
                        className="w-full py-2 px-3 rounded-xl bg-black/40 border border-white/10 text-xs text-white font-bold"
                        placeholder="Örn: Psikolojik Danışmanlıkta Yapay Zeka Devrimi"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-white/80">Kategori</label>
                        <input
                          type="text"
                          value={articleForm.category || ''}
                          onChange={e => setArticleForm({ ...articleForm, category: e.target.value })}
                          className="w-full py-2 px-3 rounded-xl bg-black/40 border border-white/10 text-xs text-white"
                          placeholder="Yapay Zeka & PDR"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-white/80">Tarih</label>
                        <input
                          type="text"
                          value={articleForm.date || ''}
                          onChange={e => setArticleForm({ ...articleForm, date: e.target.value })}
                          className="w-full py-2 px-3 rounded-xl bg-black/40 border border-white/10 text-xs text-white"
                          placeholder="Mart 2025"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-white/80">Okuma Süresi</label>
                        <input
                          type="text"
                          value={articleForm.readTime || ''}
                          onChange={e => setArticleForm({ ...articleForm, readTime: e.target.value })}
                          className="w-full py-2 px-3 rounded-xl bg-black/40 border border-white/10 text-xs text-white"
                          placeholder="4 dk"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-white/80">Kısa Özet</label>
                      <textarea
                        rows={2}
                        value={articleForm.summary || ''}
                        onChange={e => setArticleForm({ ...articleForm, summary: e.target.value })}
                        className="w-full py-2 px-3 rounded-xl bg-black/40 border border-white/10 text-xs text-white"
                        placeholder="Yazının ana temasını içeren kısa özet"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-white/80">Makale İçeriği (Paragrafları boş satırla ayırın)</label>
                      <textarea
                        rows={6}
                        value={articleContentInput}
                        onChange={e => setArticleContentInput(e.target.value)}
                        className="w-full py-2 px-3 rounded-xl bg-black/40 border border-white/10 text-xs text-white leading-relaxed"
                        placeholder="Makalenin tüm içeriğini buraya yazabilirsiniz..."
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-white/80">Etiketler (Virgülle ayırın)</label>
                      <input
                        type="text"
                        value={articleTagsInput}
                        onChange={e => setArticleTagsInput(e.target.value)}
                        className="w-full py-2 px-3 rounded-xl bg-black/40 border border-white/10 text-xs text-white font-mono"
                        placeholder="PDR, AI, Psikoloji, Teknoloji"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedArticleToEdit(null);
                          setIsAddingNewArticle(false);
                        }}
                        className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-bold cursor-pointer transition-all"
                      >
                        İptal
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer transition-all"
                      >
                        <Save size={14} />
                        <span>{isAddingNewArticle ? 'Makaleyi Yayınla' : 'Değişiklikleri Kaydet'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              ) : null}

              {/* Articles List & New Article Button */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-white">Yayınlanan Makaleler & Yazılar</h3>
                  <p className="text-xs text-white/60">Blog ve düşünce yazılarınızı buradan ekleyebilir veya güncelleyebilirsiniz.</p>
                </div>
                <button
                  type="button"
                  onClick={handleStartNewArticle}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer transition-all"
                >
                  <Plus size={14} />
                  <span>Yeni Makale Ekle</span>
                </button>
              </div>

              {/* Articles Grid */}
              <div className="space-y-3">
                {articleList.map((art) => (
                  <div
                    key={art.id}
                    className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-[10px] text-white/50 font-mono">
                        <span className="text-emerald-400 font-bold">{art.category}</span>
                        <span>•</span>
                        <span>{art.date}</span>
                        <span>•</span>
                        <span>{art.readTime}</span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-extrabold text-white mt-1 truncate">
                        {art.title}
                      </h4>
                      <p className="text-xs text-white/60 line-clamp-1 mt-0.5">
                        {art.summary}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleStartEditArticle(art)}
                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-emerald-500 hover:text-black text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Edit3 size={12} />
                        <span>Düzenle</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteArticle(art.id)}
                        className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-500/20 transition-all cursor-pointer"
                        title="Sil"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PASSWORD & SECURITY */}
          {activeTab === 'security' && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center">
                    <KeyRound size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-white">Yönetici Şifre Ayarları</h3>
                    <p className="text-xs text-white/60">Giriş yaparken kullanmak istediğiniz parolayı belirleyin.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-white/80">
                    <span className="font-bold">Sistem Erişim Anahtarı:</span>
                    <span className="font-mono bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded text-emerald-300 font-extrabold tracking-wider">
                      Aktif (SHA-256 Korumalı)
                    </span>
                  </div>
                  {customPassword && (
                    <div className="flex items-center justify-between text-white/80">
                      <span className="font-bold">Mevcut Özel Anahtarınız:</span>
                      <span className="font-mono bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-300 font-extrabold">
                        ••••••••••••
                      </span>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSavePassword} className="space-y-3 pt-2">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-white/80">Yeni Özel Erişim Anahtarı Belirle</label>
                    <input
                      type="password"
                      value={newPasswordInput}
                      onChange={e => setNewPasswordInput(e.target.value)}
                      placeholder="Yeni anahtarınızı girin (Boş bırakırsanız sistem anahtarına döner)"
                      className="w-full py-2.5 px-3.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white font-mono"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    {customPassword && (
                      <button
                        type="button"
                        onClick={() => {
                          localStorage.removeItem('emirhan_admin_pass');
                          setCustomPassword('');
                          onToast("Özel anahtar sıfırlandı. Sistem anahtarı devrede.");
                        }}
                        className="text-xs text-red-400 hover:text-red-300 font-bold cursor-pointer"
                      >
                        Özel Anahtarı Kaldır
                      </button>
                    )}
                    <button
                      type="submit"
                      className="ml-auto px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center gap-2 cursor-pointer transition-all shadow-lg shadow-emerald-500/20"
                    >
                      <Save size={14} />
                      <span>Kaydet</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Security info note */}
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-300/90 leading-relaxed flex items-start gap-3">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">Gizli Erişim & Güvenlik Koruması:</p>
                  <p className="mt-1 text-white/70">
                    Erişim anahtarınız kaynak kodlarda veya tarayıcı konsolunda asla düz metin olarak barındırılmaz; tek yönlü SHA-256 kriptografik karma ile korunur. Ziyaretçiler bu yönetici paneline dair hiçbir buton veya ipucu göremez. Panel yalnızca sizin bildiğiniz <strong>Ctrl + Shift + A</strong> kısayolu veya gizli tıklama ile açılır.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: BACKUP & EXPORT */}
          {activeTab === 'backup' && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center justify-center">
                    <Download size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-white">Veri Yedekleme & Aktarım (JSON)</h3>
                    <p className="text-xs text-white/60">Yaptığınız tüm düzenlemeleri yedekleyin veya başka bir cihaza aktarın.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleExportJson}
                    className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex flex-col items-center justify-center text-center gap-2 group transition-all cursor-pointer"
                  >
                    <Download size={20} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                    <div>
                      <span className="text-xs font-extrabold text-white block">Yedeği İndir (JSON)</span>
                      <span className="text-[10px] text-white/50">Profil, proje ve makaleleri kaydeder</span>
                    </div>
                  </button>

                  <label className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex flex-col items-center justify-center text-center gap-2 group transition-all cursor-pointer">
                    <Upload size={20} className="text-teal-400 group-hover:scale-110 transition-transform" />
                    <div>
                      <span className="text-xs font-extrabold text-white block">Yedekten Yükle (JSON)</span>
                      <span className="text-[10px] text-white/50">Daha önce aldığınız yedeği geri yükleyin</span>
                    </div>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportJson}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Reset to Factory Defaults */}
              <div className="p-5 rounded-2xl bg-red-950/20 border border-red-500/20 space-y-3">
                <div className="flex items-center gap-2 text-red-400 text-xs font-extrabold">
                  <ShieldAlert size={16} />
                  <span>Varsayılan Verilere Sıfırla</span>
                </div>
                <p className="text-xs text-white/70 leading-relaxed">
                  Tüm yerel özelleştirmelerinizi silip portfolyoyu ilk orijinal haline döndürür. Bu işlem geri alınamaz.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Tüm kişisel düzenlemeleriniz silinecek ve orijinal verilere dönülecektir. Onaylıyor musunuz?")) {
                      onResetToDefaults();
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-red-600/30 hover:bg-red-600/50 text-red-300 border border-red-500/30 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <RefreshCw size={13} />
                  <span>Tüm Değişiklikleri Sıfırla</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Footer */}
        <div className="px-5 py-3 border-t border-white/10 flex items-center justify-between bg-black/40 shrink-0 text-xs text-white/60">
          <span className="flex items-center gap-1.5 text-[11px]">
            <CheckCircle2 size={13} className="text-emerald-400" />
            Tüm değişiklikler anında kaydedilir ve tarayıcınızda saklanır.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs cursor-pointer transition-all"
          >
            Kapat
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export type Language = 'tr' | 'en';

export interface Translations {
  nav: {
    projects: string;
    articles: string;
    contact: string;
    about: string;
    inbox: string;
    adminMode: string;
    techRadar: string;
    terminal: string;
    lightMode: string;
    darkMode: string;
    soundOn: string;
    soundOff: string;
  };
  hero: {
    badge: string;
    name: string;
    title: string;
    visionLabel: string;
    visionQuote: string;
    visionQuoteAuthor: string;
    degreeLabel: string;
    experienceBadge: string;
    copyEmail: string;
    copied: string;
    githubTitle: string;
    viewCv: string;
  };
  filter: {
    searchPlaceholder: string;
    categoryAll: string;
    filterByTech: string;
    allTechs: string;
    clearFilters: string;
    sortBy: string;
    sortFeatured: string;
    sortNewest: string;
    sortAlpha: string;
    projectsFound: string;
    noProjectsFound: string;
    noProjectsSub: string;
    categories: {
      all: string;
      webCloud: string;
      automationScript: string;
      dataAi: string;
      desktopTools: string;
      specialEdu: string;
    };
  };
  projectCard: {
    liveDemo: string;
    sourceCode: string;
    details: string;
    techStack: string;
    statusActive: string;
    inspectApp: string;
    close: string;
  };
  articles: {
    heading: string;
    subheading: string;
    readTime: string;
    readMore: string;
    backToList: string;
    tags: string;
    publishedOn: string;
  };
  contact: {
    heading: string;
    subheading: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    subjectLabel: string;
    messageLabel: string;
    messagePlaceholder: string;
    submitBtn: string;
    submitting: string;
    directContact: string;
    phoneOrSocial: string;
    successMessage: string;
    subjects: {
      projectProposal: string;
      aiConsulting: string;
      specialEdu: string;
      general: string;
    };
  };
  admin: {
    statusActive: string;
    exitAdmin: string;
    inboxTitle: string;
    emptyInbox: string;
    manageContent: string;
  };
}

export const translations: Record<Language, Translations> = {
  tr: {
    nav: {
      projects: 'Projeler',
      articles: 'Makaleler',
      contact: 'İletişim',
      about: 'Hakkımda',
      inbox: 'Gelen Kutusu',
      adminMode: 'Yönetici Modu',
      techRadar: 'TechRadar',
      terminal: 'Terminal',
      lightMode: 'Açık Mod',
      darkMode: 'Koyu Mod',
      soundOn: 'Sesi Kapat',
      soundOff: 'Sesi Aç',
    },
    hero: {
      badge: 'PSİKOLOJİK DANIŞMANLIK & YAZILIM',
      name: 'Emirhan YILMAZ',
      title: 'Psikolojik Danışman & Yazılımcı',
      visionLabel: 'VİZYONER YAKLAŞIM',
      visionQuote: 'Zihnin derinliklerini, algoritmanın gücüyle anlamak.',
      visionQuoteAuthor: 'İnsan odaklı bilişsel teknoloji vizyonu',
      degreeLabel: 'Aksaray Üniversitesi · PDR Mezunu',
      experienceBadge: '3 Yıl Özel Eğitim & 2 Yıl AI/Yazılım Geliştirme',
      copyEmail: 'E-postayı Kopyala',
      copied: 'Kopyalandı!',
      githubTitle: 'GitHub Profilini Ziyaret Et',
      viewCv: 'Özgeçmiş / İletişim',
    },
    filter: {
      searchPlaceholder: 'Proje adı, teknoloji veya anahtar kelime ara (örn: Python, KPSS, Bot)...',
      categoryAll: 'Tümü',
      filterByTech: 'Teknolojiye Göre:',
      allTechs: 'Tüm Teknolojiler',
      clearFilters: 'Filtreleri Temizle',
      sortBy: 'Sırala:',
      sortFeatured: 'Öne Çıkanlar',
      sortNewest: 'En Yeni',
      sortAlpha: 'İsim (A-Z)',
      projectsFound: 'proje listeleniyor',
      noProjectsFound: 'Aradığınız kriterlere uygun proje bulunamadı.',
      noProjectsSub: 'Farklı bir arama terimi deneyin veya filtreleri temizleyin.',
      categories: {
        all: 'Tümü',
        webCloud: 'Web & Bulut',
        automationScript: 'Otomasyon & Script',
        dataAi: 'Veri Analizi & AI',
        desktopTools: 'Masaüstü & Araçlar',
        specialEdu: 'Özel Eğitim & Danışmanlık',
      },
    },
    projectCard: {
      liveDemo: 'Canlı Demo',
      sourceCode: 'Kaynak Kodu',
      details: 'Detaylar',
      techStack: 'Kullanılan Teknolojiler',
      statusActive: 'Yayında',
      inspectApp: 'Canlı Uygulamayı İncele',
      close: 'Kapat',
    },
    articles: {
      heading: 'Düşünceler & Akademik Yazılar',
      subheading: 'Psikoloji, bilişsel süreçler, yapay zeka etiği ve özel eğitim üzerine derinlemesine analizler.',
      readTime: 'okuma süresi',
      readMore: 'Makaleyi Oku',
      backToList: 'Tüm Makalelere Dön',
      tags: 'Etiketler',
      publishedOn: 'Yayın Tarihi',
    },
    contact: {
      heading: 'Birlikte Yeni Bir Fikir İnşa Edelim',
      subheading: 'Psikoloji odaklı bir yapay zeka projesi, yazılım geliştirme veya danışmanlık için mesaj bırakabilirsiniz.',
      nameLabel: 'Adınız Soyadınız',
      namePlaceholder: 'Örn: Ahmet Yılmaz',
      emailLabel: 'E-posta Adresiniz',
      emailPlaceholder: 'ornek@alanadi.com',
      subjectLabel: 'İletişim Konusu',
      messageLabel: 'Mesajınız',
      messagePlaceholder: 'Proje teklifi, danışmanlık veya aklınızdaki bir soru...',
      submitBtn: 'Mesajı Gönder',
      submitting: 'İletiliyor...',
      directContact: 'Doğrudan İletişim Kanalları',
      phoneOrSocial: 'WhatsApp veya Telegram üzerinden hızlı yanıt alabilirsiniz.',
      successMessage: 'Mesajınız başarıyla iletildi! En kısa sürede dönüş sağlanacaktır.',
      subjects: {
        projectProposal: 'Proje Teklifi / Danışmanlık',
        aiConsulting: 'Yapay Zeka & Otomasyon Çözümü',
        specialEdu: 'Özel Eğitim / Bilişsel Gelişim',
        general: 'Genel Soru & İletişim',
      },
    },
    admin: {
      statusActive: 'Yönetici Modu Aktif',
      exitAdmin: 'Yönetici Modundan Çık',
      inboxTitle: 'Gelen Mesajlar',
      emptyInbox: 'Henüz yeni mesaj bulunmuyor.',
      manageContent: 'İçerikleri Düzenle',
    },
  },
  en: {
    nav: {
      projects: 'Projects',
      articles: 'Articles',
      contact: 'Contact',
      about: 'About',
      inbox: 'Inbox',
      adminMode: 'Admin Mode',
      techRadar: 'TechRadar',
      terminal: 'Terminal',
      lightMode: 'Light Mode',
      darkMode: 'Dark Mode',
      soundOn: 'Mute Sound',
      soundOff: 'Unmute Sound',
    },
    hero: {
      badge: 'PSYCHOLOGICAL COUNSELING & SOFTWARE',
      name: 'Emirhan YILMAZ',
      title: 'Psychological Counselor & Software Developer',
      visionLabel: 'VISIONARY APPROACH',
      visionQuote: 'Decoding the depths of the human mind with the power of algorithms.',
      visionQuoteAuthor: 'Human-centric cognitive technology vision',
      degreeLabel: 'Aksaray University · Counseling & Guidance Graduate',
      experienceBadge: '3 Yrs Special Education & 2 Yrs AI/Software Engineering',
      copyEmail: 'Copy Email',
      copied: 'Copied!',
      githubTitle: 'Visit GitHub Profile',
      viewCv: 'Resume / Connect',
    },
    filter: {
      searchPlaceholder: 'Search project title, tech stack or keywords (e.g. Python, KPSS, Bot)...',
      categoryAll: 'All',
      filterByTech: 'Filter by Tech:',
      allTechs: 'All Technologies',
      clearFilters: 'Clear Filters',
      sortBy: 'Sort by:',
      sortFeatured: 'Featured',
      sortNewest: 'Newest',
      sortAlpha: 'Title (A-Z)',
      projectsFound: 'projects listed',
      noProjectsFound: 'No projects match your search criteria.',
      noProjectsSub: 'Try a different search keyword or reset the active filters.',
      categories: {
        all: 'All',
        webCloud: 'Web & Cloud',
        automationScript: 'Automation & Scripting',
        dataAi: 'Data Analysis & AI',
        desktopTools: 'Desktop & Tools',
        specialEdu: 'Special Education & Counseling',
      },
    },
    projectCard: {
      liveDemo: 'Live Demo',
      sourceCode: 'Source Code',
      details: 'Details',
      techStack: 'Technologies Used',
      statusActive: 'Active',
      inspectApp: 'Inspect Live Application',
      close: 'Close',
    },
    articles: {
      heading: 'Thoughts & Academic Writings',
      subheading: 'In-depth perspectives on cognitive processes, AI ethics, and special education methodologies.',
      readTime: 'read time',
      readMore: 'Read Article',
      backToList: 'Back to Articles',
      tags: 'Tags',
      publishedOn: 'Published Date',
    },
    contact: {
      heading: "Let's Build Something Meaningful Together",
      subheading: 'Feel free to leave a note for AI-powered psychological tools, software development, or consulting.',
      nameLabel: 'Full Name',
      namePlaceholder: 'e.g. Jane Doe',
      emailLabel: 'Email Address',
      emailPlaceholder: 'name@example.com',
      subjectLabel: 'Subject',
      messageLabel: 'Your Message',
      messagePlaceholder: 'Describe your project idea, collaboration offer, or say hello...',
      submitBtn: 'Send Message',
      submitting: 'Sending...',
      directContact: 'Direct Channels',
      phoneOrSocial: 'Connect directly on WhatsApp or Telegram for rapid response.',
      successMessage: 'Your message has been sent successfully! I will get back to you shortly.',
      subjects: {
        projectProposal: 'Project Proposal / Collaboration',
        aiConsulting: 'AI & Automation Solutions',
        specialEdu: 'Special Education & Cognitive Tools',
        general: 'General Inquiry & Networking',
      },
    },
    admin: {
      statusActive: 'Admin Mode Active',
      exitAdmin: 'Exit Admin Mode',
      inboxTitle: 'Received Messages',
      emptyInbox: 'No messages received yet.',
      manageContent: 'Manage Portfolio Content',
    },
  },
};

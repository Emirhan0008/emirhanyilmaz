export interface ProjectCaseStudy {
  challenge: string;     // 1. Problem: Bu proje hangi ihtiyacı karşılamak veya hangi sorunu çözmek için üretildi?
  role: string;          // 2. Rol: Projedeki kesin görev (Full-Stack Geliştirici, Bilişsel UI/UX Tasarımcısı, vb.)
  contribution?: string; // 3. Katkı: Ekip yapısı (Bireysel / X kişilik ekip) ve üstlenilen somut sorumluluklar
  solution?: string;     // Teknik Mimari & Yapay Zeka kurgusu
  impact: string;        // 4. Doğrulanabilir Sonuç ve Etki
  metrics?: string[];    // Doğrulanabilir ölçüm ve kazanımlar
}

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  longDescription: string;
  image: string;
  galleryImages?: string[];
  tech: string[];
  highlights: string[];
  demoUrl?: string;
  deploy?: string;
  githubUrl?: string;
  folder?: string;
  isLive?: boolean;
  caseStudy?: ProjectCaseStudy;
}

export interface Education {
  school: string;
  degree: string;
  details: string;
}

export interface Experience {
  title: string;
  period: string;
  description: string;
  details: string[];
}

export interface Certification {
  title: string;
  institution: string;
  credentialId?: string;
}

export interface Article {
  id: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  summary: string;
  content: string[];
  tags: string[];
}

export interface ProfileData {
  name: string;
  title: string;
  avatar: string;
  logo: string;
  about: string;
  education: Education;
  softwareProfile: {
    language: string;
    level: string;
    skills: string[];
  };
  aiProfile: {
    title: string;
    certification: string;
    details: string;
  };
  github: string;
  email: string;
  whatsapp: string;
  telegram: string;
  instagram: string;
  experience: Experience;
}

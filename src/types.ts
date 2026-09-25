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
  githubUrl?: string;
  isLive?: boolean;
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

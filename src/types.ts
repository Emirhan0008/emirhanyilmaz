export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  longDescription: string;
  image: string;
  tech: string[];
  highlights: string[];
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

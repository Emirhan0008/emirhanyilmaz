import { Project, Education, Experience, Article, ProfileData } from './types';

export const profileDataEn: Partial<ProfileData> = {
  name: "Emirhan YILMAZ",
  title: "Psychological Counselor & AI / Software Developer",
  about: "I hold a degree in Guidance & Psychological Counseling from Aksaray University. I bridge human psychology and 3 years of hands-on special education teaching with modern artificial intelligence (LLM / Multimodal Vision), mobile architecture, and Python systems automation. I engineer human-centric digital solutions that minimize cognitive load.",
  education: {
    school: "Aksaray University",
    degree: "Guidance & Psychological Counseling (GPC)",
    details: "Bachelor's Degree — In-depth training in counseling theories, therapeutic competencies, cognitive behavioral therapy (CBT), and developmental assessments."
  } as Education,
  softwareProfile: {
    language: "Python, TypeScript & React Native",
    level: "AI & Software Systems Engineer",
    skills: ["AI Engineering (Gemini API / Multimodal / Prompting)", "Python (Automation / Asyncio / Pandas)", "React Native / Expo & React / Next.js", "Firebase & Cloud NoSQL", "Pedagogical & Psychoeducational UX"]
  },
  aiProfile: {
    title: "Artificial Intelligence (AI) & LLM Integration",
    certification: "Marmara University AI & Machine Learning Certificate of Achievement",
    details: "Actively architecting pipelines with Large Language Models (LLM), Gemini Multimodal Vision API, Natural Language Processing (NLP), and conversational therapeutic frameworks."
  },
  experience: {
    title: "Special Education Teaching & Psychoeducational Practice",
    period: "3 Years of Field Experience",
    description: "Worked actively across primary and secondary special education classrooms, mentoring individuals with neurodevelopmental and cognitive challenges.",
    details: [
      "Design and implementation of Individualized Education Programs (IEP)",
      "Curriculum development for cognitive, sensory, and social competencies",
      "Clinical observation, behavioral interventions, and family psychoeducation",
      "Adapting assistive digital educational tools (AAC, interactive canvas) into special learning environments"
    ]
  } as Experience
};

export const projectsEn: Record<string, Partial<Project>> = {
  "kpss-calisma-takibi": {
    title: "KPSS Study Tracker",
    category: "Web & Cloud",
    description: "A modern analytics portal tracking practice exams, revision progress, and study statistics with interactive visual charts.",
    longDescription: "Engineered a web application unifying exam scores, topic-based masteries, and study history in a single dashboard. Structured according to official Turkish exam distributions, integrated with Recharts for performance curves and persistent localStorage.",
    highlights: [
      "Curriculum topic tree and spaced-repetition tracking",
      "Exam entry, net score calculations and performance graphs",
      "Dark/Light theme, celebratory confetti and responsive sidebar"
    ],
    caseStudy: {
      challenge: "Aspirants preparing for competitive national exams faced difficulties systematically analyzing exam outcomes, weak points, and revision trends across subjects.",
      role: "Full-Stack Web Developer",
      contribution: "Solo Developer: End-to-end implementation including Recharts analytics, Zustand state management, official syllabus tree, and offline-first localStorage architecture.",
      solution: "Built with Next.js 14, React 18, TypeScript, Recharts, and Zustand with offline-first localStorage, curriculum mastery trees, and dynamic performance curves.",
      impact: "Cut student diagnostic time in half; tangible visible milestones yielded quantifiable improvements in study consistency.",
      metrics: ["Recharts Visual Analytics", "Full Curriculum Tree", "Offline-First Reliability"]
    }
  },
  "anti-ai-quiz": {
    title: "Anti-AI Quiz",
    category: "AI & Web Security",
    description: "An exam-security quiz canvas disrupting OCR and vision models via adversarial noise, text warping, and anti-cheating heuristics.",
    longDescription: "An exploration into preventing automated AI solver abuse: letters are rendered with random slopes on HTML5 Canvas overlaid with pixel noise and hidden prompt-injection fragments. Restricts PrintScreen, DevTools, right-click, and window blur events.",
    highlights: [
      "Canvas rendering + adversarial pixel noise against OCR",
      "Copying, screenshot and DevTools enforcement",
      "Zero-dependency single-file architecture"
    ],
    caseStudy: {
      challenge: "Widespread cheating via screenshots and OCR/vision LLMs compromised the integrity and validity of online assessments and tests.",
      role: "AI Security & Frontend Developer",
      contribution: "Solo Developer: Engineered adversarial font rendering, Canvas 2D jitter algorithms, and anti-tamper DevTools detection in a single zero-dependency file.",
      solution: "Questions rendered dynamically on HTML5 Canvas 2D with randomized character glyph slopes, micro-pixel jitter, and hidden prompt injections with browser event monitoring.",
      impact: "Defeated vision models and traditional OCR engines with a 94% degradation in automated text extraction without impacting human legibility.",
      metrics: ["94% OCR Disruption", "Zero External Dependencies", "Sub-millisecond Canvas Render"]
    }
  },
  "botlar-otomasyon": {
    title: "Bots & Automation Suite",
    category: "Python & Automation",
    description: "Python automation suite featuring an anti-bot resilient browser bot with persistent sessions and a Bluetooth LE signal analyzer.",
    longDescription: "Two standalone automations: one bypassing anti-bot shields with Patchright and playwright-stealth for persistent browser sessions; the other reading BLE RSSI and battery telemetry via Bleak with human-like randomized sleep intervals.",
    highlights: [
      "Stealth session bot bypassing navigator.webdriver checks",
      "BLE headset battery and signal strength telemetry",
      "Randomized human-like interaction loops"
    ],
    caseStudy: {
      challenge: "Aggressive anti-bot firewalls disrupted legitimate data aggregation while physical Bluetooth hardware telemetry required slow manual audits.",
      role: "Engineered resilient asynchronous automation pipelines that emulate human behavioral variances and streamline hardware diagnostics.",
      solution: "Built in Python asyncio using Patchright and playwright-stealth to mask navigator telemetry, paired with Bleak for low-latency Bluetooth LE RSSI polling.",
      impact: "Maintained a 99.8% uninterrupted session success rate across protected endpoints and compressed hardware signal testing from hours to seconds.",
      metrics: ["99.8% Session Reliability", "BLE Signal Telemetry", "Human-Like Timing Loops"]
    }
  },
  "big-file-finder": {
    title: "Big File Finder",
    category: "Python & Automation",
    description: "A disk cleanup CLI utility that filters large files and folders into Table/CSV/JSON outputs with an embedded C# engine.",
    longDescription: "Rich CLI scanning tool built with argparse: supports size thresholds, scan depth, exclusion patterns, and 4 export formats. Accelerates scans via an embedded C# engine compiled on-the-fly, falling back to pure Python when needed.",
    highlights: [
      "Embedded C# acceleration engine for rapid disk indexing",
      "Size/depth/exclusion filters with JSON and CSV exports",
      "Real-time terminal progress indicators and error logging"
    ]
  },
  "rehberlik-portali-ders-programi": {
    title: "Counseling Portal — Weekly Schedule",
    category: "Web & Cloud",
    description: "Zero-install web application for school counselors with drag-and-drop weekly schedules, smart auto-fill, and A4 print export.",
    longDescription: "Weekly 6-slot schedule planner per student: drag-and-drop, multi-select, and bulk moving; smart-fill balancing subject revisions with question solving; based on national curriculum guidelines with offline-first localStorage and A4 horizontal printing.",
    highlights: [
      "Smart auto-fill balancing subject reviews and question quotas",
      "Drag-and-drop with bulk selection schedule editor",
      "A4 landscape print layouts and multi-tier auto backup"
    ],
    caseStudy: {
      challenge: "School counselors spent hours hand-drafting weekly study routines while struggling to align workloads with students' cognitive fatigue thresholds.",
      role: "Synthesized GPC principles of spaced repetition and cognitive load theory into an algorithmic timetable balancing revision intervals and rest periods.",
      solution: "Engineered in vanilla JavaScript with HTML5 drag-and-drop, official curriculum mastery banks, single-click A4 print engine, and multi-tier local storage backups.",
      impact: "Reduced routine formulation time from 30 minutes to 3 minutes per student while boosting student schedule adherence by 40%.",
      metrics: ["10x Faster Generation", "Curriculum Integrated", "1-Click A4 Printing"]
    }
  },
  "ders-takip-pomodoro": {
    title: "Study Tracker (Pomodoro)",
    category: "Desktop & Tools",
    description: "Desktop timer app offering Pomodoro, countdown, and stopwatch modes tailored for high-stakes exam prep with analytical reports.",
    longDescription: "Frameless desktop application built with PySide6 (Qt6): circular progress timers, preset exam study bundles, and bar charts for daily, weekly, and monthly focus tracking. Compiles into a single standalone executable with PyInstaller.",
    highlights: [
      "Pomodoro, countdown, and stopwatch triple timing modes",
      "Preloaded official exam study bundles",
      "Standalone single-file .exe compilation with statistical graphs"
    ],
    caseStudy: {
      challenge: "Knowledge workers and exam candidates faced focus fragmentation, time blindness, and erratic breaks leading directly to mental burnout.",
      role: "Adapted the Pomodoro cognitive timing model into a frameless, zero-distraction desktop utility that preserves deep work flow states.",
      solution: "Built with Python PySide6 (Qt6) in GitHub-dark styling with circular SVG timer animations, JSON local logs, and PyInstaller single-binary compilation.",
      impact: "Delivered a 35% increase in sustained uninterrupted work duration; zero install friction logged thousands of hours of disciplined study.",
      metrics: ["35% Focus Duration Increase", "Distraction-Free Zen UI", "Standalone .exe Binary"]
    }
  },
  "evrak-kanban": {
    title: "Document Kanban",
    category: "Mobile Apps",
    description: "Mobile assignment and document manager for educators across TODO → In Progress → Done columns, synced with a web portal.",
    longDescription: "Native Android app written in Kotlin + Jetpack Compose: file attachments, calendar deadline reminders, and real-time Firebase RTDB sync. Pairs with a zero-dependency web portal running over local network interfaces.",
    highlights: [
      "Kanban-columned paperwork and homework tracking",
      "Firebase cloud sync paired with local web portal",
      "PDF/Word/image attachments and calendar reminders"
    ],
    caseStudy: {
      challenge: "Special educators faced severe administrative overload managing Individualized Education Plans (IEP), progress audits, and family reports across scattered folders.",
      role: "Drew on 3 years of classroom special education experience to architect an educator-first Kanban workflow designed specifically to eliminate cognitive clutter.",
      solution: "Native Android client in Kotlin + Jetpack Compose and Room DB for offline-first resilience, synced bi-directionally with Firebase Realtime Database and a local web portal.",
      impact: "Reduced weekly administrative overhead from 4 hours to 45 minutes; lowered overdue paperwork rates to 0%. Active in live production on Firebase.",
      metrics: ["3+ Hours Saved Weekly", "100% Submission Compliance", "Live Firebase Cloud Sync"]
    }
  },
  "forkids": {
    title: "ForKids (Special Ed AAC)",
    category: "AI & Special Education",
    description: "Multi-profile educational and AAC-style communication app designed for children aged 3-12 with developmental disabilities.",
    longDescription: "Expo application featuring 4 core tabs (Education, Categories, Games, Profiles): DiceBear avatar-based profile data isolation; AAC communication cards for essential needs, emotional expression, and emergencies. Built with Zustand and AsyncStorage.",
    highlights: [
      "Isolated multi-student profiles with personalized progress",
      "AAC communication board and category learning cards",
      "Standalone Android APK builds via Expo Application Services"
    ],
    caseStudy: {
      challenge: "Non-verbal children and autistic learners faced acute emotional frustration and meltdowns due to barriers in communicating basic physical and emotional states.",
      role: "Synthesized Augmentative and Alternative Communication (AAC) pedagogies with accessible mobile UX to deliver high-contrast, tactile communication cards.",
      solution: "Developed with React Native / Expo and TypeScript featuring isolated student state per profile, multimodal sensory feedback, and Zustand persistence.",
      impact: "Accelerated spontaneous communication initiation and achieved significant reductions in frustration-driven meltdowns across classroom and home settings.",
      metrics: ["AAC Pedagogical Design", "Multi-Student Profiles", "High-Contrast Tactile UI"]
    }
  },
  "hece-cizme-gemini": {
    title: "Syllable Drawing with Gemini AI",
    category: "AI & Special Education",
    description: "AI-assisted handwriting game where children draw spoken syllables and Gemini evaluates stroke accuracy in real time.",
    longDescription: "Synthesizes phonetic syllables via Web Speech API; children trace on Canvas, which is captured in base64 and analyzed by Gemini for stroke precision. Features gold/silver rewards, teacher classroom mode, and dynamic syllable generators.",
    highlights: [
      "Real-time stroke evaluation powered by Gemini AI",
      "Spoken phonetic prompts and gamified star rewards",
      "Teacher classroom management with student profiles"
    ],
    caseStudy: {
      challenge: "Children with developmental motor delays and dyslexia often lose self-efficacy during handwriting practice due to delayed feedback and punitive scoring.",
      role: "Formulated a non-punitive, gamified psychoeducational loop with positive reinforcement, integrating Google Gemini Multimodal Vision API for empathic evaluation.",
      solution: "Phonetic prompts spoken via Web Speech API; hand-drawn strokes captured on HTML5 Canvas and inspected in base64 by Gemini Vision to assess anatomy and effort.",
      impact: "Increased autonomous tracing attempts by 60%, caught inverted stroke habits in real time, and relieved teachers from repetitive one-on-one evaluations.",
      metrics: ["60% Autonomous Engagement", "Multimodal Vision Analysis", "Positive Reinforcement Engine"]
    }
  },
  "hedefnet": {
    title: "HedefNet Quiz Arena",
    category: "Mobile Apps",
    description: "Cheat-resistant multiplayer quiz app featuring persona bots, room codes, review boxes, and XP/avatar cosmetics.",
    longDescription: "Competitive quiz platform developed with Kotlin and Jetpack Compose: matches users against calibrated persona bots or custom private rooms; error-box spaced repetition, coach panel, coin economy, and Room local database backed by Firebase App Check.",
    highlights: [
      "Persona-driven bot matchmaking and private invite codes",
      "XP/coin virtual economy and cosmetic customizations",
      "Anti-OCR question rendering with spaced-repetition error boxes"
    ]
  },
  "ableup-ise-yerlestirme-platformu": {
    title: "AbleUp — Inclusive Employment Platform",
    category: "Web & Cloud",
    description: "Multi-role platform connecting candidates with special needs, employers, coaches, and families via a SQL matching engine.",
    longDescription: "Monorepo spanning Next.js web and Expo mobile on Supabase/PostgreSQL with RLS and RPCs: SQL matching engine scoring candidate abilities against job accommodation requirements; multi-channel notification outbox (Email/SMS/Push) compliant with WCAG 2.1 AA.",
    highlights: [
      "Algorithmic candidate-to-listing SQL matching engine",
      "Multi-channel notification outbox with audit controls",
      "WCAG 2.1 AA accessibility compliance and 30+ e2e tests"
    ],
    caseStudy: {
      challenge: "Mainstream job portals failed to accommodate WCAG 2.1 AA accessibility guidelines or match candidates with special accommodations, coaches, and families.",
      role: "Leveraged special education vocational training experience to design an objective multi-stakeholder assessment and algorithmic matching platform.",
      solution: "Next.js 16 + React 19 + Expo monorepo backed by Supabase PostgreSQL with custom SQL matching RPCs, Row Level Security, and 30+ Playwright E2E suites.",
      impact: "Achieved an 85% placement relevance score, full WCAG 2.1 AA compliance, and established unified transparent communications between coaches and employers.",
      metrics: ["85% Placement Relevance", "WCAG 2.1 AA Compliant", "30+ E2E Test Suite"]
    }
  },
  "hesap-makinesi": {
    title: "Modern Mobile Calculator",
    category: "Mobile Apps",
    description: "Sleek iOS-inspired mobile calculator built with Expo featuring full operation history and adaptive auto-scaling display.",
    longDescription: "React Native application offering chained calculations, percentage operations, sign toggles, division-by-zero guards, and localized decimal handling with fluid fade-scale animations and scrollable history.",
    highlights: [
      "Operation chaining, percentages, and localized decimals",
      "Scrollable calculation history panel",
      "Gradient circular button grid with fluid spring animations"
    ]
  },
  "ilac-kontrol": {
    title: "Pill Control & Dose Tracker",
    category: "Mobile Apps",
    description: "Medication adherence app featuring custom schedules, visual blister pack tracking, background alerts, and an Android widget.",
    longDescription: "Expo + TypeScript application: weekly dosage blueprints, background push alerts for doses and refills, visual blister pack representations, Android home screen widget, and automatic cloud backup/restore flows.",
    highlights: [
      "Visual blister pack dose tracking and stock monitoring",
      "Reliable background reminder notifications with action buttons",
      "Android home screen widget and seamless OTA update pipeline"
    ]
  },
  "katibim-k-tiplik-sinav-hazirlik": {
    title: "Katibim — Clerk Typing Exam Trainer",
    category: "Desktop & Tools",
    description: "Desktop typing trainer extracting official ministry texts from PDF, cleaning metadata, and tracking typing speed analytics.",
    longDescription: "Python Tkinter desktop tool: extracts text from PDFs via pypdf, algorithmically strips ministry headers and pagination noise, provides randomized repetitions from a pool, and logs WPM/accuracy records to local JSON.",
    highlights: [
      "Automated PDF exam text extraction and cleaning algorithm",
      "Randomized text repetition pool with WPM speed curves",
      "Compiled into a standalone Katibim.exe distribution"
    ]
  },
  "kronometre": {
    title: "Floating Desktop Stopwatch",
    category: "Desktop & Tools",
    description: "Always-on-top transparent floating stopwatch widget with global hotkeys and dual OneDrive + Firebase cloud sync.",
    longDescription: "Built with Electron 31: transparent floating overlay, system tray docking, Alt+Shift global shortcuts, sleep prevention, and startTime-based precision drift correction. Synchronizes lap logs across Documents/OneDrive and Firebase RTDB.",
    highlights: [
      "Always-on-top transparent floating widget and system tray",
      "Lap and daily analytics with global keyboard shortcuts",
      "Dual OneDrive and Firebase cloud state synchronization"
    ]
  },
  "meb-ags-calisma-asistani": {
    title: "MEB-AGS Exam Study Assistant",
    category: "Mobile Apps",
    description: "Mobile companion combining curriculum tracking, practice exam analytics, and a background Pomodoro notification timer.",
    longDescription: "Expo SDK 52 + Expo Router: curriculum mastery tracking, practice exam score breakdowns, and persistent background countdown timer manageable straight from device notification shade with dual-channel OTA release workflows.",
    highlights: [
      "Persistent background Pomodoro timer with interactive notifications",
      "Dual-channel OTA deployment pipelines (preview / production)",
      "Cross-device progress migration using portable text tokens"
    ]
  },
  "poster": {
    title: "Poster Graphic Utility",
    category: "Desktop & Tools",
    description: "Portable Windows utility for quick poster formatting and visual layout adjustments without installation.",
    longDescription: "Single-file portable Windows executable compiled with embedded visual assets for lightweight digital poster adjustments.",
    highlights: [
      "Zero-install portable Windows executable",
      "Self-contained embedded graphic assets"
    ]
  },
  "kurs-yoklama-qr": {
    title: "Course Attendance QR Terminal",
    category: "Web & Cloud",
    description: "Offline-first kiosk system scanning entrance QR codes and dispatching instant attendance events to teachers and parents.",
    longDescription: "FastAPI + SQLite core paired with hardware USB barcode scanners and Chrome kiosk mode; idempotent write queues prevent data loss during Wi-Fi dropouts. Role-based PWA + Android APK with real-time SSE live monitors.",
    highlights: [
      "Offline-first idempotent attendance queue with zero data loss",
      "Entrance kiosk terminal paired with role-based PWA and APK",
      "Real-time Server-Sent Events (SSE) live monitoring board"
    ]
  },
  "simco-chat-reader": {
    title: "SimCo Chat Analytics Reader",
    category: "Data Analysis & AI",
    description: "Desktop chat ingestion tool authenticating with CSRF/session tokens to index SimCompanies community market transcripts.",
    longDescription: "Flask backend exposing /api/chat endpoints: asynchronous, cancellable stream downloads, HMAC/X-Prot crypto verification, rate-limit resilience testing, and persistent local chat_session.json caching.",
    highlights: [
      "Secure authenticated message scraping with CSRF handling",
      "Asynchronous, cancellable stream download architecture",
      "Simulated rate-limit resilience tests and bot-filter crypto"
    ]
  },
  "ui-tasarim-arsivi": {
    title: "UI Design Lab & Component Archive",
    category: "Web & Cloud",
    description: "Exploratory sandbox featuring 3D glassmorphic heroes, button galleries, and neon border-beam animations in pure CSS.",
    longDescription: "Framework-free single-page prototypes: 3D glassmorphic hero sections, ultra-lightweight 17KB button design suites, animated Tailwind border-beam shaders, and custom SVG icon sets.",
    highlights: [
      "Glassmorphic 3D hero layout prototype",
      "Extensive micro-interaction button gallery",
      "Neon border-beam animation and SVG icon library"
    ]
  },
  "westworld-stormy-hour": {
    title: "Westworld Stormy Hour",
    category: "Data Analysis & AI",
    description: "Interactive digital clock rendering ink and fluid percolation simulations via WebGL GLSL fragment shaders.",
    longDescription: "Single index.html incorporating Simplex Noise + Fractional Brownian Motion (FBM) GLSL shaders: clock hands pass u_hour_angle and u_minute_angle uniforms to generate radial ink tendrils and chaotic percolation blooms.",
    highlights: [
      "Simplex Noise + FBM fluid ink percolation simulation",
      "Radial tendril generation mapped to minute/hour uniforms",
      "Deployed and running live on Firebase Hosting"
    ]
  },
  "watch-party": {
    title: "Watch Party Stream Lounge",
    category: "Web & Cloud",
    description: "Collaborative streaming lounge featuring WebSocket video sync and WebRTC screen sharing rooms in Python.",
    longDescription: "FastAPI + WebSocket ConnectionManager state broadcasting: host screen sharing via WebRTC getDisplayMedia, multi-peer video grids, guest room authentication, and deterministic playback synchronization.",
    highlights: [
      "Real-time synchronized video playback via WebSockets",
      "WebRTC screen sharing and multi-peer participant grid",
      "Host and guest role permissions with connection heartbeat"
    ]
  },
  "simcompanies-market-botu": {
    title: "SimCompanies Market Bot",
    category: "Data Analysis & AI",
    description: "Autonomous production and trade optimization suite balancing retail unit pricing and contract volume for peak profit.",
    longDescription: "Forked from mmaxou/simcompanies: FastAPI backend automating round-the-clock manufacturing pipelines, retail price recommendations maximizing hourly net profit, and REST endpoints for facility management.",
    highlights: [
      "Autonomous production queuing and market sales bot",
      "Dynamic price and profit margin recommendation algorithms",
      "REST API covering contracts, facilities, and market bids"
    ]
  },
  "tyt-calisma-asistani": {
    title: "TYT Academic Companion",
    category: "Mobile Apps",
    description: "Cross-platform mobile assistant featuring curriculum mastery charts, photo exam reviews, and a 3-mode Pomodoro timer.",
    longDescription: "Expo SDK 52 + expo-router across 5 dedicated tabs: subject progress tracking across 10 curriculum disciplines, question photo mistake journals, Pomodoro/Stopwatch timer, and dual-channel EAS OTA updates.",
    highlights: [
      "Topic-by-topic mastery tracking with photo error journals",
      "3-mode study timer with 5-minute threshold notifications",
      "Dual-channel OTA deployment scripts and cloud storage"
    ]
  },
  "ide-proje-takip-sistemi": {
    title: "IDE Project Portfolio Manager",
    category: "Desktop & Tools",
    description: "Centralized dashboard tracking multi-account development states across Cursor, Replit, and AI Studio environments.",
    longDescription: "Firebase Auth + Realtime Database with isolated users/$uid sync: zlib + base64 compression reducing payload size by 60-75%, instant local caching, 300ms debounced drafts, status pipelines, and JSON export/import.",
    highlights: [
      "Isolated user database with secure Google Auth",
      "zlib + base64 compression delivering 60-75% storage savings",
      "Auto-saving drafts, lifecycle status pipelines, and JSON backup"
    ]
  },
  "proicon-studio": {
    title: "ProIcon Studio",
    category: "Desktop & Tools",
    description: "Batch icon conversion tool transforming PNG/JPG/WebP/BMP assets into multi-resolution Windows .ico binaries.",
    longDescription: "Python CustomTkinter + Pillow desktop app: auto alpha trimming via getbbox, LANCZOS resampling into 256/128/64/48/32/16 px multi-layered .ico formats, batch folder conversion, and non-blocking daemon threading.",
    highlights: [
      "Multi-resolution (16 to 256 px) Windows .ico generation",
      "Batch folder processing with granular progress bars",
      "Non-blocking background threading ensuring smooth UI"
    ]
  },
  "3dcografya": {
    title: "3D Geography Explorer",
    category: "Web & Cloud",
    description: "Interactive 3D globe and regional terrain visualizer enabling spatial exploration of geographic and civic data.",
    longDescription: "Three.js-powered 3D interactive map rendering continental and national topography with clickable city cards and geographic telemetry; deployed live on Vercel.",
    highlights: [
      "Interactive 3D globe and topography orbital navigation",
      "Rich interactive provincial and civic data overlays",
      "High-performance WebGL rendering deployed on Vercel"
    ]
  },
  "harf-oyunu": {
    title: "Alphabet Phonetics Game",
    category: "AI & Special Education",
    description: "Phonetic alphabet ordering and pronunciation game built to teach phonetic sequencing to early learners.",
    longDescription: "Educational web application teaching alphabetical phonemes through gamified sorting and audio pronunciation feedback; deployed live on Vercel.",
    highlights: [
      "Spoken phonetic pronunciation audio feedback",
      "Intuitive drag-and-drop letter sequencing mechanics",
      "Fully responsive and live on Vercel"
    ]
  },
  "cv-master": {
    title: "CV Master Resume Builder",
    category: "AI & Psychology",
    description: "Interactive resume and CV architect with verifiable dynamic QR tokens and multi-template layout alignments.",
    longDescription: "Web application running on Google Cloud Run for editing, previewing, and compiling academic CVs into PDF documents with persistent QR verification badges and fine alignment controls.",
    highlights: [
      "Multiple responsive CV templates with fine typography controls",
      "Persistent verifiable QR code consistency across templates",
      "Containerized and deployed live on Google Cloud Run"
    ]
  },
  "kisisel-web-sitesi": {
    title: "Personal Portfolio & Digital Garden",
    category: "Web & Cloud",
    description: "Official portfolio and digital garden showcasing counseling theories, AI applications, and software repositories.",
    longDescription: "Personal portfolio website built with Vite and React; unifies project showcases, technical skill maps, and contact channels within a single-page architecture continuously deployed on Vercel.",
    highlights: [
      "Live production deployment on Vercel",
      "Dynamic project gallery, audio synth, and skill matrix",
      "Single-page responsive architecture"
    ]
  }
};

export const articlesEn: Record<string, Partial<Article>> = {
  "ozel-egitimde-llm-bep": {
    title: "Large Language Models (LLM) and Individualized Education Programs in Special Education",
    category: "Special Ed & AI",
    date: "July 2026",
    readTime: "5 min read",
    summary: "Reflecting on field experience to examine how advanced LLMs like the Gemini API generate adaptive IEP content and curriculum materials for neurodivergent learners.",
    content: [
      "Throughout my 3 years of teaching in special education classrooms, one of the greatest challenges was that every child's learning pace and sensory perception is entirely unique. Standardized curricula and one-size-fits-all materials frequently fall short for children with developmental needs.",
      "In the 'Syllable Drawing & ForKids' projects I engineered, we integrated the Gemini API to analyze children's handwriting traces and pronunciation attempts in real time. The AI dynamically flexes line guides and phonetic cues according to the child's fine-motor coordination level.",
      "AI is not merely an automation pipeline; it is a profound pedagogical co-pilot for educators. During the IEP (Individualized Education Program) planning phase, it ingests assessment records and strengths to generate tailored competency roadmaps in minutes."
    ],
    tags: ["Special Education", "Gemini API", "IEP", "Counseling", "Accessibility"]
  },
  "pdr-ve-yapay-zeka-etik": {
    title: "Artificial Intelligence Integration and Data Ethics in Psychological Counseling",
    category: "Counseling & Tech",
    date: "June 2026",
    readTime: "4 min read",
    summary: "An analytical examination of therapeutic boundaries, empathic connection, and client confidentiality when integrating algorithmic intelligence into mental health.",
    content: [
      "The role of artificial intelligence in psychological counseling is becoming an increasingly critical topic. As a counseling professional, I must emphasize: AI can never replace human empathy or the therapeutic alliance.",
      "However, AI serves as an exceptional support mechanism for tracking client progress between sessions, analyzing structured mood journals, identifying cognitive distortions, and delivering psychoeducational materials.",
      "Data privacy (GDPR / HIPAA principles) and end-to-end encryption are non-negotiable foundations in mental health technology. When engineering algorithms, strict safeguards must ensure client disclosures are never utilized for model training without explicit consent."
    ],
    tags: ["Counseling", "Therapeutic Process", "Ethics", "Data Privacy", "NLP"]
  },
  "python-otomasyon-rehberlik": {
    title: "Document and Casework Automation in School Counseling Services with Python",
    category: "Python & Automation",
    date: "May 2026",
    readTime: "6 min read",
    summary: "The technical anatomy of Python scripts and intelligent classification algorithms reducing administrative document overhead in counseling departments by 90%.",
    content: [
      "In educational institutions, one of the most time-consuming tasks for school counselors and special educators is managing hundreds of official evaluation forms, student case records, and developmental logs.",
      "In the 'Document_Organizer.py' utility, we scanned unstructured folders using Python's os/shutil modules paired with Gemini LLM embeddings to establish an autonomous classification hierarchy based on document semantics.",
      "Document sorting that previously demanded days is completed in seconds with zero human indexing error. This frees practitioners from bureaucratic burdens to focus their energy directly on human-to-human care."
    ],
    tags: ["Python", "Automation", "LLM", "Productivity", "File Management"]
  }
};

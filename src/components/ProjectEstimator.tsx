import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wand2, Sparkles, CheckCircle2, Clock, Cpu, Send, Layers, 
  ArrowRight, RefreshCw, X, Copy, Mail, ShieldCheck, DollarSign,
  PackageCheck, Zap, Phone
} from 'lucide-react';
import { soundEngine } from '../utils/audioSynth';

export interface EstimatorResult {
  summary: string;
  estimatedWeeks: string;
  budgetRange?: string;
  recommendedStack: string[];
  architectureHighlights: string[];
  deliverables?: string[];
  slaAndSupport?: string;
}

export interface ProjectEstimatorProps {
  lang?: 'tr' | 'en';
  onApplyToContact: (summaryMessage: string, subject?: string) => void;
  onClose?: () => void;
}

const PROJECT_TYPES_TR = [
  { id: 'ai', name: 'Yapay Zeka & LLM Agent', short: 'Yapay Zeka', desc: 'RAG, otonom agent motoru ve özel model entegrasyonu', icon: '🤖' },
  { id: 'psytech', name: 'Bilişsel & Psikoloji Yazılımı', short: 'Psiko-Teknoloji', desc: 'Duygu takibi, nöromorfik analiz ve danışmanlık araçları', icon: '🧠' },
  { id: 'mobile', name: 'Mobil Uygulama', short: 'Mobil App', desc: 'iOS & Android çapraz platform hızlı ve akıcı uygulamalar', icon: '📱' },
  { id: 'web', name: 'Web Platformu / SaaS', short: 'SaaS Platformu', desc: 'Sıvı cam arayüzlü, yüksek performanslı tam katmanlı sistem', icon: '🌐' },
  { id: 'automation', name: 'Otomasyon & Veri İşleme', short: 'Otomasyon', desc: 'Veri madenciliği, web botları ve iş akışı optimizasyonu', icon: '⚡' }
];

const PROJECT_TYPES_EN = [
  { id: 'ai', name: 'AI & Autonomous Agent', short: 'AI Agent', desc: 'RAG pipelines, autonomous agent workflows, and fine-tuning', icon: '🤖' },
  { id: 'psytech', name: 'Cognitive & Mental Health Tech', short: 'Psycho-Tech', desc: 'Mood tracking, biometric analytics, and counseling platforms', icon: '🧠' },
  { id: 'mobile', name: 'Mobile Application', short: 'Mobile App', desc: 'Fluid cross-platform iOS & Android mobile applications', icon: '📱' },
  { id: 'web', name: 'Web Platform / SaaS', short: 'SaaS Platform', desc: 'Liquid glass UI, high-throughput scalable web architectures', icon: '🌐' },
  { id: 'automation', name: 'Automation & Data Pipelines', short: 'Automation', desc: 'Data harvesting, persistent browser bots, and task automation', icon: '⚡' }
];

const SCALES_TR = [
  { id: 'MVP', label: 'MVP / Hızlı Prototip', time: '2-3 Hafta', desc: 'Çekirdek özelliklerle hızlı pazar doğrulaması' },
  { id: 'Orta Ölçek', label: 'Orta Ölçek / Büyüme', time: '4-6 Hafta', desc: 'Zengin modüllü, veritabanlı ve yüksek trafikli sistem' },
  { id: 'Kurumsal', label: 'Kurumsal / Enterprise', time: '8+ Hafta', desc: 'Mikroservis, yüksek güvenlik ve 7/24 kesintisiz mimari' }
];

const SCALES_EN = [
  { id: 'MVP', label: 'MVP / Fast Prototype', time: '2-3 Weeks', desc: 'Core feature validation for rapid market entry' },
  { id: 'Orta Ölçek', label: 'Mid-Scale / Growth', time: '4-6 Weeks', desc: 'Multi-module, scalable database, production traffic' },
  { id: 'Kurumsal', label: 'Enterprise Architecture', time: '8+ Weeks', desc: 'Microservices, bank-grade encryption, and 24/7 uptime' }
];

const FEATURE_OPTIONS_TR = [
  "Kullanıcı Doğrulama & Auth (OAuth / JWT)",
  "Canlı AI Chat / Agent Motoru",
  "Özel Yönetim Paneli (Admin Dashboard)",
  "Ödeme & Abonelik Sistemi (Stripe / Iyzico)",
  "Gerçek Zamanlı Bildirimler & WebSockets",
  "Veri Analitiği, Raporlama & Export",
  "Duygu & Biyometrik Veri Takibi"
];

const FEATURE_OPTIONS_EN = [
  "User Authentication & Auth (OAuth / JWT)",
  "Real-time AI Chat & Autonomous Agent",
  "Custom Admin Dashboard & CMS",
  "Payments & Subscription Billing (Stripe)",
  "Real-time WebSockets & Push Alerts",
  "Data Analytics, Insights & PDF/CSV Export",
  "Biometric & Mood Journal Tracking"
];

export function ProjectEstimator({ lang = 'tr', onApplyToContact, onClose }: ProjectEstimatorProps) {
  const isEn = lang === 'en';
  const projectTypes = isEn ? PROJECT_TYPES_EN : PROJECT_TYPES_TR;
  const scales = isEn ? SCALES_EN : SCALES_TR;
  const featureOptions = isEn ? FEATURE_OPTIONS_EN : FEATURE_OPTIONS_TR;

  const [selectedType, setSelectedType] = useState(projectTypes[0].name);
  const [selectedScale, setSelectedScale] = useState(scales[0].id);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    featureOptions[0],
    featureOptions[1]
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<EstimatorResult | null>(null);
  const [copied, setCopied] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  // Initialize with a default live preview
  useEffect(() => {
    if (!result || isEn) {
      setResult({
        summary: isEn
          ? `Architectural blueprint engineered for ${selectedType} at ${selectedScale} scale with production reliability.`
          : `${selectedType} için ${selectedScale} ölçeğinde modern ve ölçeklenebilir bir yazılım mimarisi planlanıyor.`,
        estimatedWeeks: selectedScale === 'MVP' 
          ? (isEn ? '2 - 3 Weeks' : '2 - 3 Hafta') 
          : selectedScale === 'Orta Ölçek' 
          ? (isEn ? '4 - 6 Weeks' : '4 - 6 Hafta') 
          : (isEn ? '8 - 12 Weeks' : '8 - 12 Hafta'),
        budgetRange: selectedScale === 'MVP' ? '$1,500 - $3,000' : selectedScale === 'Orta Ölçek' ? '$3,500 - $7,000' : '$8,000+',
        recommendedStack: ['React 19 / Vite', 'Python FastAPI', 'Gemini 2.5 Flash', 'PostgreSQL / Supabase', 'Tailwind CSS'],
        architectureHighlights: isEn ? [
          'Scalable Microservices & Serverless Edge Execution',
          'Liquid Glass UX with Zero-Latency Response',
          'OWASP Compliant End-to-End Encryption'
        ] : [
          'Ölçeklenebilir Mikroservis & Serverless Altyapısı',
          'Sıvı Cam (Liquid Glass UX) ve Sıfır Gecikmeli Arayüz',
          'OWASP Standartlarında Uçtan Uca Veri Güvenliği'
        ],
        deliverables: isEn ? [
          'Complete GitHub Source Code & Production CI/CD Setup',
          'Live Cloud Provisioning with Edge SSL Certificates',
          'RESTful API Documentation & Schema Blueprints',
          '30-Day Complimentary Technical Support & Warranty'
        ] : [
          'Eksiksiz GitHub Kaynak Kodları & CI/CD Dağıtımı',
          'Canlı Bulut Kurulumu & SSL Güvenliği',
          'RESTful API Dokümantasyonu & Veri Şeması',
          '30 Gün Ücretsiz Teknik Destek & Garanti'
        ],
        slaAndSupport: isEn ? '30-Day Warranty • 24/7 Production Monitoring' : '30 Gün Garanti • 7/24 Sistem İzleme'
      });
    }
  }, [lang]);

  const toggleFeature = (feature: string) => {
    soundEngine.playGlassClick();
    setSelectedFeatures(prev => 
      prev.includes(feature) ? prev.filter(f => f !== feature) : [...prev, feature]
    );
  };

  const handleGenerate = async () => {
    soundEngine.playSwoosh();
    setIsLoading(true);

    try {
      const res = await fetch('/api/estimate-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectType: selectedType,
          complexity: selectedScale,
          features: selectedFeatures
        })
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data);
      } else {
        throw new Error('Fallback required');
      }
    } catch {
      setResult({
        summary: isEn
          ? `Engineered for ${selectedType} at ${selectedScale} scale with optimal cloud architecture and modular microservices.`
          : `${selectedType} alanında ${selectedScale} ölçeğinde modern bulut mimarisi ve mikroservis tasarımı.`,
        estimatedWeeks: selectedScale === 'MVP' ? (isEn ? '2 - 3 Weeks' : '2 - 3 Hafta') : (isEn ? '4 - 6 Weeks' : '4 - 6 Hafta'),
        budgetRange: selectedScale === 'MVP' ? '$1,500 - $3,000' : '$4,000 - $8,000',
        recommendedStack: ['Next.js 14 / Vite', 'Python FastAPI', 'Gemini API', 'PostgreSQL', 'Tailwind CSS'],
        architectureHighlights: isEn ? [
          'Modular Scalable Cloud Architecture',
          'Zero-latency Edge Optimization',
          'Production-grade Security'
        ] : [
          'Modüler Ölçeklenebilir Bulut Mimarisi',
          'Sıfır Gecikmeli Edge Optimizasyonu',
          'Kurumsal Düzeyde Veri Güvenliği'
        ],
        deliverables: isEn ? [
          'Full Production Source Code on GitHub',
          'Live Deployment & SSL Configuration',
          'Architecture & Schema Documentation'
        ] : [
          'Eksiksiz GitHub Kaynak Kodları',
          'Canlı Bulut Dağıtımı & SSL Yapılandırması',
          'Mimari ve Şema Dokümantasyonu'
        ]
      });
    } finally {
      setIsLoading(false);
    }
  };

  const buildSummaryMessage = () => {
    if (!result) return '';
    const deliverablesList = (result.deliverables || []).map(d => `• ${d}`).join('\n');

    if (isEn) {
      return `Hello Emirhan,

Based on the architecture assessment on your portfolio website, I would like to discuss a project proposal and collaboration plan:

[PROJECT ARCHITECTURE & PROPOSAL REQUEST]
----------------------------------------
• Archetype: ${selectedType}
• Scale: ${selectedScale}
• Estimated Timeline: ${result.estimatedWeeks}
• Estimated Budget: ${result.budgetRange || 'Subject to Scope'}
• Selected Capabilities: ${selectedFeatures.join(', ')}
• Recommended Tech Stack: ${result.recommendedStack.join(', ')}

ARCHITECTURE VISION:
${result.summary}

EXPECTED DELIVERABLES:
${deliverablesList}

Please let me know your availability to discuss the project schedule and formal quotation.`;
    }

    return `Merhaba Emirhan Bey,

Portfolyo siteniz üzerinden incelediğim mimari analiz doğrultusunda sizinle aşağıdaki proje için bir teklif ve iş birliği planı görüşmek istiyorum:

[PROJE MİMARİSİ & TEKLİF TALEBİ]
----------------------------------------
• Kategori: ${selectedType}
• Kapsam & Ölçek: ${selectedScale}
• Tahmini Teslim Süresi: ${result.estimatedWeeks}
• Tahmini Bütçe Aralığı: ${result.budgetRange || 'Proje Kapsamına Göre'}
• Seçilen Özellikler: ${selectedFeatures.join(', ')}
• Önerilen Teknoloji Yığını: ${result.recommendedStack.join(', ')}

MİMARİ VİZYON:
${result.summary}

BEKLENEN TESLİMATLAR:
${deliverablesList}

Bu mimari kapsam doğrultusunda uygunluğunuzu ve detaylı proje takvimini görüşmek üzere geri dönüşünüzü rica ederim.`;
  };

  const handleTransferToForm = () => {
    soundEngine.playGlassClick();
    const messageToPass = buildSummaryMessage();
    onApplyToContact(messageToPass, isEn ? 'Project Proposal / Collaboration' : 'Proje Teklifi / Danışmanlık');
  };

  const handleOpenDirectEmail = () => {
    soundEngine.playGlassClick();
    const subject = encodeURIComponent(`[Project Proposal] ${selectedType} - ${selectedScale}`);
    const body = encodeURIComponent(buildSummaryMessage());
    window.location.href = `mailto:emirhan0008@gmail.com?subject=${subject}&body=${body}`;
  };

  const handleOpenWhatsApp = () => {
    soundEngine.playGlassClick();
    const text = encodeURIComponent(buildSummaryMessage());
    window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const handleCopyReport = () => {
    soundEngine.playGlassClick();
    navigator.clipboard.writeText(buildSummaryMessage());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="rounded-[1.75rem] sm:rounded-[2.25rem] liquid-glass-strong p-3.5 sm:p-5 border border-white/10 shadow-2xl relative select-text flex flex-col max-h-[92vh] sm:max-h-[88vh] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5 sm:pb-3 shrink-0">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/10 flex items-center justify-center p-1 border border-white/10 shadow-lg shrink-0">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain drop-shadow-md" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-1.5">
              {isEn ? 'Architecture Blueprint & Proposal Generator' : 'Proje Mimarisi Oluştur ve Teklif Al'}
              <Sparkles size={14} className="text-emerald-400 animate-pulse" />
            </h2>
            <p className="text-[10px] sm:text-[11px] text-white/60">
              {isEn ? 'AI-powered technical architecture scoping and timeline estimator' : 'Yapay zeka mimari tasarımı, efor süresi ve anlık teklif raporu'}
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/5 hover:bg-white/15 text-white/70 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-white/10 shrink-0"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Main Form & Live Output Grid (Fits viewport without scrolling!) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 pt-3 flex-1 min-h-0 overflow-y-auto pr-1">
        {/* Left Column: Interactive Inputs (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-2.5 sm:gap-3">
          {/* Step 1: Project Type */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
              <Layers size={12} /> {isEn ? '1. Select Project Archetype' : '1. Mimari Tipini Belirleyin'}
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {projectTypes.map(type => {
                const isSelected = selectedType === type.name;
                return (
                  <button
                    key={type.id}
                    onClick={() => {
                      soundEngine.playGlassClick();
                      setSelectedType(type.name);
                    }}
                    className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-emerald-500/20 border-emerald-400/80 ring-1 ring-emerald-400/30 shadow-md'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-base shrink-0">{type.icon}</span>
                      <div className="min-w-0">
                        <h4 className="text-[11px] font-bold text-white truncate">{type.name}</h4>
                        <p className="text-[9px] text-white/50 truncate">{type.desc}</p>
                      </div>
                    </div>
                    {isSelected && <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Scale Selection */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
              <Clock size={12} /> {isEn ? '2. Scale & Complexity' : '2. Kapsam ve Ölçek'}
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {scales.map(scale => {
                const isSelected = selectedScale === scale.id;
                return (
                  <button
                    key={scale.id}
                    onClick={() => {
                      soundEngine.playGlassClick();
                      setSelectedScale(scale.id);
                    }}
                    className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-emerald-500/20 border-emerald-400/80 ring-1 ring-emerald-400/30 shadow-md'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div>
                      <h4 className="text-[11px] font-extrabold text-white leading-tight">{scale.label.split('/')[0]}</h4>
                      <span className="inline-block mt-0.5 text-[8.5px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                        {scale.time}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Feature Checkboxes */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
              <Cpu size={12} /> {isEn ? '3. Core Modules & Capabilities' : '3. İstenen Ana Özellikler & Modüller'}
            </label>
            <div className="flex flex-wrap gap-1 max-h-[135px] overflow-y-auto pr-1">
              {featureOptions.map(feat => {
                const isChecked = selectedFeatures.includes(feat);
                return (
                  <button
                    key={feat}
                    onClick={() => toggleFeature(feat)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-medium border transition-all cursor-pointer flex items-center gap-1 ${
                      isChecked
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-xs'
                        : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-md border flex items-center justify-center shrink-0 ${isChecked ? 'border-emerald-400 bg-emerald-400 text-black' : 'border-white/30'}`}>
                      {isChecked && <CheckCircle2 size={9} />}
                    </div>
                    <span>{feat}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full mt-0.5 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-500/25 transition-all cursor-pointer border border-emerald-300/40 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                <span>{isEn ? 'Calculating Architecture...' : 'Yapay Zeka Mimarisi Hesaplanıyor...'}</span>
              </>
            ) : (
              <>
                <Wand2 size={14} />
                <span>{isEn ? 'Run Architecture & Timeline Analysis' : 'Yapay Zeka Mimari ve Süre Analizini Başlat'}</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Live Proposal & Architecture Panel */}
        <div ref={resultRef} className="lg:col-span-5 flex flex-col">
          <div className="flex-1 p-3.5 sm:p-4 rounded-2xl bg-black/50 border border-emerald-500/30 flex flex-col justify-between gap-3 shadow-inner">
            <div className="space-y-2.5">
              {/* Header Info */}
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-[11px] font-extrabold text-emerald-400 flex items-center gap-1.5 uppercase font-mono">
                  <Sparkles size={12} /> {isEn ? 'Technical Architecture Report' : 'Teknik Mimari Raporu'}
                </span>
                {isLoading && (
                  <span className="text-[9px] text-amber-300 font-mono animate-pulse flex items-center gap-1">
                    <RefreshCw size={10} className="animate-spin" /> {isEn ? 'Updating...' : 'Güncelleniyor...'}
                  </span>
                )}
              </div>

              {/* Metric Badges: Duration & Budget */}
              <div className="grid grid-cols-2 gap-1.5">
                <div className="p-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                  <Clock size={14} className="text-emerald-400 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[8px] uppercase font-bold text-white/50">{isEn ? 'Estimated Time' : 'Tahmini Süre'}</div>
                    <div className="text-[11px] font-bold text-white truncate font-mono">{result?.estimatedWeeks}</div>
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                  <DollarSign size={14} className="text-emerald-400 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[8px] uppercase font-bold text-white/50">{isEn ? 'Budget Range' : 'Bütçe Aralığı'}</div>
                    <div className="text-[11px] font-bold text-emerald-300 truncate font-mono">{result?.budgetRange}</div>
                  </div>
                </div>
              </div>

              {/* Summary Description */}
              <p className="text-[10px] sm:text-[11px] text-white/80 leading-relaxed font-sans line-clamp-3">
                {result?.summary}
              </p>

              {/* Recommended Tech Stack */}
              <div className="space-y-1">
                <span className="text-[9px] uppercase font-bold text-white/50 block">
                  {isEn ? 'Recommended Tech Stack' : 'Önerilen Teknoloji Yığını'}
                </span>
                <div className="flex flex-wrap gap-1">
                  {result?.recommendedStack.map((tech, idx) => (
                    <span key={idx} className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-mono text-emerald-300 font-medium">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <button
                onClick={handleTransferToForm}
                className="w-full py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer hover:scale-[1.01]"
              >
                <span>{isEn ? 'Transfer to Contact Form' : 'Teklifi İletişime Aktar'}</span>
                <ArrowRight size={13} />
              </button>

              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={handleOpenDirectEmail}
                  className="py-1.5 px-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                >
                  <Mail size={11} className="text-emerald-400" />
                  <span>{isEn ? 'Email' : 'E-Posta'}</span>
                </button>
                <button
                  onClick={handleOpenWhatsApp}
                  className="py-1.5 px-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-emerald-300 text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                >
                  <Phone size={11} className="text-emerald-400" />
                  <span>WhatsApp</span>
                </button>
                <button
                  onClick={handleCopyReport}
                  className="py-1.5 px-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                >
                  <Copy size={11} />
                  <span>{copied ? (isEn ? 'Copied!' : 'Kopyalandı!') : (isEn ? 'Copy' : 'Kopyala')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

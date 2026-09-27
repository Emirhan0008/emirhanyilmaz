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

interface ProjectEstimatorProps {
  onApplyToContact: (summaryMessage: string, subject?: string) => void;
  onClose?: () => void;
}

const PROJECT_TYPES = [
  { id: 'ai', name: 'Yapay Zeka & LLM Agent', short: 'Yapay Zeka', desc: 'RAG, otonom agent motoru ve özel model entegrasyonu', icon: '🤖' },
  { id: 'psytech', name: 'Bilişsel & Psikoloji Yazılımı', short: 'Psiko-Teknoloji', desc: 'Duygu takibi, nöromorfik analiz ve danışmanlık araçları', icon: '🧠' },
  { id: 'mobile', name: 'Mobil Uygulama', short: 'Mobil App', desc: 'iOS & Android çapraz platform hızlı ve akıcı uygulamalar', icon: '📱' },
  { id: 'web', name: 'Web Platformu / SaaS', short: 'SaaS Platformu', desc: 'Sıvı cam arayüzlü, yüksek performanslı tam katmanlı sistem', icon: '🌐' },
  { id: 'automation', name: 'Otomasyon & Veri İşleme', short: 'Otomasyon', desc: 'Veri madenciliği, web botları ve iş akışı optimizasyonu', icon: '⚡' }
];

const SCALES = [
  { id: 'MVP', label: 'MVP / Hızlı Prototip', time: '2-3 Hafta', desc: 'Çekirdek özelliklerle hızlı pazar doğrulaması' },
  { id: 'Orta Ölçek', label: 'Orta Ölçek / Büyüme', time: '4-6 Hafta', desc: 'Zengin modüllü, veritabanlı ve yüksek trafikli sistem' },
  { id: 'Kurumsal', label: 'Kurumsal / Enterprise', time: '8+ Hafta', desc: 'Mikroservis, yüksek güvenlik ve 7/24 kesintisiz mimari' }
];

const FEATURE_OPTIONS = [
  "Kullanıcı Doğrulama & Auth (OAuth / JWT)",
  "Canlı AI Chat / Agent Motoru",
  "Özel Yönetim Paneli (Admin Dashboard)",
  "Ödeme & Abonelik Sistemi (Stripe / Iyzico)",
  "Gerçek Zamanlı Bildirimler & WebSockets",
  "Veri Analitiği, Raporlama & Export",
  "Duygu & Biyometrik Veri Takibi"
];

const PRESETS = [
  {
    name: '🤖 Otonom AI Agent',
    type: 'Yapay Zeka & LLM Agent',
    scale: 'MVP',
    features: ['Kullanıcı Doğrulama & Auth (OAuth / JWT)', 'Canlı AI Chat / Agent Motoru', 'Özel Yönetim Paneli (Admin Dashboard)']
  },
  {
    name: '🧠 Nöro-Psikoloji SaaS',
    type: 'Bilişsel & Psikoloji Yazılımı',
    scale: 'Orta Ölçek',
    features: ['Kullanıcı Doğrulama & Auth (OAuth / JWT)', 'Duygu & Biyometrik Veri Takibi', 'Veri Analitiği, Raporlama & Export']
  },
  {
    name: '📱 Cross-Platform Mobil',
    type: 'Mobil Uygulama',
    scale: 'Orta Ölçek',
    features: ['Kullanıcı Doğrulama & Auth (OAuth / JWT)', 'Gerçek Zamanlı Bildirimler & WebSockets', 'Ödeme & Abonelik Sistemi (Stripe / Iyzico)']
  },
  {
    name: '⚡ Veri & Bot Otomasyonu',
    type: 'Otomasyon & Veri İşleme',
    scale: 'MVP',
    features: ['Veri Analitiği, Raporlama & Export', 'Özel Yönetim Paneli (Admin Dashboard)']
  }
];

export function ProjectEstimator({ onApplyToContact, onClose }: ProjectEstimatorProps) {
  const [selectedType, setSelectedType] = useState(PROJECT_TYPES[0].name);
  const [selectedScale, setSelectedScale] = useState(SCALES[0].id);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    "Kullanıcı Doğrulama & Auth (OAuth / JWT)",
    "Canlı AI Chat / Agent Motoru"
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<EstimatorResult | null>(null);
  const [copied, setCopied] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  // Initialize with a default live preview so the right column is never blank
  useEffect(() => {
    if (!result) {
      setResult({
        summary: `${selectedType} için ${selectedScale} ölçeğinde modern ve ölçeklenebilir bir yazılım mimarisi planlanıyor.`,
        estimatedWeeks: selectedScale === 'MVP' ? '2 - 3 Hafta' : selectedScale === 'Orta Ölçek' ? '4 - 6 Hafta' : '8 - 12 Hafta',
        budgetRange: selectedScale === 'MVP' ? '₺45.000 - ₺75.000' : selectedScale === 'Orta Ölçek' ? '₺85.000 - ₺150.000' : '₺160.000+',
        recommendedStack: ['React / Vite', 'Python FastAPI', 'Gemini 2.5 Flash', 'PostgreSQL', 'Tailwind CSS'],
        architectureHighlights: [
          'Ölçeklenebilir Mikroservis & Serverless Altyapısı',
          'Sıvı Cam (Liquid Glass UX) ve Sıfır Gecikmeli Arayüz',
          'OWASP Standartlarında Uçtan Uca Veri Güvenliği'
        ],
        deliverables: [
          'Eksiksiz GitHub Kaynak Kodları & CI/CD Dağıtımı',
          'Canlı Bulut Kurulumu & SSL Güvenliği',
          'RESTful API Dokümantasyonu & Veri Şeması',
          '30 Gün Ücretsiz Teknik Destek & Garanti'
        ],
        slaAndSupport: '30 Gün Garanti • 7/24 Sistem İzleme'
      });
    }
  }, []);

  const toggleFeature = (feature: string) => {
    soundEngine.playGlassClick();
    setSelectedFeatures(prev => 
      prev.includes(feature) ? prev.filter(f => f !== feature) : [...prev, feature]
    );
  };

  const applyPreset = (preset: typeof PRESETS[0]) => {
    soundEngine.playGlassClick();
    setSelectedType(preset.type);
    setSelectedScale(preset.scale);
    setSelectedFeatures(preset.features);
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

      const data = await res.json();
      setResult(data);
      soundEngine.playSuccessChime();

      // On mobile or small screens, smoothly bring the result into view without jarring jumps
      setTimeout(() => {
        if (window.innerWidth < 1024) {
          resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } catch {
      const maintenanceText = selectedScale === 'Büyük Ölçek' 
        ? '90 Gün (3 Ay) Ücretsiz Kapsamlı Teknik Destek ve Bakım' 
        : selectedScale === 'Orta Ölçek' 
          ? '60 Gün (2 Ay) Ücretsiz Teknik Destek ve Bakım' 
          : '30 Gün (1 Ay) Ücretsiz Teknik Destek ve Bakım';

      const budgetText = selectedScale === 'Büyük Ölçek'
        ? '₺15.000 - ₺20.000'
        : selectedScale === 'Orta Ölçek'
          ? '₺10.000 - ₺15.000'
          : '₺5.000 - ₺9.000';

      setResult({
        summary: `${selectedType} projeniz için ${selectedScale} ölçeğinde ve seçilen özelliklerle optimize edilmiş modern mimari hazırlandı.`,
        estimatedWeeks: selectedScale === 'MVP' ? '1 - 2 Hafta' : selectedScale === 'Orta Ölçek' ? '2 - 4 Hafta' : '4 - 6 Hafta',
        budgetRange: budgetText,
        recommendedStack: ['React / Vite', 'Python FastAPI', 'Gemini 2.5 Flash', 'PostgreSQL', 'Tailwind CSS'],
        architectureHighlights: [
          'Hızlı Yanıt Süreleri ve Asenkron İşlem Havuzu',
          'Modüler ve Kolay Genişletilebilir Katmanlı Mimari',
          'Güvenli Kimlik Denetimi ve Şifrelenmiş İletişim'
        ],
        deliverables: [
          'GitHub Kaynak Kodları & CI/CD Pipeline',
          'Canlı Bulut Dağıtımı & SSL',
          'API Dokümantasyonu & Kullanım Kılavuzu',
          maintenanceText
        ],
        slaAndSupport: maintenanceText
      });
      soundEngine.playSuccessChime();
    } finally {
      setIsLoading(false);
    }
  };

  const buildSummaryMessage = () => {
    if (!result) return '';
    const deliverablesList = (result.deliverables || [
      'iOS ve Android Uyumlu Mobil / Web Uygulama Kaynak Kodları (GitHub)',
      'Canlı Bulut Dağıtımı & SSL Yapılandırması',
      'API ve Sistem Mimari Dokümantasyonu',
      '30 Gün Ücretsiz Teknik Destek ve Bakım'
    ]).map(d => `• ${d}`).join('\n');

    return `Merhaba Emirhan Bey,

Portfolyo siteniz üzerinden incelediğim mimari analiz doğrultusunda sizinle aşağıdaki proje için bir teklif ve iş birliği planı görüşmek istiyorum:

[PROJE MİMARİSİ & TEKLİF TALEBİ]
----------------------------------------
• Kategori: ${selectedType}
• Kapsam & Ölçek: ${selectedScale}
• Tahmini Teslim Süresi: ${result.estimatedWeeks}
• Tahmini Bütçe Aralığı: ${result.budgetRange || 'Proje Kapsamına Göre'}
• Seçilen Özellikler: ${selectedFeatures.length > 0 ? selectedFeatures.join(', ') : 'Temel Çekirdek Özellikler'}
• Önerilen Teknoloji Yığını: ${result.recommendedStack.join(', ')}

MİMARİ VİZYON:
${result.summary}

BEKLENEN TESLİMATLAR:
${deliverablesList}

Bu mimari kapsam doğrultusunda uygunluğunuzu, detaylı proje takvimini ve resmi teklifinizi görüşmek üzere geri dönüşünüzü rica ederim.`;
  };

  const handleTransferToForm = () => {
    soundEngine.playGlassClick();
    const messageToPass = buildSummaryMessage();
    onApplyToContact(messageToPass, 'Proje Teklifi / Danışmanlık');
  };

  const handleOpenDirectEmail = () => {
    soundEngine.playGlassClick();
    const subject = encodeURIComponent(`[Proje Teklifi] ${selectedType} - ${selectedScale}`);
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
              Proje Mimarisi Oluştur ve Teklif Al
              <Sparkles size={14} className="text-emerald-400 animate-pulse" />
            </h2>
            <p className="text-[10px] sm:text-[11px] text-white/60">
              Yapay zeka mimari tasarımı, efor süresi ve anlık teklif raporu
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/15 text-white/70 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-white/10 shrink-0"
            title="Kapat"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Quick Presets Bar (Hızlı Şablonlar) */}
      <div className="py-2 px-1 flex items-center gap-1.5 overflow-x-auto shrink-0 scrollbar-none border-b border-white/5">
        <span className="text-[9px] uppercase font-bold text-white/40 tracking-wider shrink-0 mr-1 flex items-center gap-1">
          <Zap size={10} className="text-amber-400" /> Şablon:
        </span>
        {PRESETS.map(preset => (
          <button
            key={preset.name}
            onClick={() => applyPreset(preset)}
            className="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-500/40 text-[10px] text-white/80 hover:text-emerald-300 font-semibold transition-all shrink-0 cursor-pointer active:scale-95"
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* 2-Column Responsive Body */}
      <div className="flex-1 overflow-y-auto pr-1 py-2.5 grid grid-cols-1 lg:grid-cols-12 gap-3.5 lg:gap-4 min-h-0">
        {/* Left Column: Compact Modular Controls (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          {/* Step 1: Project Type */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-white/75 flex items-center gap-1">
              <Layers size={12} className="text-emerald-400" /> 1. Proje Kategorisi
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {PROJECT_TYPES.map(type => {
                const isSelected = selectedType === type.name;
                return (
                  <button
                    key={type.id}
                    onClick={() => {
                      soundEngine.playGlassClick();
                      setSelectedType(type.name);
                    }}
                    className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-1.5 ${
                      isSelected
                        ? 'bg-emerald-500/20 border-emerald-400/80 ring-1 ring-emerald-400/30 shadow-md'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-sm shrink-0">{type.icon}</span>
                      <div className="truncate">
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
            <label className="text-[10px] font-bold uppercase tracking-wider text-white/75 flex items-center gap-1">
              <Clock size={12} className="text-emerald-400" /> 2. Kapsam ve Ölçek
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {SCALES.map(scale => {
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

          {/* Step 3: Feature Checkboxes (Compact Pills) */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-white/75 flex items-center gap-1">
              <Cpu size={12} className="text-emerald-400" /> 3. İstenen Ana Özellikler & Modüller
            </label>
            <div className="flex flex-wrap gap-1 max-h-[135px] overflow-y-auto pr-1">
              {FEATURE_OPTIONS.map(feat => {
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
                <span>Yapay Zeka Mimarisi Hesaplanıyor...</span>
              </>
            ) : (
              <>
                <Wand2 size={14} />
                <span>Yapay Zeka Mimari ve Süre Analizini Başlat</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Live Proposal & Architecture Panel (5 cols) - Eye level, NO scrolling needed! */}
        <div ref={resultRef} className="lg:col-span-5 flex flex-col">
          <div className="flex-1 p-3.5 sm:p-4 rounded-2xl bg-black/50 border border-emerald-500/30 flex flex-col justify-between gap-3 shadow-inner">
            <div className="space-y-2.5">
              {/* Header Info */}
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-[11px] font-extrabold text-emerald-400 flex items-center gap-1.5 uppercase font-mono">
                  <Sparkles size={12} /> Teknik Mimari Raporu
                </span>
                {isLoading && (
                  <span className="text-[9px] text-amber-300 font-mono animate-pulse flex items-center gap-1">
                    <RefreshCw size={10} className="animate-spin" /> Güncelleniyor...
                  </span>
                )}
              </div>

              {/* Metric Badges: Duration & Budget */}
              <div className="grid grid-cols-2 gap-1.5">
                <div className="p-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                  <Clock size={14} className="text-emerald-400 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[8px] uppercase font-bold text-white/50">Tahmini Süre</div>
                    <div className="text-[11px] font-bold text-white truncate font-mono">{result?.estimatedWeeks || '1 - 2 Hafta'}</div>
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                  <DollarSign size={14} className="text-emerald-400 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[8px] uppercase font-bold text-white/50">Bütçe Aralığı</div>
                    <div className="text-[11px] font-bold text-emerald-300 truncate font-mono">{result?.budgetRange || '₺5.000 - ₺9.000'}</div>
                  </div>
                </div>
              </div>

              {/* Summary Description */}
              <p className="text-[10px] sm:text-[11px] text-white/80 leading-relaxed font-sans line-clamp-3">
                {result?.summary}
              </p>

              {/* Recommended Stack */}
              <div className="space-y-1">
                <span className="text-[9px] uppercase font-bold text-white/50 tracking-wider">ÖNERİLEN TEKNOLOJİ YIĞINI</span>
                <div className="flex flex-wrap gap-1">
                  {result?.recommendedStack.slice(0, 5).map((tech, idx) => (
                    <span key={idx} className="px-1.5 py-0.5 rounded-md bg-white/10 border border-white/10 text-white font-mono text-[9px] font-bold">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Highlights & Deliverables Tabs / List */}
              <div className="space-y-1">
                <span className="text-[9px] uppercase font-bold text-white/50 tracking-wider flex items-center gap-1">
                  <PackageCheck size={11} className="text-emerald-400" /> KAPSAM & GARANTİ
                </span>
                <div className="space-y-1">
                  {(result?.deliverables || [
                    'Eksiksiz GitHub Kaynak Kodları & Bulut Kurulumu',
                    '30 Gün Ücretsiz Hata & Bakım Garantisi'
                  ]).slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-1 text-[10px] text-white/75">
                      <CheckCircle2 size={10} className="text-emerald-400 shrink-0" />
                      <span className="truncate">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions: Transfer to Contact, Direct Email, Copy */}
            <div className="space-y-1.5 pt-2 border-t border-white/10">
              {/* Primary Action: Transfer to Contact Form */}
              <button
                onClick={handleTransferToForm}
                className="w-full py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-[11px] font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md hover:scale-[1.01]"
              >
                <Send size={12} />
                <span>Bu Mimaride Proje Teklifi Al (İletişim Formuna Aktar)</span>
                <ArrowRight size={12} />
              </button>

              {/* Secondary Options */}
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={handleOpenWhatsApp}
                  className="py-1.5 px-2 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
                  title="WhatsApp'ı açarak teklifi yapıştırır"
                >
                  <Phone size={11} className="text-emerald-400" />
                  <span>WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenDirectEmail}
                  className="py-1.5 px-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-[10px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
                  title="Varsayılan e-posta uygulamasını açar"
                >
                  <Mail size={11} />
                  <span>E-Posta</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyReport}
                  className="py-1.5 px-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-[10px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
                  title="Tüm raporu kopyala"
                >
                  <Copy size={11} />
                  <span>{copied ? 'Kopyalandı!' : 'Kopyala'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

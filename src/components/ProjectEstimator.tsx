import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wand2, Sparkles, CheckCircle2, Clock, Cpu, Send, Layers, ArrowRight, RefreshCw, X } from 'lucide-react';
import { soundEngine } from '../utils/audioSynth';

interface EstimatorResult {
  summary: string;
  estimatedWeeks: string;
  recommendedStack: string[];
  architectureHighlights: string[];
}

interface ProjectEstimatorProps {
  onApplyToContact: (summaryMessage: string) => void;
  onClose?: () => void;
}

const PROJECT_TYPES = [
  { id: 'ai', name: 'Yapay Zeka & LLM Agent', desc: 'Özel eğitilmiş LLM, RAG ve otonom karar verici sistemler', icon: '🤖' },
  { id: 'mobile', name: 'Mobil Uygulama', desc: 'iOS & Android çapraz platform hızlı ve akıcı uygulamalar', icon: '📱' },
  { id: 'web', name: 'Web Platformu / SaaS', desc: 'Sıvı cam arayüzlü, yüksek performanslı tam katmanlı sistem', icon: '🌐' },
  { id: 'automation', name: 'Otomasyon & Veri İşleme', desc: 'Veri madenciliği, botlar ve iş akışı otomasyonları', icon: '⚡' },
  { id: 'psytech', name: 'Bilişsel & Psikoloji Yazılımı', desc: 'Duygu takibi, nöromorfik analiz ve terapi asistanları', icon: '🧠' }
];

const SCALES = [
  { id: 'MVP', label: 'MVP / Hızlı Prototip', desc: 'Fikrinizi hızlıca pazara sunmak için çekirdek sürüm (2-3 Hafta)' },
  { id: 'Orta Ölçek', label: 'Orta Ölçek / Büyüme', desc: 'Zengin modüllü, veritabanlı ve yüksek trafikli sistem (4-6 Hafta)' },
  { id: 'Kurumsal', label: 'Kurumsal / Enterprise', desc: 'Mikroservis mimarisi, yüksek güvenlik ve canlı destek (8+ Hafta)' }
];

const FEATURE_OPTIONS = [
  "Kullanıcı Doğrulama & Auth",
  "Canlı AI Chat / Agent Motoru",
  "Özel Yönetim Paneli (Dashboard)",
  "Ödeme & Abonelik Sistemi",
  "Gerçek Zamanlı Bildirimler & WebSockets",
  "Veri Analitiği & Raporlama",
  "Duygu & Biyometrik Veri Takibi"
];

export function ProjectEstimator({ onApplyToContact, onClose }: ProjectEstimatorProps) {
  const [selectedType, setSelectedType] = useState(PROJECT_TYPES[0].name);
  const [selectedScale, setSelectedScale] = useState(SCALES[0].id);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    "Kullanıcı Doğrulama & Auth",
    "Canlı AI Chat / Agent Motoru"
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<EstimatorResult | null>(null);

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

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({
        summary: `${selectedType} projeniz için ${selectedScale} ölçeğinde ve modern mimaride çözümler hazırlanabilir.`,
        estimatedWeeks: '3 - 5 Hafta',
        recommendedStack: ['React', 'Python FastAPI', 'Gemini API', 'Tailwind CSS'],
        architectureHighlights: ['Yüksek Performanslı Sıvı Arayüz', 'Güvenli Veri Katmanı']
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTransferToForm = () => {
    soundEngine.playGlassClick();
    if (!result) return;

    const messageToPass = `[Akıllı Proje Talebi]
Proje Tipi: ${selectedType}
Ölçek: ${selectedScale}
Seçilen Özellikler: ${selectedFeatures.join(', ')}
Tahmini Süre: ${result.estimatedWeeks}
Önerilen Mimari: ${result.recommendedStack.join(', ')}

Detaylı Açıklama:
${result.summary}`;

    onApplyToContact(messageToPass);
  };

  return (
    <div className="rounded-[2.5rem] liquid-glass-strong p-6 lg:p-8 border border-white/10 shadow-2xl relative select-text space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-black font-bold shadow-lg">
            <Wand2 size={20} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              Akıllı Proje Mimarisi & Bütçe Oluşturucu
              <Sparkles size={16} className="text-emerald-400 animate-pulse" />
            </h2>
            <p className="text-xs text-white/60">
              Hayalinizdeki projenin teknik gereksinimlerini belirleyin, yapay zeka mimarisini çıkarsın.
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-white/70 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-white/10"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Step 1: Project Type Selection */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-white/75 flex items-center gap-1.5">
          <Layers size={14} className="text-emerald-400" /> 1. Proje Kategorisini Seçin
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {PROJECT_TYPES.map(type => (
            <button
              key={type.id}
              onClick={() => {
                soundEngine.playGlassClick();
                setSelectedType(type.name);
              }}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                selectedType === type.name
                  ? 'bg-emerald-500/15 border-emerald-400/80 ring-2 ring-emerald-400/20 shadow-lg'
                  : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl">{type.icon}</span>
                {selectedType === type.name && <CheckCircle2 size={16} className="text-emerald-400" />}
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">{type.name}</h4>
                <p className="text-[10px] text-white/60 mt-1 leading-snug">{type.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: Scale Selection */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-white/75 flex items-center gap-1.5">
          <Clock size={14} className="text-emerald-400" /> 2. Hedef Kapsam ve Ölçek
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {SCALES.map(scale => (
            <button
              key={scale.id}
              onClick={() => {
                soundEngine.playGlassClick();
                setSelectedScale(scale.id);
              }}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                selectedScale === scale.id
                  ? 'bg-emerald-500/15 border-emerald-400/80 ring-2 ring-emerald-400/20 shadow-lg'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <h4 className="text-xs font-extrabold text-white">{scale.label}</h4>
              <p className="text-[10px] text-white/60 mt-1">{scale.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Step 3: Feature Checkboxes */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-white/75 flex items-center gap-1.5">
          <Cpu size={14} className="text-emerald-400" /> 3. İstenen Ana Özellikler
        </label>
        <div className="flex flex-wrap gap-2">
          {FEATURE_OPTIONS.map(feat => {
            const isChecked = selectedFeatures.includes(feat);
            return (
              <button
                key={feat}
                onClick={() => toggleFeature(feat)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-2 ${
                  isChecked
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-md'
                    : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded-md border flex items-center justify-center ${isChecked ? 'border-emerald-400 bg-emerald-400 text-black' : 'border-white/30'}`}>
                  {isChecked && <CheckCircle2 size={12} />}
                </div>
                <span>{feat}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Generate Action Button */}
      <button
        onClick={handleGenerate}
        disabled={isLoading}
        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-black font-extrabold text-sm flex items-center justify-center gap-2.5 shadow-xl hover:shadow-emerald-500/25 transition-all cursor-pointer border border-emerald-300/40 disabled:opacity-50"
      >
        {isLoading ? (
          <>
            <RefreshCw size={16} className="animate-spin" />
            <span>Mimariler Hesaplanıyor...</span>
          </>
        ) : (
          <>
            <Wand2 size={16} />
            <span>Yapay Zeka Mimari ve Süre Analizini Başlat</span>
          </>
        )}
      </button>

      {/* Result Display */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="p-5 rounded-2xl bg-black/40 border border-emerald-500/30 space-y-4 shadow-inner"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-extrabold text-emerald-400 flex items-center gap-1.5 uppercase font-mono">
                <Sparkles size={14} /> Üretilen Teknik Mimari Raporu
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold font-mono">
                Tahmini Süre: {result.estimatedWeeks}
              </span>
            </div>

            <p className="text-xs text-white/90 leading-relaxed font-medium">
              {result.summary}
            </p>

            {/* Recommended Tech Stack Badges */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-white/60 tracking-wider">ÖNERİLEN TEKNOLOJİ YIĞINI</span>
              <div className="flex flex-wrap gap-1.5">
                {result.recommendedStack.map((tech, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 text-white font-mono text-[10px] font-bold">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Architecture Highlights */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-white/60 tracking-wider">MİMARİ SİSTEM AVANTAJLARI</span>
              <ul className="space-y-1">
                {result.architectureHighlights.map((hl, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs text-white/80">
                    <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
                    <span>{hl}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action to Contact Form */}
            <button
              onClick={handleTransferToForm}
              className="w-full py-3 px-4 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md hover:scale-[1.01]"
            >
              <Send size={14} />
              <span>Bu Mimaride Proje Teklifi Al (İletişim Formunu Otomatik Doldur)</span>
              <ArrowRight size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

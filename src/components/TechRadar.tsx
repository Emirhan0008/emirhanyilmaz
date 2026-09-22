import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, Brain, Terminal, Database, Sparkles, ExternalLink, X, Code2 } from 'lucide-react';
import { soundEngine } from '../utils/audioSynth';
import { projects } from '../data';

interface SkillNode {
  id: string;
  name: string;
  category: 'ai' | 'web' | 'data' | 'psy';
  level: number; // 0 - 100
  experience: string;
  description: string;
  relatedProjectIds: string[];
}

const SKILL_NODES: SkillNode[] = [
  // AI & ML
  { id: 'pytorch', name: 'PyTorch / Deep Learning', category: 'ai', level: 75, experience: '1-2 Yıl', description: 'Derin sinir ağları, evrişimli ağlar (CNN) ve model temelleri üzerinde 1-2 yıldır aktif çalışma', relatedProjectIds: ['hece-cizme-forkids', 'ruh-sagligi-portali'] },
  { id: 'llm', name: 'LLM & Gemini API', category: 'ai', level: 82, experience: '1-2 Yıl', description: 'Büyük Dil Modelleri, Gemini API istem mühendisliği, AI Studio ve akıllı otomasyon ajanları', relatedProjectIds: ['evrak-duzenleyici', 'hece-cizme-forkids', 'ruh-sagligi-portali'] },
  { id: 'nlp', name: 'NLP & Metin Analitiği', category: 'ai', level: 74, experience: '1-2 Yıl', description: 'Metin işleme, semantik analiz ve rehberlik dökümanları sınıflandırma algoritmaları', relatedProjectIds: ['evrak-duzenleyici', 'meb-ags-yks'] },
  { id: 'cv', name: 'Görüntü İşleme & OCR', category: 'ai', level: 70, experience: '1 Yıl', description: 'Görüntü optimizasyonu, çizim analizi ve eğitim materyali işleme pratikleri', relatedProjectIds: ['hece-cizme-forkids', 'meb-ags-yks'] },

  // Web & Mobile
  { id: 'python', name: 'Python (Otomasyon & Script)', category: 'web', level: 80, experience: '1-2 Yıl', description: '1-2 yıldır aktif Python: Masaüstü GUI otomasyonları, dosya tasnifi ve veri kazıma araçları', relatedProjectIds: ['evrak-duzenleyici', 'ide-yonetici', 'otonom-yedekleme', 'simcompanies-market'] },
  { id: 'react', name: 'React Native & React', category: 'web', level: 78, experience: '1-2 Yıl', description: 'React Native / Expo ile mobil asistanlar ve React ile web tabanlı yönetim portalları', relatedProjectIds: ['meb-ags-yks', 'hece-cizme-forkids', 'medprep', 'dersgezgin'] },
  { id: 'tailwind', name: 'Tailwind CSS & Tasarım', category: 'web', level: 82, experience: '1-2 Yıl', description: 'Sıvı cam (Liquid Glass) modern arayüzler, mikrobileşenler ve responsive tasarım', relatedProjectIds: ['cv-master', 'dersgezgin', 'zit-kelime-harf'] },

  // Data & Cloud
  { id: 'docker', name: 'Bulut Dağıtım & Hosting', category: 'data', level: 72, experience: '1-2 Yıl', description: 'EAS Cloud APK derleme, Firebase Hosting ve Vercel bulut dağıtım süreçleri', relatedProjectIds: ['dersgezgin', 'zit-kelime-harf', 'hece-cizme-forkids'] },
  { id: 'postgres', name: 'Firebase & Realtime DB', category: 'data', level: 76, experience: '1-2 Yıl', description: 'Firebase Realtime Database ve mobil veri senkronizasyonu mimarisi', relatedProjectIds: ['dersgezgin', 'medprep'] },

  // Psy & UX
  { id: 'cogpsy', name: 'Bilişsel Psikoloji (PDR)', category: 'psy', level: 96, experience: 'Lisans Derecesi', description: 'Bilişsel davranışçı yaklaşım, duygu düzenleme ve insan odaklı pedagojik tasarım', relatedProjectIds: ['hece-cizme-forkids', 'ruh-sagligi-portali'] },
  { id: 'neuromorphic', name: 'Özel Eğitim Metodolojisi', category: 'psy', level: 92, experience: '3 Yıl Saha Deneyimi', description: '1. ve 2. kademe özel eğitim sınıflarında teknoloji destekli BEP uygulamaları', relatedProjectIds: ['hece-cizme-forkids', 'zit-kelime-harf'] }
];

const CATEGORIES = [
  { id: 'all', label: 'Tüm Yetenekler', icon: Sparkles },
  { id: 'ai', label: 'Yapay Zeka & ML', icon: Cpu },
  { id: 'web', label: 'Yazılım & Web', icon: Code2 },
  { id: 'data', label: 'Cloud & Veri', icon: Database },
  { id: 'psy', label: 'Psikoloji & UX', icon: Brain }
];

interface TechRadarProps {
  onSelectProject?: (projId: string) => void;
}

export function TechRadar({ onSelectProject }: TechRadarProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);

  const filteredNodes = SKILL_NODES.filter(node => 
    activeCategory === 'all' || node.category === activeCategory
  );

  return (
    <div className="rounded-[2.5rem] liquid-glass-strong p-6 lg:p-8 border border-white/10 shadow-2xl relative select-text space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            İnteraktif Teknoloji Radarı & Beceri Mimarisi
            <Sparkles size={16} className="text-emerald-400" />
          </h2>
          <p className="text-xs text-white/60 mt-1">
            Teknoloji düğümlerine tıklayarak ilgili projeleri ve uzmanlık detaylarını inceleyin.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  soundEngine.playGlassClick();
                  setActiveCategory(cat.id);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-md'
                    : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                <Icon size={13} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Node Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredNodes.map(node => (
          <motion.div
            key={node.id}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              soundEngine.playGlassClick();
              setSelectedNode(node);
            }}
            className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-400/50 cursor-pointer transition-all space-y-3 group shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-white group-hover:text-emerald-300 transition-colors">
                {node.name}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-white/10 text-[9px] font-mono text-white/70">
                {node.experience}
              </span>
            </div>

            {/* Level Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[9px] text-white/60 font-mono">
                <span>Yetkinlik Düzeyi</span>
                <span className="text-emerald-400 font-bold">%{node.level}</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${node.level}%` }}
                  transition={{ duration: 0.8 }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                />
              </div>
            </div>

            <p className="text-[11px] text-white/75 line-clamp-2 leading-relaxed">
              {node.description}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Selected Node Detail Modal */}
      <AnimatePresence>
        {selectedNode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg rounded-[2rem] liquid-glass-strong border border-emerald-500/30 p-6 space-y-5 relative shadow-2xl bg-zinc-950/95"
            >
              <button
                onClick={() => setSelectedNode(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-white/70 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-white/10"
              >
                <X size={16} />
              </button>

              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-emerald-400 font-mono tracking-wider">
                  TEKNOLOJİ DÜĞÜM DETAYI
                </span>
                <h3 className="text-xl font-extrabold text-white flex items-center justify-between">
                  <span>{selectedNode.name}</span>
                  <span className="text-sm font-mono text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30">
                    %{selectedNode.level} Yetkinlik
                  </span>
                </h3>
                <p className="text-xs text-white/80 leading-relaxed">
                  {selectedNode.description}
                </p>
              </div>

              {/* Related Portfolio Projects */}
              <div className="space-y-3 pt-2 border-t border-white/10">
                <span className="text-xs font-bold text-white/80 uppercase tracking-wider block">
                  İLGİLİ PORTFOLYO PROJELERİ
                </span>
                <div className="space-y-2">
                  {projects
                    .filter(p => selectedNode.relatedProjectIds.includes(p.id))
                    .map(p => (
                      <div
                        key={p.id}
                        className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between group hover:border-emerald-400/40 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <img src={p.image} alt={p.title} className="w-10 h-10 rounded-lg object-cover" />
                          <div>
                            <h5 className="text-xs font-bold text-white">{p.title}</h5>
                            <span className="text-[10px] text-white/60">{p.category}</span>
                          </div>
                        </div>

                        {onSelectProject && (
                          <button
                            onClick={() => {
                              setSelectedNode(null);
                              onSelectProject(p.id);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                          >
                            <span>İncele</span>
                            <ExternalLink size={12} />
                          </button>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

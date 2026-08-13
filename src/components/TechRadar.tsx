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
  { id: 'pytorch', name: 'PyTorch / Deep Learning', category: 'ai', level: 92, experience: '3+ Yıl', description: 'Derin sinir ağları, evrişimli ağlar (CNN) ve doğal dil işleme modelleri mimarisi', relatedProjectIds: ['1', '2'] },
  { id: 'llm', name: 'LLM & Autonomous Agents', category: 'ai', level: 95, experience: '2+ Yıl', description: 'Otonom yapay zeka ajanları, RAG (Retrieval-Augmented Generation) ve istem mühendisliği', relatedProjectIds: ['3', '1'] },
  { id: 'nlp', name: 'NLP & Duygu Analizi', category: 'ai', level: 90, experience: '3+ Yıl', description: 'Metin analizi, semantik arama ve duygu durumu sınıflandırma sistemleri', relatedProjectIds: ['1', '4'] },
  { id: 'cv', name: 'Computer Vision & OpenCV', category: 'ai', level: 85, experience: '2+ Yıl', description: 'Görüntü işleme, yüz ve duygu tespiti, nesne tanıma algoritmaları', relatedProjectIds: ['2'] },

  // Web & Mobile
  { id: 'python', name: 'Python (FastAPI & Flask)', category: 'web', level: 96, experience: '4+ Yıl', description: 'Yüksek performanslı, asenkron REST & WebSocket API mimarileri', relatedProjectIds: ['1', '3', '4'] },
  { id: 'react', name: 'React & TypeScript', category: 'web', level: 92, experience: '3+ Yıl', description: 'Sıvı cam (Liquid Glass) tasarımlar, modüler ön yüzler ve asenkron durum yönetimi', relatedProjectIds: ['1', '2', '3', '5'] },
  { id: 'tailwind', name: 'Tailwind CSS & Motion', category: 'web', level: 95, experience: '3+ Yıl', description: 'Gelişmiş akıcı arayüzler, mikrobileşen animasyonları ve duyarlı tasarım', relatedProjectIds: ['1', '2', '3', '4', '5'] },

  // Data & Cloud
  { id: 'docker', name: 'Docker & Cloud Run', category: 'data', level: 88, experience: '2+ Yıl', description: 'Konteynerleştirme, sunucusuz dağıtım ve mikroservis yönetimi', relatedProjectIds: ['3', '5'] },
  { id: 'postgres', name: 'PostgreSQL & MongoDB', category: 'data', level: 85, experience: '3+ Yıl', description: 'İlişkisel ve NoSQL veritabanı modellemesi, indeksleme ve optimize sorgular', relatedProjectIds: ['1', '3'] },

  // Psy & UX
  { id: 'cogpsy', name: 'Bilişsel Psikoloji (PDR)', category: 'psy', level: 98, experience: 'Lisans & Uzmanlık', description: 'Bilişsel davranışçı yaklaşım, duygu düzenleme ve insan odaklı etkileşim tasarımı', relatedProjectIds: ['1', '2'] },
  { id: 'neuromorphic', name: 'Nöromorfik & Stres Takibi', category: 'psy', level: 88, experience: 'Araştırma', description: 'Biyometrik verilerin ve stres parametrelerinin yapay zeka ile analizi', relatedProjectIds: ['2'] }
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

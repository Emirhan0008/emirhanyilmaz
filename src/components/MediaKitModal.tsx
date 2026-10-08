import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Brain, Mic, Users, Copy, Check, ExternalLink, Mail, Award, Download, ArrowRight } from 'lucide-react';

interface MediaKitModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'tr' | 'en';
  onSelectIntent: (intent: 'job' | 'freelance' | 'speaking' | 'collaboration') => void;
}

export const MediaKitModal: React.FC<MediaKitModalProps> = ({
  isOpen,
  onClose,
  lang,
  onSelectIntent
}) => {
  const [copiedBio, setCopiedBio] = useState(false);

  if (!isOpen) return null;

  const bioText = lang === 'tr'
    ? "Emirhan YILMAZ — Aksaray Üniversitesi PDR (Rehberlik ve Psikolojik Danışmanlık) mezunu ve Marmara Üniversitesi Yapay Zeka ve Makine Öğrenmesi sertifikalı yazılım mimarı. 3 yıllık özel eğitim saha tecrübesiyle, bilişsel psikoloji ilkelerini çok modlu yapay zeka (Gemini Vision / LLM), Python sistem otomasyonları ve modern web/mobil mimarileriyle birleştirerek insan odaklı dijital ürünler geliştirmektedir."
    : "Emirhan YILMAZ — Graduate of Aksaray University in Guidance & Psychological Counseling (GPC) with AI & Machine Learning certification from Marmara University. Combining 3 years of classroom special education with multimodal AI (Gemini Vision / LLMs), Python automations, and modern web/mobile stacks to build human-centered digital architectures.";

  const handleCopyBio = () => {
    navigator.clipboard.writeText(bioText);
    setCopiedBio(true);
    setTimeout(() => setCopiedBio(false), 2500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[180] flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-3xl my-6 bg-zinc-950/95 border border-emerald-500/30 rounded-3xl p-5 sm:p-7 text-white shadow-2xl relative overflow-hidden select-text"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

          {/* Header */}
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10 relative z-10">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20 shrink-0">
                <img
                  src="/profile-photo.jpg"
                  alt="Emirhan Yılmaz"
                  className="w-full h-full object-cover rounded-[14px]"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/logo.png';
                  }}
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-extrabold font-mono">
                    {lang === 'tr' ? 'RESMİ MEDYA KİTİ & BASIN BİLGİLERİ' : 'OFFICIAL MEDIA KIT & SPEAKER PROFILE'}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-extrabold border border-emerald-500/30">
                    2026 Edition
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white">Emirhan Yılmaz</h3>
                <p className="text-xs text-white/70 font-medium">
                  {lang === 'tr' ? 'PDR (Psikolojik Danışmanlık) & Yapay Zeka Mimarisi' : 'Counseling Psychology & AI Architecture'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center transition-all border border-white/10 cursor-pointer shrink-0"
              title={lang === 'tr' ? 'Kapat' : 'Close'}
            >
              <X size={16} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="space-y-4 pt-4 relative z-10 max-h-[70vh] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/20">
            {/* Quick Bio Card */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                  <Brain size={12} /> {lang === 'tr' ? 'RESMİ BİYOGRAFİ & KONUMLANDIRMA' : 'OFFICIAL BIO & POSITIONING'}
                </span>
                <button
                  type="button"
                  onClick={handleCopyBio}
                  className="text-[10px] text-emerald-300 hover:text-emerald-200 font-bold flex items-center gap-1 bg-white/10 px-2 py-1 rounded-lg transition-all cursor-pointer"
                >
                  {copiedBio ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                  <span>{copiedBio ? (lang === 'tr' ? 'Kopyalandı!' : 'Copied!') : (lang === 'tr' ? 'Biyografiyi Kopyala' : 'Copy Bio')}</span>
                </button>
              </div>
              <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-normal">
                {bioText}
              </p>
            </div>

            {/* Key Speaker & Keynote Topics */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                <Mic size={12} /> {lang === 'tr' ? 'KONUŞMA, SEMİNER VE ATÖLYE BAŞLIKLARI' : 'KEYNOTE & WORKSHOP TOPICS'}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-colors space-y-1">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Sparkles size={13} className="text-emerald-400 shrink-0" />
                    <span>{lang === 'tr' ? 'Bilişsel Yük & Yapay Zeka' : 'Cognitive Ergonomics in AI'}</span>
                  </div>
                  <p className="text-[11px] text-white/75 leading-relaxed">
                    {lang === 'tr' 
                      ? 'PDR ilkeleriyle bilişsel aşırı yükü sıfırlayan insan merkezli yapay zeka arayüzleri.' 
                      : 'Reducing anxiety & cognitive fatigue with psychology-grounded AI interfaces.'}
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-colors space-y-1">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Users size={13} className="text-sky-400 shrink-0" />
                    <span>{lang === 'tr' ? 'Özel Eğitim & Vision Modelleri' : 'Special Ed & Multimodal AI'}</span>
                  </div>
                  <p className="text-[11px] text-white/75 leading-relaxed">
                    {lang === 'tr' 
                      ? 'Disleksi, otizm ve konuşma güçlüğünde Gemini Vision & AAC teknolojilerinin rolü.' 
                      : 'Empowering neurodiverse learners with Gemini Vision and tactile audio interfaces.'}
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-colors space-y-1">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Award size={13} className="text-amber-400 shrink-0" />
                    <span>{lang === 'tr' ? 'Hızlı MVP & Otomasyon' : 'Fast MVPs & Automations'}</span>
                  </div>
                  <p className="text-[11px] text-white/75 leading-relaxed">
                    {lang === 'tr' 
                      ? 'Erken aşama startup ve ekipler için sıfırdan çalışan yapay zeka MVP mimarileri.' 
                      : 'Rapid product engineering from conceptual PRD to working cloud deployment.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 text-center">
                <span className="text-[10px] text-white/60 font-mono block">{lang === 'tr' ? 'Saha Tecrübesi' : 'Field Exp'}</span>
                <span className="text-sm font-extrabold text-emerald-400">3 Yıl (Özel Eğitim)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 text-center">
                <span className="text-[10px] text-white/60 font-mono block">{lang === 'tr' ? 'Geliştirilen Proje' : 'Projects Built'}</span>
                <span className="text-sm font-extrabold text-teal-400">30+ Portfolyo</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 text-center">
                <span className="text-[10px] text-white/60 font-mono block">{lang === 'tr' ? 'Uzmanlık' : 'Core Focus'}</span>
                <span className="text-sm font-extrabold text-sky-400">PDR x AI</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 text-center">
                <span className="text-[10px] text-white/60 font-mono block">{lang === 'tr' ? 'Konum' : 'Location'}</span>
                <span className="text-sm font-extrabold text-emerald-300">Türkiye / Uzaktan</span>
              </div>
            </div>

            {/* Direct Collaboration CTA */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-teal-950/40 to-black border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4">
              <div className="space-y-0.5 text-center sm:text-left">
                <h4 className="text-sm font-extrabold text-white">
                  {lang === 'tr' ? 'Bir Etkinlik veya İş Birliği mi Planlıyorsunuz?' : 'Planning an Event or Joint Campaign?'}
                </h4>
                <p className="text-xs text-white/80">
                  {lang === 'tr' 
                    ? 'Konuşma davetleri, sponsorluk veya marka iş birlikleri için doğrudan formu kullanabilirsiniz.' 
                    : 'Dispatch keynotes, panel invitations, or sponsorship inquiries directly.'}
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onSelectIntent('speaking');
                  }}
                  className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-emerald-500/20"
                >
                  <Mic size={14} />
                  <span>{lang === 'tr' ? 'Konuşma Daveti Gönder' : 'Invite as Speaker'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onSelectIntent('collaboration');
                  }}
                  className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <ArrowRight size={14} />
                  <span>{lang === 'tr' ? 'İş Birliği Başlat' : 'Start Partnership'}</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

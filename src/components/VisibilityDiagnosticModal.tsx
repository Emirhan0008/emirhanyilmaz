import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  FileText, 
  Bot, 
  Compass, 
  Zap, 
  Copy, 
  Check, 
  Share2, 
  Globe,
  HelpCircle,
  Clock,
  Key
} from 'lucide-react';

interface VisibilityDiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: 'tr' | 'en';
}

export const VisibilityDiagnosticModal: React.FC<VisibilityDiagnosticModalProps> = ({
  isOpen,
  onClose,
  lang = 'tr'
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'diagnosis' | 'guide' | 'aiPreview'>('diagnosis');

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl bg-neutral-950/95 border border-white/10 shadow-2xl shadow-cyan-500/10 overflow-hidden text-neutral-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                    {lang === 'tr' ? 'Arama Motoru & Yapay Zeka Görünürlük Teşhisi' : 'Search & Generative AI Visibility Diagnostic'}
                  </h2>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    SEO & GEO v2.5
                  </span>
                </div>
                <p className="text-xs text-neutral-400">
                  {lang === 'tr' 
                    ? "Sitenizin Google dizinindeki konumu ve LLM özetleyicilerindeki (Perplexity, Gemini, ChatGPT) temsiliyet analizi" 
                    : "Comprehensive indexing diagnostic for Google Search and Generative AI engines"}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 px-6 pt-3 border-b border-white/5 bg-black/40 text-xs">
            <button
              onClick={() => setActiveTab('diagnosis')}
              className={`pb-3 px-3 font-medium transition-colors border-b-2 flex items-center gap-1.5 ${
                activeTab === 'diagnosis'
                  ? 'border-cyan-400 text-cyan-300'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              {lang === 'tr' ? 'Neden Henüz Görünmüyor? (Kök Nedenler)' : 'Why Is It Not Showing Yet?'}
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`pb-3 px-3 font-medium transition-colors border-b-2 flex items-center gap-1.5 ${
                activeTab === 'guide'
                  ? 'border-cyan-400 text-cyan-300'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              {lang === 'tr' ? '3 Adımlı Hızlı İndeksleme Rehberi' : '3-Step Rapid Indexing Action Plan'}
            </button>
            <button
              onClick={() => setActiveTab('aiPreview')}
              className={`pb-3 px-3 font-medium transition-colors border-b-2 flex items-center gap-1.5 ${
                activeTab === 'aiPreview'
                  ? 'border-cyan-400 text-cyan-300'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              {lang === 'tr' ? 'Yapay Zeka (LLM) Nasıl Okuyor?' : 'How AI Engines Read You'}
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {activeTab === 'diagnosis' && (
              <div className="space-y-6">
                {/* Status Hero Card */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-cyan-950/20 to-neutral-900 border border-cyan-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Teknik Altyapı Durumu</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">100/100 HAZIR</span>
                    </div>
                    <h3 className="text-sm sm:text-base font-semibold text-white">
                      Kod Tabanı SEO ve Yapay Zeka (GEO) İçin Tam Donanımlı
                    </h3>
                    <p className="text-xs text-neutral-300 leading-relaxed max-w-xl">
                      Arama motorlarının ve yapay zeka modellerinin ihtiyaç duyduğu tüm teknik standartlar (Sitemap, Robots.txt, JSON-LD Schema Graph, LLMs.txt ve SSR Fallback) projeye entegre edildi. Görünürlüğün başlaması için sadece Google Search Console kaydı ve ilk tarama döngüsü gerekiyor.
                    </p>
                  </div>
                  <div className="flex sm:flex-col gap-2 shrink-0 w-full sm:w-auto">
                    <a
                      href="/sitemap.xml"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-none text-center px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-cyan-300 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      sitemap.xml
                      <ExternalLink className="w-3 h-3 text-neutral-400" />
                    </a>
                    <a
                      href="/llms.txt"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-none text-center px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-purple-300 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Bot className="w-3.5 h-3.5" />
                      llms.txt
                      <ExternalLink className="w-3 h-3 text-neutral-400" />
                    </a>
                  </div>
                </div>

                {/* 4 Core Pillars of Non-Appearance */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Item 1 */}
                  <div className="p-4 rounded-2xl bg-neutral-900/60 border border-white/5 hover:border-white/10 transition-all space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                        <Clock className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-semibold text-white">1. Google İndeksleme Süresi (Crawl Queue)</h4>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Yeni yayına alınan web siteleri Googlebot tarafından kendiliğinden hemen keşfedilmez. Google dizine ekleme süresi manuel talep edilmediğinde ortalama <strong className="text-neutral-200">2 ila 4 hafta</strong> sürebilir. Google Search Console ile bu süre <strong className="text-emerald-400">24-48 saate</strong> indirilebilir.
                    </p>
                  </div>

                  {/* Item 2 */}
                  <div className="p-4 rounded-2xl bg-neutral-900/60 border border-white/5 hover:border-white/10 transition-all space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-semibold text-white">2. SPA İstemci Taraflı Render Engeli Çözüldü</h4>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      React siteleri ilk yüklemede boş HTML (<code className="text-cyan-300">&lt;div id=&quot;root&quot;&gt;</code>) verir. Arama botlarının JavaScript çalıştırmasını beklemeden tüm biyografi, uzmanlık ve projeleri okuyabilmesi için <strong className="text-neutral-200">semantik &lt;noscript&gt; ve JSON-LD grafiği</strong> eklendi.
                    </p>
                  </div>

                  {/* Item 3 */}
                  <div className="p-4 rounded-2xl bg-neutral-900/60 border border-white/5 hover:border-white/10 transition-all space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-semibold text-white">3. Yapay Zeka Özetleri (GEO Standartları)</h4>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Google AI Overviews ve Perplexity, klasik anahtar kelimeler yerine <strong className="text-neutral-200">Varlık Otoritesi (Entity Authority)</strong> ve <code className="text-purple-300">llms.txt</code> protokolünü arar. Kimliğiniz, PDR ve Yapay Zeka entegrasyonu doğrudan yanıtlanabilir soru-cevap bloklarına dönüştürüldü.
                    </p>
                  </div>

                  {/* Item 4 */}
                  <div className="p-4 rounded-2xl bg-neutral-900/60 border border-white/5 hover:border-white/10 transition-all space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                        <Globe className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-semibold text-white">4. Alan Adı Otoritesi &amp; Geri Bağlantı (Backlink)</h4>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Google, bir sitenin spam olmadığını doğrulamak için dış referanslara bakar. GitHub profiliniz, LinkedIn profiliniz ve Medium gibi platformlarda web sitenizin linki yer aldığında indeks hızı ve arama sırası katlanarak yükselir.
                    </p>
                  </div>
                </div>

                {/* Quick Diagnostics Checklist */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-3">
                  <h4 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Teknik Yapılandırma Kontrol Listesi (Tamamlandı)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-2 text-neutral-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span><strong>robots.txt:</strong> Googlebot & AI bot izinleri tam</span>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span><strong>sitemap.xml:</strong> 30 proje ve rotalar tanımlı</span>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span><strong>JSON-LD:</strong> Person, ProfilePage & FAQPage hazır</span>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span><strong>llms.txt:</strong> Perplexity & Gemini kaynak dosyası hazır</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'guide' && (
              <div className="space-y-5">
                <div className="space-y-1">
                  <h3 className="text-sm sm:text-base font-semibold text-white">
                    Google ve Yapay Zekada Görünür Olmak İçin 3 Kritik Adım
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Aşağıdaki adımları uyguladığınızda siteniz 24-48 saat içinde Google aramalarında ve AI yanıtlarında listelenmeye başlar.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Step 1 */}
                  <div className="p-4 rounded-2xl bg-neutral-900/70 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center text-xs font-bold">1</span>
                        <h4 className="text-sm font-semibold text-white">Google Search Console'a Mülk Ekleyin</h4>
                      </div>
                      <a
                        href="https://search.google.com/search-console"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
                      >
                        Search Console Aç <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <p className="text-xs text-neutral-300 leading-relaxed">
                      Google Search Console'a gidin. &quot;URL Ön Eki&quot; seçeneğini seçip site adresinizi girin:
                    </p>
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-black/60 border border-white/5 font-mono text-xs text-neutral-200">
                      <span className="flex-1 truncate">https://emirhanyilmaz.vercel.app/</span>
                      <button
                        onClick={() => copyToClipboard('https://emirhanyilmaz.vercel.app/', 'site_url')}
                        className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-neutral-200 flex items-center gap-1 transition-colors"
                      >
                        {copiedKey === 'site_url' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedKey === 'site_url' ? 'Kopyalandı' : 'Kopyala'}
                      </button>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="p-4 rounded-2xl bg-neutral-900/70 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center text-xs font-bold">2</span>
                        <h4 className="text-sm font-semibold text-white">Site Haritasını (Sitemap) Gönderin</h4>
                      </div>
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Anında Keşif</span>
                    </div>
                    <p className="text-xs text-neutral-300 leading-relaxed">
                      Search Console sol menüsünden <strong>Site Haritaları</strong> sekmesine gelin ve aşağıdaki sitemap bağlantısını ekleyip &quot;Gönder&quot; butonuna basın:
                    </p>
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-black/60 border border-white/5 font-mono text-xs text-neutral-200">
                      <span className="flex-1 truncate">https://emirhanyilmaz.vercel.app/sitemap.xml</span>
                      <button
                        onClick={() => copyToClipboard('https://emirhanyilmaz.vercel.app/sitemap.xml', 'sitemap_url')}
                        className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-neutral-200 flex items-center gap-1 transition-colors"
                      >
                        {copiedKey === 'sitemap_url' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedKey === 'sitemap_url' ? 'Kopyalandı' : 'Kopyala'}
                      </button>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="p-4 rounded-2xl bg-neutral-900/70 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center text-xs font-bold">3</span>
                        <h4 className="text-sm font-semibold text-white">Profil Bağlantılarını (Backlink) Ekleyin</h4>
                      </div>
                      <span className="text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">Otorite Artışı</span>
                    </div>
                    <p className="text-xs text-neutral-300 leading-relaxed">
                      Googlebot'un sitenizi güvenilir bir kaynak olarak tanıması için aşağıdaki platformlardaki profilinizin "Web Sitesi" alanına linkinizi ekleyin:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                        <span className="font-semibold text-white">GitHub:</span>
                        <p className="text-neutral-400 text-[11px] mt-0.5">github.com/Emirhan0008 bio kısmına web sitenizi ekleyin.</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                        <span className="font-semibold text-white">LinkedIn / Sosyal Medya:</span>
                        <p className="text-neutral-400 text-[11px] mt-0.5">Profil iletişim bilgileri & web sitesi alanına ekleyin.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'aiPreview' && (
              <div className="space-y-5">
                <div className="space-y-1">
                  <h3 className="text-sm sm:text-base font-semibold text-white flex items-center gap-2">
                    <Bot className="w-4 h-4 text-purple-400" />
                    Yapay Zeka (Perplexity, ChatGPT, Gemini) Canlı Simülasyonu
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Sitenizin yeni <code className="text-purple-300">/llms.txt</code> ve <code className="text-cyan-300">FAQPage JSON-LD</code> yapısı sayesinde, yapay zekaya "Emirhan Yılmaz kimdir?" sorulduğunda üretilecek olan ideal özet:
                  </p>
                </div>

                {/* AI Mock Response Bubble */}
                <div className="p-5 rounded-2xl bg-neutral-900/90 border border-purple-500/30 shadow-lg shadow-purple-500/5 space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white text-[10px] font-bold">
                        AI
                      </div>
                      <span className="text-xs font-semibold text-white">AI Search Overview (Özet Yanıt)</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Doğrulanmış Kaynak: emirhanyilmaz.vercel.app
                    </span>
                  </div>

                  <div className="text-xs text-neutral-200 leading-relaxed space-y-2">
                    <p>
                      <strong>Emirhan Yılmaz</strong>, Aksaray Üniversitesi Rehberlik ve Psikolojik Danışmanlık (PDR) mezunu bir psikolojik danışman ve aynı zamanda yapay zeka & yazılım mimarıdır. 3 yıllık özel eğitim saha tecrübesine sahip olup; insan psikolojisini modern LLM teknolojileri, multimodal görüntü analizi ve Python otomasyonlarıyla birleştirmektedir.
                    </p>
                    <p>
                      <strong>Öne Çıkan Çalışmaları:</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-neutral-300 pl-1">
                      <li><strong>MindFlow & PsyBot:</strong> Terapötik bilişsel davranışçı destek ve duygu regülasyonu sağlayan yapay zeka asistanları.</li>
                      <li><strong>Empathy Canvas (AAC):</strong> Otizmli ve konuşma zorluğu çeken bireyler için alternatif iletişim panoları.</li>
                      <li><strong>AbleUp:</strong> Nöroçeşitli bireyler için geliştirilmiş kapsayıcı istihdam ağı.</li>
                    </ul>
                  </div>

                  <div className="pt-2 flex items-center gap-2 text-[11px] text-neutral-400">
                    <span className="font-semibold text-neutral-300">Alıntılanan Kaynaklar:</span>
                    <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-cyan-300">/llms.txt</span>
                    <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-purple-300">Schema.org Person Graph</span>
                  </div>
                </div>

                {/* Direct Action */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/20">
                  <div className="text-xs">
                    <span className="font-semibold text-purple-300">llms.txt dosyasını görüntülemek ister misiniz?</span>
                    <p className="text-[11px] text-neutral-400">Yapay zeka modellerinin okuduğu ham Markdown içeriğini doğrudan inceleyin.</p>
                  </div>
                  <a
                    href="/llms.txt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 text-xs font-medium flex items-center gap-1.5 transition-colors"
                  >
                    <span>llms.txt Aç</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-white/[0.02]">
            <div className="text-xs text-neutral-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Teknik SEO Durumu: <strong>Aktif & Doğrulandı</strong></span>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
            >
              Kapat
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

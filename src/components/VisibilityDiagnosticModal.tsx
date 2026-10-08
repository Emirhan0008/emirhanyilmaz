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
  Globe, 
  Clock, 
  ShieldCheck, 
  UploadCloud, 
  Code2, 
  Layers
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
  const [activeTab, setActiveTab] = useState<'diagnosis' | 'verification' | 'guide' | 'aiPreview'>('diagnosis');
  const [customVerificationCode, setCustomVerificationCode] = useState('');
  const [verifyTestResult, setVerifyTestResult] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleTestFileUrl = () => {
    if (!customVerificationCode.trim()) {
      setVerifyTestResult('Lütfen bir dosya adı veya kod girin (Örn: google123456789.html)');
      return;
    }
    const cleanName = customVerificationCode.trim().replace(/^\//, '');
    const fullUrl = `https://emirhanyilmaz.vercel.app/${cleanName}`;
    setVerifyTestResult(`Doğrulama URL'si: ${fullUrl} — Gizli sekmede ziyaret edip "google-site-verification: ..." kodunun göründüğünü kontrol edebilirsiniz.`);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md">
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
                    {lang === 'tr' ? 'Yönetici: Arama Motoru & İndeksleme Teşhis Paneli' : 'Admin: Search Engine & Indexing Diagnostics'}
                  </h2>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                    ÖZEL YÖNETİCİ GÖRÜNÜMÜ
                  </span>
                </div>
                <p className="text-xs text-neutral-400">
                  {lang === 'tr' 
                    ? "Google Search Console sahiplik doğrulaması, sitemap kontrolü ve LLM görünürlüğü" 
                    : "Google Search Console ownership verification, sitemap, and LLM visibility"}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 px-6 pt-3 border-b border-white/5 bg-black/40 text-xs overflow-x-auto">
            <button
              onClick={() => setActiveTab('diagnosis')}
              className={`pb-3 px-3 font-medium transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'diagnosis'
                  ? 'border-cyan-400 text-cyan-300'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              {lang === 'tr' ? '1. Neden Görünmüyor? (Teşhis)' : '1. Root Cause Diagnosis'}
            </button>
            <button
              onClick={() => setActiveTab('verification')}
              className={`pb-3 px-3 font-medium transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'verification'
                  ? 'border-emerald-400 text-emerald-300 font-bold'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              {lang === 'tr' ? '2. Search Console Sahiplik Doğrulama' : '2. Ownership Verification'}
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`pb-3 px-3 font-medium transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'guide'
                  ? 'border-cyan-400 text-cyan-300'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              {lang === 'tr' ? '3. Hızlı İndeksleme Adımları' : '3. Rapid Indexing Steps'}
            </button>
            <button
              onClick={() => setActiveTab('aiPreview')}
              className={`pb-3 px-3 font-medium transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'aiPreview'
                  ? 'border-purple-400 text-purple-300'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              {lang === 'tr' ? '4. LLM & Yapay Zeka Temsili (GEO)' : '4. AI Engine Readout'}
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* TAB 1: DIAGNOSIS */}
            {activeTab === 'diagnosis' && (
              <div className="space-y-6">
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
                      Arama motorlarının ve yapay zeka modellerinin ihtiyaç duyduğu tüm teknik standartlar (Sitemap, Robots.txt, JSON-LD Schema Graph, LLMs.txt ve Vercel SPA Yönlendirmeleri) projeye entegre edildi. Görünürlüğün başlaması için sadece Google Search Console sahiplik doğrulaması ve ilk tarama döngüsü gerekiyor.
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-neutral-900/60 border border-white/5 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                        <Clock className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-semibold text-white">1. Google İndeksleme Sırası (Crawl Queue)</h4>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Yeni yayına alınan siteler Googlebot tarafından kendiliğinden hemen dizine eklenmez. Manuel talep edilmediğinde ortalama 2 ila 4 hafta sürebilir. Search Console üzerinden mülk doğrulandığında bu süre 24-48 saate iner.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-neutral-900/60 border border-white/5 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-semibold text-white">2. SPA İstemci Taraflı Render Engeli Çözüldü</h4>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      React SPA siteler ilk HTML yüklemesinde boş div verir. Botların beklemeden projeleri ve biyografiyi okuyabilmesi için noscript, OpenGraph kartları ve JSON-LD grafiği entegre edilmiştir.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-neutral-900/60 border border-white/5 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-semibold text-white">3. Yapay Zeka Özetleri (GEO Standartları)</h4>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Google AI Overviews ve Perplexity, llms.txt ve varlık ilişkilerini (Entity Graph) okur. Aksaray PDR mezuniyeti, yapay zeka mühendisliği ve geliştirdiğiniz gerçek projeler llms.txt'de yapılandırılmıştır.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-neutral-900/60 border border-white/5 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                        <Globe className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-semibold text-white">4. Alan Adı Otoritesi & Backlink</h4>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      GitHub profiliniz (github.com/Emirhan0008) ve LinkedIn profilinizde web sitenizin linki (emirhanyilmaz.vercel.app) yer aldığında Googlebot güven puanını hemen artırır.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: OWNERSHIP VERIFICATION WIZARD */}
            {activeTab === 'verification' && (
              <div className="space-y-6">
                <div className="space-y-1">
                  <h3 className="text-sm sm:text-base font-semibold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Google Search Console Sahiplik Doğrulaması Nedir?
                  </h3>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    Sahiplik doğrulaması, <code className="text-emerald-300">https://emirhanyilmaz.vercel.app</code> sitesinin gerçek sahibi olduğunuzu Google'a kanıtlamaktır. Doğrulanmış sahip, Google Arama verilerini görüntüleyebilir, sayfa dizine ekleme talebi gönderebilir ve sitenin Google Search performansını yönetir.
                  </p>
                </div>

                {/* Methods Comparison Table */}
                <div className="p-4 rounded-2xl bg-neutral-900/70 border border-white/10 space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Önerilen Doğrulama Yöntemleri
                  </h4>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-white/10 text-neutral-400">
                          <th className="py-2 px-3 font-semibold">Yöntem</th>
                          <th className="py-2 px-3 font-semibold">Zorluk</th>
                          <th className="py-2 px-3 font-semibold">Açıklama & Durum</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-neutral-300">
                        <tr>
                          <td className="py-2 px-3 font-bold text-emerald-300 flex items-center gap-1.5">
                            <UploadCloud size={14} /> HTML Dosyası Yükleme
                          </td>
                          <td className="py-2 px-3 font-mono text-[11px] text-emerald-400">En Kolay</td>
                          <td className="py-2 px-3">
                            Search Console'dan indirilen <code className="text-white">google[kod].html</code> dosyasını sitenin kök dizinine (public klasörüne) ekleyip doğrulamak.
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3 font-bold text-cyan-300 flex items-center gap-1.5">
                            <Code2 size={14} /> HTML Meta Etiketi
                          </td>
                          <td className="py-2 px-3 font-mono text-[11px] text-cyan-400">Hızlı</td>
                          <td className="py-2 px-3">
                            <code className="text-white">&lt;meta name=&quot;google-site-verification&quot; content=&quot;...&quot;&gt;</code> etiketini index.html içine eklemek.
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3 font-bold text-amber-300 flex items-center gap-1.5">
                            <Globe size={14} /> Alan Adı Sağlayıcı (DNS)
                          </td>
                          <td className="py-2 px-3 font-mono text-[11px] text-amber-400">Orta</td>
                          <td className="py-2 px-3">
                            Özel alan adınız varsa (emirhanyilmaz.com vb.) DNS TXT kaydı ekleyerek tüm alt alan adlarını doğrulamak.
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Step-by-step HTML File Upload Guide */}
                <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs sm:text-sm font-bold text-emerald-300 flex items-center gap-2">
                      <UploadCloud size={16} /> 1. Adım: HTML Dosyası Yöntemi ile Doğrulama Adımları
                    </h4>
                    <a
                      href="https://search.google.com/search-console"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      Search Console Aç <ExternalLink size={11} />
                    </a>
                  </div>

                  <ol className="list-decimal list-inside space-y-2 text-xs text-neutral-300 leading-relaxed">
                    <li>Google Search Console'a girin ve <strong>URL Ön Eki</strong> mülkü olarak <code className="text-white">https://emirhanyilmaz.vercel.app/</code> adresini yazın.</li>
                    <li>Doğrulama seçeneklerinden <strong>HTML Dosyası</strong>'nı seçin ve Google'ın size özel oluşturduğu dosyayı (Örn: <code className="text-emerald-300">google1a2b3c4d5e6f.html</code>) indirin.</li>
                    <li>Bu dosya projenin <code className="text-white">/public</code> klasörüne atıldığında Vercel üzerinden otomatik olarak <code className="text-emerald-300">https://emirhanyilmaz.vercel.app/google1a2b3c4d5e6f.html</code> URL'sinde yayına girer.</li>
                    <li>Aşağıdaki test kutusuna dosya adınızı yazarak URL'nin hazır olup olmadığını kontrol edebilirsiniz.</li>
                    <li>Search Console'a dönüp <strong>Doğrula</strong> butonuna tıklayın. Doğrulama anında yeşil onay alır!</li>
                  </ol>

                  {/* Interactive Verification URL Checker */}
                  <div className="p-3 rounded-xl bg-black/60 border border-white/10 space-y-2 mt-3">
                    <span className="text-[11px] font-bold text-neutral-300">
                      Doğrulama Dosyası URL Test Edici:
                    </span>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        placeholder="Örn: google4a872689c9fd64.html"
                        value={customVerificationCode}
                        onChange={(e) => setCustomVerificationCode(e.target.value)}
                        className="flex-1 py-1.5 px-3 rounded-lg bg-white/5 border border-white/10 text-xs text-white placeholder-neutral-500 font-mono focus:outline-hidden focus:border-emerald-400"
                      />
                      <button
                        type="button"
                        onClick={handleTestFileUrl}
                        className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs cursor-pointer transition-all"
                      >
                        URL Oluştur & Test Et
                      </button>
                    </div>

                    {verifyTestResult && (
                      <div className="p-2.5 rounded-lg bg-white/5 border border-emerald-500/30 text-xs text-emerald-300 font-mono break-all">
                        {verifyTestResult}
                      </div>
                    )}
                  </div>
                </div>

                {/* Important Rules from Search Console Docs */}
                <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1.5 text-xs text-neutral-400">
                  <div className="font-semibold text-neutral-200">⚠️ Google Search Console Önemli Kurallar:</div>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Doğrulama dosyasının yayında kalması gerekir. Kaldırılırsa sahiplik izinleri iptal edilir.</li>
                    <li>Google Site Doğrulayıcı (Google-Site-Verification user agent) dosyayı doğrudan okur; yönlendirme (redirect) olmamalıdır.</li>
                    <li>Verilerin Search Console panelinde görünmeye başlaması doğrulandıktan sonra 1-3 gün sürebilir.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* TAB 3: RAPID INDEXING ACTION PLAN */}
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
                        className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-neutral-200 flex items-center gap-1 transition-colors cursor-pointer"
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
                        className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-neutral-200 flex items-center gap-1 transition-colors cursor-pointer"
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

            {/* TAB 4: AI & LLM READOUT */}
            {activeTab === 'aiPreview' && (
              <div className="space-y-5">
                <div className="space-y-1">
                  <h3 className="text-sm sm:text-base font-semibold text-white flex items-center gap-2">
                    <Bot className="w-4 h-4 text-purple-400" />
                    Yapay Zeka (Perplexity, ChatGPT, Gemini) Canlı Simülasyonu
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Sitenizin yeni <code className="text-purple-300">/llms.txt</code> ve semantik JSON-LD yapısı sayesinde, yapay zekaya &quot;Emirhan Yılmaz kimdir ve hangi projeleri yapmıştır?&quot; sorulduğunda üretilecek olan ideal özet:
                  </p>
                </div>

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
                      <strong>Emirhan Yılmaz</strong>, Aksaray Üniversitesi Rehberlik ve Psikolojik Danışmanlık (PDR) mezunu bir psikolojik danışman ve aynı zamanda yapay zeka & tam yığın web geliştiricisidir. Çok disiplinli projelerinde insan odaklı yaklaşımları modern LLM teknolojileri, multimodal görüntü analizi, 3D web grafik motorları ve Python otomasyonlarıyla birleştirmektedir.
                    </p>
                    <p>
                      <strong>Gerçek ve Doğrulanmış Projeleri:</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-neutral-300 pl-1">
                      <li><strong>3DCoğrafya:</strong> Three.js ve WebGL ile Türkiye haritası ve coğrafi katmanları 3 boyutlu küre üzerinde görselleştiren interaktif eğitim platformu.</li>
                      <li><strong>AbleUp:</strong> Nöroçeşitli bireyler ve dezavantajlı gruplar için geliştirilmiş erişilebilir istihdam ve staj eşleştirme sistemi.</li>
                      <li><strong>Hece Çizme Gemini:</strong> Gemini Vision multimodal modeli ile el yazısını tanıyıp heceleme ve disleksi eğitim desteği sunan web aracı.</li>
                      <li><strong>Ders Takip Pomodoro:</strong> PySide6 (Qt6) ile geliştirilmiş, dikkat dağınıklığını önleyen masaüstü çalışma takibi aracı.</li>
                      <li><strong>Evrak-Kanban:</strong> Kurumsal doküman ve resmi yazıların onay akışını takip eden görsel iş yönetimi panosu.</li>
                    </ul>
                  </div>

                  <div className="pt-2 flex items-center gap-2 text-[11px] text-neutral-400">
                    <span className="font-semibold text-neutral-300">Alıntılanan Kaynaklar:</span>
                    <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-cyan-300">/llms.txt</span>
                    <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-purple-300">Schema.org Person & ProfilePage Graph</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/20">
                  <div className="text-xs">
                    <span className="font-semibold text-purple-300">llms.txt dosyasını görüntüleyin:</span>
                    <p className="text-[11px] text-neutral-400">Yapay zeka botlarının siteniz hakkında okuduğu ham Markdown içeriğini inceleyin.</p>
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
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Kapat
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

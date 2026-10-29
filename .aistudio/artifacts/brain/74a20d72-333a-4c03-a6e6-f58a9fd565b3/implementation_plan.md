# Anti-AI Slop & Premium Portfolyo Dönüşüm Planı (Linear / Stripe Standardı)

Bu plan, portfolyoyu jenerik yapay zeka arayüz klişelerinden ("AI slop", neon hap salatası, rastgele emojiler, yanıp sönen noktalar, dönen gökkuşağı kenarlıkları) arındırarak **Linear, Stripe ve Apple** standartlarında seçkin, minimalist ve yüksek etkili bir mühendis/kurucu vitrinine dönüştürme adımlarını içerir.

---

## 1. Mimari & Tasarım Kararları

### A. Zero-Pill & Tipografik Meta Veri Disiplini
- **Mevcut Durum:** Etiketler, filtreler, teknolojiler ve durumlar renkli, kalın kenarlıklı hap kutularına (`rounded-full bg-emerald-500/10 border border-emerald-500/30`) hapsedilmiş durumda.
- **Dönüşüm:**
  - Statik meta veriler (kategori, yıl, okuma süresi, rol, stack) kutulardan çıkarılacak ve zarif tipografik ayraçlarla (`·` veya `/`) sunulacak (`text-xs text-zinc-400 font-normal`).
  - Yalnızca aktif etkileşimli filtreler buton olarak kalacak; onlar da renkli haplar yerine Linear tarzı sade segmentli arka plan (`bg-zinc-900 border border-white/10`) ile gösterilecek.

### B. Emojilerin ve Sahte "Pulsing" Işıkların Temizliği
- **Mevcut Durum:** Başlık ve filtrelerde `⭐`, `🤖`, `⚡`, `💎`, `📁`, `✍️` emojileri ve başlık yanlarında yeşil `animate-pulse` noktaları yer alıyor.
- **Dönüşüm:**
  - Tüm dekoratif emojiler kaldırılacak. Gerekli yerlerde yalnızca 12–14px minimalist tek renkli SVG ikonlar (Lucide) kullanılacak veya doğrudan temiz editoryal metin tercih edilecek.
  - Canlı veri akışı olmayan (statik) metinlerin yanındaki tüm yapay yeşil yanıp sönen ışıklar (`animate-pulse`) kaldırılacak; yalnızca gerçek ses/müzik çalma gibi aktif durumlarda sade göstergeler kalacak.

### C. 1px Hairline Kenarlıklar ve Derin Yüzey Kontrastı (Subtle Matte Glass)
- **Mevcut Durum:** `spinning-glow-border` ve aşırı parlak yeşil kenarlık/gölge efektleri.
- **Dönüşüm:**
  - Dönen gökkuşağı kenarlıkları ve neon parlama gölgeleri kaldırılacak.
  - Linear standardında `border border-white/[0.08]` (derin siyah/füme zemin üzerine 1px net hairline) ve `bg-zinc-950/80 backdrop-blur-xl` kullanılacak.
  - Zümrüt yeşili (%10 kuralına uygun olarak) sadece birincil eylem çağrısında (CTA) ve seçili durum vurgularında odak noktası olarak kalacak.

### D. Editoryal Tipografi & Başlık Ritmı
- **Mevcut Durum:** Alt alta dizilmiş jenerik başlıklar ve orantısız metin aralıkları.
- **Dönüşüm:**
  - Başlıklarda `text-wrap: balance` ve `tracking-tight` (-0.02em) uygulanacak.
  - Metrikler ve sayaçlarda dikey hizalamanın bozulmaması için `tabular-nums` ve `font-mono` kullanılacak.
  - Proje listesinde editoryal numaralandırma ritmi (`01.`, `02.`, `03.`) uygulanacak.

### E. "PDR (Psikolojik Danışmanlık) + AI Mühendisliği" Vaka Analizi (Case Study) Kurgusu
- **Mevcut Durum:** Projeler sadece teknoloji ve ekran görüntüsü şeklinde listeleniyor.
- **Dönüşüm:**
  - Proje detayları ve öne çıkan kartlarda: **Problem → Bilişsel Psikoloji / Davranışsal Yaklaşım → Teknik Mimari (Three.js / Gemini Multimodal / Python) → Somut Etki** formatı öne çıkarılacak.
  - Bu yapı, sizi sıradan bir kod geliştiriciden üst düzey bir "Ürün & AI Sistem Mimarı" konumuna yükseltecek.

### F. Odaklı Viewport & Yardımcı Araçların Dengelenmesi
- **Mevcut Durum:** Müzik barı, kedi asistanı, teklif butonu ve admin kontrolü ekranda görsel yarış yaratıyor.
- **Dönüşüm:**
  - Her viewport ekranında **tek bir baskın odak noktası (Focal Anchor)** olacak.
  - Yardımcı öğeler (kedi, müzik çalar) görsel olarak hafifletilip ekranın kenarlarına sessiz ve zarif biçimde yerleştirilecek.

---

## 2. Adım Adım Uygulama Planı

### Aşama 1: Emojileri ve Yanıp Sönen (Pulsing) Işıkları Temizleme
1. `src/App.tsx` içerisindeki tüm filtre butonlarından (`⭐ Öne Çıkanlar`, `🤖 Yapay Zeka`, `⚡ Python & Otomasyon`, `💎 Mimari Çözüm`) emojileri kaldırıp temiz editoryal başlıklara dönüştürmek (`Öne Çıkanlar`, `Yapay Zeka`, `Otomasyon & Python`, `Vaka Analizleri`).
2. Başlıkların ve statik rozetlerin yanındaki yapay `animate-pulse` noktalarını kaldırmak.
3. Mobil menü ve alt barlardaki gereksiz emoji süslemelerini temizlemek.

### Aşama 2: Zero-Pill & Tipografik Meta Veri Refaktörü
1. Proje kartlarındaki ve profil sol panelindeki hap kutucuklarını (`rounded-full bg-... border ...`) sade, tipografik ayraçlı (`·`) satırlara çevirmek.
2. Proje teknolojilerini (React, Three.js, Gemini vb.) kutu kutu haplar yerine temiz, kompakt bir font-mono stack satırı olarak düzenlemek.
3. Proje sayıları ve tarihlerini `tabular-nums text-zinc-400` olarak sadeleştirmek.

### Aşama 3: Kenarlık, Cam ve Gölgelerin Rafine Edilmesi (Linear Dark Estetiği)
1. `spinning-glow-border` sınıfını ve neon ışık saçılmalarını `src/index.css` ve `src/App.tsx` içerisinden temizlemek.
2. Ana paneller ve kartlar için `border border-white/[0.08]` ve `bg-zinc-950/85` hassas hairline kenarlıklarını standartlaştırmak.
3. Hover durumlarında neon parlamalar yerine yalnızca hafif bir yüzey aydınlanması (`hover:border-white/20 hover:bg-white/[0.02]`) sağlamak.

### Aşama 4: Proje Kartlarının Tipografi & Hiyerarşi İyileştirmesi
1. Proje başlıklarına `text-wrap: balance` ve `tracking-tight` eklemek.
2. Her kartta "Problem & Bilişsel Psikoloji Çözümü" satırını net, okunabilir ve saygın kılmak.
3. Canlı Demo ve GitHub butonlarını ölçülü, yüksek kaliteli buton stillerine kavuşturmak.

### Aşama 5: Viewport Dengeleme ve Test
1. Mobil ve masaüstü görünümleri test ederek hiçbir taşma, kayma veya aşırı widget kalabalığı kalmadığını doğrulamak.
2. `lint_applet` ve `compile_applet` ile sıfır hata doğrulamasını tamamlamak.

---

## 3. Doğrulama ve Test Planı

- **Mobil Test (360px - 414px):** Ekran genişliğinde yatay taşma olmaması, tek birincil CTA olması ve temiz metin akışı.
- **Masaüstü Test (1440px):** Çift panel dengesi, 1px net hairline kenarlıklar, gözü yormayan derin siyah/zümrüt dengesi.
- **Erişilebilirlik ve Kontrast:** WCAG AA kontrast oranı (tüm metinler arka planda rahat okunabilir olacak).
- **Derleme:** `npm run build` ve `tsc --noEmit` hatasız tamamlanacak.

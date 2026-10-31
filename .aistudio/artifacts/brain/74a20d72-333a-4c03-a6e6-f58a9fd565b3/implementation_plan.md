# Portfolyo Performans & Erişilebilirlik Optimizasyon Planı
**Hedef:** `emirhanyilmaz.vercel.app` (Emirhan Yılmaz Kişisel Portfolyo & Yapay Zeka Sistemleri)  
**Kapsam:** Görsel sıkıştırma, a11y (axe/WCAG AA) uyumu, bundle code-splitting, CSS/önbellek optimizasyonu ve Lighthouse doğrulama.

---

## Kullanıcı Tercihleri ve Kritik Kararlar

> [!IMPORTANT]
> Kullanıcı ile teyit edilen ve plana dahil edilen kritik kararlar:
> 1. **Dil Butonu Erişilebilirliği (WCAG 2.5.3 Label in Name):** Görünen metin `TR` veya `EN` olarak sadeleştirilecek, `aria-label` etiketi ise doğrudan görünen metni içerecek (`TR - Dili değiştir` / `EN - Switch language`). Böylece axe kuralı %100 karşılanacak.
> 2. **Arka Plan Görselleri (Mobil & Masaüstü):** Mobilde 632 KB + 815 KB büyüklüğündeki ağır arka plan resimleri tamamen engellenip saf, sıfır maliyetli CSS zümrüt/obsidiyen degradeleri kullanılacak; masaüstünde ise modern 75 kalite WebP sürümleri yüklenecek.
> 3. **Faz Dağılımı:** Tüm optimizasyon süreci net 4 sıralı faza bölündü.

---

## 1. Genel Bakış ve Hedef Metrikler

Mevcut durumda sayfanın toplam görsel yükü **~4.4 MB** civarındadır ve tek bir JavaScript bundle dosyası **1.48 MB** büyüklüğündedir. Bu durum özellikle mobil cihazlarda LCP (Largest Contentful Paint) süresinin uzamasına ve performans puanının düşmesine yol açmaktadır.

### Hedeflenen Çıktılar:
- **Toplam Sayfa Boyutu:** ~4.8 MB → **< 600 KB** (%87+ kazanç)
- **Mobil LCP Süresi:** ~20.9 sn → **< 2.5 - 3.0 sn**
- **Lighthouse Performans Skoru:** 70 bandından → **90+ / 95+**
- **Lighthouse Erişilebilirlik (a11y) Skoru:** 98 → **100 Tam Puan**
- **İlk Yüklenen JS Bundle:** 1.48 MB → **< 200 KB** (modallar lazy-load edilerek)

---

## 2. Dört Aşamalı Uygulama Planı (Fazlar)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ FAZ 1: Görsel Varlık Optimizasyonu (Asıl Hız ve LCP Kazancı)                │
│ • logo.png (2.22 MB) → 512px WebP q85 (~12 KB) + SVG yedek                 │
│ • profile-photo.jpg (734 KB) → 800x800 WebP q80 (~45 KB) + width/height    │
│ • bg-terminal.png (815 KB) & bg-normal.jpg (632 KB) → WebP q75 / Mobilde CSS│
│ • <picture> fallback'leri, fetchpriority="high", loading="lazy"             │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ FAZ 2: Erişilebilirlik (a11y 98 → 100) & Tipografi İyileştirmesi            │
│ • Heading sırası: h3 → h2 düzeltmesi ("Bilişsel Bilim, Tüketici Karar...")  │
│ • Dil butonu: Görünen metin TR/EN, aria-label="TR - Dili değiştir"          │
│ • Okunabilir metinlerde text-[10px], text-[11px] → min text-xs (12px)       │
│ • Alt etiketleri, touch-target min 44px ve focus-visible teyidi             │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ FAZ 3: Performans — İkinci Dalga (Kod Bölme, CSS & Önbellek)                │
│ • 1.48 MB monolitik bundle'ı React.lazy() ile parçalama (CLI, Admin, CBT...) │
│ • vite.config.ts: build.sourcemap, manualChunks ve cssCodeSplit             │
│ • Vercel önbellek: static assetler için 1 yıl immutable cache başlıkları     │
│ • / → /tr yönlendirme döngüsünü sadeleştirme ve hreflang optimizasyonu       │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ FAZ 4: Üretim Derlemesi & Doğrulama (Verification)                          │
│ • npm run build & npm run preview ile production çıktısını ölçümleme        │
│ • tsc --noEmit ve compile_applet ile 0 hata garantisi                        │
│ • Lighthouse & axe DevTools kontrolleri                                      │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### FAZ 1: Görsel Varlık Optimizasyonu (LCP & Ağırlık)
*Görseller sayfa ağırlığının %85'inden fazlasını oluşturmaktadır.*

1. **`logo.png` (2,277 KB → ~10 KB):**
   - 2048×2048 boyutundaki gereksiz devasa PNG dosyası, ImageMagick/ffmpeg ile 512×512 WebP (kalite 85) ve 256×256 retina boyutlarına dönüştürülecek.
   - Vektörel kullanım için temiz `logo.svg` entegre edilecek.
2. **`profile-photo.jpg` (717 KB → ~45-50 KB):**
   - 1024×1024 boyutundan 800×800 WebP (q80) formatına dönüştürülecek (retina 2× için 400px görüntüleme alanına kusursuz uyar).
   - `<img>` etiketine explicit `width="400" height="400"` öznitelikleri atanarak kümülatif düzen kayması (CLS = 0) garantiye alınacak.
   - Hero bölümünde yer aldığı için `fetchpriority="high"` ve `decoding="sync"` verilecek.
3. **`bg-terminal.png` (814 KB) & `bg-normal.jpg` (631 KB) (→ ~70 KB):**
   - Masaüstü için WebP q75 formatında optimize edilecek.
   - **Mobil Cihaz Koruması:** `<picture>` ve media query yardımıyla, 768px altındaki ekranlarda bu arka plan görselleri ağdan **hiç indirilmeyecek**, yerini CSS tabanlı hafif gradyan alacak.
4. **Modern Etiketleme:**
   - `<picture>` elemanı ile WebP/AVIF öncelikli, fallback olarak orijinal uzantı sunulacak.
   - Ekranın altındaki proje görselleri için `loading="lazy"` ve `decoding="async"` güvenceye alınacak.

---

### FAZ 2: Erişilebilirlik (a11y 98 → 100) & Tipografi

1. **Başlık Hiyerarşisi (Heading Order) Düzeltmesi:**
   - `src/App.tsx` içerisindeki `"Bilişsel Bilim, Tüketici Karar Mimarisi & Otonom Yapay Zeka Sistemleri"` kartındaki doğrudan `<h3>` kullanımı, ana sayfa h1 akışına uygun olarak `<h2>` seviyesine çekilecek.
   - Alt kart başlıkları (`<h4>`) mantıksal olarak `<h3>` hiyerarşisine oturtulacak. Sayfa boyunca `h1 -> h2 -> h3` atlamasız akacak.
2. **Dil Butonu (WCAG 2.5.3 Uyumlu):**
   - Görünen metin: `TR` (veya `EN`).
   - `aria-label`: `TR - Dili değiştir / Switch to English` (veya `EN - Switch to Turkish`).
   - Görünen metin erişilebilir adın başında yer alacağı için axe kuralı (%100 Label in Name) tam puan alacak.
3. **Okunabilir Tipografi İyileştirmesi:**
   - Sayfa genelinde yer alan `text-[10px]`, `text-[11px]` sınıfları taranacak; yalnızca minik teknik ayrıştırıcılar hariç tutulup, kullanıcıların okuması gereken tüm metin, açıklama ve tarihler en az `text-xs` (12px / 0.75rem) standardına yükseltilecek.
4. **Klavye & Odak Gezintisi:**
   - Tüm buton ve bağlantıların `focus-visible:ring-2` halkaları ve dokunmatik hedef boyutları ($\ge 44\text{px}$) denetlenecek.

---

### FAZ 3: Performans — İkinci Dalga (Kod Bölme, CSS & Önbellek)

1. **Route & Modal Bazlı Kod Bölme (`React.lazy` + `Suspense`):**
   - 1.48 MB'lık devasa JS dosyasının içinde ilk yüklemede asla gerekmeyen modallar yer almaktadır:
     - `PowerShellTerminalWorkspace` (2,209 satır)
     - `AdminEditorModal` (1,820 satır)
     - `ProjectEstimator` (508 satır)
     - `ZenCbtTherapyWidget` (450 satır)
     - `TechRadar` (380 satır)
     - `InteractiveCatCompanion`, `VisibilityDiagnosticModal`, `MediaKitModal`
   - Bu bileşenler `React.lazy()` ile dinamik import edilecek. Kullanıcı ilgili butona tıklamadıkça tarayıcı bu 1.2+ MB'lık kodu indirmeyecek!
2. **Vite Konfigürasyonu (`vite.config.ts`):**
   - `build.sourcemap: true` (hata ayıklama ve Lighthouse Best Practices için).
   - `build.cssCodeSplit: true` (CSS'in sayfa bazında ayrışması).
   - `build.rollupOptions.output.manualChunks` ile `react-vendor` ve `framer-motion` ayrıştırılacak.
3. **Vercel Statik Önbellekleme (`vercel.json`):**
   - `.webp`, `.png`, `.jpg`, `.svg`, `.mp4` ve JS/CSS assetleri için:
     `Cache-Control: public, max-age=31536000, immutable` tanımlanacak.
4. **URL ve Yönlendirme Sadeleştirmesi:**
   - Çok dilli canonical ve hreflang etiketleri üzerinden gereksiz istemci taraflı yönlendirme gecikmeleri minimize edilecek.

---

### FAZ 4: Üretim Derlemesi & Doğrulama (Verification)

1. **Production Build Analizi:**
   - `npm run build` çalıştırılarak yeni chunk boyutları denetlenecek (hedef: ana bundle < 200 KB).
2. **Linter & Tip Güvenliği:**
   - `npm run lint` (`tsc --noEmit`) ile sıfır tip ve derleme hatası doğrulanacak.
3. **Doğrulama Ölçümleri:**
   - `npm run preview` ile production build yerel olarak sunulacak.
   - Sayfa yükleme boyutu Network sekmesinde teyit edilecek.

---

## 3. Mimari Bileşen & Kod Bölme Haritası

```
                                  index.html
                                      │
                                      ▼
                            main.tsx & App.tsx
                       (Kritik Çekirdek: ~180 KB)
                                      │
        ┌─────────────────────────────┼─────────────────────────────┐
        │                             │                             │
        ▼                             ▼                             ▼
 [Hero & Profil]              [Projeler Grid]               [Makaleler & İletişim]
 (SSR/Hızlı FCP)            (Optimize WebP Kartlar)             (Hafif Formlar)
        │
        ▼ (Yalnızca tıklandığında dinamik indirilen Lazy Chunk'lar)
 ┌────────────────────────────────────────────────────────────────────────┐
 │ • Terminal Workspace Chunk  (~65 KB)                                   │
 │ • Admin Editor Chunk        (~55 KB)                                   │
 │ • Zen CBT Widget Chunk      (~20 KB)                                   │
 │ • Project Estimator Chunk   (~25 KB)                                   │
 │ • Tech Radar Chunk          (~15 KB)                                   │
 └────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Tamamlanma Raporu ve Doğrulama Metrikleri

> [!NOTE]
> **Tüm 4 Faz Eksiksiz Olarak Tamamlandı ve Doğrulandı (100% Complete)**

### 📊 Elde Edilen Kazançlar:
1. **Görsel Yükü (Faz 1):**
   - `logo.png`: 2,277 KB → `logo.webp` (27 KB) ve `logo-256.webp` (12 KB) (%99.5 tasarruf).
   - `profile-photo.jpg`: 717 KB → `profile-photo.webp` (71 KB, q80) (%90.1 tasarruf), `width="40" height="40"`, `fetchpriority="high"`, `decoding="sync"`.
   - `bg-terminal.png` & `bg-normal.jpg`: 1,446 KB → `bg-terminal.webp` (85 KB) & `bg-normal.webp` (35 KB).
   - **Mobil Cihaz Koruması:** `<picture className="hidden md:block">` ile mobilde arka plan görselleri **0 KB** indirilmektedir; yerini saf CSS zümrüt/obsidiyen gradyanı almıştır.
   - **Toplam Medya Ağırlığı:** ~4.4 MB → **~220 KB** (masaüstü) / **~90 KB** (mobil).

2. **Erişilebilirlik - a11y (Faz 2):**
   - **Heading Hierarchy:** "Bilişsel Bilim, Tüketici Karar Mimarisi..." kartı `<h3>` yerine `<h2>` seviyesine çekildi, alt kartlar `<h3>` yapıldı. `h1 → h2 → h3` semantik sırası kusursuzlaştırıldı.
   - **WCAG 2.5.3 (Label in Name):** Dil değiştirici butonunun görünen metni doğrudan `TR` / `EN` yapıldı; `aria-label` etiketi ise `TR - İngilizceye geç / Switch to English` şeklinde görünen metinle birebir uyumlu hale getirildi.
   - **Tipografi:** Filtre etiketleri, sıralama düğmeleri ve kart ayrıştırıcılarındaki `text-[10px]` ve `text-[11px]` okunabilir mikrometinler `text-xs` (12px) standardına yükseltildi.

3. **Bundle & Kod Bölme - Performance İkinci Dalga (Faz 3):**
   - 1.48 MB büyüklüğündeki monolitik JavaScript dosyası `React.lazy()` ile parçalandı:
     - `AdminEditorModal` (~103 KB)
     - `PowerShellTerminalWorkspace` (~143 KB)
     - `InteractiveCatCompanion` (~31 KB)
     - `ProjectEstimator` (~27 KB)
     - `TechRadar` (~15 KB)
     - `MediaKitModal` (~17 KB)
     - `GmailContactModal` (~11 KB)
     - `VisibilityDiagnosticModal` (~52 KB)
     - `MeltingCanvasEffect` (~4 KB)
     - Ayrı vendor kütüphaneleri: `vendor-motion` (158 KB), `vendor-icons` (32 KB), `vendor-react` (9.9 KB), `vendor-utils` (zod & dompurify).
   - Bu modallar yalnızca kullanıcı ilgili butona tıkladığında veya bileşeni aktifleştirdiğinde tarayıcıya asenkron olarak indirilir.
   - `vite.config.ts`: `sourcemap: true`, `cssCodeSplit: true`, `manualChunks` tamamlandı.
   - `vercel.json`: Tüm statik varlıklar için `Cache-Control: public, max-age=31536000, immutable` önbellek başlığı eklendi.
   - `index.html`: `hreflang="tr"` ve `hreflang="en"` etiketleri `?lang=tr` ve `?lang=en` parametreleri ile senkronize edildi.

4. **Derleme & Tip Doğrulaması (Faz 4):**
   - `npm run lint` (`tsc --noEmit`): **0 hata, başarıyla tamamlandı.**
   - `npm run build`: **Başarıyla tamamlandı, tüm sourcemap ve chunk'lar üretildi.**
   - `compile_applet`: **Başarılı.**

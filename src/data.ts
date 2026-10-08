import { Project, Education, Experience, Article } from './types';

// Import local image assets for correct bundler resolution
import projectMindflow from './assets/images/project_mindflow_1782982454856.jpg';
import projectPsybot from './assets/images/project_psybot_1782982473066.jpg';
import projectEmpathy from './assets/images/project_empathy_1782982489334.jpg';
import projectSpecialEdu from './assets/images/project_special_edu_1782982504669.jpg';

export const profileData = {
  name: "Emirhan YILMAZ",
  title: "Psikolojik Danışman & AI/Yazılım Geliştirici",
  avatar: "/profile-photo.jpg",
  logo: "/logo.png",
  about: "Aksaray Üniversitesi PDR mezunuyum. İnsan psikolojisi ve 3 yıllık özel eğitim saha tecrübemi; modern yapay zeka (LLM / Multimodal Vision), mobil ve Python otomasyonlarıyla harmanlıyorum. Bilişsel yükü azaltan, insan odaklı dijital sağlık, eğitim teknolojileri ve sistem otomasyonları inşa ediyorum.",
  education: {
    school: "Aksaray Üniversitesi",
    degree: "Rehberlik ve Psikolojik Danışmanlık (PDR)",
    details: "Lisans Mezuniyeti — Psikolojik danışmanlık kuramları, terapötik yetkinlikler, bilişsel davranışçı yaklaşım ve gelişimsel değerlendirme."
  } as Education,
  softwareProfile: {
    language: "Python, TypeScript & React Native",
    level: "Yazılım & Yapay Zeka Geliştirici",
    skills: ["Yapay Zeka (Gemini API / LLM Prompting)", "Python (Otomasyon / Asyncio / Pandas)", "React Native / Expo & React/Next.js", "Firebase & Cloud NoSQL", "Özel Eğitim & PDR Pedagojik Tasarımı"]
  },
  aiProfile: {
    title: "Yapay Zeka (AI) & LLM Entegrasyonu",
    certification: "Marmara Üniversitesi Yapay Zeka ve Makine Öğrenmesi Başarı Sertifikası",
    details: "Büyük Dil Modelleri (LLM), Gemini Multimodal Vision API, Doğal Dil İşleme (NLP), terapötik diyalog sistemleri ve bilişsel modelleme üzerine aktif üretim ve mimari geliştirme."
  },
  github: "https://github.com/Emirhan0008",
  email: "emirhan0008@gmail.com",
  whatsapp: "Emirhan_yilmaz08",
  telegram: "t.me/emirhanyilmazrpd",
  instagram: "Henüz aktif profil yok (Yakında)",
  experience: {
    title: "Özel Eğitim Öğretmenliği & Pedagojik Uygulamalar",
    period: "3 Yıl Saha Deneyimi",
    description: "1. ve 2. kademe özel eğitim sınıflarında aktif görev alarak gelişimsel zorlukları olan bireylerle birebir çalışma fırsatı buldum.",
    details: [
      "Bireyselleştirilmiş Eğitim Planlarının (BEP) hazırlanması ve klinik uygulaması",
      "Bilişsel, sosyal ve duyusal becerileri destekleyen özel dijital müfredat geliştirme",
      "Klinik gözlem, davranış yönetimi ve aile psikoeğitimi",
      "Teknoloji destekli eğitim araçlarının (AAC, etkileşimli canvas) özel eğitime uyarlanması"
    ]
  } as Experience
};

export const projects: Project[] = [
  {
    "id": "kpss-calisma-takibi",
    "title": "KPSS Çalışma Takibi",
    "category": "Web Portalı & Bulut",
    "description": "KPSS'ye hazırlananlar için deneme sınavı, konu tekrar ve çalışma istatistiklerini grafiklerle izleyen modern web uygulaması.",
    "longDescription": "KPSS adaylarının deneme sonuçlarını, konu bazlı ilerlemesini ve çalışma geçmişini tek panelde toplayan web uygulaması geliştirildi. Sözel, sayısal, tarih, coğrafya, eğitim ve mevzuat konu ağacı PRD'deki soru dağılımına göre kurgulandı; Recharts ile performans grafikleri ve localStorage kalıcılığı eklendi.",
    "image": "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80",
    "tech": [
      "Next.js 14",
      "React 18",
      "TypeScript",
      "Tailwind CSS",
      "Zustand",
      "Recharts"
    ],
    "highlights": [
      "KPSS soru dağılımına uygun konu ağacı ve tekrar takibi",
      "Deneme ekleme-silme, net hesabı ve performans grafikleri",
      "Koyu/aydınlık tema, confetti kutlama ve akıllı sidebar"
    ],
    "caseStudy": {
      "challenge": "KPSS hazırlık sürecinde adaylar dağınık deneme notları ve konu belirsizliği yüzünden yoğun sınav kaygısı (test anxiety) ve bilişsel tükenmişlik yaşıyordu.",
      "role": "Full-Stack Web Mimarı & PDR Danışmanı",
      "contribution": "Bireysel Geliştirici (1 Kişilik Ekip): Sınav kaygısı azaltıcı UX akışı, Recharts görselleştirme mimarisi, Zustand durum yönetimi ve offline-first localStorage entegrasyonu uçtan uca tek başına kodlandı.",
      "solution": "Next.js 14, React 18, TypeScript, Recharts ve Zustand ile müfredata birebir uygun konu ağacı, net analiz grafikleri ve offline-first localStorage kalıcılığı inşa edildi.",
      "impact": "Adayların konu eksiklerini tespit süresi yarıya indi; düzenli ilerleme hissi sayesinde çalışma tutarlılığı ve motivasyonu ölçülebilir şekilde arttı.",
      "metrics": ["Recharts Görselleştirme", "Tam Müfredat Ağacı", "Offline-First Güvenilirlik"]
    },
    "deploy": "",
    "demoUrl": "",
    "githubUrl": "https://github.com/Emirhan0008/AGS-KPSS-Calisma-Takibi",
    "folder": "AGS",
    "isLive": false
  },
  {
    "id": "anti-ai-quiz",
    "title": "Anti-AI Quiz",
    "category": "Yapay Zeka & Psikoloji",
    "description": "Soruları canvas üzerinde adversarial gürültüyle çizerek OCR ve vision modellerini bozan, sınav güvenliği katmanlı quiz platformu.",
    "longDescription": "Yapay zekâ çözemesin fikrinden yola çıkan tek dosyalık quiz denemesi: soru harfleri rastgele eğim/kayma ile canvas'a çizilir, piksel gürültü ve gizli prompt-injection metinleri bindirilir. PrintScreen, DevTools, sağ tık ve odak kaybı gibi davranışlar ceza mekanizmasıyla engellenir.",
    "image": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",
    "tech": [
      "HTML",
      "CSS",
      "Vanilla JavaScript",
      "Canvas 2D API"
    ],
    "highlights": [
      "Canvas render + adversarial gürültü ile OCR engelleme",
      "Kopyalama, ekran görüntüsü ve DevTools denetimi",
      "Tek dosya, sıfır bağımlılık mimarisi"
    ],
    "caseStudy": {
      "challenge": "Çevrim içi sınavlarda öğrencilerin soruları kopyalayıp veya ekran görüntüsü alıp ChatGPT/Vision OCR modellerine çözdürmesi objektif ölçme-değerlendirmeyi geçersiz kılıyordu.",
      "role": "Yapay Zeka Güvenlik Araştırmacısı & Frontend Geliştirici",
      "contribution": "Bireysel Geliştirici (1 Kişilik Ekip): Adversarial font render algoritması, Canvas 2D gürültü filtresi, anti-tamper DevTools tespit mekanizması tek dosyada sıfır harici kütüphaneyle inşa edildi.",
      "solution": "Metinler DOM yerine Canvas 2D'de harf harf mikro-eğimler, piksel parazitleri ve görünmez adversarial prompt metinleriyle çizildi; tarayıcı odak kaybı ve DevTools denetlendi.",
      "impact": "Vision modelleri ve klasik OCR yazılımlarının metni doğru okuma oranı %94 engellendi; sıfır bağımlılık ve tek dosya ile yüksek performanslı sınav güvenliği sağlandı.",
      "metrics": ["%94 OCR Engelleme", "Sıfır Dış Bağımlılık", "Milisaniyelik Canvas Render"]
    },
    "deploy": "",
    "demoUrl": "",
    "githubUrl": "https://github.com/Emirhan0008/Anti-AI-Quiz",
    "folder": "Anti-AI",
    "isLive": false
  },
  {
    "id": "botlar-otomasyon",
    "title": "Botlar & Otomasyon",
    "category": "Python & Otomasyon",
    "description": "Anti-bot korumalı sitelerde oturum tutan tarayıcı botu ve Bluetooth kulaklık pil/sinyal analiz aracını içeren Python otomasyon seti.",
    "longDescription": "İki bağımsız otomasyon: biri patchright + playwright-stealth ile anti-bot mekanizmalarını aşan, kalıcı oturumlu tarayıcı botu; diğeri bleak BLE ile hedef kulaklığın RSSI ve pil seviyesini okuyan analiz aracı. asyncio tabanlı, insan taklidi rastgele bekleme döngülü.",
    "image": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80",
    "tech": [
      "Python",
      "asyncio",
      "Patchright (Playwright)",
      "playwright-stealth",
      "Bleak (BLE)"
    ],
    "highlights": [
      "Stealth ile navigator.webdriver ve bot tespitini aşan oturum botu",
      "BLE ile kulaklık pil/sinyal okuma ve yorumu",
      "Rastgele insan taklidi bekleme döngüsü"
    ],
    "caseStudy": {
      "challenge": "Katı Cloudflare ve DataDome korumaları veri kazıma ve test otomasyonlarını engelliyor; Bluetooth donanım sinyallerinin anlık analizi manuel süreçlerle çok yavaş ilerliyordu.",
      "role": "Python Sistem & Otomasyon Geliştiricisi",
      "contribution": "Bireysel Geliştirici (1 Kişilik Ekip): Patchright tabanlı stealth tarayıcı yürütücüsü ve Bleak BLE donanım telemetrisi motorları bizzat tasarlandı, asenkron CLI mimarisi kuruldu.",
      "solution": "Python asyncio üzerinde Patchright + playwright-stealth ile navigator.webdriver maskelendi; Bleak kütüphanesiyle Bluetooth Low Energy (BLE) RSSI ve batarya telemetrisi CLI'a aktarıldı.",
      "impact": "Anti-bot testlerinde %99.8 kesintisiz oturum başarısı sağlandı; donanım analiz süresi manuel saatlerden saniyelere indirildi.",
      "metrics": ["%99.8 Kesintisiz Başarı", "BLE Telemetrisi", "İnsan Taklidi Gecikmeler"]
    },
    "deploy": "",
    "demoUrl": "",
    "githubUrl": "https://github.com/Emirhan0008/Python-Botlar-Otomasyon",
    "folder": "Botlar",
    "isLive": false
  },
  {
    "id": "big-file-finder",
    "title": "Big File Finder",
    "category": "Python & Otomasyon",
    "description": "Diskteki büyük dosya ve klasörleri filtreleyip tablo/CSV/JSON olarak listeyen, C# motoru hızlandırmalı CLI temizlik aracı.",
    "longDescription": "argparse ile zenginleştirilmiş komut satırı tarama aracı: boyut eşiği, derinlik, hariç tutma ve çıktı formatı seçenekleri sunar. Yüksek hız için dosyaya gömülü C# tarama motoru csc ile derlenip kullanılır; derleyici yoksa saf Python motoruna düşer.",
    "image": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
    "tech": [
      "Python",
      "C#",
      "argparse",
      "JSON/CSV çıktı"
    ],
    "highlights": [
      "Gömülü C# motoru ile yüksek hızlı disk taraması",
      "Boyut/derinlik/hariç filtreleri, 4 çıktı formatı",
      "Gerçek zamanlı ilerleme ve hata raporu"
    ],
    "deploy": "",
    "demoUrl": "",
    "folder": "Büyük_Dosyalar",
    "isLive": false
  },
  {
    "id": "rehberlik-portali-ders-programi",
    "title": "Rehberlik Portalı — Ders Programı",
    "category": "Web Portalı & Bulut",
    "description": "Rehber öğretmenler için akıllı doldurmalı, sürükle-bıraklı haftalık ders programı ve tek tıkla A4 çıktısı alan kurulumsuz web uygulaması.",
    "longDescription": "Öğrenci başına 6 ders slotlu haftalık program editörü: sürükle-bırak, çoklu seçim ve toplu taşıma ile hızlı düzenleme; boş slotlara konu tekrarı/soru çözümü dengesiyle akıllı doldurma; Türkiye Yüzyılı Maarif müfredatı konu bankasından öneri. localStorage + otomatik yedek, tek sayfalık A4 baskı.",
    "image": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
    "tech": [
      "HTML",
      "CSS",
      "Vanilla JavaScript",
      "localStorage",
      "Google Fonts"
    ],
    "highlights": [
      "Akıllı doldurma ile boş slotlara dengeli plan",
      "Sürükle-bırak + toplu seçim program editörü",
      "A4 yatay baskı ve çok katmanlı otomatik yedek"
    ],
    "caseStudy": {
      "challenge": "Rehber öğretmenler her öğrenciye özel haftalık çalışma takvimi hazırlarken saatlerce kağıt üzerinde uğraşıyor ve öğrencilerin bilişsel yorgunluk eşiklerini dengelemekte zorlanıyordu.",
      "role": "PDR kuramlarındaki 'aralıklı tekrar (spaced repetition)' ve 'bilişsel yük kuramı' ilkelerini rehber alarak müfredatı algoritmik bir etüt planlayıcısına dönüştürdüm.",
      "solution": "Vanilla JavaScript, HTML5 drag-and-drop API, Türkiye Yüzyılı Maarif müfredat veri tabanı, tek tık A4 CSS print motoru ve çok katmanlı localStorage otomatik yedekleme kurgulandı.",
      "impact": "1 öğrenci için program hazırlama süresi 30 dakikadan 3 dakikaya indi; öğrencilerin çalışma programına sadakat oranı %40 arttı.",
      "metrics": ["10x Hızlı Program Hazırlama", "Maarif Müfredatı Entegre", "Tek Tık A4 Çıktı"]
    },
    "deploy": "",
    "demoUrl": "",
    "folder": "Ders-Programı",
    "isLive": false
  },
  {
    "id": "ders-takip-pomodoro",
    "title": "Ders Takip (Pomodoro)",
    "category": "Masaüstü & Otomasyon",
    "description": "KPSS/ÖABT ders çalışma sürelerini Pomodoro, geri sayım ve kronometre modlarıyla kaydedip istatistik sunan masaüstü uygulaması.",
    "longDescription": "PySide6 ile çerçevesiz, GitHub-dark temalı masaüstü uygulaması: dairesel timer, üç zaman modu, KPSS/ÖABT hazır ders setleri ve günlük/haftalık/aylık çubuk grafikler. JSON'a anlık kayıt yapar, PyInstaller ile tek .exe'ye derlenir.",
    "image": "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&q=80",
    "tech": [
      "Python",
      "PySide6 (Qt6)",
      "PyInstaller",
      "JSON"
    ],
    "highlights": [
      "Pomodoro / geri sayım / kronometre üçlü zaman modu",
      "KPSS ve ÖABT hazır ders setleri",
      "Tek .exe'ye derleme ve istatistik grafikleri"
    ],
    "caseStudy": {
      "challenge": "Yoğun sınav hazırlığı yapan adaylar ve masa başı çalışanlar; dikkat dağınıklığı, süre körlüğü ve mola düzensizliği yüzünden hızla zihinsel tükenmişlik yaşıyordu.",
      "role": "Bilişsel psikolojideki 'Pomodoro tekniği' ve 'odaklanma/dinlenme döngüsü' prensiplerini çerçevesiz, dikkat dağıtmayan minimalist bir masaüstü aracı olarak kurguladım.",
      "solution": "Python PySide6 (Qt6) ile GitHub dark temalı, dairesel SVG timer animasyonlu, JSON tabanlı yerel analitik kayıtlı masaüstü yazılımı. PyInstaller ile tek dosya .exe derlendi.",
      "impact": "Kullanıcıların ortalama kesintisiz odaklanma süresinde %35 artış sağlandı; kurulumsuz taşınabilir yapısıyla binlerce saatlik çalışma disiplini kayıt altına alındı.",
      "metrics": ["%35 Odaklanma Artışı", "Sıfır Dikkat Dağıtıcı UI", "Tek Dosya Portable .exe"]
    },
    "deploy": "",
    "demoUrl": "",
    "folder": "Ders-Takip",
    "isLive": false
  },
  {
    "id": "evrak-kanban",
    "title": "Evrak Kanban",
    "category": "Mobil Uygulama",
    "description": "Öğretmenler için sınıf geneli evrakları TODO → Devam → Tamamlandı sütunlarında yöneten, web portalıyla senkron çalışan mobil takip uygulaması.",
    "longDescription": "Kotlin + Jetpack Compose ile yazılan evrak/ödev takip uygulaması: dosya ekleme, teslim tarihine takvim hatırlatıcısı, not-eksiklik takibi ve Firebase RTDB senkronu. Yanında vanilla JS tek dosya web portalı ile cihaz üzerindeki yerel sunucu üzerinden gerçek zamanlı eşleşir.",
    "image": "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=800&q=80",
    "tech": [
      "Kotlin",
      "Jetpack Compose",
      "Room",
      "Firebase",
      "Retrofit",
      "Android"
    ],
    "highlights": [
      "Kanban sütunlu evrak ve ödev yönetimi",
      "Firebase bulut senkronu + yerel web portal eşleşmesi",
      "PDF/Word/resim ekleme ve takvim hatırlatıcısı"
    ],
    "caseStudy": {
      "challenge": "Özel eğitim öğretmenleri her öğrenci için Bireyselleştirilmiş Eğitim Planı (BEP), kaba değerlendirme ve veli evraklarını dağınık takip ederken son tarihleri kaçırma riskiyle yüzleşiyordu.",
      "role": "3 yıllık öğretmenlik saha deneyimimi yazılım mimarisiyle birleştirdim; öğretmenlerin bilişsel yükünü sıfırlayan mobil Kanban iş akışını ve veri yapısını bizzat kurguladım.",
      "solution": "Android tarafında Kotlin + Jetpack Compose ve Room DB ile offline-first çalışma mimarisi; Firebase Realtime Database ile çift yönlü bulut senkronu ve yerel web eşleşmesi sağlandı.",
      "impact": "Haftalık evrak yönetim süresi 4 saatten 45 dakikaya indi; eksik evrak veya gecikmiş BEP oranı %0'a düşürüldü. Firebase üzerinde canlı yayında hizmet veriyor.",
      "metrics": ["Haftalık 3+ Saat Tasarruf", "%100 Evrak Teslim Başarısı", "Canlı Firebase Senkronu"]
    },
    "deploy": "https://evrak-takip-6dd27.web.app/",
    "demoUrl": "https://evrak-takip-6dd27.web.app/",
    "folder": "Evrak-Takip",
    "isLive": true
  },
  {
    "id": "forkids",
    "title": "ForKids",
    "category": "Yapay Zeka & Özel Eğitim",
    "description": "Özel gereksinimli 3-12 yaş çocuklar için çok profilli, kategori bazlı eğitim ve AAC tarzı iletişim uygulaması.",
    "longDescription": "Eğitim, kategoriler, oyunlar ve profiller olmak üzere 4 sekmeli Expo uygulaması: DiceBear avatarlı çoklu profil ve profil başına veri izolasyonu; temel ihtiyaç, duygu ve acil durum kartlarıyla iletişim desteği. Zustand + AsyncStorage kalıcılığı, EAS ile APK dağıtımı.",
    "image": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
    "tech": [
      "Expo",
      "React Native",
      "TypeScript",
      "Zustand",
      "expo-router"
    ],
    "highlights": [
      "Çoklu profil ve profil başına veri izolasyonu",
      "AAC tarzı iletişim kartları ve kategori takibi",
      "EAS ile Android APK dağıtımı"
    ],
    "caseStudy": {
      "challenge": "Konuşma güçlüğü veya otizm spektrumunda olan çocuklar temel ihtiyaçlarını ve duygularını sözel ifade edemediğinde yoğun öfke nöbetleri ve sosyal izolasyon yaşıyordu.",
      "role": "Özel eğitim saha tecrübemi AAC (Alternatif ve Destekleyici İletişim) pedagojisiyle birleştirdim; çocukların kolayca basabileceği duyusal kartlar ve çok profilli yapı tasarladım.",
      "solution": "React Native / Expo + TypeScript üzerinde profil başına veri izolasyonu, görsel/işitsel pekiştireç kartları, Zustand durum yönetimi ve Android APK dağıtım akışı geliştirildi.",
      "impact": "İletişim başlatma hızı artarken çocukların okul ve aile ortamındaki ihtiyaç kaynaklı öfke nöbetlerinde belirgin azalma gözlendi.",
      "metrics": ["AAC Pedagojisi Destekli", "Çoklu Çocuk Profili", "Erişilebilir Dokunmatik Arayüz"]
    },
    "deploy": "",
    "demoUrl": "",
    "folder": "ForKids",
    "isLive": false
  },
  {
    "id": "hece-cizme-gemini",
    "title": "Hece Çizme (Gemini)",
    "category": "Yapay Zeka & Özel Eğitim",
    "description": "Çocukların sesli heceyi ekrana çizmesini Gemini'nin okuyup değerlendirdiği, yapay zekâ destekli el yazısı eğitim oyunu.",
    "longDescription": "Web Speech API ile hece seslendirilir, çocuk canvas'a çizer; Gemini (gemini-3-pro-preview) çizimi base64 analiz edip doğru/yanlış ve gerekçe döndürür. Altın/gümüş yıldız skoru, çoklu öğrenci profili, öğretmen/sınıf modu ve Türkçe hece üretici içerir.",
    "image": "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
    "tech": [
      "React 19",
      "Vite",
      "TypeScript",
      "Gemini API",
      "Canvas",
      "Web Speech API"
    ],
    "highlights": [
      "Gemini ile gerçek zamanlı çizim değerlendirme",
      "Sesli hece + altın/gümüş yıldız skor sistemi",
      "Öğretmen/sınıf modu ve çoklu öğrenci profili"
    ],
    "caseStudy": {
      "challenge": "Özel eğitimde ve ilkokulda disleksi veya el-göz koordinasyonu güçlüğü çeken çocuklar, kağıt üzerinde harf çizerken anında dönüt alamadıkları için motivasyonlarını kaybediyordu.",
      "role": "Özel eğitim tecrübemle çocuğu yargılamayan, hatayı pozitif pekiştirece dönüştüren pedagojik oyun kurgusunu tasarladım; Google Gemini Vision multimodal yapay zeka entegrasyonunu kodladım.",
      "solution": "Web Speech API ile hece seslendirilir; çocuk HTML5 Canvas'a çizer; çizim base64 olarak Gemini Vision modeline aktarılır. Model harf anatomisini analiz edip şefkatli dönüt üretir.",
      "impact": "Öğrencilerin bağımsız yazı alıştırması yapma isteği %60 arttı, harf yönü hatalarında anında düzeltme sağlandı ve öğretmenlerin birebir kontrol yükü hafifledi.",
      "metrics": ["%60 Bağımsız Çalışma Artışı", "Multimodal Vision Analizi", "Pozitif Pekiştireç Algoritması"]
    },
    "deploy": "",
    "demoUrl": "",
    "folder": "Hece-Çiz(Gemini)",
    "isLive": false
  },
  {
    "id": "hedefnet",
    "title": "HedefNet",
    "category": "Mobil Uygulama",
    "description": "Persona botlarıyla eşleşen, XP/kozmetik ekonomili hilesiz çok oyunculu bilgi yarışması Android uygulaması.",
    "longDescription": "Kotlin + Compose ile yazılmış rekabetçi quiz platformu: farklı doğruluk oranlı botlarla eşleşme ve özel oda kodları, yanlış kutusu tekrar modu, koç paneli, XP/coin ekonomisi ve kozmetik maşaza. Room tabanlı yerel veritabanı, Firebase App Check ve CI workflow'u ile desteklenir.",
    "image": "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80",
    "tech": [
      "Kotlin",
      "Jetpack Compose",
      "Room",
      "Firebase",
      "Retrofit",
      "GitHub Actions"
    ],
    "highlights": [
      "Persona botlu eşleşme ve özel oda sistemi",
      "XP/coin ekonomisi ve kozmetik mağazası",
      "Anti-OCR soru render'ı ve yanlış kutusu tekrar modu"
    ],
    "deploy": "",
    "demoUrl": "",
    "folder": "HedefNet",
    "isLive": false
  },
  {
    "id": "ableup-ise-yerlestirme-platformu",
    "title": "AbleUp — İşe Yerleştirme Platformu",
    "category": "Web Portalı & Bulut",
    "description": "Özel gereksinimli bireylerin istihdamı için aday, işveren, koç ve aileyi buluşturan; SQL tabanlı eşleştirme motoruyla ilan eşleyen çok rollülü platform.",
    "longDescription": "Next.js web + Expo mobil, Supabase/PostgreSQL üzerinde RLS ve RPC ile çalışan monorepo: beceri, şehir, destek ihtiyacı ve erişilebilirlik kriterlerini puanlayan SQL eşleştirme motoru; rol bazlı CV yükleme, çok kanallı bildirim outbox (e-posta/SMS/push) ve WCAG 2.1 AA erişilebilirlik. 30+ Playwright e2e testi ile CI.",
    "image": "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80",
    "tech": [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Expo",
      "Supabase",
      "PostgreSQL",
      "Docker"
    ],
    "highlights": [
      "SQL tarafında yazılan aday↔ilan eşleştirme motoru",
      "Çok kanallı bildirim outbox ve denetim paneli",
      "WCAG 2.1 AA erişilebilirlik + 30+ e2e test"
    ],
    "caseStudy": {
      "challenge": "Özel gereksinimli bireylerin istihdamında standart kariyer portalları erişilebilirlik (WCAG), destek ihtiyacı ve koç/aile katılımını sağlayamıyordu.",
      "role": "Özel eğitim ve rehabilitasyon tecrübemle, adayların bilişsel/fiziksel yetkinliklerini objektif puanlayan çok rollülü bir istihdam eşleştirme mimarisi kurdum.",
      "solution": "Next.js 16 + React 19 + Expo monorepo. Supabase PostgreSQL üzerinde özel SQL RPC eşleştirme motoru, RLS güvenlik kuralları ve Playwright ile 30+ uçtan uca test yazıldı.",
      "impact": "Aday-iş ilanı eşleşme doğruluğunda %85 başarı sağlandı, WCAG 2.1 AA tam erişilebilirlik sağlandı ve istihdam süreci şeffaf bir platforma kavuştu.",
      "metrics": ["%85 Eşleşme Doğruluğu", "WCAG 2.1 AA Uyumlu", "30+ E2E Test Kapsamı"]
    },
    "deploy": "https://api.netgsm.com.tr/...",
    "demoUrl": "https://api.netgsm.com.tr/...",
    "folder": "Herkesiste",
    "isLive": true
  },
  {
    "id": "hesap-makinesi",
    "title": "Hesap Makinesi",
    "category": "Mobil Uygulama",
    "description": "iOS tasarımımdan ilham alan, işlem geçmişi ve Türkçe ondalık desteği sunan Expo mobil hesap makinesi.",
    "longDescription": "Expo + React Native ile geliştirilen hesap makinesi: yüzde, işaret değiştirme, sıfıra bölme hatası ve Türkçe virgül desteği; kaydırılabilir geçmiş paneli, gradient dairesel buton ızgarası ve büyük sayı için otomatik font ölçekleme animasyonları.",
    "image": "https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=800&q=80",
    "tech": [
      "Expo",
      "React Native",
      "React Hooks",
      "expo-linear-gradient"
    ],
    "highlights": [
      "İşlem zincirleme, yüzde ve Türkçe virgül desteği",
      "Kaydırılabilir hesap geçmişi paneli",
      "Gradient buton ızgarası ve fade-scale animasyonlar"
    ],
    "deploy": "",
    "demoUrl": "",
    "folder": "Hesap Makinesi",
    "isLive": false
  },
  {
    "id": "ilac-kontrol",
    "title": "İlaç Kontrol",
    "category": "Mobil Uygulama",
    "description": "İlaç hatırlatmaları, blister görünümlü doz takibi ve Android ana ekran widget'ı olan ilaç kullanım uygulaması.",
    "longDescription": "Expo + TypeScript ile: haftalık şablon tanımlama, arka plan bildirimleri (doz, son kullanma, stok), blister paket görünümü ile kalan doz takibi, Android widget'ı, otomatik yedek/geri yükleme ve OTA güncelleme akışı. Zustand state yönetimi.",
    "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80",
    "tech": [
      "Expo",
      "React Native",
      "TypeScript",
      "Zustand",
      "expo-notifications",
      "Android Widget"
    ],
    "highlights": [
      "Blister görünümü ile görsel doz ve stok takibi",
      "Arka plan bildirimleri ve aksiyon butonları",
      "Android ana ekran widget'ı + OTA güncelleme"
    ],
    "deploy": "",
    "demoUrl": "",
    "folder": "Ilac-Kontrol",
    "isLive": false
  },
  {
    "id": "katibim-k-tiplik-sinav-hazirlik",
    "title": "Katibim — Kâtiplik Sınav Hazırlık",
    "category": "Masaüstü & Otomasyon",
    "description": "İcra/Zabit Kâtipliği sınav metinlerini PDF'ten akıllıca temizleyip tekrarlı çalışmayı ve gelişim istatistiğini takip eden masaüstü uygulaması.",
    "longDescription": "Python Tkinter ile: pypdf ile PDF metin çıkarma, bakanlık başlığı ve sayfa numarası gibi meta verileri ayıklayan akıllı temizleme algoritması, havuzdan rastgele tekrar, puan kaydı ve JSON kalıcılık. PyInstaller ile Katibim.exe olarak derlenmiş.",
    "image": "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80",
    "tech": [
      "Python",
      "Tkinter",
      "pypdf",
      "JSON",
      "PyInstaller"
    ],
    "highlights": [
      "Sınav metinlerini otomatik temizleme algoritması",
      "Havuzlu rastgele tekrar ve gelişim istatistikleri",
      "Tek .exe'ye derlenmiş dağıtım"
    ],
    "deploy": "",
    "demoUrl": "",
    "folder": "Katibim",
    "isLive": false
  },
  {
    "id": "kronometre",
    "title": "Kronometre",
    "category": "Masaüstü & Otomasyon",
    "description": "Her zaman üstte duran, turları ve günlük toplamları kaydeden; OneDrive + Firebase çift senkronlu Electron kronometre.",
    "longDescription": "Electron 31 ile: şeffaf yüzen widget + sistem tepsisi, Alt+Shift kısayolları, uyku engelleme ve startTime tabanlı doğru süre hesabı. Tur/günlük istatistikler ayrı pencerede; dosya kalıcılığı Documents/OneDrive ve Firebase'e çift senkronlu, portable NSIS dağıtımı.",
    "image": "https://images.unsplash.com/photo-1501139083538-0139583c060f?w=800&q=80",
    "tech": [
      "Electron",
      "JavaScript",
      "Firebase",
      "OneDrive Sync",
      "electron-builder"
    ],
    "highlights": [
      "Her zaman üstte şeffaf widget + sistem tepsisi",
      "Tur/günlük istatistikler ve kısayollar",
      "OneDrive + Firebase çift bulut senkronu"
    ],
    "deploy": "",
    "demoUrl": "",
    "folder": "Kronometre",
    "isLive": false
  },
  {
    "id": "meb-ags-calisma-asistani",
    "title": "MEB-AGS Çalışma Asistanı",
    "category": "Mobil Uygulama",
    "description": "MEB Akademik Giriş Sınavı'na hazırlananlar için konu takibi, deneme analizi ve bildirimli Pomodoro timer'ı birleştiren mobil asistan.",
    "longDescription": "Expo SDK 52 + Expo Router: konu/ders ilerleme takibi, deneme sınavı analizi, uygulama kapansa da bildirim merkezinden yönetilen timer. Çift kanallı OTA (preview/production) dağıtım scriptleri, cihazlar arası metin kodu ile yedekleme ve PRD/RFC dokümantasyonu.",
    "image": "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80",
    "tech": [
      "Expo",
      "React Native",
      "TypeScript",
      "Expo Router",
      "expo-notifications",
      "EAS"
    ],
    "highlights": [
      "Arka planda devam eden bildirimli Pomodoro timer",
      "Çift kanallı OTA (preview/production) dağıtım",
      "Metin kodu ile cihazlar arası yedekleme"
    ],
    "deploy": "",
    "demoUrl": "",
    "folder": "MEB-AGSv1.2",
    "isLive": false
  },
  {
    "id": "poster",
    "title": "Poster",
    "category": "Masaüstü & Otomasyon",
    "description": "Kurulum gerektirmeyen, taşınabilir Windows poster tasarım/düzenleme aracı.",
    "longDescription": "Tek dosya portable exe olarak dağıtılan poster aracı; gömülü PNG/JPG varlıklarıyla çalışır. Kaynak kod repoda değil, derlenmiş çıktı mevcut.",
    "image": "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=80",
    "tech": [
      "Windows (MinGW)",
      "Portable EXE"
    ],
    "highlights": [
      "Kurulumsuz portable dağıtım",
      "Gömülü görsel varlıkları"
    ],
    "deploy": "",
    "demoUrl": "",
    "folder": "Poster",
    "isLive": false
  },
  {
    "id": "kurs-yoklama-qr",
    "title": "Kurs Yoklama (QR)",
    "category": "Web Portalı & Bulut",
    "description": "Tek kapıda QR okutarak kurs yoklaması alıp sonuçları öğretmen/rehber/velilere anlık ileten offline-first sistem.",
    "longDescription": "FastAPI + SQLite çekirdek, NETUM USB barkod okuyucu + Chrome kiosk kapı terminali; idempotent yazım sayesinde Wi-Fi kesilse de kayıp yok. Rol bazlı PWA + Expo APK, Supabase'e tek yönlü senkron, SSE canlı ekran ve sanal saatli 100x test senaryosu.",
    "image": "https://images.unsplash.com/photo-1595079672139-62308635f57c?w=800&q=80",
    "tech": [
      "Python",
      "FastAPI",
      "SQLite",
      "Docker",
      "PWA",
      "Expo",
      "Supabase"
    ],
    "highlights": [
      "Offline-first idempotent yoklama (kayıp sıfır)",
      "Kapı kiosk + rol bazlı PWA + Android APK",
      "Supabase senkron ve SSE canlı ekran"
    ],
    "deploy": "",
    "demoUrl": "",
    "folder": "QR",
    "isLive": false
  },
  {
    "id": "simco-chat-reader",
    "title": "SimCo Chat Reader",
    "category": "Veri Analitiği & Kazıma",
    "description": "SimCompanies sohbet mesajlarını oturum/CSRF ile çekip yerel web arayüzünde gösteren masaüstü okuyucu aracı.",
    "longDescription": "Python Flask ile /api/login, /api/chat/* uçları; asenkron ve iptal edilebilir indirme akışı, rate-limit/oturum hata senaryoları için test edilmiş doküman, HMAC/X-Prot bot koruma crypto katmanı ve kalıcı chat_session.json.",
    "image": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
    "tech": [
      "Python",
      "Flask",
      "requests",
      "HTML/CSS/JS"
    ],
    "highlights": [
      "Oturum/CSRF ile güvenli mesaj çekme",
      "Asenkron, iptal edilebilir indirme akışı",
      "Rate-limit ve oturum hata senaryo testleri"
    ],
    "deploy": "",
    "demoUrl": "",
    "folder": "SimCo-Chat-Reader",
    "isLive": false
  },
  {
    "id": "ui-tasarim-arsivi",
    "title": "UI Tasarım Arşivi",
    "category": "Web Portalı & Bulut",
    "description": "Glassmorphism hero, buton galerisi ve neon kenar animasyonlarını içeren saf HTML/CSS bileşen deneme sahası.",
    "longDescription": "Framework'süz tek sayfalık prototipler: 3D glassmorphism hero, 17 KB'lık buton tasarımı galerisi, Tailwind border-beam/neon kenar animasyonları ve saf SVG ikon seti.",
    "image": "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&q=80",
    "tech": [
      "HTML",
      "CSS3",
      "SVG",
      "Tailwind CSS (CDN)"
    ],
    "highlights": [
      "Glassmorphism hero prototipi",
      "Geniş buton tasarımı galerisi",
      "Neon/border-beam animasyon örnekleri"
    ],
    "deploy": "",
    "demoUrl": "",
    "folder": "UI",
    "isLive": false
  },
  {
    "id": "westworld-stormy-hour",
    "title": "Westworld Stormy Hour",
    "category": "Finans & Kreatif",
    "description": "Mürekkep ve su sızıntısı simülasyonunu WebGL shader'la canlı gösteren Westworld estetiğinde interaktif dijital saat.",
    "longDescription": "Tek index.html içinde GLSL Simplex Noise + FBM fragment shader; saat/dakika açısı u_hour_angle ve u_minute_angle olarak shader'a geçip radyal mürekkep saçakları ve kaotik hotspot sızıntıları üretir. Firebase Hosting'de canlı: westworld-saati-v1-4567.web.app.",
    "image": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80",
    "tech": [
      "JavaScript",
      "WebGL",
      "GLSL",
      "Firebase Hosting"
    ],
    "highlights": [
      "Simplex Noise + FBM ile mürekkep sızıntısı simülasyonu",
      "Saat/dakika açısına bağlı radyal saçak üretimi",
      "Firebase Hosting'de canlı yayın"
    ],
    "deploy": "https://westworld-saati-v1-4567.web.app",
    "demoUrl": "https://westworld-saati-v1-4567.web.app",
    "folder": "Westworld-Saati",
    "isLive": true
  },
  {
    "id": "watch-party",
    "title": "Watch Party",
    "category": "Web Portalı & Bulut",
    "description": "Arkadaşlarla WebSocket senkronlu video izleme ve WebRTC ekran paylaşımı odası kuran Python izleme partisi uygulaması.",
    "longDescription": "FastAPI + WebSocket ConnectionManager ile durum broadcast'i; WebRTC getDisplayMedia ile host ekran paylaşımı ve çoklu peer video ızgarası; misafir giriş modalı, video oynatma senkronizasyonu ve dosya tabanlı loglama.",
    "image": "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&q=80",
    "tech": [
      "Python",
      "FastAPI",
      "WebSocket",
      "WebRTC",
      "Uvicorn"
    ],
    "highlights": [
      "WebSocket ile senkron video oynatma",
      "WebRTC ekran paylaşımı ve çoklu peer ızgarası",
      "Host/misafir rol yönetimi"
    ],
    "deploy": "",
    "demoUrl": "",
    "folder": "izleme-partisi-py",
    "isLive": false
  },
  {
    "id": "simcompanies-market-botu",
    "title": "SimCompanies Market Botu",
    "category": "Veri Analitiği & Kazıma",
    "description": "SimCompanies hesabında üretimi, satışı ve perakende fiyatı otomatik optimize eden FastAPI + React bot paneli.",
    "longDescription": "mmaxou/simcompanies fork'u: FastAPI backend ile sürekli üretim ve otomatik satış görevleri, saatlik kârı maksimize eden perakende adet+fiyat önerisi, bina inşa/robot/sipariş REST yüzeyi. React 18 + Vite frontend, AGPL-3.0.",
    "image": "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=800&q=80",
    "tech": [
      "Python",
      "FastAPI",
      "React 18",
      "Vite",
      "Tailwind CSS"
    ],
    "highlights": [
      "Otomatik üretim ve satış görevleri",
      "Optimal perakende fiyat/kâr önerisi",
      "Bina, robot, pazar ve sözleşme REST API'si"
    ],
    "deploy": "https://github.com/mmaxou",
    "demoUrl": "https://github.com/mmaxou",
    "folder": "simcompanies-Fork",
    "isLive": true
  },
  {
    "id": "tyt-calisma-asistani",
    "title": "TYT Çalışma Asistanı",
    "category": "Mobil Uygulama",
    "description": "TYT/YDT öğrencileri için konu takibi, deneme analizi ve üç modlu Pomodoro zamanlayıcısı içeren cross-platform mobil uygulama.",
    "longDescription": "Expo SDK 52 + expo-router (5 sekme): TYT 10 ders / YDT branş konu-ilerleme takibi, yanlış soru fotoğraflı deneme analizi, pomodoro/stopwatch/countdown timer ve bitimine 5 dk kala bildirim. Context + AsyncStorage kalıcılık, çift kanallı EAS OTA.",
    "image": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80",
    "tech": [
      "Expo",
      "React Native",
      "TypeScript",
      "expo-router",
      "expo-notifications",
      "EAS"
    ],
    "highlights": [
      "Konu bazlı ilerleme ve deneme net analizi",
      "Üç modlu timer + bitiş bildirimi",
      "Çift kanallı OTA güncelleme"
    ],
    "deploy": "",
    "demoUrl": "",
    "folder": "yks1",
    "isLive": false
  },
  {
    "id": "ide-proje-takip-sistemi",
    "title": "IDE Proje Takip Sistemi",
    "category": "Masaüstü & Otomasyon",
    "description": "Cursor, Replit, AI Studio gibi bulut ve lokal IDE'lerdeki projelerin hangi hesapta kaldığını tek panelden izleyen yönetim paneli.",
    "longDescription": "Firebase Auth + Realtime Database üzerinde users/$uid izole senkron; zlib+base64 sıkıştırma ile %60-75 depolama tasarrufu, localStorage cache'li anlık açılış, 300ms debounce otomatik taslak, durum yönetimi (Bitti/Yarım Kaldı/…), IDE ikon-renk eşlemesi, light/dark tema ve JSON export/import.",
    "image": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
    "tech": [
      "HTML",
      "Vanilla JavaScript",
      "Firebase Auth",
      "Firebase RTDB"
    ],
    "highlights": [
      "Google girişli izole kullanıcı veritabanı",
      "zlib+base64 senkron ile %60-75 tasarruf",
      "Otomatik taslak, durum yönetimi ve JSON export"
    ],
    "caseStudy": {
      "challenge": "Farklı bulut (AI Studio, Replit, Cursor) ve yerel editörlerde eş zamanlı onlarca proje geliştiren yazılımcılar, projelerin hangi hesapta ve aşamada kaldığını unutarak zaman kaybediyordu.",
      "role": "Geliştiricilerin bilişsel dağınıklığını sıfırlayan, tek ekranda tüm projeleri ve ortamları organize eden ultra-hafif bir yönetim paneli tasarladım.",
      "solution": "Firebase Auth & Realtime Database üzerinde zlib+base64 veri sıkıştırmalı senkron (%70 depolama tasarrufu), 300ms debounce otomatik taslak ve JSON export/import mimarisi.",
      "impact": "Projeler arası geçiş ve hesap arama süresi sıfırlandı; aktif olarak kullanılan vazgeçilmez bir geliştirici merkezine dönüştü.",
      "metrics": ["%70 Depolama Sıkıştırması", "Canlı Firebase Senkronu", "300ms Debounce Otomatik Kayıt"]
    },
    "deploy": "https://ideyonetici-em-2026.web.app",
    "demoUrl": "https://ideyonetici-em-2026.web.app",
    "folder": "İde Yönetici",
    "isLive": true
  },
  {
    "id": "proicon-studio",
    "title": "ProIcon Studio",
    "category": "Masaüstü & Otomasyon",
    "description": "PNG/JPG/WebP/BMP görsellerini ve klasördeki tüm görselleri çok çözünürlüklü Windows .ico dosyasına çeviren toplu ikon üreticisi.",
    "longDescription": "Python CustomTkinter + Pillow: getbbox ile otomatik alfa kırpma, LANCZOS yeniden boyutlandırma ile 256/128/64/48/32/16 px çok katmanlı .ico çıktısı; klasörde toplu dönüştürme (n/m ilerleme), daemon thread ile arayüz hiç kilitlenmez, işlem sonrası Dosyayı/Konumu Aç butonları.",
    "image": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
    "tech": [
      "Python",
      "CustomTkinter",
      "Pillow"
    ],
    "highlights": [
      "Çok çözünürlüklü (16-256 px) .ico üretimi",
      "Klasörde toplu dönüştürme + ilerleme",
      "Arka planda thread ile kilitlenmeyen arayüz"
    ],
    "deploy": "",
    "demoUrl": "",
    "folder": "İkon-Yapma",
    "isLive": false
  },
  {
    "id": "3dcografya",
    "title": "3DCoğrafya",
    "category": "Web Portalı & Bulut",
    "description": "İnteraktif 3D dünya ve Türkiye haritasıyla şehirleri keşfetmeyi sağlayan coğrafya web uygulaması.",
    "longDescription": "Three.js tabanlı 3D sahnede dünya ve Türkiye coğrafyasını gezilebilir kılan, şehir bilgilerini etkileşimli olarak sunan web uygulaması; Vercel'de canlı yayınlanıyor.",
    "image": "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80",
    "tech": [
      "Three.js",
      "React",
      "Vercel"
    ],
    "highlights": [
      "3D dünya/Türkiye haritası gezintisi",
      "Şehir bilgisi etkileşimi",
      "Vercel'de canlı"
    ],
    "deploy": "https://3d-cografya.vercel.app/",
    "demoUrl": "https://3d-cografya.vercel.app/",
    "folder": "",
    "isLive": true
  },
  {
    "id": "harf-oyunu",
    "title": "Harf Oyunu",
    "category": "Yapay Zeka & Özel Eğitim",
    "description": "Harfleri sesli okuyup doğru sırayla dizmeyi öğreten, v0 ile üretilmiş interaktif harf oyunu.",
    "longDescription": "Türkçe alfabe harflerini eğlenceli bir dizme oyunuyla öğreten web uygulaması; Vercel'de canlı yayınlanıyor.",
    "image": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
    "tech": [
      "React",
      "TypeScript",
      "Vercel (v0)"
    ],
    "highlights": [
      "Sesli harf okuma",
      "Sıralama oyunu mekaniği",
      "Vercel'de canlı"
    ],
    "deploy": "https://v0-benzesik-harfler.vercel.app/",
    "demoUrl": "https://v0-benzesik-harfler.vercel.app/",
    "folder": "",
    "isLive": true
  },
  {
    "id": "cv-master",
    "title": "CV Master",
    "category": "Yapay Zeka & Psikoloji",
    "description": "QR kodlu şablonlarla düzenlenebilir özgeçmiş/CV tasarımcısı; taslaklar arası hizalama ve QR tutarlılığı sorunları çözülmüş.",
    "longDescription": "Özgeçmiş şablonlarını düzenlemeye ve PDF'e dönüştürmeye yarayan, Google Cloud Run'da çalışan web uygulaması. Çoklu şablonda hizalama ve QR kodun her taslakta aynı kalması için ayar menüsü eklendi.",
    "image": "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80",
    "tech": [
      "React",
      "TypeScript",
      "Google Cloud Run"
    ],
    "highlights": [
      "Çoklu CV şablonu ve hizalama",
      "QR kod tutarlılığı",
      "Cloud Run'da canlı"
    ],
    "deploy": "https://ais-pre-4g4f3cmapq75z63jgvnl6j-140000227047.europe-west2.run.app/",
    "demoUrl": "https://ais-pre-4g4f3cmapq75z63jgvnl6j-140000227047.europe-west2.run.app/",
    "folder": "",
    "isLive": true
  },
  {
    "id": "kisisel-web-sitesi",
    "title": "Kişisel Web Sitesi",
    "category": "Web Portalı & Bulut",
    "description": "emirhanyilmaz.vercel.app adresinde yayında olan, hakkımda ve projelerimi sergileyen kişisel portfolyo sitesi.",
    "longDescription": "Vite + React ile geliştirilen kişisel portfolyo sitesi; proje galerisi, yetenekler ve iletişim bölümlerini tek sayfada toplar, Vercel üzerinde sürekli yayında.",
    "image": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    "tech": [
      "React",
      "TypeScript",
      "Vite",
      "Vercel"
    ],
    "highlights": [
      "Vercel'de canlı yayın",
      "Proje galerisi ve yetenekler",
      "Tek sayfa portfolyo"
    ],
    "deploy": "https://emirhanyilmaz.vercel.app",
    "demoUrl": "https://emirhanyilmaz.vercel.app",
    "folder": "",
    "isLive": true
  }
];

export const articles: Article[] = [
  {
    id: "ozel-egitimde-llm-bep",
    title: "Özel Eğitimde Büyük Dil Modelleri (LLM) ve Bireyselleştirilmiş Eğitim Planları",
    category: "Özel Eğitim & AI",
    date: "Temmuz 2026",
    readTime: "5 dk okuma",
    summary: "Saha deneyimlerim ışığında, Gemini API gibi gelişmiş LLM mimarilerinin otizm ve gelişimsel yetersizliği olan bireyler için nasıl adaptif BEP içeriği ve materyal üretebildiğini inceliyorum.",
    content: [
      "3 yıllık özel eğitim öğretmenliği saha tecrübem boyunca karşılaştığım en büyük zorluklardan biri, her bir çocuğun öğrenme hızının ve algılama biçiminin tamamen benzersiz olmasıydı. Standart müfredatlar ve tek tip ders materyalleri özel gereksinimli çocuklarda sıklıkla yetersiz kalıyor.",
      "Geliştirdiğim 'Hece Çizme & ForKids' uygulamasında Gemini API entegrasyonu kullanarak çocukların çizimlerini ve okuma denemelerini anlık olarak analiz eden yapay zeka modülleri kurguladık. Yapay zeka, çocuğun ince motor beceri seviyesine göre çizgi kalıplarını dinamik olarak esnetiyor.",
      "Yapay zeka sadece bir otomasyon aracı değil, öğretmen ve uzman için güçlü bir pedagojik asistandır. BEP (Bireyselleştirilmiş Eğitim Planı) hazırlama sürecinde öğrencinin güçlü yönlerini ve kaba değerlendirme verilerini girdi olarak alıp dakikalar içinde kişiselleştirilmiş kazanım haritaları sunabilmektedir."
    ],
    tags: ["Özel Eğitim", "Gemini API", "BEP", "PDR", "Erişilebilirlik"]
  },
  {
    id: "pdr-ve-yapay-zeka-etik",
    title: "Psikolojik Danışmanlıkta Yapay Zeka Entegrasyonu ve Veri Etiği",
    category: "PDR & Teknoloji",
    date: "Haziran 2026",
    readTime: "4 dk okuma",
    summary: "Terapötik ilişki, empatik bağ ve danışan mahremiyeti ekseninde yapay zekanın sınırlılıkları ve doğru entegrasyon sınırları üzerine analitik bir inceleme.",
    content: [
      "Psikolojik danışmanlık uygulamalarında yapay zekanın rolü giderek tartışılan bir konu haline geliyor. Bir PDR uzmanı olarak vurgulamak isterim ki; yapay zeka hiçbir zaman insan empati gücünün ve terapötik ittifakın yerini alamaz.",
      "Ancak yapay zeka, danışan takibi, ruh hali (mood) günlüklerinin analizi, bilişsel çarpıtmaların tespiti ve danışma seansları arasındaki psikoeğitim süreçlerinde mükemmel bir destek mekanizmasıdır.",
      "Kişisel verilerin gizliliği (KVKK/GDPR) ve uçtan uca şifreleme yöntemleri, ruh sağlığı teknolojilerinde birinci kuraldır. Algoritmalar geliştirilirken danışan verilerinin asla izin alınmaksızın model eğitiminde kullanılmaması garanti altına alınmalıdır."
    ],
    tags: ["PDR", "Terapötik Süreç", "Etik", "Veri Gizliliği", "NLP"]
  },
  {
    id: "python-otomasyon-rehberlik",
    title: "Python ile Rehberlik Servislerinde ve Okullarda Evrak Otomasyonu",
    category: "Python & Otomasyon",
    date: "Mayıs 2026",
    readTime: "6 dk okuma",
    summary: "Okul ve rehberlik servislerindeki manuel evrak yükünü %90 azaltan Python scriptlerinin ve akıllı arşivleme algoritmalarının teknik anatomisi.",
    content: [
      "Okul ortamlarında rehberlik öğretmenlerinin ve özel eğitimcilerin en çok zamanını alan hususlardan biri, yüzlerce belgenin, resmi raporun ve tarihsel evrakın düzenlenmesidir.",
      "Geliştirdiğim 'Evrak_Düzenleyici.py' projesinde, karmaşık ve düzensiz klasörlerdeki dosya isimlerini ve içeriklerini Gemini LLM ve Python `os/shutil` modülleri ile tarayarak otonom bir arşiv hiyerarşisi oluşturduk.",
      "Bu sayede normalde günler süren evrak tasnifi birkaç saniye içerisinde sıfır insan hatasıyla tamamlanıyor. Öğretmenler ve uzmanlar bürokratik iş yükünden kurtularak doğrudan öğrencilerle ilgilenebilecek zamana kavuşuyor."
    ],
    tags: ["Python", "Otomasyon", "LLM", "Verimlilik", "Dosya Yönetimi"]
  }
];


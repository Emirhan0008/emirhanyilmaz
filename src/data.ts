import { Project, Education, Experience } from './types';

// Import local image assets for correct bundler resolution
import projectMindflow from './assets/images/project_mindflow_1782982454856.jpg';
import projectPsybot from './assets/images/project_psybot_1782982473066.jpg';
import projectEmpathy from './assets/images/project_empathy_1782982489334.jpg';
import projectSpecialEdu from './assets/images/project_special_edu_1782982504669.jpg';

export const profileData = {
  name: "Emirhan YILMAZ",
  title: "Psikolojik Danışman & Yazılımcı",
  avatar: "https://ymszciupoambjhyagmzt.supabase.co/storage/v1/object/public/media/Gemini_Generated_Image_nzgrsrnzgrsrnzgr.png",
  about: "Aksaray Üniversitesi Rehberlik ve Psikolojik Danışmanlık mezunu bir profesyonel olarak, insan psikolojisini yenilikçi teknolojilerle birleştiriyorum. Marmara Üniversitesi Yapay Zeka ve Makine Öğrenmesi eğitimiyle pekiştirdiğim teorik bilgimi, 3 yıllık özel eğitim öğretmenliği saha deneyimim ve Python geliştirme becerilerimle harmanlayarak yenilikçi, insan odaklı dijital çözümler üretiyorum.",
  education: {
    school: "Aksaray Üniversitesi",
    degree: "Rehberlik ve Psikolojik Danışmanlık (PDR)",
    details: "Lisans Mezuniyeti — Psikolojik danışmanlık kuramları, terapötik beceriler ve gelişimsel psikoloji üzerine derinleşmiş eğitim."
  } as Education,
  softwareProfile: {
    language: "Python & React Native",
    level: "Yazılım Geliştirici & Entegrasyon Uzmanı",
    skills: ["Python (Demet/Pandas/NumPy)", "React Native / Expo", "Gemini API & AI Studio", "Firebase & Cloud NoSQL", "Masaüstü Otomasyonları"]
  },
  aiProfile: {
    title: "Yapay Zeka (AI) Entegrasyon Uzmanı",
    certification: "Marmara Üniversitesi Yapay Zeka ve Makine Öğrenmesi Başarı Sertifikası",
    details: "Büyük Dil Modelleri (LLM), Doğal Dil İşleme (NLP) uygulamaları ve makine öğrenmesi algoritmaları üzerine uzmanlaşmış sertifikasyon eğitimi."
  },
  experience: {
    title: "Özel Eğitim Öğretmenliği",
    period: "3 Yıl Saha Deneyimi",
    description: "1. ve 2. kademe özel eğitim sınıflarında aktif görev alarak gelişimsel zorlukları olan bireylerle birebir çalışma fırsatı buldum.",
    details: [
      "Bireyselleştirilmiş Eğitim Planlarının (BEP) hazırlanması ve uygulanması",
      "Bilişsel, sosyal ve duyusal becerileri destekleyen özel müfredat geliştirme",
      "Klinik gözlem, davranış yönetimi ve aile rehberliği çalışmaları",
      "Teknoloji destekli eğitim araçlarının özel eğitime uyarlanması"
    ]
  } as Experience
};

export const projects: Project[] = [
  {
    id: "meb-ags-yks",
    title: "MEB-AGS & YKS Çalışma Asistanı",
    category: "Mobil Uygulama",
    description: "Adayların sınav hazırlık süreçlerini, deneme sınavlarını ve performans grafiklerini uçtan uca takip edebilecekleri yüksek optimizasyonlu bir mobil çalışma asistanı.",
    longDescription: "Adayların sınav hazırlık süreçlerini, deneme sınavlarını ve performans grafiklerini uçtan uca takip edebilecekleri yüksek optimizasyonlu bir mobil çalışma asistanı geliştirildi. Mobil cihazlarda pil optimizasyonu ve yerel (native) bildirim yönetimi süreçleri kurgulandı. Fotoğrafları kalitesini bozmadan sıkıştırarak işleyen algoritmalar entegre edildi. Sürekli entegrasyonu (CI) hızlandırmak adına PowerShell tabanlı otomatik Git entegrasyon scriptleri yazıldı.",
    image: projectMindflow,
    tech: ["Expo", "React Native", "Node.js", "PowerShell", "Antigravity"],
    highlights: [
      "Pil optimizasyonu ve gelişmiş yerel bildirim yönetimi süreçleri",
      "Fotoğrafları kalitesini bozmadan sıkıştıran özel görüntü işleme algoritmaları",
      "PowerShell tabanlı otomatik Git entegrasyon ve hızlı CI/CD scriptleri"
    ]
  },
  {
    id: "hece-cizme-forkids",
    title: "Hece Çizme & ForKids",
    category: "Yapay Zeka & Özel Eğitim",
    description: "Özel gereksinimli çocukların dil, iletişim ve okuma-yazma becerilerini geliştirmeyi amaçlayan, yapay zeka entegrasyonlu interaktif mobil eğitim platformu.",
    longDescription: "Özel gereksinimli çocukların dil, iletişim ve okuma-yazma becerilerini geliştirmeyi amaçlayan, yapay zeka entegrasyonlu interaktif mobil eğitim platformu tasarlandı. Gemini API entegrasyonu ile çocukların çizim ve okuma süreçlerini gerçek zamanlı analiz eden yapay zeka modülleri mimariye dahil edildi. EAS Cloud altyapısı kullanılarak dağıtım ve APK derleme süreçleri otonom hale getirildi.",
    image: projectSpecialEdu,
    tech: ["React Native", "Google AI Studio", "Gemini API", "EAS Cloud"],
    highlights: [
      "Gemini API ile çocukların çizimlerini ve okuma süreçlerini anlık analiz eden yapay zeka modülleri",
      "Özel gereksinimli çocukların dil, iletişim ve motor becerilerine yönelik özel metodoloji",
      "EAS Cloud entegrasyonu sayesinde otonom APK derleme ve sürekli dağıtım"
    ]
  },
  {
    id: "medprep",
    title: "MedPrep",
    category: "Mobil Uygulama",
    description: "Tıp ve anatomi terimlerine yönelik günlük bilgi akışı sağlayan, veritabanı tabanlı medikal eğitim ve ezber asistanı.",
    longDescription: "Tıp ve anatomi terimlerine yönelik günlük bilgi akışı sağlayan, veritabanı tabanlı bir eğitim uygulaması geliştirildi. Kullanıcıların odaklanma sürelerini ölçen ve çalışma istatistiklerini dinamik olarak tutan zamanlayıcı modüller sisteme entegre edildi.",
    image: projectPsybot,
    tech: ["AI Studio", "JavaScript", "React Native", "Database"],
    highlights: [
      "Anatomi ve medikal terimler için optimize edilmiş veritabanı yapısı ve günlük akış",
      "Kullanıcıların odaklanma sürelerini anlık takip eden zamanlayıcı (Timer) modülleri",
      "Dinamik olarak tutulan çalışma istatistikleri ve performans takip grafikleri"
    ]
  },
  {
    id: "dersgezgin",
    title: "DersGezgin",
    category: "Web Portalı & Bulut",
    description: "Mobil uygulamalarla gerçek zamanlı (real-time) senkronize çalışan, öğretmenlere yönelik web tabanlı bir veri ve evrak yönetim portalı.",
    longDescription: "Mobil uygulamalarla gerçek zamanlı (real-time) senkronize çalışan, öğretmenlere yönelik web tabanlı bir veri ve evrak yönetim portalı kuruldu. Firebase Realtime Database entegrasyonu ile veri senkronizasyonundaki gecikmeler minimuma indirildi ve Firebase Hosting ile hızlı dağıtım (deployment) süreçleri yönetildi.",
    image: projectEmpathy,
    tech: ["React", "Firebase Hosting", "Cloud NoSQL (RTDB)", "Realtime Sync"],
    highlights: [
      "Mobil uygulamalarla kusursuz çalışan anlık (real-time) senkronizasyon altyapısı",
      "Firebase Realtime Database entegrasyonu ile sıfıra yakın veri gecikmesi",
      "Firebase Hosting sayesinde ultra hızlı ve kararlı canlı dağıtım (deployment) süreci"
    ]
  },
  {
    id: "zit-kelime-harf",
    title: "Zıt Kelime & Harf Oyunları",
    category: "Yapay Zeka & Özel Eğitim",
    description: "Çocukların kelime haznesini ve dil becerilerini geliştirmek amacıyla benzer harflerin tespiti ve harf dizilimleri üzerine kurgulanmış web tabanlı interaktif oyunlar.",
    longDescription: "Çocukların kelime haznesini ve dil becerilerini geliştirmek amacıyla benzer harflerin tespiti ve harf dizilimleri üzerine kurgulanmış web tabanlı interaktif eğitim oyunları prototiplendi. Vercel altyapısı kullanılarak bulut üzerinde canlıya alındı.",
    image: projectSpecialEdu,
    tech: ["Bolt.new", "v0", "Next.js", "Vercel"],
    highlights: [
      "Çocukların bilişsel gelişimini destekleyici interaktif oyun kurguları",
      "Harf eşleme ve zıt kelime tespiti yapan dinamik JavaScript algoritmaları",
      "Vercel entegrasyonu ile kesintisiz ve yüksek performanslı bulut barındırma"
    ]
  },
  {
    id: "evrak-duzenleyici",
    title: "Evrak_Düzenleyici.py",
    category: "Masaüstü & Otomasyon",
    description: "Gemini yapay zeka entegrasyonuyla okul evraklarını analiz ederek otonom olarak sınıflandıran akıllı dosya yönetim ve arşivleme otomasyonu.",
    longDescription: "Harici bellekler içerisindeki dağınık ve düzensiz okul evraklarını, Gemini yapay zeka entegrasyonuyla analiz ederek önce isimlerine, ardından tarih kriterlerine göre otonom olarak okul klasörlerine ayıran akıllı bir dosya yönetim ve arşivleme scripti geliştirildi. Dosya tasnif süreçlerindeki insan hatası sıfıra indirildi.",
    image: projectMindflow,
    tech: ["Python", "Gemini API", "OS & Shutil", "File I/O"],
    highlights: [
      "Düzensiz ve dağınık dökümanları akıllıca sınıflandıran Gemini LLM analiz motoru",
      "İsim ve tarih eşleştirmesine dayalı otonom klasör hiyerarşisi oluşturma",
      "Dosya yönetim operasyonlarında insan hatasını tamamen sıfıra indiren kararlılık"
    ]
  },
  {
    id: "ide-yonetici",
    title: "İde Yönetici",
    category: "Masaüstü & Otomasyon",
    description: "Yerel ve bulut tabanlı farklı IDE ve hesaplarda yer alan projelerin yönetimini, takibini ve durum kontrolünü tek merkezden sağlayan GUI paneli.",
    longDescription: "Yerel (local) ve bulut tabanlı (Cursor, Replit vb.) farklı IDE ve hesaplarda yer alan projelerin yönetimini, takibini ve durum kontrolünü tek bir merkezden sağlayan masaüstü GUI paneli tasarlandı. Çoklu hesap ve proje dizini karmaşasını çözen, asenkron çalışan kararlı bir durum yönetim mimarisi kurgulandı.",
    image: projectPsybot,
    tech: ["Python", "CustomTkinter", "JSON State Management", "OpenCode"],
    highlights: [
      "Çoklu geliştirici hesabı ve proje karmaşasını ortadan kaldıran şık masaüstü GUI",
      "Asenkron durum yönetimi (State Management) ile anlık proje durum güncellemeleri",
      "Yerel ve bulut ortamları (Cursor, Replit vb.) arasındaki proje bağlantılarını kolaylaştırma"
    ]
  },
  {
    id: "otonom-yedekleme",
    title: "Otonom Yedekleme ve Sistem Optimizasyonu",
    category: "Masaüstü & Otomasyon",
    description: "Arka planda çalışarak belirlenen dizinlerdeki dosya değişikliklerini anlık olarak hedef dizine senkronize eden hibrit sistem aracı.",
    longDescription: "Arka planda çalışarak belirlenen dizinlerdeki dosya değişikliklerini (güncelleme, silme, ad değiştirme) anlık olarak hedef dizine senkronize eden sistem araçları yazıldı. Windows bildirim mekanizmalarıyla entegre, kaynak tüketimi düşük bir arka plan motoru kurgulandı. Büyük dosya tespit algoritmalarında performansı artırmak adına Python ve C# bileşenlerinin birlikte çalıştığı hibrit bir yapı kuruldu.",
    image: projectEmpathy,
    tech: ["Python", "C#", "Windows Notification API", "Pillow", "PyAutoGUI"],
    highlights: [
      "Düşük CPU ve RAM kullanımıyla sürekli arka planda izleme ve senkronizasyon",
      "Yüksek performans için C# ve Python bileşenlerinin bir arada çalıştığı hibrit yapı",
      "Kullanıcıyı bilgilendiren yerel Windows bildirimleri entegrasyonu"
    ]
  },
  {
    id: "simcompanies-market",
    title: "SimCompanies Market Analiz Sistemi",
    category: "Veri Analitiği & Kazıma",
    description: "Canlı sohbet günlüklerini ve API verilerini anlık analiz ederek finansal yatırım fırsatlarını raporlayan veri analiz aracı.",
    longDescription: "SimCompanies simülasyonuna ait canlı sohbet günlüklerini ve API verilerini anlık olarak analiz ederek finansal yatırım fırsatlarını raporlayan veri analiz aracı geliştirildi. Büyük boyutlu metin verilerini işleyen regex ve ayrıştırma (parsing) algoritmaları optimize edildi. Veri güvenliği katmanı için kriptografik şifreleme yöntemleri entegre edildi.",
    image: projectMindflow,
    tech: ["Python", "Windsurf", "Cryptography", "API Integration", "Log Parsing"],
    highlights: [
      "Canlı oyun pazar verilerini ve sohbet loglarını analiz eden anlık veri işleme",
      "Büyük metin yığınlarında en iyi fiyatı saptayan optimize regex ve parsing algoritmaları",
      "Veri bütünlüğü ve gizliliğini koruyan kriptografik şifreleme katmanı"
    ]
  },
  {
    id: "ruh-sagligi-portali",
    title: "Ruh Sağlığı ve Yapay Zeka Portalı",
    category: "Yapay Zeka & Psikoloji",
    description: "Psikolojik sağlığı yapay zeka destekli modüllerle analiz etmeyi ve destekleyici içerikler sunmayı amaçlayan niş web platformu.",
    longDescription: "Psikolojik sağlığı yapay zeka destekli modüllerle analiz etmeyi ve kullanıcılara durum bazlı destekleyici içerikler sunmayı amaçlayan niş bir web platformu tasarlandı. Yapay zeka modellerinin web arayüzü ile düşük gecikmeyle haberleşmesi sağlandı.",
    image: projectPsybot,
    tech: ["AI Studio", "Web Teknolojileri", "React", "Gemini API"],
    highlights: [
      "Kullanıcıların duygu durum analizlerini yapan yapay zeka entegrasyonu",
      "Yüksek yanıt hızı için optimize edilmiş sunucu-istemci bağlantısı",
      "Zihinsel sağlığa yönelik bilimsel destekleyici içerikler ve akıllı arama modülleri"
    ]
  },
  {
    id: "pythonist-ai",
    title: "Pythonist AI & Bot Sistemleri",
    category: "Veri Analitiği & Kazıma",
    description: "Python geliştirme süreçlerine kod asistanlığı sağlayan yapay zeka modülleri ve anti-bot Playwright veri madenciliği araçları.",
    longDescription: "Python geliştirme süreçlerine kod asistanlığı sağlayan yapay zeka modülleri kurgulandı. playwright-stealth kullanılarak anti-bot mekanizmalarına takılmayan veri madenciliği araçları ve asenkron mimari (asyncio) sayesinde donanım sinyallerini bloklamadan işleyen Bluetooth düşük enerjili (BLE) cihaz kontrol scriptleri geliştirildi.",
    image: projectEmpathy,
    tech: ["Python", "AI Studio", "Playwright (Stealth)", "Bleak (BLE)", "Asyncio"],
    highlights: [
      "Kod kalitesini artıran ve hataları anında düzeltmeye yardım eden yapay zeka asistanı",
      "Playwright Stealth ile modern web korumalarını aşan kararlı veri madenciliği",
      "Bluetooth düşük enerjili (BLE) sinyalleri asenkron işleyen otonom kontrol altyapısı"
    ]
  },
  {
    id: "butcedostu",
    title: "BütçeDostu",
    category: "Finans & Kreatif",
    description: "Gelir ve gider dengesini optimize eden, harcamaları kategorize edip raporlar sunan şık ve minimal finansal takip aracı.",
    longDescription: "Aylık gelir ve gider dengesini optimize etmek, harcama kalemlerini kategorize etmek ve kullanıcıya bütçe raporları sunmak amacıyla tasarlanmış temiz ve minimal bir finansal takip aracı geliştirildi.",
    image: projectMindflow,
    tech: ["AI Studio", "React Native", "Web Technologies", "Local Storage"],
    highlights: [
      "Kullanıcı dostu, göz yormayan, sade ve etkili finansal gösterge paneli",
      "Harcama kalemlerini yapay zeka desteğiyle otomatik kategorize etme",
      "Kullanıcı verilerini tamamen cihazda tutan güvenli yerel depolama modeli"
    ]
  },
  {
    id: "westworld-clock",
    title: "Westworld Stormy Hour",
    category: "Finans & Kreatif",
    description: "WebGL tabanlı suluboya ve mürekkep sızıntısı simülasyonları içeren premium sanatsal dijital saat.",
    longDescription: "WebGL tabanlı suluboya ve mürekkep sızıntısı simülasyonları içeren, lifli kağıt dokusu ve yüksek görsel derinliğe sahip premium bir dijital saat arayüzü tasarlandı. Tarayıcı performansını zorlamadan akıcı akışkan simülasyonları oluşturmak için GPU tabanlı render teknikleri optimize edildi.",
    image: projectSpecialEdu,
    tech: ["JavaScript", "WebGL", "HTML5 Canvas", "CSS3", "Antigravity"],
    highlights: [
      "Sanatsal mürekkep sızıntısı ve suluboya efektlerini dinamik canlandıran WebGL motoru",
      "GPU tabanlı render sayesinde 60 FPS akıcı akışkan simülasyon performansı",
      "Westworld estetiğinden ilham alan yüksek derinlikli lifli kağıt dokusu tasarımı"
    ]
  },
  {
    id: "cv-master",
    title: "CV-Master",
    category: "Finans & Kreatif",
    description: "Profesyonel özgeçmişler oluşturmayı sağlayan, milimetrik hizalamalı ve dinamik QR kodlu akıllı CV hazırlama uygulaması.",
    longDescription: "Kullanıcıların profesyonel özgeçmişler oluşturmasını sağlayan, dinamik şablon yapısına sahip bir CV hazırlama uygulaması geliştirildi. Taslaklar üzerindeki milimetrik hizalama problemleri çözüldü ve dinamik QR kod entegrasyonu başarıyla sisteme dahil edildi.",
    image: projectPsybot,
    tech: ["AI Studio", "PDF Generation API", "QR Code API", "Tailwind CSS"],
    highlights: [
      "Şablonlar üzerindeki milimetrik piksel kayması ve hizalama sorunlarının giderilmesi",
      "İletişim bilgilerini ve portfolyoyu içeren dinamik olarak üretilen QR kod modülü",
      "Farklı kariyer alanları için tasarlanmış şık ve modern CV şablonu seçenekleri"
    ]
  }
];

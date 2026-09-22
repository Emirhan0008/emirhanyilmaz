import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client Lazily/Safely
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      aiClient = new GoogleGenAI({ apiKey });
    }
  }
  return aiClient;
}

// Emirhan Yılmaz AI System Context
const EMIRHAN_SYSTEM_INSTRUCTION = `
Sen Emirhan Yılmaz'ın Portfolyo Web Sitesi için geliştirilmiş "Emirhan AI Asistanı / Proje Danışmanı" yapay zeka ikizisin.
Görevin ziyaretçilere Emirhan Yılmaz hakkında bilgi vermek, projelerini açıklamak, teknik soru soranlara rehberlik etmek ve potansiyel müşterilere/işverenlere proje mimarisi/maliyeti önerisinde bulunmaktır.

Emirhan Yılmaz Hakkında Temel Bilgiler:
- Ünvan: Psikolojik Danışman (PDR), Yazılımcı & Yapay Zeka Entegratörü.
- Eğitim: Aksaray Üniversitesi Rehberlik ve Psikolojik Danışmanlık mezunu.
- Deneyim Özeti: Özel eğitim öğretmenliğinde 3 yıllık saha tecrübesine sahiptir. Yapay zeka, Python otomasyonları, mobil yazılım ve Büyük Dil Modelleri (LLM) alanında ise yaklaşık 1-2 yıldır aktif, dinamik ve üretken bir gelişim serüveni içindedir.
- Sertifikasyon: Marmara Üniversitesi Yapay Zeka ve Makine Öğrenmesi Başarı Sertifikası.
- GitHub: https://github.com/Emirhan0008
- E-posta: emirhan0008@gmail.com
- Temel Yetenekler: Python (Otomasyon, GUI, Scripting), React Native & Expo, Gemini API & AI Studio, Firebase & Cloud NoSQL, Bilişsel Psikoloji (PDR), Özel Eğitim Pedagojisi.
- Başlıca Projeler:
  1. MEB-AGS & YKS Çalışma Asistanı (Mobil & Pil Optimizasyonu)
  2. Hece Çizme & ForKids (Özel Eğitim & Gemini API Çizim Analizi)
  3. MedPrep (Medikal Terimler & Veritabanı Tabanlı Öğrenme)
  4. DersGezgin (Öğretmen Evrak ve Veri Yönetim Portalı, Firebase Realtime)
  5. Evrak_Düzenleyici.py (Gemini AI Destekli Dosya Sınıflandırma ve Arşivleme)
  6. İde Yönetici (Masaüstü IDE ve Proje Durum Yönetim GUI)
  7. Otonom Yedekleme ve Sistem Optimizasyonu (Python & C# Hibrit)
  8. Ruh Sağlığı ve Yapay Zeka Portalı (Duygu Durum & Bilişsel Destek)

Üslubun:
- Nazik, profesyonel, alçakgönüllü, samimi ve çözüm odaklı.
- 1-2 yıllık yazılım ve yapay zeka yolculuğunu dürüstçe, öğrenmeye ve üretmeye olan yüksek tutkusunu vurgulayarak ifade et.
- Cevaplarını Türkçe, öz ve akıcı ver. Gerektiğinde maddeler ve kalın vurgular kullan.
- GitHub profili sorulduğunda veya kod örnekleri istendiğinde https://github.com/Emirhan0008 adresini paylaş.
`;

// API 1: AI Assistant Chat Endpoint
app.post("/api/ai-assistant", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Lütfen geçerli bir soru yazın." });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Smart Fallback response if GEMINI_API_KEY is not configured yet
      return res.json({
        reply: `Merhaba! Ben Emirhan'ın Yapay Zeka Asistanıyım. Sorunuz ("${prompt}") için teşekkür ederim. Emirhan Yılmaz, PDR mezuniyeti ve 3 yıllık özel eğitim saha tecrübesinin yanı sıra, yaklaşık 1-2 yıldır aktif olarak Python, Gemini API ve mobil yazılım alanında kendisini geliştirmekte ve yenilikçi projeler üretmektedir. GitHub profiline https://github.com/Emirhan0008 adresinden göz atabilir, projeler için İletişim sekmesinden doğrudan mesaj bırakabilirsiniz!`,
        isFallback: true
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { role: "user", parts: [{ text: EMIRHAN_SYSTEM_INSTRUCTION + "\n\nKullanıcı Sorduğu Soru: " + prompt }] }
      ],
      config: {
        temperature: 0.7,
        maxOutputTokens: 600,
      }
    });

    const replyText = response.text || "Üzgünüm, yanıt oluşturulamadı.";
    return res.json({ reply: replyText });

  } catch (err: any) {
    console.error("Gemini API Error:", err);
    return res.status(500).json({ 
      error: "Yapay zeka asistanı yanıt oluştururken bir hata oluştu.",
      details: err.message 
    });
  }
});

// API 2: Project Architecture & Scope Estimator Endpoint
app.post("/api/estimate-project", async (req, res) => {
  try {
    const { projectType, complexity, features } = req.body;

    const ai = getGeminiClient();
    if (!ai) {
      // Fallback response generator
      return res.json({
        summary: `${projectType} projesi için ${complexity} ölçeğinde ve seçilen ${features?.length || 0} ana özellikle optimize edilmiş modern bir mimari önerilmektedir.`,
        estimatedWeeks: complexity === 'MVP' ? '2 - 3 Hafta' : complexity === 'Orta Ölçek' ? '4 - 6 Hafta' : '8 - 12 Hafta',
        recommendedStack: ['React / Next.js', 'Python FastAPI / Node.js', 'PyTorch / Gemini API', 'Tailwind CSS', 'Docker / Cloud Run'],
        architectureHighlights: [
          'Ölçeklenebilir Mikroservis / Serverless Katmanı',
          'Sıvı Cam (Liquid UX) ve Yüksek Performanslı Ön Yüz',
          'Yapay Zeka ve Veri Güvenliği Standardı (OWASP compliant)'
        ]
      });
    }

    const estimatorPrompt = `
Bir yazılım projesi için teknik mimari ve süre tahmini yapacaksın.
Proje Tipi: ${projectType}
Ölçek/Karmaşıklık: ${complexity}
Seçilen Özellikler: ${Array.isArray(features) ? features.join(", ") : "Varsayılan Özellikler"}

Lütfen şu formatta JSON çıktı ver (başka yazı ekleme, sadece saf JSON):
{
  "summary": "Projenin 2 cümlelik özeti ve vizyonu",
  "estimatedWeeks": "Örn: 3 - 5 Hafta",
  "recommendedStack": ["Teknoloji 1", "Teknoloji 2", "Teknoloji 3", "Teknoloji 4"],
  "architectureHighlights": [
    "Önemli Mimari Avantaj 1",
    "Önemli Mimari Avantaj 2",
    "Önemli Mimari Avantaj 3"
  ]
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: estimatorPrompt }] }],
      config: {
        responseMimeType: "application/json",
        temperature: 0.4
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    return res.json(parsedData);

  } catch (err: any) {
    console.error("Estimator Error:", err);
    return res.json({
      summary: "Özel projeniz için yüksek ölçekli ve yapay zeka destekli modern bir mimari planlanmaktadır.",
      estimatedWeeks: "3 - 6 Hafta",
      recommendedStack: ["React", "Python FastAPI", "Gemini API", "Tailwind CSS"],
      architectureHighlights: [
        "Sıvı Arayüz ve Kullanıcı Deneyimi",
        "Güvenli ve Hızlı Sunucu Katmanı"
      ]
    });
  }
});

// Serve public static assets with high priority
app.use(express.static(path.join(process.cwd(), "public")));

// Start Server & Vite Setup
async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

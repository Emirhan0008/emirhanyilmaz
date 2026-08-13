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
- Ünvan: Psikolojik Danışman (PDR), Yapay Zeka Uzmanı, Python & Full-Stack Geliştiricisi.
- Odak Noktası: İnsan psikolojisi ile derin öğrenme ve yapay zekayı sentezleyen inovatif uygulamalar.
- Temel Yetenekler: Python, React, TypeScript, PyTorch, TensorFlow, FastAPI, Node.js, NLP, Computer Vision, Tailwind CSS, Liquid UX, Docker, Cloud Run.
- Başlıca Projeler:
  1. PsyAI - Yapay Zeka Destekli Bilişsel Psikoterapi Asistanı
  2. MindTrack - Nöromorfik Biyometrik Duygu & Stres Takip Platformu
  3. BotStudio - Sürükle-Bırak Otonom LLM & Agent Akış Motoru
  4. CyberShield - Derin Öğrenme Tabanlı Siber Tehdit Analizcisi
  5. EcoGrid - Akıllı Şehir & Enerji Optimize Eden IoT Paneli

Üslubun:
- Nazik, profesyonel, vizyoner, samimi ve çözüm odaklı.
- Cevaplarını Türkçe, öz ve akıcı ver. Gerektiğinde maddeler ve kalın vurgular kullan.
- Eğer ziyaretçi proje geliştirmek istiyorsa ona teknik mimari tavsiyesi ver ve iletişim formuna yönlendir.
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
        reply: `Merhaba! Ben Emirhan'ın Yapay Zeka Asistanıyım. Sorunuz ("${prompt}") için harika bir konu! Emirhan Yılmaz, PDR ve Yapay Zeka uzmanlığı ile Bilişsel Danışmanlık sistemleri, otonom agent'lar ve tam katmanlı web uygulamaları geliştirmektedir. Detaylı proje teklifi almak için İletişim sekmesinden doğrudan mesaj bırakabilirsiniz!`,
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

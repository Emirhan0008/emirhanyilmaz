import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

// Security: Express trust proxy (needed for Cloud Run / GCP load balancer IP resolution)
app.set("trust proxy", 1);

// Security: Disable Express fingerprinting
app.disable("x-powered-by");

// Security: Defensive HTTP Headers
app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  // CSP allows local resources, safe data images, Google Fonts, and AI API endpoints
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https:; media-src 'self' data: blob:; connect-src 'self' https://api.groq.com https://generativelanguage.googleapis.com https://formsubmit.co; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors *;"
  );
  next();
});

// Security: Enforce strict JSON payload size limit to prevent memory exhaustion DoS
app.use(express.json({ limit: "100kb" }));

// Security: In-Memory IP Rate Limiter with Max Entries Cap to prevent HashDoS / Memory Exhaustion
const MAX_RATE_LIMIT_ENTRIES = 5000;
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Periodic garbage collection for rate-limit cache (every 60s)
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}, 60000);

function apiRateLimiter(req: express.Request, res: express.Response, next: express.NextFunction) {
  // Use securely resolved req.ip via trust proxy
  const ip = (req.ip || req.socket.remoteAddress || "unknown").toString().trim();
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute window
  const maxRequests = 45; // Max 45 API calls per minute per IP

  // Prevent memory exhaustion if map gets too large
  if (rateLimitMap.size > MAX_RATE_LIMIT_ENTRIES) {
    rateLimitMap.clear();
  }

  let record = rateLimitMap.get(ip);
  if (!record || now > record.resetTime) {
    record = { count: 1, resetTime: now + windowMs };
    rateLimitMap.set(ip, record);
  } else {
    record.count++;
  }

  if (record.count > maxRequests) {
    return res.status(429).json({
      error: "Çok fazla istek gönderildi. Lütfen bir süre bekleyip tekrar deneyin."
    });
  }
  next();
}

// Security: Strict Content-Type and CSRF validation on API routes
function apiSecurityGuard(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (req.method === "POST") {
    const contentType = req.headers["content-type"] || "";
    if (!contentType.includes("application/json")) {
      return res.status(415).json({ error: "Geçersiz içerik tipi. Sadece application/json kabul edilir." });
    }

    // Origin validation: block cross-origin requests from arbitrary foreign domains
    const origin = req.headers.origin;
    const host = req.headers.host;
    if (origin && host) {
      try {
        const originUrl = new URL(origin);
        // Allow same host or valid development preview hosts
        const isSameHost = originUrl.host === host;
        const isRunApp = originUrl.hostname.endsWith(".run.app") || originUrl.hostname === "localhost" || originUrl.hostname === "127.0.0.1";
        if (!isSameHost && !isRunApp) {
          return res.status(403).json({ error: "Yetkisiz çapraz kaynak isteği engellendi." });
        }
      } catch {
        return res.status(400).json({ error: "Geçersiz kaynak bilgisi." });
      }
    }
  }
  next();
}

app.use("/api", apiRateLimiter, apiSecurityGuard);

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

const CAT_SYSTEM_INSTRUCTION = `
Sen Emirhan Yılmaz'ın portfolyosundaki akıllı ve sevimli kedi asistanısın.

KATI VE DEĞİŞMEZ KURALLAR:
1. ASLA eski, tahmini, uydurma veya sitede yer almayan bilgi verme.
2. Kısa, basit ve doğrudan cevap ver. Maksimum 1-2 cümle.
3. Asla abartılı övgü veya yapmacık sıfatlar kullanma. Mütevazı ve profesyonel ol.
4. Minik ve sevimli bir kedi dokunuşu (Miyav 🐾) yeterlidir.
5. Kullanıcıyı yönlendirirken 'Projeler', 'İletişim' veya 'Terminal' kelimelerini doğrudan kullan.
6. Bilmediğin veya sitede bulunmayan her konuda doğrudan 'İletişim' sekmesine yönlendir.

GÜNCEL BİLGİLER:
- Kişi: Emirhan Yılmaz (Psikolojik Danışman & Yazılımcı)
- Eğitim: Aksaray Üniversitesi PDR mezunu. 3 yıllık özel eğitim öğretmenliği tecrübesi.
- Yazılım: Python, React Native, Gemini API, Firebase.
- İletişim: emirhan0008@gmail.com, github.com/Emirhan0008, Telegram: t.me/emirhanyilmazrpd
`.trim();

// API 1: AI Assistant Chat Endpoint
app.post("/api/ai-assistant", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Lütfen geçerli bir soru yazın." });
    }

    const trimmedPrompt = prompt.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "").trim();
    if (trimmedPrompt.length > 1000) {
      return res.status(400).json({ error: "Soru uzunluğu en fazla 1000 karakter olabilir." });
    }
    if (!trimmedPrompt) {
      return res.status(400).json({ error: "Lütfen geçerli bir soru yazın." });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        reply: `Merhaba! Ben Emirhan'ın Yapay Zeka Asistanıyım. Sorunuz için teşekkür ederim. Emirhan Yılmaz, PDR mezuniyeti ve 3 yıllık özel eğitim saha tecrübesinin yanı sıra, yaklaşık 1-2 yıldır aktif olarak Python, Gemini API ve mobil yazılım alanında kendisini geliştirmekte ve yenilikçi projeler üretmektedir. Detaylı bilgi ve projeler için Projeler sekmesine veya İletişim bölümüne göz atabilirsiniz!`,
        isFallback: true
      });
    }

    let replyText = "";
    const candidateModels = ["gemini-3.6-flash", "gemini-3.1-flash-lite", "gemini-flash-latest"];
    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: [
            { role: "user", parts: [{ text: EMIRHAN_SYSTEM_INSTRUCTION + "\n\nKullanıcı Sorduğu Soru: " + trimmedPrompt }] }
          ],
          config: {
            temperature: 0.7,
            maxOutputTokens: 600,
          }
        });
        if (response.text?.trim()) {
          replyText = response.text.trim();
          break;
        }
      } catch {
        // Try next fallback model
      }
    }

    if (replyText) {
      return res.json({ reply: replyText });
    }

    // Graceful fallback if all models temporarily unavailable
    return res.json({
      reply: `Merhaba! Ben Emirhan'ın Yapay Zeka Danışmanıyım. Sorunuz için teşekkür ederim. Emirhan Yılmaz, PDR (Psikolojik Danışmanlık ve Rehberlik) mezuniyeti ve 3 yıllık özel eğitim tecrübesinin yanı sıra; yaklaşık 1-2 yıldır aktif olarak Python otomasyonları, Gemini API ve mobil yazılım alanında kendisini geliştirmekte ve yenilikçi projeler üretmektedir. Detaylı bilgi için Projeler ve İletişim sekmelerine göz atabilirsiniz!`,
      isFallback: true
    });

  } catch (err: any) {
    console.error("Gemini API Error:", err?.message || err);
    return res.json({ 
      reply: `Merhaba! Emirhan Yılmaz, PDR mezuniyeti ve özel eğitim deneyiminin yanı sıra yaklaşık 1-2 yıldır aktif olarak Python otomasyonları ve yapay zeka entegrasyonu üzerine çalışmaktadır. Detaylar için Projeler sekmesini inceleyebilirsiniz!`,
      isFallback: true
    });
  }
});

// API 2: Project Architecture & Scope Estimator Endpoint
app.post("/api/estimate-project", async (req, res) => {
  try {
    const { projectType, complexity, features } = req.body;

    // Validate inputs
    const safeType = typeof projectType === "string" ? projectType.slice(0, 100) : "Web & Mobil";
    const safeComplexity = typeof complexity === "string" ? complexity.slice(0, 50) : "MVP";
    const safeFeatures = Array.isArray(features) 
      ? features.filter((f): f is string => typeof f === "string").slice(0, 10).map(f => f.slice(0, 80))
      : [];

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        summary: `${safeType} projesi için ${safeComplexity} ölçeğinde ve seçilen ${safeFeatures.length} ana özellikle optimize edilmiş modern bir mimari önerilmektedir.`,
        estimatedWeeks: safeComplexity === 'MVP' ? '2 - 3 Hafta' : safeComplexity === 'Orta Ölçek' ? '4 - 6 Hafta' : '8 - 12 Hafta',
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
Proje Tipi: ${safeType}
Ölçek/Karmaşıklık: ${safeComplexity}
Seçilen Özellikler: ${safeFeatures.length > 0 ? safeFeatures.join(", ") : "Varsayılan Özellikler"}

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

    let response;
    try {
      response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: [{ role: "user", parts: [{ text: estimatorPrompt }] }],
        config: {
          responseMimeType: "application/json",
          temperature: 0.4
        }
      });
    } catch {
      response = await ai.models.generateContent({
        model: "gemini-flash-latest",
        contents: [{ role: "user", parts: [{ text: estimatorPrompt }] }],
        config: {
          responseMimeType: "application/json",
          temperature: 0.4
        }
      });
    }

    const rawText = response.text || "{}";
    const cleanedJsonStr = rawText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    const parsedData = JSON.parse(cleanedJsonStr);
    // Sanitize output keys to prevent object pollution
    const safeOutput = {
      summary: typeof parsedData.summary === "string" ? parsedData.summary.slice(0, 500) : "Özel proje mimarisi.",
      estimatedWeeks: typeof parsedData.estimatedWeeks === "string" ? parsedData.estimatedWeeks.slice(0, 50) : "3 - 5 Hafta",
      recommendedStack: Array.isArray(parsedData.recommendedStack) 
        ? parsedData.recommendedStack.filter((s: unknown): s is string => typeof s === "string").slice(0, 8) 
        : ["React", "Python FastAPI", "Gemini API"],
      architectureHighlights: Array.isArray(parsedData.architectureHighlights)
        ? parsedData.architectureHighlights.filter((h: unknown): h is string => typeof h === "string").slice(0, 6)
        : ["Yüksek Performans", "Güvenli Mimari"]
    };
    return res.json(safeOutput);

  } catch (err: any) {
    console.error("Estimator Error:", err?.message || err);
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

// API 3: Secure Server-Side Cat Companion Endpoint
// Prevents exposing Groq or Gemini API keys to the browser bundle
app.post("/api/cat-assistant", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Geçersiz mesaj formatı." });
    }

    const cleanMessage = message.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "").trim().slice(0, 500);
    if (!cleanMessage) {
      return res.status(400).json({ error: "Mesaj boş olamaz." });
    }

    // Sanitize conversation history (max 4 turns)
    const sanitizedHistory: { role: "user" | "assistant"; content: string }[] = [];
    if (Array.isArray(history)) {
      for (const item of history.slice(-4)) {
        if (item && typeof item.text === "string") {
          sanitizedHistory.push({
            role: item.sender === "user" ? "user" : "assistant",
            content: String(item.text).slice(0, 300)
          });
        }
      }
    }

    // 1. Try Server-Side Groq API if key is available in environment
    const groqKey = process.env.GROQ_API_KEY;
    if (groqKey) {
      const groqModels = ["qwen/qwen3.8-27b", "openai/gpt-oss-120b", "llama-3.3-70b-versatile"];
      for (const model of groqModels) {
        try {
          const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${groqKey}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              model,
              messages: [
                { role: "system", content: CAT_SYSTEM_INSTRUCTION },
                ...sanitizedHistory,
                { role: "user", content: cleanMessage }
              ],
              max_tokens: 80,
              temperature: 0.4
            }),
            signal: AbortSignal.timeout(7000) // Timeout after 7s to prevent stalled connections
          });

          if (groqRes.ok) {
            const data = await groqRes.json();
            let text = data.choices?.[0]?.message?.content || "";
            text = text.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
            if (text) {
              return res.json({ reply: text });
            }
          }
        } catch {
          // Fall through to next model or Gemini
        }
      }
    }

    // 2. Fallback to Server-Side Gemini
    const ai = getGeminiClient();
    if (ai) {
      let response;
      try {
        response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: [
            {
              role: "user",
              parts: [{
                text: `${CAT_SYSTEM_INSTRUCTION}\n\nKullanıcı Sorusuna maksimum 1-2 cümlelik sevimli kedi üslubuyla Türkçe yanıt ver: "${cleanMessage}"`
              }]
            }
          ],
          config: {
            temperature: 0.5,
            maxOutputTokens: 100
          }
        });
      } catch {
        response = await ai.models.generateContent({
          model: "gemini-flash-latest",
          contents: [
            {
              role: "user",
              parts: [{
                text: `${CAT_SYSTEM_INSTRUCTION}\n\nKullanıcı Sorusuna maksimum 1-2 cümlelik sevimli kedi üslubuyla Türkçe yanıt ver: "${cleanMessage}"`
              }]
            }
          ],
          config: {
            temperature: 0.5,
            maxOutputTokens: 100
          }
        });
      }

      const replyText = response.text?.trim();
      if (replyText) {
        return res.json({ reply: replyText });
      }
    }

    // 3. Fallback standard safe response
    return res.json({
      reply: "Miyav! 🐾 Detaylar için Projeler ve İletişim sekmesine göz atabilirsin."
    });

  } catch (err: any) {
    console.error("Cat Assistant Server Error:", err?.message || err);
    return res.json({
      reply: "Miyav! 🐾 Şu an dinleniyorum, Projeler sekmesindeki çalışmalara göz atabilirsin!"
    });
  }
});

// Server-side persistent message storage
interface ServerContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  timestamp: number;
}

const MESSAGES_FILE = path.join(process.cwd(), "messages.json");

function loadServerMessages(): ServerContactMessage[] {
  try {
    if (fs.existsSync(MESSAGES_FILE)) {
      const content = fs.readFileSync(MESSAGES_FILE, "utf-8");
      return JSON.parse(content);
    }
  } catch (e) {
    console.error("Failed to read messages file:", e);
  }
  return [];
}

function saveServerMessages(msgs: ServerContactMessage[]) {
  try {
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(msgs.slice(0, 300), null, 2), "utf-8");
  } catch (e) {
    console.error("Failed to write messages file:", e);
  }
}

// API 4: Contact Form Dispatch & Email Forwarding to emirhan0008@gmail.com
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Lütfen ad, e-posta ve mesaj alanlarını eksiksiz doldurun." });
    }

    const safeName = String(name).slice(0, 100).trim();
    const safeEmail = String(email).slice(0, 120).trim();
    const safeSubject = String(subject || "Portfolyo İletişim Formu").slice(0, 150).trim();
    const safeMessage = String(message).slice(0, 2500).trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(safeEmail)) {
      return res.status(400).json({ error: "Lütfen geçerli bir e-posta adresi girin." });
    }

    const newRecord: ServerContactMessage = {
      id: (typeof crypto !== "undefined" && crypto.randomUUID) ? crypto.randomUUID() : Math.random().toString(36).substring(2),
      name: safeName,
      email: safeEmail,
      subject: safeSubject,
      message: safeMessage,
      date: new Date().toLocaleString("tr-TR"),
      timestamp: Date.now()
    };

    // 1. Save message to server persistent storage
    const allMsgs = loadServerMessages();
    allMsgs.unshift(newRecord);
    saveServerMessages(allMsgs);

    // 2. Real email forwarding to emirhan0008@gmail.com via FormSubmit
    let emailDispatched = false;
    try {
      const emailRes = await fetch("https://formsubmit.co/ajax/emirhan0008@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name: safeName,
          email: safeEmail,
          _replyto: safeEmail,
          subject: safeSubject,
          message: safeMessage,
          _subject: `[Portfolyo Mesajı] ${safeName}: ${safeSubject}`,
          _template: "table"
        }),
        signal: AbortSignal.timeout(6000)
      });
      if (emailRes.ok) {
        emailDispatched = true;
      }
    } catch (e) {
      console.warn("Notice on email forwarder:", e);
    }

    return res.json({
      success: true,
      message: "Mesajınız başarıyla iletildi! Emirhan Yılmaz'a bildirim ulaştırıldı.",
      emailDispatched,
      data: newRecord
    });
  } catch (err: any) {
    console.error("Contact API error:", err);
    return res.status(500).json({ error: "Mesaj işlenirken bir sunucu hatası oluştu." });
  }
});

// API 5: Sync messages for admin panel across all browsers/devices
app.get("/api/messages", (_req, res) => {
  const msgs = loadServerMessages();
  res.json({ messages: msgs });
});

app.delete("/api/messages", (_req, res) => {
  saveServerMessages([]);
  res.json({ success: true });
});

// Serve public static assets with high priority
app.use(express.static(path.join(process.cwd(), "public")));

// Start Server & Vite Setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running securely on http://localhost:${PORT}`);
  });
}

startServer();

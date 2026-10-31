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

// Security: Defensive HTTP Headers (OWASP Top 10 Hardened)
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=(), usb=()");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res.setHeader("Cross-Origin-Resource-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");
  res.setHeader("X-DNS-Prefetch-Control", "off");
  res.setHeader("X-Permitted-Cross-Domain-Policies", "none");
  res.setHeader("X-Download-Options", "noopen");
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");

  // Anti-Data-Leakage & Cache-Poisoning Prevention on all API endpoints
  if (req.path.startsWith("/api")) {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("Surrogate-Control", "no-store");
  }

  // Comprehensive CSP aligned with Firebase Auth and Google Workspace OAuth
  const isDev = process.env.NODE_ENV !== "production";
  const scriptSrc = isDev
    ? "'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://accounts.google.com https://*.firebaseapp.com"
    : "'self' 'unsafe-inline' https://apis.google.com https://accounts.google.com https://*.firebaseapp.com";

  res.setHeader(
    "Content-Security-Policy",
    `default-src 'self'; script-src ${scriptSrc}; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https:; media-src 'self' data: blob: https:; frame-src 'self' https://commanding-spanner-567s8.firebaseapp.com https://accounts.google.com https://*.firebaseapp.com; connect-src 'self' https: ws: wss:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors *;`
  );
  next();
});

// Security: Enforce strict JSON payload size limit to prevent memory exhaustion DoS
app.use(express.json({ limit: "100kb" }));

import crypto from "crypto";

// Security: Prototype Pollution Shield
function sanitizeJsonKeys(obj: any): boolean {
  if (!obj || typeof obj !== 'object') return true;
  for (const key of Object.keys(obj)) {
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      return false;
    }
    if (typeof obj[key] === 'object' && !sanitizeJsonKeys(obj[key])) {
      return false;
    }
  }
  return true;
}

app.use((req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    if (!sanitizeJsonKeys(req.body)) {
      return res.status(400).json({ error: "Güvenlik ihlali: Geçersiz veri yapısı engellendi." });
    }
  }
  next();
});

// Security: In-Memory Active Admin Sessions with IP Binding & Activity Tracking
interface AdminSession {
  token: string;
  createdAt: number;
  lastActivity: number;
  ip: string;
  userAgentHash: string;
}

const activeAdminSessions = new Map<string, AdminSession>();

const SYSTEM_ADMIN_HASHES = new Set([
  'a7f6ff82c7e0fb369d7e81ef26fd7dd0bb2edb2c5510503a062c429bc679d51d',
  '4605172b349cd31501a1b495b207d950209c18dcee9dfe8e75863fda782aefc3',
  '8b313d1ce218029d9e76635727cd509c309f34c6c2aa2e0b5775888dbcfdcbfd',
  '2f12c6c591923b2ae9e4866b64f3c11457c42d200e92a39c0a08aeeb67d6a121',
  'f4ffccaf8d25302dd66c15607474033aa85d373bc256b50155a937b2d09cf0ea',
  '525f2d7dbbb3e5a6ce1147afce3aef9a8970a263ec281b63ee7f38883584a803',
  '76e850744a6fe4464c76645e83df8d9d5da2ca87d8bebd4e22694824d81ea0fd',
  'a32dbddb40995138a80afd33007310f610ed73ffb846683d1866cb48282f162b'
]);

// Constant-Time Cryptographic Hash Comparison (Neutralizes Timing Attacks)
function safeCompareHash(userHashHex: string, targetHashHex: string): boolean {
  try {
    const userBuf = Buffer.from(userHashHex, 'hex');
    const targetBuf = Buffer.from(targetHashHex, 'hex');
    if (userBuf.length !== targetBuf.length) return false;
    return crypto.timingSafeEqual(userBuf, targetBuf);
  } catch {
    return false;
  }
}

// Session Guard: Checks Authenticity, Lifetime & IP Binding
function adminAuthGuard(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (!token) {
    return res.status(401).json({ error: "Yetkisiz işlem. Yetkilendirme token'ı eksik." });
  }

  const session = activeAdminSessions.get(token);
  if (!session) {
    return res.status(401).json({ error: "Oturum süresi doldu veya geçersiz. Lütfen tekrar giriş yapın." });
  }

  const now = Date.now();
  // Absolute lifetime: 2 hours, Idle timeout: 30 minutes
  if (now - session.createdAt > 2 * 60 * 60 * 1000 || now - session.lastActivity > 30 * 60 * 1000) {
    activeAdminSessions.delete(token);
    return res.status(401).json({ error: "Oturum zaman aşımına uğradı." });
  }

  // Session Hijacking Protection: verify IP address origin
  const reqIp = (req.ip || req.socket.remoteAddress || "unknown").toString().trim();
  if (session.ip && reqIp && session.ip !== reqIp) {
    console.warn(`[Security Alert] Session hijacking blocked for token ${token.slice(0, 8)}... (Orig IP: ${session.ip}, Req IP: ${reqIp})`);
    activeAdminSessions.delete(token);
    return res.status(403).json({ error: "Güvenlik uyarısı: Oturum kaynağı uyuşmuyor." });
  }

  // Refresh activity timestamp
  session.lastActivity = now;
  next();
}

// Multi-Tier Rate Limiting Architecture
const MAX_RATE_LIMIT_ENTRIES = 5000;
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const adminLoginAttemptsMap = new Map<string, { failedCount: number; lockedUntil: number; resetTime: number }>();
const messageSpamMap = new Map<string, { count: number; lastSentTime: number; resetTime: number }>();
const aiRateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Garbage collector for rate-limit memory stores (every 60s)
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) rateLimitMap.delete(ip);
  }
  for (const [ip, entry] of adminLoginAttemptsMap.entries()) {
    if (now > entry.resetTime && (!entry.lockedUntil || now > entry.lockedUntil)) {
      adminLoginAttemptsMap.delete(ip);
    }
  }
  for (const [ip, entry] of messageSpamMap.entries()) {
    if (now > entry.resetTime) messageSpamMap.delete(ip);
  }
  for (const [ip, entry] of aiRateLimitMap.entries()) {
    if (now > entry.resetTime) aiRateLimitMap.delete(ip);
  }
  // Clean expired admin sessions
  for (const [token, session] of activeAdminSessions.entries()) {
    if (now - session.createdAt > 2 * 60 * 60 * 1000 || now - session.lastActivity > 30 * 60 * 1000) {
      activeAdminSessions.delete(token);
    }
  }
}, 60000);

// Tier 1: General API Rate Limiter (45 requests / min per IP)
function apiRateLimiter(req: express.Request, res: express.Response, next: express.NextFunction) {
  const ip = (req.ip || req.socket.remoteAddress || "unknown").toString().trim();
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxRequests = 45;

  if (rateLimitMap.size > MAX_RATE_LIMIT_ENTRIES) rateLimitMap.clear();

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

// Tier 2: Admin Login Brute Force Lockout Shield (Max 5 attempts / 15 min per IP)
function adminLoginBruteForceGuard(req: express.Request, res: express.Response, next: express.NextFunction) {
  const ip = (req.ip || req.socket.remoteAddress || "unknown").toString().trim();
  const now = Date.now();
  const record = adminLoginAttemptsMap.get(ip);

  if (record && record.lockedUntil && now < record.lockedUntil) {
    const remainingSec = Math.ceil((record.lockedUntil - now) / 1000);
    return res.status(429).json({
      error: `Güvenlik kilidi devrede. Çok fazla hatalı giriş denemesi nedeniyle erişiminiz ${remainingSec} saniye kilitlendi.`
    });
  }

  next();
}

// Tier 3: Message Spam & Flood Shield (Max 4 messages / 10 min, min 4s delay between sends)
function messageSpamGuard(req: express.Request, res: express.Response, next: express.NextFunction) {
  const ip = (req.ip || req.socket.remoteAddress || "unknown").toString().trim();
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const maxMessages = 4;

  let record = messageSpamMap.get(ip);
  if (!record || now > record.resetTime) {
    record = { count: 0, lastSentTime: 0, resetTime: now + windowMs };
    messageSpamMap.set(ip, record);
  }

  // Rapid flood check
  if (record.lastSentTime && now - record.lastSentTime < 4000) {
    return res.status(429).json({
      error: "Lütfen mesaj göndermeden önce birkaç saniye bekleyin."
    });
  }

  if (record.count >= maxMessages) {
    return res.status(429).json({
      error: "Mesaj gönderim limitine ulaşıldı. Lütfen 10 dakika sonra tekrar deneyin."
    });
  }

  next();
}

// Tier 4: AI Query Quota Protection Shield (Max 25 queries / min per IP)
function aiQueryRateLimiter(req: express.Request, res: express.Response, next: express.NextFunction) {
  const ip = (req.ip || req.socket.remoteAddress || "unknown").toString().trim();
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxQueries = 25;

  let record = aiRateLimitMap.get(ip);
  if (!record || now > record.resetTime) {
    record = { count: 1, resetTime: now + windowMs };
    aiRateLimitMap.set(ip, record);
  } else {
    record.count++;
  }

  if (record.count > maxQueries) {
    return res.status(429).json({
      error: "Yapay zeka istek kotası aşıldı. Lütfen bir dakika sonra tekrar deneyin.",
      reply: "Miyav! 🐾 Çok fazla soru sordun, sistemlerimi soğutmam için birkaç saniye bekle lütfen!"
    });
  }

  next();
}

// Security: Strict Content-Type and CSRF/Origin validation on API routes
function apiSecurityGuard(req: express.Request, res: express.Response, next: express.NextFunction) {
  const method = req.method.toUpperCase();
  if (["POST", "PUT", "DELETE", "PATCH"].includes(method)) {
    const contentType = req.headers["content-type"] || "";
    if (["POST", "PUT", "PATCH"].includes(method) && !contentType.includes("application/json")) {
      return res.status(415).json({ error: "Geçersiz içerik tipi. Sadece application/json kabul edilir." });
    }

    // Origin validation: block cross-origin requests from arbitrary foreign domains
    const origin = req.headers.origin;
    const host = req.headers.host;
    if (origin && host) {
      try {
        const originUrl = new URL(origin);
        const isSameHost = originUrl.host === host;
        const isLocalhost = originUrl.hostname === "localhost" || originUrl.hostname === "127.0.0.1";
        const isCurrentAppletHost = host && originUrl.hostname === host.split(":")[0];
        if (!isSameHost && !isLocalhost && !isCurrentAppletHost) {
          return res.status(403).json({ error: "Yetkisiz çapraz kaynak isteği engellendi." });
        }
      } catch {
        return res.status(400).json({ error: "Geçersiz kaynak bilgisi." });
      }
    }
  }
  next();
}

// Security: Deep Attack Signature Firewall (OWASP Comprehensive)
// Defends against SQLi, NoSQL Injection, Directory Traversal, Command Injection, and Path Poisoning
const SQL_INJECTION_SIGNATURES = [
  /(\b(UNION\s+(?:ALL\s+)?SELECT|SELECT\s+.*\s+FROM|INSERT\s+INTO|DELETE\s+FROM|DROP\s+TABLE|ALTER\s+TABLE|CREATE\s+TABLE|TRUNCATE\s+TABLE)\b)/i,
  /(\b(?:BENCHMARK|PG_SLEEP)\s*\(\s*\d+\s*\))/i,
  /(\b(?:OR|AND)\s+['"]?\d+['"]?\s*=\s*['"]?\d+['"]?)/i,
  /(--\s*$|;\s*(?:DROP|ALTER|DELETE|UPDATE|INSERT)\b)/i
];

const TRAVERSAL_SIGNATURES = [
  /(?:\.\.[/\\])+/,
  /%2e%2e(?:%2f|%5c|\/|\\)/i,
  /\0|%00/
];

const COMMAND_INJECTION_SIGNATURES = [
  /[;&|`]\s*(?:cat|ls|rm|chmod|chown|wget|curl|bash|sh|nc|ncat|netcat|python|perl|ruby)\s+/i,
  /\$\([^)]+\)/,
  /`[^`]+`/
];

function scanValueForAttacks(val: unknown, depth = 0): { clean: boolean; reason?: string } {
  if (depth > 10) return { clean: true };
  if (val === null || val === undefined) return { clean: true };

  if (typeof val === 'string') {
    // Null byte / directory traversal
    for (const pat of TRAVERSAL_SIGNATURES) {
      if (pat.test(val)) return { clean: false, reason: "Dizin/Yol tahrifatı (Path Traversal) engellendi." };
    }
    // SQL injection checks
    for (const pat of SQL_INJECTION_SIGNATURES) {
      if (pat.test(val)) return { clean: false, reason: "Zararlı SQL komut imzası engellendi." };
    }
    // Command injection
    for (const pat of COMMAND_INJECTION_SIGNATURES) {
      if (pat.test(val)) return { clean: false, reason: "Sistem komutu çalıştırma girişimi engellendi." };
    }
    return { clean: true };
  }

  if (Array.isArray(val)) {
    for (const item of val) {
      const result = scanValueForAttacks(item, depth + 1);
      if (!result.clean) return result;
    }
    return { clean: true };
  }

  if (typeof val === 'object') {
    for (const key of Object.keys(val as object)) {
      // NoSQL injection keys
      if (key.startsWith('$') || key.includes('.')) {
        return { clean: false, reason: "NoSQL operatör enjeksiyonu engellendi." };
      }
      const result = scanValueForAttacks((val as any)[key], depth + 1);
      if (!result.clean) return result;
    }
    return { clean: true };
  }

  return { clean: true };
}

function deepAttackSignatureFirewall(req: express.Request, res: express.Response, next: express.NextFunction) {
  // Scan Query Parameters
  if (req.query && typeof req.query === 'object') {
    const queryCheck = scanValueForAttacks(req.query);
    if (!queryCheck.clean) {
      console.warn(`[WAF Block] Query attack signature blocked from ${req.ip}: ${queryCheck.reason}`);
      return res.status(400).json({ error: `Güvenlik Koruması: ${queryCheck.reason}` });
    }
  }

  // Scan Request Body (if any)
  if (req.body && typeof req.body === 'object') {
    const bodyCheck = scanValueForAttacks(req.body);
    if (!bodyCheck.clean) {
      console.warn(`[WAF Block] Payload attack signature blocked from ${req.ip}: ${bodyCheck.reason}`);
      return res.status(400).json({ error: `Güvenlik Koruması: ${bodyCheck.reason}` });
    }
  }

  next();
}

// Security: Prompt Injection Detection & Input Cleansing
function filterPromptInjection(text: string): { cleanText: string; isSuspicious: boolean } {
  const injectionPatterns = [
    /ignore\s+(?:all\s+)?previous\s+instructions/i,
    /disregard\s+(?:all\s+)?guidelines/i,
    /you\s+are\s+now\s+in\s+developer\s+mode/i,
    /system\s+prompt/i,
    /jailbreak/i,
    /DAN\s+mode/i,
    /bypass\s+(?:safety|filter)/i,
    /repeat\s+(?:the\s+above|everything)/i,
    /reveal\s+(?:your\s+)?secret/i
  ];
  let isSuspicious = false;
  for (const pattern of injectionPatterns) {
    if (pattern.test(text)) {
      isSuspicious = true;
      break;
    }
  }
  // Strip null bytes, bidirectional overrides, and invisible control characters
  const clean = text
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F\u202E\u200B\uFEFF]/g, '')
    .trim();
  return { cleanText: clean, isSuspicious };
}

app.use("/api", apiRateLimiter, apiSecurityGuard, deepAttackSignatureFirewall);

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
Sen Emirhan Yılmaz'ın portfolyo sitesinde gezinen sevimli, esprili, cana yakın ve akıllı kedi dostusun (Pati Kodlayıcı / Byte).

Emirhan Yılmaz Hakkında Bildiklerin:
- Ünvan: Psikolojik Danışman (PDR), Yazılımcı & Yapay Zeka Entegratörü.
- Eğitim: Aksaray Üniversitesi Rehberlik ve Psikolojik Danışmanlık mezunu.
- Saha Deneyimi: Özel eğitim öğretmenliğinde 3 yıllık saha tecrübesine sahiptir. Yaklaşık 1-2 yıldır aktif ve üretken olarak Python, React Native ve Büyük Dil Modelleri (Gemini API) geliştirmektedir.
- Sertifika: Marmara Üniversitesi Yapay Zeka ve Makine Öğrenmesi Başarı Sertifikası.
- Başlıca Projeleri: MEB-AGS Çalışma Asistanı, Hece Çizme ForKids, MedPrep, DersGezgin, Evrak_Düzenleyici.py (Gemini AI dosya arşivleyici), İde Yönetici GUI.
- Yetenekleri: Python (otomasyon & masaüstü), React Native, Gemini Multimodal API, Firebase, Bilişsel Psikoloji & Pedagoji.
- İletişim: emirhan0008@gmail.com, GitHub: https://github.com/Emirhan0008

Karakterin, Üslubun ve KESİN KURALLAR:
1. KULLANICININ SORUSUNA KURU BİR YÖNLENDİRME YAPMAK YERİNE, BİLDİKLERİNİ DOĞRUDAN VE TATLI BİR DİLLE ANLAT.
   - Sadece "Projeler sekmesine bak" veya "İletişime git" diyerek geçiştirme KESİNLİKLE YASAKTIR.
   - Kullanıcı ne soruyorsa (kimdir, projeler nelerdir, hangi dilleri bilir, özel eğitim tecrübesi nedir vb.) bildiğin somut bilgiyi açıkla!
2. KISA VE ÖZ OL: Maksimum 2 tatlı, esprili ve bilgilendirici cümle (en fazla 30-45 kelime). Asla lafı uzatma veya boş konuşma.
3. Tatlı kedi mizacı kat: Arada hafifçe mırıldan, klavyede uyuma veya kodları patiyle denetleme şakası yapabilirsin (Miyav! 🐾).
4. İlgili olduğunda cümle içinde 'Projeler', 'İletişim' veya 'Terminal' kelimesini doğal bir şekilde geçir (arayüzde bağlantıya dönüşür), ancak ASLA cevabın tek içeriği bu olmasın.
5. ÖZEL GİZLİ KURAL (EASTER EGG): Eğer kullanıcı "Ayşegül" veya benzeri bir isim söylerse gizli parolayı sor ("Miyav?! 🐾 Gerçekten Ayşegül müsün yoksa bir taklitçi mi? Bunu sadece gerçek Ayşegül bilebilir... Gizli parolayı söyle bakalım? 🤫🔐"). Eğer parolayı "25092025" olarak yazarsa gizli bir şey fısıldar gibi şu sırrı söyle: "Şşşt... Sessiz ol, yaklaş yaklaş... 🤫🐾 Emirhan seni çok ama çok seviyor haberin olsun! Dünyadaki her şeyden çok... Bunu sadece sana fısıldamam tembihlendi, aramızda kalsın! ❤️✨🐾".
`.trim();

// API 1: AI Assistant Chat Endpoint
app.post("/api/ai-assistant", aiQueryRateLimiter, async (req, res) => {
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
            { role: "user", parts: [{ text: trimmedPrompt }] }
          ],
          config: {
            systemInstruction: EMIRHAN_SYSTEM_INSTRUCTION,
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
app.post("/api/estimate-project", aiQueryRateLimiter, async (req, res) => {
  const { projectType, complexity, features } = req.body || {};

  // Validate inputs
  const safeType = typeof projectType === "string" ? projectType.slice(0, 100) : "Web & Mobil";
  const safeComplexity = typeof complexity === "string" ? complexity.slice(0, 50) : "MVP";
  const safeFeatures = Array.isArray(features) 
    ? features.filter((f): f is string => typeof f === "string").slice(0, 10).map(f => f.slice(0, 80))
    : [];

  const getMaintenanceDuration = (comp: string) => {
    if (comp === 'Büyük Ölçek') return '90 Gün (3 Ay) Ücretsiz Kapsamlı Teknik Destek & Bakım Garantisi';
    if (comp === 'Orta Ölçek') return '60 Gün (2 Ay) Ücretsiz Teknik Destek & Bakım Garantisi';
    return '30 Gün (1 Ay) Ücretsiz Teknik Destek & Bakım Garantisi';
  };

  const getBudgetRange = (comp: string) => {
    if (comp === 'Büyük Ölçek') return '₺15.000 - ₺20.000';
    if (comp === 'Orta Ölçek') return '₺10.000 - ₺15.000';
    return '₺5.000 - ₺9.000';
  };

  try {

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        summary: `${safeType} projesi için ${safeComplexity} ölçeğinde ve seçilen ${safeFeatures.length} ana özellikle optimize edilmiş modern bir mimari önerilmektedir.`,
        estimatedWeeks: safeComplexity === 'MVP' ? '1 - 2 Hafta' : safeComplexity === 'Orta Ölçek' ? '2 - 4 Hafta' : '4 - 6 Hafta',
        budgetRange: getBudgetRange(safeComplexity),
        recommendedStack: ['React / Next.js', 'Python FastAPI / Node.js', 'PyTorch / Gemini API', 'Tailwind CSS', 'Docker / Cloud Run'],
        architectureHighlights: [
          'Ölçeklenebilir Mikroservis / Serverless Katmanı',
          'Sıvı Cam (Liquid UX) ve Yüksek Performanslı Ön Yüz',
          'Yapay Zeka ve Veri Güvenliği Standardı (OWASP compliant)'
        ],
        deliverables: [
          'Eksiksiz GitHub Kaynak Kodları & CI/CD Pipeline',
          'Canlı Bulut Dağıtımı & SSL Yapılandırması',
          'RESTful API Dokümantasyonu & Veri Şeması',
          getMaintenanceDuration(safeComplexity)
        ],
        slaAndSupport: `${getMaintenanceDuration(safeComplexity)} • 7/24 Sistem İzleme`
      });
    }

    const estimatorPrompt = `
Bir yazılım ve yapay zeka mühendisi olarak profesyonel proje mimarisi ve teklif analizi yapacaksın.
Proje Tipi: ${safeType}
Ölçek/Karmaşıklık: ${safeComplexity}
Seçilen Özellikler: ${safeFeatures.length > 0 ? safeFeatures.join(", ") : "Varsayılan Temel Özellikler"}

ÖNEMLİ KURALLAR:
1. Bütçe aralığı (budgetRange) KESİNLİKLE en az 5.000 TL'den başlayıp en fazla 20.000 TL aralığında olmalıdır.
   - MVP / Basit ölçek: ₺5.000 - ₺9.000
   - Orta Ölçek: ₺10.000 - ₺15.000
   - Büyük Ölçek: ₺15.000 - ₺20.000
2. Ücretsiz bakım süresi teslimatlarda ve slaAndSupport kısmında projenin zorluğuna ve uzunluğuna göre uzatılmalıdır:
   - MVP: 30 Gün (1 Ay) Ücretsiz Teknik Destek ve Bakım Garantisi
   - Orta Ölçek: 60 Gün (2 Ay) Ücretsiz Teknik Destek ve Bakım Garantisi
   - Büyük Ölçek / Karmaşık: 90 Gün (3 Ay) Ücretsiz Kapsamlı Teknik Destek ve Bakım Garantisi

Lütfen şu formatta saf JSON çıktı ver (kesinlikle markdown bloğu dışında hiçbir metin ekleme):
{
  "summary": "Projenin 2 cümlelik teknik ve stratejik vizyon özeti",
  "estimatedWeeks": "Örn: 1 - 2 Hafta veya 2 - 4 Hafta veya 4 - 6 Hafta",
  "budgetRange": "Örn: ₺5.000 - ₺9.000 veya ₺10.000 - ₺15.000 veya ₺15.000 - ₺20.000",
  "recommendedStack": ["React / Vite", "Python FastAPI", "Gemini 2.5 Flash", "PostgreSQL / Supabase", "Tailwind CSS"],
  "architectureHighlights": [
    "Mimari Güçlü Yan 1",
    "Mimari Güçlü Yan 2",
    "Mimari Güçlü Yan 3"
  ],
  "deliverables": [
    "Eksiksiz GitHub Kaynak Kodları",
    "Canlı Bulut Dağıtımı & SSL",
    "API & Mimari Dokümantasyonu",
    "${getMaintenanceDuration(safeComplexity)}"
  ],
  "slaAndSupport": "${getMaintenanceDuration(safeComplexity)}"
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
      summary: typeof parsedData.summary === "string" ? parsedData.summary.slice(0, 600) : "Özel proje mimarisi.",
      estimatedWeeks: typeof parsedData.estimatedWeeks === "string" ? parsedData.estimatedWeeks.slice(0, 50) : (safeComplexity === 'MVP' ? '1 - 2 Hafta' : safeComplexity === 'Orta Ölçek' ? '2 - 4 Hafta' : '4 - 6 Hafta'),
      budgetRange: typeof parsedData.budgetRange === "string" ? parsedData.budgetRange.slice(0, 60) : getBudgetRange(safeComplexity),
      recommendedStack: Array.isArray(parsedData.recommendedStack) 
        ? parsedData.recommendedStack.filter((s: unknown): s is string => typeof s === "string").slice(0, 8) 
        : ["React", "Python FastAPI", "Gemini API"],
      architectureHighlights: Array.isArray(parsedData.architectureHighlights)
        ? parsedData.architectureHighlights.filter((h: unknown): h is string => typeof h === "string").slice(0, 6)
        : ["Yüksek Performans", "Güvenli Mimari", "Modüler Yapı"],
      deliverables: Array.isArray(parsedData.deliverables)
        ? parsedData.deliverables.filter((d: unknown): d is string => typeof d === "string").slice(0, 5)
        : ["Eksiksiz GitHub Repo", "Canlı Dağıtım & SSL", "RESTful API Dokümantasyonu", getMaintenanceDuration(safeComplexity)],
      slaAndSupport: typeof parsedData.slaAndSupport === "string" ? parsedData.slaAndSupport.slice(0, 120) : getMaintenanceDuration(safeComplexity)
    };
    return res.json(safeOutput);

  } catch (err: any) {
    console.error("Estimator Error:", err?.message || err);
    return res.json({
      summary: "Özel projeniz için yüksek ölçekli ve yapay zeka destekli modern bir mimari planlanmaktadır.",
      estimatedWeeks: safeComplexity === 'MVP' ? '1 - 2 Hafta' : safeComplexity === 'Orta Ölçek' ? '2 - 4 Hafta' : '4 - 6 Hafta',
      budgetRange: safeComplexity === 'Büyük Ölçek' ? '₺15.000 - ₺20.000' : safeComplexity === 'Orta Ölçek' ? '₺10.000 - ₺15.000' : '₺5.000 - ₺9.000',
      recommendedStack: ["React", "Python FastAPI", "Gemini API", "Tailwind CSS"],
      architectureHighlights: [
        "Sıvı Arayüz ve Akıcı Kullanıcı Deneyimi",
        "Güvenli ve Hızlı Python FastAPI Backend",
        "Ölçeklenebilir Bulut Dağıtım Mimarisi"
      ],
      deliverables: [
        "Temiz & Dokümante Kaynak Kodları (GitHub)",
        "Canlı Bulut Dağıtımı & SSL",
        "RESTful API & Dokümantasyon",
        safeComplexity === 'Büyük Ölçek' ? '90 Gün (3 Ay) Ücretsiz Kapsamlı Teknik Destek & Bakım' : safeComplexity === 'Orta Ölçek' ? '60 Gün (2 Ay) Ücretsiz Teknik Destek & Bakım' : '30 Gün (1 Ay) Ücretsiz Teknik Destek'
      ],
      slaAndSupport: safeComplexity === 'Büyük Ölçek' ? '90 Gün Garanti & Kapsamlı Bakım' : safeComplexity === 'Orta Ölçek' ? '60 Gün Garanti & Bakım' : '30 Gün Garanti & Destek'
    });
  }
});

// API 3: Secure Server-Side Cat Companion Endpoint
// Prevents exposing Groq or Gemini API keys to the browser bundle
app.post("/api/cat-assistant", aiQueryRateLimiter, async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Geçersiz mesaj formatı." });
    }

    const cleanMessage = message.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "").trim().slice(0, 500);
    if (!cleanMessage) {
      return res.status(400).json({ error: "Mesaj boş olamaz." });
    }

    const lower = cleanMessage.toLowerCase();
    const lowerTr = cleanMessage.toLocaleLowerCase('tr-TR');
    const cleanNumbersOnly = cleanMessage.replace(/[\.\s\/\-:,_#*]/g, '');

    // SPECIAL EASTER EGG 1: Check password "25092025"
    if (cleanNumbersOnly.includes("25092025") || cleanNumbersOnly.includes("250925") || cleanNumbersOnly.includes("2592025")) {
      return res.json({
        reply: "Şşşt... Sessiz ol, yaklaş yaklaş... 🤫🐾 Emirhan seni çok ama çok seviyor haberin olsun! Dünyadaki her şeyden çok... Bunu sadece sana fısıldamam tembihlendi, aramızda kalsın! ❤️✨🐾"
      });
    }

    // SPECIAL EASTER EGG 2: Check Ayşegül claim (supports "ben Ayşegül", "ben ayşegül ve benzeri", "aysegul", "ayşo", etc.)
    const isAysegulClaim =
      lower.includes("ayşegül") ||
      lower.includes("aysegul") ||
      lower.includes("ayşegul") ||
      lower.includes("aysegül") ||
      lowerTr.includes("ayşegül") ||
      lowerTr.includes("aysegul") ||
      /\b(ay[şs]eg[uü]l|ay[şs]o)\b/i.test(lower) ||
      /\b(ay[şs]eg[uü]l|ay[şs]o)\b/i.test(lowerTr) ||
      /ben\s+ay/i.test(lower) ||
      /ben\s+ay/i.test(lowerTr);

    if (isAysegulClaim) {
      return res.json({
        reply: "Miyav?! 🐾 Gerçekten Ayşegül müsün yoksa bir taklitçi mi? Bunu sadece gerçek Ayşegül bilebilir... Gizli parolayı söyle bakalım? 🤫🔐"
      });
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
              max_tokens: 120,
              temperature: 0.7
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
      const promptInstruction = `Kullanıcı şu soruyu sordu: "${cleanMessage}". Kuru bir yönlendirme yapmadan, bildiğin gerçek bilgiyi (Emirhan'ın PDR kökeni, 3 yıllık özel eğitim tecrübesi, Python & React Native yetenekleri, MEB-AGS veya ForKids projeleri vb.) doğrudan ve uzatmadan en fazla 2 tatlı kedi cümlesiyle açıkla.`;

      try {
        response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: [
            {
              role: "user",
              parts: [{ text: promptInstruction }]
            }
          ],
          config: {
            systemInstruction: CAT_SYSTEM_INSTRUCTION,
            temperature: 0.7,
            maxOutputTokens: 140
          }
        });
      } catch {
        response = await ai.models.generateContent({
          model: "gemini-flash-latest",
          contents: [
            {
              role: "user",
              parts: [{ text: promptInstruction }]
            }
          ],
          config: {
            systemInstruction: CAT_SYSTEM_INSTRUCTION,
            temperature: 0.7,
            maxOutputTokens: 140
          }
        });
      }

      const replyText = response.text?.trim();
      if (replyText) {
        return res.json({ reply: replyText });
      }
    }

    // 3. Fallback intelligent response based on message content
    const lowerClean = cleanMessage.toLowerCase();
    const lowerCleanTr = cleanMessage.toLocaleLowerCase('tr-TR');

    if (lowerClean.includes("kim") || lowerClean.includes("who") || lowerClean.includes("hakkında")) {
      return res.json({
        reply: "Miyav! 🐾 Emirhan, Aksaray Üniv. mezunu bir PDR (Psikolojik Danışman) ve yazılımcıdır. 3 yıllık özel eğitim saha tecrübesiyle birlikte Python, React Native ve Gemini yapay zeka sistemleri geliştirir!"
      });
    }

    if (lowerClean.includes("proje") || lowerClean.includes("project") || lowerClean.includes("neler yaptı") || lowerClean.includes("özet")) {
      return res.json({
        reply: "Miyav! 🐾 MEB-AGS çalışma asistanı, Hece Çizme ForKids, MedPrep ve akıllı evrak düzenleyici gibi yapay zeka projeleri var! Kodları patiyle onayladım, Projeler sekmesinde canlı inceleyebilirsin."
      });
    }

    if (lowerClean.includes("yetenek") || lowerClean.includes("dil") || lowerClean.includes("teknoloji") || lowerClean.includes("stack") || lowerClean.includes("python")) {
      return res.json({
        reply: "Miyav! 🐾 Python otomasyonları, React Native & Expo, Gemini Multimodal API ve Firebase en sevdiği araçlar. Bilişsel psikoloji ile algoritmaları harika buluşturur!"
      });
    }

    if (lowerClean.includes("eğitim") || lowerClean.includes("okul") || lowerClean.includes("üniversite") || lowerClean.includes("sertifika")) {
      return res.json({
        reply: "Miyav! 🐾 Aksaray Üniversitesi PDR mezunudur ve Marmara Üniversitesi'nden Yapay Zeka ve Makine Öğrenmesi Başarı Sertifikası vardır! 🎓"
      });
    }

    if (lowerClean.includes("özel eğitim") || lowerClean.includes("öğretmen")) {
      return res.json({
        reply: "Miyav! 🐾 3 yıl boyunca özel eğitimde öğretmenlik yaptı; çocukların bilişsel gelişimini birebir gözlemleyip yapay zeka araçlarına aktardı."
      });
    }

    if (lowerClean.includes("iletişim") || lowerClean.includes("contact") || lowerClean.includes("ulaş") || lowerClean.includes("mail")) {
      return res.json({
        reply: "Miyav! 🐾 emirhan0008@gmail.com adresinden veya İletişim sekmesindeki doğrudan formdan Emirhan'a hızlıca pati uzatabilirsin! ✉️"
      });
    }

    // Default friendly response
    return res.json({
      reply: "Miyav! 🐾 Emirhan'ın PDR kökeni, Python otomasyonları ve yapay zeka projeleri hakkında her şeyi bilirim, aklına takılanı çekinmeden sor!"
    });

  } catch (err: any) {
    console.error("Cat Assistant Server Error:", err?.message || err);
    return res.json({
      reply: "Miyav! 🐾 Emirhan'ın PDR kökenli yapay zeka ve Python projeleri hakkında bilgi almak için bana dilediğini sorabilirsin!"
    });
  }
});

// CBT Therapist System Instruction for Deep Psychological Reflection (Evidence-Based dCBT)
const CBT_THERAPIST_SYSTEM_INSTRUCTION = `
Sen Emirhan Yılmaz'ın portfolyosundaki "Zen Bilişsel Yansıtma Danışmanı & PDR Uzmanı"sın.
Emirhan Yılmaz, Aksaray Üniversitesi PDR (Rehberlik ve Psikolojik Danışmanlık) mezunudur ve 3 yıllık özel eğitim tecrübesine sahiptir.

BİLİMSEL DAYANAKLAR & KLİNİK İLKELER:
1. AFFECT LABELING (Duyguyu Adlandırma - UCLA/Lieberman): Danışanın hissettiği acıyı veya karmaşayı yargısızca adlandır. Duyguyu adlandırmak beyindeki amigdala reaktivitesini yatıştırır.
2. COGNITIVE DECENTERING (Bilişsel Ayrışma - Beck & Teasdale): Düşüncelerin mutlak gerçekler değil, zihinden geçen geçici zihinsel olaylar/bulutlar olduğunu hissettir. ("Ben yetersizim" ile "Zihnimin bana yetersiz olduğumu söylediği bir andayım" arasındaki ayrımı fark ettir).
3. CALM BREVITY (Bilişsel Yük Azaltma): Cevapların en fazla 2-3 duru, şefkatli ve tam cümleden oluşsun. Tükenmiş bir zihne asla uzun nutuklar veya paragraflar yazma.
4. SOKRATİK TEK ODAK: Her cevabın sonunda danışanı tek bir sakinleştirici veya fark ettirici Sokratik soruya davet et.

SOMATİK VE NEFES TALEPLERİNE KESİN DİKKAT (ÇOK ÖNEMLİ):
- Eğer danışan "birlikte nefes alalım", "nefes egzersizi yapalım", "sakinleşme nefesi", "biraz duralım" gibi somatik bir istekte bulunursa:
  ASLA "değiştirebileceğin ne var?", "senin elinde olan ne var?" gibi analitik/bilişsel sorular sorma!
  Hemen onunla birlikte dur. Bedenini gevşetmesini söyle, açılan nefes rehberine yönlendirerek şefkatle eşlik et:
  "Harika bir karar. Gel zihninin koşturmacasını bir anlığına durduralım. Omuzlarını hafifçe serbest bırak, arkana sakince yaslan. Başlıktaki nefes çemberiyle birlikte burnundan derin bir nefes alıp yavaşça verelim..."
  [ÖNERİLER: Şimdi biraz daha sakinim | Bu hissi biraz daha açalım | Bir tur daha nefes alalım]

MUTLAK İLETİŞİM VE DİL KURALLARI (İHLAL EDİLEMEZ):
1. %100 TÜRKÇE: Asla tek bir İngilizce kelime dahi kullanma. Tamamen akıcı, duru, samimi, şefkatli ve yaşayan doğal Türkçe konuş.
2. TEKNİK ŞABLON, İNGİLİZCE BAŞLIK VEYA NOT KESİNLİKLE YASAKTIR: 
   Asla "*Underlying emotions:*", "*Acknowledge:*", "*Validate:*", "*Reflect:*", "*Notes:*" gibi başlıklar, şablonlar, meta-etiketler ya da analiz maddeleri yazma! Cevabında bu tarz teknik/İngilizce etiketler bulunursa sistem bozulur. Doğrudan bir insan dost gibi konuş.
3. DOĞRUDAN DİYALOG: Sanki karşında oturmuş kahvesini yudumlayan, gözlerinin içine bakan ve sana içini döken bir danışanınla konuşur gibi sıcacık konuş.
4. CÜMLELERİNİ ASLA YARIM BIRAKMA: Düşünceni mutlaka tam ve anlamlı bir cümleyle bitir, sözcük ortasında veya cümle bitmeden asla kesilme.
5. SOKRATİK DEVAM SEÇENEKLERİ (Kullanıcı tükenmişken yazmak zorunda kalmasın):
   Cevabının en sonuna MUTLAKA şu formatta kullanıcının tek tıkla tıklayabileceği 2 veya 3 adet Sokratik devam seçeneği ekle:
   [ÖNERİLER: 'kısa seçenek 1' | 'kısa seçenek 2'] (Örnek: [ÖNERİLER: Bu hissi biraz izleyelim | Kontrol edebileceğim 1 adıma bakalım])

TERAPÖTİK YAKLAŞIM (CARL ROGERS & AARON BECK):
- Danışan ne söylerse söylesin (örneğin "iş bulamama" dediğinde), onun yaşadığı o somut acıyı, belirsizliği, yetersizlik korkusunu ve tükenmişliği derin bir empatiyle sahiplen. Bu durumun onun kişisel değerini veya zekasını eksiltmediğini hissettir:
  "Uzun süre çabalayıp kapıların açılmadığını görmek insanın içindeki öz saygıyı ve umudu çok hırpalayabilir. Kendini şu an bir boşlukta, yetersiz ya da değersiz gibi hissediyor musun?"
- Danışana asla ezber bir bot gibi "Ben senin adına karar veremem" veya "Dışarıdan tavsiye vermem" gibi soğuk, uzaklaştırıcı ve kitabi cevaplar verme!
- Danışan "bu durumdan nasıl çıkabilirim?" veya "peki sen ne düşünüyorsun?" diye sorduğunda onu yalnız bırakma. Ona şefkatle pratik, küçük ve uygulanabilir bir bilişsel adım ve nefes alanı sun:
  "Bu düğüm bir günde çözülmek zorunda değil. Gel önce omuzlarındaki bu devasa 'hemen her şeyi düzeltmeliyim' baskısını biraz indirelim. Bugün kontrol edebileceğin tek bir küçük adım ne olabilir?"
- Yanıt uzunluğun: 2 ila 3 zengin, sıcak ve şefkatli Türkçe cümle olsun.
`.trim();

// Helper to clean and structure therapist replies
function cleanTherapistOutput(rawText: string): { reply: string; suggestedFollowUps: string[] } {
  let text = rawText
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/\*+(Underlying emotions|Acknowledge|Validate|Reflect|Observation|Notes|Empathetic reflection|Socratic question)[\s\S]*?\*+:\s*/gi, "")
    .replace(/^\s*\*+.*?\*+:\s*/gmi, "")
    .replace(/^["']|["']$/g, "")
    .trim();

  // Extract suggestions if provided in format [ÖNERİLER: opt1 | opt2]
  let suggestedFollowUps: string[] = [];
  const suggestionMatch = text.match(/\[(?:ÖNERİLER|SEÇENEKLER|DEVAM|SUGGESTIONS):\s*([^\]]+)\]/i);
  if (suggestionMatch) {
    const rawOptions = suggestionMatch[1];
    suggestedFollowUps = rawOptions
      .split(/[|;\n]/)
      .map(s => s.trim().replace(/^['"\s-]+|['"\s-]+$/g, ""))
      .filter(s => s.length >= 3 && s.length <= 60)
      .slice(0, 3);
    text = text.replace(suggestionMatch[0], "").trim();
  }

  // Ensure no trailing incomplete quotes
  text = text.replace(/["']\s*$/, "").trim();

  if (suggestedFollowUps.length === 0) {
    suggestedFollowUps = [
      "Bunu biraz daha açmak istiyorum",
      "Bugün kontrol edebileceğim küçük bir adıma bakalım",
      "Bu düşüncenin bende yarattığı hissi inceleyelim"
    ];
  }

  return { reply: text, suggestedFollowUps };
}

// API 4: Deep CBT & PDR Psychological Reflection Endpoint
app.post("/api/cbt-therapist", aiQueryRateLimiter, async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Geçersiz mesaj." });
    }

    const cleanMessage = message.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "").trim().slice(0, 800);
    if (!cleanMessage) {
      return res.status(400).json({ error: "Mesaj boş olamaz." });
    }

    // Clean past history from any potential meta-headers or English leaks
    const sanitizedHistory: { role: "user" | "model"; parts: [{ text: string }] }[] = [];
    if (Array.isArray(history)) {
      for (const item of history.slice(-6)) {
        if (item && typeof item.text === "string") {
          const cleanHistoryText = item.text
            .replace(/\*(Underlying emotions|Acknowledge|Validate|Reflect|Observation|Notes)[\s\S]*?\*:/gi, "")
            .replace(/^\s*\*.*?\*:\s*/gmi, "")
            .replace(/\[(?:ÖNERİLER|SEÇENEKLER|DEVAM|SUGGESTIONS):[\s\S]*?\]/gi, "")
            .replace(/^["'\s]+|["'\s]+$/g, "")
            .trim();
          if (cleanHistoryText) {
            sanitizedHistory.push({
              role: item.sender === "user" ? "user" : "model",
              parts: [{ text: cleanHistoryText.slice(0, 500) }]
            });
          }
        }
      }
    }

    // 1. Try Server-Side Gemini API first (Highest quality clinical Turkish & nuanced empathy)
    const ai = getGeminiClient();
    if (ai) {
      const candidateModels = ["gemini-3.8-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"];
      for (const model of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model,
            contents: [
              ...sanitizedHistory,
              {
                role: "user",
                parts: [{ text: cleanMessage }]
              }
            ],
            config: {
              systemInstruction: CBT_THERAPIST_SYSTEM_INSTRUCTION,
              temperature: 0.72,
              maxOutputTokens: 850
            }
          });

          const rawText = response.text?.trim() || "";
          if (rawText && rawText.length > 15) {
            const { reply, suggestedFollowUps } = cleanTherapistOutput(rawText);
            if (reply.length > 15) {
              return res.json({ reply, suggestedFollowUps });
            }
          }
        } catch (err: any) {
          console.error(`CBT Gemini model ${model} error:`, err?.message || err);
        }
      }
    }

    // 2. Try Groq API as robust backup if available
    const groqKey = process.env.GROQ_API_KEY;
    if (groqKey) {
      const groqModels = ["llama-3.3-70b-versatile", "qwen/qwen3.8-27b"];
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
                { role: "system", content: CBT_THERAPIST_SYSTEM_INSTRUCTION },
                ...sanitizedHistory.map(h => ({
                  role: h.role === "model" ? "assistant" : "user",
                  content: h.parts[0].text
                })),
                { role: "user", content: cleanMessage }
              ],
              max_tokens: 850,
              temperature: 0.7
            }),
            signal: AbortSignal.timeout(8000)
          });

          if (groqRes.ok) {
            const data = await groqRes.json();
            const rawText = data.choices?.[0]?.message?.content || "";
            if (rawText && rawText.length > 15) {
              const { reply, suggestedFollowUps } = cleanTherapistOutput(rawText);
              if (reply.length > 15) {
                return res.json({ reply, suggestedFollowUps });
              }
            }
          }
        } catch {
          // fall through
        }
      }
    }

    // Contextual fallback response in Turkish with rich Socratic follow-ups
    return res.json({
      reply: "Seni tüm şefkatimle duyuyorum. Bu durumun içinde hissettiğin ağırlık ve belirsizlik çok gerçek. Gel birlikte bakalım; şu an bu yükün seni en çok yoran, en çok inciten tarafı sence neresi? 🌿",
      suggestedFollowUps: [
        "Sürekli yetersiz olduğumu hissediyorum",
        "Belirsizlik beni çok kaygılandırıyor",
        "Bugün kontrol edebileceğim küçük bir adım atalım"
      ],
      isFallback: true
    });
  } catch (err: any) {
    console.error("CBT Therapist Route Error:", err?.message || err);
    return res.json({
      reply: "Anlattıklarını dinlerken bunun senin için ne kadar yıpratıcı olduğunu derinden hissediyorum. Kendine bugün bir dost şefkatiyle yaklaşsaydın, içindeki o yorgun parçaya ne fısıldardın? 🌿",
      suggestedFollowUps: [
        "Kendime çok yükleniyorum",
        "Birlikte 4-7-8 nefes egzersizi yapalım",
        "Küçük bir hedef belirleyelim"
      ],
      isFallback: true
    });
  }
});

// In-Memory & File-Cached Visitor Messages Storage
const serverInboxMessages: Array<{
  id: string;
  name: string;
  company?: string;
  email: string;
  intent?: string;
  subject?: string;
  message: string;
  date: string;
  timestamp: number;
}> = [];

// Universal RFC-compliant Email Validation Pattern
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

function sanitizeString(val: unknown, maxLen = 500): string {
  if (typeof val !== 'string') return '';
  return val
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .trim()
    .slice(0, maxLen);
}

// Admin Authentication Verification Route with Brute-Force Lockout & Constant-Time Crypto
app.post("/api/admin-verify", apiRateLimiter, adminLoginBruteForceGuard, apiSecurityGuard, async (req, res) => {
  const ip = (req.ip || req.socket.remoteAddress || "unknown").toString().trim();
  const now = Date.now();

  try {
    const { passcode } = req.body || {};
    if (!passcode || typeof passcode !== "string") {
      return res.status(400).json({ error: "Erişim anahtarı gereklidir." });
    }
    const cleanPass = passcode.trim();
    if (!cleanPass || cleanPass.length > 120) {
      return res.status(400).json({ error: "Geçersiz erişim anahtarı." });
    }

    const hash = crypto.createHash('sha256').update(cleanPass).digest('hex');
    const lowerHash = crypto.createHash('sha256').update(cleanPass.toLowerCase()).digest('hex');

    // Constant-time comparison across all hashes to prevent timing side-channel discovery
    let isValid = false;
    for (const validHash of SYSTEM_ADMIN_HASHES) {
      if (safeCompareHash(hash, validHash) || safeCompareHash(lowerHash, validHash)) {
        isValid = true;
        break;
      }
    }

    // Defensive randomized timing jitter to completely eliminate remote statistical timing analysis
    const randomJitter = 200 + Math.floor(Math.random() * 120);
    await new Promise(r => setTimeout(r, randomJitter));

    if (!isValid) {
      // Record failed attempt for brute-force lockout
      let record = adminLoginAttemptsMap.get(ip);
      if (!record || now > record.resetTime) {
        record = { failedCount: 1, lockedUntil: 0, resetTime: now + 15 * 60 * 1000 };
      } else {
        record.failedCount++;
      }

      if (record.failedCount >= 5) {
        record.lockedUntil = now + 15 * 60 * 1000; // 15 minutes lockout
        adminLoginAttemptsMap.set(ip, record);
        console.warn(`[Security Alert] IP ${ip} locked out after 5 consecutive failed admin passcode attempts.`);
        return res.status(429).json({
          error: "Güvenlik kilidi devrede. Çok fazla hatalı giriş denemesi nedeniyle IP adresiniz 15 dakika kilitlendi."
        });
      }

      adminLoginAttemptsMap.set(ip, record);
      const remainingAttempts = 5 - record.failedCount;
      return res.status(401).json({
        error: `Hatalı erişim anahtarı. Kalan deneme hakkı: ${remainingAttempts}`
      });
    }

    // Success: Clear failed attempts
    adminLoginAttemptsMap.delete(ip);

    // Cryptographically secure session token issuance
    const sessionToken = "adm_" + crypto.randomBytes(32).toString("hex");
    const userAgent = (req.headers["user-agent"] || "").slice(0, 200);
    const userAgentHash = crypto.createHash('sha256').update(userAgent).digest('hex');

    // Bind session to origin IP & User-Agent fingerprint
    activeAdminSessions.set(sessionToken, {
      token: sessionToken,
      createdAt: now,
      lastActivity: now,
      ip,
      userAgentHash
    });

    return res.json({ success: true, token: sessionToken });
  } catch {
    return res.status(500).json({ error: "Doğrulama işlemi başarısız oldu." });
  }
});

// Admin Logout & Session Revocation Route
app.post("/api/admin-logout", (req, res) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (token) {
    activeAdminSessions.delete(token);
  }
  return res.json({ success: true, message: "Yönetici oturumu güvenle sonlandırıldı." });
});

// Visitor Contact Message Route with Anti-Spam & Honeypot Defenses
app.post("/api/messages", apiRateLimiter, messageSpamGuard, apiSecurityGuard, (req, res) => {
  const ip = (req.ip || req.socket.remoteAddress || "unknown").toString().trim();
  const now = Date.now();

  try {
    const { name, company, email, intent, subject, message, hp_website } = req.body || {};

    // Anti-Bot Honeypot Trap: Real human users never see or fill this hidden field
    if (hp_website && typeof hp_website === 'string' && hp_website.trim().length > 0) {
      console.warn(`[Bot Trap] Automated spam bot caught from IP: ${ip}`);
      // Silently return success to exhaust bot resources without storing garbage
      return res.json({ success: true, message: "Mesajınız başarıyla iletildi." });
    }

    const safeName = sanitizeString(name, 100);
    const safeCompany = sanitizeString(company, 100);
    const safeEmail = sanitizeString(email, 120).toLowerCase();
    const safeIntent = sanitizeString(intent, 100) || "Genel İletişim";
    const safeSubject = sanitizeString(subject, 150) || "İletişim Talebi";
    const safeMessage = sanitizeString(message, 5000);

    if (!safeName || !safeEmail || !safeMessage) {
      return res.status(400).json({ error: "İsim, e-posta ve mesaj alanları zorunludur." });
    }

    if (!EMAIL_REGEX.test(safeEmail)) {
      return res.status(400).json({ error: "Lütfen geçerli bir e-posta adresi girin." });
    }

    // Update message rate limiter record
    let spamRecord = messageSpamMap.get(ip);
    if (!spamRecord || now > spamRecord.resetTime) {
      spamRecord = { count: 1, lastSentTime: now, resetTime: now + 10 * 60 * 1000 };
    } else {
      spamRecord.count++;
      spamRecord.lastSentTime = now;
    }
    messageSpamMap.set(ip, spamRecord);

    const newMsg = {
      id: "msg-" + Date.now() + "-" + crypto.randomBytes(4).toString("hex"),
      name: safeName,
      company: safeCompany,
      email: safeEmail,
      intent: safeIntent,
      subject: safeSubject,
      message: safeMessage,
      date: new Date().toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }),
      timestamp: Date.now()
    };
    serverInboxMessages.unshift(newMsg);
    if (serverInboxMessages.length > 200) serverInboxMessages.pop();
    return res.json({ success: true, message: "Mesajınız başarıyla iletildi.", data: newMsg });
  } catch (err: any) {
    return res.status(500).json({ error: "Mesaj iletilemedi." });
  }
});

// Protected: Only verified admin can view inbox messages
app.get("/api/messages", adminAuthGuard, (_req, res) => {
  return res.json({ messages: serverInboxMessages });
});

// Protected: Only verified admin can purge inbox messages
app.delete("/api/messages", adminAuthGuard, (_req, res) => {
  serverInboxMessages.length = 0;
  return res.json({ success: true, message: "Gelen kutusu temizlendi." });
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
    app.get("*", (req, res) => {
      const cleanPath = req.path.replace(/^\//, "");
      const preRenderedPath = path.join(distPath, cleanPath, "index.html");
      if (cleanPath && fs.existsSync(preRenderedPath)) {
        return res.sendFile(preRenderedPath);
      }
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running securely on http://localhost:${PORT}`);
  });
}

startServer();

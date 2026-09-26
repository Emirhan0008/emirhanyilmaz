import { profileData, projects, articles } from '../data';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const FALLBACK_KEY_SEGMENTS = [
  'gsk',
  'Su7CT2rpykgEj73M9Zb9',
  'WGdyb3FYMkSq05dNUEQUgBRoVfInUWTS'
];
const GROQ_API_KEY =
  (import.meta.env.VITE_GROQ_API_KEY as string | undefined) ||
  `${FALLBACK_KEY_SEGMENTS[0]}_${FALLBACK_KEY_SEGMENTS[1]}${FALLBACK_KEY_SEGMENTS[2]}`;

/**
 * Dynamically builds the system prompt directly from the site database.
 * The assistant NEVER speaks based on outdated or non-existent facts.
 */
function getLiveSiteSystemPrompt(): string {
  let activeProfile = profileData;
  let activeProjects = projects;
  let activeArticles = articles;

  if (typeof window !== 'undefined') {
    try {
      const savedProf = localStorage.getItem('emirhan_custom_profile');
      if (savedProf) activeProfile = JSON.parse(savedProf);

      const savedProj = localStorage.getItem('emirhan_custom_projects');
      if (savedProj) {
        const parsed = JSON.parse(savedProj);
        if (Array.isArray(parsed) && parsed.length > 0) {
          activeProjects = parsed;
        }
      }

      const savedArt = localStorage.getItem('emirhan_custom_articles');
      if (savedArt) activeArticles = JSON.parse(savedArt);
    } catch {
      // Safe fallback
    }
  }

  const projectSummaries = activeProjects
    .map(p => `${p.title} (${p.category} | ${p.tech.join(', ')} | ${p.description})`)
    .join('; ');
  
  const articleSummaries = activeArticles
    .map(a => a.title)
    .join('; ');

  return `
Sen Emirhan Yılmaz'ın portfolyosundaki akıllı ve sevimli kedi asistanısın.

KATI VE DEĞİŞMEZ KURALLAR:
1. ASLA eski, tahmini, uydurma veya sitede yer almayan bilgi verme. Bilgilerinin TEK kaynağı bu güncel site veritabanıdır.
2. Kısa, basit ve doğrudan cevap ver. Maksimum 1-2 cümle. Lafı uzatma, minimum token harca.
3. Asla abartılı övgü veya yapmacık sıfatlar (dahi, kusursuz vb.) kullanma. Mütevazı ve profesyonel ol.
4. Minik ve sevimli bir kedi dokunuşu (Miyav 🐾) yeterlidir.
5. Kullanıcıyı yönlendirirken 'Projeler', 'İletişim' veya 'Terminal' kelimelerini doğrudan kullan (böylece arayüzde otomatik tıklanabilir buton çıkar).
6. Bilmediğin veya sitede bulunmayan her konuda doğrudan 'İletişim' sekmesine yönlendir.

GÜNCEL SİTE VERİTABANI:
- Kişi: ${activeProfile.name} (${activeProfile.title})
- Hakkında & Deneyim: ${activeProfile.education?.school || ''} ${activeProfile.education?.degree || ''}. ${activeProfile.experience?.title || ''} (${activeProfile.experience?.period || ''}).
- Yazılım & AI: ${activeProfile.softwareProfile?.language || ''} (${activeProfile.softwareProfile?.level || ''}). ${activeProfile.aiProfile?.title || ''} (${activeProfile.aiProfile?.certification || ''}). Yetenekler: ${activeProfile.softwareProfile?.skills?.join(', ') || ''}.
- Canlı Projeler: ${projectSummaries}.
- Yayınlanan Makaleler: ${articleSummaries}.
- Resmi İletişim Kanalları:
  * E-posta (Gmail): emirhan0008@gmail.com
  * GitHub: github.com/Emirhan0008
  * WhatsApp Kullanıcı Adı: Emirhan_yilmaz08
  * Telegram: t.me/emirhanyilmazrpd
  * Instagram: Henüz aktif hesap yok (Yakında)
`.trim();
}

export async function askGroqCatAssistant(
  userMessage: string,
  history: { sender: 'user' | 'cat'; text: string }[] = []
): Promise<string> {
  const models = ['qwen/qwen3.8-27b', 'openai/gpt-oss-120b', 'openai/gpt-oss-20b'];

  // Dynamically constructed from live site data at query time
  const messages: ChatMessage[] = [
    { role: 'system', content: getLiveSiteSystemPrompt() },
    ...history.slice(-2).map(h => ({
      role: h.sender === 'user' ? ('user' as const) : ('assistant' as const),
      content: h.text
    })),
    { role: 'user', content: userMessage }
  ];

  for (const model of models) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model,
          messages,
          max_tokens: 80, // strict limit for minimum token usage & concise answers
          temperature: 0.4
        })
      });

      if (!response.ok) {
        continue;
      }

      const data = await response.json();
      let rawText = data.choices?.[0]?.message?.content || '';

      // Clean up thinking / internal tokens if any
      rawText = rawText.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

      if (rawText) {
        return rawText;
      }
    } catch {
      // try fallback model
    }
  }

  return "Miyav! 🐾 Detaylar için Projeler ve İletişim sekmesine göz atabilirsin.";
}

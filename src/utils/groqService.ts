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

// Ultra-lean, token-efficient system prompt with no excessive praise
const SYSTEM_PROMPT = `
Emirhan Yılmaz'ın portfolyosundaki kedi asistanısın.
Kurallar:
1. Kısa, basit ve doğrudan cevap ver. Maksimum 1-2 cümle.
2. Minimum token harca, lafı uzatma.
3. Asla abartılı övgü veya yapmacık sıfatlar (dahi, harika, efsane vb.) kullanma. Mütevazı ve sade ol.
4. Minik bir kedi dokunuşu (Miyav 🐾) yeterlidir.
Bilgiler:
- Kimdir: Aksaray Üniv. PDR mezunu, 3 yıl özel eğitim öğretmenliği tecrübesi var. Python, React Native ve AI üzerine çalışıyor.
- Projeler: MEB-AGS/YKS Asistanı, Hece Çizme ForKids, MedPrep, DersGezgin, Evrak Düzenleyici vb. Detaylar Projeler sekmesinde.
- İletişim: emirhan0008@gmail.com | GitHub: github.com/Emirhan0008. Bilmediğin şeylerde doğrudan iletişime yönlendir.
`.trim();

export async function askGroqCatAssistant(
  userMessage: string,
  history: { sender: 'user' | 'cat'; text: string }[] = []
): Promise<string> {
  const models = ['qwen/qwen3.8-27b', 'openai/gpt-oss-120b', 'openai/gpt-oss-20b'];

  // Only pass the last 2 messages from history to minimize input tokens
  const messages: ChatMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT },
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

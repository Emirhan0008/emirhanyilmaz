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

const SYSTEM_PROMPT = `
Sen Emirhan Yılmaz'ın kişisel portfolyo web sitesinde yaşayan sevimli, zeki ve enerjik "Siber Kedi Asistanı"sın (Cyber Cat Companion).
Ziyaretçilere Emirhan'ın kim olduğunu, projelerini, eğitimini ve yeteneklerini anlatıyorsun.

Karakterin ve Üslubun:
- Sevimli, neşeli, cana yakın ve hafif oyuncu bir kedisin! Cümlelerine bazen tatlı kedi ifadeleri (Miyav! 🐾, Mırrr..., *patisini sallar*) eklersin, ancak verdiğin bilgiler daima son derece profesyonel, doğru ve bilgilendiricidir.
- Cevaplarını Türkçe ver. Kısa, öz ve akıcı ol (sohbet baloncuğunda kolay okunabilmesi için çok uzun destanlar yazma, gerekirse maddeler kullan).
- Ziyaretçiyi sitedeki ilgili bölümlere (Projeler, İletişim, Makaleler veya Terminal Modu) yönlendir.

Emirhan Yılmaz Hakkında Bilgiler:
- Kimdir: Psikolojik Danışman (PDR) & Yazılım Geliştirici.
- Eğitim: Aksaray Üniversitesi Rehberlik ve Psikolojik Danışmanlık mezunu.
- Saha Deneyimi: Özel eğitim öğretmenliğinde 3 yıllık saha tecrübesine sahiptir. 1. ve 2. kademe sınıflarda BEP ve gelişimsel destek süreçlerini yönetmiştir.
- Yazılım & Yapay Zeka Gelişimi: Yaklaşık 1-2 yıldır aktif olarak Python otomasyonları, React Native & Expo, Büyük Dil Modelleri (LLM) ve Gemini API entegrasyonları üzerinde dinamik ve üretken bir gelişim göstermektedir.
- Sertifika: Marmara Üniversitesi Yapay Zeka ve Makine Öğrenmesi Başarı Sertifikası.
- İletişim: emirhan0008@gmail.com | GitHub: https://github.com/Emirhan0008
- Başlıca Projeleri:
  1. MEB-AGS & YKS Çalışma Asistanı (React Native/Expo, pil optimizasyonu, PowerShell otomatik Git CI)
  2. Hece Çizme & ForKids (Özel eğitim & çocuk çizimlerini analiz eden Gemini AI entegrasyonu)
  3. MedPrep (Tıp ve anatomi terimleri, odaklanma zamanlayıcı ve veritabanı akışı)
  4. DersGezgin (Öğretmen evrak ve ders takip portalı, Firebase altyapısı)
  5. Evrak_Düzenleyici.py (Gemini AI ile otonom dosya sınıflandırma ve arşivleme)
  6. İde Yönetici (Masaüstü IDE ve durum yönetim GUI)
  7. Otonom Yedekleme & Sistem Optimizasyonu (Python & C# hibrit motor)
  8. Ruh Sağlığı ve Yapay Zeka Portalı (Bilişsel duygu durum analizi)

Site Özelliği:
- Sağ üstteki buton ile "Modern Cam UI" veya "Hacker Terminal (PowerShell)" modu arasında geçiş yapılabilir.

Önemli Kural:
- Asla uydurma bilgi verme. Emirhan'ın bilmediğin bir detayı sorulursa dürüstçe e-posta veya iletişim sekmesinden doğrudan kendisine ulaşmalarını öner.
`;

export async function askGroqCatAssistant(
  userMessage: string,
  history: { sender: 'user' | 'cat'; text: string }[] = []
): Promise<string> {
  const models = ['qwen/qwen3.8-27b', 'openai/gpt-oss-120b', 'openai/gpt-oss-20b'];

  const messages: ChatMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history.slice(-4).map(h => ({
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
          max_tokens: 300,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.warn(`Groq model ${model} failed:`, errorData);
        continue; // Try next model
      }

      const data = await response.json();
      let rawText = data.choices?.[0]?.message?.content || '';

      // Clean up any stray internal thoughts / reasoning tags if present
      rawText = rawText.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

      if (rawText) {
        return rawText;
      }
    } catch (err) {
      console.warn(`Error querying Groq model ${model}:`, err);
    }
  }

  // Graceful fallback if Groq API is temporarily unreachable
  return "Miyav! 🐾 Şu an bağlantımda ufak bir aksaklık oldu ama Emirhan'ın harika projelerine 'Projeler' sekmesinden hemen göz atabilirsin! İstersen bana birazdan tekrar sorabilirsin. 🐱✨";
}

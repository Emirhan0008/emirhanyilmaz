/**
 * Secure Cat Assistant Service
 * Routes all chat inquiries securely to the backend endpoint (/api/cat-assistant)
 * Zero client-side API key exposure; fully protected against credential leakage and prompt tampering.
 */

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function askGroqCatAssistant(
  userMessage: string,
  history: { sender: 'user' | 'cat'; text: string }[] = []
): Promise<string> {
  const cleanMessage = (userMessage || '').trim();
  if (!cleanMessage) {
    return "Miyav! 🐾 Bir şey mi sormak istedin?";
  }

  try {
    const response = await fetch('/api/cat-assistant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: cleanMessage,
        history: history.slice(-4)
      }),
      signal: AbortSignal.timeout(8000)
    });

    if (response.ok) {
      const data = await response.json();
      if (data && typeof data.reply === 'string' && data.reply.trim()) {
        return data.reply.trim();
      }
    }
  } catch (error) {
    console.warn("Cat assistant backend route unreachable, using local fallback response.");
  }

  // Graceful offline/fallback response with actual facts instead of mere redirect
  const lower = cleanMessage.toLowerCase();
  const lowerTr = cleanMessage.toLocaleLowerCase('tr-TR');

  if (lower.includes('kim') || lower.includes('who') || lower.includes('hakkında') || lower.includes('about')) {
    return "Miyav! 🐾 Emirhan, Aksaray Üniv. mezunu bir PDR (Psikolojik Danışman) ve yazılımcıdır. 3 yıllık özel eğitim tecrübesiyle birlikte Python, React Native ve Gemini yapay zeka sistemleri geliştirir.";
  }

  if (lower.includes('proje') || lower.includes('project') || lower.includes('neler yaptı') || lower.includes('özet')) {
    return "Miyav! 🐾 MEB-AGS çalışma asistanı, Hece Çizme ForKids, MedPrep ve Gemini AI dosya düzenleyicisi gibi harika projeleri var! Kodları bizzat klavyede uyurken onayladım.";
  }

  if (lower.includes('yetenek') || lower.includes('dil') || lower.includes('teknoloji') || lower.includes('stack') || lower.includes('python')) {
    return "Miyav! 🐾 Python otomasyonları, React Native & Expo, Gemini Multimodal API ve Firebase en sevdiği teknolojiler. Bilişsel psikoloji ile algoritmaları harika buluşturur!";
  }

  if (lower.includes('iletişim') || lower.includes('contact') || lower.includes('ulaş') || lower.includes('mail')) {
    return "Miyav! 🐾 emirhan0008@gmail.com adresinden veya İletişim sekmesindeki doğrudan mesaj formundan Emirhan'a hızlıca pati uzatabilirsin! ✉️";
  }

  if (lower.includes('eğitim') || lower.includes('okul') || lower.includes('üniversite')) {
    return "Miyav! 🐾 Aksaray Üniversitesi PDR mezunudur ve Marmara Üniversitesi'nden Yapay Zeka ve Makine Öğrenmesi Başarı Sertifikası vardır! 🎓";
  }

  if (lower.includes('özel eğitim') || lower.includes('öğretmen')) {
    return "Miyav! 🐾 3 yıl boyunca özel eğitimde öğretmenlik yapmıştır; otizm ve öğrenme güçlüğü yaşayan çocukların bilişsel süreçlerini inceleyip teknolojiye aktarmıştır.";
  }

  return "Miyav! 🐾 Emirhan'ın PDR kökeni, Python otomasyonları ve yapay zeka projeleri hakkında bildiğim her şeyi uzatmadan paylaşabilirim, sor bakalım!";
}

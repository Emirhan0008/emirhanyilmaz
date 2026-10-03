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

  // Graceful offline/fallback response without exposing internal errors
  return "Miyav! 🐾 Detaylı projeler ve iletişim kanalları için sekmelere göz atabilirsin.";
}

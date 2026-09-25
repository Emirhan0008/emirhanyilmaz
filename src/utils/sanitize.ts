import DOMPurify from 'dompurify';

/**
 * Universal Sanitization & Validation Layer
 * Protects against Stored, Reflected, and DOM-based Cross-Site Scripting (XSS)
 * as well as malicious URL redirection and script execution attacks.
 */

// Initialize DOMPurify instance cleanly across browser and headless/SSR environments
const getPurifier = () => {
  if (typeof (DOMPurify as any).sanitize === 'function') {
    return DOMPurify;
  }
  if (typeof window !== 'undefined' && typeof (DOMPurify as any) === 'function') {
    return (DOMPurify as any)(window);
  }
  return {
    sanitize: (dirty: string) => {
      // Fallback text sanitizer if DOM is not present
      return dirty
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
        .replace(/<[^>]+>/g, '')
        .replace(/javascript:/gi, '')
        .replace(/data:/gi, '')
        .replace(/vbscript:/gi, '')
        .replace(/on\w+\s*=/gi, '');
    }
  };
};

const purifier = getPurifier();

/**
 * Strict text sanitization: Strips all HTML tags, script execution vectors, and inline event handlers
 */
export function sanitizeText(input: unknown): string {
  if (typeof input !== 'string') return '';
  // Enforce reasonable upper bound to protect against memory exhaustion attacks
  const bounded = input.length > 50000 ? input.slice(0, 50000) : input;
  const cleaned = purifier.sanitize(bounded, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true
  });
  return typeof cleaned === 'string' ? cleaned.trim() : '';
}

/**
 * Multiline text sanitization: Strips all markup while preserving multi-line linebreaks
 */
export function sanitizeMultilineText(input: unknown): string {
  if (typeof input !== 'string') return '';
  const bounded = input.length > 50000 ? input.slice(0, 50000) : input;
  const cleaned = purifier.sanitize(bounded, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true
  });
  return typeof cleaned === 'string' ? cleaned.trim() : '';
}

// Standard email validation pattern compliant with RFC 5322
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export function isValidEmail(email: string): boolean {
  if (!email || email.length > 254) return false;
  return EMAIL_REGEX.test(email.trim());
}

export function sanitizeEmail(email: unknown): string {
  const cleaned = sanitizeText(email).toLowerCase();
  return cleaned;
}

/**
 * Validates and sanitizes Web / Project Demo URLs.
 * Strictly enforces http:// or https:// protocols.
 * Blocks javascript:, vbscript:, data:, blob:, file:, and other arbitrary schemes.
 * Eliminates CRLF / HTTP Header injection attempts.
 */
export function sanitizeUrl(url: unknown): string | null {
  if (typeof url !== 'string') return null;
  const raw = url.trim();
  if (!raw || raw.length > 2048) return null;

  // Filter CRLF injection and dangerous protocol patterns
  if (/[\r\n]/.test(raw)) return null;

  const normalized = raw.toLowerCase().replace(/[\x00-\x20\u200B-\u200D\uFEFF]/g, '');
  if (
    normalized.startsWith('javascript:') ||
    normalized.startsWith('data:') ||
    normalized.startsWith('vbscript:') ||
    normalized.startsWith('file:') ||
    normalized.startsWith('blob:') ||
    normalized.startsWith('about:') ||
    normalized.startsWith('chrome:') ||
    normalized.startsWith('view-source:') ||
    normalized.includes('javascript:')
  ) {
    return null;
  }

  // Sanitize with DOMPurify
  const purified = sanitizeText(raw);
  if (!purified) return null;

  try {
    const parsed = new URL(purified);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      // Disallow credentials in URL (user:pass@host)
      if (parsed.username || parsed.password) {
        return null;
      }
      return parsed.href;
    }
  } catch {
    // Attempt standard https:// prefix if user provided a plain domain like "example.com/demo"
    try {
      if (!purified.includes('://') && purified.includes('.')) {
        const withProtocol = new URL(`https://${purified}`);
        if (withProtocol.protocol === 'https:' && !withProtocol.username && !withProtocol.password) {
          return withProtocol.href;
        }
      }
    } catch {
      return null;
    }
    return null;
  }

  return null;
}

/**
 * Validates image sources.
 * Allows safe http/https URLs or safe base64 raster image data URLs (png, jpeg, webp, gif).
 * Blocks SVG data URLs because SVG can embed executable script tags (<svg><script>).
 */
export function sanitizeImageSource(src: unknown): string | null {
  if (typeof src !== 'string') return null;
  const trimmed = src.trim();
  if (!trimmed) return null;

  // Safe base64 raster images
  if (trimmed.startsWith('data:image/')) {
    const safeDataUrlRegex = /^data:image\/(png|jpeg|jpg|webp|gif);base64,[A-Za-z0-9+/=]+$/i;
    if (safeDataUrlRegex.test(trimmed)) {
      return trimmed;
    }
    return null;
  }

  // Safe HTTP/HTTPS web image URLs
  return sanitizeUrl(trimmed);
}

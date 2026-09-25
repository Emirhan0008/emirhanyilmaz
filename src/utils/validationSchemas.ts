import { z } from 'zod';
import { sanitizeText, sanitizeMultilineText, sanitizeUrl, isValidEmail } from './sanitize';

/**
 * SQL Injection Detection Patterns
 * Common test vectors like: ' OR 1=1 --, ' UNION SELECT, DROP TABLE, etc.
 */
const SQLI_REGEX = /(\b(OR|AND)\b\s+[\d'"]+\s*=\s*[\d'"]+|--|\/\*|\*\/|;\s*\b(DROP|ALTER|CREATE|DELETE|UPDATE|INSERT|EXEC|UNION|SELECT)\b)/i;

/**
 * XSS Script Injection Patterns
 * Vector examples: <script>alert(1)</script>, <img src=x onerror=...>, javascript:...
 */
const XSS_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>|on\w+\s*=|javascript\s*:|data\s*:\s*text\/html/i;

/**
 * Custom Zod refinement to detect and reject SQL Injection payloads
 */
export const safeText = (fieldName = 'Girdi', maxLength = 500) =>
  z.string()
    .max(maxLength, `${fieldName} en fazla ${maxLength} karakter olabilir.`)
    .refine(val => !SQLI_REGEX.test(val), {
      message: `Geçersiz format: ${fieldName} alanı zararlı SQL veya kod komutları içeremez.`
    })
    .refine(val => !XSS_REGEX.test(val), {
      message: `Geçersiz format: ${fieldName} alanı yürütülebilir script komutları içeremez.`
    })
    .transform(val => sanitizeText(val));

/**
 * Contact Form Validation Schema
 */
export const contactFormSchema = z.object({
  name: z.string()
    .min(2, 'İsim en az 2 karakter olmalıdır.')
    .max(100, 'İsim çok uzun.')
    .refine(val => !SQLI_REGEX.test(val), { message: 'Geçersiz isim formatı.' })
    .refine(val => !XSS_REGEX.test(val), { message: 'Geçersiz script içeriği.' })
    .transform(val => sanitizeText(val)),

  email: z.string()
    .min(5, 'E-posta adresi gereklidir.')
    .max(120, 'E-posta adresi çok uzun.')
    .refine(val => isValidEmail(val), { message: 'Lütfen geçerli bir e-posta adresi girin (örn: isim@ornek.com).' })
    .refine(val => !SQLI_REGEX.test(val), { message: 'E-posta formatı geçersiz (SQL injection tespit edildi).' })
    .transform(val => val.trim().toLowerCase()),

  subject: z.string()
    .max(150, 'Konu çok uzun.')
    .optional()
    .refine(val => !val || !SQLI_REGEX.test(val), { message: 'Geçersiz konu formatı.' })
    .transform(val => sanitizeText(val || '')),

  message: z.string()
    .min(5, 'Mesajınız en az 5 karakter olmalıdır.')
    .max(5000, 'Mesajınız en fazla 5000 karakter olabilir.')
    .refine(val => !SQLI_REGEX.test(val), { message: 'Mesaj alanı güvenlik denetimini geçemedi (SQL komutu tespit edildi).' })
    .refine(val => !XSS_REGEX.test(val), { message: 'Mesaj alanında betik (script) çalıştırma denemesi engellendi.' })
    .transform(val => sanitizeMultilineText(val))
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

/**
 * Admin Passcode Validation Schema
 */
export const passcodeSchema = z.string()
  .min(1, 'Erişim anahtarı boş bırakılamaz.')
  .max(128, 'Erişim anahtarı en fazla 128 karakter olabilir.')
  .refine(val => !SQLI_REGEX.test(val), {
    message: 'Geçersiz şifre formatı: SQL komutları ile kimlik doğrulama atlatılamaz.'
  });

/**
 * Profile Edit Validation Schema
 */
export const profileSchema = z.object({
  name: z.string().min(1).max(100).transform(val => sanitizeText(val)),
  title: z.string().min(1).max(150).transform(val => sanitizeText(val)),
  bio: z.string().max(3000).transform(val => sanitizeMultilineText(val)),
  location: z.string().max(100).transform(val => sanitizeText(val)),
  email: z.string().email().transform(val => val.trim().toLowerCase()),
  github: z.string().max(200).transform(val => sanitizeUrl(val) || val),
  telegram: z.string().max(200).transform(val => sanitizeUrl(val) || val),
  whatsapp: z.string().max(100).transform(val => sanitizeText(val))
});

/**
 * Universal safe parser that returns typed result and error message
 */
export function validateContactForm(input: unknown): { success: boolean; data?: ContactFormData; error?: string } {
  const result = contactFormSchema.safeParse(input);
  if (!result.success) {
    return {
      success: false,
      error: result.error.issues[0]?.message || 'Doğrulama hatası oluştu.'
    };
  }
  return {
    success: true,
    data: result.data
  };
}

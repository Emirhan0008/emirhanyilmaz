import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, CheckCircle2, AlertCircle, X, ExternalLink, LogOut, Send, ShieldCheck, ArrowRight } from 'lucide-react';
import { User } from 'firebase/auth';
import {
  initWorkspaceAuth,
  googleSignInForGmail,
  logoutGoogleWorkspace,
  getWorkspaceAccessToken,
  sendEmailViaGmailApi
} from '../utils/googleWorkspace';

interface GmailContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetEmail: string;
  senderName: string;
  senderCompany: string;
  senderEmail: string;
  messageContent: string;
  intentSubject: string;
  lang?: 'tr' | 'en';
}

export const GmailContactModal: React.FC<GmailContactModalProps> = ({
  isOpen,
  onClose,
  targetEmail,
  senderName,
  senderCompany,
  senderEmail,
  messageContent,
  intentSubject,
  lang = 'tr'
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [tokenAvailable, setTokenAvailable] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showConfirmStep, setShowConfirmStep] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize Auth state listener
  useEffect(() => {
    if (!isOpen) return;

    const unsubscribe = initWorkspaceAuth(
      (user, token) => {
        setCurrentUser(user);
        setTokenAvailable(!!token);
      },
      () => {
        setCurrentUser(null);
        setTokenAvailable(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [isOpen]);

  const fullSubject = `[Portfolyo İletişim] ${intentSubject} — ${senderCompany || senderName || 'Ziyaretçi'}`;

  const preparedBody = [
    `Gönderici: ${senderName || 'Belirtilmedi'}`,
    senderCompany ? `Şirket/Kurum: ${senderCompany}` : null,
    senderEmail ? `İletişim E-Postası: ${senderEmail}` : null,
    `Konu / Amaç: ${intentSubject}`,
    `----------------------------------------`,
    messageContent || 'Merhaba Emirhan, siteniz üzerinden ulaşıyorum.'
  ].filter(Boolean).join('\n\n');

  const handleSignIn = async () => {
    setIsAuthenticating(true);
    setErrorMessage(null);
    try {
      const res = await googleSignInForGmail();
      if (res) {
        setCurrentUser(res.user);
        setTokenAvailable(true);
        setShowConfirmStep(true);
      }
    } catch (err: any) {
      console.error('Google Workspace Sign in error:', err);
      const code = err.code || '';
      const rawMsg = err.message || '';

      if (code === 'auth/popup-closed-by-user') {
        setErrorMessage(
          lang === 'tr'
            ? 'Giriş penceresi tamamlanmadan kapatıldı. İsterseniz aşağıdaki "Gmail Web ile Aç" seçeneğiyle doğrudan gönderebilirsiniz.'
            : 'Sign-in window was closed. You can send directly using "Open in Web Gmail" below.'
        );
      } else if (code === 'auth/unauthorized-domain') {
        setErrorMessage(
          lang === 'tr'
            ? `Bu önizleme alan adı (${window.location.hostname}) Firebase Console yetkili alan adları listesinde yer almıyor. Giriş yapmanıza gerek kalmadan aşağıdaki "Gmail Web ile Hemen Aç" butonuna tıklayarak mesajınızı anında iletebilirsiniz.`
            : `This domain (${window.location.hostname}) is not yet authorized in Firebase Console. You can immediately send without sign-in using "Open in Web Gmail" below.`
        );
      } else if (code === 'auth/popup-blocked') {
        setErrorMessage(
          lang === 'tr'
            ? 'Tarayıcınız açılır pencereyi (popup) engelledi. Lütfen tarayıcı adres çubuğundan açılır pencerelere izin verin veya aşağıdaki "Gmail Web ile Hemen Aç" butonunu kullanın.'
            : 'Browser blocked the popup window. Please allow popups or use the Web Gmail option below.'
        );
      } else if (code === 'auth/operation-not-allowed') {
        setErrorMessage(
          lang === 'tr'
            ? 'Firebase projesinde Google ile giriş henüz aktif edilmemiş. Aşağıdaki "Gmail Web ile Hemen Aç" yöntemiyle mesajınızı anında iletebilirsiniz.'
            : 'Google sign-in is not yet enabled in this Firebase project. You can send using Web Gmail below.'
        );
      } else {
        setErrorMessage(
          lang === 'tr'
            ? `Google ile giriş yapılamadı (${code || rawMsg || 'Erişim izni verilmedi'}). Aşağıdaki "Gmail Web ile Hemen Aç" seçeneğiyle hiçbir kuruluma gerek kalmadan mesajınızı gönderebilirsiniz.`
            : `Google sign in failed (${code || rawMsg || 'Permission denied'}). You can use the Web Gmail option below.`
        );
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleSignOut = async () => {
    await logoutGoogleWorkspace();
    setCurrentUser(null);
    setTokenAvailable(false);
    setShowConfirmStep(false);
  };

  const handleSendConfirmed = async () => {
    setIsSending(true);
    setErrorMessage(null);
    try {
      await sendEmailViaGmailApi({
        to: targetEmail,
        subject: fullSubject,
        body: preparedBody,
        fromName: senderName || currentUser?.displayName || undefined
      });
      setSendSuccess(true);
      setShowConfirmStep(false);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(
        err.message ||
          (lang === 'tr'
            ? 'Mesaj Gmail API ile gönderilirken bir hata oluştu.'
            : 'Error occurred while sending email via Gmail API.')
      );
    } finally {
      setIsSending(false);
    }
  };

  const openGmailWebDirectly = () => {
    const webGmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      targetEmail
    )}&su=${encodeURIComponent(fullSubject)}&body=${encodeURIComponent(preparedBody)}`;
    window.open(webGmailUrl, '_blank', 'noopener,noreferrer');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto bg-zinc-950 border border-emerald-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col gap-4 text-white scrollbar-thin scrollbar-thumb-white/20"
        >
          {/* Decorative Glow */}
          <div className="absolute -top-24 -right-24 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3 relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600/30 to-amber-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
                <Mail size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-extrabold text-white">
                    {lang === 'tr' ? 'Gmail ile Doğrudan Gönder' : 'Send via Gmail API'}
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-bold">
                    Official API
                  </span>
                </div>
                <p className="text-xs text-white/60">
                  {lang === 'tr'
                    ? 'Kendi Gmail hesabınızdan tek tıkla mesajınızı iletin'
                    : 'Dispatch verified message directly from your Gmail inbox'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-white/70 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-white/10"
              title={lang === 'tr' ? 'Kapat' : 'Close'}
            >
              <X size={16} />
            </button>
          </div>

          {/* Error Message banner */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-red-950/70 border border-red-500/50 flex flex-col gap-2.5 text-xs text-red-200 shadow-lg">
              <div className="flex items-start gap-2">
                <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed text-[11px] sm:text-xs text-red-100">{errorMessage}</div>
              </div>
              <div className="pt-2 border-t border-red-500/20 flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] text-white/70">
                  {lang === 'tr' ? 'Öneri: Giriş yapmadan Gmail Web ile anında gönderin:' : 'Suggested: Send immediately via Web Gmail:'}
                </span>
                <a
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
                    targetEmail
                  )}&su=${encodeURIComponent(fullSubject)}&body=${encodeURIComponent(preparedBody)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  <Mail size={13} />
                  <span>{lang === 'tr' ? "Gmail Web'de Hemen Aç ↗" : "Open in Gmail Web ↗"}</span>
                </a>
              </div>
            </div>
          )}

          {/* Body Content */}
          <div className="flex flex-col gap-3 relative z-10 text-xs">
            {sendSuccess ? (
              /* Success State */
              <div className="py-8 flex flex-col items-center text-center gap-3">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 size={32} />
                </div>
                <h4 className="text-base font-extrabold text-white">
                  {lang === 'tr' ? 'E-Postanız Başarıyla Gönderildi!' : 'Email Sent Successfully!'}
                </h4>
                <p className="text-xs text-white/75 max-w-md">
                  {lang === 'tr'
                    ? `Mesajınız resmi Gmail API üzerinden ${targetEmail} adresine ulaştırıldı. Bir kopyası da kendi Gmail 'Gönderilenler' kutunuzda yer almaktadır.`
                    : `Your message was delivered via official Gmail API to ${targetEmail}. A copy is safely stored in your Gmail Sent mailbox.`}
                </p>
                <div className="flex items-center gap-2 pt-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs cursor-pointer shadow-md transition-all"
                  >
                    {lang === 'tr' ? 'Tamam' : 'Close'}
                  </button>
                </div>
              </div>
            ) : showConfirmStep && currentUser && tokenAvailable ? (
              /* Mandatory User Confirmation Dialog Before Mutating API Call */
              <div className="flex flex-col gap-3 bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-emerald-400" />
                    <span className="font-extrabold text-white text-xs">
                      {lang === 'tr' ? 'Gönderme Onayı (Gmail Yetkilendirmesi)' : 'Send Confirmation'}
                    </span>
                  </div>
                  <span className="text-[10px] text-white/50 font-mono">
                    {currentUser.email}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-white/80">
                  <div className="flex items-center gap-2">
                    <span className="text-white/50 w-16 shrink-0">{lang === 'tr' ? 'Gönderen:' : 'From:'}</span>
                    <span className="font-semibold text-emerald-300 font-mono text-[11px] truncate">
                      {currentUser.displayName ? `${currentUser.displayName} (${currentUser.email})` : currentUser.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white/50 w-16 shrink-0">{lang === 'tr' ? 'Alıcı:' : 'To:'}</span>
                    <span className="font-semibold text-white font-mono text-[11px]">
                      {targetEmail} (Emirhan Yılmaz)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white/50 w-16 shrink-0">{lang === 'tr' ? 'Konu:' : 'Subject:'}</span>
                    <span className="font-medium text-white truncate text-[11px]">
                      {fullSubject}
                    </span>
                  </div>
                </div>

                <div className="mt-1 p-2.5 rounded-xl bg-black/60 border border-white/10 max-h-32 overflow-y-auto text-[11px] font-mono text-white/85 whitespace-pre-wrap leading-relaxed">
                  {preparedBody}
                </div>

                <p className="text-[10px] text-white/60">
                  {lang === 'tr'
                    ? '⚠️ "Onayla ve Gönder" butonuna bastığınızda, bu e-posta adınıza Gmail hesabınızdan gönderilecek ve gelen kutusu sahibine iletilecektir.'
                    : '⚠️ Clicking "Confirm and Send" will dispatch this email from your connected Gmail mailbox.'}
                </p>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setShowConfirmStep(false)}
                    disabled={isSending}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs cursor-pointer transition-all disabled:opacity-50"
                  >
                    {lang === 'tr' ? 'Vazgeç' : 'Cancel'}
                  </button>
                  <button
                    type="button"
                    onClick={handleSendConfirmed}
                    disabled={isSending}
                    className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/20 transition-all disabled:opacity-50"
                  >
                    <Send size={13} />
                    <span>
                      {isSending
                        ? lang === 'tr' ? 'Gönderiliyor...' : 'Sending...'
                        : lang === 'tr' ? 'Onayla ve Gönder' : 'Confirm & Send'}
                    </span>
                  </button>
                </div>
              </div>
            ) : (
              /* Authentication & Options View */
              <div className="flex flex-col gap-3.5">
                {/* Method 1: Sign in with Google (Official Button) */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white text-xs sm:text-sm">
                        {lang === 'tr' ? '1. Yöntem: Google Hesabınızla Giriş Yaparak Gönderin' : 'Option 1: Sign in with Google & Send Directly'}
                      </h4>
                      <p className="text-[11px] text-white/70">
                        {lang === 'tr'
                          ? 'En hızlı yol: E-postanız onayınızla doğrudan Emirhan\'ın gelen kutusuna ulaşır.'
                          : 'Direct in-app dispatch to Emirhan with user confirmation.'}
                      </p>
                    </div>
                  </div>

                  {currentUser && tokenAvailable ? (
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
                      <div className="flex items-center gap-2">
                        {currentUser.photoURL ? (
                          <img
                            src={currentUser.photoURL}
                            alt="User"
                            className="w-7 h-7 rounded-full border border-emerald-400"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-emerald-500 text-black font-bold flex items-center justify-center text-xs">
                            {currentUser.email?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-white text-xs">{currentUser.displayName || 'Google Kullanıcısı'}</div>
                          <div className="text-[10px] text-emerald-400 font-mono">{currentUser.email}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setShowConfirmStep(true)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center gap-1 cursor-pointer transition-all"
                        >
                          <span>{lang === 'tr' ? 'Mesajı Gönder' : 'Send Email'}</span>
                          <ArrowRight size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={handleSignOut}
                          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white cursor-pointer"
                          title={lang === 'tr' ? 'Çıkış Yap' : 'Sign out'}
                        >
                          <LogOut size={13} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Official Google Sign-In Styled Button */
                    <button
                      type="button"
                      onClick={handleSignIn}
                      disabled={isAuthenticating}
                      className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-gray-100 text-gray-800 font-semibold text-xs flex items-center justify-center gap-3 transition-all shadow-md cursor-pointer disabled:opacity-50 border border-gray-300"
                    >
                      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-4 h-4 shrink-0">
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                      </svg>
                      <span>
                        {isAuthenticating
                          ? lang === 'tr' ? 'Google ile Bağlanılıyor...' : 'Signing in...'
                          : lang === 'tr' ? 'Google ile Giriş Yap & Gmail API ile Gönder' : 'Sign in with Google to send via Gmail'}
                      </span>
                    </button>
                  )}
                </div>

                {/* Method 2: One-Click Web Gmail Compose Fallback */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white text-xs sm:text-sm flex items-center gap-1.5">
                        <ExternalLink size={13} className="text-red-400" />
                        <span>{lang === 'tr' ? '2. Yöntem: Gmail Web Sayfasında Taslak Aç' : 'Option 2: Open Prepared Draft in Gmail Web'}</span>
                      </h4>
                      <p className="text-[11px] text-white/70">
                        {lang === 'tr'
                          ? 'Giriş yapmadan, tarayıcınızdaki mevcut Gmail sekmesinde alıcı ve mesaj hazır olarak açılır.'
                          : 'No sign-in needed here: launches mail.google.com compose window with prefilled body.'}
                      </p>
                    </div>
                  </div>

                  <a
                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
                      targetEmail
                    )}&su=${encodeURIComponent(fullSubject)}&body=${encodeURIComponent(preparedBody)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-red-600/40 to-amber-600/30 hover:from-red-600/50 hover:to-amber-600/40 border border-red-500/50 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md group"
                  >
                    <Mail size={14} className="text-red-400 group-hover:scale-110 transition-transform" />
                    <span>{lang === 'tr' ? "Gmail Web'de Hemen Aç (mail.google.com)" : "Open in Web Gmail Directly"}</span>
                    <ExternalLink size={12} className="opacity-70 group-hover:opacity-100" />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Footer note */}
          <div className="border-t border-white/10 pt-2.5 flex items-center justify-between text-[10px] text-white/40">
            <span>Google Workspace Gmail Integration · Secure OAuth 2.0</span>
            <span>emirhan0008@gmail.com</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

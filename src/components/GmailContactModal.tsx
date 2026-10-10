import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ExternalLink, X, Copy, Check, Send } from 'lucide-react';

interface GmailContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetEmail: string;
  senderName?: string;
  senderCompany?: string;
  senderEmail?: string;
  messageContent?: string;
  intentSubject?: string;
  lang?: 'tr' | 'en';
}

export const GmailContactModal: React.FC<GmailContactModalProps> = ({
  isOpen,
  onClose,
  targetEmail = 'emirhan0008@gmail.com',
  senderName = '',
  senderCompany = '',
  senderEmail = '',
  messageContent = '',
  intentSubject = 'İletişim Talebi',
  lang = 'tr'
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const fullSubject = intentSubject
    ? `[Portfolyo İletişim] ${intentSubject} — ${senderCompany || senderName || (lang === 'tr' ? 'Ziyaretçi' : 'Visitor')}`
    : (lang === 'tr' ? 'Emirhan Yılmaz — İletişim Talebi' : 'Contact Request — Emirhan Yilmaz');

  const preparedBody = [
    senderName ? `${lang === 'tr' ? 'Gönderen' : 'Sender'}: ${senderName}` : null,
    senderCompany ? `${lang === 'tr' ? 'Şirket/Kurum' : 'Company'}: ${senderCompany}` : null,
    senderEmail ? `${lang === 'tr' ? 'İletişim E-Postası' : 'Contact Email'}: ${senderEmail}` : null,
    intentSubject ? `${lang === 'tr' ? 'Konu' : 'Subject'}: ${intentSubject}` : null,
    `----------------------------------------`,
    messageContent || (lang === 'tr' ? 'Merhaba Emirhan, siteniz üzerinden iletişime geçiyorum.' : 'Hello Emirhan, contacting you via your website.')
  ].filter(Boolean).join('\n\n');

  // 1. Gmail Web Direct Compose URL
  const webGmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    targetEmail
  )}&su=${encodeURIComponent(fullSubject)}&body=${encodeURIComponent(preparedBody)}`;

  // 2. Default Email Client Mailto URL
  const mailtoUrl = `mailto:${encodeURIComponent(targetEmail)}?subject=${encodeURIComponent(
    fullSubject
  )}&body=${encodeURIComponent(preparedBody)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(targetEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.18 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md bg-zinc-950 border border-white/15 rounded-3xl p-6 shadow-2xl flex flex-col gap-5 text-white"
        >
          {/* Header (Başlıklar) */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600/30 to-amber-500/20 border border-red-500/30 flex items-center justify-center text-red-400">
                <Mail size={20} />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">
                  {lang === 'tr' ? 'Gmail ile Gönder' : 'Send via Gmail'}
                </h3>
                <p className="text-xs text-white/60">
                  {lang === 'tr' ? 'Mesajınızı iletmek için bir yöntem seçin' : 'Choose a method to send your message'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-white/70 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-white/10"
              title={lang === 'tr' ? 'Kapat' : 'Close'}
            >
              <X size={16} />
            </button>
          </div>

          {/* Basit İki Buton (The Two Simple Buttons) */}
          <div className="flex flex-col gap-3">
            {/* 1. Buton: Gmail Web */}
            <a
              href={webGmailUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="w-full p-4 rounded-2xl bg-gradient-to-r from-red-600/30 hover:from-red-600/45 to-amber-600/20 hover:to-amber-600/35 border border-red-500/40 hover:border-red-500/60 flex items-center justify-between transition-all group cursor-pointer shadow-lg hover:scale-[1.01]"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-md shrink-0">
                  <Mail size={18} />
                </div>
                <div className="text-left">
                  <div className="text-sm font-extrabold text-white flex items-center gap-1.5">
                    <span>{lang === 'tr' ? 'Gmail Web ile Aç' : 'Open in Gmail Web'}</span>
                    <ExternalLink size={13} className="text-red-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                  <div className="text-[11px] text-white/60">
                    {lang === 'tr' ? 'Tarayıcınızda hazır taslak açılır (mail.google.com)' : 'Opens ready draft in mail.google.com'}
                  </div>
                </div>
              </div>
            </a>

            {/* 2. Buton: Varsayılan E-Posta Uygulaması */}
            <a
              href={mailtoUrl}
              onClick={onClose}
              className="w-full p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/25 flex items-center justify-between transition-all group cursor-pointer shadow-md hover:scale-[1.01]"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white/15 text-white flex items-center justify-center shadow-md shrink-0">
                  <Send size={18} />
                </div>
                <div className="text-left">
                  <div className="text-sm font-extrabold text-white flex items-center gap-1.5">
                    <span>{lang === 'tr' ? 'E-Posta Uygulamasıyla Aç' : 'Open in Mail App'}</span>
                    <ExternalLink size={13} className="text-white/50 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                  <div className="text-[11px] text-white/60">
                    {lang === 'tr' ? 'Outlook, Apple Mail vb. cihaz uygulamasını açar' : 'Opens default system email client'}
                  </div>
                </div>
              </div>
            </a>
          </div>

          {/* Footer: E-Posta kopyalama seçeneği */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
            <span className="font-mono text-[11px] text-white/70 truncate">{targetEmail}</span>
            <button
              type="button"
              onClick={handleCopy}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-[11px] text-white font-medium flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check size={12} className="text-emerald-400" />
                  <span className="text-emerald-400">{lang === 'tr' ? 'Kopyalandı!' : 'Copied!'}</span>
                </>
              ) : (
                <>
                  <Copy size={12} className="text-white/60" />
                  <span>{lang === 'tr' ? 'Kopyala' : 'Copy'}</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

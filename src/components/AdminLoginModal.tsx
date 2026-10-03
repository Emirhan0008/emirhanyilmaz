import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Key, Eye, EyeOff, Lock, AlertTriangle, X } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  logo: string;
  adminPasscode: string;
  setAdminPasscode: (val: string) => void;
  showPasscode: boolean;
  setShowPasscode: (val: boolean | ((prev: boolean) => boolean)) => void;
  onSubmit: (e?: React.FormEvent) => void;
  lockoutUntil: number;
  lockoutDurationLeft: number;
  failedAttempts: number;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  logo,
  adminPasscode,
  setAdminPasscode,
  showPasscode,
  setShowPasscode,
  onSubmit,
  lockoutUntil,
  lockoutDurationLeft,
  failedAttempts
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-sm p-6 sm:p-8 liquid-glass rounded-3xl border border-white/10 shadow-2xl flex flex-col gap-5 text-center overflow-hidden"
          >
            {/* Outer neon border glow */}
            <div className="absolute -inset-px rounded-3xl bg-gradient-to-r from-white/5 via-white/15 to-white/5 opacity-50 pointer-events-none" />

            {/* Logo in Admin Modal */}
            <div className="w-14 h-14 mx-auto flex items-center justify-center">
              <img 
                src={logo} 
                alt="Emirhan Yılmaz Logo" 
                className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]"
              />
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all cursor-pointer"
              title="Kapat"
            >
              <X size={14} />
            </button>

            {/* Header Icon */}
            <div className="mx-auto w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/80 animate-pulse">
              {lockoutUntil > 0 ? (
                <AlertTriangle size={22} className="text-red-400" />
              ) : (
                <Lock size={20} />
              )}
            </div>

            {/* Title & Desc */}
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold tracking-tight text-white flex items-center justify-center gap-2">
                <Shield size={16} className="text-white/60" /> Sistem Doğrulaması
              </h3>
              <p className="text-xs text-white/60 leading-relaxed max-w-[280px] mx-auto">
                Devam etmek için erişim anahtarınızı girin.
              </p>
            </div>

            {lockoutUntil > 0 ? (
              /* Locked Out View */
              <div className="py-4 px-3 rounded-2xl bg-red-950/20 border border-red-500/20 text-center space-y-3">
                <span className="text-[10px] text-red-400 font-extrabold tracking-widest uppercase block animate-pulse">
                  GÜVENLİK KİLİDİ AKTİF
                </span>
                <p className="text-xs text-white/80">
                  Çok sayıda hatalı deneme algılandı.
                </p>
                <p className="text-[13px] text-red-400 font-mono font-bold">
                  Kalan Bekleme Süresi: {Math.floor(lockoutDurationLeft / 60)}dk {lockoutDurationLeft % 60}sn
                </p>
                <div className="py-2.5 px-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center gap-2 text-[11px] text-white/70">
                  <Shield size={13} className="text-red-400 shrink-0" />
                  <span>Güvenlik gereği süre dolana kadar giriş yapılamaz.</span>
                </div>
              </div>
            ) : (
              /* Passcode Form View */
              <div className="space-y-4">
                <form onSubmit={onSubmit} className="space-y-3">
                  <div className="relative">
                    <input
                      type={showPasscode ? 'text' : 'password'}
                      required
                      placeholder="Erişim anahtarı..."
                      value={adminPasscode}
                      onChange={e => setAdminPasscode(e.target.value)}
                      className="w-full py-3 pl-4 pr-11 rounded-xl bg-white/5 border border-white/10 focus:outline-hidden focus:ring-1 focus:ring-emerald-400 text-xs text-white placeholder-white/30 font-mono tracking-widest text-center"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasscode(prev => !prev)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer"
                      title={showPasscode ? "Gizle" : "Göster"}
                    >
                      {showPasscode ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>

                  {failedAttempts > 0 && (
                    <span className="text-[10px] text-amber-400/90 font-bold block">
                      ⚠️ Geçersiz anahtar. Kalan Hak: {5 - failedAttempts}
                    </span>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer text-emerald-300 hover:text-emerald-200"
                  >
                    <Key size={13} />
                    <span>Doğrula ve Giriş Yap</span>
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

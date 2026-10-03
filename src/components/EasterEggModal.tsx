import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Eye, EyeOff, X } from 'lucide-react';

interface EasterEggModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  setUsername: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  showPassword: boolean;
  setShowPassword: (val: boolean | ((prev: boolean) => boolean)) => void;
  error: string;
  onSubmit: (e: React.FormEvent) => void;
  showMeltingSlagHeart: boolean;
  onCloseMeltingHeart: () => void;
}

export const EasterEggModal: React.FC<EasterEggModalProps> = ({
  isOpen,
  onClose,
  username,
  setUsername,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  error,
  onSubmit,
  showMeltingSlagHeart,
  onCloseMeltingHeart
}) => {
  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-sm rounded-[2.5rem] liquid-glass-strong border border-rose-500/30 p-7 shadow-2xl relative text-center space-y-5"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-white/10"
                title="Kapat"
              >
                <X size={15} />
              </button>

              {/* Heart Lock Icon */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-600/30 to-red-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center mx-auto shadow-lg shadow-rose-500/20">
                <Heart size={26} className="fill-rose-500/30 text-rose-400 animate-pulse" />
              </div>

              {/* Title & Desc */}
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold tracking-tight text-white flex items-center justify-center gap-2">
                  Özel Erişim Portalı
                </h3>
                <p className="text-xs text-white/60 leading-relaxed max-w-[280px] mx-auto">
                  Lütfen yetkili kullanıcı adı ve şifrenizi girin.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={onSubmit} className="space-y-3.5 text-left">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-rose-300/80 px-1">Kullanıcı Adı</label>
                  <input
                    type="text"
                    required
                    placeholder="Kullanıcı adı..."
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="w-full py-2.5 px-3.5 rounded-xl bg-white/5 border border-white/10 focus:outline-hidden focus:ring-1 focus:ring-rose-400 text-xs text-white placeholder-white/30 font-medium"
                    autoFocus
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-rose-300/80 px-1">Şifre</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Şifre..."
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full py-2.5 pl-3.5 pr-10 rounded-xl bg-white/5 border border-white/10 focus:outline-hidden focus:ring-1 focus:ring-rose-400 text-xs text-white placeholder-white/30 font-mono tracking-widest"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(prev => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer"
                      title={showPassword ? "Gizle" : "Göster"}
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <span className="text-[10px] text-rose-400 font-bold block text-center">
                    ⚠️ {error}
                  </span>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer text-white shadow-lg shadow-rose-600/30 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Heart size={14} className="fill-white" />
                  <span>Giriş Yap ve Kilidi Aç</span>
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* EASTER EGG FULL-SCREEN SLAG & GIANT RED HEART OVERLAY */}
      <AnimatePresence>
        {showMeltingSlagHeart && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/95 overflow-hidden select-none"
          >
            {/* Ambient Lava Embers & Slag Flares */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_rgba(220,38,38,0.3)_0%,_rgba(0,0,0,0.95)_70%)]" />

            {/* Center Stage: Emerged Giant Red Heart */}
            <div className="relative flex flex-col items-center justify-center z-10 text-center px-4">
              <motion.div
                initial={{ scale: 0.1, opacity: 0 }}
                animate={{ scale: [0.1, 1.25, 0.95, 1.05, 1], opacity: 1 }}
                transition={{ duration: 1.8, ease: "easeOut" }}
                className="easter-heart-beating cursor-pointer transition-transform duration-300 hover:scale-110"
              >
                <svg
                  className="w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 drop-shadow-[0_0_60px_rgba(239,68,68,0.95)] filter"
                  viewBox="0 0 24 24"
                  fill="url(#heartGrad)"
                  stroke="#ff4d4d"
                  strokeWidth="0.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <defs>
                    <radialGradient id="heartGrad" cx="35%" cy="35%" r="65%">
                      <stop offset="0%" stopColor="#ff4d6d" />
                      <stop offset="50%" stopColor="#e11d48" />
                      <stop offset="100%" stopColor="#9f1239" />
                    </radialGradient>
                  </defs>
                  <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
                </svg>
              </motion.div>

              {/* Heart Dedication Message */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 1 }}
                className="mt-8 space-y-3"
              >
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-wider drop-shadow-[0_0_20px_rgba(255,255,255,0.7)] font-serif italic">
                  Seviyorum, hem de çok. ❤️
                </h2>
                <p className="text-xs sm:text-sm text-red-200/90 font-medium tracking-widest uppercase">
                  Dünya eriyip yok olsa da sevgim bakidir kar tanem.
                </p>
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={onCloseMeltingHeart}
                    className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95"
                  >
                    Siteye Geri Dön
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

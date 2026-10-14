import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Eye, EyeOff, X, Lock } from 'lucide-react';

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
              initial={{ scale: 0.94, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 16 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-sm rounded-3xl bg-zinc-950/95 border border-white/10 p-7 shadow-2xl relative text-center space-y-5 backdrop-blur-2xl"
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

              {/* Discrete Security Lock Icon */}
              <div className="w-12 h-12 rounded-2xl bg-white/5 text-zinc-300 border border-white/10 flex items-center justify-center mx-auto shadow-sm">
                <Lock size={20} className="text-zinc-300" />
              </div>

              {/* Title & Desc */}
              <div className="space-y-1">
                <h3 className="text-lg font-bold tracking-tight text-white flex items-center justify-center gap-2">
                  Erişim Doğrulaması
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed max-w-[280px] mx-auto">
                  Devam etmek için yetkili kullanıcı adı ve anahtarınızı girin.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={onSubmit} className="space-y-3.5 text-left">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 px-1">Kullanıcı Adı</label>
                  <input
                    type="text"
                    required
                    placeholder="Kullanıcı adı..."
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="w-full py-2.5 px-3.5 rounded-xl bg-zinc-900/90 border border-white/10 focus:outline-hidden focus:border-zinc-400 text-xs text-white placeholder-zinc-500 font-medium transition-colors"
                    autoFocus
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 px-1">Anahtar / Şifre</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Şifre..."
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full py-2.5 pl-3.5 pr-10 rounded-xl bg-zinc-900/90 border border-white/10 focus:outline-hidden focus:border-zinc-400 text-xs text-white placeholder-zinc-500 font-mono tracking-widest transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(prev => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                      title={showPassword ? "Gizle" : "Göster"}
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <span className="text-[10px] text-red-400 font-bold block text-center">
                    ⚠️ {error}
                  </span>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-98 border border-white/10"
                >
                  <Lock size={13} className="text-zinc-300" />
                  <span>Doğrula ve Giriş Yap</span>
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

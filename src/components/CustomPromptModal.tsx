import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

export interface PromptDialogState {
  isOpen: boolean;
  title: string;
  description?: string;
  defaultValue?: string;
  placeholder?: string;
  onConfirm: (value: string) => void;
}

interface CustomPromptModalProps {
  dialog: PromptDialogState | null;
  onClose: () => void;
}

export const CustomPromptModal: React.FC<CustomPromptModalProps> = ({
  dialog,
  onClose
}) => {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (dialog?.isOpen) {
      setInputValue(dialog.defaultValue || '');
    }
  }, [dialog]);

  if (!dialog || !dialog.isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[220] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          className="w-full max-w-md rounded-3xl liquid-glass-strong border border-white/20 p-6 shadow-2xl flex flex-col gap-4 text-left"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <span>🔗</span> {dialog.title}
            </h3>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>

          {dialog.description && (
            <p className="text-xs text-white/70 leading-relaxed">
              {dialog.description}
            </p>
          )}

          <input
            type="text"
            autoFocus
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                dialog.onConfirm(inputValue);
                onClose();
              } else if (e.key === 'Escape') {
                onClose();
              }
            }}
            placeholder={dialog.placeholder || "https://..."}
            className="w-full py-2.5 px-4 rounded-xl bg-black/60 border border-white/15 focus:outline-hidden focus:ring-1 focus:ring-emerald-400 text-xs text-white placeholder-white/40 font-mono"
          />

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-bold transition-all cursor-pointer"
            >
              İptal
            </button>
            <button
              type="button"
              onClick={() => {
                dialog.onConfirm(inputValue);
                onClose();
              }}
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-extrabold transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              Kaydet
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

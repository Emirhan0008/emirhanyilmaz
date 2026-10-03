import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle } from 'lucide-react';

export interface ConfirmDialogState {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  onConfirm: () => void;
}

interface CustomConfirmModalProps {
  dialog: ConfirmDialogState | null;
  onClose: () => void;
}

export const CustomConfirmModal: React.FC<CustomConfirmModalProps> = ({
  dialog,
  onClose
}) => {
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
          className="w-full max-w-sm rounded-3xl liquid-glass-strong border border-red-500/30 p-6 shadow-2xl flex flex-col gap-4 text-center"
        >
          <div className="w-12 h-12 rounded-full bg-red-950/50 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto">
            <AlertTriangle size={20} />
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-extrabold text-white">
              {dialog.title}
            </h3>
            <p className="text-xs text-white/70 leading-relaxed">
              {dialog.description}
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-bold transition-all cursor-pointer"
            >
              Vazgeç
            </button>
            <button
              type="button"
              onClick={() => {
                dialog.onConfirm();
                onClose();
              }}
              className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-extrabold transition-all cursor-pointer shadow-lg shadow-red-600/30"
            >
              {dialog.confirmText || 'Evet, Onayla'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

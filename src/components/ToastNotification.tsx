import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Star, Sparkles } from 'lucide-react';

interface ToastNotificationProps {
  message: string | null;
  type: 'success' | 'favorite' | 'info' | null;
  onClear: () => void;
}

export function ToastNotification({ message, type, onClear }: ToastNotificationProps) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClear();
    }, 4000);
    return () => clearTimeout(timer);
  }, [message, onClear]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-[#0e0d16] border border-white/[0.08] shadow-[0_8px_30px_rgb(0,0,0,0.5)] rounded-xl px-4 py-3 min-w-[280px]"
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        >
          {/* Accent Glow backdrop */}
          <div className="absolute inset-0 rounded-xl bg-[#a684ff]/[0.02] pointer-events-none" />

          {/* Dynamic icon depending on type */}
          {type === 'success' && <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0" />}
          {type === 'favorite' && <Star size={18} className="text-[#a684ff] fill-[#a684ff] flex-shrink-0" />}
          {type === 'info' && <Sparkles size={18} className="text-blue-400 flex-shrink-0" />}

          <div className="flex-1">
            <p className="text-xs font-semibold text-white/95 leading-tight">{message}</p>
          </div>

          <button 
            onClick={onClear} 
            className="text-[#6a6a75] hover:text-white text-xs font-bold transition-colors cursor-pointer pl-2 border-l border-white/[0.04]"
          >
            DISMISS
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useWalletStore } from "@/store/walletStore";
import { X } from "lucide-react";

export function Toasts() {
  const toasts = useWalletStore((state) => state.toasts);
  const removeToast = useWalletStore((state) => state.removeToast);

  return (
    <div
      className="fixed top-4 right-4 z-50 flex flex-col gap-2"
      aria-live="polite"
      aria-atomic="true"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 400, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 400, scale: 0.8 }}
            transition={{ 
              type: "spring",
              stiffness: 300,
              damping: 25
            }}
            className={`
              flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl backdrop-blur-xl
              min-w-[320px] max-w-md border
              ${
                toast.type === "success"
                  ? "glass border-green-400/30 text-green-100 bg-green-500/10 shadow-green-400/20"
                  : toast.type === "error"
                  ? "glass border-red-400/30 text-red-100 bg-red-500/10 shadow-red-400/20"
                  : "glass border-arbitrum-cyan/30 text-arbitrum-cyan bg-arbitrum-blue/10 shadow-arbitrum-blue/20"
              }
            `}
            role="alert"
          >
            <p className="flex-1 text-sm font-medium">{toast.message}</p>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => removeToast(toast.id)}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Cerrar notificación"
            >
              <X className="w-4 h-4" />
            </motion.button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}


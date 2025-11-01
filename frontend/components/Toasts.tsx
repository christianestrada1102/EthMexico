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
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg backdrop-blur-xl
              min-w-[300px] max-w-md
              ${
                toast.type === "success"
                  ? "bg-green-500/20 border border-green-500/30 text-green-100"
                  : toast.type === "error"
                  ? "bg-red-500/20 border border-red-500/30 text-red-100"
                  : "bg-blue-500/20 border border-blue-500/30 text-blue-100"
              }
            `}
            role="alert"
          >
            <p className="flex-1 text-sm font-medium">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Cerrar notificación"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}


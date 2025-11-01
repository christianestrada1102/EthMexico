"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Moon, Sun, Trash2 } from "lucide-react";
import { useWalletStore } from "@/store/walletStore";
import { Toasts } from "@/components/Toasts";

export default function ConfigPage() {
  const router = useRouter();
  const theme = useWalletStore((state) => state.theme);
  const setTheme = useWalletStore((state) => state.setTheme);
  const clearHistory = useWalletStore((state) => state.clearHistory);
  const addToast = useWalletStore((state) => state.addToast);
  const history = useWalletStore((state) => state.history);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const handleToggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    addToast(`Tema cambiado a ${newTheme === "dark" ? "oscuro" : "claro"}.`, "success");
  };

  const handleResetSession = () => {
    if (confirm("¿Estás seguro de que quieres restablecer la sesión? Esto eliminará todo el historial.")) {
      clearHistory();
      localStorage.removeItem("bridge-fast-withdraw-storage");
      addToast("Sesión restablecida.", "success");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-arbitrum-navy via-arbitrum-dark to-arbitrum-navy p-4 md:p-8 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-arbitrum-blue/5 rounded-full blur-3xl" />
      </div>

      <Toasts />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="flex items-center gap-2 mb-8 text-gray-300 hover:text-arbitrum-cyan transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="p-6 rounded-2xl glass border border-arbitrum-blue/30">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-arbitrum-blue to-arbitrum-cyan bg-clip-text text-transparent mb-6">
              Configuración
            </h2>

            {/* Theme Toggle */}
            <div className="flex items-center justify-between p-5 rounded-2xl glass border border-arbitrum-blue/30 mb-4">
              <div>
                <h3 className="font-semibold text-white mb-1">
                  Tema
                </h3>
                <p className="text-sm text-gray-300">
                  Cambiar entre tema claro y oscuro
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleToggleTheme}
                className="p-3 rounded-xl glass border border-arbitrum-blue/30 hover:border-arbitrum-cyan/50 transition-all"
                aria-label="Cambiar tema"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5 text-arbitrum-cyan" />
                ) : (
                  <Moon className="w-5 h-5 text-arbitrum-blue" />
                )}
              </motion.button>
            </div>

            {/* Reset Session */}
            <div className="flex items-center justify-between p-5 rounded-2xl glass border border-arbitrum-blue/30">
              <div>
                <h3 className="font-semibold text-white mb-1">
                  Restablecer Sesión
                </h3>
                <p className="text-sm text-gray-300">
                  Eliminar todo el historial y datos locales
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleResetSession}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 font-semibold transition-all"
              >
                <Trash2 className="w-4 h-4" />
                <span>Restablecer</span>
              </motion.button>
            </div>
          </div>

          {/* Stats */}
          <div className="p-6 rounded-2xl glass border border-arbitrum-blue/30">
            <h3 className="text-xl font-semibold text-white mb-4 bg-gradient-to-r from-arbitrum-blue to-arbitrum-cyan bg-clip-text text-transparent">
              Estadísticas
            </h3>
            <p className="text-gray-300">
              Elementos en historial: <strong className="text-arbitrum-cyan">{history.length}</strong>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}


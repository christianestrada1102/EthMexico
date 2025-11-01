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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-4 md:p-8">
      <Toasts />

      <div className="max-w-4xl mx-auto">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="flex items-center gap-2 mb-8 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="p-6 rounded-2xl bg-white/10 dark:bg-gray-900/50 backdrop-blur-xl border border-white/20">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Configuración
            </h2>

            {/* Theme Toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 dark:bg-gray-800/50 border border-white/10 mb-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Tema
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Cambiar entre tema claro y oscuro
                </p>
              </div>
              <button
                onClick={handleToggleTheme}
                className="p-3 rounded-xl bg-white/10 dark:bg-gray-800/50 hover:bg-white/20 dark:hover:bg-gray-800/70 transition-colors"
                aria-label="Cambiar tema"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5 text-gray-900 dark:text-white" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-900 dark:text-white" />
                )}
              </button>
            </div>

            {/* Reset Session */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 dark:bg-gray-800/50 border border-white/10">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Restablecer Sesión
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Eliminar todo el historial y datos locales
                </p>
              </div>
              <button
                onClick={handleResetSession}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-600 dark:text-red-400 font-semibold transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Restablecer</span>
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="p-6 rounded-2xl bg-white/10 dark:bg-gray-900/50 backdrop-blur-xl border border-white/20">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Estadísticas
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Elementos en historial: <strong>{history.length}</strong>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}


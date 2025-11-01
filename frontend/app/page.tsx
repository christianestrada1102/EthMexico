"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Wallet, ArrowRight } from "lucide-react";
import { WalletModal } from "@/components/WalletModal";
import { useWalletStore } from "@/store/walletStore";

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const isConnected = useWalletStore((state) => state.isConnected);
  const theme = useWalletStore((state) => state.theme);

  useEffect(() => {
    // Apply theme to document
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    if (isConnected) {
      router.push("/dashboard");
    }
  }, [isConnected, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-8 shadow-xl">
            <Wallet className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            BridgeFastWithdraw
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-2">
            Sistema de Retiros Rápidos L2→L1
          </p>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-12">
            Recibe tus fondos instantáneamente en lugar de esperar 7 días
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Wallet className="w-5 h-5" />
            <span>Conectar Wallet</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl border border-white/20"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                ⚡ Instantáneo
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Recibe tus fondos inmediatamente sin esperar
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl border border-white/20"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                🔒 Seguro
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Sistema de bonds y validaciones robustas
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-6 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl border border-white/20"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                💰 Comisiones Justas
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Comisión del 1% para retiros rápidos
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <WalletModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}


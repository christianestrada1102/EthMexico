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
    <div className="min-h-screen bg-gradient-to-br from-arbitrum-navy via-arbitrum-dark to-arbitrum-navy flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-arbitrum-blue/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-arbitrum-cyan/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="max-w-4xl w-full text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-arbitrum-blue to-arbitrum-cyan mb-8 shadow-2xl shadow-arbitrum-blue/40"
          >
            <Wallet className="w-12 h-12 text-white" />
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-arbitrum-blue via-arbitrum-cyan to-arbitrum-blue bg-clip-text text-transparent mb-4 bg-[length:200%_auto] animate-[shimmer_3s_ease-in-out_infinite]"
          >
            BridgeFastWithdraw
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl text-gray-300 mb-2 font-medium"
          >
            Sistema de Retiros Rápidos L2→L1
          </motion.p>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-gray-400 mb-12"
          >
            Recibe tus fondos instantáneamente en lugar de esperar 7 días
          </motion.p>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(40, 160, 240, 0.5)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-3 px-8 py-5 rounded-2xl bg-gradient-to-r from-arbitrum-blue to-arbitrum-cyan text-white font-semibold text-lg shadow-2xl shadow-arbitrum-blue/40 transition-all duration-200 border border-arbitrum-cyan/30"
          >
            <Wallet className="w-5 h-5" />
            <span>Conectar Wallet</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="p-6 rounded-2xl glass border border-arbitrum-blue/30 hover:border-arbitrum-cyan/50 transition-all"
            >
              <h3 className="text-lg font-semibold text-white mb-2">
                ⚡ Instantáneo
              </h3>
              <p className="text-gray-300">
                Recibe tus fondos inmediatamente sin esperar
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="p-6 rounded-2xl glass border border-arbitrum-blue/30 hover:border-arbitrum-cyan/50 transition-all"
            >
              <h3 className="text-lg font-semibold text-white mb-2">
                🔒 Seguro
              </h3>
              <p className="text-gray-300">
                Sistema de bonds y validaciones robustas
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="p-6 rounded-2xl glass border border-arbitrum-blue/30 hover:border-arbitrum-cyan/50 transition-all"
            >
              <h3 className="text-lg font-semibold text-white mb-2">
                💰 Comisiones Justas
              </h3>
              <p className="text-gray-300">
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


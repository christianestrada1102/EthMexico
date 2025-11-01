"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { WalletCard } from "@/components/WalletCard";
import { RequestWithdrawalModal } from "@/components/RequestWithdrawalModal";
import { Toasts } from "@/components/Toasts";
import { useWalletStore } from "@/store/walletStore";
import { Plus, LogOut, Settings } from "lucide-react";
import { getWithdrawalCounter } from "@/lib/contract";
import { CONTRACT_ADDRESS } from "@/lib/constants";

export default function DashboardPage() {
  const router = useRouter();
  const wallet = useWalletStore((state) => state.wallet);
  const disconnect = useWalletStore((state) => state.disconnect);
  const addToast = useWalletStore((state) => state.addToast);
  const theme = useWalletStore((state) => state.theme);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [withdrawalCount, setWithdrawalCount] = useState(0);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    if (!wallet) {
      router.push("/");
    }
  }, [wallet, router]);

  useEffect(() => {
    const loadWithdrawalCount = async () => {
      if (wallet?.providerType === "metamask" && wallet.provider) {
        try {
          const count = await getWithdrawalCounter(wallet.provider);
          setWithdrawalCount(Number(count));
        } catch (error) {
          console.error("Error loading withdrawal count:", error);
        }
      }
    };
    loadWithdrawalCount();
  }, [wallet]);

  const handleDisconnect = () => {
    disconnect();
    addToast("Wallet desconectada.", "info");
    router.push("/");
  };

  if (!wallet) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-arbitrum-navy via-arbitrum-dark to-arbitrum-navy p-4 md:p-8 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-arbitrum-blue/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-arbitrum-cyan/5 rounded-full blur-3xl" />
      </div>

      <Toasts />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-arbitrum-blue to-arbitrum-cyan bg-clip-text text-transparent">
            Dashboard
          </h1>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/config")}
              className="p-3 rounded-xl glass border border-arbitrum-blue/30 hover:border-arbitrum-cyan/50 transition-all"
              aria-label="Configuración"
            >
              <Settings className="w-5 h-5 text-white" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDisconnect}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 font-semibold transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Desconectar</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Wallet Card */}
        <div className="mb-8">
          <WalletCard />
        </div>

        {/* Contract Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 p-5 rounded-2xl glass border border-arbitrum-blue/30"
        >
          <p className="text-sm text-gray-300">
            <span className="font-semibold text-arbitrum-cyan">Contrato:</span>{" "}
            <span className="font-mono text-white">{CONTRACT_ADDRESS.slice(0, 10)}...{CONTRACT_ADDRESS.slice(-8)}</span>
          </p>
          <p className="text-sm text-gray-300 mt-2">
            <span className="font-semibold text-arbitrum-cyan">Solicitudes totales:</span>{" "}
            <span className="text-white font-bold">{withdrawalCount}</span>
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(40, 160, 240, 0.4)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowRequestModal(true)}
            className="flex items-center justify-center gap-3 p-6 rounded-2xl bg-gradient-to-r from-arbitrum-blue to-arbitrum-cyan text-white font-semibold transition-all duration-200 shadow-lg shadow-arbitrum-blue/30 border border-arbitrum-cyan/30"
          >
            <Plus className="w-5 h-5" />
            <span>Solicitar Retiro</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02, borderColor: "rgba(40, 160, 240, 0.5)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => addToast("Función en desarrollo", "info")}
            className="flex items-center justify-center gap-3 p-6 rounded-2xl glass border border-arbitrum-blue/30 text-white font-semibold transition-all duration-200"
          >
            <span>Proveer Liquidez</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02, borderColor: "rgba(40, 160, 240, 0.5)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => addToast("Función en desarrollo", "info")}
            className="flex items-center justify-center gap-3 p-6 rounded-2xl glass border border-arbitrum-blue/30 text-white font-semibold transition-all duration-200"
          >
            <span>Finalizar Retiros</span>
          </motion.button>
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-2xl glass border border-arbitrum-blue/30"
        >
          <h2 className="text-xl font-semibold text-white mb-4 bg-gradient-to-r from-arbitrum-blue to-arbitrum-cyan bg-clip-text text-transparent">
            ¿Cómo funciona?
          </h2>
          <div className="space-y-3 text-gray-300">
            <p>
              1. <strong className="text-arbitrum-cyan">Solicita un retiro:</strong> Envía ETH al contrato para solicitar un retiro rápido.
            </p>
            <p>
              2. <strong className="text-arbitrum-cyan">Proveedor de liquidez:</strong> Un LP adelanta tus fondos inmediatamente (menos comisión).
            </p>
            <p>
              3. <strong className="text-arbitrum-cyan">Finalización:</strong> Después del challenge period, el LP recupera su capital + comisión.
            </p>
          </div>
        </motion.div>
      </div>

      <RequestWithdrawalModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
      />
    </div>
  );
}


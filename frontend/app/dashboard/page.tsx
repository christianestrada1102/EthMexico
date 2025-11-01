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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-4 md:p-8">
      <Toasts />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/config")}
              className="p-3 rounded-xl bg-white/10 dark:bg-gray-800/50 backdrop-blur-xl border border-white/20 hover:bg-white/20 transition-colors"
              aria-label="Configuración"
            >
              <Settings className="w-5 h-5 text-gray-900 dark:text-white" />
            </button>
            <button
              onClick={handleDisconnect}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-600 dark:text-red-400 font-semibold transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Desconectar</span>
            </button>
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
          className="mb-8 p-4 rounded-xl bg-white/10 dark:bg-gray-900/50 backdrop-blur-xl border border-white/20"
        >
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-semibold">Contrato:</span>{" "}
            <span className="font-mono">{CONTRACT_ADDRESS.slice(0, 10)}...{CONTRACT_ADDRESS.slice(-8)}</span>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            <span className="font-semibold">Solicitudes totales:</span> {withdrawalCount}
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
        >
          <button
            onClick={() => setShowRequestModal(true)}
            className="flex items-center justify-center gap-3 p-6 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>Solicitar Retiro</span>
          </button>

          <button
            onClick={() => addToast("Función en desarrollo", "info")}
            className="flex items-center justify-center gap-3 p-6 rounded-xl bg-white/10 dark:bg-gray-800/50 backdrop-blur-xl border border-white/20 hover:bg-white/20 dark:hover:bg-gray-800/70 text-gray-900 dark:text-white font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Proveer Liquidez</span>
          </button>

          <button
            onClick={() => addToast("Función en desarrollo", "info")}
            className="flex items-center justify-center gap-3 p-6 rounded-xl bg-white/10 dark:bg-gray-800/50 backdrop-blur-xl border border-white/20 hover:bg-white/20 dark:hover:bg-gray-800/70 text-gray-900 dark:text-white font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Finalizar Retiros</span>
          </button>
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-xl bg-white/10 dark:bg-gray-900/50 backdrop-blur-xl border border-white/20"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            ¿Cómo funciona?
          </h2>
          <div className="space-y-3 text-gray-600 dark:text-gray-400">
            <p>
              1. <strong>Solicita un retiro:</strong> Envía ETH al contrato para solicitar un retiro rápido.
            </p>
            <p>
              2. <strong>Proveedor de liquidez:</strong> Un LP adelanta tus fondos inmediatamente (menos comisión).
            </p>
            <p>
              3. <strong>Finalización:</strong> Después del challenge period, el LP recupera su capital + comisión.
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


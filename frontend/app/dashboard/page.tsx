"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { WalletCard } from "@/components/WalletCard";
import { RequestWithdrawalModal } from "@/components/RequestWithdrawalModal";
import { SignModal } from "@/components/SignModal";
import { SendModal } from "@/components/SendModal";
import { ActionButtons } from "@/components/ActionButtons";
import { HistoryList } from "@/components/HistoryList";
import { Toasts } from "@/components/Toasts";
import { useWalletStore } from "@/store/walletStore";
import { Plus, LogOut, Settings, History } from "lucide-react";
import { getWithdrawalCounter } from "@/lib/contract";
import { CONTRACT_ADDRESS } from "@/lib/constants";

export default function DashboardPage() {
  const router = useRouter();
  const wallet = useWalletStore((state) => state.wallet);
  const disconnect = useWalletStore((state) => state.disconnect);
  const addToast = useWalletStore((state) => state.addToast);
  const theme = useWalletStore((state) => state.theme);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showSignModal, setShowSignModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
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

        {/* Actions - Premium Card Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          {/* Request Withdrawal Card */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="group relative"
          >
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowRequestModal(true)}
              className="relative w-full flex flex-col items-center justify-center gap-4 p-8 rounded-3xl overflow-hidden"
            >
              {/* Animated gradient background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-arbitrum-blue via-arbitrum-cyan to-arbitrum-blue"
                animate={{
                  backgroundPosition: ["0%", "200%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{ backgroundSize: "200% 200%" }}
              />
              {/* Glow effect */}
              <motion.div
                className="absolute inset-0 bg-arbitrum-cyan/40 blur-2xl group-hover:opacity-100 opacity-70 transition-opacity"
                animate={{
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              {/* Content */}
              <div className="relative z-10 flex flex-col items-center gap-3">
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                  className="p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20"
                >
                  <Plus className="w-7 h-7 text-white" />
                </motion.div>
                <span className="text-white font-bold text-lg">Solicitar Retiro</span>
                <p className="text-xs text-white/70 text-center">Retiro rápido L2→L1</p>
              </div>
              {/* Shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
              />
            </motion.button>
          </motion.div>

          {/* Provide Liquidity Card */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="group relative"
          >
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => addToast("Función en desarrollo", "info")}
              className="relative w-full flex flex-col items-center justify-center gap-4 p-8 rounded-3xl glass-glow border border-arbitrum-blue/30 overflow-hidden"
            >
              {/* Hover gradient */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-arbitrum-blue/20 via-purple-500/10 to-arbitrum-cyan/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
              {/* Content */}
              <div className="relative z-10 flex flex-col items-center gap-3">
                <motion.div
                  whileHover={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5 }}
                  className="p-3 rounded-2xl bg-arbitrum-blue/20 border border-arbitrum-blue/30"
                >
                  <svg className="w-7 h-7 text-arbitrum-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </motion.div>
                <span className="text-white font-bold text-lg">Proveer Liquidez</span>
                <p className="text-xs text-gray-400 text-center">Conviértete en LP</p>
              </div>
              {/* Shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
              />
            </motion.button>
          </motion.div>

          {/* Finalize Withdrawals Card */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="group relative"
          >
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => addToast("Función en desarrollo", "info")}
              className="relative w-full flex flex-col items-center justify-center gap-4 p-8 rounded-3xl glass-glow border border-arbitrum-blue/30 overflow-hidden"
            >
              {/* Hover gradient */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-emerald-500/10 to-arbitrum-cyan/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
              {/* Content */}
              <div className="relative z-10 flex flex-col items-center gap-3">
                <motion.div
                  whileHover={{ rotate: [0, 360] }}
                  transition={{ duration: 0.8 }}
                  className="p-3 rounded-2xl bg-green-500/20 border border-green-500/30"
                >
                  <svg className="w-7 h-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </motion.div>
                <span className="text-white font-bold text-lg">Finalizar Retiros</span>
                <p className="text-xs text-gray-400 text-center">Completar retiros</p>
              </div>
              {/* Shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
              />
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <ActionButtons
            onSignClick={() => setShowSignModal(true)}
            onSendClick={() => setShowSendModal(true)}
          />
        </motion.div>

        {/* History Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <History className="w-6 h-6 text-arbitrum-cyan" />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-arbitrum-blue to-arbitrum-cyan bg-clip-text text-transparent">
              Historial
            </h2>
          </div>
          <HistoryList />
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
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
      <SignModal
        isOpen={showSignModal}
        onClose={() => setShowSignModal(false)}
      />
      <SendModal
        isOpen={showSendModal}
        onClose={() => setShowSendModal(false)}
      />
    </div>
  );
}


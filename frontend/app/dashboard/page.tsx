"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { WalletCard } from "@/components/WalletCard";
import { RequestWithdrawalModal } from "@/components/RequestWithdrawalModal";
import { ProvideLiquidityModal } from "@/components/ProvideLiquidityModal";
import { FinalizeWithdrawalModal } from "@/components/FinalizeWithdrawalModal";
import { SignModal } from "@/components/SignModal";
import { SendModal } from "@/components/SendModal";
import { ActionButtons } from "@/components/ActionButtons";
import { HistoryList } from "@/components/HistoryList";
import { Toasts } from "@/components/Toasts";
import { useWalletStore } from "@/store/walletStore";
import { Plus, LogOut, Settings, History, TrendingUp, CheckCircle, Coins } from "lucide-react";
import { getWithdrawalCounter } from "@/lib/contract";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "@/lib/constants";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";

export default function DashboardPage() {
  const router = useRouter();
  const wallet = useWalletStore((state) => state.wallet);
  const disconnect = useWalletStore((state) => state.disconnect);
  const addToast = useWalletStore((state) => state.addToast);
  const theme = useWalletStore((state) => state.theme);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showProvideModal, setShowProvideModal] = useState(false);
  const [showFinalizeModal, setShowFinalizeModal] = useState(false);
  const [showSignModal, setShowSignModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [withdrawalCount, setWithdrawalCount] = useState(0);
  const [contractBalance, setContractBalance] = useState("0");

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
    const loadStats = async () => {
      if (wallet?.providerType === "metamask" && wallet.provider) {
        try {
          const count = await getWithdrawalCounter(wallet.provider);
          setWithdrawalCount(Number(count));
          
          // Load contract balance
          try {
            const balance = await wallet.provider.getBalance(CONTRACT_ADDRESS);
            setContractBalance(ethers.formatEther(balance));
          } catch (e) {
            // Ignore
          }
        } catch (error) {
          console.error("Error loading stats:", error);
        }
      }
    };
    loadStats();
  }, [wallet]);

  const handleDisconnect = () => {
    disconnect();
    addToast("Wallet desconectada.", "info");
    router.push("/");
  };

  if (!wallet) return null;

  return (
    <div className="min-h-screen p-4 md:p-8 relative overflow-hidden">
      {/* Settarb Animated Background */}
      <AnimatedBackground />

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

        {/* Main Actions Grid - 6 Cards */}
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
              onClick={() => setShowProvideModal(true)}
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
              onClick={() => setShowFinalizeModal(true)}
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

        {/* Additional Actions Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {/* Deposit Bond Card */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="group relative"
          >
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => addToast("Próximamente: Depositar Bond", "info")}
              className="relative w-full flex flex-col items-center justify-center gap-4 p-6 rounded-3xl glass-glow border border-arbitrum-blue/30 overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 via-orange-500/10 to-arbitrum-cyan/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
              <div className="relative z-10 flex flex-col items-center gap-3">
                <motion.div
                  whileHover={{ rotate: [0, 360] }}
                  transition={{ duration: 0.8 }}
                  className="p-3 rounded-2xl bg-yellow-500/20 border border-yellow-500/30"
                >
                  <Coins className="w-6 h-6 text-yellow-400" />
                </motion.div>
                <span className="text-white font-bold text-base">Depositar Bond</span>
                <p className="text-xs text-gray-400 text-center">Para LPs</p>
              </div>
            </motion.button>
          </motion.div>

          {/* Sign Message Card */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.6 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="group relative"
          >
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowSignModal(true)}
              className="relative w-full flex flex-col items-center justify-center gap-4 p-6 rounded-3xl glass-glow border border-arbitrum-blue/30 overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-pink-500/10 to-arbitrum-cyan/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
              <div className="relative z-10 flex flex-col items-center gap-3">
                <motion.div
                  whileHover={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5 }}
                  className="p-3 rounded-2xl bg-purple-500/20 border border-purple-500/30"
                >
                  <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </motion.div>
                <span className="text-white font-bold text-base">Firmar Mensaje</span>
                <p className="text-xs text-gray-400 text-center">Firma con wallet</p>
              </div>
            </motion.button>
          </motion.div>

          {/* Send Transaction Card */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.7 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="group relative"
          >
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowSendModal(true)}
              className="relative w-full flex flex-col items-center justify-center gap-4 p-6 rounded-3xl glass-glow border border-arbitrum-blue/30 overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-cyan-500/10 to-arbitrum-cyan/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
              <div className="relative z-10 flex flex-col items-center gap-3">
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                  className="p-3 rounded-2xl bg-blue-500/20 border border-blue-500/30"
                >
                  <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </motion.div>
                <span className="text-white font-bold text-base">Enviar Transacción</span>
                <p className="text-xs text-gray-400 text-center">Enviar ETH</p>
              </div>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Protocol Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold bg-gradient-to-r from-arbitrum-blue to-arbitrum-cyan bg-clip-text text-transparent mb-6">
            Estadísticas del Protocolo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 }}
              className="glass-card p-6 rounded-2xl border border-arbitrum-blue/30"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-arbitrum-blue/20 border border-arbitrum-blue/30">
                  <TrendingUp className="w-5 h-5 text-arbitrum-cyan" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Retirado</p>
                  <p className="text-2xl font-bold text-arbitrum-cyan">{contractBalance} ETH</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.0 }}
              className="glass-card p-6 rounded-2xl border border-arbitrum-blue/30"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/30">
                  <Plus className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Retiros Totales</p>
                  <p className="text-2xl font-bold text-arbitrum-cyan">{withdrawalCount}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1 }}
              className="glass-card p-6 rounded-2xl border border-arbitrum-blue/30"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-green-500/20 border border-green-500/30">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Estado</p>
                  <p className="text-2xl font-bold text-green-400">Activo</p>
                </div>
              </div>
            </motion.div>
          </div>
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
      <ProvideLiquidityModal
        isOpen={showProvideModal}
        onClose={() => setShowProvideModal(false)}
      />
      <FinalizeWithdrawalModal
        isOpen={showFinalizeModal}
        onClose={() => setShowFinalizeModal(false)}
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


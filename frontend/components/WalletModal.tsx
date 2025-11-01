"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Wallet, Plus, Download } from "lucide-react";
import { useWalletStore } from "@/store/walletStore";
import { connectMetaMask, createDemoWallet, isMetaMaskInstalled } from "@/lib/wallet";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const [loading, setLoading] = useState(false);
  const setWallet = useWalletStore((state) => state.setWallet);
  const addToast = useWalletStore((state) => state.addToast);

  const handleConnectMetaMask = async () => {
    if (!isMetaMaskInstalled()) {
      addToast("MetaMask no detectada. Por favor, instala MetaMask.", "error");
      window.open("https://metamask.io/download/", "_blank");
      return;
    }

    setLoading(true);
    try {
      const wallet = await connectMetaMask();
      setWallet(wallet);
      addToast("Wallet conectada con éxito.", "success");
      onClose();
    } catch (error: any) {
      addToast(error.message || "Error al conectar MetaMask.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDemo = () => {
    const wallet = createDemoWallet();
    setWallet(wallet);
    addToast("Wallet demo creada.", "success");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="wallet-modal-title"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative bg-white/10 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl p-6 max-w-md w-full border border-white/20 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h2
              id="wallet-modal-title"
              className="text-2xl font-bold text-gray-900 dark:text-white"
            >
              Conectar Wallet
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleConnectMetaMask}
              disabled={loading}
              className="w-full flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Wallet className="w-5 h-5" />
              <span>Conectar MetaMask</span>
            </button>

            <button
              onClick={handleCreateDemo}
              className="w-full flex items-center gap-3 p-4 rounded-xl bg-white/5 dark:bg-gray-800/50 hover:bg-white/10 dark:hover:bg-gray-800/70 border border-white/10 text-gray-900 dark:text-white font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-5 h-5" />
              <span>Crear Wallet Demo</span>
            </button>
          </div>

          <p className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
            Para usar el contrato real, necesitas MetaMask conectado a Sepolia.
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}


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
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          transition={{ type: "spring", duration: 0.4 }}
          onClick={(e) => e.stopPropagation()}
          className="relative glass-glow rounded-3xl p-8 max-w-md w-full border border-arbitrum-blue/30 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-8">
            <h2
              id="wallet-modal-title"
              className="text-2xl font-bold bg-gradient-to-r from-arbitrum-blue to-arbitrum-cyan bg-clip-text text-transparent"
            >
              Conectar Wallet
            </h2>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-arbitrum-blue/20 border border-arbitrum-blue/30 transition-colors"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5 text-gray-300" />
            </motion.button>
          </div>

          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(40, 160, 240, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              onClick={handleConnectMetaMask}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-arbitrum-blue to-arbitrum-cyan text-white font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-arbitrum-blue/30"
            >
              <Wallet className="w-5 h-5" />
              <span>{loading ? "Conectando..." : "Conectar MetaMask"}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02, borderColor: "rgba(40, 160, 240, 0.5)" }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCreateDemo}
              className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl glass border border-arbitrum-blue/30 text-white font-semibold transition-all duration-200"
            >
              <Plus className="w-5 h-5" />
              <span>Crear Wallet Demo</span>
            </motion.button>
          </div>

          <p className="mt-6 text-xs text-gray-400 text-center">
            Para usar el contrato real, necesitas MetaMask conectado a Sepolia.
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}


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
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="wallet-modal-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Enhanced backdrop with blur */}
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="absolute inset-0 bg-black/70"
          />
          
          {/* Modal container with spring animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50, rotateX: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50, rotateX: 15 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              mass: 0.8,
            }}
            onClick={(e) => e.stopPropagation()}
            className="relative glass-glow rounded-3xl p-8 max-w-md w-full border border-arbitrum-blue/30 shadow-2xl overflow-hidden"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Animated background gradient */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-arbitrum-blue/10 via-arbitrum-cyan/5 to-purple-500/10"
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            
            {/* Shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              animate={{
                x: ["-100%", "200%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
                repeatDelay: 2,
              }}
            />

            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-center justify-between mb-10">
                <motion.h2
                  id="wallet-modal-title"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-3xl font-bold bg-gradient-to-r from-arbitrum-blue via-arbitrum-cyan to-arbitrum-blue bg-clip-text text-transparent bg-[length:200%_auto]"
                >
                  Conectar Wallet
                </motion.h2>
                <motion.button
                  whileHover={{ scale: 1.15, rotate: 90 }}
                  whileTap={{ scale: 0.85 }}
                  onClick={onClose}
                  className="p-2.5 rounded-xl hover:bg-arbitrum-blue/20 border border-arbitrum-blue/30 transition-all hover:border-arbitrum-cyan/50 relative group"
                  aria-label="Cerrar modal"
                >
                  <X className="w-5 h-5 text-gray-300 group-hover:text-arbitrum-cyan transition-colors" />
                </motion.button>
              </div>

              {/* Action buttons */}
              <div className="space-y-4">
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{
                    scale: 1.03,
                    boxShadow: "0 0 40px rgba(40, 160, 240, 0.5)",
                  }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleConnectMetaMask}
                  disabled={loading}
                  className="group relative w-full flex items-center justify-center gap-3 p-5 rounded-2xl overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {/* Animated gradient background */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-arbitrum-blue via-arbitrum-cyan to-arbitrum-blue"
                    animate={{
                      backgroundPosition: ["0%", "200%"],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    style={{ backgroundSize: "200% 100%" }}
                  />
                  {/* Glow effect */}
                  <motion.div
                    className="absolute inset-0 bg-arbitrum-cyan/50 blur-xl"
                    animate={{
                      opacity: [0.4, 0.7, 0.4],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <span className="relative z-10 text-white font-bold flex items-center gap-3">
                    <Wallet className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                    {loading ? "Conectando..." : "Conectar MetaMask"}
                  </span>
                </motion.button>

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{
                    scale: 1.03,
                    borderColor: "rgba(40, 160, 240, 0.6)",
                    boxShadow: "0 0 30px rgba(40, 160, 240, 0.3)",
                  }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleCreateDemo}
                  className="group relative w-full flex items-center justify-center gap-3 p-5 rounded-2xl glass border border-arbitrum-blue/30 text-white font-semibold transition-all duration-200 overflow-hidden"
                >
                  {/* Hover glow */}
                  <motion.div
                    className="absolute inset-0 bg-arbitrum-blue/20 opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                  <Plus className="w-6 h-6 relative z-10 group-hover:rotate-90 transition-transform" />
                  <span className="relative z-10">Crear Wallet Demo</span>
                </motion.button>
              </div>

              {/* Footer info */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-8 text-xs text-gray-400 text-center leading-relaxed"
              >
                Para usar el contrato real, necesitas MetaMask conectado a Arbitrum Sepolia.
              </motion.p>
            </div>

            {/* Decorative corner elements */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-arbitrum-cyan/5 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-arbitrum-blue/5 rounded-full blur-3xl -z-10" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


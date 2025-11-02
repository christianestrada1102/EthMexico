"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useWalletStore } from "@/store/walletStore";
import { requestWithdrawal } from "@/lib/contract";

interface RequestWithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RequestWithdrawalModal({
  isOpen,
  onClose,
}: RequestWithdrawalModalProps) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const wallet = useWalletStore((state) => state.wallet);
  const addToast = useWalletStore((state) => state.addToast);
  const addToHistory = useWalletStore((state) => state.addToHistory);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet?.signer || !amount || parseFloat(amount) <= 0) {
      addToast("Por favor, ingresa un monto válido.", "error");
      return;
    }

    setLoading(true);
    try {
      if (wallet && wallet.providerType === "metamask" && wallet.signer) {
        const tx = await requestWithdrawal(wallet.signer, amount);
        addToHistory({
          type: "withdrawal",
          status: "pending",
          details: { amount, action: "request" },
          txHash: tx.hash,
        });
        addToast("Solicitud de retiro enviada. Esperando confirmación...", "info");
        await tx.wait();
        addToast("Solicitud de retiro creada exitosamente.", "success");
        addToHistory({
          type: "withdrawal",
          status: "success",
          details: { amount, action: "request" },
          txHash: tx.hash,
        });
      } else {
        // Demo simulation
        await new Promise((resolve) => setTimeout(resolve, 1200));
        const fakeHash = "0x" + Array.from({ length: 64 }, () =>
          Math.floor(Math.random() * 16).toString(16)
        ).join("");
        addToHistory({
          type: "withdrawal",
          status: "success",
          details: { amount, action: "request" },
          txHash: fakeHash,
        });
        addToast("Solicitud de retiro simulada creada.", "success");
      }
      setAmount("");
      onClose();
    } catch (error: any) {
      addToast(
        error.message || "Error al crear solicitud de retiro.",
        "error"
      );
      addToHistory({
        type: "withdrawal",
        status: "failed",
        details: { amount, action: "request", error: error.message },
      });
    } finally {
      setLoading(false);
    }
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
          aria-labelledby="request-modal-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Enhanced backdrop */}
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="absolute inset-0 bg-black/70"
          />
          
          {/* Modal container */}
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
                  id="request-modal-title"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-3xl font-bold bg-gradient-to-r from-arbitrum-blue via-arbitrum-cyan to-arbitrum-blue bg-clip-text text-transparent bg-[length:200%_auto]"
                >
                  Solicitar Retiro
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

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <label
                    htmlFor="amount"
                    className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider"
                  >
                    Monto (ETH)
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    id="amount"
                    type="number"
                    step="0.001"
                    min="0.001"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="1.0"
                    className="w-full px-5 py-4 rounded-2xl glass border border-arbitrum-blue/30 focus:border-arbitrum-cyan focus:outline-none focus:ring-2 focus:ring-arbitrum-cyan/50 text-white placeholder-gray-500 transition-all backdrop-blur-sm"
                    required
                    disabled={loading}
                  />
                </motion.div>

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{
                    scale: 1.03,
                    boxShadow: "0 0 40px rgba(40, 160, 240, 0.5)",
                  }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={loading}
                  className="group relative w-full py-5 rounded-2xl overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <span className="relative z-10 text-white font-bold text-lg">
                    {loading ? "Procesando..." : "Solicitar Retiro"}
                  </span>
                </motion.button>
              </form>
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


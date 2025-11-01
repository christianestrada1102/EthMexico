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
      if (wallet.providerType === "metamask") {
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
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="request-modal-title"
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
              id="request-modal-title"
              className="text-2xl font-bold bg-gradient-to-r from-arbitrum-blue to-arbitrum-cyan bg-clip-text text-transparent"
            >
              Solicitar Retiro
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-300 mb-3 uppercase tracking-wider"
              >
                Monto (ETH)
              </label>
              <input
                id="amount"
                type="number"
                step="0.001"
                min="0.001"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="1.0"
                className="w-full px-5 py-4 rounded-2xl glass border border-arbitrum-blue/30 focus:border-arbitrum-cyan focus:outline-none focus:ring-2 focus:ring-arbitrum-cyan/50 text-white placeholder-gray-500 transition-all"
                required
                disabled={loading}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(40, 160, 240, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-arbitrum-blue to-arbitrum-cyan text-white font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-arbitrum-blue/30"
            >
              {loading ? "Procesando..." : "Solicitar Retiro"}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}


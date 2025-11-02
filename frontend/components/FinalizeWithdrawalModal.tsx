"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle } from "lucide-react";
import { useWalletStore } from "@/store/walletStore";
import { finalizeWithdrawal, getWithdrawal, getTimeRemaining, getWithdrawalCounter } from "@/lib/contract";
import { ethers } from "ethers";

interface FinalizeWithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FinalizeWithdrawalModal({ isOpen, onClose }: FinalizeWithdrawalModalProps) {
  const [requestId, setRequestId] = useState("");
  const [loading, setLoading] = useState(false);
  const [availableRequests, setAvailableRequests] = useState<number[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const wallet = useWalletStore((state) => state.wallet);
  const addToast = useWalletStore((state) => state.addToast);
  const addToHistory = useWalletStore((state) => state.addToHistory);

  useEffect(() => {
    const loadAvailableRequests = async () => {
      if (wallet?.providerType === "metamask" && wallet.provider && wallet.address) {
        try {
          const total = await getWithdrawalCounter(wallet.provider);
          const requests = [];
          
          for (let i = 0; i < Number(total); i++) {
            try {
              const withdrawal = await getWithdrawal(wallet.provider, i);
              if (
                withdrawal.isAdvanced &&
                !withdrawal.isFinalized &&
                withdrawal.liquidityProvider.toLowerCase() === wallet.address.toLowerCase()
              ) {
                const timeRem = await getTimeRemaining(wallet.provider, i);
                if (Number(timeRem) === 0) {
                  requests.push(i);
                }
              }
            } catch (e) {
              // Skip if request doesn't exist
            }
          }
          
          setAvailableRequests(requests);
        } catch (error) {
          console.error("Error loading requests:", error);
        }
      }
    };
    if (isOpen) {
      loadAvailableRequests();
    }
  }, [isOpen, wallet]);

  useEffect(() => {
    const loadRequestDetails = async () => {
      if (requestId && wallet?.providerType === "metamask" && wallet.provider) {
        try {
          const id = parseInt(requestId);
          const withdrawal = await getWithdrawal(wallet.provider, id);
          setSelectedRequest(withdrawal);
          
          const timeRem = await getTimeRemaining(wallet.provider, id);
          const seconds = Number(timeRem);
          if (seconds > 0) {
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            setTimeRemaining(`${hours}h ${minutes}m`);
          } else {
            setTimeRemaining("Listo para finalizar");
          }
        } catch (error) {
          addToast("Error al cargar detalles de la solicitud.", "error");
        }
      }
    };
    loadRequestDetails();
  }, [requestId, wallet, addToast]);

  const handleFinalize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet?.signer || !requestId || !selectedRequest) {
      addToast("Por favor, selecciona una solicitud válida.", "error");
      return;
    }

    setLoading(true);
    try {
      if (wallet.providerType === "metamask") {
        const tx = await finalizeWithdrawal(wallet.signer, parseInt(requestId));
        
        addToHistory({
          type: "finalize",
          status: "pending",
          details: { action: "finalize", requestId },
          txHash: tx.hash,
        });
        
        addToast("Transacción enviada. Esperando confirmación...", "info");
        await tx.wait();
        
        addToast("Retiro finalizado exitosamente.", "success");
        addToHistory({
          type: "finalize",
          status: "success",
          details: { action: "finalize", requestId },
          txHash: tx.hash,
        });
      } else {
        // Demo simulation
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const fakeHash = "0x" + Array.from({ length: 64 }, () =>
          Math.floor(Math.random() * 16).toString(16)
        ).join("");
        
        addToHistory({
          type: "finalize",
          status: "success",
          details: { action: "finalize", requestId },
          txHash: fakeHash,
        });
        addToast("Retiro finalizado (simulado).", "success");
      }
      
      setRequestId("");
      setSelectedRequest(null);
      onClose();
    } catch (error: any) {
      addToast(error.message || "Error al finalizar retiro.", "error");
      addToHistory({
        type: "finalize",
        status: "failed",
        details: { action: "finalize", requestId, error: error.message },
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
          aria-labelledby="finalize-modal-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="absolute inset-0 bg-black/70"
          />

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
            className="relative glass-glow rounded-3xl p-8 max-w-lg w-full border border-arbitrum-blue/30 shadow-2xl overflow-hidden"
            style={{ transformStyle: "preserve-3d" }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-arbitrum-cyan/10"
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-10">
                <motion.h2
                  id="finalize-modal-title"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-3xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-arbitrum-cyan bg-clip-text text-transparent bg-[length:200%_auto] flex items-center gap-3"
                >
                  <CheckCircle className="w-8 h-8 text-green-400" />
                  Finalizar Retiro
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

              <form onSubmit={handleFinalize} className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <label
                    htmlFor="finalizeRequestId"
                    className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider"
                  >
                    ID de Solicitud
                  </label>
                  <select
                    id="finalizeRequestId"
                    value={requestId}
                    onChange={(e) => setRequestId(e.target.value)}
                    className="w-full px-5 py-4 rounded-2xl glass border border-arbitrum-blue/30 focus:border-arbitrum-cyan focus:outline-none focus:ring-2 focus:ring-arbitrum-cyan/50 text-white backdrop-blur-sm"
                    required
                    disabled={loading || availableRequests.length === 0}
                  >
                    <option value="">Selecciona una solicitud</option>
                    {availableRequests.map((id) => (
                      <option key={id} value={id} className="bg-navy-500">
                        Solicitud #{id}
                      </option>
                    ))}
                  </select>
                  {availableRequests.length === 0 && wallet?.providerType === "metamask" && (
                    <p className="text-xs text-gray-400 mt-2">No hay retiros listos para finalizar</p>
                  )}
                </motion.div>

                {selectedRequest && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-2xl glass border border-green-500/30 space-y-2"
                  >
                    <p className="text-sm text-gray-400">
                      <span className="text-green-400">Monto:</span>{" "}
                      {ethers.formatEther(selectedRequest.amount)} ETH
                    </p>
                    <p className="text-sm text-gray-400">
                      <span className="text-green-400">Estado:</span> {timeRemaining}
                    </p>
                  </motion.div>
                )}

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{
                    scale: 1.03,
                    boxShadow: "0 0 40px rgba(16, 185, 129, 0.5)",
                  }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={loading || !requestId || availableRequests.length === 0}
                  className="group relative w-full py-5 rounded-2xl overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-green-500 to-emerald-500"
                >
                  <span className="relative z-10 text-white font-bold text-lg">
                    {loading ? "Procesando..." : "Finalizar Retiro"}
                  </span>
                </motion.button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


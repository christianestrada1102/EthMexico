"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, TrendingUp } from "lucide-react";
import { useWalletStore } from "@/store/walletStore";
import { provideLiquidity, getWithdrawal, calculateFee, getWithdrawalCounter, canProvideLiquidity } from "@/lib/contract";
import { ethers } from "ethers";

interface ProvideLiquidityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProvideLiquidityModal({ isOpen, onClose }: ProvideLiquidityModalProps) {
  const [requestId, setRequestId] = useState("");
  const [loading, setLoading] = useState(false);
  const [availableRequests, setAvailableRequests] = useState<number[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [feeAmount, setFeeAmount] = useState("0");
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
              if (!withdrawal.isAdvanced && !withdrawal.isFinalized && withdrawal.liquidityProvider === "0x0000000000000000000000000000000000000000") {
                requests.push(i);
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
      if (requestId && wallet?.providerType === "metamask" && wallet.provider && wallet.address) {
        try {
          const id = parseInt(requestId);
          const withdrawal = await getWithdrawal(wallet.provider, id);
          setSelectedRequest(withdrawal);
          
          const amount = ethers.formatEther(withdrawal.amount);
          const fee = await calculateFee(wallet.provider, amount);
          setFeeAmount(fee);
        } catch (error) {
          addToast("Error al cargar detalles de la solicitud.", "error");
        }
      }
    };
    loadRequestDetails();
  }, [requestId, wallet, addToast]);

  const handleProvideLiquidity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet?.signer || !requestId || !selectedRequest) {
      addToast("Por favor, selecciona una solicitud válida.", "error");
      return;
    }

    setLoading(true);
    try {
      if (wallet && wallet.providerType === "metamask" && wallet.provider && wallet.signer && wallet.address) {
        // Type guard: verify all properties are defined
        // Use type assertions after validation
        const provider: ethers.BrowserProvider = wallet.provider as ethers.BrowserProvider;
        const signer: ethers.JsonRpcSigner = wallet.signer as ethers.JsonRpcSigner;
        const address: string = wallet.address as string;
        
        // Check if LP can provide liquidity
        const canProvide = await canProvideLiquidity(provider, address);
        if (!canProvide) {
          addToast("No tienes suficiente bond para proveer liquidez.", "error");
          setLoading(false);
          return;
        }

        const amount = ethers.formatEther(selectedRequest.amount);
        const tx = await provideLiquidity(signer, parseInt(requestId), amount);
        
        addToHistory({
          type: "liquidity",
          status: "pending",
          details: { action: "provide", requestId, amount },
          txHash: tx.hash,
        });
        
        addToast("Transacción enviada. Esperando confirmación...", "info");
        await tx.wait();
        
        addToast("Liquidez proporcionada exitosamente.", "success");
        addToHistory({
          type: "liquidity",
          status: "success",
          details: { action: "provide", requestId, amount },
          txHash: tx.hash,
        });
      } else {
        // Demo simulation
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const fakeHash = "0x" + Array.from({ length: 64 }, () =>
          Math.floor(Math.random() * 16).toString(16)
        ).join("");
        
        addToHistory({
          type: "liquidity",
          status: "success",
          details: { action: "provide", requestId, amount: "1.0" },
          txHash: fakeHash,
        });
        addToast("Liquidez proporcionada (simulado).", "success");
      }
      
      setRequestId("");
      setSelectedRequest(null);
      onClose();
    } catch (error: any) {
      addToast(error.message || "Error al proveer liquidez.", "error");
      addToHistory({
        type: "liquidity",
        status: "failed",
        details: { action: "provide", requestId, error: error.message },
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
          aria-labelledby="provide-modal-title"
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

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-10">
                <motion.h2
                  id="provide-modal-title"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-3xl font-bold bg-gradient-to-r from-arbitrum-blue via-arbitrum-cyan to-arbitrum-blue bg-clip-text text-transparent bg-[length:200%_auto] flex items-center gap-3"
                >
                  <TrendingUp className="w-8 h-8 text-arbitrum-cyan" />
                  Proveer Liquidez
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

              <form onSubmit={handleProvideLiquidity} className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <label
                    htmlFor="requestId"
                    className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider"
                  >
                    ID de Solicitud
                  </label>
                  <select
                    id="requestId"
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
                    <p className="text-xs text-gray-400 mt-2">No hay solicitudes disponibles</p>
                  )}
                </motion.div>

                {selectedRequest && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-2xl glass border border-arbitrum-blue/30 space-y-2"
                  >
                    <p className="text-sm text-gray-400">
                      <span className="text-arbitrum-cyan">Monto:</span>{" "}
                      {ethers.formatEther(selectedRequest.amount)} ETH
                    </p>
                    <p className="text-sm text-gray-400">
                      <span className="text-arbitrum-cyan">Comisión:</span> {feeAmount} ETH
                    </p>
                    <p className="text-sm text-gray-400">
                      <span className="text-arbitrum-cyan">Recibirás:</span>{" "}
                      {(parseFloat(ethers.formatEther(selectedRequest.amount)) - parseFloat(feeAmount)).toFixed(4)} ETH
                    </p>
                  </motion.div>
                )}

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
                  disabled={loading || !requestId || availableRequests.length === 0}
                  className="group relative w-full py-5 rounded-2xl overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                >
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
                  <span className="relative z-10 text-white font-bold text-lg">
                    {loading ? "Procesando..." : "Proveer Liquidez"}
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


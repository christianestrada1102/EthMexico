"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileSignature } from "lucide-react";
import { useWalletStore } from "@/store/walletStore";
import { ethers } from "ethers";

interface SignModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SignModal({ isOpen, onClose }: SignModalProps) {
  const [message, setMessage] = useState("");
  const [signature, setSignature] = useState("");
  const [loading, setLoading] = useState(false);
  const wallet = useWalletStore((state) => state.wallet);
  const addToast = useWalletStore((state) => state.addToast);
  const addToHistory = useWalletStore((state) => state.addToHistory);

  const handleSign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !wallet) {
      addToast("Por favor, ingresa un mensaje.", "error");
      return;
    }

    setLoading(true);
    try {
      if (wallet && wallet.providerType === "metamask" && wallet.signer) {
        // Real signature with MetaMask
        const sig = await wallet.signer.signMessage(message);
        setSignature(sig);
        addToHistory({
          type: "withdrawal", // Reuse type
          status: "success",
          details: { action: "sign", message: message.substring(0, 50) + "..." },
        });
        addToast("Mensaje firmado exitosamente.", "success");
      } else {
        // Demo simulation
        await new Promise((resolve) => setTimeout(resolve, 1200));
        const fakeSig = "0x" + Array.from({ length: 130 }, () =>
          Math.floor(Math.random() * 16).toString(16)
        ).join("");
        setSignature(fakeSig);
        addToHistory({
          type: "withdrawal",
          status: "success",
          details: { action: "sign", message: message.substring(0, 50) + "..." },
        });
        addToast("Mensaje firmado (simulado).", "success");
      }
    } catch (error: any) {
      addToast(error.message || "Error al firmar mensaje.", "error");
      addToHistory({
        type: "withdrawal",
        status: "failed",
        details: { action: "sign", error: error.message },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMessage("");
    setSignature("");
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
          aria-labelledby="sign-modal-title"
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
              <div className="flex items-center justify-between mb-10">
                <motion.h2
                  id="sign-modal-title"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-3xl font-bold bg-gradient-to-r from-arbitrum-blue via-arbitrum-cyan to-arbitrum-blue bg-clip-text text-transparent bg-[length:200%_auto] flex items-center gap-3"
                >
                  <FileSignature className="w-8 h-8 text-arbitrum-cyan" />
                  Firmar Mensaje
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

              <form onSubmit={handleSign} className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <label
                    htmlFor="message"
                    className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider"
                  >
                    Mensaje
                  </label>
                  <motion.textarea
                    whileFocus={{ scale: 1.02 }}
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Escribe el mensaje que deseas firmar..."
                    rows={4}
                    className="w-full px-5 py-4 rounded-2xl glass border border-arbitrum-blue/30 focus:border-arbitrum-cyan focus:outline-none focus:ring-2 focus:ring-arbitrum-cyan/50 text-white placeholder-gray-500 transition-all backdrop-blur-sm resize-none"
                    required
                    disabled={loading || !!signature}
                  />
                </motion.div>

                {signature && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-2xl glass border border-green-400/30 bg-green-500/10"
                  >
                    <p className="text-xs text-green-400 uppercase tracking-wider mb-2 font-semibold">
                      Firma
                    </p>
                    <p className="font-mono text-sm text-white break-all">{signature}</p>
                  </motion.div>
                )}

                <div className="flex gap-3">
                  {signature ? (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{
                        scale: 1.03,
                        boxShadow: "0 0 40px rgba(40, 160, 240, 0.5)",
                      }}
                      whileTap={{ scale: 0.97 }}
                      type="button"
                      onClick={handleReset}
                      className="group relative flex-1 py-5 rounded-2xl overflow-hidden"
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
                        Nuevo Mensaje
                      </span>
                    </motion.button>
                  ) : (
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
                      <span className="relative z-10 text-white font-bold text-lg flex items-center justify-center gap-2">
                        {loading ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                            />
                            Firmando...
                          </>
                        ) : (
                          <>
                            <FileSignature className="w-5 h-5" />
                            Firmar Mensaje
                          </>
                        )}
                      </span>
                    </motion.button>
                  )}
                </div>
              </form>
            </div>

            <div className="absolute top-0 right-0 w-24 h-24 bg-arbitrum-cyan/5 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-arbitrum-blue/5 rounded-full blur-3xl -z-10" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


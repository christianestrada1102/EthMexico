"use client";

import { Wallet, Copy, Check, RefreshCw, TrendingUp, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useWalletStore } from "@/store/walletStore";
import { formatAddress, getWalletName } from "@/lib/wallet";
import { getBalance } from "@/lib/wallet";
import { motion, AnimatePresence } from "framer-motion";

export function WalletCard() {
  const wallet = useWalletStore((state) => state.wallet);
  const setWallet = useWalletStore((state) => state.setWallet);
  const addToast = useWalletStore((state) => state.addToast);
  const [copied, setCopied] = useState(false);
  const [balance, setBalance] = useState(wallet?.balance || "0");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [prevBalance, setPrevBalance] = useState<string | null>(null);
  const [showPulse, setShowPulse] = useState(false);
  const [walletName, setWalletName] = useState<{ name: string; type: "ens" | "alias" | "wallet" | "address" } | null>(null);

  useEffect(() => {
    if (wallet?.balance) {
      const newBalance = wallet.balance;
      if (prevBalance !== null && prevBalance !== newBalance) {
        setShowPulse(true);
        setTimeout(() => setShowPulse(false), 1000);
      }
      setBalance(newBalance);
      setPrevBalance(newBalance);
    }
  }, [wallet?.balance, prevBalance]);

  useEffect(() => {
    const loadWalletName = async () => {
      if (wallet?.address) {
        // wallet.provider is optional, getWalletName handles undefined
        const name = await getWalletName(wallet.address, wallet.provider);
        setWalletName(name);
      }
    };
    loadWalletName();
  }, [wallet?.address, wallet?.provider]);

  const handleCopy = () => {
    if (wallet?.address) {
      navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      addToast("Dirección copiada al portapapeles.", "success");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRefreshBalance = async () => {
    if (wallet?.providerType === "metamask" && wallet.provider && wallet.address) {
      setIsRefreshing(true);
      try {
        const newBalance = await getBalance(wallet.address, wallet.provider);
        setBalance(newBalance);
        if (wallet) {
          setWallet({ ...wallet, balance: newBalance });
        }
        addToast("Balance actualizado.", "success");
      } catch (error) {
        addToast("Error al actualizar balance.", "error");
      } finally {
        setIsRefreshing(false);
      }
    }
  };

  if (!wallet) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -5 }}
      className="relative group"
    >
      {/* Card container with premium design */}
      <div className="relative glass-glow rounded-3xl p-8 border border-arbitrum-blue/30 overflow-hidden">
        {/* Animated gradient overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-arbitrum-blue/10 via-arbitrum-cyan/5 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        />
        
        {/* Shine effect on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
        />

        {/* Header Section */}
        <div className="relative z-10 flex items-center justify-between mb-8">
          <div className="flex items-center gap-5">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-arbitrum-blue/30 rounded-2xl blur-xl" />
              <div className="relative p-4 rounded-2xl bg-gradient-to-br from-arbitrum-blue to-arbitrum-cyan shadow-2xl shadow-arbitrum-blue/40">
                <Wallet className="w-7 h-7 text-white drop-shadow-lg" />
              </div>
            </motion.div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <User className="w-5 h-5 text-arbitrum-cyan" />
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  {walletName?.name || formatAddress(wallet.address)}
                </h3>
                {walletName?.type === "ens" && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-arbitrum-cyan/20 text-arbitrum-cyan border border-arbitrum-cyan/30">
                    ENS
                  </span>
                )}
                {walletName?.type === "alias" && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400 border border-purple-500/30">
                    Personalizado
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.8, 1, 0.8],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className={`w-2.5 h-2.5 rounded-full shadow-lg ${
                    wallet.providerType === "metamask"
                      ? "bg-green-400 shadow-green-400/50"
                      : "bg-yellow-400 shadow-yellow-400/50"
                  }`}
                />
                <p className="text-sm text-gray-300 font-medium">
                  {wallet.providerType === "metamask" ? "MetaMask" : "Demo"}
                </p>
                {walletName?.type === "address" && wallet.providerType === "metamask" && (
                  <p className="text-xs text-gray-400 font-mono ml-2">
                    {formatAddress(wallet.address)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Balance Section - Premium Card Style */}
        <div className="relative z-10 mb-8">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
              Balance
            </p>
            {wallet.providerType === "metamask" && (
              <motion.button
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleRefreshBalance}
                disabled={isRefreshing}
                className="p-2 rounded-xl hover:bg-arbitrum-blue/20 border border-arbitrum-blue/30 transition-all hover:border-arbitrum-cyan/50 disabled:opacity-50"
                aria-label="Actualizar balance"
              >
                <RefreshCw
                  className={`w-4 h-4 text-arbitrum-cyan ${
                    isRefreshing ? "animate-spin" : ""
                  }`}
                />
              </motion.button>
            )}
          </div>
          
          {/* Balance Display with Pulse Animation */}
          <motion.div
            animate={showPulse ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <motion.p
              key={balance}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-bold mb-2 relative"
            >
              <span className="bg-gradient-to-r from-arbitrum-blue via-arbitrum-cyan to-arbitrum-blue bg-clip-text text-transparent bg-[length:200%_auto] animate-[shimmer_3s_ease-in-out_infinite] drop-shadow-2xl">
                {parseFloat(balance).toFixed(4)}
              </span>
              <span className="text-3xl md:text-4xl ml-3 bg-gradient-to-r from-arbitrum-blue to-arbitrum-cyan bg-clip-text text-transparent">
                ETH
              </span>
            </motion.p>
            
            {/* Glow effect behind balance */}
            <motion.div
              className="absolute inset-0 bg-arbitrum-cyan/20 blur-3xl -z-10"
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>

          {/* Trend indicator (demo) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2 mt-4"
          >
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-400">Última actualización: Ahora</span>
          </motion.div>
        </div>

        {/* Address Section */}
        <div className="relative z-10 pt-6 border-t border-arbitrum-blue/20">
          <p className="text-xs text-gray-400 mb-3 uppercase tracking-wider font-semibold">
            Dirección
          </p>
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex-1 font-mono text-sm text-white bg-arbitrum-navy/60 px-4 py-3 rounded-xl border border-arbitrum-blue/30 backdrop-blur-sm"
            >
              {formatAddress(wallet.address)}
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(40, 160, 240, 0.4)" }}
              whileTap={{ scale: 0.9 }}
              onClick={handleCopy}
              className="p-3 rounded-xl hover:bg-arbitrum-blue/20 border border-arbitrum-blue/30 transition-all hover:border-arbitrum-cyan/50 relative overflow-hidden"
              aria-label="Copiar dirección"
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Check className="w-5 h-5 text-arbitrum-cyan" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="copy"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Copy className="w-5 h-5 text-gray-300" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-arbitrum-cyan/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-arbitrum-blue/5 rounded-full blur-3xl -z-10" />
      </div>
    </motion.div>
  );
}


"use client";

import { Wallet, Copy, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { useWalletStore } from "@/store/walletStore";
import { formatAddress } from "@/lib/wallet";
import { getBalance } from "@/lib/wallet";
import { motion } from "framer-motion";

export function WalletCard() {
  const wallet = useWalletStore((state) => state.wallet);
  const setWallet = useWalletStore((state) => state.setWallet);
  const addToast = useWalletStore((state) => state.addToast);
  const [copied, setCopied] = useState(false);
  const [balance, setBalance] = useState(wallet?.balance || "0");

  useEffect(() => {
    if (wallet?.balance) {
      setBalance(wallet.balance);
    }
  }, [wallet]);

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
      try {
        const newBalance = await getBalance(wallet.address, wallet.provider);
        setBalance(newBalance);
        if (wallet) {
          setWallet({ ...wallet, balance: newBalance });
        }
        addToast("Balance actualizado.", "success");
      } catch (error) {
        addToast("Error al actualizar balance.", "error");
      }
    }
  };

  if (!wallet) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative glass-glow rounded-2xl p-6 border border-arbitrum-blue/30"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="p-3.5 rounded-2xl bg-gradient-to-br from-arbitrum-blue to-arbitrum-cyan shadow-lg shadow-arbitrum-blue/30"
          >
            <Wallet className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h3 className="text-xl font-bold text-white mb-1">
              Mi Wallet
            </h3>
            <p className="text-sm text-gray-300">
              {wallet.providerType === "metamask" ? "MetaMask" : "Demo"}
            </p>
          </div>
        </div>
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="flex items-center gap-2"
        >
          <div
            className={`w-3 h-3 rounded-full shadow-lg ${
              wallet.providerType === "metamask" 
                ? "bg-green-400 shadow-green-400/50" 
                : "bg-yellow-400 shadow-yellow-400/50"
            }`}
            aria-label={
              wallet.providerType === "metamask"
                ? "Conectado"
                : "Wallet demo"
            }
          />
        </motion.div>
      </div>

      <div className="space-y-5">
        <div>
          <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">
            Dirección
          </p>
          <div className="flex items-center gap-3">
            <p className="font-mono text-sm text-white bg-arbitrum-navy/50 px-3 py-2 rounded-xl border border-arbitrum-blue/20">
              {formatAddress(wallet.address)}
            </p>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleCopy}
              className="p-2 rounded-xl hover:bg-arbitrum-blue/20 border border-arbitrum-blue/30 transition-all hover:border-arbitrum-blue/50"
              aria-label="Copiar dirección"
            >
              {copied ? (
                <Check className="w-4 h-4 text-arbitrum-cyan" />
              ) : (
                <Copy className="w-4 h-4 text-gray-300" />
              )}
            </motion.button>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-gray-400 uppercase tracking-wider">Balance</p>
            {wallet.providerType === "metamask" && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefreshBalance}
                className="text-xs text-arbitrum-cyan hover:text-arbitrum-blue transition-colors font-medium"
              >
                Actualizar
              </motion.button>
            )}
          </div>
          <p className="text-3xl font-bold bg-gradient-to-r from-arbitrum-blue to-arbitrum-cyan bg-clip-text text-transparent">
            {parseFloat(balance).toFixed(4)} ETH
          </p>
        </div>
      </div>
    </motion.div>
  );
}


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
      className="relative bg-white/10 dark:bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Mi Wallet
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {wallet.providerType === "metamask" ? "MetaMask" : "Demo"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${
              wallet.providerType === "metamask" ? "bg-green-500" : "bg-yellow-500"
            }`}
            aria-label={
              wallet.providerType === "metamask"
                ? "Conectado"
                : "Wallet demo"
            }
          />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Dirección
          </p>
          <div className="flex items-center gap-2">
            <p className="font-mono text-sm text-gray-900 dark:text-white">
              {formatAddress(wallet.address)}
            </p>
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Copiar dirección"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-gray-500 dark:text-gray-400">Balance</p>
            {wallet.providerType === "metamask" && (
              <button
                onClick={handleRefreshBalance}
                className="text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                Actualizar
              </button>
            )}
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {parseFloat(balance).toFixed(4)} ETH
          </p>
        </div>
      </div>
    </motion.div>
  );
}


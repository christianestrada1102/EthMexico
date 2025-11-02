"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { RefreshCw, FileSignature, Send } from "lucide-react";
import { useWalletStore } from "@/store/walletStore";
import { getBalance } from "@/lib/wallet";

interface ActionButtonsProps {
  onSignClick: () => void;
  onSendClick: () => void;
}

export function ActionButtons({ onSignClick, onSendClick }: ActionButtonsProps) {
  const wallet = useWalletStore((state) => state.wallet);
  const setWallet = useWalletStore((state) => state.setWallet);
  const addToast = useWalletStore((state) => state.addToast);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshBalance = async () => {
    if (wallet?.providerType === "metamask" && wallet.provider && wallet.address) {
      setIsRefreshing(true);
      try {
        const newBalance = await getBalance(wallet.address, wallet.provider);
        if (wallet) {
          setWallet({ ...wallet, balance: newBalance });
        }
        addToast("Balance actualizado.", "success");
      } catch (error) {
        addToast("Error al actualizar balance.", "error");
      } finally {
        setIsRefreshing(false);
      }
    } else {
      addToast("Balance actualizado (demo).", "info");
    }
  };

  const actions = [
    {
      icon: RefreshCw,
      label: "Ver Balance",
      description: "Actualizar balance",
      onClick: handleRefreshBalance,
      gradient: "from-blue-500/20 to-cyan-500/20",
      iconColor: "text-blue-400",
      borderColor: "border-blue-500/30",
    },
    {
      icon: FileSignature,
      label: "Firmar Con Wallet",
      description: "Firmar con tu wallet",
      onClick: onSignClick,
      gradient: "from-purple-500/20 to-pink-500/20",
      iconColor: "text-purple-400",
      borderColor: "border-purple-500/30",
    },
    {
      icon: Send,
      label: "Enviar Transacción",
      description: "Enviar ETH",
      onClick: onSendClick,
      gradient: "from-green-500/20 to-emerald-500/20",
      iconColor: "text-green-400",
      borderColor: "border-green-500/30",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
      {actions.map((action, index) => {
        const Icon = action.icon;
        return (
          <motion.button
            key={action.label}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.1 + index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={action.onClick}
            disabled={action.label === "Ver Balance" && isRefreshing}
            className="relative group p-5 rounded-2xl glass-glow border border-arbitrum-blue/30 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <motion.div
              className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
            />
            
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
            />

            <div className="relative z-10 flex flex-col items-center gap-3">
              <motion.div
                whileHover={{ rotate: action.label === "Ver Balance" && isRefreshing ? 360 : 15 }}
                transition={{ duration: 0.5 }}
                className={`p-3 rounded-xl bg-arbitrum-navy/50 border ${action.borderColor} backdrop-blur-sm`}
              >
                <Icon
                  className={`w-6 h-6 ${action.iconColor} ${
                    action.label === "Ver Balance" && isRefreshing ? "animate-spin" : ""
                  }`}
                />
              </motion.div>
              <div className="text-center">
                <p className="text-white font-semibold text-sm mb-1">{action.label}</p>
                <p className="text-xs text-gray-400">{action.description}</p>
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}


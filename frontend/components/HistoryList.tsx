"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Clock, CheckCircle2, XCircle, ExternalLink, Copy, Check } from "lucide-react";
import { useWalletStore } from "@/store/walletStore";
import { formatAddress } from "@/lib/wallet";
import { useState } from "react";

export function HistoryList() {
  const history = useWalletStore((state) => state.history);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-green-400" />;
      case "failed":
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "border-green-400/30 bg-green-500/10";
      case "failed":
        return "border-red-400/30 bg-red-500/10";
      default:
        return "border-yellow-400/30 bg-yellow-500/10";
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getActionLabel = (details: any) => {
    if (details.action === "sign") return "Firma de Mensaje";
    if (details.action === "send") return "Envío de ETH";
    if (details.action === "request") return "Solicitud de Retiro";
    return "Transacción";
  };

  if (history.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 rounded-2xl glass border border-arbitrum-blue/30 text-center"
      >
        <p className="text-gray-400">No hay historial de transacciones aún.</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {history.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            transition={{ delay: index * 0.05 }}
            className={`group relative p-5 rounded-2xl glass border ${getStatusColor(
              item.status
            )} overflow-hidden hover:scale-[1.02] transition-transform`}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-arbitrum-blue/5 via-transparent to-arbitrum-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity"
            />

            <div className="relative z-10 flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="flex-shrink-0"
                >
                  {getStatusIcon(item.status)}
                </motion.div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-white font-semibold text-sm">
                      {getActionLabel(item.details)}
                    </h4>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        item.status === "success"
                          ? "bg-green-400/20 text-green-400"
                          : item.status === "failed"
                          ? "bg-red-400/20 text-red-400"
                          : "bg-yellow-400/20 text-yellow-400"
                      }`}
                    >
                      {item.status === "success"
                        ? "Completado"
                        : item.status === "failed"
                        ? "Fallido"
                        : "Pendiente"}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-gray-400">
                    <p className="flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      {formatDate(item.timestamp)}
                    </p>
                    {item.details.amount && (
                      <p>
                        <span className="text-arbitrum-cyan">Monto:</span> {item.details.amount} ETH
                      </p>
                    )}
                    {item.details.to && (
                      <p>
                        <span className="text-arbitrum-cyan">Para:</span>{" "}
                        {formatAddress(item.details.to)}
                      </p>
                    )}
                    {item.details.message && (
                      <p className="truncate">
                        <span className="text-arbitrum-cyan">Mensaje:</span> {item.details.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {item.txHash && (
                <div className="flex items-center gap-2 flex-shrink-0">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleCopy(item.txHash!, item.id)}
                    className="p-2 rounded-xl hover:bg-arbitrum-blue/20 border border-arbitrum-blue/30 transition-all"
                    aria-label="Copiar hash"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-300" />
                    )}
                  </motion.button>
                  {item.status !== "pending" && (
                    <motion.a
                      href={`https://sepolia.arbiscan.io/tx/${item.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-xl hover:bg-arbitrum-blue/20 border border-arbitrum-blue/30 transition-all"
                      aria-label="Ver en Etherscan"
                    >
                      <ExternalLink className="w-4 h-4 text-arbitrum-cyan" />
                    </motion.a>
                  )}
                </div>
              )}
            </div>

            <motion.div
              className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-arbitrum-blue via-arbitrum-cyan to-arbitrum-blue opacity-20"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: index * 0.05 + 0.2 }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}


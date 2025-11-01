import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { WalletState } from "@/lib/wallet";
import { WithdrawalRequest } from "@/lib/contract";

interface HistoryItem {
  id: string;
  type: "withdrawal" | "liquidity" | "finalize" | "bond";
  timestamp: number;
  status: "pending" | "success" | "failed";
  details: any;
  txHash?: string;
}

interface WalletStore {
  // Wallet state
  wallet: WalletState | null;
  isConnected: boolean;
  contract: any;
  
  // UI state
  theme: "light" | "dark";
  toasts: Array<{ id: string; message: string; type: "success" | "error" | "info" }>;
  
  // Data
  withdrawals: WithdrawalRequest[];
  history: HistoryItem[];
  withdrawalCounter: number;
  
  // Actions
  setWallet: (wallet: WalletState | null) => void;
  disconnect: () => void;
  setTheme: (theme: "light" | "dark") => void;
  addToast: (message: string, type?: "success" | "error" | "info") => void;
  removeToast: (id: string) => void;
  addToHistory: (item: Omit<HistoryItem, "id" | "timestamp">) => void;
  clearHistory: () => void;
  setWithdrawalCounter: (count: number) => void;
  updateWithdrawals: (withdrawals: WithdrawalRequest[]) => void;
}

export const useWalletStore = create<WalletStore>()(
  persist(
    (set) => ({
      wallet: null,
      isConnected: false,
      contract: null,
      theme: "dark",
      toasts: [],
      withdrawals: [],
      history: [],
      withdrawalCounter: 0,

      setWallet: (wallet) =>
        set({
          wallet,
          isConnected: !!wallet,
        }),

      disconnect: () =>
        set({
          wallet: null,
          isConnected: false,
          contract: null,
        }),

      setTheme: (theme) => set({ theme }),

      addToast: (message, type = "info") => {
        const id = Math.random().toString(36).substring(7);
        set((state) => ({
          toasts: [...state.toasts, { id, message, type }],
        }));
        setTimeout(() => {
          set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== id),
          }));
        }, 5000);
      },

      removeToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        })),

      addToHistory: (item) => {
        const historyItem: HistoryItem = {
          ...item,
          id: Math.random().toString(36).substring(7),
          timestamp: Date.now(),
        };
        set((state) => ({
          history: [historyItem, ...state.history],
        }));
      },

      clearHistory: () => set({ history: [] }),

      setWithdrawalCounter: (count) => set({ withdrawalCounter: count }),

      updateWithdrawals: (withdrawals) => set({ withdrawals }),
    }),
    {
      name: "bridge-fast-withdraw-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        history: state.history,
      }),
    }
  )
);


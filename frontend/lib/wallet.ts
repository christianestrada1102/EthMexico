import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI, ARBITRUM_SEPOLIA_CHAIN_ID } from "./constants";

// Types
export interface WalletState {
  address: string;
  balance: string;
  providerType: "metamask" | "demo";
  signer?: ethers.JsonRpcSigner;
  provider?: ethers.BrowserProvider;
}

// Format address to abbreviated form
export function formatAddress(address: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Check if MetaMask is installed
export function isMetaMaskInstalled(): boolean {
  if (typeof window === "undefined") return false;
  return typeof window.ethereum !== "undefined" && !!window.ethereum?.isMetaMask;
}

// Connect to MetaMask
export async function connectMetaMask(): Promise<WalletState> {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("MetaMask no detectada. Por favor, instala MetaMask.");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  
  // Request account access
  const accounts = await provider.send("eth_requestAccounts", []);
  
  // Check if we're on Arbitrum Sepolia
  const network = await provider.getNetwork();
  if (network.chainId !== BigInt(421614)) {
    // Try to switch to Arbitrum Sepolia
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: ARBITRUM_SEPOLIA_CHAIN_ID }],
      });
    } catch (switchError: any) {
      // If chain doesn't exist, add it
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: ARBITRUM_SEPOLIA_CHAIN_ID,
              chainName: "Arbitrum Sepolia",
              nativeCurrency: {
                name: "Ethereum",
                symbol: "ETH",
                decimals: 18,
              },
              rpcUrls: [
                "https://arbitrum-sepolia.blockpi.network/v1/rpc/public",
                "https://arbitrum-sepolia-rpc.publicnode.com",
                "https://sepolia-rollup.arbitrum.io/rpc",
              ],
              blockExplorerUrls: ["https://sepolia.arbiscan.io"],
            },
          ],
        });
      }
    }
  }

  const signer = await provider.getSigner();
  const balance = await provider.getBalance(accounts[0]);

  return {
    address: accounts[0],
    balance: ethers.formatEther(balance),
    providerType: "metamask",
    signer,
    provider,
  };
}

// Get balance for MetaMask wallet
export async function getBalance(address: string, provider: ethers.BrowserProvider): Promise<string> {
  const balance = await provider.getBalance(address);
  return ethers.formatEther(balance);
}

// Validate RPC is working
export async function validateRPC(provider: ethers.BrowserProvider): Promise<{ valid: boolean; error?: string }> {
  try {
    await Promise.race([
      provider.getBlockNumber(),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Timeout")), 10000))
    ]);
    return { valid: true };
  } catch (error: any) {
    return { 
      valid: false, 
      error: "El RPC no responde. Por favor, cambia el RPC en MetaMask manualmente." 
    };
  }
}

// Validate contract exists on network
export async function validateContract(provider: ethers.BrowserProvider): Promise<{ exists: boolean; error?: string }> {
  try {
    const code = await provider.getCode(CONTRACT_ADDRESS);
    if (code === "0x" || code === "0x0") {
      return { 
        exists: false, 
        error: `El contrato no está desplegado en esta red en la dirección ${CONTRACT_ADDRESS}. Por favor, despliega el contrato primero en Arbitrum Sepolia.` 
      };
    }
    return { exists: true };
  } catch (error: any) {
    return { 
      exists: false, 
      error: `Error al verificar el contrato: ${error.message}` 
    };
  }
}

// Get contract instance
export function getContract(signerOrProvider: ethers.JsonRpcSigner | ethers.BrowserProvider) {
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signerOrProvider);
}

// Create demo wallet (for testing without MetaMask)
export function createDemoWallet(): WalletState {
  const address = "0x" + Array.from({ length: 40 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join("");
  
  const balance = (Math.random() * 5 + 0.1).toFixed(4); // Random balance between 0.1 and 5.1 ETH

  return {
    address,
    balance,
    providerType: "demo",
  };
}

// Simulate demo transaction
export function simulateDemoTx(): string {
  return "0x" + Array.from({ length: 64 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join("");
}

// Helper functions for wallet names
const WALLET_ALIAS_KEY = "settarb_wallet_aliases";
const WALLET_COUNTER_KEY = "settarb_wallet_counter";

// Get or create wallet number
function getWalletNumber(address: string): number {
  if (typeof window === "undefined") return 1;
  
  try {
    const walletNumbersStr = localStorage.getItem(WALLET_COUNTER_KEY);
    const walletNumbers: Record<string, number> = walletNumbersStr 
      ? JSON.parse(walletNumbersStr) 
      : {};
    
    const addressLower = address.toLowerCase();
    
    // If wallet already has a number, return it
    if (walletNumbers[addressLower]) {
      return walletNumbers[addressLower];
    }
    
    // Otherwise, assign a new number
    const maxNumber = Math.max(0, ...Object.values(walletNumbers));
    const newNumber = maxNumber + 1;
    walletNumbers[addressLower] = newNumber;
    
    localStorage.setItem(WALLET_COUNTER_KEY, JSON.stringify(walletNumbers));
    return newNumber;
  } catch (error) {
    return 1;
  }
}

// Get custom alias for wallet
function getWalletAlias(address: string): string | null {
  if (typeof window === "undefined") return null;
  
  try {
    const aliasesStr = localStorage.getItem(WALLET_ALIAS_KEY);
    const aliases: Record<string, string> = aliasesStr 
      ? JSON.parse(aliasesStr) 
      : {};
    
    return aliases[address.toLowerCase()] || null;
  } catch (error) {
    return null;
  }
}

// Set custom alias for wallet
export function setWalletAlias(address: string, alias: string): void {
  if (typeof window === "undefined") return;
  
  try {
    const aliasesStr = localStorage.getItem(WALLET_ALIAS_KEY);
    const aliases: Record<string, string> = aliasesStr 
      ? JSON.parse(aliasesStr) 
      : {};
    
    aliases[address.toLowerCase()] = alias;
    localStorage.setItem(WALLET_ALIAS_KEY, JSON.stringify(aliases));
  } catch (error) {
    console.error("Error setting wallet alias:", error);
  }
}

// Get ENS name or wallet name (alias, numbered, or formatted address)
export async function getWalletName(
  address: string,
  provider?: ethers.BrowserProvider
): Promise<{ name: string; type: "ens" | "alias" | "wallet" | "address" }> {
  try {
    // Priority 1: Try to get ENS name (if provider available)
    if (provider) {
      try {
        const ensName = await provider.lookupAddress(address);
        if (ensName) {
          return { name: ensName, type: "ens" };
        }
      } catch (error) {
        // Continue to next option if ENS lookup fails
      }
    }

    // Priority 2: Check for custom alias
    const alias = getWalletAlias(address);
    if (alias) {
      return { name: alias, type: "alias" };
    }

    // Priority 3: Use numbered wallet name
    const walletNumber = getWalletNumber(address);
    return { name: `Wallet ${walletNumber}`, type: "wallet" };
  } catch (error) {
    // Final fallback: formatted address
    return { name: formatAddress(address), type: "address" };
  }
}


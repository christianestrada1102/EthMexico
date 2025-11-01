import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI, SEPOLIA_CHAIN_ID } from "./constants";

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
  return typeof window.ethereum !== "undefined" && window.ethereum.isMetaMask;
}

// Connect to MetaMask
export async function connectMetaMask(): Promise<WalletState> {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("MetaMask no detectada. Por favor, instala MetaMask.");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  
  // Request account access
  const accounts = await provider.send("eth_requestAccounts", []);
  
  // Check if we're on Sepolia
  const network = await provider.getNetwork();
  if (network.chainId !== BigInt(11155111)) {
    // Try to switch to Sepolia
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: SEPOLIA_CHAIN_ID }],
      });
    } catch (switchError: any) {
      // If chain doesn't exist, add it
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: SEPOLIA_CHAIN_ID,
              chainName: "Sepolia",
              nativeCurrency: {
                name: "Ethereum",
                symbol: "ETH",
                decimals: 18,
              },
              rpcUrls: ["https://sepolia.infura.io/v3/"],
              blockExplorerUrls: ["https://sepolia.etherscan.io"],
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


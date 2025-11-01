import { ethers } from "ethers";
import { getContract } from "./wallet";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "./constants";

// Contract interaction functions
export interface WithdrawalRequest {
  user: string;
  amount: bigint;
  timestamp: bigint;
  challengePeriodEnd: bigint;
  liquidityProvider: string;
  isAdvanced: boolean;
  isFinalized: boolean;
  fee: bigint;
}

// Request withdrawal
export async function requestWithdrawal(
  signer: ethers.JsonRpcSigner,
  amountEth: string
): Promise<ethers.ContractTransactionResponse> {
  const contract = getContract(signer);
  const value = ethers.parseEther(amountEth);
  return contract.requestWithdrawal({ value });
}

// Provide liquidity (as LP)
export async function provideLiquidity(
  signer: ethers.JsonRpcSigner,
  requestId: number,
  amountEth: string
): Promise<ethers.ContractTransactionResponse> {
  const contract = getContract(signer);
  const value = ethers.parseEther(amountEth);
  return contract.provideLiquidity(requestId, { value });
}

// Finalize withdrawal
export async function finalizeWithdrawal(
  signer: ethers.JsonRpcSigner,
  requestId: number
): Promise<ethers.ContractTransactionResponse> {
  const contract = getContract(signer);
  return contract.finalizeWithdrawal(requestId);
}

// Deposit bond (as LP)
export async function depositBond(
  signer: ethers.JsonRpcSigner,
  amountEth: string
): Promise<ethers.ContractTransactionResponse> {
  const contract = getContract(signer);
  const value = ethers.parseEther(amountEth);
  return contract.depositBond({ value });
}

// Withdraw bond (as LP)
export async function withdrawBond(
  signer: ethers.JsonRpcSigner,
  amountEth: string
): Promise<ethers.ContractTransactionResponse> {
  const contract = getContract(signer);
  const value = ethers.parseEther(amountEth);
  return contract.withdrawBond(value);
}

// Get withdrawal details
export async function getWithdrawal(
  provider: ethers.BrowserProvider,
  requestId: number
): Promise<WithdrawalRequest> {
  const contract = getContract(provider);
  const result = await contract.getWithdrawal(requestId);
  return result;
}

// Get time remaining for withdrawal
export async function getTimeRemaining(
  provider: ethers.BrowserProvider,
  requestId: number
): Promise<bigint> {
  const contract = getContract(provider);
  return contract.getTimeRemaining(requestId);
}

// Calculate fee
export async function calculateFee(
  provider: ethers.BrowserProvider,
  amountEth: string
): Promise<string> {
  const contract = getContract(provider);
  const amount = ethers.parseEther(amountEth);
  const fee = await contract.calculateFee(amount);
  return ethers.formatEther(fee);
}

// Get LP bond
export async function getLPBond(
  provider: ethers.BrowserProvider,
  address: string
): Promise<string> {
  const contract = getContract(provider);
  const bond = await contract.lpBonds(address);
  return ethers.formatEther(bond);
}

// Check if LP can provide liquidity
export async function canProvideLiquidity(
  provider: ethers.BrowserProvider,
  address: string
): Promise<boolean> {
  const contract = getContract(provider);
  return contract.canProvideLiquidity(address);
}

// Get withdrawal counter
export async function getWithdrawalCounter(
  provider: ethers.BrowserProvider
): Promise<bigint> {
  const contract = getContract(provider);
  return contract.withdrawalCounter();
}

// Get minimum bond
export async function getMinimumBond(
  provider: ethers.BrowserProvider
): Promise<string> {
  const contract = getContract(provider);
  const bond = await contract.minimumBond();
  return ethers.formatEther(bond);
}

// Get fee percentage
export async function getFeePercentage(
  provider: ethers.BrowserProvider
): Promise<bigint> {
  const contract = getContract(provider);
  return contract.feePercentage();
}


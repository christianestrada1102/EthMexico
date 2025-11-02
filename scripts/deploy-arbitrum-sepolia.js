const hre = require("hardhat");

async function main() {
  console.log("🚀 Desplegando BridgeFastWithdraw en Arbitrum Sepolia...\n");

  // Verificar que estamos en la red correcta
  const network = await hre.ethers.provider.getNetwork();
  console.log("📡 Red:", network.name || "local");
  console.log("🔗 Chain ID:", network.chainId.toString());
  
  if (network.chainId !== BigInt(421614)) {
    console.error("\n❌ ERROR: No estás en Arbitrum Sepolia!");
    console.log("   Chain ID actual:", network.chainId.toString());
    console.log("   Chain ID esperado: 421614\n");
    console.log("💡 SOLUCIÓN:");
    console.log("   1. Asegúrate de que MetaMask esté en Arbitrum Sepolia");
    console.log("   2. O configura tu private key en .env y usa:");
    console.log("      npx hardhat run scripts/deploy-arbitrum-sepolia.js --network arbitrumSepolia\n");
    process.exit(1);
  }

  // Obtener cuenta de deployment
  const [deployer] = await hre.ethers.getSigners();
  console.log("👤 Desplegando con cuenta:", deployer.address);
  
  // Verificar balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  const balanceInEth = hre.ethers.formatEther(balance);
  console.log("💰 Balance:", balanceInEth, "ETH\n");

  if (parseFloat(balanceInEth) < 0.001) {
    console.warn("⚠️  ADVERTENCIA: Balance bajo. Puede no tener suficiente ETH para el gas.");
    console.log("   Obtén ETH de testnet: https://faucet.quicknode.com/arbitrum/sepolia\n");
  }

  // Desplegar contrato
  console.log("📦 Compilando contrato...");
  const BridgeFastWithdraw = await hre.ethers.getContractFactory("BridgeFastWithdraw");
  
  console.log("🚀 Desplegando contrato...");
  console.log("   Esto puede tardar 1-2 minutos, por favor espera...\n");
  
  const bridge = await BridgeFastWithdraw.deploy({
    gasLimit: 2000000, // Gas limit específico para Arbitrum Sepolia
  });

  console.log("⏳ Esperando confirmación...");
  await bridge.waitForDeployment();

  const address = await bridge.getAddress();
  
  console.log("\n" + "=".repeat(60));
  console.log("✅ ¡CONTRATO DESPLEGADO EXITOSAMENTE!");
  console.log("=".repeat(60));
  console.log("\n📍 Dirección del contrato:");
  console.log("   " + address);
  console.log("\n🌐 Ver en explorer:");
  console.log("   https://sepolia.arbiscan.io/address/" + address);
  console.log("\n📋 ACTUALIZA frontend/lib/constants.ts:");
  console.log(`   export const CONTRACT_ADDRESS = "${address}";`);
  console.log("\n" + "=".repeat(60) + "\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ ERROR EN EL DEPLOYMENT:");
    console.error(error);
    
    if (error.message?.includes("insufficient funds")) {
      console.error("\n💡 Solución: Necesitas más ETH en Arbitrum Sepolia");
      console.error("   Faucet: https://faucet.quicknode.com/arbitrum/sepolia");
    } else if (error.message?.includes("network")) {
      console.error("\n💡 Solución: Verifica que estés en Arbitrum Sepolia (Chain ID: 421614)");
    } else if (error.message?.includes("timeout")) {
      console.error("\n💡 Solución: El RPC está lento, intenta de nuevo o cambia el RPC");
    }
    
    process.exit(1);
  });


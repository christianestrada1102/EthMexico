# 🚀 Guía: Desplegar en Arbitrum Sepolia desde Remix

## 📋 Paso a Paso Completo

---

## PARTE 1: Configurar MetaMask para Arbitrum Sepolia

### **1. Agregar Arbitrum Sepolia a MetaMask**

**Opción A: Usando ChainList (MÁS FÁCIL)**
1. Ve a https://chainlist.org
2. **Activa "Testnets"** (arriba, toggle)
3. Busca "Arbitrum Sepolia"
4. Click en **"Connect Wallet"**
5. MetaMask se abrirá
6. Click en **"Add Network"** o **"Agregar red"**
7. ✅ Arbitrum Sepolia se agregará automáticamente

**Opción B: Agregar Manualmente**
1. Abre MetaMask
2. Click en el nombre de la red (arriba)
3. Click en **"Add network"** → **"Add a network manually"**
4. Completa estos datos:
   - **Network Name**: `Arbitrum Sepolia`
   - **RPC URL**: `https://sepolia-rollup.arbitrum.io/rpc`
   - **Chain ID**: `421614`
   - **Currency Symbol**: `ETH`
   - **Block Explorer URL**: `https://sepolia-explorer.arbitrum.io`
5. Click en **"Save"**

### **2. Obtener Arbitrum Sepolia ETH**

Necesitas ETH para pagar gas:

1. **Opción A: QuickNode Faucet**
   - Ve a: https://faucet.quicknode.com/arbitrum/sepolia
   - Pega tu dirección de MetaMask
   - Completa el captcha
   - Recibirás 0.1 Arbitrum Sepolia ETH

2. **Opción B: Alchemy Faucet**
   - Ve a: https://www.alchemy.com/faucets/arbitrum-sepolia
   - Conecta tu wallet
   - Solicita ETH
   - Recibirás 0.5 Arbitrum Sepolia ETH por día

3. **Opción C: Arbitrum Official Faucet**
   - Ve a: https://faucet.arbitrum.io/
   - Selecciona "Arbitrum Sepolia"
   - Conecta MetaMask
   - Solicita ETH

**⚠️ IMPORTANTE**: Espera unos minutos para recibir el ETH. Verifica en MetaMask que tengas al menos 0.01 ETH.

---

## PARTE 2: Desplegar en Remix

### **1. Preparar Remix**

1. Ve a https://remix.ethereum.org
2. En el panel izquierdo, ve a `contracts/`
3. Crea nuevo archivo: `BridgeFastWithdraw.sol`
4. **Copia TODO el código** del contrato
5. Pégalo en Remix y guarda (Ctrl+S)

### **2. Compilar el Contrato**

1. Ve a la pestaña **"Solidity Compiler"** (icono arriba)
2. Selecciona **Compiler**: `0.8.20` o superior
3. Selecciona **Language**: `Solidity`
4. Clic en **"Compile BridgeFastWithdraw.sol"**
5. ✅ Debe aparecer ✅ verde

### **3. IMPORTANTE: Obtener el ABI (Antes de Desplegar)**

1. En el panel del compilador, busca el icono **"ABI"**
2. Click en **"ABI"**
3. Se abrirá un JSON
4. **Copia TODO el contenido** y guárdalo (lo necesitarás para el frontend)

### **4. Conectar Remix a MetaMask**

1. Ve a la pestaña **"Deploy & Run Transactions"** (icono abajo)
2. En **Environment**, selecciona: **"Injected Provider - MetaMask"**
   - Remix detectará tu MetaMask automáticamente
3. Si es la primera vez, MetaMask pedirá conexión:
   - Click en "Connect" en la ventana de MetaMask
   - Selecciona tu cuenta
   - Confirma

### **5. Verificar que Estás en Arbitrum Sepolia**

1. **En MetaMask**:
   - Arriba debe decir **"Arbitrum Sepolia"**
   - Si no, cámbialo manualmente

2. **En Remix**, en el panel de Deploy, debe decir:
   - **Network**: Arbitrum Sepolia ✅
   - **Account**: Tu dirección (0x...)
   - **Balance**: Tu balance en Arbitrum Sepolia ETH (debe ser > 0)

3. **Si dice otra red**:
   - Cambia en MetaMask a Arbitrum Sepolia
   - Refresca Remix (F5)
   - Verifica de nuevo

### **6. Desplegar el Contrato**

1. En **Contract**, selecciona: `BridgeFastWithdraw - contracts/BridgeFastWithdraw.sol`
2. **NO pongas nada en los parámetros del constructor** (está vacío)
3. Click en **"Deploy"**

4. **MetaMask se abrirá automáticamente**:
   - Verás una transacción de deployment
   - **Network**: Debe decir "Arbitrum Sepolia" ✅
   - **Gas Fee**: Aproximadamente 0.0001-0.0002 Arbitrum Sepolia ETH
   - Click en **"Confirm"** o **"Approve"**

5. **Espera la confirmación** (15-30 segundos):
   - En Remix verás: "Creation of BridgeFastWithdraw pending..."
   - Luego: "✅ Transaction mined and execution succeed"

### **7. Obtener la Dirección del Contrato (MUY IMPORTANTE)**

1. Abajo en **"Deployed Contracts"** verás tu contrato
2. **Copia la dirección completa** que aparece
   - Ejemplo: `0x1234567890123456789012345678901234567890`
3. **GUÁRDALA BIEN** - Es permanente en Arbitrum Sepolia

### **8. Verificar en el Block Explorer**

1. Ve a: https://sepolia-explorer.arbitrum.io
2. Pega la dirección del contrato
3. Debes ver el contrato desplegado ✅

---

## PARTE 3: Actualizar el Frontend

Una vez tengas la nueva dirección del contrato en Arbitrum Sepolia:

1. Abre `frontend/lib/constants.ts`
2. Cambia `CONTRACT_ADDRESS` por la nueva dirección:
   ```typescript
   export const CONTRACT_ADDRESS = "0xTU_NUEVA_DIRECCION_AQUI";
   ```
3. El ABI debería ser el mismo (no cambia)
4. Guarda y listo

---

## ✅ Checklist

- [ ] MetaMask tiene Arbitrum Sepolia agregado
- [ ] Tienes Arbitrum Sepolia ETH (al menos 0.01)
- [ ] Remix está conectado a MetaMask
- [ ] Remix muestra "Network: Arbitrum Sepolia"
- [ ] Contrato compilado exitosamente
- [ ] ABI copiado y guardado
- [ ] Contrato desplegado en Arbitrum Sepolia
- [ ] Dirección del contrato copiada
- [ ] Contrato verificado en Arbitrum Sepolia Explorer
- [ ] Frontend actualizado con la nueva dirección

---

## 🐛 Troubleshooting

### **Error: "Failed to fetch"**
- Verifica que Arbitrum Sepolia esté agregado correctamente en MetaMask
- Verifica que tengas ETH en Arbitrum Sepolia
- Intenta cambiar el RPC URL en MetaMask

### **Error: "Insufficient funds"**
- Necesitas más Arbitrum Sepolia ETH
- Ve a uno de los faucets mencionados arriba

### **Remix no detecta Arbitrum Sepolia**
- Asegúrate de estar en Arbitrum Sepolia en MetaMask
- Refresca Remix (F5)
- Verifica que MetaMask esté desbloqueado

---

## 📝 Notas Importantes

1. **El contrato en Arbitrum Sepolia es diferente** al de Sepolia
   - Tienen direcciones diferentes
   - Son blockchains diferentes

2. **Arbitrum Sepolia ETH es diferente** a Sepolia ETH
   - No puedes usar Sepolia ETH en Arbitrum Sepolia
   - Necesitas obtener Arbitrum Sepolia ETH específicamente

3. **El gas es más barato** en Arbitrum Sepolia que en Sepolia
   - Las transacciones cuestan menos

4. **El block explorer** es diferente:
   - Arbitrum Sepolia: https://sepolia-explorer.arbitrum.io
   - Sepolia: https://sepolia.etherscan.io


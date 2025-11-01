# ✅ Siguientes Pasos: Desplegar el Contrato

## 🎯 Ya Tienes MetaMask Conectado - Ahora Vamos a Desplegar

---

## ✅ PASO 1: Verificar que Estás en Sepolia

En el panel "Deploy & Run Transactions" de Remix, verifica:

1. **Debe decir:**
   - **Network**: Sepolia ✅
   - **Account**: Tu dirección (0x...)
   - **Balance**: Tu balance en Sepolia ETH

2. **Si dice "Mainnet" u otra red:**
   - Ve a MetaMask
   - Cambia a Sepolia
   - Vuelve a Remix y verifica de nuevo

---

## ✅ PASO 2: Verificar que Tienes Sepolia ETH

1. En Remix, mira tu **Balance**
2. **¿Tienes al menos 0.01 Sepolia ETH?**
   - ✅ **SÍ** → Continúa al Paso 3
   - ❌ **NO** → Necesitas obtener Sepolia ETH:
     - Ve a https://sepoliafaucet.com/
     - O https://faucets.chain.link/sepolia
     - Pega tu dirección de MetaMask
     - Solicita ETH
     - Espera unos minutos para recibirlo

---

## ✅ PASO 3: Compilar el Contrato (Si Aún No Lo Has Hecho)

1. En Remix, ve a la pestaña **"Solidity Compiler"** (icono de compilador arriba)
2. Verifica:
   - **Compiler**: `0.8.20` o superior
   - **Language**: Solidity
3. **Click en "Compile BridgeFastWithdraw.sol"**
4. Debe aparecer ✅ verde si compiló bien

---

## ✅ PASO 4: Obtener el ABI (MUY IMPORTANTE)

**Haz esto ANTES de desplegar:**

1. En el panel del compilador, busca el icono **"ABI"**
2. **Click en "ABI"**
3. Se abrirá un archivo JSON
4. **Copia TODO el contenido** (Ctrl+A, Ctrl+C)
5. **Guárdalo** temporalmente:
   - Puedes crear un archivo `contractABI.json` en tu proyecto
   - O simplemente guárdalo en Notepad/Bloc de notas
   - **Lo necesitarás para el frontend después**

---

## ✅ PASO 5: Seleccionar el Contrato para Desplegar

1. En "Deploy & Run Transactions", busca el dropdown **"Contract"**
2. **Click en el dropdown**
3. Selecciona: **"BridgeFastWithdraw - contracts/BridgeFastWithdraw.sol"**
   - O simplemente: **"BridgeFastWithdraw"**

---

## ✅ PASO 6: Desplegar el Contrato

1. Verifica que:
   - Environment: "Injected Provider - MetaMask" ✅
   - Network: Sepolia ✅
   - Contract: BridgeFastWithdraw ✅
   - Value: 0 (es correcto)

2. **Click en el botón "Deploy"** (botón azul/naranja)

3. **MetaMask se abrirá automáticamente:**
   - Verás una ventana que dice "Send Transaction"
   - **Verifica que dice "Network: Sepolia"** arriba
   - Verás el gas fee (aproximadamente 0.001-0.002 ETH)

4. **Revisa los detalles y click en "Confirm" o "Confirmar"**

5. **Espera la confirmación:**
   - Verás "Creation of BridgeFastWithdraw pending..." en Remix
   - Puede tardar 30 segundos - 2 minutos
   - Cuando se complete, verás: **"✅ Transaction mined and execution succeed"**

---

## ✅ PASO 7: Obtener la Dirección del Contrato

Después de que se complete el despliegue:

1. En "Deploy & Run Transactions", baja hasta ver **"Deployed Contracts"**

2. Verás tu contrato:
   ```
   BridgeFastWithdraw
   at 0x1234567890... (con botón copiar)
   ```

3. **Copia la dirección completa:**
   - Click en el botón de copiar (icono de copiar) junto a la dirección
   - O selecciona manualmente y copia (Ctrl+C)

4. **Guárdala en un lugar seguro:**
   - Ejemplo: `0x1234567890123456789012345678901234567890`
   - **Esta es la dirección permanente de tu contrato en Sepolia**

---

## ✅ PASO 8: Verificar en Etherscan (Opcional pero Recomendado)

1. Ve a **https://sepolia.etherscan.io**
2. En la barra de búsqueda, **pega la dirección del contrato**
3. Click en buscar
4. Deberías ver:
   - Tu contrato desplegado
   - La transacción de deployment
   - El hash de la transacción

---

## ✅ PASO 9: Configurar el Challenge Period para Testing (Opcional)

Para hacer testing más rápido, puedes reducir el challenge period:

1. En "Deployed Contracts", expande tu contrato (click en la flecha)
2. Busca la función **`setTestChallengePeriod`**
3. En el input, escribe: `120` (120 segundos = 2 minutos)
4. Click en **"transact"**
5. MetaMask pedirá confirmación → Confirma
6. Espera la confirmación

**Ahora el challenge period será de 2 minutos en lugar de 7 días (solo para testing).**

---

## ✅ PASO 10: Probar el Contrato (Opcional)

Puedes probar que funciona:

1. **Depositar un bond (como LP):**
   - En "Deployed Contracts", expande tu contrato
   - Busca `depositBond`
   - En "VALUE", escribe: `0.1` y selecciona "ether"
   - Click en "transact"
   - Confirma en MetaMask

2. **Solicitar un retiro (como usuario):**
   - Cambia de cuenta en MetaMask (si tienes otra)
   - O usa la misma cuenta
   - Busca `requestWithdrawal`
   - En "VALUE", escribe: `0.1` y selecciona "ether"
   - Click en "transact"
   - Confirma en MetaMask

---

## 📋 Checklist Final

Antes de continuar con el frontend, asegúrate de tener:

- [ ] ✅ MetaMask conectado a Remix
- [ ] ✅ Network: Sepolia (verificado)
- [ ] ✅ Balance suficiente en Sepolia ETH
- [ ] ✅ Contrato compilado exitosamente
- [ ] ✅ ABI copiado y guardado
- [ ] ✅ Contrato desplegado en Sepolia
- [ ] ✅ Dirección del contrato copiada y guardada
- [ ] ✅ Verificado en Etherscan (opcional)
- [ ] ✅ Challenge period configurado para testing (opcional)

---

## 🎯 Información que Necesitas Guardar

**Guarda estas dos cosas para el frontend:**

1. **CONTRACT_ADDRESS:**
   ```
   0x1234567890123456789012345678901234567890
   ```
   (Tu dirección del contrato)

2. **ABI:**
   ```json
   [el JSON completo que copiaste]
   ```
   (El ABI del compilador)

---

## 🚀 Siguiente Paso

Una vez que tengas:
- ✅ Dirección del contrato
- ✅ ABI guardado

**Avísame y creamos el frontend completo** que se conecta a tu contrato desplegado en Sepolia. 🎉

---

**¿Ya desplegaste el contrato? ¿Tienes la dirección del contrato y el ABI guardados?**


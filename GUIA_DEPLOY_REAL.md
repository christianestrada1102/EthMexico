# 🚀 Guía Completa: Despliegue REAL en Sepolia con MetaMask

## 📋 Paso a Paso para Desplegar en Red Real (No Simulación)

---

## PARTE 1: Preparar MetaMask y Obtener ETH de Testnet

### **1. Instalar MetaMask (Si no lo tienes)**
1. Ve a https://metamask.io
2. Instala la extensión en tu navegador
3. Crea una cuenta o importa una existente
4. **Guarda tu seed phrase en un lugar SEGURO**

### **2. Configurar MetaMask para Sepolia Testnet**

1. Abre MetaMask (click en el icono del zorro)
2. Arriba a la izquierda verás "Ethereum Mainnet"
3. Click ahí → Selecciona **"Show test networks"** (Activar redes de prueba)
4. O ve a Settings → Advanced → Activa "Show test networks"
5. Ahora en el dropdown verás varias redes
6. Selecciona **"Sepolia"**

### **3. Obtener Sepolia ETH (Gratis para Testing)**

**Opción A: Sepolia Faucet de Alchemy**
1. Ve a https://sepoliafaucet.com/
2. Pega tu dirección de MetaMask (0x...)
3. Completa el captcha
4. Recibirás 0.5 Sepolia ETH gratis

**Opción B: Sepolia Faucet de Infura**
1. Ve a https://www.infura.io/faucet/sepolia
2. Conéctate con GitHub o Twitter
3. Pega tu dirección
4. Recibirás ETH de testnet

**Opción C: Sepolia Faucet de Chainlink**
1. Ve a https://faucets.chain.link/sepolia
2. Conecta tu wallet
3. Solicita ETH

**Nota**: Puede tardar unos minutos. Verifica en MetaMask que recibiste los fondos.

---

## PARTE 2: Desplegar Contrato en Sepolia desde Remix

### **1. Preparar Remix**

1. Ve a https://remix.ethereum.org
2. En el panel izquierdo, ve a `contracts/`
3. Crea nuevo archivo: `BridgeFastWithdraw.sol`
4. **Copia TODO el código** de `BridgeFastWithdraw.sol` de tu workspace
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
4. **Copia TODO el contenido** y guárdalo temporalmente (lo usaremos en el frontend)

**Ejemplo de cómo se ve:**
```json
[
  {
    "inputs": [...],
    "name": "requestWithdrawal",
    "outputs": [...],
    "stateMutability": "payable",
    "type": "function"
  },
  ...
]
```

### **4. Conectar Remix a MetaMask**

1. Ve a la pestaña **"Deploy & Run Transactions"** (icono abajo)
2. En **Environment**, selecciona: **"Injected Provider - MetaMask"**
   - Remix detectará tu MetaMask automáticamente
3. Si es la primera vez, MetaMask pedirá conexión:
   - Click en "Connect" en la ventana de MetaMask
   - Selecciona tu cuenta
   - Confirma

### **5. Verificar que Estás en Sepolia**

1. En Remix, en el panel de Deploy, debe decir:
   - **Network**: Sepolia
   - **Account**: Tu dirección (0x...)
   - **Balance**: Tu balance en Sepolia ETH

2. Si dice otra red, cambia en MetaMask a Sepolia y recarga Remix

### **6. Desplegar el Contrato**

1. En **Contract**, selecciona: `BridgeFastWithdraw - contracts/BridgeFastWithdraw.sol`
2. **NO pongas nada en los parámetros del constructor** (está vacío)
3. Click en **"Deploy"**

4. **MetaMask se abrirá automáticamente**:
   - Verás una transacción de deployment
   - **Gas Fee**: Aproximadamente 0.001-0.002 Sepolia ETH
   - Click en **"Confirm"** o **"Approve"**

5. Espera la confirmación (30 seg - 2 min):
   - En Remix verás: "Creation of BridgeFastWithdraw pending..."
   - Luego: "✅ Transaction mined and execution succeed"

### **7. Obtener la Dirección del Contrato (MUY IMPORTANTE)**

1. Abajo en **"Deployed Contracts"** verás tu contrato
2. **Copia la dirección completa** que aparece
   - Ejemplo: `0x1234567890123456789012345678901234567890`
3. **GUÁRDALA BIEN** - Es permanente en Sepolia

### **8. Verificar el Despliegue (Opcional pero Recomendado)**

1. Ve a https://sepolia.etherscan.io
2. Pega la dirección del contrato en la búsqueda
3. Debes ver:
   - El contrato desplegado
   - Todas las transacciones
   - El código fuente (si verificaste)

---

## PARTE 3: Información que Necesitas Guardar

### **Para el Frontend necesitas:**

1. **CONTRACT_ADDRESS**:
   ```
   0x1234567890123456789012345678901234567890
   ```
   (La dirección que copiaste del deployment)

2. **ABI**:
   ```json
   [el JSON completo que copiaste del compilador]
   ```
   (El ABI que copiaste del compilador)

3. **Network ID de Sepolia**:
   ```
   11155111
   ```
   (Ya lo configuramos en el frontend, pero por si acaso)

---

## PARTE 4: Configurar Para Testing

### **Después del Deployment, Configura el Challenge Period**

1. En Remix, en **"Deployed Contracts"**, expande tu contrato
2. Busca la función `setTestChallengePeriod`
3. En el input, pon: `120` (2 minutos para testing rápido)
4. Click en **"transact"**
5. MetaMask pedirá confirmación → Confirma
6. Espera confirmación

**Ahora el sistema está listo para testing rápido.**

---

## ⚠️ Troubleshooting

### **Error: "Insufficient funds"**
- **Solución**: Necesitas más Sepolia ETH. Usa otro faucet.

### **Error: "User denied transaction"**
- **Solución**: Asegúrate de confirmar en MetaMask cuando aparezca.

### **Error: MetaMask no se conecta**
- **Solución**: 
  1. Refresca Remix
  2. Asegúrate de tener MetaMask desbloqueado
  3. Verifica que estás en Sepolia en MetaMask

### **Error: "Contract deployment failed"**
- **Solución**: 
  1. Verifica que el código compiló sin errores
  2. Asegúrate de tener suficiente ETH para gas
  3. Intenta aumentar el gas limit en MetaMask

### **No aparece "Injected Provider - MetaMask"**
- **Solución**: 
  1. Instala la extensión de MetaMask
  2. Refresca Remix completamente
  3. Asegúrate de tener MetaMask desbloqueado

---

## ✅ Checklist de Despliegue Real

- [ ] MetaMask instalado y configurado
- [ ] Sepolia network agregada en MetaMask
- [ ] Sepolia ETH obtenido (al menos 0.01 ETH para gas)
- [ ] Contrato compilado en Remix
- [ ] ABI copiado y guardado
- [ ] Remix conectado a MetaMask (Injected Provider)
- [ ] Verificado que estás en Sepolia
- [ ] Contrato desplegado exitosamente
- [ ] Dirección del contrato copiada y guardada
- [ ] Challenge period configurado para testing (120 segundos)

---

## 🎯 Próximo Paso

Una vez que tengas:
- ✅ Dirección del contrato
- ✅ ABI guardado

**Puedo crear el frontend completo** que se conecta a tu contrato desplegado en Sepolia.

El frontend usará MetaMask para:
- Conectar automáticamente
- Detectar que estás en Sepolia
- Interactuar con tu contrato real
- Mostrar transacciones reales en Etherscan

---

**¿Tienes todo listo? Cuando termines el despliegue, avísame y creo el frontend.** 🚀


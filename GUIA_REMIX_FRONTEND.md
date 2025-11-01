# 🔗 Guía: Remix → Frontend

## 📋 Paso a Paso Completo

---

## PARTE 1: Desplegar en Remix

### **1. Abrir Remix**
- Ve a https://remix.ethereum.org
- Si es tu primera vez, crea un nuevo workspace

### **2. Crear el Archivo del Contrato**
1. En el panel izquierdo, ve a la carpeta `contracts/`
2. Clic derecho → "New File"
3. Nombra el archivo: `BridgeFastWithdraw.sol`
4. **Copia TODO el contenido** de `BridgeFastWithdraw.sol` de tu workspace
5. Pégalo en Remix
6. Guarda (Ctrl+S o Cmd+S)

### **3. Compilar**
1. Ve a la pestaña **"Solidity Compiler"** (icono de compilador arriba)
2. Selecciona **Compiler**: `0.8.20` o superior
3. Selecciona **Language**: `Solidity`
4. Clic en **"Compile BridgeFastWithdraw.sol"**
5. ✅ Debe aparecer una ✅ verde si compiló bien

### **4. Obtener el ABI (MUY IMPORTANTE)**
1. En el panel del compilador, busca el icono **"ABI"** (junto a "Bytecode")
2. Clic en **"ABI"**
3. **Copia TODO el JSON** que aparece
4. Guárdalo en un archivo llamado `contractABI.json` en tu proyecto (o lo generamos desde aquí)

### **5. Conectar Remix a MetaMask (OBLIGATORIO - NO USAR REMIX VM)**

**⚠️ IMPORTANTE: NO uses "Remix VM (Shanghai)" - eso es SIMULACIÓN**
**Debes usar MetaMask para red REAL (Sepolia)**

1. Ve a la pestaña **"Deploy & Run Transactions"** (icono abajo)
2. En **Environment**, selecciona: **"Injected Provider - MetaMask"**
   - Remix detectará tu MetaMask automáticamente
   - ⚠️ Si no aparece esta opción, asegúrate de tener MetaMask instalado y desbloqueado
3. Si es la primera vez, MetaMask pedirá conexión:
   - Click en "Connect" en la ventana de MetaMask
   - Selecciona tu cuenta
   - Confirma

### **6. Configurar MetaMask para Sepolia (ANTES de Desplegar)**

1. Abre MetaMask (click en el icono del zorro)
2. Arriba a la izquierda verás "Ethereum Mainnet"
3. Click ahí → Activa **"Show test networks"** (si no está activado)
4. Selecciona **"Sepolia"** en el dropdown
5. Si no tienes Sepolia ETH, ve a un faucet:
   - https://sepoliafaucet.com/
   - https://faucets.chain.link/sepolia
   - Obtén al menos 0.01 Sepolia ETH (para gas)

### **7. Verificar que Estás en Sepolia en Remix**

1. En Remix, en el panel de Deploy, debe decir:
   - **Network**: Sepolia ✅
   - **Account**: Tu dirección (0x...)
   - **Balance**: Tu balance en Sepolia ETH

2. Si dice "Mainnet" o otra red:
   - Cambia en MetaMask a Sepolia
   - Refresca Remix (F5)
   - Verifica de nuevo

### **8. Desplegar el Contrato en Sepolia (RED REAL)**

1. En **Contract**, selecciona: `BridgeFastWithdraw - contracts/BridgeFastWithdraw.sol`
2. **NO pongas nada en los parámetros del constructor** (está vacío)
3. Click en **"Deploy"**

4. **MetaMask se abrirá automáticamente**:
   - Verás una transacción de deployment
   - **Network**: Debe decir "Sepolia"
   - **Gas Fee**: Aproximadamente 0.001-0.002 Sepolia ETH
   - **Revisa los detalles** antes de confirmar
   - Click en **"Confirm"** o **"Approve"**

5. Espera la confirmación (30 seg - 2 min):
   - En Remix verás: "Creation of BridgeFastWithdraw pending..."
   - En MetaMask verás el estado de la transacción
   - Luego: "✅ Transaction mined and execution succeed"

6. **Verifica en Etherscan**:
   - Ve a https://sepolia.etherscan.io
   - Busca tu dirección o el hash de la transacción
   - Debes ver el contrato desplegado

### **9. Obtener la Dirección del Contrato (MUY IMPORTANTE)**

1. Abajo en **"Deployed Contracts"** verás tu contrato
2. **Copia la dirección completa** que aparece
   - Ejemplo: `0x1234567890123456789012345678901234567890`
3. **GUÁRDALA BIEN** - Es permanente en Sepolia (no cambia)
4. Puedes verificar en Etherscan pegando esa dirección

---

## PARTE 2: Conectar Frontend con el Contrato

### **¿Cómo se Conectan?**

```
┌─────────────────┐
│  Frontend (React)│
│                 │
│  Usa ethers.js  │ ─────┐
│  o web3.js      │      │
└─────────────────┘      │
                         │
                         │ Necesita:
                         │ 1. CONTRACT_ADDRESS
                         │ 2. ABI (Application Binary Interface)
                         │
                         ▼
┌─────────────────────────────────────┐
│  Contrato Desplegado en Blockchain  │
│                                     │
│  Dirección: 0x5FbDB...             │
│  (deployado desde Remix)            │
└─────────────────────────────────────┘
```

### **Lo que Necesitas del Contrato**

1. **CONTRACT_ADDRESS**: La dirección que copiaste de Remix
   - Ejemplo: `"0x5FbDB2315678afecb367f032d93F642f64180aa3"`

2. **ABI (Application Binary Interface)**: El JSON que copiaste del compilador
   - Es un array JSON que describe las funciones del contrato
   - Permite al frontend saber qué funciones existen y cómo llamarlas

### **Ejemplo de Código Frontend**

```javascript
import { ethers } from 'ethers';
import contractABI from './contractABI.json'; // El ABI que copiaste

// Dirección del contrato (la que obtuviste en Remix)
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

// Conectar al contrato
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

// Ahora puedes llamar funciones del contrato:
// await contract.requestWithdrawal({ value: ethers.utils.parseEther("1") });
// await contract.getWithdrawal(0);
```

---

## PARTE 3: NO Usar Remix VM (Simulación)

### **¿Por qué NO usar Remix VM?**

❌ **Remix VM (Shanghai)** es SIMULACIÓN:
- No es una blockchain real
- El contrato no existe realmente
- El frontend NO puede conectarse
- Solo sirve para probar el código básico

✅ **MetaMask + Sepolia** es REAL:
- Es una blockchain de prueba REAL
- El contrato existe realmente
- El frontend SÍ puede conectarse
- Puedes ver las transacciones en Etherscan
- Es lo que necesitas para el frontend

### **Verificar que Estás en Red Real:**

✅ **Correcto**: 
- Environment: "Injected Provider - MetaMask"
- Network: "Sepolia"
- Puedes ver tu contrato en https://sepolia.etherscan.io

❌ **Incorrecto**:
- Environment: "Remix VM (Shanghai)"
- No puedes conectarlo al frontend

---

## 📝 Checklist Completo (SOLO RED REAL)

### **En Remix:**
- [ ] Archivo del contrato creado
- [ ] Contrato compilado exitosamente
- [ ] ABI copiado y guardado
- [ ] MetaMask instalado y configurado
- [ ] Sepolia network seleccionada en MetaMask
- [ ] Sepolia ETH obtenido (para gas)
- [ ] Environment: "Injected Provider - MetaMask" (NO Remix VM)
- [ ] Verificado que dice "Network: Sepolia"
- [ ] Contrato desplegado en Sepolia (red real)
- [ ] Dirección del contrato copiada y guardada
- [ ] Verificado en Etherscan (https://sepolia.etherscan.io)

### **Para Frontend (Cuando lo hagamos):**
- [ ] Tienes el ABI (JSON del compilador)
- [ ] Tienes la dirección del contrato de Sepolia
- [ ] Frontend configurado con ethers.js o web3.js
- [ ] Frontend configurado para conectarse a Sepolia (Network ID: 11155111)

---

## 🎯 Cómo se Conectan Remix y el Frontend

### **Flujo de Conexión:**

```
┌─────────────────────────────────────┐
│  REMIX (Despliegue)                 │
│                                     │
│  1. Compilas el contrato           │
│  2. Obtienes el ABI (JSON)         │
│  3. Desplegas con MetaMask         │
│  4. Obtienes CONTRACT_ADDRESS      │
└─────────────────────────────────────┘
              │
              │ Proporciona:
              │ • ABI (JSON del compilador)
              │ • CONTRACT_ADDRESS (dirección)
              │
              ▼
┌─────────────────────────────────────┐
│  FRONTEND (Tu aplicación web)       │
│                                     │
│  Usa ethers.js o web3.js           │
│  Se conecta a MetaMask             │
│  Interactúa con el contrato        │
│                                     │
│  Código ejemplo:                    │
│  const contract = new ethers.Contract(│
│    CONTRACT_ADDRESS,                │
│    ABI,                             │
│    signer                           │
│  );                                 │
└─────────────────────────────────────┘
              │
              │ Se conecta a:
              ▼
┌─────────────────────────────────────┐
│  CONTRATO EN SEPOLIA (Blockchain)   │
│                                     │
│  Dirección: 0x1234...              │
│  Red: Sepolia (11155111)           │
│  Estado: Permanente                │
└─────────────────────────────────────┘
```

### **Lo que Necesitas Guardar del Despliegue:**

1. **CONTRACT_ADDRESS**: La dirección del contrato en Sepolia
2. **ABI**: El JSON completo del compilador de Remix

---

## ⚠️ Notas Importantes

1. **ABI**: Debe coincidir exactamente con el contrato desplegado
   - Si cambias el contrato en Remix, regenera el ABI

2. **Dirección del Contrato**: 
   - En Remix VM cambia cada deploy → para testing rápido
   - En Sepolia es permanente → mejor para frontend real

3. **Red**: Frontend y contrato deben estar en la misma red
   - ✅ Sepolia = testing real con frontend (LO QUE NECESITAS)
   - ❌ Remix VM = NO sirve para frontend (es simulación)
   - ⚠️ Localhost = solo si usas Hardhat (más complejo)

---

## ✅ Resumen Final

**Pasos para Remix con MetaMask (Red Real):**
1. Instala MetaMask
2. Configura Sepolia en MetaMask
3. Obtén Sepolia ETH de un faucet
4. En Remix: Environment = "Injected Provider - MetaMask"
5. Verifica que dice "Network: Sepolia"
6. Compila el contrato
7. Copia el ABI
8. Despliega el contrato
9. Copia la CONTRACT_ADDRESS
10. Verifica en Etherscan

**Cuando tengas eso listo, avísame y creamos el frontend.** 🚀


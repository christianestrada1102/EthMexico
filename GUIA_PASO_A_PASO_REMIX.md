# 📝 Guía Paso a Paso: Deploy & Run en Remix

## 🎯 Instrucciones Detalladas para la Sección "Deploy & Run Transactions"

---

## ✅ ANTES DE EMPEZAR - Debes Tener:

- [ ] Contrato compilado exitosamente (✅ verde en el compilador)
- [ ] MetaMask instalado en tu navegador
- [ ] MetaMask desbloqueado (con contraseña ingresada)
- [ ] Sepolia configurada en MetaMask
- [ ] Sepolia ETH en tu wallet (al menos 0.01 ETH para gas)

---

## 📍 PASO 1: Abrir la Pestaña "Deploy & Run Transactions"

1. En Remix, mira la barra de iconos **a la izquierda**
2. Busca el icono que dice **"Deploy & Run Transactions"** (es el que está más abajo, tiene un símbolo de cohete/despliegue)
3. **Click en ese icono**
4. Se abrirá el panel de despliegue a la izquierda

---

## 📍 PASO 2: Seleccionar el Environment

En el panel que se acaba de abrir, verás varias opciones:

### **Lo que DEBES ver:**
```
┌─────────────────────────────────────┐
│ Environment: [Dropdown]             │
│                                     │
│  [Aquí hay un dropdown/lista]      │
└─────────────────────────────────────┘
```

### **Lo que DEBES hacer:**

1. **Click en el dropdown que dice "Environment"** (o donde aparece una lista)
2. Verás varias opciones, busca:
   - ❌ Remix VM (Shanghai) - **NO SELECCIONES ESTO**
   - ❌ Remix VM (Berlin) - **NO SELECCIONES ESTO**
   - ❌ JavaScript VM - **NO SELECCIONES ESTO**
   - ✅ **Injected Provider - MetaMask** - **SELECCIONA ESTO**

3. **Click en "Injected Provider - MetaMask"**

### **⚠️ Si NO aparece "Injected Provider - MetaMask":**
- Asegúrate de tener MetaMask instalado
- Asegúrate de tener MetaMask desbloqueado
- Refresca la página de Remix (F5)
- Vuelve a intentar

---

## 📍 PASO 3: Conectar MetaMask (Primera Vez)

Después de seleccionar "Injected Provider - MetaMask":

1. **MetaMask se abrirá automáticamente** (puede tardar 2-3 segundos)
2. Verás una ventana de MetaMask que dice algo como:
   ```
   "Remix wants to connect to your account"
   ```

3. **Verifica que dice "Sepolia"** en la parte superior de la ventana de MetaMask
   - Si dice "Ethereum Mainnet", **cierra la ventana**
   - Ve a MetaMask y cambia a Sepolia
   - Luego vuelve a Remix y selecciona de nuevo "Injected Provider - MetaMask"

4. **En la ventana de MetaMask:**
   - Verás tu dirección (0x...)
   - Click en **"Next"** o **"Siguiente"**
   - Click en **"Connect"** o **"Conectar"**

5. **MetaMask se cerrará automáticamente**

---

## 📍 PASO 4: Verificar la Conexión en Remix

Después de conectar MetaMask, en el panel de Remix verás:

```
┌─────────────────────────────────────┐
│ Environment: Injected Provider ...  │
│                                     │
│ Account: 0x1234...5678             │
│ Balance: 0.5 ETH                   │
│ Gas Limit: 3000000                 │
│ Value: 0 Ether                     │
│                                     │
│ Network: Sepolia ✅                │
└─────────────────────────────────────┘
```

### **Verifica que:**
- ✅ **Account**: Muestra tu dirección (0x...)
- ✅ **Balance**: Muestra tu balance en Sepolia ETH (debe ser > 0)
- ✅ **Network**: Debe decir **"Sepolia"** (no Mainnet, no otra red)

### **❌ Si dice "Mainnet" o otra red:**
1. Ve a MetaMask
2. Click en donde dice la red (arriba)
3. Selecciona **"Sepolia"**
4. Vuelve a Remix
5. El panel debería actualizarse automáticamente

---

## 📍 PASO 5: Seleccionar el Contrato para Desplegar

En el mismo panel de "Deploy & Run Transactions", verás:

```
┌─────────────────────────────────────┐
│ Contract: [Dropdown]                │
│                                     │
│  [Aquí hay un dropdown]            │
└─────────────────────────────────────┘
```

### **Lo que DEBES hacer:**

1. **Click en el dropdown "Contract"** (o donde dice "Select a contract")
2. Busca en la lista:
   - ✅ **BridgeFastWithdraw - contracts/BridgeFastWithdraw.sol**
   - O simplemente: **BridgeFastWithdraw**

3. **Click en esa opción**

### **⚠️ Si NO aparece el contrato:**
- El contrato no está compilado
- Ve a "Solidity Compiler"
- Compila el contrato
- Vuelve a "Deploy & Run Transactions"
- Ahora debería aparecer

---

## 📍 PASO 6: Verificar los Parámetros del Constructor

Después de seleccionar el contrato, verás:

```
┌─────────────────────────────────────┐
│ Deploy                                 │
│                                       │
│ [Aquí pueden aparecer inputs]        │
│                                       │
│ [Botón "Deploy"]                     │
└─────────────────────────────────────┘
```

### **Para tu contrato BridgeFastWithdraw:**
- **NO deberías ver ningún input** (el constructor está vacío)
- Solo deberías ver el botón **"Deploy"**

### **Si ves inputs:**
- Déjalos vacíos (o en 0)
- No son necesarios

---

## 📍 PASO 7: Desplegar el Contrato

1. **Click en el botón "Deploy"** (botón azul/naranja)
2. **MetaMask se abrirá automáticamente** (puede tardar 3-5 segundos)

3. **En la ventana de MetaMask verás:**
   ```
   ┌─────────────────────────────────────┐
   │ Send Transaction                    │
   │                                     │
   │ Network: Sepolia                    │
   │ From: 0x1234... (tu dirección)     │
   │ To: Contract Deployment             │
   │ Amount: 0 ETH                       │
   │ Max transaction fee: ~0.0015 ETH    │
   │                                     │
   │ [Botón "Reject"] [Botón "Confirm"] │
   └─────────────────────────────────────┘
   ```

4. **VERIFICA:**
   - ✅ Network: Debe decir **"Sepolia"**
   - ✅ Amount: 0 ETH (es correcto, solo pagas gas)
   - ✅ Max transaction fee: Aproximadamente 0.001-0.002 ETH

5. **Si todo está bien:**
   - Click en **"Confirm"** o **"Confirmar"**
   - MetaMask se cerrará

6. **Si NO quieres confirmar:**
   - Click en "Reject" (rechazar)
   - La transacción no se enviará

---

## 📍 PASO 8: Esperar la Confirmación

Después de confirmar en MetaMask:

1. **En Remix verás:**
   - "Creation of BridgeFastWithdraw pending..." (creación pendiente)
   - O un mensaje similar

2. **En MetaMask verás:**
   - Un círculo de carga o "Pending"
   - El hash de la transacción

3. **Espera 30 segundos - 2 minutos:**
   - La transacción se está procesando en Sepolia
   - Puedes ver el progreso en MetaMask

4. **Cuando se complete:**
   - En Remix verás: **"✅ Transaction mined and execution succeed"**
   - En MetaMask verás: "Transaction confirmed"

---

## 📍 PASO 9: Obtener la Dirección del Contrato

Después de que se complete el despliegue:

1. **En Remix, baja en el panel "Deploy & Run Transactions"**
2. Verás una sección llamada **"Deployed Contracts"** (contratos desplegados)

3. **Verás algo como:**
   ```
   ┌─────────────────────────────────────┐
   │ Deployed Contracts                  │
   │                                     │
   │ BridgeFastWithdraw                  │
   │ at 0x1234567890... (botón copiar)   │
   │                                     │
   │ [Expandir] [▼]                      │
   └─────────────────────────────────────┘
   ```

4. **La dirección del contrato aparece en:**
   - "at 0x1234567890..."
   - O simplemente: "0x1234567890..."

5. **Para copiar la dirección:**
   - Click en el botón de copiar (icono de copiar) junto a la dirección
   - O selecciona manualmente la dirección y copia (Ctrl+C)

6. **Guárdala en un lugar seguro:**
   - Es la dirección de tu contrato en Sepolia
   - La necesitarás para el frontend

---

## 📍 PASO 10: Verificar en Etherscan (Opcional pero Recomendado)

1. Ve a **https://sepolia.etherscan.io**
2. En la barra de búsqueda, **pega la dirección del contrato**
3. Click en buscar
4. Deberías ver:
   - El contrato desplegado
   - El hash de la transacción
   - La fecha y hora del despliegue

---

## 📍 PASO 11: Obtener el ABI (Si Aún No Lo Tienes)

1. En Remix, ve a la pestaña **"Solidity Compiler"** (arriba)
2. En el panel del compilador, busca el icono **"ABI"**
3. **Click en "ABI"**
4. Se abrirá un JSON
5. **Copia TODO el contenido** del JSON
6. Guárdalo (lo necesitarás para el frontend)

---

## ✅ Checklist Final

- [ ] Environment seleccionado: "Injected Provider - MetaMask"
- [ ] Network: Sepolia (verificado en Remix)
- [ ] Balance: Tienes Sepolia ETH suficiente
- [ ] Contrato seleccionado: BridgeFastWithdraw
- [ ] Transacción confirmada en MetaMask
- [ ] Despliegue completado: "Transaction mined and execution succeed"
- [ ] Dirección del contrato copiada
- [ ] ABI copiado y guardado
- [ ] Verificado en Etherscan (opcional)

---

## 🆘 Troubleshooting Común

### **No aparece "Injected Provider - MetaMask"**
- Instala MetaMask
- Desbloquea MetaMask
- Refresca Remix (F5)

### **Dice "Mainnet" en lugar de "Sepolia"**
- Cambia a Sepolia en MetaMask
- Refresca Remix
- Vuelve a seleccionar "Injected Provider - MetaMask"

### **Error: "Insufficient funds"**
- Necesitas más Sepolia ETH
- Ve a un faucet: https://sepoliafaucet.com/

### **Error: "User denied transaction"**
- Rechazaste la transacción en MetaMask
- Intenta de nuevo y confirma esta vez

### **La transacción está pendiente por mucho tiempo**
- Espera más tiempo (puede tardar hasta 5 minutos)
- Verifica en Etherscan con el hash de la transacción

---

## 🎯 Siguiente Paso

Una vez que tengas:
- ✅ Dirección del contrato
- ✅ ABI guardado

**Avísame y creamos el frontend.** 🚀


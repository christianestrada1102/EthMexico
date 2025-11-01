# 🔧 Solución: Cómo Hacer Aparecer MetaMask en Remix

## ⚠️ Problema: No Aparece "Injected Provider - MetaMask"

Si no ves la opción "Injected Provider - MetaMask" en Remix, sigue estos pasos:

---

## ✅ PASO 1: Verificar que MetaMask Está Instalado

### **Verificar en Chrome/Edge:**
1. Mira la **barra de herramientas** del navegador (arriba)
2. Busca el **icono del zorro** 🦊 (MetaMask)
3. Si NO lo ves:
   - Ve a https://metamask.io/download/
   - Instala MetaMask para tu navegador
   - **Reinicia el navegador** después de instalar

### **Verificar que MetaMask Funciona:**
1. Click en el icono del zorro 🦊 en la barra de herramientas
2. MetaMask debería abrirse
3. Si te pide contraseña, ingrésala
4. Debe mostrar tu wallet

---

## ✅ PASO 2: Desbloquear MetaMask

1. **Abre MetaMask** (click en el icono 🦊)
2. Si está bloqueado:
   - Ingresa tu contraseña
   - Click en "Unlock" o "Desbloquear"
3. **DEBE estar desbloqueado** para que Remix lo detecte

---

## ✅ PASO 3: Agregar Sepolia a MetaMask (Si No La Tienes)

1. En MetaMask, arriba verás "Ethereum Mainnet"
2. Click ahí
3. Abajo verás "Show/hide test networks"
4. **Actívalo** (toggle ON)
5. Ahora deberías ver "Sepolia" en la lista
6. **Selecciona Sepolia**

**O manualmente:**
1. Click en "Add network" o "Add a network manually"
2. Llena estos datos:
   - **Network Name**: Sepolia
   - **RPC URL**: https://sepolia.infura.io/v3/YOUR-PROJECT-ID
   - O usa: https://rpc.sepolia.org
   - **Chain ID**: 11155111
   - **Currency Symbol**: ETH
   - **Block Explorer URL**: https://sepolia.etherscan.io
3. Click en "Save"

---

## ✅ PASO 4: Cerrar y Reabrir Remix

1. **Cierra completamente Remix**:
   - Cierra la pestaña del navegador
   - O cierra todas las pestañas de Remix

2. **Abre Remix de nuevo**:
   - Ve a https://remix.ethereum.org
   - Espera a que cargue completamente

---

## ✅ PASO 5: Verificar que Remix Detecta MetaMask

1. En Remix, ve a **"Deploy & Run Transactions"** (icono de cohete abajo)
2. Mira el dropdown **"Environment"**
3. **Deberías ver ahora:**
   - Remix VM (Shanghai)
   - Remix VM (Berlin)
   - JavaScript VM
   - ✅ **Injected Provider - MetaMask** ← ESTO DEBE APARECER

### **Si AÚN NO aparece:**

---

## ✅ PASO 6: Dar Permisos a Remix (Si Sigue Sin Aparecer)

### **Opción A: Permitir que MetaMask se Conecte**
1. Abre MetaMask
2. Click en los **3 puntos** (menú) → **Settings** (Configuración)
3. Ve a **"Connections"** o **"Connected Sites"**
4. Busca si Remix está en la lista de sitios bloqueados
5. Si está bloqueado, elimínalo o permítelo

### **Opción B: Conectar Manualmente**
1. En Remix, en "Deploy & Run Transactions"
2. A veces aparece un botón que dice **"Connect to MetaMask"**
3. O busca un link que diga "Connect to wallet"
4. Click ahí

---

## ✅ PASO 7: Verificar Configuración del Navegador

### **Chrome/Edge:**
1. Ve a `chrome://extensions/` o `edge://extensions/`
2. Busca MetaMask
3. Verifica que esté **activado** (toggle ON)
4. Verifica que tenga permisos para acceder a sitios web

### **Firefox:**
1. Ve a `about:addons`
2. Busca MetaMask
3. Verifica que esté **activado**

---

## ✅ PASO 8: Método Alternativo - Usar WalletConnect (Si Nada Funciona)

Si después de todo esto NO aparece "Injected Provider - MetaMask":

1. En Remix, busca si hay una opción **"WalletConnect"**
2. Si la hay:
   - Selecciónala
   - Se abrirá un código QR
   - En MetaMask, ve a Settings → WalletConnect
   - Escanea el código
   - Se conectará

**Pero esto es más complicado. Primero intenta los pasos anteriores.**

---

## 🔍 Verificación Final

Después de seguir los pasos, verifica:

1. ✅ MetaMask instalado y funcionando
2. ✅ MetaMask desbloqueado
3. ✅ Sepolia agregada en MetaMask
4. ✅ Remix cerrado y reabierto
5. ✅ En Remix: "Deploy & Run Transactions" abierto

**Ahora deberías ver "Injected Provider - MetaMask" en el dropdown de Environment.**

---

## 📸 Qué Deberías Ver Exactamente

En Remix, en "Deploy & Run Transactions", el dropdown debería verse así:

```
┌─────────────────────────────────────┐
│ Environment: ▼                      │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Remix VM (Shanghai)         │   │
│  │ Remix VM (Berlin)           │   │
│  │ JavaScript VM               │   │
│  │ ─────────────────────────   │   │
│  │ ✅ Injected Provider        │   │
│  │    - MetaMask              │   │  ← ESTA OPCIÓN
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

O a veces aparece como:
- "Injected Provider - MetaMask"
- "MetaMask"
- "Injected Web3"

**Cualquiera de estas opciones es válida.**

---

## 🆘 Si NADA Funciona

### **Último Recurso:**
1. **Desinstala y reinstala MetaMask**
   - Exporta tu wallet primero (Settings → Security → Reveal Seed Phrase)
   - Guarda el seed phrase en un lugar SEGURO
   - Desinstala MetaMask
   - Reinstala MetaMask
   - Importa tu wallet con el seed phrase

2. **Prueba otro navegador**
   - Si usas Chrome, prueba Edge
   - Si usas Firefox, prueba Chrome
   - A veces los navegadores tienen problemas de permisos

3. **Actualiza el navegador**
   - Asegúrate de tener la versión más reciente

---

## ✅ Cuando Aparezca la Opción

Una vez que veas "Injected Provider - MetaMask":

1. **Selecciónala**
2. MetaMask se abrirá automáticamente
3. Click en "Connect" o "Conectar"
4. En Remix verás tu dirección y balance

**Ahora puedes continuar con el despliegue.**

---

¿Ya viste la opción? Si sigues teniendo problemas, dime exactamente qué ves en el dropdown de "Environment" y te ayudo más específicamente.


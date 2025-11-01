# 🔄 Cómo Cambiar de Remix VM a MetaMask en Remix

## 🎯 Tu Situación Actual

Estás viendo:
- **Environment**: "Remix VM (Prague)" ← Está seleccionado
- Necesitas cambiar a: "Injected Provider - MetaMask"

---

## ✅ PASO 1: Asegúrate de que MetaMask Está Listo

### **1.1 Abre MetaMask:**
1. Busca el **icono del zorro 🦊** en la barra de herramientas de tu navegador
2. **Click en el icono**
3. MetaMask debe abrirse

### **1.2 Verifica que MetaMask Está Desbloqueado:**
- Si te pide contraseña, **ingrésala y desbloquéalo**
- MetaMask debe estar **completamente abierto y funcionando**

### **1.3 Verifica que Estás en Sepolia:**
1. En MetaMask, arriba dice la red (ej: "Ethereum Mainnet")
2. **Click ahí**
3. Selecciona **"Sepolia"** (si no la tienes, agrega la red Sepolia)
4. **Debe decir "Sepolia" arriba en MetaMask**

---

## ✅ PASO 2: Refrescar Remix COMPLETAMENTE

**IMPORTANTE:** Remix necesita detectar MetaMask. Para eso:

### **Opción A: Refrescar la Página**
1. En Remix, presiona **F5** (o Ctrl+R / Cmd+R)
2. **Espera a que Remix cargue completamente**
3. Ve a "Deploy & Run Transactions" de nuevo

### **Opción B: Cerrar y Abrir de Nuevo (Recomendado)**
1. **Cierra la pestaña** de Remix completamente
2. **Abre una nueva pestaña**
3. Ve a **https://remix.ethereum.org**
4. Espera a que cargue
5. Abre tu contrato de nuevo (si no se guardó, cópialo de nuevo)
6. Ve a "Deploy & Run Transactions"

---

## ✅ PASO 3: Cambiar el Environment

Después de refrescar:

1. En Remix, ve a **"Deploy & Run Transactions"** (icono de cohete abajo a la izquierda)

2. Busca el dropdown que dice **"Environment"**

3. **Click en el dropdown** (donde dice "Remix VM (Prague)")

4. **Ahora deberías ver una lista con opciones:**
   ```
   Remix VM (Prague)          ← Lo que tienes ahora
   Remix VM (Shanghai)
   Remix VM (Berlin)
   JavaScript VM
   ────────────────────
   Injected Provider - MetaMask  ← ESTA DEBE APARECER AHORA
   ```

5. **Click en "Injected Provider - MetaMask"**

---

## ⚠️ Si AÚN No Aparece "Injected Provider - MetaMask"

### **Solución 1: Verificar que MetaMask Está Instalado Correctamente**

1. En tu navegador, ve a:
   - **Chrome/Edge**: `chrome://extensions/` o `edge://extensions/`
   - **Firefox**: `about:addons`

2. Busca **MetaMask** en la lista

3. Verifica que:
   - ✅ Está **activado** (toggle ON)
   - ✅ Tiene permisos para acceder a sitios web

4. Si no está activado, **actívalo**

5. **Refresca Remix** (F5) y vuelve a intentar

---

### **Solución 2: Permitir que Remix Acceda a MetaMask**

1. **Abre MetaMask**
2. Click en los **3 puntos** (menú) arriba a la derecha
3. Ve a **"Settings"** (Configuración)
4. Busca **"Connections"** o **"Connected Sites"**
5. Busca si Remix está bloqueado
6. Si está bloqueado, elimínalo de la lista

---

### **Solución 3: Usar Otro Navegador**

A veces algunos navegadores tienen problemas:

1. Prueba con:
   - **Chrome** (si usas Edge)
   - **Edge** (si usas Chrome)
   - **Firefox**

2. **Instala MetaMask** en ese navegador
3. Abre Remix en ese navegador
4. Debería aparecer la opción

---

### **Solución 4: Forzar la Detección**

1. En Remix, en "Deploy & Run Transactions"
2. A veces aparece un botón o link que dice:
   - "Connect to Wallet"
   - "Connect to MetaMask"
   - "Enable MetaMask"

3. **Click en ese botón** si lo ves

---

## 🔍 Verificación Paso a Paso (Hazlo en Este Orden)

Sigue estos pasos **exactamente en este orden**:

### **Checklist:**
- [ ] **1.** MetaMask está abierto y desbloqueado (click en el icono 🦊 y verifica)
- [ ] **2.** MetaMask muestra "Sepolia" como red (arriba en MetaMask)
- [ ] **3.** Cierras Remix completamente (cierra la pestaña)
- [ ] **4.** Abres Remix de nuevo (https://remix.ethereum.org)
- [ ] **5.** Esperas a que cargue completamente
- [ ] **6.** Abres tu contrato (si no se guardó, cópialo)
- [ ] **7.** Vas a "Deploy & Run Transactions"
- [ ] **8.** Click en el dropdown "Environment"
- [ ] **9.** Buscas "Injected Provider - MetaMask"

**Si después de estos 9 pasos NO aparece, entonces hay un problema con MetaMask o el navegador.**

---

## 📸 Qué Deberías Ver Después de Refrescar

Cuando hagas click en el dropdown "Environment", deberías ver:

```
┌────────────────────────────────────┐
│ Remix VM (Prague)                  │
│ Remix VM (Shanghai)                │
│ Remix VM (Berlin)                  │
│ JavaScript VM                      │
│ ───────────────────────────────    │
│ ✅ Injected Provider               │
│    - MetaMask                     │  ← ESTA LÍNEA
└────────────────────────────────────┘
```

O a veces aparece como:
- "Injected Provider - MetaMask"
- "MetaMask"
- "Injected Web3"

**Cualquiera de estas es la opción correcta.**

---

## 🆘 Si NADA Funciona

### **Último Recurso - Método Manual:**

1. Ve a la **consola del navegador** (F12)
2. En la pestaña "Console", escribe:
   ```javascript
   window.ethereum
   ```
3. Presiona Enter
4. Si aparece algo como `{isMetaMask: true, ...}` → MetaMask está instalado
5. Si aparece `undefined` → MetaMask NO está instalado correctamente

**Si aparece `undefined`:**
- Reinstala MetaMask
- O instala MetaMask en otro navegador

---

## ✅ Cuando Veas la Opción

Una vez que veas "Injected Provider - MetaMask":

1. **Selecciónala**
2. MetaMask se abrirá automáticamente
3. Click en **"Connect"** o **"Conectar"**
4. Ahora en Remix verás:
   - **Network**: Sepolia
   - **Account**: Tu dirección (0x...)
   - **Balance**: Tu balance en Sepolia ETH

**Ahora puedes desplegar el contrato.**

---

**Prueba primero cerrar Remix completamente y abrirlo de nuevo. Eso suele solucionarlo.**

¿Qué ves exactamente cuando haces click en el dropdown "Environment"? ¿Solo ves las opciones de Remix VM o también ves otras opciones?


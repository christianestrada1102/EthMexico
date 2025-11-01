# 🔍 Diagnóstico: Por Qué No Aparece MetaMask en Remix

## 🎯 Problema: No Puedes Cambiar a MetaMask

Veo que tienes "Remix VM (Prague)" seleccionado, pero no aparece la opción de MetaMask en el dropdown.

---

## ✅ PASO 1: Verificar que MetaMask Está Instalado

### **A. Busca el Icono de MetaMask:**
1. Mira la **barra de herramientas superior** de tu navegador
2. Busca el **icono del zorro 🦊** (MetaMask)
3. **¿Lo ves?** 
   - ✅ **SÍ** → Continúa al Paso 2
   - ❌ **NO** → Instala MetaMask primero:
     - Ve a https://metamask.io/download/
     - Instala para tu navegador (Chrome/Edge/Firefox)
     - **Reinicia el navegador completamente**
     - Luego vuelve a Remix

---

## ✅ PASO 2: Abrir MetaMask y Desbloquearlo

1. **Click en el icono del zorro 🦊** en la barra de herramientas
2. MetaMask debería abrirse en una ventana
3. **¿Qué ves?**
   - ✅ Si ves tu wallet y balance → MetaMask está desbloqueado, continúa al Paso 3
   - ❌ Si te pide contraseña → **Ingresa tu contraseña y desbloquéalo**

**IMPORTANTE:** MetaMask DEBE estar desbloqueado para que Remix lo detecte.

---

## ✅ PASO 3: Verificar que Estás en Sepolia

1. Con MetaMask abierto, mira **arriba** en MetaMask
2. **¿Qué dice?**
   - Si dice "Ethereum Mainnet" → Cambia a Sepolia:
     - Click donde dice "Ethereum Mainnet"
     - Selecciona "Sepolia" (si no la ves, activa "Show test networks")
   - Si dice "Sepolia" → Perfecto, continúa

---

## ✅ PASO 4: Refrescar Remix COMPLETAMENTE

**Esto es CRÍTICO:** Remix solo detecta MetaMask cuando se carga la página.

### **Método 1: Refrescar Forzado**
1. En Remix, presiona **Ctrl + Shift + R** (o **Cmd + Shift + R** en Mac)
   - Esto hace un "hard refresh" que limpia la caché
2. O presiona **F5** si Ctrl+Shift+R no funciona

### **Método 2: Cerrar y Abrir (MEJOR)**
1. **Cierra completamente** la pestaña de Remix
2. Si tienes otros tabs de Remix abiertos, ciérralos todos
3. **Cierra el navegador completamente** (todas las ventanas)
4. **Abre el navegador de nuevo**
5. Ve a **https://remix.ethereum.org**
6. Espera a que cargue completamente
7. Abre tu contrato de nuevo

---

## ✅ PASO 5: Verificar Permisos del Navegador

### **En Chrome/Edge:**
1. Ve a `chrome://extensions/` (o `edge://extensions/`)
2. Busca **MetaMask**
3. Verifica:
   - ✅ Está **activado** (toggle ON)
   - ✅ Tiene permisos para "Access all sites" o similar

### **En Firefox:**
1. Ve a `about:addons`
2. Busca **MetaMask**
3. Verifica que esté activado

---

## ✅ PASO 6: Probar la Consola del Navegador

Esto nos dirá si el navegador detecta MetaMask:

1. En Remix, presiona **F12** (abre las herramientas de desarrollador)
2. Ve a la pestaña **"Console"**
3. Escribe exactamente esto:
   ```javascript
   window.ethereum
   ```
4. Presiona **Enter**
5. **¿Qué aparece?**
   - Si aparece algo como `{isMetaMask: true, ...}` → ✅ MetaMask está instalado y detectado
   - Si aparece `undefined` → ❌ El navegador NO detecta MetaMask

---

## 🔧 Soluciones Según el Resultado

### **Si `window.ethereum` muestra MetaMask pero NO aparece en Remix:**

1. **Cierra completamente Remix** (cierra el navegador)
2. **Cierra MetaMask** (cierra todas las ventanas de MetaMask)
3. **Abre MetaMask de nuevo** y desbloquéalo
4. **Abre Remix de nuevo**
5. Ve a "Deploy & Run Transactions"
6. Click en el dropdown "Environment"
7. **Ahora debería aparecer**

### **Si `window.ethereum` es `undefined`:**

**MetaMask NO está instalado correctamente o el navegador no lo detecta.**

1. **Reinstala MetaMask:**
   - Desinstala MetaMask completamente
   - Reinicia el navegador
   - Instala MetaMask de nuevo desde https://metamask.io/download/
   - Importa tu wallet con el seed phrase (si tienes uno)

2. **O prueba otro navegador:**
   - Si usas Chrome, prueba Edge
   - Si usas Edge, prueba Chrome
   - Instala MetaMask en ese navegador

---

## 🎯 Método Alternativo: Conectar Manualmente

A veces Remix tiene un botón para conectar manualmente:

1. En "Deploy & Run Transactions", busca:
   - Un botón que dice "Connect to Wallet"
   - O un link "Enable MetaMask"
   - O iconos de wallet arriba

2. **Si ves algo así, click en eso**

---

## 📝 Verificación Final

Después de seguir todos los pasos:

1. MetaMask está abierto y desbloqueado ✅
2. Estás en Sepolia en MetaMask ✅
3. Cerraste y abriste Remix completamente ✅
4. En "Deploy & Run Transactions", click en "Environment" dropdown
5. **¿Qué opciones ves ahora?**

**Deberías ver:**
- Remix VM (Prague)
- Remix VM (Shanghai)
- Remix VM (Berlin)
- JavaScript VM
- **Injected Provider - MetaMask** ← ESTA DEBE APARECER

---

## 🆘 Si AÚN No Funciona

### **Última Solución:**
1. **Desinstala MetaMask completamente**
2. **Limpia la caché del navegador:**
   - Chrome/Edge: Ctrl + Shift + Delete → Selecciona "Cached images and files" → Clear
3. **Reinicia el navegador**
4. **Instala MetaMask de nuevo**
5. **Abre Remix en una ventana de incógnito/privada:**
   - Chrome: Ctrl + Shift + N
   - Edge: Ctrl + Shift + P
   - Firefox: Ctrl + Shift + P
6. En la ventana incógnito, instala MetaMask temporalmente
7. Ve a Remix
8. **Ahora debería aparecer la opción**

---

## ✅ Qué Hacer Cuando Aparezca

Cuando finalmente veas "Injected Provider - MetaMask":

1. **Selecciónala**
2. MetaMask se abrirá automáticamente
3. Click en **"Connect"**
4. Ahora en Remix verás:
   - Network: Sepolia
   - Account: Tu dirección
   - Balance: Tu balance

---

**Empieza por:**
1. ✅ Verificar que MetaMask está instalado (icono 🦊 visible)
2. ✅ Abrir MetaMask y desbloquearlo
3. ✅ Cerrar COMPLETAMENTE Remix y el navegador
4. ✅ Abrir todo de nuevo

**¿Puedes confirmar que tienes el icono de MetaMask 🦊 en tu navegador?**


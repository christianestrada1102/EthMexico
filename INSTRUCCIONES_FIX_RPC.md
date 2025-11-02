# 🔧 Solución: Error "Failed to fetch" en Arbitrum Sepolia

## ⚠️ Problema
El error "Failed to fetch" indica que MetaMask no puede conectarse al RPC de Arbitrum Sepolia.

## ✅ Solución: Actualizar Red en MetaMask Manualmente

### Paso 1: Abre MetaMask
1. Click en el icono de MetaMask en tu navegador
2. Asegúrate de estar desbloqueado

### Paso 2: Ve a Configuración de Red
1. Click en el nombre de la red (arriba del todo, donde dice "Arbitrum Sepolia" o "Ethereum Mainnet")
2. Busca "Arbitrum Sepolia" en la lista
3. Si NO la ves, ve al Paso 3
4. Si SÍ la ves, click en los 3 puntos (...) al lado
5. Click en "Editar red" o "Edit network"

### Paso 3: Agregar/Editar Arbitrum Sepolia
Si no tienes la red, agrégalo así:
1. En la lista de redes, scroll hasta abajo
2. Click en "Agregar red" o "Add network"
3. Click en "Agregar red manualmente" o "Add a network manually"

### Paso 4: Configuración Correcta
Ingresa estos datos EXACTOS:

**Network Name:**
```
Arbitrum Sepolia
```

**New RPC URL:**
```
https://arbitrum-sepolia.blockpi.network/v1/rpc/public
```
(O usa esta alternativa si la primera no funciona: `https://arbitrum-sepolia-rpc.publicnode.com`)

**Chain ID:**
```
421614
```

**Currency Symbol:**
```
ETH
```

**Block Explorer URL (opcional pero recomendado):**
```
https://sepolia-explorer.arbitrum.io
```

### Paso 5: Guardar
1. Click en "Guardar" o "Save"
2. MetaMask debería cambiar automáticamente a Arbitrum Sepolia

### Paso 6: Verificar
1. Verifica que arriba diga "Arbitrum Sepolia"
2. Verifica que tengas ETH de Arbitrum Sepolia (necesitas para pagar gas)
3. Intenta la transacción de nuevo

## 🚨 Si Sigue Sin Funcionar

### Opción A: Cambiar RPC Manualmente
1. Abre MetaMask
2. Ve a Settings (Configuración) → Networks (Redes)
3. Busca "Arbitrum Sepolia"
4. Click en "Edit"
5. Cambia el "RPC URL" por uno de estos:
   - `https://arbitrum-sepolia.blockpi.network/v1/rpc/public`
   - `https://arbitrum-sepolia-rpc.publicnode.com`
   - `https://sepolia-rollup.arbitrum.io/rpc`
6. Guarda y prueba de nuevo

### Opción B: Eliminar y Reagregar la Red
1. En MetaMask → Settings → Networks
2. Busca "Arbitrum Sepolia"
3. Click en "Delete" o "Eliminar"
4. Sigue los pasos 3-5 de arriba para agregarla de nuevo

### Opción C: Usar ChainList
1. Ve a https://chainlist.org
2. Busca "Arbitrum Sepolia"
3. Click en "Connect Wallet"
4. MetaMask se abrirá y preguntará si quieres agregar la red
5. Click en "Approve" o "Aprobar"

## 💡 Verificar que Funciona
- Debes ver "Arbitrum Sepolia" en MetaMask
- Debes tener un balance de ETH (puede ser 0, pero debe aparecer)
- El Block Explorer debe abrir cuando clickeas en transacciones

## 🌐 Obtener ETH de Arbitrum Sepolia
Si no tienes ETH para pagar gas:
- https://faucet.quicknode.com/arbitrum/sepolia
- https://www.alchemy.com/faucets/arbitrum-sepolia


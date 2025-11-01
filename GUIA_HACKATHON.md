# 🏆 Guía de Testing y Demo para Hackathon

## 🎯 Objetivo de la Demo

Demostrar el sistema de retiros rápidos (Fast Withdraw) que reduce el tiempo de espera de 7 días a **inmediato** mediante proveedores de liquidez.

---

## ⚡ Demo Rápida (5 minutos)

### **Setup Inicial**

1. **Abrir Remix**
   - Ve a https://remix.ethereum.org
   - Selecciona "Solidity" en el entorno
   - Compila con Solidity 0.8.20+

2. **Desplegar Contrato**
   - Selecciona "Remix VM (Shanghai)" como entorno
   - Clic en "Deploy"
   - ✅ Espera a ver "Transaction mined and execution succeed"
   - 📝 Copia el Contract Address

3. **Configurar para Testing Rápido**
   ```
   Función: setTestChallengePeriod
   Parámetro: 120
   ```
   Esto establece el challenge period a 2 minutos (en lugar de 7 días).

---

## 🎬 Flujo Completo de Demo

### **PASO 1: Preparar el LP (Proveedor de Liquidez)**

**Cuenta**: Selecciona Account #2 (o cualquier cuenta que no sea la del usuario)

**1.1. Depositar Bond**
```
Función: depositBond
VALUE: 0.1 (selecciona "ether")
Clic: "transact"
```
✅ **Resultado**: El LP ahora puede proveer liquidez
- Verifica: `lpBonds` → Debe mostrar 100000000000000000 (0.1 ETH en wei)

**1.2. Verificar Estado**
```
Función: canProvideLiquidity
Parámetro: [dirección de Account #2]
Clic: "call"
```
✅ **Resultado**: Debe retornar `true`

---

### **PASO 2: Usuario Solicita Retiro**

**Cuenta**: Selecciona Account #1 (usuario)

**2.1. Solicitar Retiro**
```
Función: requestWithdrawal
VALUE: 1 (selecciona "ether")
Clic: "transact"
```
✅ **Resultado**: 
- Se crea la solicitud con ID 0
- El ETH queda lockeado en el contrato
- Se emite evento `WithdrawalRequested`

**2.2. Ver Detalles de la Solicitud**
```
Función: getWithdrawal
Parámetro: 0
Clic: "call"
```
✅ **Resultado**: Verás:
- `user`: Dirección de Account #1
- `amount`: 1000000000000000000 (1 ETH)
- `isAdvanced`: false
- `isFinalized`: false
- `liquidityProvider`: 0x0000... (ninguno aún)

**2.3. Verificar Balance del Contrato**
```
Función: getContractBalance
Clic: "call"
```
✅ **Resultado**: Debe mostrar 1000000000000000000 (1 ETH)

**2.4. Calcular la Comisión**
```
Función: calculateFee
Parámetro: 1000000000000000000 (1 ETH en wei)
Clic: "call"
```
✅ **Resultado**: 10000000000000000 (0.01 ETH = 1% de 1 ETH)

---

### **PASO 3: LP Proporciona Liquidez (Fast Withdraw)**

**Cuenta**: Cambiar a Account #2 (LP)

**3.1. Proporcionar Liquidez**
```
Función: provideLiquidity
Parámetro: 0 (requestId)
VALUE: 1 (selecciona "ether")
Clic: "transact"
```
✅ **Resultado**:
- El usuario (Account #1) recibe **0.99 ETH INMEDIATAMENTE** ⚡
- Se emite evento `LiquidityProvided`
- La solicitud se marca como `isAdvanced: true`

**3.2. Verificar Balance del Usuario**
- Cambiar a Account #1
- Ver balance en Remix (en la barra superior)
- ✅ Debe mostrar **0.99 ETH más** que antes

**3.3. Verificar Estado Actualizado**
```
Función: getWithdrawal
Parámetro: 0
Clic: "call"
```
✅ **Resultado**:
- `isAdvanced`: true ✅
- `liquidityProvider`: Dirección de Account #2
- `fee`: 10000000000000000 (0.01 ETH)

**3.4. Ver Balance del Contrato**
```
Función: getContractBalance
Clic: "call"
```
✅ **Resultado**: Debe mostrar **2 ETH** (1 del usuario original + 1 del LP)

---

### **PASO 4: Esperar Challenge Period**

**Para la Demo**: Espera 2 minutos (o ajusta el periodo antes)

**Opcional - Ver Tiempo Restante**:
```
Función: getTimeRemaining
Parámetro: 0
Clic: "call"
```
✅ **Resultado**: Segundos restantes hasta que se pueda finalizar

**Alternativa Rápida** (para demo en vivo):
```
Función: setTestChallengePeriod
Parámetro: 60 (1 minuto)
```
Esto reduce el tiempo a 1 minuto si ya configuraste 2 minutos antes.

---

### **PASO 5: Finalizar el Retiro**

**Cuenta**: Cualquier cuenta puede llamar esta función

**5.1. Finalizar**
```
Función: finalizeWithdrawal
Parámetro: 0 (requestId)
Clic: "transact"
```
⚠️ **Si falla**: Verifica que haya pasado el challenge period
- Revisa `getTimeRemaining(0)` → Debe ser 0

✅ **Resultado**:
- El LP (Account #2) recibe **1.01 ETH** (1 ETH capital + 0.01 ETH comisión)
- Se emite evento `WithdrawalFinalized`
- La solicitud se marca como `isFinalized: true`

**5.2. Verificar Balance del LP**
- Cambiar a Account #2
- ✅ El balance debe mostrar **+0.01 ETH** de ganancia (comisión)

**5.3. Verificar Estado Final**
```
Función: getWithdrawal
Parámetro: 0
Clic: "call"
```
✅ **Resultado**:
- `isFinalized`: true ✅
- Todo el proceso completado

**5.4. Ver Balance Final del Contrato**
```
Función: getContractBalance
Clic: "call"
```
✅ **Resultado**: Debe ser menor que 2 ETH (se retiraron 1.01 ETH al LP)

---

## 📊 Resumen del Flujo para Presentación

```
┌─────────────────────────────────────────────────────────┐
│           DEMO: FAST WITHDRAW SYSTEM                    │
└─────────────────────────────────────────────────────────┘

1. LP Deposita Bond
   └─> 0.1 ETH depositado ✅

2. Usuario Solicita Retiro
   └─> 1 ETH lockeado en contrato
   └─> Tiempo normal: 7 DÍAS de espera ⏳

3. LP Proporciona Liquidez
   └─> Usuario recibe 0.99 ETH INMEDIATAMENTE ⚡
   └─> Fast Withdraw funcionando!

4. Después del Challenge Period (2 min en demo)
   └─> LP recibe 1.01 ETH (capital + 0.01 ETH comisión)
   └─> Sistema completo ✅

RESULTADO:
✅ Usuario: Retiro instantáneo (en lugar de 7 días)
✅ LP: Gana 1% de comisión por proporcionar liquidez
✅ Sistema: Funciona de forma segura con bonds y validaciones
```

---

## 🎤 Script de Presentación

### **Introducción (30 segundos)**
> "Hoy voy a demostrar un sistema de retiros rápidos para puentes L2→L1. El problema que resuelve es que los usuarios normalmente esperan 7 días para retirar fondos. Nuestro sistema permite retiros instantáneos mediante proveedores de liquidez."

### **Demo Paso a Paso (3 minutos)**

**1. Setup (30 seg)**
> "Primero, configuro el sistema con un challenge period de 2 minutos para la demo."

**2. LP Setup (30 seg)**
> "El proveedor de liquidez deposita un bond de 0.1 ETH. Esto garantiza que actúe honestamente."

**3. Usuario Solicita (30 seg)**
> "Un usuario solicita retirar 1 ETH. Normalmente esperaría 7 días, pero..."

**4. Fast Withdraw (1 min)**
> "Un LP adelanta los fondos inmediatamente. El usuario recibe 0.99 ETH al instante, pagando solo una comisión del 1%. Esto es el fast withdraw en acción."

**5. Finalización (30 seg)**
> "Después de 2 minutos (simulando los 7 días del challenge period), el LP recupera su capital más la comisión de 0.01 ETH."

### **Conclusión (30 seg)**
> "Este sistema reduce el tiempo de espera de 7 días a instantáneo, beneficiando tanto a usuarios como a proveedores de liquidez. La seguridad está garantizada mediante bonds y validaciones de estado."

---

## 🐛 Troubleshooting para la Demo

### **Error: "Insufficient bond"**
- **Causa**: El LP no depositó bond
- **Solución**: Llamar `depositBond()` con 0.1 ETH primero

### **Error: "Challenge period not ended yet"**
- **Causa**: Intentaste finalizar muy pronto
- **Solución**: Espera o reduce el periodo con `setTestChallengePeriod(60)`

### **Error: "Already advanced"**
- **Causa**: Intentaste proveer liquidez dos veces
- **Solución**: Usa un nuevo `requestId` o crea una nueva solicitud

### **Error: "Request does not exist"**
- **Causa**: `requestId` incorrecto
- **Solución**: Verifica con `getWithdrawal(requestId)` o crea una nueva solicitud

---

## 📸 Screenshots Recomendados

1. **Contrato Desplegado**: Muestra el Contract Address
2. **Solicitud Creada**: Muestra `getWithdrawal(0)` antes de adelantar
3. **Liquidez Proporcionada**: Muestra el evento `LiquidityProvided`
4. **Estado Final**: Muestra `getWithdrawal(0)` con `isFinalized: true`
5. **Balances**: Muestra balances de usuario y LP

---

## 🎯 Puntos Clave para Destacar

✅ **Velocidad**: Retiros instantáneos vs 7 días
✅ **Seguridad**: Sistema de bonds y validaciones
✅ **Economía**: Los LPs ganan comisiones por proporcionar liquidez
✅ **Escalabilidad**: Múltiples LPs pueden participar
✅ **Transparencia**: Todos los eventos están on-chain

---

## ⚙️ Configuración Óptima para Demo

```solidity
// Al inicio de la demo, ejecutar:
setTestChallengePeriod(60)     // 1 minuto para demo rápida
setFeePercentage(100)          // 1% de comisión (por defecto)
minimumBond = 0.1 ether        // Bond mínimo (por defecto)
```

---

Esta guía te permitirá hacer una demo exitosa del sistema en el hackathon. ¡Buena suerte! 🚀


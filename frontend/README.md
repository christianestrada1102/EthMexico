# BridgeFastWithdraw - Frontend

Frontend Next.js para el sistema de retiros rápidos BridgeFastWithdraw desplegado en Sepolia.

## 🚀 Cómo Ejecutar el Proyecto

### Prerrequisitos

- Node.js 18+ instalado
- MetaMask instalado en tu navegador (para usar la red real)
- Sepolia ETH en tu wallet (para realizar transacciones)

### Instalación

1. **Navega a la carpeta del frontend:**
   ```bash
   cd frontend
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```
   o
   ```bash
   yarn install
   ```

3. **Ejecuta el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   o
   ```bash
   yarn dev
   ```

4. **Abre tu navegador:**
   - Ve a `http://localhost:3000`
   - El proyecto debería estar corriendo

## 📁 Estructura del Proyecto

```
frontend/
├── app/                      # Next.js App Router
│   ├── page.tsx             # Página de inicio
│   ├── dashboard/           # Dashboard principal
│   │   └── page.tsx
│   ├── config/              # Configuración
│   │   └── page.tsx
│   ├── layout.tsx           # Layout principal
│   └── globals.css          # Estilos globales
├── components/              # Componentes React
│   ├── WalletModal.tsx      # Modal para conectar wallet
│   ├── WalletCard.tsx       # Tarjeta de wallet
│   ├── RequestWithdrawalModal.tsx  # Modal para solicitar retiro
│   └── Toasts.tsx           # Sistema de notificaciones
├── lib/                     # Utilidades y helpers
│   ├── constants.ts         # Constantes (dirección del contrato, ABI)
│   ├── wallet.ts            # Funciones de wallet (MetaMask, demo)
│   └── contract.ts          # Funciones de interacción con el contrato
├── store/                   # Estado global (Zustand)
│   └── walletStore.ts       # Store del wallet y estado de la app
└── package.json             # Dependencias del proyecto
```

## 🔧 Configuración del Contrato

El contrato está configurado en `lib/constants.ts`:

- **CONTRACT_ADDRESS**: Dirección del contrato desplegado en Sepolia
- **CONTRACT_ABI**: ABI completo del contrato
- **SEPOLIA_CHAIN_ID**: ID de la red Sepolia

## 🌐 Flujo de MetaMask

1. **Detección**: La app detecta si MetaMask está instalado
2. **Conexión**: Al hacer click en "Conectar MetaMask", se solicita acceso a la cuenta
3. **Red**: Verifica que estés en Sepolia, si no, intenta cambiar automáticamente
4. **Estado**: Guarda la conexión en Zustand y localStorage
5. **Interacciones**: Todas las llamadas al contrato usan el signer de MetaMask

## 🎨 Características

- ✅ Conexión con MetaMask (red real)
- ✅ Wallet demo para testing sin MetaMask
- ✅ Solicitud de retiros
- ✅ Interfaz moderna con glassmorphism
- ✅ Tema claro/oscuro
- ✅ Notificaciones toast
- ✅ Responsive design
- ✅ Todo en español

## 🔐 Seguridad

- Las claves privadas nunca se almacenan
- Para wallets demo, solo se guarda la dirección (no la clave privada)
- Las transacciones reales requieren confirmación en MetaMask
- El contrato está desplegado en Sepolia (red de prueba)

## 📝 Funciones del Contrato Disponibles

- `requestWithdrawal()` - Solicitar un retiro rápido
- `provideLiquidity()` - Proporcionar liquidez (como LP)
- `finalizeWithdrawal()` - Finalizar un retiro después del challenge period
- `depositBond()` - Depositar bond (como LP)
- `withdrawBond()` - Retirar bond (como LP)
- `getWithdrawal()` - Obtener detalles de una solicitud
- `calculateFee()` - Calcular la comisión

## 🐛 Troubleshooting

### MetaMask no se conecta
- Asegúrate de tener MetaMask instalado
- Verifica que MetaMask esté desbloqueado
- Refresca la página

### Error de red
- Verifica que estés en Sepolia en MetaMask
- La app intentará cambiar automáticamente a Sepolia si es necesario

### Las transacciones fallan
- Verifica que tengas Sepolia ETH suficiente para gas
- Revisa que el contrato esté desplegado en la dirección correcta

## 📚 Tecnologías Utilizadas

- **Next.js 14** - Framework React
- **TypeScript** - Tipado estático
- **TailwindCSS** - Estilos
- **Framer Motion** - Animaciones
- **ethers.js v6** - Interacción con blockchain
- **Zustand** - Gestión de estado
- **Lucide React** - Iconos

## 🚀 Próximos Pasos

- [ ] Agregar función completa de proveer liquidez
- [ ] Agregar función de finalizar retiros
- [ ] Lista de solicitudes disponibles
- [ ] Historial de transacciones completo
- [ ] Verificación de bonds para LPs

---

**Desarrollado para el Hackathon de Arbitrum Stylus** 🚀


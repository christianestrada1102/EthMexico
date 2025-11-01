# 🚀 Guía de Deploy en Vercel

## 📋 Opción 1: Deploy desde la Web de Vercel (MÁS FÁCIL)

### Paso 1: Preparar el Repositorio

1. **Sube el código a GitHub** (opcional pero recomendado):
   - Crea un repositorio en GitHub
   - Sube la carpeta `frontend` al repositorio
   - O simplemente sube todo el proyecto

### Paso 2: Deploy en Vercel

1. **Ve a Vercel:**
   - Abre https://vercel.com
   - Inicia sesión con GitHub (o crea una cuenta)

2. **Nuevo Proyecto:**
   - Click en **"Add New Project"** o **"New Project"**
   - Si conectaste GitHub, selecciona tu repositorio
   - O usa **"Import Git Repository"**

3. **Configuración del Proyecto:**
   - **Root Directory**: Selecciona `frontend` (si subiste todo el proyecto)
   - O simplemente selecciona la carpeta donde está el `package.json`
   - **Framework Preset**: Next.js (debería detectarlo automáticamente)
   - **Build Command**: `npm run build` (ya está configurado)
   - **Output Directory**: `.next` (por defecto)
   - **Install Command**: `npm install` (por defecto)

4. **Variables de Entorno** (opcional):
   - Por ahora no necesitas variables de entorno
   - Todo está configurado en `lib/constants.ts`

5. **Deploy:**
   - Click en **"Deploy"**
   - Espera 2-3 minutos mientras Vercel construye y despliega

6. **Listo:**
   - Cuando termine, verás una URL como: `tu-proyecto.vercel.app`
   - **Tu app está en vivo! 🎉**

---

## 📋 Opción 2: Deploy con Vercel CLI (Desde Terminal)

### Paso 1: Instalar Vercel CLI

```bash
npm install -g vercel
```

O con yarn:
```bash
yarn global add vercel
```

### Paso 2: Login en Vercel

```bash
vercel login
```

Esto abrirá tu navegador para autenticarte.

### Paso 3: Navegar a la Carpeta Frontend

```bash
cd frontend
```

### Paso 4: Deploy

```bash
vercel
```

Sigue las preguntas:
- **Set up and deploy?** → Y (Sí)
- **Which scope?** → Selecciona tu cuenta
- **Link to existing project?** → N (No, es nuevo)
- **What's your project's name?** → `bridge-fast-withdraw` (o el nombre que quieras)
- **In which directory is your code located?** → `./` (por defecto, presiona Enter)
- **Want to override settings?** → N (No)

### Paso 5: Deploy a Producción (Opcional)

Para hacer deploy a producción (no solo preview):

```bash
vercel --prod
```

---

## ✅ Verificación Post-Deploy

Después del deploy:

1. **Abre la URL** que Vercel te dio
2. **Verifica que:**
   - La página de inicio carga correctamente
   - Puedes conectar MetaMask
   - Las funciones básicas funcionan

---

## 🔧 Configuración Adicional (Si Es Necesario)

### Si Necesitas Cambiar el Contrato

Si cambias la dirección del contrato en el futuro:

1. Edita `frontend/lib/constants.ts`
2. Cambia `CONTRACT_ADDRESS`
3. Haz commit y push
4. Vercel redeployará automáticamente

### Variables de Entorno (Futuro)

Si necesitas usar variables de entorno:

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega las variables necesarias
4. Redeploy

---

## 🌐 URLs Después del Deploy

Después del deploy tendrás:

- **URL de Producción**: `tu-proyecto.vercel.app`
- **URL de Preview**: Para cada commit/PR
- **Dominio Personalizado**: Puedes agregar uno en Settings → Domains

---

## 📝 Notas Importantes

1. **MetaMask en Producción:**
   - Los usuarios necesitarán MetaMask instalado
   - Deben estar en Sepolia para usar el contrato real

2. **HTTPS:**
   - Vercel usa HTTPS automáticamente
   - MetaMask funciona perfectamente con HTTPS

3. **Redeploy Automático:**
   - Si conectas GitHub, cada push hace redeploy automático
   - Muy útil para actualizaciones

---

## 🐛 Troubleshooting

### Error: "Module not found"
- Verifica que todas las dependencias estén en `package.json`
- Vercel instalará automáticamente con `npm install`

### Error: "Build failed"
- Revisa los logs en Vercel
- Asegúrate de que el proyecto compile localmente primero

### MetaMask no se conecta en producción
- Verifica que la URL sea HTTPS (Vercel lo hace automáticamente)
- Asegúrate de que los usuarios tengan MetaMask instalado

---

**¡Tu app estará en vivo en unos minutos! 🚀**


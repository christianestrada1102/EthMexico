# 🚀 Instrucciones Rápidas para Deploy en Vercel

## ✅ Vercel CLI Instalado

Ya tienes Vercel CLI instalado. Ahora sigue estos pasos:

## 📝 Opción 1: Deploy desde Web (MÁS FÁCIL - RECOMENDADO)

### Paso a Paso:

1. **Ve a Vercel:**
   - Abre https://vercel.com
   - Inicia sesión con GitHub (o crea cuenta gratis)

2. **Click en "Add New Project"**

3. **Importa tu código:**
   - **Opción A:** Conecta GitHub y selecciona tu repositorio
   - **Opción B:** Usa "Import Git Repository" y pega la URL de GitHub
   - **Opción C:** Arrastra la carpeta `frontend` directamente (no recomendado pero funciona)

4. **Configuración:**
   - **Root Directory**: Si subiste todo el proyecto, selecciona `frontend`
   - **Framework Preset**: Next.js (auto-detectado)
   - **Build Command**: `npm run build` (ya configurado)
   - **Output Directory**: `.next` (por defecto)

5. **Deploy:**
   - Click en "Deploy"
   - Espera 2-3 minutos
   - ¡Listo! 🎉

6. **Obtén tu URL:**
   - Verás algo como: `tu-proyecto.vercel.app`
   - Esta es tu app en vivo

---

## 📝 Opción 2: Deploy desde Terminal

Si prefieres usar la terminal:

1. **Abre PowerShell en la carpeta `frontend`**

2. **Ejecuta:**
   ```powershell
   vercel login
   ```
   - Se abrirá tu navegador para autenticarte
   - Confirma en el navegador

3. **Deploy:**
   ```powershell
   vercel
   ```
   - Responde las preguntas:
     - **Set up and deploy?** → Y
     - **Which scope?** → Tu cuenta
     - **Link to existing project?** → N (es nuevo)
     - **Project name?** → `bridge-fast-withdraw` (o el que quieras)
     - **Directory?** → `./` (Enter)

4. **Deploy a Producción:**
   ```powershell
   vercel --prod
   ```

---

## 🌐 Después del Deploy

Tu app estará en:
- **URL**: `https://tu-proyecto.vercel.app`
- **HTTPS**: Automático
- **MetaMask**: Funciona perfectamente con HTTPS

---

## ✅ Recomendación

**Usa la Opción 1 (Web)** porque es más fácil y visual. Solo:
1. Ve a vercel.com
2. Conecta GitHub
3. Importa proyecto
4. Deploy

**¡Tardará menos de 5 minutos!** 🚀


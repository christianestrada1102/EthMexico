# 📝 Crear Repositorio en GitHub y Subir el Proyecto

## ✅ Paso 1: Commit Local Completado

Ya tienes el proyecto preparado con git. Ahora sigue estos pasos:

---

## 📝 Paso 2: Crear Repositorio en GitHub

### Opción A: Desde la Web de GitHub (MÁS FÁCIL)

1. **Ve a GitHub:**
   - Abre https://github.com
   - Inicia sesión o crea una cuenta

2. **Crear Nuevo Repositorio:**
   - Click en el **"+"** arriba a la derecha
   - Selecciona **"New repository"**

3. **Configurar el Repositorio:**
   - **Repository name**: `EthMexico`
   - **Description**: "BridgeFastWithdraw - Sistema de retiros rápidos L2→L1"
   - **Visibility**: Public o Private (como prefieras)
   - ⚠️ **NO marques** "Initialize this repository with a README"
   - ⚠️ **NO marques** "Add .gitignore" (ya lo tenemos)
   - ⚠️ **NO marques** "Choose a license" (por ahora)

4. **Click en "Create repository"**

5. **GitHub te mostrará instrucciones**. **COPIA la URL del repositorio**:
   - Será algo como: `https://github.com/tu-usuario/EthMexico.git`

---

## 📝 Paso 3: Conectar y Subir el Código

Después de crear el repositorio en GitHub, ejecuta estos comandos en PowerShell:

### 1. Agregar el Remote (reemplaza con tu URL):

```powershell
git remote add origin https://github.com/TU-USUARIO/EthMexico.git
```

### 2. Renombrar branch a main (si es necesario):

```powershell
git branch -M main
```

### 3. Subir el código:

```powershell
git push -u origin main
```

---

## ✅ Paso 4: Verificar

1. Ve a tu repositorio en GitHub: `https://github.com/tu-usuario/EthMexico`
2. Deberías ver todos los archivos del proyecto
3. ✅ **¡Listo!**

---

## 🚀 Paso 5: Conectar a Vercel

Una vez que el código esté en GitHub:

1. **Ve a Vercel**: https://vercel.com
2. **Click en "Add New Project"**
3. **Importa desde GitHub:**
   - Selecciona el repositorio `EthMexico`
   - Click en "Import"
4. **Configuración:**
   - **Root Directory**: Selecciona `frontend`
   - **Framework Preset**: Next.js (auto-detectado)
5. **Deploy:**
   - Click en "Deploy"
   - Espera 2-3 minutos
   - ¡Tu app estará en vivo! 🎉

---

## 🔧 Comandos Completos (Copia y Pega)

Después de crear el repositorio en GitHub, ejecuta estos 3 comandos (reemplaza TU-USUARIO):

```powershell
git remote add origin https://github.com/TU-USUARIO/EthMexico.git
git branch -M main
git push -u origin main
```

---

**¿Necesitas ayuda con algún paso? Avísame cuando hayas creado el repositorio y te ayudo a conectarlo.** 🚀


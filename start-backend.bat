@echo off
echo 🚀 Iniciando Backend del Tattoo Shop...
echo.

REM Verificar que Node.js esté instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js no está instalado o no está en el PATH
    echo Por favor instala Node.js desde https://nodejs.org/
    pause
    exit /b 1
)

REM Verificar que npm esté disponible
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm no está disponible
    pause
    exit /b 1
)

REM Verificar si existe el archivo .env
if not exist ".env" (
    echo ⚠️  Archivo .env no encontrado
    echo Copiando .env.example a .env...
    copy ".env.example" ".env"
    echo ✅ Archivo .env creado
    echo 📝 Por favor edita el archivo .env con tu configuración
    echo.
)

REM Verificar si node_modules existe
if not exist "node_modules" (
    echo 📦 Instalando dependencias...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Error al instalar dependencias
        pause
        exit /b 1
    )
    echo ✅ Dependencias instaladas
    echo.
)

echo 🏃‍♂️ Iniciando servidor en modo desarrollo...
echo 🌐 Backend estará disponible en: http://localhost:3001
echo 📝 Para detener el servidor, presiona Ctrl+C
echo.

npm run start:dev

# Script de inicio para el Backend del Tattoo Shop
Write-Host "🚀 Iniciando Backend del Tattoo Shop..." -ForegroundColor Green
Write-Host ""

# Verificar que Node.js esté instalado
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js versión: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js no está instalado o no está en el PATH" -ForegroundColor Red
    Write-Host "Por favor instala Node.js desde https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Presiona Enter para salir"
    exit 1
}

# Verificar que npm esté disponible
try {
    $npmVersion = npm --version
    Write-Host "✅ npm versión: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm no está disponible" -ForegroundColor Red
    Read-Host "Presiona Enter para salir"
    exit 1
}

# Verificar si existe el archivo .env
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  Archivo .env no encontrado" -ForegroundColor Yellow
    Write-Host "Copiando .env.example a .env..." -ForegroundColor Blue
    Copy-Item ".env.example" ".env"
    Write-Host "✅ Archivo .env creado" -ForegroundColor Green
    Write-Host "📝 Por favor edita el archivo .env con tu configuración" -ForegroundColor Yellow
    Write-Host ""
}

# Verificar si node_modules existe
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependencias..." -ForegroundColor Blue
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Error al instalar dependencias" -ForegroundColor Red
        Read-Host "Presiona Enter para salir"
        exit 1
    }
    Write-Host "✅ Dependencias instaladas" -ForegroundColor Green
    Write-Host ""
}

Write-Host "🏃‍♂️ Iniciando servidor en modo desarrollo..." -ForegroundColor Cyan
Write-Host "🌐 Backend estará disponible en: http://localhost:3001" -ForegroundColor Yellow
Write-Host "📝 Para detener el servidor, presiona Ctrl+C" -ForegroundColor Yellow
Write-Host ""

# Iniciar el servidor
npm run start:dev

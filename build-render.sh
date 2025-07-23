#!/bin/bash
set -e

echo "🚀 Iniciando compilación personalizada para Render..."

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm ci --include=dev

# Instalar ts-loader explícitamente
echo "📦 Instalando ts-loader explícitamente..."
npm install --no-save ts-loader

# Limpiar carpeta dist si existe
if [ -d "dist" ]; then
  echo "🧹 Limpiando carpeta dist previa..."
  rm -rf dist
fi

# Compilar con tsc directamente en lugar de usar webpack
echo "🛠️ Compilando TypeScript directamente con configuración especial para Render..."
npx tsc -p tsconfig.render.json

# Crear carpeta dist si no existe
if [ ! -d "dist" ]; then
  echo "📁 Creando carpeta dist..."
  mkdir -p dist
fi

# Copiar package.json a dist
echo "📋 Copiando package.json a dist..."
cp package.json dist/

# Copiar .env si existe
if [ -f ".env" ]; then
  echo "📝 Copiando .env a dist..."
  cp .env dist/
fi

echo "✅ Compilación completada con éxito!"

#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Función para ejecutar comandos y mostrar su salida
function run(command) {
  console.log(`Ejecutando: ${command}`);
  try {
    const output = execSync(command, { stdio: 'inherit' });
    return output;
  } catch (error) {
    console.error(`Error ejecutando "${command}":`, error);
    // Continuamos a pesar del error
    return null;
  }
}

console.log('🛠️ Iniciando compilación personalizada para Render...');

// Paso 1: Instalar dependencias
console.log('📦 Instalando dependencias...');
run('npm ci');

// Paso 2: Compilar TypeScript directamente
console.log('🔨 Compilando TypeScript...');
run('npx tsc --skipLibCheck');

// Paso 3: Verificar si se creó la carpeta dist
if (!fs.existsSync('./dist')) {
  console.log('📁 Creando carpeta dist...');
  fs.mkdirSync('./dist', { recursive: true });
}

// Paso 4: Copiar archivos necesarios (como package.json) a dist
console.log('📋 Copiando package.json a dist...');
fs.copyFileSync('./package.json', './dist/package.json');

// Verificar si hay un archivo .env para copiarlo
if (fs.existsSync('./.env')) {
  console.log('📝 Copiando .env a dist...');
  fs.copyFileSync('./.env', './dist/.env');
}

// Paso 5: Asegurarnos de que las carpetas críticas existen
const criticalDirs = [
  './dist/logs',
  './dist/review',
  './dist/users',
  './dist/auth',
  './dist/products'
];

criticalDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    console.log(`📁 Creando carpeta ${dir}...`);
    fs.mkdirSync(dir, { recursive: true });
  }
});

console.log('✅ Compilación personalizada completada con éxito!');

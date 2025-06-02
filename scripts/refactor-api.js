#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// Directorio de la API
const API_DIR = path.join(__dirname, '../app/api')

// Función para procesar un archivo
function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8')
  
  // Reemplazar SET @current_user_id = 1 con SET @current_user_id = ?
  content = content.replace(
    /await conn\.execute\('SET @current_user_id = 1'\);/g,
    `const userId = request.headers.get('x-user-id');
    await conn.execute('SET @current_user_id = ?', [userId]);`
  )
  
  fs.writeFileSync(filePath, content)
}

// Función para procesar un directorio recursivamente
function processDirectory(dir) {
  const files = fs.readdirSync(dir)
  
  for (const file of files) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    
    if (stat.isDirectory()) {
      processDirectory(filePath)
    } else if (file.endsWith('.js')) {
      processFile(filePath)
    }
  }
}

// Ejecutar el script
console.log('Iniciando refactorización de endpoints de API...')
processDirectory(API_DIR)
console.log('Refactorización completada.')

// Formatear archivos modificados
console.log('Formateando archivos...')
execSync('npx prettier --write "app/api/**/*.js"')
console.log('Formateo completado.') 
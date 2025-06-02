#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// Directorio de componentes
const COMPONENTS_DIR = path.join(__dirname, '../components')

// Función para procesar un archivo
function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8')
  
  // Agregar import de api si no existe
  if (!content.includes("import { api } from '../libs/api'")) {
    content = content.replace(
      /import.*from.*['"].*['"];?\n/,
      `$&import { api } from '../libs/api';\n`
    )
  }
  
  // Reemplazar fetch con api
  content = content.replace(
    /const response = await fetch\(['"]([^'"]+)['"]\)/g,
    'const response = await api.get(\'$1\')'
  )
  
  content = content.replace(
    /const response = await fetch\(['"]([^'"]+)['"],\s*{\s*method:\s*['"]POST['"]/g,
    'const response = await api.post(\'$1\''
  )
  
  content = content.replace(
    /const response = await fetch\(['"]([^'"]+)['"],\s*{\s*method:\s*['"]PUT['"]/g,
    'const response = await api.put(\'$1\''
  )
  
  content = content.replace(
    /const response = await fetch\(['"]([^'"]+)['"],\s*{\s*method:\s*['"]DELETE['"]/g,
    'const response = await api.delete(\'$1\''
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
    } else if (file.endsWith('.jsx')) {
      processFile(filePath)
    }
  }
}

// Ejecutar el script
console.log('Iniciando refactorización de componentes...')
processDirectory(COMPONENTS_DIR)
console.log('Refactorización completada.')

// Formatear archivos modificados
console.log('Formateando archivos...')
execSync('npx prettier --write "components/**/*.jsx"')
console.log('Formateo completado.') 
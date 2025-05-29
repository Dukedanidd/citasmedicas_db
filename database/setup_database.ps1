# Script para configurar la base de datos de la clínica
# Requiere PowerShell 5.1 o superior

# Solicitar la IP del servidor
$serverIP = Read-Host "Ingresa la IP del servidor de base de datos"

# Verificar que se ingresó una IP
if (-not $serverIP) {
    Write-Host "Error: Debes ingresar una IP válida" -ForegroundColor Red
    exit 1
}

# Crear archivo de configuración temporal
$configContent = @"
[client]
host=$serverIP
user=root
password=
database=clinica_db
"@

$configPath = "mysql_config.cnf"
$configContent | Out-File -FilePath $configPath -Encoding ASCII

Write-Host "`nConfigurando la base de datos..." -ForegroundColor Yellow

# Verificar si MySQL está instalado y en el PATH
try {
    $mysqlVersion = mysql --version
    Write-Host "MySQL encontrado: $mysqlVersion" -ForegroundColor Green
} catch {
    Write-Host "Error: MySQL no está instalado o no está en el PATH" -ForegroundColor Red
    Write-Host "Por favor, asegúrate de tener MySQL instalado y agregado al PATH del sistema" -ForegroundColor Yellow
    exit 1
}

# Crear la base de datos
Write-Host "`nCreando la base de datos..." -ForegroundColor Yellow
mysql --defaults-file="$configPath" -e "CREATE DATABASE IF NOT EXISTS clinica_db;"

# Buscar el archivo SQL más reciente
$latestSqlFile = Get-ChildItem -Filter "*.sql" | Sort-Object LastWriteTime -Descending | Select-Object -First 1

if (-not $latestSqlFile) {
    Write-Host "Error: No se encontró ningún archivo SQL en el directorio actual" -ForegroundColor Red
    exit 1
}

Write-Host "`nUsando el archivo SQL más reciente: $($latestSqlFile.Name)" -ForegroundColor Yellow

# Importar el esquema y datos
Write-Host "`nImportando el esquema y datos..." -ForegroundColor Yellow
mysql --defaults-file="$configPath" clinica_db < $latestSqlFile.FullName

# Limpiar archivo de configuración temporal
Remove-Item $configPath

Write-Host "`n¡Configuración completada!" -ForegroundColor Green
Write-Host "La base de datos ha sido configurada exitosamente." -ForegroundColor Green
Write-Host "Puedes conectarte usando:" -ForegroundColor Yellow
Write-Host "Host: $serverIP" -ForegroundColor Yellow
Write-Host "Usuario: root" -ForegroundColor Yellow
Write-Host "Base de datos: clinica_db" -ForegroundColor Yellow 
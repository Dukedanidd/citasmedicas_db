#!/bin/bash

# Obtener el directorio actual del script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Crear el archivo de cron temporal
CRON_FILE=$(mktemp)

# Agregar el job de cron para ejecutar cada 30 minutos
echo "*/30 * * * * cd $SCRIPT_DIR && ./create_backup.sh >> $SCRIPT_DIR/backup.log 2>&1" > $CRON_FILE

# Instalar el cron job
crontab $CRON_FILE

# Limpiar el archivo temporal
rm $CRON_FILE

echo "Backup programado para ejecutarse cada 30 minutos"
echo "Los logs se guardarán en: $SCRIPT_DIR/backup.log" 
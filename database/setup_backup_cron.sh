#!/bin/bash

# Obtener el directorio actual del script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Crear el comando cron con la ruta absoluta
CRON_CMD="*/30 * * * * $SCRIPT_DIR/create_backup.sh >> $SCRIPT_DIR/backup.log 2>&1"

# Agregar el trabajo cron
(crontab -l 2>/dev/null; echo "$CRON_CMD") | crontab -

echo "Backup programado cada 30 minutos. Los logs se guardarán en $SCRIPT_DIR/backup.log" 
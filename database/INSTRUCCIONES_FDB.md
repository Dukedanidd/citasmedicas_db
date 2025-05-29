# Configuración de la Base de Datos - Sistema de Citas Médicas

Este documento contiene las instrucciones para configurar la base de datos del sistema de citas médicas en sistemas Windows.

## Requisitos Previos

1. MySQL Server instalado en tu sistema Windows
   - Puedes descargarlo desde: https://dev.mysql.com/downloads/installer/
   - Durante la instalación, asegúrate de que MySQL se agregue al PATH del sistema

2. PowerShell 5.1 o superior
   - Windows 10 y 11 ya lo incluyen por defecto
   - Para versiones anteriores, puedes actualizarlo desde: https://www.microsoft.com/en-us/download/details.aspx?id=54616

## Archivos Necesarios

Asegúrate de tener los siguientes archivos en la misma carpeta:
- `setup_database.ps1` (este script)
- `backup_completo_clinica_20250529_124810.sql` (archivo de respaldo)

## Instrucciones de Configuración

1. Abre PowerShell como administrador
   - Haz clic derecho en el menú inicio
   - Selecciona "Windows PowerShell (Admin)" o "Terminal (Admin)"

2. Navega hasta la carpeta donde están los archivos:
   ```powershell
   cd ruta\a\la\carpeta
   ```

3. Ejecuta el script:
   ```powershell
   .\setup_database.ps1
   ```

4. Cuando se te solicite, ingresa la IP del servidor de base de datos
   - Esta es la IP de la máquina donde está corriendo el servidor MariaDB/MySQL

5. El script realizará las siguientes acciones:
   - Verificará que MySQL esté instalado
   - Creará la base de datos si no existe
   - Importará el esquema y los datos
   - Mostrará la información de conexión

## Solución de Problemas

Si encuentras algún error:

1. Verifica que MySQL esté instalado y en el PATH:
   ```powershell
   mysql --version
   ```

2. Asegúrate de que el servidor de base de datos esté accesible:
   ```powershell
   ping IP_DEL_SERVIDOR
   ```

3. Verifica que los archivos estén en la misma carpeta:
   ```powershell
   dir
   ```

4. Si el script falla, puedes ejecutar los comandos manualmente:
   ```powershell
   mysql -h IP_DEL_SERVIDOR -u root -e "CREATE DATABASE IF NOT EXISTS clinica_db;"
   mysql -h IP_DEL_SERVIDOR -u root clinica_db < backup_completo_clinica_20250529_124810.sql
   ```

## Notas Importantes

- El script usa el usuario 'root' sin contraseña por defecto
- Si tu servidor requiere autenticación, modifica el script para incluir la contraseña
- Asegúrate de que el firewall del servidor permita conexiones al puerto 3306 (MySQL)
- Si estás usando XAMPP, verifica que el servicio de MySQL esté corriendo

## Soporte

Si necesitas ayuda adicional, contacta al administrador del sistema. 
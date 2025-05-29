#!/bin/bash

# crea un backup *completo* de la BD con mariadb-dump 
cd /home/senorbuen0/ISC/sem6/bd/proyecto/citasmedicas_db/database
/opt/lampp/bin/mariadb-dump -u root -p --routines --triggers --events --single-transaction clinica_db > backup_completo_clinica_$(date +%Y%m%d_%H%M%S).sql
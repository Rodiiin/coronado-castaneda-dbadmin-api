FROM mysql:8.0

# Variables de entorno por defecto
ENV MYSQL_DATABASE=logiexpress \
    MYSQL_ROOT_PASSWORD=secret

# Scripts de inicialización ejecutados automáticamente al crear el contenedor por primera vez.
# Se numeran con prefijos 01_, 02_, 03_ para garantizar el orden de dependencias:
# 1. Tablas estructurales
# 2. Triggers de negocio y auditoría
# 3. Población inicial de datos
#
# NOTA: 'procedure.sql' se excluye deliberadamente para ser ejecutado de forma manual desde DBeaver.
COPY sql_scripts/tables.sql /docker-entrypoint-initdb.d/01_tables.sql
COPY sql_scripts/triggers.sql /docker-entrypoint-initdb.d/02_triggers.sql
COPY sql_scripts/data.sql /docker-entrypoint-initdb.d/03_data.sql

EXPOSE 3306

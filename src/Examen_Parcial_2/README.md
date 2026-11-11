# Examen Parcial 2 - Base de Datos MySQL (LogiExpress)

Este directorio contiene la configuración de Docker y Docker Compose para levantar la base de datos MySQL correspondiente al Examen Parcial 2 (`logiexpress`).

---

## 📋 Información de Conexión

- **Host:** `localhost` o `127.0.0.1`
- **Puerto:** `3008` (mapeado al `3306` interno del contenedor)
- **Base de datos:** `logiexpress`
- **Usuario:** `root`
- **Contraseña:** `secret` (definida en `.env` / `docker-compose.yml`)

---

## 🚀 Cómo Iniciar el Contenedor

Desde esta carpeta (`src/Examen_Parcial_2`):

```bash
# Construir y levantar el contenedor en segundo plano
docker compose up -d --build
```

Para verificar que el contenedor esté corriendo y revisar los logs de inicialización:

```bash
docker compose logs -f db
```

Para detener el contenedor:

```bash
docker compose down
```

Para reiniciar desde cero eliminando los datos y recreando la base de datos:

```bash
docker compose down -v
docker compose up -d --build
```

---

## ⚙️ Scripts de Inicialización Automática

La imagen de Docker copia y ejecuta automáticamente al iniciar por primera vez los siguientes scripts ubicados en `sql_scripts/`:

1. `01_tables.sql` (`tables.sql`): Creación de base de datos `logiexpress` y estructura de tablas relacionales.
2. `02_triggers.sql` (`triggers.sql`): Triggers de validación de capacidad de almacén, auditoría de envíos y actualización de estados.
3. `03_data.sql` (`data.sql`): Inserción de datos iniciales de prueba para clientes, direcciones, almacenes, envíos, paquetes e historial.

---

## 📌 Ejecución de Stored Procedures en DBeaver

Tal como se definió, el script `sql_scripts/procedure.sql` **NO se ejecuta automáticamente** dentro de la imagen.

Para ejecutarlo manualmente:

1. Abre **DBeaver**.
2. Conéctate a MySQL usando:
   - **Host:** `localhost`
   - **Port:** `3008`
   - **Database:** `logiexpress`
   - **Username:** `root`
   - **Password:** `secret`
3. Abre el archivo `sql_scripts/procedure.sql`.
4. Ejecuta el script completo (o comando por comando con `Alt + X` o seleccionando el bloque `DELIMITER // ... DELIMITER ;`).
5. Los siguientes procedimientos quedarán registrados:
   - `sp_reporte_mensual_cliente`
   - `sp_obtener_hoja_ruta_envio`

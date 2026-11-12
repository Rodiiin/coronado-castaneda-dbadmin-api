# Pruebas de Endpoints - LogiExpress (Examen Parcial 2)

Guía para probar los 6 endpoints del examen en Postman, petición por petición.

> **Atajo:** en lugar de copiar cada petición a mano, puedes importar `LogiExpress.postman_collection.json`
> en Postman (**Import** → arrastrar el archivo). Trae todas las peticiones con tests automáticos.

---

## Antes de empezar

```bash
# 1. Base de datos limpia con los datos de prueba (desde src/Examen_Parcial_2)
docker compose down -v
docker compose up -d --build

# 2. API (desde la raíz del proyecto mi-api)
npm run dev:examen
```

- **URL base:** `http://localhost:3001/api`
- En todas las peticiones `POST` y `PUT` usa **Body → raw → JSON** (header `Content-Type: application/json`).
- Ejecuta las pruebas **en orden**: algunas dependen de los datos iniciales de `data.sql`.

### Datos iniciales relevantes (`data.sql`)

| Dato | Estado inicial | Se usa para probar |
|---|---|---|
| Almacén 1 | Capacidad 2, ya tiene 2 paquetes (**lleno**) | Trigger de capacidad → HTTP 400 |
| Almacén 2 | Capacidad 50 | Inserciones normales |
| Envío 1 | `EN_TRANSITO` | Trigger de rastreo → `ENTREGADO` |
| Envío 2 | `REGISTRADO`, costo 1200.50 | Trigger de auditoría de costo |
| Cliente 1 | Direcciones 1 y 2 | Historial de envíos por cliente |

---

## 0. Status de la API

`GET http://localhost:3001/api/status`

**Esperado:** `200 OK`

```json
{ "status": "OK", "message": "API LogiExpress funcionando correctamente" }
```

---

## 1. `POST /api/envios` — Registrar envío con paquetes

### 1.1 Crear envío (éxito)

`POST http://localhost:3001/api/envios`

```json
{
  "remitenteDircId": 3,
  "destinatarioDircId": 2,
  "costoTotal": 980.00,
  "paquetes": [
    { "peso": 4.2, "largo": 40, "ancho": 30, "contenido": "Monitores LED", "almacenId": 2 },
    { "peso": 0.8, "largo": 20, "ancho": 15, "contenido": "Cables y accesorios" }
  ]
}
```

**Esperado:** `201 Created`. El envío queda en estado `REGISTRADO` con 2 paquetes.
Anota el `id` del envío creado (será **4** con la base limpia); se usa en las pruebas 3.1 y 4.1.

### 1.2 Paquete en almacén lleno (trigger → 400)

`POST http://localhost:3001/api/envios`

```json
{
  "remitenteDircId": 1,
  "destinatarioDircId": 4,
  "costoTotal": 300.00,
  "paquetes": [
    { "peso": 1.0, "largo": 10, "ancho": 10, "contenido": "Paquete que no cabe", "almacenId": 1 }
  ]
}
```

**Esperado:** `400 Bad Request`. El trigger `before_insert_paquete_almacen` lanza `SQLSTATE 45000`,
la transacción hace rollback y **el envío tampoco se guarda**.

```json
{ "message": "Error: Capacidad máxima del almacén superada.", "status": 400, "data": null }
```

### 1.3 Envío sin paquetes (validación → 400)

`POST http://localhost:3001/api/envios`

```json
{
  "remitenteDircId": 1,
  "destinatarioDircId": 3,
  "costoTotal": 100,
  "paquetes": []
}
```

**Esperado:** `400 Bad Request` (`'paquetes' debe ser un arreglo no vacío...`).

---

## 2. `PUT /api/envios/:id/costo` — Modificar costo (trigger de auditoría)

### 2.1 Actualizar costo del envío 2

`PUT http://localhost:3001/api/envios/2/costo`

```json
{
  "costoTotal": 1350.75
}
```

**Esperado:** `200 OK`. El trigger `after_update_envio_costo` inserta en `auditoria_envios`.
En la respuesta, `data.auditorias[0]` muestra el cambio:

```json
{
  "costoAnterior": "1200.50",
  "costoNuevo": "1350.75",
  "usuario": "root@172.x.x.x"
}
```

> Si envías el mismo costo que ya tiene, responde 200 pero **no** se genera auditoría (el trigger solo registra cambios).

### 2.2 Envío inexistente

`PUT http://localhost:3001/api/envios/9999/costo`

```json
{
  "costoTotal": 500
}
```

**Esperado:** `404 Not Found`.

---

## 3. `POST /api/almacenes/:id/paquetes` — Asignar paquete (trigger de capacidad)

### 3.1 Asignar paquete al almacén 2 (éxito)

`POST http://localhost:3001/api/almacenes/2/paquetes`

```json
{
  "envioId": 4,
  "peso": 2.3,
  "largo": 25,
  "ancho": 20,
  "contenido": "Tarjetas de red"
}
```

**Esperado:** `201 Created`, con el paquete creado y la ocupación del almacén (ej. `"ocupacion": "4/50"`).

### 3.2 Asignar paquete al almacén 1 lleno (trigger → 400)

`POST http://localhost:3001/api/almacenes/1/paquetes`

```json
{
  "envioId": 1,
  "peso": 1.5,
  "largo": 20,
  "ancho": 15,
  "contenido": "Paquete extra"
}
```

**Esperado:** `400 Bad Request`. La API captura el `SQLSTATE 45000` del trigger:

```json
{
  "message": "Error: Capacidad máxima del almacén superada.",
  "status": 400,
  "data": { "almacenId": 1, "capacidadMaxima": 2 }
}
```

### 3.3 Almacén inexistente

`POST http://localhost:3001/api/almacenes/9999/paquetes` (mismo body que 3.2)

**Esperado:** `404 Not Found`.

---

## 4. `POST /api/envios/:id/rastreo` — Agregar rastreo (trigger de estado)

Valores válidos de `estadoEvento`: `REGISTRADO`, `EN_TRANSITO`, `ENTREGADO`, `CANCELADO`.

### 4.1 Rastreo EN_TRANSITO del envío creado

`POST http://localhost:3001/api/envios/4/rastreo`

```json
{
  "ubicacionActual": "Almacén Norte LogiExpress",
  "estadoEvento": "EN_TRANSITO",
  "observaciones": "Salida a ruta local"
}
```

**Esperado:** `201 Created`. El estado del envío **no** cambia a `ENTREGADO`.

### 4.2 Rastreo ENTREGADO del envío 1

`POST http://localhost:3001/api/envios/1/rastreo`

```json
{
  "ubicacionActual": "Av. Paseo de Montejo #301, Centro",
  "estadoEvento": "ENTREGADO",
  "observaciones": "Recibido por el destinatario"
}
```

**Esperado:** `201 Created`. El trigger `after_insert_historial_rastreo` actualiza el envío:
`data.envio.estado` pasa de `EN_TRANSITO` a **`ENTREGADO`**.

### 4.3 Estado inválido

`POST http://localhost:3001/api/envios/1/rastreo`

```json
{
  "ubicacionActual": "Mérida",
  "estadoEvento": "PERDIDO"
}
```

**Esperado:** `400 Bad Request`.

---

## 5. `GET /api/envios` — Envíos activos

`GET http://localhost:3001/api/envios`

**Esperado:** `200 OK`. Solo envíos en `REGISTRADO` o `EN_TRANSITO`, cada uno con
`remitente.cliente`, `destinatario.cliente` y `paquetes`.
Después de la prueba 4.2, el envío 1 ya **no** aparece porque quedó `ENTREGADO`.

---

## 6. `GET /api/clientes/:id/envios` — Historial por cliente

### 6.1 Cliente 1

`GET http://localhost:3001/api/clientes/1/envios`

**Esperado:** `200 OK`. Devuelve `data.cliente` y `data.envios`: todos los envíos donde el cliente 1
es remitente o destinatario, con paquetes e historial de rastreo.

### 6.2 Cliente inexistente

`GET http://localhost:3001/api/clientes/9999/envios`

**Esperado:** `404 Not Found`.

---

## Resumen

| # | Método | Ruta | Éxito | Errores probados |
|---|---|---|---|---|
| 1 | POST | `/api/envios` | 201 | 400 (trigger), 400 (validación) |
| 2 | PUT | `/api/envios/:id/costo` | 200 + auditoría | 404 |
| 3 | POST | `/api/almacenes/:id/paquetes` | 201 | 400 (trigger 45000), 404 |
| 4 | POST | `/api/envios/:id/rastreo` | 201 + estado ENTREGADO | 400 |
| 5 | GET | `/api/envios` | 200 | — |
| 6 | GET | `/api/clientes/:id/envios` | 200 | 404 |

> **Nota:** MySQL devuelve los campos `DECIMAL` (costos) como texto, por eso aparecen como `"1350.75"` en las respuestas.

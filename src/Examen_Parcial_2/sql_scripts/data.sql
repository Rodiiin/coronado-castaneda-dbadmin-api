USE logiexpress;

-- Desactivar temporalmente restricciones de FK para permitir limpieza limpia
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE auditoria_envios;
TRUNCATE TABLE historial_rastreo;
TRUNCATE TABLE paquete;
TRUNCATE TABLE envios;
TRUNCATE TABLE almacen;
TRUNCATE TABLE direccion;
TRUNCATE TABLE cliente;
SET FOREIGN_KEY_CHECKS = 1;

-- =================================================================
-- 1. CLIENTES
-- =================================================================
INSERT INTO cliente (id, nombre, apellido, estado, limite_credito) VALUES
(1, 'Carlos', 'Mendoza', 'ACTIVO', 15000.00),
(2, 'Ana', 'Gómez', 'ACTIVO', 25000.00),
(3, 'Roberto', 'Várguez', 'INACTIVO', 5000.00);

-- =================================================================
-- 2. DIRECCIONES (Asociadas a clientes)
-- =================================================================
INSERT INTO direccion (id, cliente_id, calle, numero, colonia, ciudad, estado, pais, cruzamiento, continente) VALUES
(1, 1, 'Calle 60', 450, 'Centro', 'Mérida', 'Yucatán', 'México', 'Calle 53 y 55', 'América'),
(2, 1, 'Calle 21', 102, 'Itzimná', 'Mérida', 'Yucatán', 'México', 'Calle 18', 'América'),
(3, 2, 'Av. Paseo de Montejo', 301, 'Centro', 'Mérida', 'Yucatán', 'México', 'Calle 47', 'América'),
(4, 2, 'Calle 50', 512, 'Altabrisa', 'Mérida', 'Yucatán', 'México', 'Av. Correa Rachó', 'América'),
(5, 3, 'Calle 10', 88, 'Industrial', 'Mérida', 'Yucatán', 'México', 'Calle 25', 'América');

-- =================================================================
-- 3. ALMACENES
-- Almacén 1: Capacidad = 2 (Prepara el test del Trigger de Sobrecupo SQLSTATE 45000 / HTTP 400)
-- Almacén 2: Capacidad = 50 (Para inserciones normales)
-- =================================================================
INSERT INTO almacen (id, nombre, direccion_id, capacidad_maxima_paquetes) VALUES
(1, 'Almacén Central Exprés (Capacidad 2)', 1, 2),
(2, 'Almacén Norte LogiExpress', 4, 50);

-- =================================================================
-- 4. ENVIOS
-- Envío 1: En tránsito (Listo para probar POST /api/envios/1/rastreo -> ENTREGADO)
-- Envío 2: Registrado (Listo para probar PUT /api/envios/2/costo -> Trigger Auditoría)
-- Envío 3: Entregado en Octubre 2026 (Para probar sp_reporte_mensual_cliente)
-- =================================================================
INSERT INTO envios (id, remitente_dirc_id, destinatario_dirc_id, costo_total, fecha, estado) VALUES
(1, 1, 3, 450.00, '2026-10-15 08:30:00', 'EN_TRANSITO'),
(2, 2, 4, 1200.50, '2026-10-18 10:00:00', 'REGISTRADO'),
(3, 1, 4, 850.00, '2026-10-05 14:15:00', 'ENTREGADO');

-- =================================================================
-- 5. PAQUETES
-- Almacén 1 inicia con 2 paquetes (Capacidad MÁXIMA ALCANZADA = 2/2)
-- =================================================================
INSERT INTO paquete (id, envio_id, almacen_id, peso, largo, ancho, contenido) VALUES
(1, 1, 1, 3.5, 30, 20, 'Lote de Electrónicos - Servidores Micro'),
(2, 1, 1, 1.2, 15, 10, 'Documentos de Auditoría y Contratos'),
(3, 2, 2, 8.0, 50, 40, 'Refacciones Mecánicas y Sensores'),
(4, 3, 2, 2.5, 25, 25, 'Componentes de Cómputo');

-- =================================================================
-- 6. HISTORIAL DE RASTREO
-- Envío 3 cuenta con tiempos de entrega para sp_reporte_mensual_cliente y hoja de ruta
-- =================================================================
INSERT INTO historial_rastreo (id, envio_id, fecha, ubicacion_actual, estado_evento, observaciones) VALUES
(1, 1, '2026-10-15 08:30:00', 'Centro de Distribución Mérida', 'REGISTRADO', 'Paquete documentado e ingresado al sistema'),
(2, 1, '2026-10-15 12:00:00', 'Almacén Central Exprés', 'EN_TRANSITO', 'En clasificación para ruta de salida'),
(3, 3, '2026-10-05 14:15:00', 'Centro de Distribución Mérida', 'REGISTRADO', 'Recepción de envío corporativo'),
(4, 3, '2026-10-06 09:00:00', 'En ruta de entrega local', 'EN_TRANSITO', 'Asignado a chofer de unidad 04'),
(5, 3, '2026-10-06 11:30:00', 'Calle 50 #512, Altabrisa', 'ENTREGADO', 'Recibido por guardia en caseta');

-- =================================================================
-- 7. AUDITORIA DE ENVIOS (Registro inicial de prueba)
-- =================================================================
INSERT INTO auditoria_envios (id, envio_id, costo_anterior, costo_nuevo, usuario, fecha_modificacion) VALUES
(1, 3, 750.00, 850.00, 'root@127.0.0.1', '2026-10-05 13:00:00');
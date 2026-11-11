-- No tocar los procedures para construir la imagen de docker,  se ejecutaran en Dbeaver aparte. 

USE logiexpress;

-- 1. PROCEDURE: Reporte Mensual de Cliente
DELIMITER //

CREATE PROCEDURE sp_reporte_mensual_cliente(
    IN p_cliente_id INT,
    IN p_mes INT,
    IN p_anio INT
)
BEGIN
    SELECT 
        c.id AS cliente_id,
        CONCAT(c.nombre, ' ', c.apellido) AS nombre_cliente,
        COALESCE(SUM(e.costo_total), 0.00) AS facturacion_total,
        COUNT(CASE WHEN e.estado = 'ENTREGADO' THEN 1 END) AS envios_entregados,
        ROUND(AVG(TIMESTAMPDIFF(HOUR, e.fecha, h.fecha_entrega)), 2) AS tiempo_promedio_entrega_horas
    FROM cliente c
    INNER JOIN direccion d ON c.id = d.cliente_id
    INNER JOIN envios e ON d.id = e.remitente_dirc_id
    LEFT JOIN (
        SELECT envio_id, MIN(fecha) AS fecha_entrega
        FROM historial_rastreo
        WHERE estado_evento = 'ENTREGADO'
        GROUP BY envio_id
    ) h ON e.id = h.envio_id
    WHERE c.id = p_cliente_id
      AND MONTH(e.fecha) = p_mes
      AND YEAR(e.fecha) = p_anio
    GROUP BY c.id, c.nombre, c.apellido;
END //

DELIMITER ;

-- 2. PROCEDURE: Hoja de Ruta e Historial de Envío
-- Devuelve 2 conjuntos de resultados (Result Sets):
--   1) Datos del envío, remitente, destinatario y paquetes.
--   2) Bitácora cronológica del historial de rastreo.

DELIMITER //

CREATE PROCEDURE sp_obtener_hoja_ruta_envio(
    IN p_envio_id INT
)
BEGIN
    -- Result Set 1: Desglose general del envío, remitente, destinatario y paquete(s)
    SELECT 
        e.id AS envio_id,
        e.fecha AS fecha_envio,
        e.estado AS estado_actual,
        e.costo_total,
        CONCAT(c_rem.nombre, ' ', c_rem.apellido) AS remitente,
        CONCAT(d_rem.calle, ' #', d_rem.numero, ', ', d_rem.colonia, ', ', d_rem.ciudad) AS direccion_origen,
        CONCAT(c_dest.nombre, ' ', c_dest.apellido) AS destinatario,
        CONCAT(d_dest.calle, ' #', d_dest.numero, ', ', d_dest.colonia, ', ', d_dest.ciudad) AS direccion_destino,
        p.id AS paquete_id,
        p.peso AS peso_kg,
        CONCAT(p.largo, 'x', p.ancho, ' cm') AS dimensiones,
        p.contenido
    FROM envios e
    INNER JOIN direccion d_rem ON e.remitente_dirc_id = d_rem.id
    INNER JOIN cliente c_rem ON d_rem.cliente_id = c_rem.id
    INNER JOIN direccion d_dest ON e.destinatario_dirc_id = d_dest.id
    INNER JOIN cliente c_dest ON d_dest.cliente_id = c_dest.id
    LEFT JOIN paquete p ON e.id = p.envio_id
    WHERE e.id = p_envio_id;

    -- Result Set 2: Historial cronológico de seguimiento
    SELECT 
        hr.id AS rastreo_id,
        hr.fecha,
        hr.ubicacion_actual,
        hr.estado_evento,
        hr.observaciones
    FROM historial_rastreo hr
    WHERE hr.envio_id = p_envio_id
    ORDER BY hr.fecha ASC;
END //

DELIMITER ;
USE logiexpress;

-- 1. TRIGGER: Validar capacidad del almacén (BEFORE INSERT)
DELIMITER //

CREATE TRIGGER before_insert_paquete_almacen
BEFORE INSERT ON paquete
FOR EACH ROW
BEGIN
    DECLARE v_capacidad INT;
    DECLARE v_paquetes_actuales INT;

    IF NEW.almacen_id IS NOT NULL THEN
        -- Obtener capacidad máxima del almacén objetivo
        SELECT capacidad_maxima_paquetes INTO v_capacidad
        FROM almacen
        WHERE id = NEW.almacen_id;

        -- Contar paquetes actualmente asignados a ese almacén
        SELECT COUNT(*) INTO v_paquetes_actuales
        FROM paquete
        WHERE almacen_id = NEW.almacen_id;

        -- Lanzar error 45000 si se alcanza o supera la capacidad
        IF v_paquetes_actuales >= v_capacidad THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Error: Capacidad máxima del almacén superada.';
        END IF;
    END IF;
END //

DELIMITER ;



-- 2. TRIGGER: Auditoría de cambios de costo (AFTER UPDATE)
DELIMITER //

CREATE TRIGGER after_update_envio_costo
AFTER UPDATE ON envios
FOR EACH ROW
BEGIN
    -- Registrar en auditoría solo si el costo total tuvo alguna modificación
    IF OLD.costo_total <> NEW.costo_total THEN
        INSERT INTO auditoria_envios (
            envio_id,
            costo_anterior,
            costo_nuevo,
            usuario,
            fecha_modificacion
        )
        VALUES (
            NEW.id,
            OLD.costo_total,
            NEW.costo_total,
            USER(),
            NOW()
        );
    END IF;
END //

DELIMITER ;


-- 3. TRIGGER: Actualizar estado global a ENTREGADO (AFTER INSERT)

DELIMITER //

CREATE TRIGGER after_insert_historial_rastreo
AFTER INSERT ON historial_rastreo
FOR EACH ROW
BEGIN
    -- Si el evento en el historial es 'ENTREGADO', actualiza la tabla envios
    IF NEW.estado_evento = 'ENTREGADO' THEN
        UPDATE envios
        SET estado = 'ENTREGADO'
        WHERE id = NEW.envio_id;
    END IF;
END //

DELIMITER ;
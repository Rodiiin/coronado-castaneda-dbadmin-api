CREATE DATABASE IF NOT EXISTS logiexpress;
USE logiexpress;

-- 1. Tabla cliente
CREATE TABLE cliente (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(40) NOT NULL,
    apellido VARCHAR(40) NOT NULL,
    estado ENUM('ACTIVO', 'INACTIVO') DEFAULT 'ACTIVO' NOT NULL,
    limite_credito DECIMAL(10, 2) NOT NULL
);

-- 2. Tabla direccion
CREATE TABLE direccion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    calle VARCHAR(100) NOT NULL,
    numero INT NOT NULL,
    colonia VARCHAR(40) NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    estado VARCHAR(40) NOT NULL,
    pais VARCHAR(40) NOT NULL,
    cruzamiento VARCHAR(80),
    continente VARCHAR(40) NOT NULL,
    CONSTRAINT fk_direccion_cliente FOREIGN KEY (cliente_id) REFERENCES cliente(id) ON DELETE CASCADE
);
-- 3. Tabla almacen
CREATE TABLE almacen (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(60) NOT NULL,
    direccion_id INT NOT NULL,
    capacidad_maxima_paquetes INT NOT NULL,
    CONSTRAINT fk_almacen_direccion FOREIGN KEY (direccion_id) REFERENCES direccion(id)
);

-- 4. Tabla envios
CREATE TABLE envios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    remitente_dirc_id INT NOT NULL,
    destinatario_dirc_id INT NOT NULL,
    costo_total DECIMAL(10, 2) NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('REGISTRADO', 'EN_TRANSITO', 'ENTREGADO', 'CANCELADO') DEFAULT 'REGISTRADO' NOT NULL,
    CONSTRAINT fk_envio_remitente FOREIGN KEY (remitente_dirc_id) REFERENCES direccion(id),
    CONSTRAINT fk_envio_destinatario FOREIGN KEY (destinatario_dirc_id) REFERENCES direccion(id)
);

-- 5. Tabla paquete
CREATE TABLE paquete (
    id INT AUTO_INCREMENT PRIMARY KEY,
    envio_id INT NOT NULL,
    almacen_id INT,
    peso FLOAT NOT NULL,
    largo INT NOT NULL,
    ancho INT NOT NULL,
    contenido VARCHAR(120) NOT NULL,
    CONSTRAINT fk_paquete_envio FOREIGN KEY (envio_id) REFERENCES envios(id) ON DELETE CASCADE,
    CONSTRAINT fk_paquete_almacen FOREIGN KEY (almacen_id) REFERENCES almacen(id) ON DELETE SET NULL
);

-- 6. Tabla historial_rastreo
CREATE TABLE historial_rastreo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    envio_id INT NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    ubicacion_actual VARCHAR(120) NOT NULL,
    estado_evento ENUM('REGISTRADO', 'EN_TRANSITO', 'ENTREGADO', 'CANCELADO') NOT NULL,
    observaciones VARCHAR(120),
    CONSTRAINT fk_rastreo_envio FOREIGN KEY (envio_id) REFERENCES envios(id) ON DELETE CASCADE
);

-- 7. Tabla auditoria_envios
CREATE TABLE auditoria_envios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    envio_id INT NOT NULL,
    costo_anterior DECIMAL(10, 2) NOT NULL,
    costo_nuevo DECIMAL(10, 2) NOT NULL,
    usuario VARCHAR(40) NOT NULL,
    fecha_modificacion DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_auditoria_envio FOREIGN KEY (envio_id) REFERENCES envios(id) ON DELETE CASCADE
);
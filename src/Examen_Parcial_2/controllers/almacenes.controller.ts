import { Request, Response } from "express";
import { almacenService } from "../services/almacen.service.js";
import { esErrorDeTrigger, esErrorDeLlaveForanea, mensajeMysql } from "../utils/db-errors.js";
import { esEnteroPositivo, esNumeroPositivo, esTextoNoVacio } from "../utils/validaciones.js";

// POST /api/almacenes/:id/paquetes
export const addPaqueteAlmacen = async (req: Request, resp: Response) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
        return resp.status(400).json({
            message: "El id debe ser un número entero",
            status: 400,
            data: null
        })
    }

    const { envioId, peso, largo, ancho, contenido } = req.body ?? {};

    if (!esEnteroPositivo(envioId) || !esNumeroPositivo(peso) || !esEnteroPositivo(largo) ||
        !esEnteroPositivo(ancho) || !esTextoNoVacio(contenido)) {
        return resp.status(400).json({
            message: "Se requiere 'envioId', 'peso', 'largo', 'ancho' (números positivos) y 'contenido'",
            status: 400,
            data: null
        })
    }

    const almacen = await almacenService.findById(id);

    if (!almacen) {
        return resp.status(404).json({
            message: "Almacén no encontrado",
            status: 404,
            data: null
        })
    }

    try {
        const paquete = await almacenService.addPaquete(id, { envioId, peso, largo, ancho, contenido: contenido.trim() });
        const ocupados = await almacenService.countPaquetes(id);

        resp.status(201).json({
            message: "Paquete asignado al almacén",
            status: 201,
            data: { paquete, ocupacion: `${ocupados}/${almacen.capacidadMaximaPaquetes}` }
        })
    } catch (error) {
        // SIGNAL SQLSTATE '45000' del trigger before_insert_paquete_almacen
        if (esErrorDeTrigger(error)) {
            return resp.status(400).json({
                message: mensajeMysql(error),
                status: 400,
                data: { almacenId: id, capacidadMaxima: almacen.capacidadMaximaPaquetes }
            })
        }
        if (esErrorDeLlaveForanea(error)) {
            return resp.status(400).json({
                message: "El envío indicado no existe",
                status: 400,
                data: null
            })
        }
        throw error;
    }
}

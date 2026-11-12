import { Request, Response } from "express";
import { envioService } from "../services/envio.service.js";
import type { PaqueteInput } from "../services/envio.service.js";
import { ESTADOS_ENVIO } from "../entity/EstadoEnvio.js";
import type { EstadoEnvio } from "../entity/EstadoEnvio.js";
import { esErrorDeTrigger, esErrorDeLlaveForanea, mensajeMysql } from "../utils/db-errors.js";
import { esEnteroPositivo, esNumeroPositivo, esNumeroNoNegativo, esTextoNoVacio } from "../utils/validaciones.js";

const esPaqueteValido = (paquete: any): boolean =>
    esNumeroPositivo(paquete?.peso) &&
    esEnteroPositivo(paquete?.largo) &&
    esEnteroPositivo(paquete?.ancho) &&
    esTextoNoVacio(paquete?.contenido) &&
    (paquete?.almacenId === undefined || paquete?.almacenId === null || esEnteroPositivo(paquete?.almacenId));

// POST /api/envios
export const createEnvio = async (req: Request, resp: Response) => {
    const { remitenteDircId, destinatarioDircId, costoTotal, paquetes } = req.body ?? {};

    if (!esEnteroPositivo(remitenteDircId) || !esEnteroPositivo(destinatarioDircId) || !esNumeroNoNegativo(costoTotal)) {
        return resp.status(400).json({
            message: "Se requiere 'remitenteDircId', 'destinatarioDircId' (enteros) y 'costoTotal' (número >= 0)",
            status: 400,
            data: null
        })
    }

    if (!Array.isArray(paquetes) || paquetes.length === 0 || !paquetes.every(esPaqueteValido)) {
        return resp.status(400).json({
            message: "'paquetes' debe ser un arreglo no vacío; cada paquete requiere peso, largo, ancho, contenido y opcionalmente almacenId",
            status: 400,
            data: null
        })
    }

    const paquetesInput: PaqueteInput[] = paquetes.map((p: any) => ({
        peso: p.peso,
        largo: p.largo,
        ancho: p.ancho,
        contenido: p.contenido.trim(),
        almacenId: p.almacenId ?? null
    }));

    try {
        const envio = await envioService.create({ remitenteDircId, destinatarioDircId, costoTotal, paquetes: paquetesInput });

        resp.status(201).json({
            message: "Envío registrado con sus paquetes",
            status: 201,
            data: envio
        })
    } catch (error) {
        if (esErrorDeTrigger(error)) {
            return resp.status(400).json({
                message: mensajeMysql(error),
                status: 400,
                data: null
            })
        }
        if (esErrorDeLlaveForanea(error)) {
            return resp.status(400).json({
                message: "La dirección de remitente/destinatario o el almacén indicado no existe",
                status: 400,
                data: null
            })
        }
        throw error;
    }
}

// PUT /api/envios/:id/costo
export const updateCostoEnvio = async (req: Request, resp: Response) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
        return resp.status(400).json({
            message: "El id debe ser un número entero",
            status: 400,
            data: null
        })
    }

    const { costoTotal } = req.body ?? {};

    if (!esNumeroNoNegativo(costoTotal)) {
        return resp.status(400).json({
            message: "Se requiere 'costoTotal' como número >= 0",
            status: 400,
            data: null
        })
    }

    const envio = await envioService.findById(id);

    if (!envio) {
        return resp.status(404).json({
            message: "Envío no encontrado para actualizar el costo",
            status: 404,
            data: null
        })
    }

    // MySQL devuelve los DECIMAL como string, por eso se convierte antes de comparar
    const costoCambio = Number(envio.costoTotal) !== costoTotal;
    const updated = await envioService.updateCosto(id, costoTotal);

    resp.json({
        message: costoCambio
            ? "Costo actualizado; el trigger after_update_envio_costo registró la auditoría"
            : "El costo es el mismo; no se generó registro de auditoría",
        status: 200,
        data: updated
    })
}

// POST /api/envios/:id/rastreo
export const addRastreoEnvio = async (req: Request, resp: Response) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
        return resp.status(400).json({
            message: "El id debe ser un número entero",
            status: 400,
            data: null
        })
    }

    const { ubicacionActual, estadoEvento, observaciones } = req.body ?? {};

    if (!esTextoNoVacio(ubicacionActual) || !ESTADOS_ENVIO.includes(estadoEvento)) {
        return resp.status(400).json({
            message: `Se requiere 'ubicacionActual' y 'estadoEvento' (${ESTADOS_ENVIO.join(", ")})`,
            status: 400,
            data: null
        })
    }

    if (observaciones !== undefined && observaciones !== null && typeof observaciones !== "string") {
        return resp.status(400).json({
            message: "'observaciones' debe ser texto",
            status: 400,
            data: null
        })
    }

    const envio = await envioService.findById(id);

    if (!envio) {
        return resp.status(404).json({
            message: "Envío no encontrado para registrar rastreo",
            status: 404,
            data: null
        })
    }

    const rastreo = await envioService.addRastreo(id, {
        ubicacionActual: ubicacionActual.trim(),
        estadoEvento: estadoEvento as EstadoEnvio,
        observaciones: observaciones ?? null
    });

    // Se vuelve a consultar para reflejar el estado que actualizó el trigger
    const envioActualizado = await envioService.findById(id);

    resp.status(201).json({
        message: estadoEvento === "ENTREGADO"
            ? "Rastreo registrado; el trigger after_insert_historial_rastreo marcó el envío como ENTREGADO"
            : "Rastreo registrado",
        status: 201,
        data: { rastreo, envio: envioActualizado }
    })
}

// GET /api/envios
export const getEnviosActivos = async (req: Request, resp: Response) => {
    const envios = await envioService.findActivos();

    resp.json({
        message: envios.length === 0 ? "No hay envíos activos" : "Envíos activos encontrados",
        status: 200,
        data: envios
    })
}

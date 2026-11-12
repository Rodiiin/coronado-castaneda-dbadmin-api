import { Request, Response } from "express";
import { clienteService } from "../services/cliente.service.js";
import { envioService } from "../services/envio.service.js";

// GET /api/clientes/:id/envios
export const getEnviosCliente = async (req: Request, resp: Response) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
        return resp.status(400).json({
            message: "El id debe ser un número entero",
            status: 400,
            data: null
        })
    }

    const cliente = await clienteService.findById(id);

    if (!cliente) {
        return resp.status(404).json({
            message: "Cliente no encontrado",
            status: 404,
            data: null
        })
    }

    const envios = await envioService.findByCliente(id);

    resp.json({
        message: envios.length === 0 ? "El cliente no tiene envíos registrados" : "Historial de envíos del cliente",
        status: 200,
        data: { cliente, envios }
    })
}

import {Request, Response} from "express";
import {VentaRepository, ventaRepository} from "../repository/VentaRepository.js";
import { Venta } from "../entity/Venta.js";

export const getVenta = async (req:Request, resp:Response) => {
    const id = Number(req.params.id);

    if(!Number.isInteger(id)){
        return resp.status(400).json({
            message: "El id debe ser un número entero",
            status: 400,
            data: null
        })
    }

    const venta = await ventaRepository.findById(id)

    if(!venta){
        return resp.status(404).json({
            message: "Venta no encontrada",
            status: 404,
            data: null
        })
    }

    resp.json({
        message: "Venta encontrada",
        status: 200,
        data: venta
    })

}

export const getVentas = async (req:Request, resp:Response) => {
    const ventas = await ventaRepository.findAll();

    resp.json({
        message: ventas.length === 0 ? "No hay ventas registradas" : "Ventas encontradas",
        status: 200,
        data: ventas
    })
}

export const createVenta = async (req:Request, resp:Response) =>{
    const {cliente, total, detalles} = req.body ?? {};

    if(!cliente || (detalles !== undefined && !Array.isArray(detalles))){
        return resp.status(400).json({
            message: "Se requiere 'cliente' y 'detalles' debe ser un arreglo",
            status: 400,
            data: null
        })
    }

    const venta = await ventaRepository.create({cliente, total, detalles});

    resp.status(201).json({
        message:"Venta creada",
        status:201,
        data: venta
    })
}

export const deleteVenta = async (req:Request, resp:Response) => {
    const id = Number(req.params.id);

    if(!Number.isInteger(id)){
        return resp.status(400).json({
            message: "El id debe ser un número entero",
            status: 400,
            data: null
        })
    }

    const venta = await ventaRepository.findById(id);

    if(!venta){
        return resp.status(404).json({
            message:"Venta no encontrada para eliminar",
            status: 404,
            data: venta
        })
    }

    const deleted = await ventaRepository.delete(id);

    resp.json({
        message:"Venta eliminada",
        status: 200,
        data:deleted
    })
}

export const updateVenta = async (req:Request, resp:Response) => {
    const id = Number (req.params.id);

    if(!Number.isInteger(id)){
        return resp.status(400).json({
            message: "El id debe ser un número entero",
            status: 400,
            data: null
        })
    }

    const{cliente, total, detalles} = req.body ?? {};

    if(cliente === undefined && total === undefined && detalles === undefined){
        return resp.status(400).json({
            message: "Envía al menos uno de: cliente, total, detalles",
            status: 400,
            data: null
        })
    }

    if(detalles !== undefined && !Array.isArray(detalles)){
        return resp.status(400).json({
            message: "'detalles' debe ser un arreglo",
            status: 400,
            data: null
        })
    }

    const venta = await ventaRepository.findById(id);

    if(!venta){
        return resp.status(404).json({
            message: "Venta no encontrada para actualizar",
            status: 404,
            data: venta

        })
    }

    const updated = await ventaRepository.update(id, {cliente, total, detalles});

    resp.json({
        message:"Venta actualizada",
        status:200,
        data: updated
    })
}


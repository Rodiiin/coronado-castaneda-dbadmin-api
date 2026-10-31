import { Request, Response } from "express";
import { ProductoRepository, productoRepository } from "../repository/ProductoRepository.js";
import { Producto } from "../entity/Producto.js";


export const getProducto = async (req:Request, resp:Response) =>{
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
        return resp.status(400).json({ message: "El id debe ser un número entero" });
    }

    const producto = await productoRepository.findById(id);

    if (!producto) {
        return resp.status(404).json({ message: "Producto no encontrado" });
    }

    return resp.json({
        message:"Producto encontrado",
        status:200,
        data: producto,
    });
}

export const getProductos = async (req:Request, resp: Response) => {
    const productos = await productoRepository.findAll();
    return resp.json({productos})
}


export const createProducto = async (req: Request, resp: Response) => {
    const {nombre, precio, stock, categoriaId} = req.body ?? {};

    if (!nombre || precio === undefined) {
        return resp.status(400).json({ message: "Se requieren 'nombre' y 'precio'" });
    }

    const producto = await productoRepository.create({nombre, precio, stock, categoriaId});

    return resp.status(201).json({
        message: "Producto creado exitosamente",
        status: 201,
        data: producto,
    })
}

export const deleteProducto = async (req: Request, resp: Response) =>{
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
        return resp.status(400).json({ message: "El id debe ser un número entero" });
    }

    const producto = await productoRepository.findById(id);

    if (!producto)
    {
        return resp.status(404).json({message: "Producto no encontrado"});
    }

    let deleted: boolean;
    try {
        deleted = await productoRepository.delete(id);
    } catch (error: any) {
        // El producto aparece en detalle_ventas (llave foránea)
        if (error?.code === "ER_ROW_IS_REFERENCED_2") {
            return resp.status(409).json({message: "No se puede eliminar: el producto está registrado en ventas"});
        }
        throw error;
    }

    if (!deleted)
    {
        return resp.status(500).json({message:"Error al eliminar producto"})
    }

    return resp.json({
        message: "Producto eliminado exitosamente",
        status: 200,
        data: producto
    })
}

export const updateProducto = async (req: Request, resp: Response) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
        return resp.status(400).json({ message: "El id debe ser un número entero" });
    }

    const producto = await productoRepository.findById(id);

    if (!producto){
        return resp.status(404).json({message: "Producto no encontrado"});
    }

    const {nombre, precio, stock, categoriaId} = req.body ?? {};

    if (nombre === undefined && precio === undefined && stock === undefined && categoriaId === undefined) {
        return resp.status(400).json({message: "Envía al menos uno de: nombre, precio, stock, categoriaId"});
    }

    const updatedProducto = await productoRepository.update(id, {nombre, precio, stock, categoriaId});

    if (!updatedProducto){
        return resp.status(500).json({message: "Error al actualizar producto"});
    }

    return resp.json({
        message: "Producto actualizado exitosamente",
        status: 200,
        data: updatedProducto
    })
}

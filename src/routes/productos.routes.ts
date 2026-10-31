import { Router } from "express";
import { createProducto, deleteProducto, getProducto, getProductos, updateProducto,   } from "../controllers/producto.controller.js";

const router = Router();

router.get('/producto/:id', getProducto);
router.get('/productos', getProductos);
router.post('/producto', createProducto);
router.put('/producto/:id', updateProducto);
router.delete('/producto/:id', deleteProducto);


export default router;
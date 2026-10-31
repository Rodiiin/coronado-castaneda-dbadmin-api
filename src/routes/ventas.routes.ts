import {Router} from "express";
import { createVenta, deleteVenta, getVenta, getVentas, updateVenta } from "../controllers/ventas.controller.js";

const router = Router();

router.get('/venta/:id', getVenta);
router.get('/ventas', getVentas);
router.post('/venta', createVenta);
router.delete('/venta/:id', deleteVenta);
router.put('/venta/:id', updateVenta);

export default router;



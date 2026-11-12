import { Router } from "express";
import { addPaqueteAlmacen } from "../controllers/almacenes.controller.js";

const router = Router();

router.post('/almacenes/:id/paquetes', addPaqueteAlmacen);

export default router;

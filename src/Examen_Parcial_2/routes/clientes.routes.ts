import { Router } from "express";
import { getEnviosCliente } from "../controllers/clientes.controller.js";

const router = Router();

router.get('/clientes/:id/envios', getEnviosCliente);

export default router;

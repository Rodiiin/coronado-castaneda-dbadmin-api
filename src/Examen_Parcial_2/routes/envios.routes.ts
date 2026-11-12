import { Router } from "express";
import { addRastreoEnvio, createEnvio, getEnviosActivos, updateCostoEnvio } from "../controllers/envios.controller.js";

const router = Router();

router.post('/envios', createEnvio);
router.put('/envios/:id/costo', updateCostoEnvio);
router.post('/envios/:id/rastreo', addRastreoEnvio);
router.get('/envios', getEnviosActivos);

export default router;

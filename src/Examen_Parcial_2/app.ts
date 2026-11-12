import express, { NextFunction, Request, Response } from 'express';
import enviosRoutes from './routes/envios.routes.js'
import almacenesRoutes from './routes/almacenes.routes.js'
import clientesRoutes from './routes/clientes.routes.js'

const app = express();

// Middleware para parsear JSON
app.use(express.json());
app.use("/api/", enviosRoutes);
app.use("/api/", almacenesRoutes);
app.use("/api/", clientesRoutes);

// Ruta de prueba/salud
app.get('/api/status', (req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'API LogiExpress funcionando correctamente' });
});

// Errores no controlados (JSON mal formado, fallas de BD, etc.)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err?.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'El cuerpo de la petición no es un JSON válido', status: 400, data: null });
  }
  console.error(err);
  res.status(500).json({ message: 'Error interno del servidor', status: 500, data: null });
});

export default app;

import express, { Request, Response } from 'express';
import userRoutes from './routes/user.routes.js'
import productoRoutes from './routes/productos.routes.js'
import ventasRoutes from './routes/ventas.routes.js'

const app = express();

// Middleware para parsear JSON
app.use(express.json());
app.use("/api/", userRoutes)
app.use("/api/", productoRoutes);
app.use("/api/", ventasRoutes)

// Ruta de prueba/salud
app.get('/api/status', (req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'API funcionando correctamente' });
});

export default app;

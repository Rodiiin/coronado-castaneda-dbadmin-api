import 'reflect-metadata';
import { config } from 'dotenv';
import { fileURLToPath } from 'node:url';

// Usa el mismo .env que docker-compose (puerto 3008, BD logiexpress, contraseña)
config({ path: fileURLToPath(new URL('./.env', import.meta.url)), quiet: true });

// Importación dinámica para que data-source lea las variables ya cargadas
const { default: app } = await import('./app.js');
const { connectDatabase } = await import('./config/db.js');

const PORT = process.env.PORT || 3001;

await connectDatabase();

app.listen(PORT, () => {
  console.log(`Servidor LogiExpress corriendo en http://localhost:${PORT}`);
});

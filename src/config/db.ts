import { AppDataSource } from "./data-source.js";

export const connectDatabase = async () => {
    try {
        await AppDataSource.initialize();
        console.log("¡Conexión exitosa a la base de datos ventas_db!");
    } catch (error) {
        console.error("Error al conectar con la base de datos:", error);
        process.exit(1);
    }
};
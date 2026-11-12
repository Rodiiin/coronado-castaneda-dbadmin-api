import "reflect-metadata";
import { DataSource } from "typeorm";
import { Cliente } from "../entity/Cliente.js";
import { Direccion } from "../entity/Direccion.js";
import { Almacen } from "../entity/Almacen.js";
import { Envio } from "../entity/Envio.js";
import { Paquete } from "../entity/Paquete.js";
import { HistorialRastreo } from "../entity/HistorialRastreo.js";
import { AuditoriaEnvio } from "../entity/AuditoriaEnvio.js";



export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.MYSQL_HOST || "127.0.0.1",
    port: Number(process.env.MYSQL_PORT || 3008),
    username: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_ROOT_PASSWORD || "secret",
    database: process.env.MYSQL_DATABASE || "logiexpress",
    synchronize: false, // Las tablas, triggers y datos se crean con los scripts de sql_scripts/
    logging: true,
    entities: [Cliente, Direccion, Almacen, Envio, Paquete, HistorialRastreo, AuditoriaEnvio],
    subscribers: [],
    migrations: [],
});

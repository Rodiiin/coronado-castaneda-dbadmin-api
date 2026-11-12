import { QueryFailedError } from "typeorm";

// Campos que agrega el driver mysql2 a los errores de MySQL
type MysqlDriverError = Error & { errno?: number; sqlState?: string; sqlMessage?: string };

const driverError = (error: unknown): MysqlDriverError | null =>
    error instanceof QueryFailedError ? (error.driverError as MysqlDriverError) : null;

// Error lanzado por un trigger con SIGNAL SQLSTATE '45000' (ej. before_insert_paquete_almacen)
export const esErrorDeTrigger = (error: unknown): boolean =>
    driverError(error)?.sqlState === "45000";

// Se intentó guardar una llave foránea que no existe (ER_NO_REFERENCED_ROW_2)
export const esErrorDeLlaveForanea = (error: unknown): boolean =>
    driverError(error)?.errno === 1452;

// Mensaje original de MySQL (el MESSAGE_TEXT del SIGNAL en el caso de los triggers)
export const mensajeMysql = (error: unknown): string =>
    driverError(error)?.sqlMessage ?? (error instanceof Error ? error.message : String(error));

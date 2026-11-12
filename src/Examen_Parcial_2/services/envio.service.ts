import { AppDataSource } from "../config/data-source.js";
import { Envio } from "../entity/Envio.js";
import type { EstadoEnvio } from "../entity/EstadoEnvio.js";
import { Paquete } from "../entity/Paquete.js";
import { HistorialRastreo } from "../entity/HistorialRastreo.js";


export interface PaqueteInput {
    peso: number;
    largo: number;
    ancho: number;
    contenido: string;
    almacenId: number | null;
}

export interface EnvioInput {
    remitenteDircId: number;
    destinatarioDircId: number;
    costoTotal: number;
    paquetes: PaqueteInput[];
}

export interface RastreoInput {
    ubicacionActual: string;
    estadoEvento: EstadoEnvio;
    observaciones: string | null;
}

// Estados que se consideran "activos" (aún no concluyen)
const ESTADOS_ACTIVOS: EstadoEnvio[] = ["REGISTRADO", "EN_TRANSITO"];

export class EnvioService {
    private repository = AppDataSource.getRepository(Envio);
    private rastreoRepository = AppDataSource.getRepository(HistorialRastreo);

    async findById(id: number): Promise<Envio | null> {
        return await this.repository.findOne({
            where: { id },
            relations: {
                remitente: { cliente: true },
                destinatario: { cliente: true },
                paquetes: { almacen: true },
                historial: true,
                auditorias: true
            },
            order: {
                historial: { fecha: "ASC" },
                auditorias: { fechaModificacion: "DESC", id: "DESC" }
            }
        });
    }

    // Endpoint 5: envíos activos con sus clientes y paquetes
    async findActivos(): Promise<Envio[]> {
        return await this.repository
            .createQueryBuilder("envio")
            .leftJoinAndSelect("envio.remitente", "remitente")
            .leftJoinAndSelect("remitente.cliente", "clienteRemitente")
            .leftJoinAndSelect("envio.destinatario", "destinatario")
            .leftJoinAndSelect("destinatario.cliente", "clienteDestinatario")
            .leftJoinAndSelect("envio.paquetes", "paquetes")
            .where("envio.estado IN (:...estados)", { estados: ESTADOS_ACTIVOS })
            .orderBy("envio.fecha", "DESC")
            .getMany();
    }

    // Endpoint 6: envíos donde el cliente aparece como remitente o destinatario
    async findByCliente(clienteId: number): Promise<Envio[]> {
        return await this.repository
            .createQueryBuilder("envio")
            .leftJoinAndSelect("envio.remitente", "remitente")
            .leftJoinAndSelect("remitente.cliente", "clienteRemitente")
            .leftJoinAndSelect("envio.destinatario", "destinatario")
            .leftJoinAndSelect("destinatario.cliente", "clienteDestinatario")
            .leftJoinAndSelect("envio.paquetes", "paquetes")
            .leftJoinAndSelect("envio.historial", "historial")
            .where("remitente.clienteId = :clienteId OR destinatario.clienteId = :clienteId", { clienteId })
            .orderBy("envio.fecha", "DESC")
            .addOrderBy("historial.fecha", "ASC")
            .getMany();
    }

    // Endpoint 1: el envío y sus paquetes se guardan en una sola transacción.
    // Si un paquete excede la capacidad de su almacén, el trigger aborta todo.
    async create(data: EnvioInput): Promise<Envio | null> {
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        let envioId: number;
        try {
            const envio = queryRunner.manager.create(Envio, {
                remitenteDircId: data.remitenteDircId,
                destinatarioDircId: data.destinatarioDircId,
                costoTotal: data.costoTotal
            });
            const guardado = await queryRunner.manager.save(envio);
            envioId = guardado.id;

            // Uno por uno para que el trigger BEFORE INSERT valide cada paquete
            for (const paquete of data.paquetes) {
                await queryRunner.manager.save(
                    queryRunner.manager.create(Paquete, { ...paquete, envioId })
                );
            }

            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }

        return await this.findById(envioId);
    }

    // Endpoint 2: el UPDATE detona el trigger after_update_envio_costo
    async updateCosto(id: number, costoTotal: number): Promise<Envio | null> {
        await this.repository.update({ id }, { costoTotal });
        return await this.findById(id);
    }

    // Endpoint 4: el INSERT detona el trigger after_insert_historial_rastreo
    async addRastreo(envioId: number, data: RastreoInput): Promise<HistorialRastreo> {
        const rastreo = this.rastreoRepository.create({ ...data, envioId });
        return await this.rastreoRepository.save(rastreo);
    }
}

export const envioService = new EnvioService();

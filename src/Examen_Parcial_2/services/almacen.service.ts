import { AppDataSource } from "../config/data-source.js";
import { Almacen } from "../entity/Almacen.js";
import { Paquete } from "../entity/Paquete.js";


export interface PaqueteAlmacenInput {
    envioId: number;
    peso: number;
    largo: number;
    ancho: number;
    contenido: string;
}

export class AlmacenService {
    private repository = AppDataSource.getRepository(Almacen);
    private paqueteRepository = AppDataSource.getRepository(Paquete);

    async findById(id: number): Promise<Almacen | null> {
        return await this.repository.findOneBy({ id });
    }

    async countPaquetes(almacenId: number): Promise<number> {
        return await this.paqueteRepository.countBy({ almacenId });
    }

    // Endpoint 3: el INSERT detona el trigger before_insert_paquete_almacen,
    // que lanza SQLSTATE 45000 si el almacén ya está lleno
    async addPaquete(almacenId: number, data: PaqueteAlmacenInput): Promise<Paquete> {
        const paquete = this.paqueteRepository.create({ ...data, almacenId });
        return await this.paqueteRepository.save(paquete);
    }
}

export const almacenService = new AlmacenService();

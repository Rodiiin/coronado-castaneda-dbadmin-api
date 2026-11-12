import { AppDataSource } from "../config/data-source.js";
import { Cliente } from "../entity/Cliente.js";


export class ClienteService {
    private repository = AppDataSource.getRepository(Cliente);

    async findById(id: number): Promise<Cliente | null> {
        return await this.repository.findOneBy({ id });
    }
}

export const clienteService = new ClienteService();

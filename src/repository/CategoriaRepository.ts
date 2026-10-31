import { AppDataSource } from "../config/data-source.js";
import { Categoria } from "../entity/Categoria.js";



export class CategoriaRepository {
    private repository = AppDataSource.getRepository(Categoria);

    async findAll(): Promise<Categoria[]> {
        return await this.repository.find({
            relations: { productos: true }
        });
    }

    async findById(id: number): Promise<Categoria | null> {
        return await this.repository.findOne({
            where: { categoriaId: id },
            relations: { productos: true }
        });
    }

    async findByNombre(nombre: string): Promise<Categoria | null> {
        return await this.repository.findOne({
            where: { nombre },
            relations: { productos: true }
        });
    }

    async save(categoria: Categoria): Promise<Categoria> {
        return await this.repository.save(categoria);
    }

    async create(categoriaData: Partial<Categoria>): Promise<Categoria> {
        const categoria = this.repository.create(categoriaData);
        return await this.repository.save(categoria);
    }

    async update(id: number, categoriaData: Partial<Categoria>): Promise<Categoria | null> {
        await this.repository.update(id, categoriaData);
        return await this.findById(id);
    }

    async delete(id: number): Promise<boolean> {
        const result = await this.repository.delete(id);
        return result.affected !== 0;
    }
}

export const categoriaRepository = new CategoriaRepository();

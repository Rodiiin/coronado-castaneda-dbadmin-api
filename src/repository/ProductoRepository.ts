import { AppDataSource } from "../config/data-source.js";
import { Producto } from "../entity/Producto.js";



export class ProductoRepository {
    private repository = AppDataSource.getRepository(Producto);

    async findAll(): Promise<Producto[]> {
        return await this.repository.find({
            relations: { categoria: true }
        });
    }

    async findById(id: number): Promise<Producto | null> {
        return await this.repository.findOne({
            where: { productoId: id },
            relations: { categoria: true }
        });
    }

    async findByCategoria(categoriaId: number): Promise<Producto[]> {
        return await this.repository.find({
            where: { categoriaId },
            relations: { categoria: true, detallesVenta: true }
        });
    }

    async save(producto: Producto): Promise<Producto> {
        return await this.repository.save(producto);
    }

    async create(productoData: Partial<Producto>): Promise<Producto> {
        const producto = this.repository.create(productoData);
        return await this.repository.save(producto);
    }

    async update(id: number, productoData: Partial<Producto>): Promise<Producto | null> {
        await this.repository.update(id, productoData);
        return await this.findById(id);
    }

    async updateStock(id: number, cantidad: number): Promise<Producto | null> {
        const producto = await this.findById(id);
        if (!producto) return null;
        producto.stock += cantidad;
        return await this.repository.save(producto);
    }

    async delete(id: number): Promise<boolean> {
        const result = await this.repository.delete(id);
        return result.affected !== 0;
    }
}

export const productoRepository = new ProductoRepository();

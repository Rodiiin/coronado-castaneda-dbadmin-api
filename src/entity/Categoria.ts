import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Producto } from "./Producto.js";

@Entity("categorias")
export class Categoria {
    @PrimaryGeneratedColumn({ name: "categoria_id" })
    categoriaId!: number;

    @Column({ type: "varchar", length: 50, nullable: false })
    nombre!: string;

    // Relación Uno a Muchos: Una categoría tiene muchos productos
    @OneToMany(() => Producto, (producto) => producto.categoria)
    productos!: Producto[];
}

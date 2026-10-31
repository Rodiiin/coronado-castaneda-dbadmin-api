import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Categoria } from "./Categoria.js";
import { DetalleVenta } from "./DetalleVenta.js";




@Entity("productos")
export class Producto {
    @PrimaryGeneratedColumn({ name: "producto_id" })
    productoId!: number;

    @Column({ type: "varchar", length: 100, nullable: false })
    nombre!: string;

    @Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
    precio!: number;

    @Column({ type: "int", default: 0 })
    stock!: number;

    @Column({type: "int",  name: "categoria_id", nullable: true })
    categoriaId!: number;

    // Relación Muchos a Uno: Muchos productos pertenecen a una categoría
    @ManyToOne(() => Categoria, (categoria) => categoria.productos, { onDelete: "SET NULL" })
    @JoinColumn({ name: "categoria_id" })
    categoria!: Categoria;

    // Relación Uno a Muchos: Un producto puede estar en varios detalles de venta
    @OneToMany(() => DetalleVenta, (detalle) => detalle.producto)
    detallesVenta!: DetalleVenta[];
}

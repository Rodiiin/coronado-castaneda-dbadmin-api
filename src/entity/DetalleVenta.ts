import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Venta } from "./Venta.js";
import { Producto } from "./Producto.js";



@Entity("detalle_ventas")
export class DetalleVenta {
    @PrimaryGeneratedColumn({ name: "detalle_id" })
    detalleId!: number;

    @Column({type: "int", name: "venta_id" })
    ventaId!: number;

    @Column({type:"int", name: "producto_id" })
    productoId!: number;

    @Column({ type: "int", nullable: false })
    cantidad!: number;

    @Column({ type: "decimal", precision: 10, scale: 2, name: "precio_unitario", nullable: false })
    precioUnitario!: number;

    @Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
    subtotal!: number;

    // Relación Muchos a Uno con Venta
    @ManyToOne(() => Venta, (venta) => venta.detalles, { onDelete: "CASCADE" })
    @JoinColumn({ name: "venta_id" })
    venta!: Venta;

    // Relación Muchos a Uno con Producto
    @ManyToOne(() => Producto, (producto) => producto.detallesVenta)
    @JoinColumn({ name: "producto_id" })
    producto!: Producto;
}

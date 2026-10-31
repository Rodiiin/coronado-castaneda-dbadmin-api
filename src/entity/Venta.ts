import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { DetalleVenta } from "./DetalleVenta.js";


@Entity("ventas")
export class Venta {
    @PrimaryGeneratedColumn({ name: "venta_id" })
    ventaId!: number;

    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    fecha!: Date;

    @Column({ type: "varchar", length: 100, nullable: false })
    cliente!: string;

    @Column({ type: "decimal", precision: 10, scale: 2, default: 0.00 })
    total!: number;

    // Relación Uno a Muchos con operaciones en cascada
    @OneToMany(() => DetalleVenta, (detalle) => detalle.venta, { cascade: true })
    detalles!: DetalleVenta[];
}

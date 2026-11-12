import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Envio } from "./Envio.js";
import { Almacen } from "./Almacen.js";


@Entity("paquete")
export class Paquete {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "int", name: "envio_id", nullable: false })
    envioId!: number;

    @Column({ type: "int", name: "almacen_id", nullable: true })
    almacenId!: number | null;

    @Column({ type: "float", nullable: false })
    peso!: number;

    @Column({ type: "int", nullable: false })
    largo!: number;

    @Column({ type: "int", nullable: false })
    ancho!: number;

    @Column({ type: "varchar", length: 120, nullable: false })
    contenido!: string;

    // Relación Muchos a Uno con Envio
    @ManyToOne(() => Envio, (envio) => envio.paquetes, { onDelete: "CASCADE" })
    @JoinColumn({ name: "envio_id" })
    envio!: Envio;

    // Relación Muchos a Uno con Almacen
    @ManyToOne(() => Almacen, (almacen) => almacen.paquetes, { onDelete: "SET NULL" })
    @JoinColumn({ name: "almacen_id" })
    almacen!: Almacen | null;
}

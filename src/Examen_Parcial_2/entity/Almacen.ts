import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Direccion } from "./Direccion.js";
import { Paquete } from "./Paquete.js";


@Entity("almacen")
export class Almacen {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 60, nullable: false })
    nombre!: string;

    @Column({ type: "int", name: "direccion_id", nullable: false })
    direccionId!: number;

    @Column({ type: "int", name: "capacidad_maxima_paquetes", nullable: false })
    capacidadMaximaPaquetes!: number;

    // Relación Muchos a Uno: Ubicación del almacén
    @ManyToOne(() => Direccion, (direccion) => direccion.almacenes)
    @JoinColumn({ name: "direccion_id" })
    direccion!: Direccion;

    // Relación Uno a Muchos: Paquetes resguardados en el almacén
    @OneToMany(() => Paquete, (paquete) => paquete.almacen)
    paquetes!: Paquete[];
}

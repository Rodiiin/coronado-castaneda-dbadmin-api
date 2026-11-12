import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Direccion } from "./Direccion.js";


export type EstadoCliente = "ACTIVO" | "INACTIVO";

@Entity("cliente")
export class Cliente {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 40, nullable: false })
    nombre!: string;

    @Column({ type: "varchar", length: 40, nullable: false })
    apellido!: string;

    @Column({ type: "enum", enum: ["ACTIVO", "INACTIVO"], default: "ACTIVO" })
    estado!: EstadoCliente;

    @Column({ type: "decimal", precision: 10, scale: 2, name: "limite_credito", nullable: false })
    limiteCredito!: number;

    // Relación Uno a Muchos: Un cliente tiene varias direcciones (origen / destino)
    @OneToMany(() => Direccion, (direccion) => direccion.cliente)
    direcciones!: Direccion[];
}

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Cliente } from "./Cliente.js";
import { Envio } from "./Envio.js";
import { Almacen } from "./Almacen.js";


@Entity("direccion")
export class Direccion {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "int", name: "cliente_id", nullable: false })
    clienteId!: number;

    @Column({ type: "varchar", length: 100, nullable: false })
    calle!: string;

    @Column({ type: "int", nullable: false })
    numero!: number;

    @Column({ type: "varchar", length: 40, nullable: false })
    colonia!: string;

    @Column({ type: "varchar", length: 100, nullable: false })
    ciudad!: string;

    @Column({ type: "varchar", length: 40, nullable: false })
    estado!: string;

    @Column({ type: "varchar", length: 40, nullable: false })
    pais!: string;

    @Column({ type: "varchar", length: 80, nullable: true })
    cruzamiento!: string | null;

    @Column({ type: "varchar", length: 40, nullable: false })
    continente!: string;

    // Relación Muchos a Uno: Muchas direcciones pertenecen a un cliente
    @ManyToOne(() => Cliente, (cliente) => cliente.direcciones, { onDelete: "CASCADE" })
    @JoinColumn({ name: "cliente_id" })
    cliente!: Cliente;

    // Envíos donde esta dirección es el origen
    @OneToMany(() => Envio, (envio) => envio.remitente)
    enviosRemitente!: Envio[];

    // Envíos donde esta dirección es el destino
    @OneToMany(() => Envio, (envio) => envio.destinatario)
    enviosDestinatario!: Envio[];

    @OneToMany(() => Almacen, (almacen) => almacen.direccion)
    almacenes!: Almacen[];
}

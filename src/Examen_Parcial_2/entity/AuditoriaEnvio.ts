import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Envio } from "./Envio.js";


@Entity("auditoria_envios")
export class AuditoriaEnvio {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "int", name: "envio_id", nullable: false })
    envioId!: number;

    @Column({ type: "decimal", precision: 10, scale: 2, name: "costo_anterior", nullable: false })
    costoAnterior!: number;

    @Column({ type: "decimal", precision: 10, scale: 2, name: "costo_nuevo", nullable: false })
    costoNuevo!: number;

    @Column({ type: "varchar", length: 40, nullable: false })
    usuario!: string;

    @Column({ type: "datetime", name: "fecha_modificacion", default: () => "CURRENT_TIMESTAMP" })
    fechaModificacion!: Date;

    // Relación Muchos a Uno con Envio
    @ManyToOne(() => Envio, (envio) => envio.auditorias, { onDelete: "CASCADE" })
    @JoinColumn({ name: "envio_id" })
    envio!: Envio;
}

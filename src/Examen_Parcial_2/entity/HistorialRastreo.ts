import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Envio } from "./Envio.js";
import { ESTADOS_ENVIO } from "./EstadoEnvio.js";
import type { EstadoEnvio } from "./EstadoEnvio.js";


@Entity("historial_rastreo")
export class HistorialRastreo {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "int", name: "envio_id", nullable: false })
    envioId!: number;

    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    fecha!: Date;

    @Column({ type: "varchar", length: 120, name: "ubicacion_actual", nullable: false })
    ubicacionActual!: string;

    @Column({ type: "enum", enum: ESTADOS_ENVIO, name: "estado_evento", nullable: false })
    estadoEvento!: EstadoEnvio;

    @Column({ type: "varchar", length: 120, nullable: true })
    observaciones!: string | null;

    // Relación Muchos a Uno con Envio
    @ManyToOne(() => Envio, (envio) => envio.historial, { onDelete: "CASCADE" })
    @JoinColumn({ name: "envio_id" })
    envio!: Envio;
}

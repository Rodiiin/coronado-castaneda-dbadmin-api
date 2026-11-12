import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Direccion } from "./Direccion.js";
import { Paquete } from "./Paquete.js";
import { HistorialRastreo } from "./HistorialRastreo.js";
import { AuditoriaEnvio } from "./AuditoriaEnvio.js";
import { ESTADOS_ENVIO } from "./EstadoEnvio.js";
import type { EstadoEnvio } from "./EstadoEnvio.js";


@Entity("envios")
export class Envio {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "int", name: "remitente_dirc_id", nullable: false })
    remitenteDircId!: number;

    @Column({ type: "int", name: "destinatario_dirc_id", nullable: false })
    destinatarioDircId!: number;

    @Column({ type: "decimal", precision: 10, scale: 2, name: "costo_total", nullable: false })
    costoTotal!: number;

    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    fecha!: Date;

    @Column({ type: "enum", enum: ESTADOS_ENVIO, default: "REGISTRADO" })
    estado!: EstadoEnvio;

    // Relación Muchos a Uno: Dirección de origen (remitente)
    @ManyToOne(() => Direccion, (direccion) => direccion.enviosRemitente)
    @JoinColumn({ name: "remitente_dirc_id" })
    remitente!: Direccion;

    // Relación Muchos a Uno: Dirección de destino (destinatario)
    @ManyToOne(() => Direccion, (direccion) => direccion.enviosDestinatario)
    @JoinColumn({ name: "destinatario_dirc_id" })
    destinatario!: Direccion;

    // Relación Uno a Muchos: Paquetes contenidos en el envío
    @OneToMany(() => Paquete, (paquete) => paquete.envio)
    paquetes!: Paquete[];

    // Relación Uno a Muchos: Bitácora de rastreo
    @OneToMany(() => HistorialRastreo, (rastreo) => rastreo.envio)
    historial!: HistorialRastreo[];

    // Relación Uno a Muchos: Cambios de costo registrados por el trigger
    @OneToMany(() => AuditoriaEnvio, (auditoria) => auditoria.envio)
    auditorias!: AuditoriaEnvio[];
}

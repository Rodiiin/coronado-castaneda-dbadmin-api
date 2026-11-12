// En archivo aparte para evitar la importación circular Envio <-> HistorialRastreo
export const ESTADOS_ENVIO = ["REGISTRADO", "EN_TRANSITO", "ENTREGADO", "CANCELADO"] as const;
export type EstadoEnvio = typeof ESTADOS_ENVIO[number];

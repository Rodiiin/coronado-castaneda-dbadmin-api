export const esEnteroPositivo = (valor: unknown): valor is number =>
    typeof valor === "number" && Number.isInteger(valor) && valor > 0;

export const esNumeroPositivo = (valor: unknown): valor is number =>
    typeof valor === "number" && Number.isFinite(valor) && valor > 0;

export const esNumeroNoNegativo = (valor: unknown): valor is number =>
    typeof valor === "number" && Number.isFinite(valor) && valor >= 0;

export const esTextoNoVacio = (valor: unknown): valor is string =>
    typeof valor === "string" && valor.trim().length > 0;

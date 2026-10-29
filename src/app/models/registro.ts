export type EstadoRegistro = 'pendiente' | 'aprobada' | 'rechazada';

export const ESTADOS: readonly EstadoRegistro[] = ['pendiente', 'aprobada', 'rechazada'];

export interface Item {
  recurso: string;
  cantidad: number;
}

export interface Registro {
  id: number;
  responsable: string;
  espacio: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  asistentes: number;
  items: Item[];
  estado: EstadoRegistro;
}

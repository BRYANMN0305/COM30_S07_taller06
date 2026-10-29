import { computed, Injectable, signal } from '@angular/core';
import { EstadoRegistro, Registro } from '../models/registro';

@Injectable({ providedIn: 'root' })
export class RegistroService {
  private readonly registrosSignal = signal<Registro[]>([]);

  readonly registros = this.registrosSignal.asReadonly();
  readonly total = computed(() => this.registrosSignal().length);
  readonly pendientes = computed(
    () => this.registrosSignal().filter((registro) => registro.estado === 'pendiente').length,
  );

  agregar(registro: Omit<Registro, 'id'>): void {
    const nuevo: Registro = { ...registro, id: this.proximoId() };

    this.registrosSignal.update((registros) => [...registros, nuevo]);
  }

  cambiarEstado(id: number, estado: EstadoRegistro): void {
    this.registrosSignal.update((registros) =>
      registros.map((registro) => (registro.id === id ? { ...registro, estado } : registro)),
    );
  }

  eliminar(id: number): void {
    this.registrosSignal.update((registros) => registros.filter((registro) => registro.id !== id));
  }

  private proximoId(): number {
    const registros = this.registrosSignal();

    return registros.length === 0 ? 1 : Math.max(...registros.map((registro) => registro.id)) + 1;
  }
}

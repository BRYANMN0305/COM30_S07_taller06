import { computed, Injectable, signal } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { EstadoRegistro, Registro } from '../models/registro';
import { REGISTROS_SEMILLA } from './registro.seed';

@Injectable({ providedIn: 'root' })
export class RegistroService {
  private readonly registrosSignal = signal<Registro[]>(clonarSemilla(REGISTROS_SEMILLA));
  private readonly llamadasSignal = signal(0);

  readonly registros = this.registrosSignal.asReadonly();
  readonly llamadas = this.llamadasSignal.asReadonly();
  readonly total = computed(() => this.registrosSignal().length);
  readonly pendientes = computed(
    () => this.registrosSignal().filter((registro) => registro.estado === 'pendiente').length,
  );

  buscar(texto: string): Observable<Registro[]> {
    const termino = normalizarTexto(texto);
    const retardo = Math.max(150, 1500 - 300 * termino.length);
    const encontrados = this.registrosSignal().filter((registro) =>
      [registro.responsable, registro.espacio].some((campo) =>
        normalizarTexto(campo).includes(termino),
      ),
    );

    this.llamadasSignal.update((llamadas) => llamadas + 1);

    return of(encontrados).pipe(delay(retardo));
  }

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

function normalizarTexto(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

function clonarSemilla(registros: readonly Registro[]): Registro[] {
  return registros.map((registro) => ({
    ...registro,
    items: registro.items.map((item) => ({ ...item })),
  }));
}

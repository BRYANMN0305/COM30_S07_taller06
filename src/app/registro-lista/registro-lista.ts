import { Component, computed, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  debounceTime,
  distinctUntilChanged,
  finalize,
  map,
  Observable,
  of,
  share,
  switchMap,
} from 'rxjs';
import { ESTADOS, EstadoRegistro, Registro } from '../models/registro';
import { RegistroService } from '../services/registro.service';

@Component({
  selector: 'app-registro-lista',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registro-lista.html',
  styleUrl: './registro-lista.css',
})
export class RegistroLista {
  private readonly registroService = inject(RegistroService);

  readonly estado = input<string | undefined>(undefined);

  protected readonly busqueda = new FormControl('', { nonNullable: true });
  protected readonly buscando = signal(false);
  protected readonly historial = signal<string[]>([]);
  protected readonly estados = ESTADOS;
  protected readonly llamadas = this.registroService.llamadas;

  private readonly terminos$ = this.busqueda.valueChanges.pipe(
    map((texto) => texto.trim()),
    debounceTime(300),
    distinctUntilChanged(),
    share(),
  );

  private readonly resultados$ = this.terminos$.pipe(
    switchMap((texto) => this.consultar(texto)),
  );

  protected readonly resultados = toSignal(this.resultados$, {
    initialValue: [] as Registro[],
  });

  protected readonly texto = toSignal(this.busqueda.valueChanges, {
    initialValue: this.busqueda.value,
  });

  protected readonly consultaActiva = computed(() => this.texto().trim().length >= 2);

  protected readonly resultadosVivos = computed(() => {
    const porId = new Map(
      this.registroService.registros().map((registro) => [registro.id, registro]),
    );

    return this.resultados()
      .map((registro) => porId.get(registro.id))
      .filter((registro): registro is Registro => registro !== undefined);
  });

  protected readonly base = computed(() =>
    this.consultaActiva() ? this.resultadosVivos() : this.registroService.registros(),
  );

  private readonly estadoUrl = computed(() => {
    const valor = (this.estado() ?? '').trim().toLowerCase();

    return valor === 'todos' ? '' : valor;
  });

  protected readonly filtroActual = computed(() => this.estadoUrl() || 'todos');

  protected readonly filtroValido = computed<EstadoRegistro | null>(() => {
    const valor = this.estadoUrl();

    return (ESTADOS as readonly string[]).includes(valor) ? (valor as EstadoRegistro) : null;
  });

  protected readonly visibles = computed(() => {
    const valor = this.estadoUrl();
    const base = this.base();

    if (!valor) {
      return base;
    }

    const filtro = this.filtroValido();

    return filtro === null ? [] : base.filter((registro) => registro.estado === filtro);
  });

  protected readonly total = computed(() => this.base().length);
  protected readonly mostrando = computed(() => this.visibles().length);

  protected readonly conteos = computed(() => {
    const base = this.base();

    return {
      pendiente: base.filter((registro) => registro.estado === 'pendiente').length,
      aprobada: base.filter((registro) => registro.estado === 'aprobada').length,
      rechazada: base.filter((registro) => registro.estado === 'rechazada').length,
    };
  });

  constructor() {
    this.terminos$
      .pipe(takeUntilDestroyed())
      .subscribe((texto) => {
        if (texto.length < 2) {
          return;
        }

        this.historial.update((historial) =>
          [texto, ...historial.filter((termino) => termino !== texto)].slice(0, 5),
        );
      });
  }

  protected cambiarEstado(id: number, estado: string): void {
    this.registroService.cambiarEstado(id, estado as EstadoRegistro);
  }

  protected eliminar(id: number): void {
    this.registroService.eliminar(id);
  }

  protected codigo(id: number): string {
    return `R${id.toString().padStart(2, '0')}`;
  }

  private consultar(texto: string): Observable<Registro[]> {
    if (texto.length < 2) {
      this.buscando.set(false);
      return of([]);
    }

    this.buscando.set(true);

    return this.registroService
      .buscar(texto)
      .pipe(finalize(() => this.buscando.set(false)));
  }
}

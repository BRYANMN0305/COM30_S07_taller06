import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, map, scan } from 'rxjs';
import { RegistroService } from '../services/registro.service';
import { DESDE, HASTA, M, PATRON_CODIGO, TOPE } from './parametros';
import { hastaMayorQueDesde, multiploDe, rangoCantidad } from './validadores';

type Parcial2Form = FormGroup<{
  codigo: FormControl<string>;
  cantidad: FormControl<number>;
  desde: FormControl<number>;
  hasta: FormControl<number>;
}>;

interface EstadoBusqueda {
  valor: string;
  total: number;
}

const BUSQUEDA_INICIAL: EstadoBusqueda = { valor: '', total: 0 };

@Component({
  selector: 'app-parcial2',
  imports: [ReactiveFormsModule],
  templateUrl: './parcial2.html',
  styleUrl: './parcial2.css',
})
export class Parcial2 {
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly registroService = inject(RegistroService);
  private readonly router = inject(Router);

  protected readonly m = M;
  protected readonly tope = TOPE;
  protected readonly busqueda = new FormControl('', { nonNullable: true });

  protected readonly form: Parcial2Form = this.fb.group(
    {
      codigo: ['', [Validators.required, Validators.pattern(PATRON_CODIGO)]],
      cantidad: [M, [Validators.required, rangoCantidad(1, TOPE), multiploDe(M)]],
      desde: [DESDE, Validators.required],
      hasta: [HASTA, Validators.required],
    },
    { validators: [hastaMayorQueDesde] },
  );

  private readonly estadoBusqueda = toSignal(
    this.busqueda.valueChanges.pipe(
      map((texto) => texto.trim()),
      debounceTime(300),
      distinctUntilChanged(),
      scan(
        (estado, valor) => ({ valor, total: estado.total + 1 }),
        BUSQUEDA_INICIAL,
      ),
    ),
    { initialValue: BUSQUEDA_INICIAL },
  );

  protected readonly ultimoValor = computed(() => this.estadoBusqueda().valor);
  protected readonly emisiones = computed(() => this.estadoBusqueda().total);
  protected readonly totalRegistros = computed(() => this.registroService.registros().length);

  protected readonly visibles = computed(() => {
    const termino = normalizar(this.ultimoValor());
    const registros = this.registroService.registros();

    if (!termino) {
      return registros;
    }

    return registros.filter(
      (registro) =>
        normalizar(registro.responsable).includes(termino) ||
        normalizar(registro.espacio).includes(termino),
    );
  });

  protected guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { codigo, cantidad } = this.form.getRawValue();

    void this.router.navigate(['/parcial2/detalle', codigo], {
      queryParams: { cantidad },
    });
  }
}

function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

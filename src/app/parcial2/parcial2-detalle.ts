import { Component, computed, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map } from 'rxjs';
import { M, PATRON_CODIGO, TOPE } from './parametros';

@Component({
  selector: 'app-parcial2-detalle',
  imports: [RouterLink],
  templateUrl: './parcial2-detalle.html',
  styleUrl: './parcial2-detalle.css',
})
export class Parcial2Detalle {
  private readonly router = inject(Router);

  readonly codigo = input.required<string>();
  readonly cantidad = input<string | number | undefined>(undefined);

  protected readonly m = M;
  protected readonly tope = TOPE;

  protected readonly direccion = toSignal(
    this.router.events.pipe(
      filter((evento): evento is NavigationEnd => evento instanceof NavigationEnd),
      map(() => this.router.url),
    ),
    { initialValue: this.router.url },
  );

  protected readonly formatoValido = computed(() => PATRON_CODIGO.test(this.codigo().trim()));

  protected readonly cantidadNumero = computed(() => {
    const valor = Number(this.cantidad());

    return Number.isFinite(valor) ? valor : 0;
  });

  protected readonly bloques = computed(() => this.cantidadNumero() / M);
  protected readonly margen = computed(() => TOPE - this.cantidadNumero());
}

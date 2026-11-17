import { TitleCasePipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RegistroService } from '../services/registro.service';

@Component({
  selector: 'app-registro-detalle',
  imports: [RouterLink, TitleCasePipe],
  templateUrl: './registro-detalle.html',
  styleUrl: './registro-detalle.css',
})
export class RegistroDetalle {
  private readonly registroService = inject(RegistroService);

  readonly id = input.required<string>();

  private readonly numero = computed(() => {
    const valor = this.id().trim().toUpperCase();
    const coincidencia = /^R(\d+)$/.exec(valor);

    return coincidencia ? Number(coincidencia[1]) : Number.NaN;
  });

  protected readonly codigo = computed(() => {
    const numero = this.numero();

    return Number.isNaN(numero)
      ? this.id().trim().toUpperCase()
      : `R${numero.toString().padStart(2, '0')}`;
  });

  protected readonly registro = computed(() => {
    const numero = this.numero();

    return Number.isNaN(numero)
      ? undefined
      : this.registroService.registros().find((registro) => registro.id === numero);
  });
}

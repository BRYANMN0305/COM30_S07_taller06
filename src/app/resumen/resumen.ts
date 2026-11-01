import { Component, computed, inject } from '@angular/core';
import { RegistroService } from '../services/registro.service';

@Component({
  selector: 'app-resumen',
  templateUrl: './resumen.html',
  styleUrl: './resumen.css',
})
export class Resumen {
  private readonly registroService = inject(RegistroService);

  protected readonly total = this.registroService.total;
  protected readonly pendientes = this.registroService.pendientes;
  protected readonly aprobadas = computed(
    () => this.registroService.registros().filter((registro) => registro.estado === 'aprobada').length,
  );
  protected readonly rechazadas = computed(
    () => this.registroService.registros().filter((registro) => registro.estado === 'rechazada').length,
  );
  protected readonly ultimaReserva = computed(() => {
    const registros = this.registroService.registros();

    return registros.length === 0 ? null : registros[registros.length - 1];
  });
}

import { TitleCasePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ESTADOS, EstadoRegistro } from '../models/registro';
import { Resumen } from '../resumen/resumen';
import { RegistroService } from '../services/registro.service';

interface FilaEstado {
  estado: EstadoRegistro;
  cantidad: number;
  porcentaje: number;
}

@Component({
  selector: 'app-estadisticas',
  imports: [Resumen, RouterLink, TitleCasePipe],
  templateUrl: './estadisticas.html',
  styleUrl: './estadisticas.css',
})
export class Estadisticas {
  private readonly registroService = inject(RegistroService);

  protected readonly porEstado = computed<FilaEstado[]>(() => {
    const registros = this.registroService.registros();
    const total = registros.length;

    return ESTADOS.map((estado) => {
      const cantidad = registros.filter((registro) => registro.estado === estado).length;

      return {
        estado,
        cantidad,
        porcentaje: total === 0 ? 0 : Math.round((cantidad / total) * 100),
      };
    });
  });

  protected readonly porEspacio = computed(() => {
    const mapa = new Map<string, number>();

    for (const registro of this.registroService.registros()) {
      mapa.set(registro.espacio, (mapa.get(registro.espacio) ?? 0) + 1);
    }

    const maximo = Math.max(1, ...mapa.values());

    return [...mapa.entries()]
      .map(([espacio, cantidad]) => ({
        espacio,
        cantidad,
        porcentaje: Math.round((cantidad / maximo) * 100),
      }))
      .sort((a, b) => b.cantidad - a.cantidad || a.espacio.localeCompare(b.espacio));
  });

  protected readonly proximas = computed(() =>
    [...this.registroService.registros()]
      .sort((a, b) =>
        `${a.fecha} ${a.horaInicio}`.localeCompare(`${b.fecha} ${b.horaInicio}`),
      )
      .slice(0, 5),
  );

  protected codigo(id: number): string {
    return `R${id.toString().padStart(2, '0')}`;
  }
}

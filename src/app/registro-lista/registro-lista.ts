import { Component, inject } from '@angular/core';
import { ESTADOS, EstadoRegistro } from '../models/registro';
import { RegistroService } from '../services/registro.service';

@Component({
  selector: 'app-registro-lista',
  templateUrl: './registro-lista.html',
  styleUrl: './registro-lista.css',
})
export class RegistroLista {
  private readonly registroService = inject(RegistroService);

  protected readonly registros = this.registroService.registros;
  protected readonly total = this.registroService.total;
  protected readonly pendientes = this.registroService.pendientes;
  protected readonly estados = ESTADOS;

  protected cambiarEstado(id: number, estado: string): void {
    this.registroService.cambiarEstado(id, estado as EstadoRegistro);
  }

  protected eliminar(id: number): void {
    this.registroService.eliminar(id);
  }
}

import { Component, inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RegistroService } from '../services/registro.service';
import { minimoFilas, rangoHorario, sinSoloEspacios } from '../validators/validadores';

type ItemForm = FormGroup<{
  recurso: FormControl<string>;
  cantidad: FormControl<number>;
}>;

@Component({
  selector: 'app-registro-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registro-form.html',
  styleUrl: './registro-form.css',
})
export class RegistroForm {
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly registroService = inject(RegistroService);
  private readonly router = inject(Router);

  protected readonly form = this.fb.group(
    {
      responsable: ['', [Validators.required, Validators.minLength(3), sinSoloEspacios()]],
      espacio: ['', [Validators.required, Validators.minLength(2)]],
      fecha: ['', Validators.required],
      horaInicio: ['', Validators.required],
      horaFin: ['', Validators.required],
      asistentes: [1, [Validators.required, Validators.min(1), Validators.max(100)]],
      items: this.fb.array<ItemForm>([this.nuevoItem()], [minimoFilas(1)]),
    },
    { validators: [rangoHorario] },
  );

  protected get items(): FormArray<ItemForm> {
    return this.form.controls.items;
  }

  protected agregarItem(): void {
    this.items.push(this.nuevoItem());
  }

  protected quitarItem(index: number): void {
    this.items.removeAt(index);
    this.items.markAsTouched();
  }

  protected guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const nuevo = this.registroService.agregar({
      ...this.form.getRawValue(),
      estado: 'pendiente',
    });

    this.form.reset({
      responsable: '',
      espacio: '',
      fecha: '',
      horaInicio: '',
      horaFin: '',
      asistentes: 1,
    });

    while (this.items.length > 1) {
      this.items.removeAt(this.items.length - 1);
    }

    void this.router.navigate(['/reservas', this.codigo(nuevo.id)]);
  }

  private codigo(id: number): string {
    return `R${id.toString().padStart(2, '0')}`;
  }

  private nuevoItem(): ItemForm {
    return this.fb.group({
      recurso: ['', [Validators.required, Validators.minLength(2), sinSoloEspacios()]],
      cantidad: [1, [Validators.required, Validators.min(1)]],
    });
  }
}

import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DESDE, HASTA, M, PATRON_CODIGO, TOPE } from './parametros';
import { hastaMayorQueDesde, multiploDe, rangoCantidad } from './validadores';

type Parcial2Form = FormGroup<{
  codigo: FormControl<string>;
  cantidad: FormControl<number>;
  desde: FormControl<number>;
  hasta: FormControl<number>;
}>;

@Component({
  selector: 'app-parcial2',
  imports: [ReactiveFormsModule],
  templateUrl: './parcial2.html',
  styleUrl: './parcial2.css',
})
export class Parcial2 {
  private readonly fb = inject(FormBuilder).nonNullable;

  protected readonly m = M;
  protected readonly tope = TOPE;

  protected readonly form: Parcial2Form = this.fb.group(
    {
      codigo: ['', [Validators.required, Validators.pattern(PATRON_CODIGO)]],
      cantidad: [M, [Validators.required, rangoCantidad(1, TOPE), multiploDe(M)]],
      desde: [DESDE, Validators.required],
      hasta: [HASTA, Validators.required],
    },
    { validators: [hastaMayorQueDesde] },
  );

  protected guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
  }
}

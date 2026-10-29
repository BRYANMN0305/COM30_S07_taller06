import { AbstractControl, FormArray, ValidationErrors, ValidatorFn } from '@angular/forms';

export function sinSoloEspacios(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = control.value;

    return typeof valor === 'string' && valor !== '' && valor.trim() === ''
      ? { soloEspacios: true }
      : null;
  };
}

export const rangoHorario: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const horaInicio = group.get('horaInicio')?.value;
  const horaFin = group.get('horaFin')?.value;

  return horaInicio && horaFin && horaFin <= horaInicio ? { rangoHorario: true } : null;
};

export function minimoFilas(n: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const filas = (control as FormArray).length;

    return filas >= n ? null : { minimoFilas: { requerido: n } };
  };
}

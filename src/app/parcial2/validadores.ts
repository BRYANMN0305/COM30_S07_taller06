import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function rangoCantidad(minimo: number, maximo: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = control.value;

    if (typeof valor !== 'number' || Number.isNaN(valor)) {
      return null;
    }

    if (valor < minimo) {
      return { min: { min: minimo, actual: valor } };
    }

    if (valor > maximo) {
      return { max: { max: maximo, actual: valor } };
    }

    return null;
  };
}

export function multiploDe(m: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = control.value;

    if (typeof valor !== 'number' || Number.isNaN(valor)) {
      return null;
    }

    return valor % m === 0 ? null : { multiplo: { m, actual: valor } };
  };
}

export const hastaMayorQueDesde: ValidatorFn = (
  group: AbstractControl,
): ValidationErrors | null => {
  const desde = group.get('desde')?.value;
  const hasta = group.get('hasta')?.value;

  if (typeof desde !== 'number' || typeof hasta !== 'number') {
    return null;
  }

  return hasta > desde ? null : { hastaMayor: { desde, hasta } };
};

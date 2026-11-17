import { Routes } from '@angular/router';
import { RegistroDetalle } from './registro-detalle/registro-detalle';
import { RegistroForm } from './registro-form/registro-form';
import { RegistroLista } from './registro-lista/registro-lista';
import { NoEncontrado } from './no-encontrado/no-encontrado';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'reservas',
    pathMatch: 'full',
    title: 'Inicio · Reserva de espacios',
  },
  {
    path: 'reservas',
    component: RegistroLista,
    title: 'Reservas · COM30',
  },
  {
    path: 'reservas/nueva',
    component: RegistroForm,
    title: 'Nueva reserva · COM30',
  },
  {
    path: 'reservas/:id',
    component: RegistroDetalle,
    title: 'Detalle de reserva · COM30',
  },
  {
    path: 'estadisticas',
    loadComponent: () =>
      import('./estadisticas/estadisticas').then((modulo) => modulo.Estadisticas),
    title: 'Estadísticas · COM30',
  },
  {
    path: '**',
    component: NoEncontrado,
    title: 'Página no encontrada · COM30',
  },
];

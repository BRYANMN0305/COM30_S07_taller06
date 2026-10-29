import { Component } from '@angular/core';
import { RegistroForm } from './registro-form/registro-form';
import { RegistroLista } from './registro-lista/registro-lista';

@Component({
  selector: 'app-root',
  imports: [RegistroForm, RegistroLista],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}

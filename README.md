# COM30 · Taller 06 · Reserva de espacios

Aplicación Angular de una sola pantalla para registrar y gestionar reservas de espacios. Corresponde al escenario **E3 · Reserva de espacios** del Taller 06.

## Escenario

Una persona responsable registra una reserva indicando el espacio, la fecha, la hora de inicio, la hora de fin, la cantidad de asistentes y una lista dinámica de recursos. El sistema valida que la hora de fin sea posterior a la hora de inicio y que exista al menos un recurso. Las reservas quedan en memoria y se pueden aprobar, rechazar o eliminar desde el listado.

## Estructura

Se usa la Ruta A recomendada en el enunciado: componentes standalone separados, sin NgModule ni rutas.

```
src/app/
  models/registro.ts              interfaces Registro e Item y estados
  validators/validadores.ts       validador propio, de grupo y mínimo de filas
  services/registro.service.ts    signal privada, asReadonly() y computed
  registro-form/                  formulario reactivo y FormArray de recursos
  registro-lista/                 listado con @for, track y @empty
  app.ts                          compone los dos componentes
```

El formulario es reactivo porque el modelo y las reglas de validación se definen en la clase, lo que permite validar el rango de horas a nivel de grupo y construir la lista de recursos con `FormArray`.

## Ejecución

```bash
npm install
npm start
```

Abrir `http://localhost:4200/`.

Compilación de producción:

```bash
npm run build
```

## Alcance actual

El código cubre los ocho requerimientos del taller: estructura standalone, modelo tipado, servicio con signals, formulario reactivo con seis controles de cabecera, validadores integrados, validador propio (`sinSoloEspacios`), validador de grupo (`rangoHorario`), `FormArray` de recursos con mínimo de una fila, mensajes de error por tipo, listado con `@for`/`track`/`@empty`, cambio de estado por registro y panel de resumen cargado con `@defer (on interaction)`.

## Casos de prueba

La tabla de casos ejecutados (C1 a C8) y las capturas de evidencia están en el informe `COM30_Taller06_Muñoz.pdf` entregado con el taller.

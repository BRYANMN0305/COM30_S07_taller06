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

El código cubre la estructura, el modelo tipado, el servicio con signals, el formulario con seis controles de cabecera, validadores integrados, validador propio, validador de grupo y un `FormArray` básico de recursos. Corresponde al avance hasta la sección 4 del informe.

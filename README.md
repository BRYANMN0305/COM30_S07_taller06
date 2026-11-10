# COM30 · Taller 07 · Búsqueda reactiva sobre Reserva de espacios

Aplicación Angular que amplía el proyecto del **Taller 06** con una búsqueda reactiva sobre el escenario **E3 · Reserva de espacios**. Se conserva el mismo repositorio y se agregan commits con el prefijo `T07:`.

## Escenario

Una persona responsable registra una reserva indicando el espacio, la fecha, la hora de inicio, la hora de fin, la cantidad de asistentes y una lista dinámica de recursos. El sistema valida que la hora de fin sea posterior a la de inicio y que exista al menos un recurso. Las reservas quedan en memoria y se pueden aprobar, rechazar o eliminar desde los resultados de la búsqueda.

## Búsqueda reactiva

- Se buscan coincidencias en dos campos de texto declarados: **responsable** y **espacio**.
- El texto se recorta con `trim()` y la comparación ignora mayúsculas y tildes (normalización NFD).
- Con menos de 2 caracteres no se consulta el servicio: el componente devuelve `of([])`.
- El servicio simula latencia con `max(150, 1500 − 300 × longitud)` milisegundos.
- `buscar(texto): Observable<Registro[]>` incrementa un contador privado expuesto como `llamadas` de solo lectura con `asReadonly()`.
- Tubería del componente:

  ```ts
  valueChanges
    .pipe(
      map((texto) => texto.trim()),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((texto) => this.consultar(texto)),
    )
  ```

- El resultado se expone con `toSignal(..., { initialValue: [] })`.
- El total y los conteos por estado se calculan con `computed`; el filtro por estado usa una signal y un `computed`, sin lanzar consultas nuevas.
- El historial guarda las 5 últimas consultas, la más reciente primero, con `subscribe` y `takeUntilDestroyed()`.

## Semilla

El servicio carga 12 reservas con tres estados (`pendiente`, `aprobada`, `rechazada`):

| Cód. | Responsable | Espacio | Estado |
| --- | --- | --- | --- |
| R01 | Ana Pérez | Sala 1 | Pendiente |
| R02 | Carlos Ruiz | Sala 1 | Aprobada |
| R03 | María Gómez | Sala 2 | Aprobada |
| R04 | Luis Torres | Sala 2 | Pendiente |
| R05 | Ana Pérez | Auditorio | Aprobada |
| R06 | Carlos Ruiz | Laboratorio | Rechazada |
| R07 | María Gómez | Laboratorio | Pendiente |
| R08 | Luis Torres | Auditorio | Rechazada |
| R09 | María Gómez | Sala 3 | Aprobada |
| R10 | Carlos Ruiz | Sala 3 | Rechazada |
| R11 | Sara Molina | Biblioteca | Pendiente |
| R12 | Sara Molina | Auditorio | Aprobada |

Palabras compartidas: «Sala» (6 registros), «Laboratorio» (2) y «Sara» (2). Palabra inexistente usada en C6: «zzz».

## Estructura

```
src/app/
  models/registro.ts              interfaces Registro e Item, estados
  validators/validadores.ts       validador propio, de grupo y mínimo de filas
  services/registro.seed.ts       semilla de 12 reservas
  services/registro.service.ts    signal, asReadonly(), buscar() con retardo y llamadas
  registro-form/                  formulario reactivo del Taller 06
  registro-lista/                 búsqueda reactiva, filtros, historial y resultados
  resumen/                        panel de resumen con @defer
  app.ts                          compone los componentes
```

Se mantiene la estructura standalone, sin NgModule ni rutas, y los componentes del Taller 06.

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

En PowerShell, si `npx` está bloqueado por la política de ejecución, usar `npx.cmd ng build`.

## Casos de prueba

La tabla B del informe `COM30_Taller07_Muñoz.pdf` contiene los nueve casos ejecutados (C1 a C9), el resultado esperado, el obtenido y el contador de llamadas. La captura posterior al caso C9 muestra la búsqueda «sara», los 2 resultados y las 8 llamadas al servicio.

## Repositorio

<https://github.com/BRYANMN0305/COM30_S07_taller06>

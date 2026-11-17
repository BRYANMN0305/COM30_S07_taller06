# COM30 · Taller 08 · Rutas y navegación sobre Reserva de espacios

Aplicación Angular que amplía el proyecto del **Taller 07** con rutas y navegación sobre el escenario **E3 · Reserva de espacios**. Se conserva el mismo repositorio y los commits llevan el prefijo `T08:`.

## Rutas

`app.config.ts` usa `provideRouter(routes, withComponentInputBinding())`. El orden de `app.routes.ts` es:

| Ruta | Vista (componente) | Parámetro o carga |
| --- | --- | --- |
| `''` (vacía) | Redirección a `/reservas` | `pathMatch: 'full'` |
| `reservas` | `RegistroLista` | `estado` (query param) |
| `reservas/nueva` | `RegistroForm` | — (alta) |
| `reservas/:id` | `RegistroDetalle` | `id` (parámetro de ruta) |
| `estadisticas` | `Estadisticas` | `loadComponent` (carga diferida) |
| `**` | `NoEncontrado` | comodín, última ruta |

`reservas/nueva` va antes que `reservas/:id` para que «nueva» no se lea como un código. Cada ruta tiene `title` y el comodín queda al final.

## Funcionamiento

- **Listado** (`/reservas`): muestra las 12 reservas y recibe `?estado=…` con `input()`. Los filtros son enlaces `routerLink="."` con `queryParams`; el filtro sobrevive a F5 y un estado sin registros muestra `@empty`. Cada fila enlaza a su detalle.
- **Detalle** (`/reservas/:id`): el parámetro llega a `id = input.required<string>()`; un `computed` busca el registro y un código inexistente muestra «No existe la reserva …» dentro del detalle.
- **Alta** (`/reservas/nueva`): formulario reactivo del Taller 06. Al guardar, `router.navigate` lleva a `/reservas/<código>` del registro creado.
- **Estadísticas** (`/estadisticas`): ruta cargada con `loadComponent`; muestra totales, distribución por estado, reservas por espacio y próximas reservas.
- **404** (`**`): muestra la dirección pedida y un enlace de regreso al listado.
- Se conserva la búsqueda reactiva del Taller 07 sobre `responsable` y `espacio`, con `debounceTime`, `switchMap`, `toSignal`, historial de 5 consultas y `takeUntilDestroyed()`.
- El menú usa `routerLink` y `routerLinkActive`; «Inicio» usa `{ exact: true }`. Hay un solo `<router-outlet />` y ningún enlace interno usa `href`.

## Semilla

12 reservas con tres estados (`pendiente`, `aprobada`, `rechazada`). La semilla está en `src/app/services/registro.seed.ts`; los totales iniciales son 4 pendientes, 5 aprobadas y 3 rechazadas.

En C8 se agrega «Laura Díaz · Sala 3 · Pendiente» con el alta: el total pasa a 13 y los pendientes a 5. Al recargar se restaura la semilla.

## Casos de prueba

La tabla B del informe `COM30_Taller08_Muñoz.pdf` contiene los nueve casos (C1–C9), el resultado esperado y el obtenido. Las capturas incluyen el detalle de C5 con la URL visible y el panel Red de C9 con el chunk diferido.

## Ejecución

```bash
npm install
npm start
```

Abrir `http://localhost:4200/`. Compilación de producción:

```bash
npm run build
```

En PowerShell, si `npx` está bloqueado, usar `npx.cmd ng build`.

## Repositorio

<https://github.com/BRYANMN0305/COM30_S07_taller06>

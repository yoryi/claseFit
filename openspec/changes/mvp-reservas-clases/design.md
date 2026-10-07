# Design

## Context

La app es el proyecto Expo en `src/` (SDK 57, React Native 0.86, TypeScript). Hoy `App.tsx` es la plantilla inicial: no hay navegación, Jest ni capas MVVM. Las clases están en `src/assets/clases.json` (10 clases, socio `S-0001` Laura Gómez, campo `_notas` informativo). Ver `proposal.md` para el motivo y `specs/proximas-clases/spec.md` y `specs/reservas/spec.md` para el comportamiento.

`plantillas/design.md` no está en el repositorio. Este documento sigue la plantilla spec-driven e incluye la estructura, el estado, el cálculo de fechas y la alternativa descartada pedidos para esta iteración.

## Goals / Non-Goals

**Goals:**

- Separar reglas, fechas y cupos de la UI para probarlos con Jest sin renderizar React Native.
- Compartir un mismo estado de reservas entre las dos pantallas durante la sesión.
- Calcular el inicio con `diaOffset` + `hora` en `America/Bogota`, con un reloj inyectable.
- Organizar el código Expo según el MVVM de `openspec/project.md`.

**Non-Goals:**

- AsyncStorage, login, pagos, backend, administración y notificaciones.
- Pruebas de componentes o de navegación. Esta iteración prueba las reglas y el cálculo puro.
- Un orden de negocio cuando RN-01, RN-02 y RN-03 podrían fallar a la vez. El insumo no lo define. Cada escenario se prueba con una sola regla en fallo.

## Decisions

### Estructura propuesta

El directorio `src/` del workspace es la raíz del proyecto Expo. Las carpetas de `project.md` se crean ahí, sin un `src/src`.

```text
src/
├── index.ts
├── app/
│   ├── App.tsx
│   └── navigation/
│       └── AppNavigator.tsx
├── features/
│   ├── classes/
│   │   ├── model/
│   │   ├── view/
│   │   │   ├── UpcomingClassesScreen.tsx
│   │   │   └── components/
│   │   └── viewModel/
│   │       └── useClassesViewModel.ts
│   └── reservations/
│       ├── model/
│       ├── view/
│       │   ├── MyReservationsScreen.tsx
│       │   └── components/
│       └── viewModel/
│           └── useReservationsViewModel.ts
├── data/
│   ├── mock/
│   │   └── clases.json
│   └── repositories/
│       ├── classRepository.ts
│       └── reservationRepository.ts
├── shared/
│   ├── components/
│   ├── utils/
│   │   └── bogotaTime.ts
│   └── types/
└── __tests__/
    ├── classes/
    └── reservations/
```

- **View:** pantallas y componentes. Dos pestañas: próximas clases y mis reservas.
- **ViewModel:** hooks que exponen lista, mensajes y acciones. El diálogo de confirmación vive aquí o en la vista, nunca en las reglas.
- **Model:** funciones puras de cupos, filtro, orden, reserva y cancelación. No importan `react-native`.
- **Repository:** lee el JSON y guarda las reservas en memoria.

El contenido de `src/assets/clases.json` se mueve a `src/data/mock/clases.json`. `index.ts` pasa a registrar `app/App.tsx`. Se instalan React Navigation (pestañas) y `jest-expo` con las versiones que resuelva Expo 57. No se agregan librerías de estado ni de fechas.

Componentes reutilizables en `shared/components` para contenedor de pantalla, estado vacío y mensaje de resultado. La fila de clase y la fila de reserva quedan en el `components/` de su feature.

### Manejo de estado

Un repositorio en memoria, único en el proceso, guarda las reservas activas `{ id, classId, socioId }`. El socio sale del JSON (`S-0001`); no hay sesión ni login.

`reservationRepository` expone leer, agregar, quitar y suscribir. Los dos ViewModels se suscriben, así una reserva o cancelación actualiza ambas pantallas.

`classRepository` carga las clases y no las modifica. Los cupos no se escriben en el JSON:

`disponibles = cupoTotal - ocupados - reservas activas del socio en esa clase`

`ocupados` son otros socios y no cambia. Reservar suma una reserva de Laura; cancelar la quita. Con disponibles en 0 la clase sigue en el listado como "Llena" y sin acción de reservar.

La reserva la decide `reservationService` llamando reglas puras:

- RN-02 si ya existe una reserva activa de ese `id` de clase. El nombre no identifica la clase: hay varios Spinning.
- RN-01 si `disponibles` es 0 antes de reservar.
- RN-03 si ya hay dos reservas activas cuyo inicio cae en el mismo día civil de `America/Bogota`. Una reserva cancelada no cuenta. Otro día no cuenta.
- Si ninguna falla, se agrega la reserva y el resultado trae "¡Listo! Tu cupo está reservado". Si falla, no hay alta y el mensaje es el de esa regla.

Cancelar pide confirmación en la UI. Solo la confirmación llama al servicio. RN-04 permite cancelar cuando `inicio - ahora >= 2 horas` y rechaza cuando es menor, incluida una clase ya iniciada, con "Ya no puedes cancelar: faltan menos de 2 horas." Si cancela, la reserva se elimina y el cupo vuelve a contar.

Los mensajes de la UI son exactamente los del insumo. No se agregan reglas nuevas.

### Cálculo de fechas

`shared/utils/bogotaTime.ts` recibe `now: Date`. Las pruebas fijan ese instante; la app usa la hora del dispositivo solo como instante UTC, no como zona local.

America/Bogota no tiene horario de verano y su desfase es `-05:00`. El día civil se obtiene con `Intl.DateTimeFormat` en `America/Bogota`. El inicio es ese día más `diaOffset`, a la `hora` `HH:mm`, convertido a UTC sumando 5 horas. Sumar los días sobre la fecha civil evita que un `Date` local cambie el día cerca de la medianoche.

Ejemplo: `2026-10-08T02:30:00.000Z` es 7 de octubre de 2026, 21:30 en Bogotá. Una clase con `diaOffset` 0 y hora `18:00` ya comenzó; una con `diaOffset` 1 y hora `06:00` inicia el 8 de octubre a las 06:00 en Bogotá.

Una clase entra al listado si su día civil está entre hoy y pasado mañana y `now` es anterior al inicio. A la hora exacta de inicio ya no aparece. El orden es por inicio ascendente. El día visible es "Hoy", "Mañana" o "Pasado mañana".

RN-04 compara instantes: exactamente 2 horas permite cancelar; un milisegundo menos, no.

### Alternativa descartada

Calcular fechas con la zona horaria del dispositivo y evaluar RN-01 a RN-04 dentro de los componentes. Se descarta porque un dispositivo fuera de Bogotá cambiaría el día de la clase, las reglas quedarían acopladas a React Native y Jest no podría cubrir los escenarios sin montar UI ni controlar el reloj. El model puro con `now` inyectado y zona fija resuelve las dos cosas sin librerías extra.

También se descartó un store global (Redux u otro) y persistir con AsyncStorage en esta iteración: hay un solo socio, dos pantallas y el insumo trata la persistencia como bonus.

## Risks / Trade-offs

- [Hermes sin `Intl` de zona horaria] → Cubrir `bogotaTime` con un instante UTC que en Bogotá sea el día anterior. Si fallara, concentrar el ajuste en ese módulo.
- [Desfase `-05:00` fijo] → Válido para America/Bogota. No reutilizar el helper para otras zonas.
- [Reservas solo en memoria] → Se pierden al cerrar la app. Es el alcance de esta iteración.
- [Varias reglas podrían fallar juntas y el insumo no fija el mensaje] → Las pruebas cubren una regla a la vez. La UI muestra el mensaje de la primera que falle en el orden RN-02, RN-01, RN-03; ese orden no es una regla de negocio nueva.
- [Mover `App.tsx`] → Actualizar `index.ts` en el mismo cambio para que Expo siga abriendo la app.

## Migration Plan

No hay datos de usuarios ni API que migrar. Se reemplaza la pantalla de plantilla por el navegador, se reubica el JSON y se agregan Jest y la navegación. Volver atrás es revertir este cambio: no queda estado persistido que limpiar.

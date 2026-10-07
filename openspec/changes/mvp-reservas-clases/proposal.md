# Proposal

## Why

Hoy las reservas de ClaseFit se hacen por WhatsApp y eso produce sobrecupos y cupos olvidados. Esta iteración entrega el MVP para que el socio vea las próximas clases, reserve y cancele desde el celular, con datos locales y sin backend.

## What Changes

- Consultar las clases de hoy, mañana y pasado mañana, ordenadas por fecha y hora, con nombre, día, hora, instructor y cupos disponibles.
- Ocultar las clases que ya empezaron y marcar como "Llena" las que no tienen cupo.
- Reservar una clase, bajar el cupo en uno y confirmar con "¡Listo! Tu cupo está reservado".
- Consultar las reservas del socio, la más próxima primero, con el estado vacío "Aún no tienes reservas".
- Cancelar una reserva con confirmación y liberar el cupo cuando la regla lo permite.
- Aplicar RN-01, RN-02, RN-03 y RN-04 con sus mensajes, en lógica separable de la UI y cubierta por pruebas Jest.
- Partir del proyecto Expo existente en `src/` y organizarlo con la arquitectura MVVM del proyecto.

Alcance de esta iteración: HU-01, HU-02 y HU-03.

Fuera de alcance: autenticación, pagos, administración, notificaciones, backend, APIs externas e instructores como módulo propio. Persistir reservas con AsyncStorage queda como bonus y no forma parte de esta iteración: las reservas viven en memoria.

## Capabilities

### New Capabilities

- `proximas-clases`: consulta de las próximas clases, cupos visibles y estado "Llena".
- `reservas`: reserva, consulta y cancelación de las reservas del socio, incluidas RN-01, RN-02, RN-03 y RN-04.

### Modified Capabilities

- Ninguna. El inventario de specs está vacío.

## Impact

- El código de la app vive en el proyecto Expo `src/`, hoy una plantilla sin navegación, sin Jest y sin la estructura MVVM.
- La fuente de clases observada es `src/assets/clases.json`. El contenido se conserva; la capa de datos lo consumirá desde `src/data/mock/clases.json`, como define la arquitectura.
- Se agregan navegación entre las dos pantallas y Jest para las reglas de negocio. No hay APIs ni servicios externos.
- El socio del MVP es Laura Gómez (`S-0001`), ya autenticada. `ocupados` son cupos de otros socios; las reservas de Laura se suman. Las fechas se calculan con `diaOffset` + `hora` en `America/Bogota`.

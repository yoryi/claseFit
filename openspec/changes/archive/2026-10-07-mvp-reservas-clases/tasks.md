# Tasks

## 1. Preparación

- [x] 1.1 Instalar en el proyecto Expo `src/` Jest (`jest-expo`) y React Navigation de pestañas, con `react-native-screens` y `react-native-safe-area-context`, usando las versiones que resuelva Expo 57. Verificar que `package.json` declara esas dependencias y que `npm test` arranca Jest.
- [x] 1.2 Crear la estructura MVVM de `design.md` dentro de `src/`, mover el contenido de `src/assets/clases.json` a `src/data/mock/clases.json` y registrar `app/App.tsx` desde `index.ts`. Verificar que el JSON está en la ruta nueva, que la raíz Expo sigue siendo `src/` y que `npx tsc --noEmit` compila.

## 2. Tiempo en America/Bogota

- [x] 2.1 Implementar `shared/utils/bogotaTime.ts` con `now` inyectable, día civil en `America/Bogota` y desfase fijo `-05:00`, sin importar React Native. Verificar con Jest los escenarios de `specs/proximas-clases/spec.md` (diaOffset 0 a las 18:00 es hoy, 1 a las 06:00 es mañana, 2 a las 09:00 es pasado mañana) y que `2026-10-08T02:30:00.000Z` es el 7 de octubre de 2026 a las 21:30 en Bogotá.

## 3. Consulta de próximas clases

- [x] 3.1 Implementar la carga del JSON y el cálculo `disponibles = cupoTotal - ocupados - reservas activas del socio` en el model de clases, sin escribir el JSON. Verificar con Jest el escenario de 20 cupos y 18 ocupados: 2 disponibles sin reserva de Laura y 1 con una reserva activa suya, con los textos "2 de 20 cupos" y "1 de 20 cupos".
- [x] 3.2 Implementar el filtro de hoy, mañana y pasado mañana, ocultar clases con inicio igual o anterior a `now`, ordenar por inicio y marcar disponibles 0 como "Llena" sin acción de reservar. Verificar con Jest cada escenario de ventana, orden, clase iniciada, clase futura y clase llena de `specs/proximas-clases/spec.md`.

## 4. Reservas del socio

- [x] 4.1 Implementar el repositorio en memoria y el servicio de reserva con RN-01, RN-02 y RN-03 en funciones puras, identificando la clase por `id`. Verificar con Jest la reserva exitosa ("¡Listo! Tu cupo está reservado" y un cupo menos), el rechazo sin cambios de cupo, RN-01 ("Esta clase ya no tiene cupos."), RN-02 ("Ya reservaste esta clase." y que otra clase del mismo nombre no la dispara) y RN-03 ("Solo puedes reservar 2 clases por día.", incluida una reserva válida en otro día).
- [x] 4.2 Implementar el listado de reservas activas por inicio y la cancelación con RN-04 (`inicio - ahora >= 2 horas` permite; menos de 2 horas conserva la reserva). Verificar con Jest el orden, la lista vacía, la cancelación a exactamente 2 horas liberando el cupo, el rechazo a menos de 2 horas y con la clase ya iniciada ("Ya no puedes cancelar: faltan menos de 2 horas.") y que una reserva cancelada no cuenta para RN-03.

## 5. Pantallas

- [x] 5.1 Implementar `UpcomingClassesScreen`, sus componentes y `useClassesViewModel` para mostrar nombre, día (Hoy, Mañana o Pasado mañana), hora, instructor y cupos, reservar solo si hay cupo y mostrar el mensaje del model. Verificar que la vista no calcula fechas ni reglas, que `npx tsc --noEmit` compila y que una reserva válida muestra "¡Listo! Tu cupo está reservado".
- [x] 5.2 Implementar `MyReservationsScreen` y `useReservationsViewModel`: lista de la más próxima a la más lejana, "Aún no tienes reservas" si no hay, y cancelación solo después de confirmar. Verificar que rechazar la confirmación no llama al servicio, que RN-04 muestra "Ya no puedes cancelar: faltan menos de 2 horas." y que una cancelación permitida quita la reserva de la lista.
- [x] 5.3 Conectar ambas pantallas en `AppNavigator` como pestañas y abrirlas desde `app/App.tsx`. Verificar que desde la app se puede pasar de próximas clases a mis reservas y que una reserva hecha en la primera pantalla aparece en la segunda durante la misma sesión.

## 6. Verificación de integración

- [x] 6.1 Ejecutar en `src/` la suite completa de Jest y `npx tsc --noEmit`. Verificar que pasan todos los escenarios de las specs ya cubiertos en los grupos 2, 3 y 4, y que el model de reglas no depende de React Native.

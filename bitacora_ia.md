# Bitácora de uso de IA

## Herramientas que usé
- Cursor: asistencia para analizar el proyecto, proponer estructura, generar y revisar código.
- OpenSpec: definición y gestión de especificaciones mediante un flujo Spec-Driven Development (explore, propose, apply, verify, archive).
- IA integrada en Cursor: apoyo para resolver dudas, revisar decisiones técnicas y detectar posibles inconsistencias.

## Prompts clave (3 a 5)
| # | Fase | Prompt | Qué obtuve |
|---|---|---|---|
| 1 | 2 | `/opsx-propose` de la primera iteración del MVP (texto completo abajo). | Cambio OpenSpec con proposal, specs de próximas clases y reservas (RN-01 a RN-04), design y tasks. Sin código. |

### Prompt 1 · Fase 2

```text
/opsx-propose  "Crear la primera iteración del sistema de reservas de clases de ClaseFit.

Usa `insumo-funcional.md` como fuente de verdad funcional y respeta las decisiones y restricciones definidas en `project.md` y `config.yaml`.

Alcance:

* consultar las próximas clases;
* reservar una clase;
* consultar mis reservas;
* cancelar una reserva.

Reglas de negocio:

* cubrir explícitamente RN-01, RN-02, RN-03 y RN-04 definidas en `insumo-funcional.md`;
* cada regla debe quedar representada en la especificación mediante escenarios WHEN/THEN;
* las reglas deben poder utilizarse posteriormente como base para pruebas unitarias.

Datos:

* utilizar `src/assets/clases.json` como fuente local;
* calcular la fecha real de cada clase utilizando `diaOffset + hora`;
* respetar la zona horaria `America/Bogota`;
* considerar que `ocupados` corresponde a otros socios y que las reservas de Laura se suman.

Arquitectura:

* partir del proyecto inicial de Expo existente; /Users/yoryi/Desktop/ClaseFit/src

* organizar la implementación siguiendo la arquitectura MVVM definida en `project.md`;
* separar la lógica de negocio de la UI;
* mantener el estado y la lógica de reservas en las capas correspondientes;
* utilizar componentes reutilizables cuando sea necesario.

Diseño:

* utilizar `plantillas/design.md` como referencia para estructurar `design.md`;
* incluir la estructura propuesta, manejo de estado, cálculo de fechas y una alternativa descartada.

Pruebas:

* utilizar Jest;
* las pruebas unitarias deben cubrir las reglas de negocio definidas en el insumo funcional.

Restricciones:

* no incluir autenticación;
* no incluir pagos;
* no incluir backend ni APIs externas;
* no incluir administración;
* no incluir notificaciones;
* mantener los datos locales;
* no agregar funcionalidades fuera del alcance del MVP.

No implementar código todavía. Mantener el cambio enfocado únicamente en esta primera iteración del MVP."
```


## Errores de la IA que detecté
| # | Qué hizo mal | Cómo lo detecté | Cómo lo resolví |
|---|---|---|---|
| 1 | Dejó un icono roto en la barra de pestañas. | Se veía al abrir la lista de clases. | Lo oculté y la barra quedó solo con el texto. |
| 2 | Se saltó el mensaje de RN-01 en la pantalla. | La clase llena solo dice "Llena" y no deja reservar. | El texto está en las reglas y en los tests; en la app no se llega a ver. |
| 3 | No usó `plantillas/design.md`, que se pidió como referencia. | En `design.md` dice que el archivo no estaba. | Siguió con la plantilla de OpenSpec. |

## Resultado de `openspec validate`
```
✔ What would you like to validate? All (changes + specs)
✓ spec/proximas-clases
✓ spec/reservas
Totals: 2 passed, 0 failed (2 items)

```

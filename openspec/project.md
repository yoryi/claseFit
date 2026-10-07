# Proyecto: ClaseFit

## Descripción

ClaseFit es una aplicación móvil para consultar, reservar y cancelar clases de un gimnasio.

El MVP utiliza datos locales y contempla un socio previamente autenticado. No se implementan autenticación ni backend.

## Stack tecnológico

* React Native
* Expo
* TypeScript
* Jest
* JSON para datos locales
* AsyncStorage para persistencia local

## Arquitectura

El proyecto utiliza **MVVM (Model-View-ViewModel)**.

* **View:** componentes y pantallas de React Native.
* **ViewModel:** Custom Hooks encargados del estado y comportamiento de las pantallas.
* **Model:** datos y lógica relacionada con las funcionalidades.

La lógica de negocio debe mantenerse separada de la interfaz de usuario y ser independiente de los componentes de React Native.

## UI y experiencia de usuario

La interfaz debe ser **moderna, minimalista, clara y consistente**.

Se deben priorizar:

* Jerarquía visual clara.
* Componentes simples y reutilizables.
* Espaciado y tipografía consistentes.
* Estados claros para acciones disponibles y no disponibles.
* Feedback visual para reservas, cancelaciones y errores.
* Buena legibilidad en diferentes tamaños de pantalla.
* Navegación sencilla e intuitiva.

La experiencia de usuario debe priorizar la claridad y usabilidad sobre elementos visuales innecesarios.

## Estructura del proyecto

```text
src/
├── app/
│   ├── navigation/
│   │   └── AppNavigator.tsx
│   └── App.tsx
│
├── features/
│   ├── classes/
│   │   ├── model/
│   │   │   ├── Class.ts
│   │   │   └── classService.ts
│   │   │
│   │   ├── view/
│   │   │   ├── UpcomingClassesScreen.tsx
│   │   │   └── components/
│   │   │
│   │   └── viewModel/
│   │       └── useClassesViewModel.ts
│   │
│   └── reservations/
│       ├── model/
│       │   ├── Reservation.ts
│       │   └── reservationService.ts
│       │
│       ├── view/
│       │   ├── MyReservationsScreen.tsx
│       │   └── components/
│       │
│       └── viewModel/
│           └── useReservationsViewModel.ts
│
├── data/
│   ├── mock/
│   │   └── clases.json
│   └── repositories/
│       └── localRepository.ts
│
└── shared/
    ├── components/
    ├── hooks/
    ├── utils/
    └── types/

__tests__/
├── classes/
└── reservations/
```

La estructura puede evolucionar durante la implementación siempre que se mantenga la separación de responsabilidades.

## Funcionalidades

* Consultar próximas clases.
* Reservar clases.
* Consultar reservas del socio.
* Cancelar reservas.

## Datos

Los datos iniciales de las clases se encuentran en:

`src/data/mock/clases.json`

El campo `diaOffset` representa el día relativo de la clase:

* `0`: hoy
* `1`: mañana
* `2`: pasado mañana

La fecha real de cada clase se calcula a partir de la fecha actual del dispositivo utilizando la zona horaria `America/Bogota`.

El campo `ocupados` representa los cupos utilizados por otros socios. Las reservas realizadas por el socio se contabilizan adicionalmente.

Las reservas pueden mantenerse en memoria durante la ejecución de la aplicación. AsyncStorage puede utilizarse para persistirlas localmente.

## Reglas de negocio

Las reglas funcionales oficiales son las definidas en el insumo funcional.

Las reglas **RN-01, RN-02, RN-03 y RN-04** deben estar cubiertas por las especificaciones de OpenSpec y por pruebas unitarias.

Las reglas de negocio no deben depender de componentes de React Native.

No se deben introducir reglas de negocio que no estén definidas en el alcance funcional.

## Pruebas

Las pruebas unitarias utilizan Jest.

Los escenarios definidos en las especificaciones de OpenSpec sirven como base para las pruebas.

Las reglas de negocio deben poder probarse independientemente de la interfaz de usuario.

## Alcance

### Incluye

* Consulta de próximas clases.
* Reserva de clases.
* Consulta de reservas.
* Cancelación de reservas.
* Validación de reglas de negocio.
* Pruebas unitarias.
* Configuración básica para release.

### Fuera de alcance

* Autenticación.
* Pagos.
* Administración.
* Notificaciones.
* Backend.
* APIs externas.


## Communication

- Generar código claro, simple y fácil de mantener.
- Priorizar soluciones simples y evitar abstracciones innecesarias.
- Usar nombres descriptivos para variables, funciones y componentes.
- Agregar comentarios solo cuando aporten contexto relevante.
- Mantener separadas la UI, el estado y la lógica de negocio.
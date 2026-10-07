# Spec Delta

## Purpose

Permite al socio consultar las clases de hoy, mañana y pasado mañana, con horario, instructor y cupos disponibles.

## ADDED Requirements

### Requirement: Ventana de próximas clases
El sistema SHALL listar solo clases cuyo inicio, en America/Bogota, cae en hoy, mañana o pasado mañana y que todavía no han comenzado.

#### Scenario: Incluye los tres días
- **WHEN** hay clases con inicio hoy, mañana, pasado mañana y dentro de tres días, y ninguna ha comenzado
- **THEN** el listado incluye las de hoy, mañana y pasado mañana, y excluye la de dentro de tres días

#### Scenario: Orden por inicio
- **WHEN** el listado contiene varias clases que aún no comienzan
- **THEN** aparecen ordenadas por fecha y hora de inicio, de la más próxima a la más lejana

#### Scenario: Clase ya iniciada
- **WHEN** la hora actual en America/Bogota es igual o posterior al inicio de una clase
- **THEN** esa clase no aparece en el listado

#### Scenario: Clase que aún no inicia
- **WHEN** la hora actual en America/Bogota es anterior al inicio de una clase dentro de la ventana de tres días
- **THEN** esa clase aparece en el listado

### Requirement: Fecha real de la clase
El sistema SHALL calcular el inicio sumando el diaOffset a la fecha actual de America/Bogota y aplicando la hora de la clase.

#### Scenario: Clase de hoy
- **WHEN** una clase tiene diaOffset 0 y hora 18:00
- **THEN** su inicio es hoy a las 18:00 en America/Bogota

#### Scenario: Clase de mañana
- **WHEN** una clase tiene diaOffset 1 y hora 06:00
- **THEN** su inicio es mañana a las 06:00 en America/Bogota

#### Scenario: Clase de pasado mañana
- **WHEN** una clase tiene diaOffset 2 y hora 09:00
- **THEN** su inicio es pasado mañana a las 09:00 en America/Bogota

### Requirement: Datos visibles de la clase
El sistema SHALL mostrar en cada clase el nombre, el día relativo, la hora, el instructor y los cupos en el formato "{disponibles} de {cupoTotal} cupos".

#### Scenario: Clase con cupos libres
- **WHEN** el socio consulta una clase con cupos disponibles
- **THEN** ve el nombre, el día (Hoy, Mañana o Pasado mañana), la hora, el instructor y el texto "{disponibles} de {cupoTotal} cupos"

### Requirement: Cupos disponibles
El sistema SHALL calcular los cupos disponibles como el cupo total menos los cupos ocupados por otros socios menos las reservas activas del socio en esa clase.

#### Scenario: Solo ocupados por otros socios
- **WHEN** una clase tiene cupo total 20, 18 cupos ocupados por otros socios y el socio no tiene una reserva activa
- **THEN** los cupos disponibles son 2 y el texto mostrado es "2 de 20 cupos"

#### Scenario: La reserva del socio se suma
- **WHEN** una clase tiene cupo total 20, 18 cupos ocupados por otros socios y el socio tiene una reserva activa en esa clase
- **THEN** los cupos disponibles son 1 y el texto mostrado es "1 de 20 cupos"

### Requirement: Clase llena
El sistema SHALL mostrar la clase como "Llena" cuando sus cupos disponibles son cero y SHALL dejar la reserva no disponible.

#### Scenario: Sin cupos
- **WHEN** una clase dentro de la ventana aún no comienza y sus cupos disponibles son 0
- **THEN** permanece visible con el estado "Llena" y no ofrece reservar

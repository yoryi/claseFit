# reservas Specification

## Purpose
Permite al socio reservar una clase, consultar sus reservas y cancelarlas cuando la regla de anticipación lo permite.

## Requirements

### Requirement: Reservar una clase
El sistema SHALL crear una reserva activa, reducir en uno los cupos disponibles y confirmar con "¡Listo! Tu cupo está reservado" cuando ninguna regla de reserva falla.

#### Scenario: Reserva exitosa
- **WHEN** el socio reserva una clase con cupos disponibles, sin reserva previa suya y con menos de dos reservas activas ese día de clase
- **THEN** queda una reserva activa, los cupos disponibles bajan en uno y ve "¡Listo! Tu cupo está reservado"

#### Scenario: La reserva no se crea si una regla falla
- **WHEN** el socio intenta reservar y falla RN-01, RN-02 o RN-03
- **THEN** no se crea la reserva, los cupos no cambian y ve el mensaje de la regla que falló

### Requirement: RN-01 Clase sin cupos
El sistema SHALL rechazar la reserva cuando la clase no tiene cupos disponibles y SHALL mostrar "Esta clase ya no tiene cupos."

#### Scenario: Cupo total cubierto por otros socios
- **WHEN** el socio intenta reservar una clase cuyo cupo total es igual a los cupos ocupados por otros socios y él no tiene reserva en esa clase
- **THEN** no se crea la reserva y ve "Esta clase ya no tiene cupos."

### Requirement: RN-02 Misma clase dos veces
El sistema SHALL rechazar una segunda reserva activa de la misma clase y SHALL mostrar "Ya reservaste esta clase."

#### Scenario: Reserva duplicada
- **WHEN** el socio ya tiene una reserva activa de una clase e intenta reservarla de nuevo
- **THEN** no se crea otra reserva y ve "Ya reservaste esta clase."

#### Scenario: Otra clase del mismo nombre
- **WHEN** el socio tiene una reserva activa de una clase e intenta reservar otra clase distinta, aunque comparta nombre
- **THEN** RN-02 no rechaza el intento

### Requirement: RN-03 Máximo dos reservas por día
El sistema SHALL rechazar una reserva cuando el socio ya tiene dos reservas activas en ese mismo día de clase, en America/Bogota, y SHALL mostrar "Solo puedes reservar 2 clases por día."

#### Scenario: Tercera reserva el mismo día
- **WHEN** el socio ya tiene dos reservas activas cuyo inicio cae el mismo día de clase e intenta reservar una tercera clase de ese día
- **THEN** no se crea la reserva y ve "Solo puedes reservar 2 clases por día."

#### Scenario: Dos reservas en un día y otra en otro día
- **WHEN** el socio ya tiene dos reservas activas en un día e intenta reservar una clase de otro día que cumple el resto de reglas
- **THEN** la reserva del otro día se crea

#### Scenario: Una reserva cancelada no cuenta
- **WHEN** el socio tuvo dos reservas el mismo día, canceló una y quedan cupos y una sola reserva activa ese día
- **THEN** puede reservar otra clase de ese día

### Requirement: Consultar mis reservas
El sistema SHALL mostrar las reservas activas del socio ordenadas por inicio, la más próxima primero, o "Aún no tienes reservas" si no hay ninguna.

#### Scenario: Listado ordenado
- **WHEN** el socio tiene varias reservas activas con inicios distintos
- **THEN** las ve ordenadas de la más próxima a la más lejana

#### Scenario: Sin reservas
- **WHEN** el socio no tiene reservas activas
- **THEN** ve "Aún no tienes reservas"

### Requirement: Cancelar una reserva
El sistema SHALL pedir confirmación antes de cancelar. Si el socio confirma y RN-04 lo permite, SHALL eliminar la reserva y liberar el cupo. Si no confirma, SHALL conservar la reserva.

#### Scenario: Confirmación aceptada
- **WHEN** el socio confirma la cancelación y faltan al menos 2 horas para el inicio
- **THEN** la reserva desaparece y el cupo disponible de esa clase aumenta en uno

#### Scenario: Confirmación rechazada
- **WHEN** el socio no confirma la cancelación
- **THEN** la reserva sigue activa y los cupos no cambian

### Requirement: RN-04 Cancelar hasta dos horas antes
El sistema SHALL permitir cancelar cuando faltan 2 horas o más para el inicio y SHALL rechazar la cancelación, conservando la reserva, cuando faltan menos de 2 horas, con el mensaje "Ya no puedes cancelar: faltan menos de 2 horas."

#### Scenario: Faltan exactamente dos horas
- **WHEN** el socio confirma la cancelación y el tiempo restante hasta el inicio es exactamente 2 horas
- **THEN** la reserva se cancela y el cupo se libera

#### Scenario: Faltan menos de dos horas
- **WHEN** el socio confirma la cancelación y el tiempo restante hasta el inicio es menor a 2 horas
- **THEN** la reserva sigue activa, el cupo no cambia y ve "Ya no puedes cancelar: faltan menos de 2 horas."

#### Scenario: La clase ya comenzó
- **WHEN** el socio confirma la cancelación y el inicio de la clase ya pasó
- **THEN** la reserva sigue activa y ve "Ya no puedes cancelar: faltan menos de 2 horas."

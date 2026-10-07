import { createReservationRepository } from '../../data/repositories/reservationRepository';
import { availableSpots } from '../../features/classes/model/availability';
import type { SchedulableClass } from '../../features/classes/model/classService';
import {
  cancelReservation,
  listMyReservations,
  reservationsMessage,
  reserveClass,
} from '../../features/reservations/model/reservationService';
import { RESERVE_OK, RN04_TOO_LATE } from '../../features/reservations/model/reservationRules';

const socioId = 'S-0001';
const morning = new Date('2026-10-07T15:00:00.000Z');

function clase(
  partial: Pick<SchedulableClass, 'id' | 'hora'> & Partial<SchedulableClass>,
): SchedulableClass {
  return {
    nombre: partial.nombre ?? partial.id,
    instructor: 'Camila',
    diaOffset: partial.diaOffset ?? 0,
    cupoTotal: partial.cupoTotal ?? 20,
    ocupados: partial.ocupados ?? 18,
    ...partial,
  };
}

function spots(store: ReturnType<typeof createReservationRepository>, item: SchedulableClass): number {
  const reservas = store.list().filter((reservation) => reservation.classId === item.id).length;
  return availableSpots(item.cupoTotal, item.ocupados, reservas);
}

describe('consultar y cancelar reservas', () => {
  it('ordena las reservas de la más próxima a la más lejana', () => {
    const store = createReservationRepository();
    const classes = [
      clase({ id: 'tarde', nombre: 'Rumba', hora: '20:00', ocupados: 0, cupoTotal: 30 }),
      clase({ id: 'temprano', nombre: 'Spinning', hora: '18:00', ocupados: 0, cupoTotal: 20 }),
    ];
    reserveClass(store, classes, 'tarde', socioId, morning);
    reserveClass(store, classes, 'temprano', socioId, morning);

    const listed = listMyReservations(classes, store.list(), socioId, morning);

    expect(listed.map((item) => item.classId)).toEqual(['temprano', 'tarde']);
  });

  it('informa cuando no hay reservas', () => {
    expect(reservationsMessage([])).toBe('Aún no tienes reservas');
  });

  it('cancela cuando faltan exactamente dos horas y libera el cupo', () => {
    const store = createReservationRepository();
    const item = clase({ id: 'C-02', hora: '18:00' });
    reserveClass(store, [item], item.id, socioId, morning);
    const reservationId = store.list()[0].id;
    const twoHoursBefore = new Date('2026-10-07T21:00:00.000Z');

    const result = cancelReservation(store, [item], reservationId, twoHoursBefore);

    expect(result.ok).toBe(true);
    expect(store.list()).toHaveLength(0);
    expect(spots(store, item)).toBe(2);
  });

  it('RN-04 conserva la reserva si faltan menos de dos horas', () => {
    const store = createReservationRepository();
    const item = clase({ id: 'C-02', hora: '18:00' });
    reserveClass(store, [item], item.id, socioId, morning);
    const reservationId = store.list()[0].id;
    const antes = spots(store, item);
    const tooLate = new Date('2026-10-07T21:00:00.001Z');

    const result = cancelReservation(store, [item], reservationId, tooLate);

    expect(result).toEqual({ ok: false, message: RN04_TOO_LATE });
    expect(store.list()).toHaveLength(1);
    expect(spots(store, item)).toBe(antes);
  });

  it('RN-04 conserva la reserva si la clase ya comenzó', () => {
    const store = createReservationRepository();
    const item = clase({ id: 'C-02', hora: '18:00' });
    reserveClass(store, [item], item.id, socioId, morning);
    const reservationId = store.list()[0].id;

    const result = cancelReservation(store, [item], reservationId, new Date('2026-10-07T23:01:00.000Z'));

    expect(result).toEqual({ ok: false, message: RN04_TOO_LATE });
    expect(store.list()).toHaveLength(1);
  });

  it('una reserva cancelada no cuenta para RN-03', () => {
    const store = createReservationRepository();
    const classes = [
      clase({ id: 'A', hora: '18:00', cupoTotal: 15, ocupados: 0 }),
      clase({ id: 'B', hora: '19:00', cupoTotal: 15, ocupados: 0 }),
      clase({ id: 'C', hora: '20:00', cupoTotal: 15, ocupados: 0 }),
    ];
    reserveClass(store, classes, 'A', socioId, morning);
    reserveClass(store, classes, 'B', socioId, morning);
    const canceled = store.list().find((item) => item.classId === 'A');
    cancelReservation(store, classes, canceled!.id, morning);

    const result = reserveClass(store, classes, 'C', socioId, morning);

    expect(result).toEqual({ ok: true, message: RESERVE_OK });
    expect(store.list().some((item) => item.classId === 'C')).toBe(true);
  });
});

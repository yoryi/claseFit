import { createReservationRepository } from '../../data/repositories/reservationRepository';
import { availableSpots } from '../../features/classes/model/availability';
import type { SchedulableClass } from '../../features/classes/model/classService';
import { reserveClass } from '../../features/reservations/model/reservationService';
import {
  RESERVE_OK,
  RN01_NO_SPOTS,
  RN02_ALREADY_RESERVED,
  RN03_DAILY_LIMIT,
} from '../../features/reservations/model/reservationRules';

const socioId = 'S-0001';
const now = new Date('2026-10-07T15:00:00.000Z');

function clase(
  partial: Pick<SchedulableClass, 'id' | 'hora' | 'cupoTotal' | 'ocupados'> & Partial<SchedulableClass>,
): SchedulableClass {
  return {
    nombre: partial.nombre ?? 'Funcional',
    instructor: 'Camila',
    diaOffset: partial.diaOffset ?? 0,
    ...partial,
  };
}

function spots(store: ReturnType<typeof createReservationRepository>, item: SchedulableClass): number {
  const reservas = store.list().filter((reservation) => reservation.classId === item.id).length;
  return availableSpots(item.cupoTotal, item.ocupados, reservas);
}

describe('reservar una clase', () => {
  it('crea la reserva, baja un cupo y confirma', () => {
    const store = createReservationRepository();
    const item = clase({ id: 'C-01', hora: '18:00', cupoTotal: 20, ocupados: 18 });

    const result = reserveClass(store, [item], item.id, socioId, now);

    expect(result).toEqual({ ok: true, message: RESERVE_OK });
    expect(store.list()).toHaveLength(1);
    expect(spots(store, item)).toBe(1);
  });

  it('RN-01 no reserva una clase sin cupos y no cambia los cupos', () => {
    const store = createReservationRepository();
    const item = clase({ id: 'C-03', hora: '19:00', cupoTotal: 12, ocupados: 12 });
    const antes = spots(store, item);

    const result = reserveClass(store, [item], item.id, socioId, now);

    expect(result).toEqual({ ok: false, message: RN01_NO_SPOTS });
    expect(store.list()).toHaveLength(0);
    expect(spots(store, item)).toBe(antes);
  });

  it('RN-02 rechaza la misma clase y no cambia los cupos', () => {
    const store = createReservationRepository();
    const item = clase({ id: 'C-02', hora: '18:00', cupoTotal: 15, ocupados: 9 });
    reserveClass(store, [item], item.id, socioId, now);
    const antes = spots(store, item);

    const result = reserveClass(store, [item], item.id, socioId, now);

    expect(result).toEqual({ ok: false, message: RN02_ALREADY_RESERVED });
    expect(store.list()).toHaveLength(1);
    expect(spots(store, item)).toBe(antes);
  });

  it('RN-02 no rechaza otra clase aunque comparta nombre', () => {
    const store = createReservationRepository();
    const hoy = clase({ id: 'C-01', nombre: 'Spinning', hora: '18:00', cupoTotal: 20, ocupados: 10 });
    const manana = clase({
      id: 'C-05',
      nombre: 'Spinning',
      diaOffset: 1,
      hora: '06:00',
      cupoTotal: 20,
      ocupados: 10,
    });
    reserveClass(store, [hoy, manana], hoy.id, socioId, now);

    const result = reserveClass(store, [hoy, manana], manana.id, socioId, now);

    expect(result.message).not.toBe(RN02_ALREADY_RESERVED);
    expect(result.ok).toBe(true);
  });

  it('RN-03 rechaza la tercera reserva del mismo día sin cambiar ese cupo', () => {
    const store = createReservationRepository();
    const classes = [
      clase({ id: 'A', hora: '18:00', cupoTotal: 15, ocupados: 0 }),
      clase({ id: 'B', hora: '19:00', cupoTotal: 15, ocupados: 0 }),
      clase({ id: 'C', hora: '20:00', cupoTotal: 15, ocupados: 0 }),
    ];
    reserveClass(store, classes, 'A', socioId, now);
    reserveClass(store, classes, 'B', socioId, now);
    const antes = spots(store, classes[2]);

    const result = reserveClass(store, classes, 'C', socioId, now);

    expect(result).toEqual({ ok: false, message: RN03_DAILY_LIMIT });
    expect(store.list().some((item) => item.classId === 'C')).toBe(false);
    expect(spots(store, classes[2])).toBe(antes);
  });

  it('RN-03 permite una reserva en otro día aunque hoy ya haya dos', () => {
    const store = createReservationRepository();
    const classes = [
      clase({ id: 'A', hora: '18:00', cupoTotal: 15, ocupados: 0 }),
      clase({ id: 'B', hora: '19:00', cupoTotal: 15, ocupados: 0 }),
      clase({ id: 'D', diaOffset: 1, hora: '06:00', cupoTotal: 15, ocupados: 0 }),
    ];
    reserveClass(store, classes, 'A', socioId, now);
    reserveClass(store, classes, 'B', socioId, now);

    const result = reserveClass(store, classes, 'D', socioId, now);

    expect(result).toEqual({ ok: true, message: RESERVE_OK });
    expect(store.list().some((item) => item.classId === 'D')).toBe(true);
  });
});

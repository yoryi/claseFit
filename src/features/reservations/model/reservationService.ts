import { availableSpots } from '../../classes/model/availability';
import type { SchedulableClass } from '../../classes/model/classService';
import type { createReservationRepository } from '../../../data/repositories/reservationRepository';
import { bogotaDayOffset, classStart, dayLabel, isSameBogotaDay } from '../../../shared/utils/bogotaTime';
import type { Reservation, ReservationView } from './Reservation';
import { EMPTY_RESERVATIONS, evaluateCancel, evaluateReserve, type RuleResult } from './reservationRules';

type ReservationStore = ReturnType<typeof createReservationRepository>;

function startOf(clase: SchedulableClass, now: Date): Date {
  return classStart(clase.diaOffset, clase.hora, now);
}

function findClass(classes: SchedulableClass[], classId: string): SchedulableClass {
  const clase = classes.find((item) => item.id === classId);
  if (!clase) {
    throw new Error(`Clase no encontrada: ${classId}`);
  }
  return clase;
}

export function reserveClass(
  store: ReservationStore,
  classes: SchedulableClass[],
  classId: string,
  socioId: string,
  now: Date,
): RuleResult {
  const clase = findClass(classes, classId);
  const mine = store.list().filter((item) => item.socioId === socioId);
  const inicio = startOf(clase, now);
  const reservasActivasEseDia = mine.filter((item) => {
    const reserved = findClass(classes, item.classId);
    return isSameBogotaDay(startOf(reserved, now), inicio);
  }).length;
  const reservasDeEstaClase = mine.filter((item) => item.classId === classId).length;
  const decision = evaluateReserve({
    disponiblesAntes: availableSpots(clase.cupoTotal, clase.ocupados, reservasDeEstaClase),
    yaReservoEstaClase: reservasDeEstaClase > 0,
    reservasActivasEseDia,
  });

  if (!decision.ok) {
    return decision;
  }

  store.add({ classId, socioId });
  return decision;
}

export function listMyReservations(
  classes: SchedulableClass[],
  reservations: Reservation[],
  socioId: string,
  now: Date,
): ReservationView[] {
  return reservations
    .filter((item) => item.socioId === socioId)
    .map((item) => {
      const clase = findClass(classes, item.classId);
      const inicio = startOf(clase, now);
      return {
        id: item.id,
        classId: item.classId,
        nombre: clase.nombre,
        instructor: clase.instructor,
        hora: clase.hora,
        dia: dayLabel(bogotaDayOffset(inicio, now)),
        inicio,
      };
    })
    .sort((left, right) => left.inicio.getTime() - right.inicio.getTime());
}

export function reservationsMessage(reservations: ReservationView[]): string | null {
  return reservations.length === 0 ? EMPTY_RESERVATIONS : null;
}

export function cancelReservation(
  store: ReservationStore,
  classes: SchedulableClass[],
  reservationId: string,
  now: Date,
): RuleResult {
  const reservation = store.list().find((item) => item.id === reservationId);
  if (!reservation) {
    throw new Error(`Reserva no encontrada: ${reservationId}`);
  }

  const clase = findClass(classes, reservation.classId);
  const decision = evaluateCancel(startOf(clase, now), now);
  if (!decision.ok) {
    return decision;
  }

  store.remove(reservationId);
  return decision;
}

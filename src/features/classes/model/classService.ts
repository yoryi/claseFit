import { bogotaDayOffset, classStart, dayLabel } from '../../../shared/utils/bogotaTime';
import type { UpcomingClass } from './Class';
import { availableSpots, spotsText } from './availability';

export const FULL_LABEL = 'Llena';

export type SchedulableClass = {
  id: string;
  nombre: string;
  instructor: string;
  diaOffset: number;
  hora: string;
  cupoTotal: number;
  ocupados: number;
};

export function presentClass(
  item: SchedulableClass,
  reservasActivasDelSocio: number,
  now: Date,
): UpcomingClass {
  const inicio = classStart(item.diaOffset, item.hora, now);
  const disponibles = availableSpots(item.cupoTotal, item.ocupados, reservasActivasDelSocio);
  const llena = disponibles === 0;
  const cuposTexto = spotsText(disponibles, item.cupoTotal);

  return {
    id: item.id,
    nombre: item.nombre,
    instructor: item.instructor,
    hora: item.hora,
    dia: dayLabel(bogotaDayOffset(inicio, now)),
    inicio,
    cupoTotal: item.cupoTotal,
    disponibles,
    cuposTexto,
    cupoVisible: llena ? FULL_LABEL : cuposTexto,
    llena,
    puedeReservar: !llena,
  };
}

export function listUpcomingClasses(
  classes: SchedulableClass[],
  reservasPorClase: Record<string, number>,
  now: Date,
): UpcomingClass[] {
  return classes
    .map((item) => presentClass(item, reservasPorClase[item.id] ?? 0, now))
    .filter((item) => {
      const offset = bogotaDayOffset(item.inicio, now);
      const inWindow = offset >= 0 && offset <= 2;
      const notStarted = now.getTime() < item.inicio.getTime();
      return inWindow && notStarted;
    })
    .sort((left, right) => left.inicio.getTime() - right.inicio.getTime());
}

import { useEffect, useMemo, useState } from 'react';
import { loadClasses, loadSocio } from '../../../data/repositories/classRepository';
import { reservationRepository } from '../../../data/repositories/reservationRepository';
import { listUpcomingClasses } from '../model/classService';
import { RESERVE_OK } from '../../reservations/model/reservationRules';
import { reserveClass } from '../../reservations/model/reservationService';
import type { Feedback } from '../../../shared/types/feedback';

function reservationCounts(socioId: string): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const reservation of reservationRepository.list()) {
    if (reservation.socioId !== socioId) {
      continue;
    }
    counts[reservation.classId] = (counts[reservation.classId] ?? 0) + 1;
  }
  return counts;
}

export function useClassesViewModel() {
  const socio = loadSocio();
  const [version, setVersion] = useState(0);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  useEffect(
    () =>
      reservationRepository.subscribe(() => {
        setVersion((value) => value + 1);
        setFeedback(null);
      }),
    [],
  );

  const classes = useMemo(
    () => listUpcomingClasses(loadClasses(), reservationCounts(socio.id), new Date()),
    [socio.id, version],
  );

  function reserve(classId: string) {
    const result = reserveClass(reservationRepository, loadClasses(), classId, socio.id, new Date());
    setFeedback({
      text: result.message,
      tone: result.ok && result.message === RESERVE_OK ? 'success' : 'error',
    });
  }

  return {
    socioNombre: socio.nombre,
    classes,
    feedback,
    reserve,
  };
}

import { useEffect, useMemo, useState } from 'react';
import { loadClasses, loadSocio } from '../../../data/repositories/classRepository';
import { reservationRepository } from '../../../data/repositories/reservationRepository';
import type { Feedback } from '../../../shared/types/feedback';
import { cancelReservation, listMyReservations, reservationsMessage } from '../model/reservationService';
import { resolveCancelPrompt } from './cancelPrompt';

export function useReservationsViewModel() {
  const socio = loadSocio();
  const [version, setVersion] = useState(0);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  useEffect(() => reservationRepository.subscribe(() => setVersion((value) => value + 1)), []);

  const reservations = useMemo(
    () => listMyReservations(loadClasses(), reservationRepository.list(), socio.id, new Date()),
    [socio.id, version],
  );
  const pending = reservations.find((item) => item.id === pendingId) ?? null;

  function askCancel(reservationId: string) {
    setPendingId(reservationId);
    setFeedback(null);
  }

  function dismissCancel() {
    setPendingId(resolveCancelPrompt(pendingId, false, () => undefined));
  }

  function confirmCancel() {
    setPendingId(
      resolveCancelPrompt(pendingId, true, (id) => {
        const result = cancelReservation(reservationRepository, loadClasses(), id, new Date());
        setFeedback(result.ok || !result.message ? null : { text: result.message, tone: 'error' });
      }),
    );
  }

  return {
    reservations,
    emptyMessage: reservationsMessage(reservations),
    pending,
    feedback,
    askCancel,
    dismissCancel,
    confirmCancel,
  };
}

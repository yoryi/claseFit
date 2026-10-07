import type { Reservation } from '../../features/reservations/model/Reservation';

type Listener = () => void;

export function createReservationRepository(initial: Reservation[] = []) {
  let reservations = initial.map((item) => ({ ...item }));
  const listeners = new Set<Listener>();
  let sequence = reservations.length;

  const notify = () => {
    listeners.forEach((listener) => listener());
  };

  return {
    list(): Reservation[] {
      return reservations.map((item) => ({ ...item }));
    },
    add(reservation: Omit<Reservation, 'id'> & { id?: string }): Reservation {
      sequence += 1;
      const stored: Reservation = {
        id: reservation.id ?? `R-${sequence}`,
        classId: reservation.classId,
        socioId: reservation.socioId,
      };
      reservations = [...reservations, stored];
      notify();
      return { ...stored };
    },
    remove(id: string): void {
      reservations = reservations.filter((item) => item.id !== id);
      notify();
    },
    subscribe(listener: Listener): () => void {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}

export const reservationRepository = createReservationRepository();

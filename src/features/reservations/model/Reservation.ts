export type Reservation = {
  id: string;
  classId: string;
  socioId: string;
};

export type ReservationView = {
  id: string;
  classId: string;
  nombre: string;
  instructor: string;
  hora: string;
  dia: string;
  inicio: Date;
};

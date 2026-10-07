export type ClassRecord = {
  id: string;
  nombre: string;
  instructor: string;
  diaOffset: number;
  hora: string;
  duracionMin: number;
  cupoTotal: number;
  ocupados: number;
};

export type Socio = {
  id: string;
  nombre: string;
};

export type UpcomingClass = {
  id: string;
  nombre: string;
  instructor: string;
  hora: string;
  dia: string;
  inicio: Date;
  cupoTotal: number;
  disponibles: number;
  cuposTexto: string;
  cupoVisible: string;
  llena: boolean;
  puedeReservar: boolean;
};

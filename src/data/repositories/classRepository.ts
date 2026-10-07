import catalog from '../mock/clases.json';
import type { ClassRecord, Socio } from '../../features/classes/model/Class';

export function loadSocio(): Socio {
  return { ...catalog.socio };
}

export function loadClasses(): ClassRecord[] {
  return catalog.clases.map((item) => ({ ...item }));
}

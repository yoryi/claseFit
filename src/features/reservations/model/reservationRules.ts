export const RESERVE_OK = '¡Listo! Tu cupo está reservado';
export const RN01_NO_SPOTS = 'Esta clase ya no tiene cupos.';
export const RN02_ALREADY_RESERVED = 'Ya reservaste esta clase.';
export const RN03_DAILY_LIMIT = 'Solo puedes reservar 2 clases por día.';
export const RN04_TOO_LATE = 'Ya no puedes cancelar: faltan menos de 2 horas.';
export const EMPTY_RESERVATIONS = 'Aún no tienes reservas';

const TWO_HOURS_MS = 2 * 60 * 60 * 1000;

export type RuleResult = {
  ok: boolean;
  message: string;
};

export function evaluateReserve(input: {
  disponiblesAntes: number;
  yaReservoEstaClase: boolean;
  reservasActivasEseDia: number;
}): RuleResult {
  if (input.yaReservoEstaClase) {
    return { ok: false, message: RN02_ALREADY_RESERVED };
  }
  if (input.disponiblesAntes <= 0) {
    return { ok: false, message: RN01_NO_SPOTS };
  }
  if (input.reservasActivasEseDia >= 2) {
    return { ok: false, message: RN03_DAILY_LIMIT };
  }
  return { ok: true, message: RESERVE_OK };
}

export function evaluateCancel(inicio: Date, now: Date): RuleResult {
  if (inicio.getTime() - now.getTime() >= TWO_HOURS_MS) {
    return { ok: true, message: '' };
  }
  return { ok: false, message: RN04_TOO_LATE };
}

export function availableSpots(
  cupoTotal: number,
  ocupados: number,
  reservasActivasDelSocio: number,
): number {
  return cupoTotal - ocupados - reservasActivasDelSocio;
}

export function spotsText(disponibles: number, cupoTotal: number): string {
  return `${disponibles} de ${cupoTotal} cupos`;
}

import { bogotaWallClock, classStart } from '../../shared/utils/bogotaTime';

const now = new Date('2026-10-07T15:00:00.000Z');

describe('fecha real de la clase en America/Bogota', () => {
  it('diaOffset 0 y hora 18:00 es hoy a las 18:00', () => {
    const start = classStart(0, '18:00', now);
    const clock = bogotaWallClock(start);

    expect(clock).toMatchObject({ year: 2026, month: 10, day: 7, hour: 18, minute: 0 });
    expect(start.toISOString()).toBe('2026-10-07T23:00:00.000Z');
  });

  it('diaOffset 1 y hora 06:00 es mañana a las 06:00', () => {
    const start = classStart(1, '06:00', now);
    const clock = bogotaWallClock(start);

    expect(clock).toMatchObject({ year: 2026, month: 10, day: 8, hour: 6, minute: 0 });
    expect(start.toISOString()).toBe('2026-10-08T11:00:00.000Z');
  });

  it('diaOffset 2 y hora 09:00 es pasado mañana a las 09:00', () => {
    const start = classStart(2, '09:00', now);
    const clock = bogotaWallClock(start);

    expect(clock).toMatchObject({ year: 2026, month: 10, day: 9, hour: 9, minute: 0 });
    expect(start.toISOString()).toBe('2026-10-09T14:00:00.000Z');
  });

  it('2026-10-08T02:30:00.000Z es el 7 de octubre de 2026 a las 21:30 en Bogotá', () => {
    expect(bogotaWallClock(new Date('2026-10-08T02:30:00.000Z'))).toEqual({
      year: 2026,
      month: 10,
      day: 7,
      hour: 21,
      minute: 30,
    });
  });
});

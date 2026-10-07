import { classStart } from '../../shared/utils/bogotaTime';
import { FULL_LABEL, listUpcomingClasses, type SchedulableClass } from '../../features/classes/model/classService';

const now = new Date('2026-10-07T15:00:00.000Z');

function clase(partial: Pick<SchedulableClass, 'id' | 'diaOffset' | 'hora' | 'cupoTotal' | 'ocupados'> & Partial<SchedulableClass>): SchedulableClass {
  return {
    nombre: partial.nombre ?? partial.id,
    instructor: partial.instructor ?? 'Ana',
    ...partial,
  };
}

const catalogo: SchedulableClass[] = [
  clase({ id: 'hoy-tarde', nombre: 'Funcional', instructor: 'Camila', diaOffset: 0, hora: '18:00', cupoTotal: 15, ocupados: 9 }),
  clase({ id: 'hoy-temprano', diaOffset: 0, hora: '06:00', cupoTotal: 20, ocupados: 1 }),
  clase({ id: 'manana', nombre: 'Yoga', instructor: 'Valentina', diaOffset: 1, hora: '06:00', cupoTotal: 12, ocupados: 5 }),
  clase({ id: 'pasado', nombre: 'Spinning', instructor: 'Andrés', diaOffset: 2, hora: '09:00', cupoTotal: 20, ocupados: 13 }),
  clase({ id: 'dentro-de-tres', diaOffset: 3, hora: '09:00', cupoTotal: 20, ocupados: 1 }),
  clase({ id: 'llena', nombre: 'Rumba', instructor: 'Julián', diaOffset: 0, hora: '19:00', cupoTotal: 12, ocupados: 12 }),
];

describe('ventana de próximas clases', () => {
  it('incluye hoy, mañana y pasado mañana, y excluye dentro de tres días', () => {
    const ids = listUpcomingClasses(catalogo, {}, now).map((item) => item.id);

    expect(ids).toEqual(expect.arrayContaining(['hoy-tarde', 'manana', 'pasado']));
    expect(ids).not.toContain('dentro-de-tres');
  });

  it('ordena por inicio, de la más próxima a la más lejana', () => {
    const ids = listUpcomingClasses(catalogo, {}, now).map((item) => item.id);

    expect(ids).toEqual(['hoy-tarde', 'llena', 'manana', 'pasado']);
  });

  it('oculta una clase cuando la hora actual es igual o posterior a su inicio', () => {
    const ids = listUpcomingClasses(catalogo, {}, now).map((item) => item.id);
    expect(ids).not.toContain('hoy-temprano');

    const exact = classStart(0, '18:00', now);
    const atStart = listUpcomingClasses(
      [clase({ id: 'exacta', diaOffset: 0, hora: '18:00', cupoTotal: 10, ocupados: 1 })],
      {},
      exact,
    );
    expect(atStart).toEqual([]);
  });

  it('muestra una clase de la ventana que todavía no inicia', () => {
    const listed = listUpcomingClasses(catalogo, {}, now);
    const funcional = listed.find((item) => item.id === 'hoy-tarde');

    expect(funcional).toMatchObject({
      nombre: 'Funcional',
      dia: 'Hoy',
      hora: '18:00',
      instructor: 'Camila',
      cuposTexto: '6 de 15 cupos',
      puedeReservar: true,
    });
    expect(listed.find((item) => item.id === 'manana')?.dia).toBe('Mañana');
    expect(listed.find((item) => item.id === 'pasado')?.dia).toBe('Pasado mañana');
  });

  it('marca como Llena una clase sin cupos y no permite reservarla', () => {
    const llena = listUpcomingClasses(catalogo, {}, now).find((item) => item.id === 'llena');

    expect(llena).toMatchObject({
      llena: true,
      puedeReservar: false,
      disponibles: 0,
      cupoVisible: FULL_LABEL,
    });
  });
});

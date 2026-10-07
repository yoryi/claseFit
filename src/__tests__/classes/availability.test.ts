import { loadClasses } from '../../data/repositories/classRepository';
import { availableSpots, spotsText } from '../../features/classes/model/availability';

describe('cupos disponibles', () => {
  it('resta solo los cupos ocupados por otros socios', () => {
    expect(availableSpots(20, 18, 0)).toBe(2);
    expect(spotsText(2, 20)).toBe('2 de 20 cupos');
  });

  it('suma la reserva activa del socio', () => {
    expect(availableSpots(20, 18, 1)).toBe(1);
    expect(spotsText(1, 20)).toBe('1 de 20 cupos');
  });

  it('carga las clases desde el JSON sin modificar el cupo guardado', () => {
    const spinning = loadClasses().find((item) => item.id === 'C-01');

    expect(spinning).toMatchObject({ cupoTotal: 20, ocupados: 18 });
    expect(loadClasses().find((item) => item.id === 'C-01')).toMatchObject({
      cupoTotal: 20,
      ocupados: 18,
    });
  });
});

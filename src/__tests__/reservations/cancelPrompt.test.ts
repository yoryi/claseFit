import { resolveCancelPrompt } from '../../features/reservations/viewModel/cancelPrompt';

describe('confirmación de cancelación', () => {
  it('no llama al servicio si el socio no confirma', () => {
    const cancel = jest.fn();

    expect(resolveCancelPrompt('R-1', false, cancel)).toBeNull();
    expect(cancel).not.toHaveBeenCalled();
  });

  it('llama al servicio solo cuando el socio confirma', () => {
    const cancel = jest.fn();

    resolveCancelPrompt('R-1', true, cancel);

    expect(cancel).toHaveBeenCalledTimes(1);
    expect(cancel).toHaveBeenCalledWith('R-1');
  });
});

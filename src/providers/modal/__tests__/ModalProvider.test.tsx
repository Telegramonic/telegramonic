import { renderWithProviders } from '@testUtils';
import { renderHook } from '@testing-library/react';
import ModalProvider from '../ModalProvider';
import { appStore } from '@uiStore';

describe('ModalProvider', () => {
  it('should render correctly', () => {
    const { result } = renderHook(() => appStore());

    result.current.Modal.resetModalState();
    const { container } = renderWithProviders(<ModalProvider>App</ModalProvider>);

    jest.runAllTimersAsync();

    expect(container).toMatchSnapshot();
    expect(container.textContent).toContain('App');
  });

  it('should render correctly with children', () => {
    const { result } = renderHook(() => appStore());

    result.current.Modal.resetModalState();
    const { container } = renderWithProviders(
      <ModalProvider>
        <div>App</div>
      </ModalProvider>,
    );

    jest.runAllTimersAsync();

    expect(container).toMatchSnapshot();
    expect(container.textContent).toContain('App');
  });
});

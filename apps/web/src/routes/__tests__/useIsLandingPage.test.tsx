import type { ReactNode } from 'react';
import { renderHook } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import useIsLandingPage from '../useIsLandingPage';

describe('useIsLandingPage', () => {
  const wrapper = ({
    children,
    initialEntries,
  }: {
    children: ReactNode;
    initialEntries?: string[];
  }) => <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>;

  it('should return true for landing page "/"', () => {
    const { result } = renderHook(() => useIsLandingPage(), {
      wrapper: ({ children }) => wrapper({ children, initialEntries: ['/'] }),
    });
    expect(result.current).toBe(true);
  });

  it('should return true for static screens like "/about-us"', () => {
    const { result } = renderHook(() => useIsLandingPage(), {
      wrapper: ({ children }) =>
        wrapper({ children, initialEntries: ['/about-us'] }),
    });
    expect(result.current).toBe(true);
  });

  it('should return false for other routes like "/dashboard"', () => {
    const { result } = renderHook(() => useIsLandingPage(), {
      wrapper: ({ children }) =>
        wrapper({ children, initialEntries: ['/dashboard'] }),
    });
    expect(result.current).toBe(false);
  });
});

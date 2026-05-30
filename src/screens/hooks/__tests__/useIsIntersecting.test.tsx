import { renderHook, act } from '@testing-library/react';
import useIsIntersecting from '../useIsIntersecting';

const mockObserve = jest.fn();
const mockDisconnect = jest.fn();
let intersectCallback: any = null;

global.IntersectionObserver = jest.fn().mockImplementation((callback) => {
  intersectCallback = callback;
  return {
    observe: mockObserve,
    disconnect: mockDisconnect,
    unobserve: jest.fn(),
  };
}) as any;

describe('useIsIntersecting', () => {
  beforeEach(() => {
    mockObserve.mockClear();
    mockDisconnect.mockClear();
    intersectCallback = null;
  });

  it('observes the target ref on mount and disconnects on unmount', () => {
    const ref = { current: document.createElement('div') };
    const { unmount } = renderHook(() => useIsIntersecting(ref));

    expect(global.IntersectionObserver).toHaveBeenCalled();
    expect(mockObserve).toHaveBeenCalledWith(ref.current);

    unmount();
    expect(mockDisconnect).toHaveBeenCalled();
  });

  it('updates state when intersection changes', () => {
    const ref = { current: document.createElement('div') };
    const { result } = renderHook(() => useIsIntersecting(ref));

    expect(result.current).toBe(false);

    act(() => {
      intersectCallback([{ isIntersecting: true }]);
    });

    expect(result.current).toBe(true);

    act(() => {
      intersectCallback([{ isIntersecting: false }]);
    });

    expect(result.current).toBe(false);
  });
});

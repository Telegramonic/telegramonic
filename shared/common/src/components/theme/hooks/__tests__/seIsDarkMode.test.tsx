import { renderHook } from '@testing-library/react';
import useIsDarkMode from '../useIsDarkMode';

// next-themes is mocked in jest.js with resolvedTheme: 'dark'
describe('UseIsDarkMode', () => {
  it('should return true when dark mode is active', () => {
    const { result } = renderHook(() => useIsDarkMode());

    expect(result.current).toBeTruthy();
  });
});

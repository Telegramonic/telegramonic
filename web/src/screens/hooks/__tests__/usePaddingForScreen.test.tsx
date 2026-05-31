import { renderHook } from '@testing-library/react';
import usePaddingForScreen from '../usePaddingForScreen';
import { useIsLandingPage } from '@routes';
import {
  HORIZONTAL_PADDING_2XL,
  HORIZONTAL_PADDING_XL,
  HORIZONTAL_PADDING_LG,
  HORIZONTAL_PADDING_MD,
  HORIZONTAL_PADDING_BASE,
} from '../constants';

jest.mock('@routes', () => ({
  useIsLandingPage: jest.fn(),
}));

describe('usePaddingForScreen', () => {
  it('returns landing page padding values when on landing page', () => {
    (useIsLandingPage as jest.Mock).mockReturnValue(true);
    const { result } = renderHook(() => usePaddingForScreen());

    expect(result.current).toEqual({
      '2xl': HORIZONTAL_PADDING_2XL,
      xl: HORIZONTAL_PADDING_XL,
      lg: HORIZONTAL_PADDING_LG,
      md: HORIZONTAL_PADDING_MD,
      base: HORIZONTAL_PADDING_BASE,
    });
  });

  it('returns base layout padding values when not on landing page', () => {
    (useIsLandingPage as jest.Mock).mockReturnValue(false);
    const { result } = renderHook(() => usePaddingForScreen());

    expect(result.current).toEqual({
      base: 3,
      md: HORIZONTAL_PADDING_MD,
    });
  });
});

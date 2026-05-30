import { useIsLandingPage } from '@routes';
import {
  HORIZONTAL_PADDING_2XL,
  HORIZONTAL_PADDING_XL,
  HORIZONTAL_PADDING_LG,
  HORIZONTAL_PADDING_MD,
  HORIZONTAL_PADDING_BASE,
} from './constants';
import { useMemo } from 'react';

const usePaddingForScreen = () => {
  const isLandingPage = useIsLandingPage();

  const data = useMemo(
    () =>
      isLandingPage
        ? {
            '2xl': HORIZONTAL_PADDING_2XL,
            xl: HORIZONTAL_PADDING_XL,
            lg: HORIZONTAL_PADDING_LG,
            md: HORIZONTAL_PADDING_MD,
            base: HORIZONTAL_PADDING_BASE,
          }
        : {
            base: 3,
            md: HORIZONTAL_PADDING_MD,
          },
    [isLandingPage],
  );

  return data;
};

export default usePaddingForScreen;

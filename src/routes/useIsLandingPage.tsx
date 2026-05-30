import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

const STATIC_SCREENS = [
  '/',
  '/privacy-policy',
  '/about-us',
  '/contact-us',
  '/company',
  '/terms-and-conditions',
  '/faq',
  '/team',
  '/coming-soon',
];
/**
 * Check if the current page is the landing page
 * @returns {boolean} isLandingPage
 */
const useIsLandingPage = (): boolean => {
  const { pathname } = useLocation();
  const isStaticScreen = useMemo(
    () => STATIC_SCREENS.includes(pathname),
    [pathname],
  );

  return isStaticScreen;
};

export default useIsLandingPage;

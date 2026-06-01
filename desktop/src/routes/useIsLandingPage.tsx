import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

const STATIC_SCREENS = [
  '/',
  '/privacy',
  '/privacy-policy',
  '/terms',
  '/terms-and-conditions',
  '/about-us',
  '/contact-us',
  '/company',
  '/faq',
  '/disclaimer',
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

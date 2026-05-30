import {
  Navigate,
  Route,
  createBrowserRouter,
  createRoutesFromChildren,
} from 'react-router-dom';
import {
  LazyLandingPage,
  LazyMdPage,
  LazyPublicHost,
} from './lazyScreens/publicScreens';

export const getAppRouter = (isUserLogin: boolean) => {
  return createBrowserRouter(
    createRoutesFromChildren(
      <Route path="/" element={<LazyPublicHost />}>
        <Route path="" element={<LazyLandingPage />} />
        <Route path="privacy" element={<LazyMdPage />} />
        <Route path="terms" element={<LazyMdPage />} />
        <Route path="contact-us" element={<LazyMdPage />} />
        <Route path="about-us" element={<LazyMdPage />} />
        <Route path="faq" element={<LazyMdPage />} />
        <Route path="disclaimer" element={<LazyMdPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>,
    ),
  );
};

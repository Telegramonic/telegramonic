import {
  Navigate,
  Outlet,
  Route,
  createBrowserRouter,
  createRoutesFromChildren,
} from 'react-router-dom';
import {
  LazyLandingPage,
  LazyMdPage,
  LazyPublicHost,
  LazyLoginPage,
  LazyDashboardPage,
  LazyDocsPage,
  LazyProductPage,
} from './lazyScreens/publicScreens';
import { appStore, selectIsAuthenticated } from '@appStore';

const ProtectedRoute = () => {
  const isAuthenticated = appStore(selectIsAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

const GuestRoute = () => {
  const isAuthenticated = appStore(selectIsAuthenticated);
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export const getAppRouter = (isUserLogin: boolean) => {
  return createBrowserRouter(
    createRoutesFromChildren(
      <Route path="/" element={<LazyPublicHost />}>
        <Route path="" element={<LazyLandingPage />} />

        {/* Guest only routes (login is hidden when already authenticated) */}
        <Route element={<GuestRoute />}>
          <Route path="login" element={<LazyLoginPage />} />
        </Route>

        {/* Protected only routes (dashboard is only accessible when authenticated) */}
        <Route element={<ProtectedRoute />}>
          <Route path="dashboard" element={<LazyDashboardPage />} />
        </Route>

        <Route path="docs" element={<LazyDocsPage />} />
        <Route path="docs/:docId" element={<LazyDocsPage />} />

        <Route path="product" element={<LazyProductPage />} />

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

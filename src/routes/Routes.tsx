import {
  Navigate,
  Route,
  createBrowserRouter,
  createRoutesFromChildren,
} from 'react-router-dom';
import { LazyLandingPage, LazyPublicHost } from './lazyScreens/publicScreens';

export const getAppRouter = (isUserLogin: boolean) => {
  return createBrowserRouter(
    createRoutesFromChildren(
      <Route path="/" element={<LazyPublicHost />}>
        <Route path="" element={<LazyLandingPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>,
    ),
  );
};

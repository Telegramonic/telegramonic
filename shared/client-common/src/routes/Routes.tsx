import {
  Navigate,
  Route,
  createHashRouter,
  createRoutesFromChildren,
} from 'react-router-dom';
import { LazyLoginPage, LazyDashboardPage } from './lazyScreens/publicScreens';

export const getAppRouter = (isUserLogin: boolean) => {
  return createHashRouter(
    createRoutesFromChildren(
      <>
        {isUserLogin ? (
          <>
            <Route path="/" element={<LazyDashboardPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          <>
            <Route path="/" element={<LazyLoginPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </>,
    ),
  );
};

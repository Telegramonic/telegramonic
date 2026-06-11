import { LazyProvider } from '@providers';
import { lazy } from 'react';

// [Start]-------- Login screen --------

const LoginPage = lazy(() => import('@screens/loginPage/LoginPage'));

export const LazyLoginPage = () => (
  <LazyProvider>
    <LoginPage />
  </LazyProvider>
);

// [End]-------- Login screen --------

// [Start]-------- Dashboard screen --------

const DashboardPage = lazy(() => import('@screens/dashboard/Dashboard'));

export const LazyDashboardPage = () => (
  <LazyProvider>
    <DashboardPage />
  </LazyProvider>
);

// [End]-------- Dashboard screen --------

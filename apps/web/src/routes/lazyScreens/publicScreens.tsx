import { LazyProvider } from '@providers';
import { lazy } from 'react';

// [Start]-------- Host screen --------

const Host = lazy(() => import('@screens/Host/Host'));

export const LazyPublicHost = () => (
  <LazyProvider>
    <Host />
  </LazyProvider>
);

// [End]-------- Host screen --------

// [Start]-------- Landing screens --------

const LandingPage = lazy(() => import('@screens/landingPage/LandingPage'));

export const LazyLandingPage = () => (
  <LazyProvider>
    <LandingPage />
  </LazyProvider>
);

// [End]-------- Landing screens --------

// [Start]-------- MdPage screen --------

const MdPage = lazy(() => import('@screens/MdPage/MdPage'));

export const LazyMdPage = () => (
  <LazyProvider>
    <MdPage />
  </LazyProvider>
);

// [End]-------- MdPage screen --------

// [Start]-------- DocsPage screen --------

const DocsPage = lazy(() => import('@screens/DocsPage/DocsPage'));

export const LazyDocsPage = () => (
  <LazyProvider>
    <DocsPage />
  </LazyProvider>
);

// [End]-------- DocsPage screen --------

// [Start]-------- ProductPage screen --------

const ProductPage = lazy(() => import('@screens/ProductPage/ProductPage'));

export const LazyProductPage = () => (
  <LazyProvider>
    <ProductPage />
  </LazyProvider>
);

// [End]-------- ProductPage screen --------

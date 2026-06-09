import { Suspense } from 'react';
import * as React from 'react';
import { LazyProviderProps } from './types';
import { LoadingComponent } from '@components';

const LazyProvider = ({ children }: LazyProviderProps) => {
  return <Suspense fallback={<LoadingComponent />}>{children}</Suspense>;
};

export default LazyProvider;

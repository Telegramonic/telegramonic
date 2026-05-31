import { StrictMode } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import {
  LocalizationProvider,
  ModalProvider,
  RouterProvider,
  ThemeProvider,
} from '@providers';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 5,
      retryDelay: 1000,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <StrictMode>
        <LocalizationProvider>
          <HelmetProvider>
            <ThemeProvider>
              <ModalProvider>
                <RouterProvider />
              </ModalProvider>
            </ThemeProvider>
          </HelmetProvider>
        </LocalizationProvider>
      </StrictMode>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;

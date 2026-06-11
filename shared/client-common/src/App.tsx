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
import TitleBar from './components/TitleBar';

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
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100vh',
                    overflow: 'hidden',
                  }}
                >
                  <TitleBar />
                  <div style={{ flex: 1, overflow: 'auto' }}>
                    <RouterProvider />
                  </div>
                </div>
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

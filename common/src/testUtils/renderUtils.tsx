import type { ReactNode, ReactElement } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, renderHook } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { system } from '@components';

const AllProviders = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider value={system}>
        <BrowserRouter>{children}</BrowserRouter>
      </ChakraProvider>
    </QueryClientProvider>
  );
};

/**
 * Render with providers.
 * @param ui - The UI to render.
 * @returns The rendered component.
 */
export const renderWithProviders = (ui: ReactElement) => {
  const queryClient = new QueryClient();
  const { rerender, ...result } = render(ui, {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>
        <ChakraProvider value={system}>
          <BrowserRouter>{children}</BrowserRouter>
        </ChakraProvider>
      </QueryClientProvider>
    ),
  });

  return {
    ...result,
    renderer: (renderUi: ReactElement) =>
      rerender(
        <QueryClientProvider client={queryClient}>
          <ChakraProvider value={system}>
            <BrowserRouter>{renderUi}</BrowserRouter>
          </ChakraProvider>
        </QueryClientProvider>,
      ),
  };
};

/**
 * Render with router.
 * @param ui - The UI to render.
 * @returns The rendered component.
 */
export const renderWithRouter = (ui: ReactElement) => {
  return render(
    <ChakraProvider value={system}>
      <BrowserRouter>{ui}</BrowserRouter>
    </ChakraProvider>,
  );
};

/**
 * Render with providers and router.
 * @param ui - The UI to render.
 * @returns The rendered component.
 */
export const renderWithProvidersAndRouter = (ui: ReactElement) => {
  const queryClient = new QueryClient();
  const { rerender, ...result } = render(ui, {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>
        <ChakraProvider value={system}>
          <BrowserRouter>{children}</BrowserRouter>
        </ChakraProvider>
      </QueryClientProvider>
    ),
  });

  return {
    ...result,
    renderer: (renderUi: ReactElement) =>
      rerender(
        <QueryClientProvider client={queryClient}>
          <ChakraProvider value={system}>
            <BrowserRouter>{renderUi}</BrowserRouter>
          </ChakraProvider>
        </QueryClientProvider>,
      ),
  };
};

/**
 * Render hook with providers.
 * @param renderCallback - The render callback.
 * @returns The rendered hook.
 */
export const renderHookWithProviders = <Result, Props>(
  renderCallback: (props: Props) => Result,
) => {
  return renderHook(renderCallback, {
    wrapper: ({ children }) => <AllProviders>{children}</AllProviders>,
  });
};

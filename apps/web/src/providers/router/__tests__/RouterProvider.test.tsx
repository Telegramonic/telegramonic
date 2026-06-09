import { ChakraProvider } from '@chakra-ui/react';
import { render } from '@testing-library/react';
import RouterProvider from '../RouterProvider';
import { system } from '@components';

// RouterProvider already has its own router, so we can't use renderWithProviders
// (which wraps with BrowserRouter). Only wrap with ChakraProvider.
describe('RouterProvider', () => {
  it('should render router provider correctly', async () => {
    const { container } = render(
      <ChakraProvider value={system}>
        <RouterProvider />
      </ChakraProvider>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should render router provider correctly', async () => {
    const { container } = render(
      <ChakraProvider value={system}>
        <RouterProvider />
      </ChakraProvider>,
    );

    expect(container).toMatchSnapshot();
  });
});

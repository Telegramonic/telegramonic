import { renderWithProviders } from '@testUtils';
import LazyProvider from '../LazyProvider';
import { Text } from '@chakra-ui/react';

describe('LazyProvider', () => {
  it('should render correctly', () => {
    const { container } = renderWithProviders(
      <LazyProvider>
        <Text>Test</Text>
      </LazyProvider>,
    );

    expect(container).toMatchSnapshot();
    expect(container.textContent).toContain('Test');
  });
});

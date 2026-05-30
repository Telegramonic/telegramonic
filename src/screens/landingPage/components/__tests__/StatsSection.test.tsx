import { render } from '@testing-library/react';
import { StatsSection } from '../StatsSection';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';

describe('StatsSection', () => {
  it('renders successfully', () => {
    const { getByText } = render(
      <ChakraProvider value={defaultSystem}>
        <StatsSection />
      </ChakraProvider>,
    );
    expect(getByText('800M+')).toBeInTheDocument();
    expect(getByText('Telegram Users')).toBeInTheDocument();
    expect(getByText('Monthly Cost')).toBeInTheDocument();
  });
});

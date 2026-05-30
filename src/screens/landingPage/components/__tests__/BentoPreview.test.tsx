import { render } from '@testing-library/react';
import { BentoPreview } from '../BentoPreview';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';

describe('BentoPreview', () => {
  it('renders successfully', () => {
    const { getByText, getByAltText } = render(
      <ChakraProvider value={defaultSystem}>
        <BentoPreview />
      </ChakraProvider>,
    );
    expect(getByAltText('Telegramonic Dashboard Preview')).toBeInTheDocument();
    expect(getByText('Turbocharged Transfers')).toBeInTheDocument();
  });
});

import { render } from '@testing-library/react';
import { CTASection } from '../CTASection';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';

describe('CTASection', () => {
  it('renders successfully', () => {
    const { getByText } = render(
      <ChakraProvider value={defaultSystem}>
        <CTASection />
      </ChakraProvider>,
    );
    expect(getByText('Ready to upgrade your storage?')).toBeInTheDocument();
  });
});

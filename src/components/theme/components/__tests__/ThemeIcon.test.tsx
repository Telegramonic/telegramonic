import { render, fireEvent } from '@testing-library/react';
import ThemeIcon from '../ThemeIcon';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';


const mockSetTheme = jest.fn();

jest.mock('next-themes', () => ({
  useTheme: () => ({
    resolvedTheme: 'dark',
    theme: 'dark',
    setTheme: mockSetTheme,
  }),
}));

describe('ThemeIcon', () => {
  beforeEach(() => {
    mockSetTheme.mockClear();
  });

  it('renders correctly', () => {
    const { container } = render(
      <ChakraProvider value={defaultSystem}>
        <ThemeIcon />
      </ChakraProvider>,
    );
    expect(container).toBeInTheDocument();
  });

  it('toggles theme onClick', () => {
    const { getByRole } = render(
      <ChakraProvider value={defaultSystem}>
        <ThemeIcon />
      </ChakraProvider>,
    );
    const button = getByRole('button', { name: 'toggle-color-mode' });
    fireEvent.click(button);
    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });
});

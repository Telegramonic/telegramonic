import { render, fireEvent } from '@testing-library/react';
import ThemeSelector from '../ThemeIcon';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';

const mockSetTheme = jest.fn();

jest.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'system',
    resolvedTheme: 'light',
    setTheme: mockSetTheme,
  }),
}));

describe('ThemeSelector', () => {
  beforeEach(() => {
    mockSetTheme.mockClear();
  });

  it('renders correctly with system as default', () => {
    const { container } = render(
      <ChakraProvider value={defaultSystem}>
        <ThemeSelector />
      </ChakraProvider>,
    );
    expect(container).toBeInTheDocument();
    const select = container.querySelector(
      '#theme-selector',
    ) as HTMLSelectElement;
    expect(select).not.toBeNull();
    expect(select.value).toBe('system');
  });

  it('has system, light and dark options', () => {
    const { container } = render(
      <ChakraProvider value={defaultSystem}>
        <ThemeSelector />
      </ChakraProvider>,
    );
    const options = container.querySelectorAll('#theme-selector option');
    const values = Array.from(options).map(
      (o) => (o as HTMLOptionElement).value,
    );
    expect(values).toEqual(['system', 'light', 'dark']);
  });

  it('calls setTheme with selected value on change', () => {
    const { container } = render(
      <ChakraProvider value={defaultSystem}>
        <ThemeSelector />
      </ChakraProvider>,
    );
    const select = container.querySelector(
      '#theme-selector',
    ) as HTMLSelectElement;
    fireEvent.change(select, { target: { value: 'dark' } });
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('calls setTheme with light on change to light', () => {
    const { container } = render(
      <ChakraProvider value={defaultSystem}>
        <ThemeSelector />
      </ChakraProvider>,
    );
    const select = container.querySelector(
      '#theme-selector',
    ) as HTMLSelectElement;
    fireEvent.change(select, { target: { value: 'light' } });
    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });
});

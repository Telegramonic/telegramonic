import { render } from '@testing-library/react';
import ThemeProvider from '../ThemeProvider';

describe('ThemeProvider', () => {
  it('should render children successfully', () => {
    const { getByText } = render(
      <ThemeProvider>
        <div>Theme Child</div>
      </ThemeProvider>,
    );
    expect(getByText('Theme Child')).toBeInTheDocument();
  });
});

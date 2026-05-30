import { render } from '@testing-library/react';
import Logo from '../Logo';

describe('Logo', () => {
  it('renders correctly with default size', () => {
    const { container } = render(<Logo />);
    const svgElement = container.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
    expect(svgElement).toHaveAttribute('width', '120');
    expect(svgElement).toHaveAttribute('height', '120');
    expect(svgElement).toHaveClass('telegramonic-icon');
  });

  it('renders correctly with custom size', () => {
    const { container } = render(<Logo size={60} />);
    const svgElement = container.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
    expect(svgElement).toHaveAttribute('width', '60');
    expect(svgElement).toHaveAttribute('height', '60');
  });

  it('passes through extra SVG props', () => {
    const { container } = render(<Logo data-testid="logo-svg" opacity={0.5} />);
    const svgElement = container.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
    expect(svgElement).toHaveAttribute('data-testid', 'logo-svg');
    expect(svgElement).toHaveAttribute('opacity', '0.5');
  });
});

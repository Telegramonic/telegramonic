import { render } from '@testing-library/react';
import Icon from '../Icon';
import { IconType } from '../types';

describe('Icon Wrapper', () => {
  it('renders Logo icon correctly', () => {
    const { container } = render(<Icon type={IconType.LOGO} size={60} />);
    const svgElement = container.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
    expect(svgElement).toHaveAttribute('width', '60');
    expect(svgElement).toHaveClass('telegramonic-icon');
  });

  it('renders CloudIcon correctly', () => {
    const { container } = render(<Icon type={IconType.CLOUD} size={30} />);
    const svgElement = container.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
    expect(svgElement).toHaveAttribute('width', '30');
  });

  it('renders BoltIcon correctly', () => {
    const { container } = render(<Icon type={IconType.BOLT} size={25} />);
    const svgElement = container.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
    expect(svgElement).toHaveAttribute('width', '25');
  });

  it('renders PinIcon correctly', () => {
    const { container } = render(<Icon type={IconType.PIN} size={20} />);
    const svgElement = container.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
    expect(svgElement).toHaveAttribute('width', '20');
  });

  it('renders CodeIcon correctly', () => {
    const { container } = render(<Icon type={IconType.CODE} size={20} />);
    const svgElement = container.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
    expect(svgElement).toHaveAttribute('width', '20');
  });

  it('renders PresentationIcon correctly', () => {
    const { container } = render(<Icon type={IconType.PRESENTATION} size={20} />);
    const svgElement = container.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
    expect(svgElement).toHaveAttribute('width', '20');
  });

  it('renders CsvIcon correctly', () => {
    const { container } = render(<Icon type={IconType.CSV} size={20} />);
    const svgElement = container.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
    expect(svgElement).toHaveAttribute('width', '20');
  });

  it('renders AudioIcon correctly', () => {
    const { container } = render(<Icon type={IconType.AUDIO} size={20} />);
    const svgElement = container.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
    expect(svgElement).toHaveAttribute('width', '20');
  });

  it('returns null for unknown icon type', () => {
    // @ts-expect-error - testing invalid type
    const { container } = render(<Icon type="UNKNOWN" />);
    expect(container.firstChild).toBeNull();
  });
});

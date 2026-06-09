import { screen } from '@testing-library/react';
import { renderWithRouter } from '@testUtils';
import LandingPage from '../LandingPage';

describe('LandingPage', () => {
  it('should render correctly for guest user', () => {
    const { container } = renderWithRouter(<LandingPage />);

    expect(container).toMatchSnapshot();

    // Verify Hero Section copy is rendered
    expect(screen.getByText('Vast Cloud Storage')).toBeInTheDocument();
    expect(screen.getByText('Powered by Telegram')).toBeInTheDocument();
    expect(screen.getAllByText('Get Started')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Explore Features')[0]).toBeInTheDocument();

    // Verify Features Section copy is rendered
    expect(screen.getByText('Engineered for Performance')).toBeInTheDocument();
    expect(screen.getAllByText('Infinite Storage')[0]).toBeInTheDocument();
    expect(
      screen.getAllByText('Turbocharged Transfers')[0],
    ).toBeInTheDocument();
    expect(
      screen.getAllByText('Seamless Sync across Devices')[0],
    ).toBeInTheDocument();
  });
});

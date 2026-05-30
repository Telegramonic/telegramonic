import React from 'react';
import { act, screen } from '@testing-library/react';
import { renderWithRouter } from '@testUtils';
import { appStore } from '@appStore';
import LandingPage from '../LandingPage';

describe('LandingPage', () => {
  beforeEach(() => {
    act(() => {
      appStore.getState().clearApiCredentials();
    });
  });

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

  it('should render Go to Dashboard button when user is authenticated', () => {
    act(() => {
      appStore.getState().setApiCredentials('123456', 'abcde12345');
    });
    renderWithRouter(<LandingPage />);
    expect(screen.getByText('Go to Dashboard')).toBeInTheDocument();
    expect(screen.queryByText('Get Started')).not.toBeInTheDocument();
  });
});

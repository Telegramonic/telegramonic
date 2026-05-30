import React from 'react';
import { screen, fireEvent, act } from '@testing-library/react';
import { renderWithRouter } from '@testUtils';
import { appStore } from '@appStore';
import Dashboard from '../Dashboard';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Dashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    act(() => {
      appStore.getState().setApiCredentials('123456', 'abcde12345');
    });
  });

  it('should render the dashboard layout with mock file statistics', () => {
    renderWithRouter(<Dashboard />);

    expect(screen.getByText('Telegram Drive Dashboard')).toBeInTheDocument();
    expect(
      screen.getByText(/MTProto active connection: API ID 123456/),
    ).toBeInTheDocument();

    // Stats
    expect(screen.getByText('Limitless')).toBeInTheDocument();
    expect(screen.getByText('6 Files')).toBeInTheDocument();
    expect(screen.getByText('MTProto 2.0')).toBeInTheDocument();

    // Verify some mock files are displayed
    expect(screen.getByText('Video_Tutorial.mp4')).toBeInTheDocument();
    expect(screen.getByText('Invoice_May.pdf')).toBeInTheDocument();
  });

  it('should filter mock files by search query', () => {
    renderWithRouter(<Dashboard />);

    const searchInput = screen.getByPlaceholderText('Search files...');
    fireEvent.change(searchInput, { target: { value: 'Invoice' } });

    // Should only show matching files
    expect(screen.getByText('Invoice_May.pdf')).toBeInTheDocument();
    expect(screen.queryByText('Video_Tutorial.mp4')).not.toBeInTheDocument();
  });

  it('should show placeholder text when search result is empty', () => {
    renderWithRouter(<Dashboard />);

    const searchInput = screen.getByPlaceholderText('Search files...');
    fireEvent.change(searchInput, { target: { value: 'nonexistentfile' } });

    expect(screen.getByText('No files found')).toBeInTheDocument();
  });

  it('should clear credentials and navigate to login on disconnect button click', () => {
    renderWithRouter(<Dashboard />);

    const disconnectButton = screen.getByRole('button', {
      name: 'Disconnect Drive',
    });
    fireEvent.click(disconnectButton);

    // Verify credentials are cleared in state
    expect(appStore.getState().apiId).toBeNull();
    expect(appStore.getState().apiHash).toBeNull();

    // Verify redirect called
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});

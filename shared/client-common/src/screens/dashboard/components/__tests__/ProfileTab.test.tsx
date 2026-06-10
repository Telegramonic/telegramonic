import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProvidersAndRouter } from '@testUtils';
import { ProfileTab } from '../ProfileTab';
import { apiClient } from '@services';
import { appStore } from '@appStore';

// Mock the services module
jest.mock('@services', () => ({
  useCurrentUser: () => ({
    data: {
      id: '12345',
      first_name: 'John',
      last_name: 'Doe',
      username: 'johndoe',
      phone: '+919876543210',
    },
  }),
  useStats: () => ({
    data: {
      total_space: 100 * 1024 * 1024 * 1024,
      used_space: 45.2 * 1024 * 1024 * 1024,
      file_count: 3,
      folder_count: 1,
    },
  }),
  apiClient: {
    updateCredentials: jest.fn(),
    sendCode: jest.fn(),
    signIn: jest.fn(),
    checkPassword: jest.fn(),
  },
}));

const mockOnLogout = jest.fn();

describe('ProfileTab', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    appStore.setState({
      currentAccount: {
        phone: '+919876543210',
        apiId: '987654',
        apiHash: 'abcdef123456',
      },
      savedAccounts: [
        {
          phone: '+919876543210',
          apiId: '987654',
          apiHash: 'abcdef123456',
        },
      ],
    });
  });

  it('renders all account profile components and information', () => {
    renderWithProvidersAndRouter(<ProfileTab onLogout={mockOnLogout} />);

    expect(screen.getByText('Account Profile')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getAllByText('@johndoe').length).toBe(2);
    expect(screen.getByText('45.2 GB Used')).toBeInTheDocument();
    expect(screen.getByText('100 GB Limit')).toBeInTheDocument();
    expect(screen.getByText('+919876543210')).toBeInTheDocument();
    expect(screen.getByText('12345')).toBeInTheDocument();
  });

  it('toggles password input visibility for API credentials', () => {
    renderWithProvidersAndRouter(<ProfileTab onLogout={mockOnLogout} />);

    // Get input elements
    const apiIdInput = screen.getByPlaceholderText('Enter Telegram API ID (e.g. 1234567)');
    const apiHashInput = screen.getByPlaceholderText('Enter Telegram API Hash (e.g. abcdef123456...)');

    expect(apiIdInput).toHaveAttribute('type', 'password');
    expect(apiHashInput).toHaveAttribute('type', 'password');

    // Click Show buttons
    const showButtons = screen.getAllByRole('button', { name: 'Show' });
    fireEvent.click(showButtons[0]); // Toggle API ID
    fireEvent.click(showButtons[1]); // Toggle API Hash

    expect(apiIdInput).toHaveAttribute('type', 'text');
    expect(apiHashInput).toHaveAttribute('type', 'text');
  });

  it('successfully updates credentials and saves them to store', async () => {
    (apiClient.sendCode as jest.Mock).mockResolvedValueOnce({ success: true, next_step: 'mock_hash' });
    (apiClient.signIn as jest.Mock).mockResolvedValueOnce({ success: true });

    renderWithProvidersAndRouter(<ProfileTab onLogout={mockOnLogout} />);

    const apiIdInput = screen.getByPlaceholderText('Enter Telegram API ID (e.g. 1234567)');
    const apiHashInput = screen.getByPlaceholderText('Enter Telegram API Hash (e.g. abcdef123456...)');

    // Change inputs
    fireEvent.change(apiIdInput, { target: { value: '111111' } });
    fireEvent.change(apiHashInput, { target: { value: 'hash111111' } });

    // Click Save Credentials
    const saveButton = screen.getByRole('button', { name: 'Save Credentials' });
    fireEvent.click(saveButton);

    // Confirmation dialog should be visible now
    expect(screen.getByText('Update API Credentials')).toBeInTheDocument();

    // Click Continue
    const continueButton = screen.getByRole('button', { name: 'Continue' });
    fireEvent.click(continueButton);

    await waitFor(() => {
      expect(apiClient.sendCode).toHaveBeenCalledWith('+919876543210', '111111', 'hash111111');
    });

    // Verification dialog (OTP stage) should be visible
    expect(await screen.findByText('Verify Connection')).toBeInTheDocument();

    // Enter verification code
    const codeInput = screen.getByPlaceholderText('Enter 5-digit code');
    fireEvent.change(codeInput, { target: { value: '12345' } });

    // Submit code
    const verifyButton = screen.getByRole('button', { name: 'Verify' });
    fireEvent.click(verifyButton);

    await waitFor(() => {
      expect(apiClient.signIn).toHaveBeenCalledWith('+919876543210', '12345', 'mock_hash');
    });

    // Verification dialog success stage should be visible
    expect(await screen.findByText('Credentials saved and verified successfully!')).toBeInTheDocument();

    // Check Zustand store update
    expect(appStore.getState().currentAccount).toEqual({
      phone: '+919876543210',
      apiId: '111111',
      apiHash: 'hash111111',
    });
  });

  it('handles 2FA password step if required', async () => {
    (apiClient.sendCode as jest.Mock).mockResolvedValueOnce({ success: true, next_step: 'mock_hash' });
    (apiClient.signIn as jest.Mock).mockResolvedValueOnce({ success: true, next_step: 'password' });
    (apiClient.checkPassword as jest.Mock).mockResolvedValueOnce({ success: true });

    renderWithProvidersAndRouter(<ProfileTab onLogout={mockOnLogout} />);

    const apiIdInput = screen.getByPlaceholderText('Enter Telegram API ID (e.g. 1234567)');
    const apiHashInput = screen.getByPlaceholderText('Enter Telegram API Hash (e.g. abcdef123456...)');

    fireEvent.change(apiIdInput, { target: { value: '111111' } });
    fireEvent.change(apiHashInput, { target: { value: 'hash111111' } });

    const saveButton = screen.getByRole('button', { name: 'Save Credentials' });
    fireEvent.click(saveButton);

    const continueButton = screen.getByRole('button', { name: 'Continue' });
    fireEvent.click(continueButton);

    expect(await screen.findByText('Verify Connection')).toBeInTheDocument();

    const codeInput = screen.getByPlaceholderText('Enter 5-digit code');
    fireEvent.change(codeInput, { target: { value: '12345' } });

    const verifyButton = screen.getByRole('button', { name: 'Verify' });
    fireEvent.click(verifyButton);

    // Should ask for 2FA password now
    expect(await screen.findByText('Enter 2FA Password')).toBeInTheDocument();

    const passwordInput = screen.getByPlaceholderText('Enter 2FA password');
    fireEvent.change(passwordInput, { target: { value: 'cloud_pwd' } });

    fireEvent.click(screen.getByRole('button', { name: 'Verify' }));

    await waitFor(() => {
      expect(apiClient.checkPassword).toHaveBeenCalledWith('cloud_pwd');
    });

    expect(await screen.findByText('Credentials saved and verified successfully!')).toBeInTheDocument();
  });

  it('displays error message when API ID or API Hash is empty', async () => {
    renderWithProvidersAndRouter(<ProfileTab onLogout={mockOnLogout} />);

    const apiIdInput = screen.getByPlaceholderText('Enter Telegram API ID (e.g. 1234567)');
    const apiHashInput = screen.getByPlaceholderText('Enter Telegram API Hash (e.g. abcdef123456...)');

    // Clear inputs
    fireEvent.change(apiIdInput, { target: { value: '' } });
    fireEvent.change(apiHashInput, { target: { value: '' } });

    // Click Save Credentials
    const saveButton = screen.getByRole('button', { name: 'Save Credentials' });
    fireEvent.click(saveButton);

    expect(screen.getByText('API ID and API Hash cannot be empty.')).toBeInTheDocument();
    expect(apiClient.updateCredentials).not.toHaveBeenCalled();
  });

  it('calls onLogout when the logout button is clicked', () => {
    renderWithProvidersAndRouter(<ProfileTab onLogout={mockOnLogout} />);

    const logoutButton = screen.getByRole('button', { name: 'Logout' });
    fireEvent.click(logoutButton);

    expect(mockOnLogout).toHaveBeenCalledTimes(1);
  });
});

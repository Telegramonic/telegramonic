import { forwardRef } from 'react';
import { fireEvent, screen, act } from '@testing-library/react';
import LoginPage from '../LoginPage';
import { renderWithRouter } from '@testUtils';
import { appStore } from '@appStore';

// Mock apiClient
const mockSendCode = jest.fn().mockResolvedValue({ success: true, next_step: 'code' });
const mockSignIn = jest.fn().mockResolvedValue({ success: true, next_step: 'dashboard' });
const mockCheckPassword = jest.fn().mockResolvedValue({ success: true });

jest.mock('@services', () => ({
  ...jest.requireActual('@services'),
  apiClient: {
    sendCode: (phone: string, apiId: string, apiHash: string) => mockSendCode(phone, apiId, apiHash),
    signIn: (phone: string, code: string, phoneCodeHash?: string) => mockSignIn(phone, code, phoneCodeHash),
    checkPassword: (password: string) => mockCheckPassword(password),
  },
}));

// Mock framer-motion to render plain HTML elements in tests to avoid animation lag/timing issues
jest.mock('framer-motion', () => {
  const React = require('react');
  const MockDiv = forwardRef(({ children, ...props }: any, ref: any) => (
    <div ref={ref} {...props}>
      {children}
    </div>
  ));
  MockDiv.displayName = 'MockDiv';
  return {
    motion: {
      div: MockDiv,
    },
    AnimatePresence: ({ children }: any) => children,
  };
});

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    act(() => {
      appStore.getState().clearApiCredentials();
    });
  });

  it('should render step 1 (API Configuration) by default', () => {
    renderWithRouter(<LoginPage />);
    expect(screen.getByText('Connect Telegram Drive')).toBeInTheDocument();
    expect(screen.getByText('API Configuration')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('e.g., 123456'),
    ).toBeInTheDocument();
  });

  it('should render country select dropdown with default value +1', async () => {
    renderWithRouter(<LoginPage />);
    // Step 1: Submit Credentials
    fireEvent.change(screen.getByPlaceholderText('e.g., 123456'), { target: { value: '12345' } });
    fireEvent.change(screen.getByPlaceholderText('e.g., d58a9e...'), { target: { value: 'abc123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

    expect(await screen.findByPlaceholderText('Enter phone number without country code')).toBeInTheDocument();
    const countrySelect = screen.getByLabelText('Select Country Code');
    expect(countrySelect).toBeInTheDocument();
    expect(countrySelect).toHaveValue('+1');
  });

  it('should prepend the dial code if the phone number does not start with +', async () => {
    renderWithRouter(<LoginPage />);

    // Step 1: Submit API Credentials
    fireEvent.change(screen.getByPlaceholderText('e.g., 123456'), { target: { value: '12345' } });
    fireEvent.change(screen.getByPlaceholderText('e.g., d58a9e...'), { target: { value: 'abc123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

    expect(await screen.findByPlaceholderText('Enter phone number without country code')).toBeInTheDocument();

    const countrySelect = screen.getByLabelText('Select Country Code');
    fireEvent.change(countrySelect, { target: { value: '+91' } });

    const phoneInput = screen.getByPlaceholderText(
      'Enter phone number without country code',
    );
    fireEvent.change(phoneInput, { target: { value: '9876543210' } });

    const continueButton = screen.getByRole('button', { name: 'Continue' });
    fireEvent.click(continueButton);

    await act(async () => {
      await Promise.resolve();
    });

    expect(mockSendCode).toHaveBeenCalledWith('+919876543210', '12345', 'abc123');
  });

  it('should show error when API credentials are empty on step 1', async () => {
    renderWithRouter(<LoginPage />);
    const continueButton = screen.getByRole('button', { name: 'Continue' });
    fireEvent.click(continueButton);
    expect(
      await screen.findByText('API ID is required.'),
    ).toBeInTheDocument();
    expect(
      await screen.findByText('API Hash is required.'),
    ).toBeInTheDocument();
  });

  it('should show error when phone number is empty on step 2', async () => {
    renderWithRouter(<LoginPage />);
    // Step 1: Submit Credentials
    fireEvent.change(screen.getByPlaceholderText('e.g., 123456'), { target: { value: '12345' } });
    fireEvent.change(screen.getByPlaceholderText('e.g., d58a9e...'), { target: { value: 'abc123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

    // Now on Step 2
    expect(await screen.findByPlaceholderText('Enter phone number without country code')).toBeInTheDocument();
    const continueButton = screen.getByRole('button', { name: 'Continue' });
    fireEvent.click(continueButton);
    expect(
      await screen.findByText('Phone number is required to proceed.'),
    ).toBeInTheDocument();
  });

  it('should navigate through all steps of the login flow', async () => {
    renderWithRouter(<LoginPage />);

    // Step 1: Submit API credentials
    expect(screen.getByText('API Configuration')).toBeInTheDocument();
    fireEvent.change(screen.getByPlaceholderText('e.g., 123456'), { target: { value: '654321' } });
    fireEvent.change(screen.getByPlaceholderText('e.g., d58a9e...'), { target: { value: 'hash_abc' } });
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

    // Step 2: Submit Phone Number
    expect(await screen.findByPlaceholderText('Enter phone number without country code')).toBeInTheDocument();
    const phoneInput = screen.getByPlaceholderText(
      'Enter phone number without country code',
    );
    fireEvent.change(phoneInput, { target: { value: '5555555555' } });
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

    // Wait for async call to finish
    await act(async () => {
      await Promise.resolve();
    });

    // Now it should be on Step 3 (Verification Code)
    expect(await screen.findByText('Enter Verification Code')).toBeInTheDocument();
    const codeInput = screen.getByPlaceholderText('Enter 5-digit code');
    expect(codeInput).toBeInTheDocument();

    // Enable fake timers BEFORE submitting step 3
    jest.useFakeTimers();

    // Step 3: Submit Verification Code
    fireEvent.change(codeInput, { target: { value: '12345' } });
    const verifyButton = screen.getByRole('button', { name: 'Verify Code' });
    fireEvent.click(verifyButton);

    // Wait for async call to finish
    await act(async () => {
      await Promise.resolve();
    });

    // Success screen (Step 4) should be visible
    expect(
      await screen.findByText('Successfully configured Telegramonic.'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Redirecting to dashboard...'),
    ).toBeInTheDocument();

    // Advance fake timers to trigger final redirect (1.5 seconds)
    act(() => {
      jest.advanceTimersByTime(1500);
    });
    jest.useRealTimers();
  });
});

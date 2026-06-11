import { forwardRef } from 'react';
import { fireEvent, screen, act } from '@testing-library/react';
import LoginPage from '../LoginPage';
import { renderWithRouter } from '@testUtils';
import { appStore } from '@appStore';

// Mock apiClient
const mockSendCode = jest
  .fn()
  .mockResolvedValue({ success: true, next_step: 'code' });
const mockSignIn = jest
  .fn()
  .mockResolvedValue({ success: true, next_step: 'dashboard' });
const mockCheckPassword = jest.fn().mockResolvedValue({ success: true });

jest.mock('@services', () => ({
  ...jest.requireActual('@services'),
  apiClient: {
    sendCode: (phone: string, apiId: string, apiHash: string) =>
      mockSendCode(phone, apiId, apiHash),
    signIn: (phone: string, code: string, phoneCodeHash?: string) =>
      mockSignIn(phone, code, phoneCodeHash),
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
    localStorage.clear();
    act(() => {
      appStore.setState({
        savedAccounts: [],
      });
    });
  });

  it('should render step 1 (Phone Number) by default', () => {
    renderWithRouter(<LoginPage />);
    expect(screen.getByText('Connect Telegram Drive')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Phone Number' }),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Enter phone number without country code'),
    ).toBeInTheDocument();
  });

  it('should render country select dropdown with default value +91', () => {
    renderWithRouter(<LoginPage />);
    const countrySelect = screen.getByLabelText('Select Country Code');
    expect(countrySelect).toBeInTheDocument();
    expect(countrySelect).toHaveValue('+91');
  });

  it('should prepend the dial code if the phone number does not start with +', async () => {
    renderWithRouter(<LoginPage />);

    // Step 1: Submit Phone Number
    const countrySelect = screen.getByLabelText('Select Country Code');
    fireEvent.change(countrySelect, { target: { value: '+91' } });

    const phoneInput = screen.getByPlaceholderText(
      'Enter phone number without country code',
    );
    fireEvent.change(phoneInput, { target: { value: '9876543210' } });

    const continueButton = screen.getByRole('button', { name: 'Continue' });
    fireEvent.click(continueButton);

    // Now on Step 2: Submit API Credentials
    expect(
      await screen.findByPlaceholderText('e.g., 123456'),
    ).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText('e.g., 123456'), {
      target: { value: '12345' },
    });
    fireEvent.change(screen.getByPlaceholderText('e.g., d58a9e...'), {
      target: { value: 'abc123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

    await act(async () => {
      await Promise.resolve();
    });

    expect(mockSendCode).toHaveBeenCalledWith(
      '+919876543210',
      '12345',
      'abc123',
    );
  });

  it('should show error when API credentials are empty on step 2', async () => {
    renderWithRouter(<LoginPage />);
    // Step 1: Submit Phone number
    fireEvent.change(
      screen.getByPlaceholderText('Enter phone number without country code'),
      {
        target: { value: '1234567890' },
      },
    );
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

    // Now on Step 2
    expect(
      await screen.findByPlaceholderText('e.g., 123456'),
    ).toBeInTheDocument();
    const continueButton = screen.getByRole('button', { name: 'Continue' });
    fireEvent.click(continueButton);

    expect(await screen.findByText('API ID is required.')).toBeInTheDocument();
    expect(
      await screen.findByText('API Hash is required.'),
    ).toBeInTheDocument();
  });

  it('should show error when phone number is empty on step 1', async () => {
    renderWithRouter(<LoginPage />);
    // On Step 1
    const continueButton = screen.getByRole('button', { name: 'Continue' });
    fireEvent.click(continueButton);
    expect(
      await screen.findByText('Phone number is required to proceed.'),
    ).toBeInTheDocument();
  });

  it('should navigate through all steps of the login flow', async () => {
    renderWithRouter(<LoginPage />);

    // Step 1: Submit Phone Number
    expect(
      screen.getByRole('heading', { name: 'Phone Number' }),
    ).toBeInTheDocument();
    const phoneInput = screen.getByPlaceholderText(
      'Enter phone number without country code',
    );
    fireEvent.change(phoneInput, { target: { value: '5555555555' } });
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

    // Step 2: Submit API Credentials
    expect(
      await screen.findByPlaceholderText('e.g., 123456'),
    ).toBeInTheDocument();
    fireEvent.change(screen.getByPlaceholderText('e.g., 123456'), {
      target: { value: '654321' },
    });
    fireEvent.change(screen.getByPlaceholderText('e.g., d58a9e...'), {
      target: { value: 'hash_abc' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

    // Wait for async call to finish
    await act(async () => {
      await Promise.resolve();
    });

    // Now it should be on Step 3 (Verification Code)
    expect(
      await screen.findByText('Enter Verification Code'),
    ).toBeInTheDocument();
    const codeInputs = screen.getAllByRole('textbox');
    expect(codeInputs).toHaveLength(5);

    // Enable fake timers BEFORE submitting step 3
    jest.useFakeTimers();

    // Step 3: Submit Verification Code
    fireEvent.change(codeInputs[0], { target: { value: '1' } });
    fireEvent.change(codeInputs[1], { target: { value: '2' } });
    fireEvent.change(codeInputs[2], { target: { value: '3' } });
    fireEvent.change(codeInputs[3], { target: { value: '4' } });
    fireEvent.change(codeInputs[4], { target: { value: '5' } });
    const verifyButton = screen.getByRole('button', { name: 'Verify Code' });
    fireEvent.click(verifyButton);

    // Wait for async call to finish
    await act(async () => {
      await Promise.resolve();
    });

    // Success screen (Step 5) should be visible
    expect(
      await screen.findByText('Successfully configured Telegramonic.'),
    ).toBeInTheDocument();
    expect(screen.getByText('Redirecting to dashboard...')).toBeInTheDocument();

    // Advance fake timers to trigger final redirect (3.0 seconds)
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    jest.useRealTimers();
  });

  it('should support navigating back to previous steps', async () => {
    renderWithRouter(<LoginPage />);

    // Step 1 -> Step 2
    const phoneInput = screen.getByPlaceholderText(
      'Enter phone number without country code',
    );
    fireEvent.change(phoneInput, { target: { value: '5555555555' } });
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

    // Verify on Step 2
    expect(
      await screen.findByPlaceholderText('e.g., 123456'),
    ).toBeInTheDocument();

    // Click Back to return to Step 1
    const backButton1 = screen.getByRole('button', { name: 'Go Back' });
    expect(backButton1).toBeInTheDocument();
    fireEvent.click(backButton1);

    // Verify back on Step 1
    expect(
      screen.getByRole('heading', { name: 'Phone Number' }),
    ).toBeInTheDocument();

    // Go back to Step 2
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

    // Step 2 -> Step 3
    expect(
      await screen.findByPlaceholderText('e.g., 123456'),
    ).toBeInTheDocument();
    fireEvent.change(screen.getByPlaceholderText('e.g., 123456'), {
      target: { value: '654321' },
    });
    fireEvent.change(screen.getByPlaceholderText('e.g., d58a9e...'), {
      target: { value: 'hash_abc' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

    // Wait for async call to finish
    await act(async () => {
      await Promise.resolve();
    });

    // Verify on Step 3
    expect(
      await screen.findByText('Enter Verification Code'),
    ).toBeInTheDocument();

    // Click Back to return to Step 2
    const backButton2 = screen.getByRole('button', { name: 'Go Back' });
    expect(backButton2).toBeInTheDocument();
    fireEvent.click(backButton2);

    // Verify back on Step 2
    expect(
      await screen.findByPlaceholderText('e.g., 123456'),
    ).toBeInTheDocument();
  });

  it('should render step 0 (Saved Accounts) if accounts exist in Zustand', () => {
    act(() => {
      appStore.setState({
        savedAccounts: [{ phone: '+1234567890', apiId: '111', apiHash: 'aaa' }],
      });
    });

    renderWithRouter(<LoginPage />);

    expect(screen.getByText('Saved Accounts')).toBeInTheDocument();
    expect(screen.getByText('+1234567890')).toBeInTheDocument();
    expect(
      screen.queryByPlaceholderText('Enter phone number without country code'),
    ).not.toBeInTheDocument();
  });

  it('should transition to step 1 when clicking Add New Account', () => {
    act(() => {
      appStore.setState({
        savedAccounts: [{ phone: '+1234567890', apiId: '111', apiHash: 'aaa' }],
      });
    });

    renderWithRouter(<LoginPage />);

    const addNewButton = screen.getByRole('button', {
      name: '+ Add New Account',
    });
    fireEvent.click(addNewButton);

    expect(
      screen.getByRole('heading', { name: 'Phone Number' }),
    ).toBeInTheDocument();

    // Go Back should return to Step 0
    const backButton = screen.getByRole('button', { name: 'Go Back' });
    fireEvent.click(backButton);
    expect(screen.getByText('Saved Accounts')).toBeInTheDocument();
  });

  it('should navigate directly to step 3 when a saved account is selected', async () => {
    act(() => {
      appStore.setState({
        savedAccounts: [{ phone: '+1234567890', apiId: '111', apiHash: 'aaa' }],
      });
    });

    renderWithRouter(<LoginPage />);

    const accountRow = screen.getByText('+1234567890');
    fireEvent.click(accountRow);

    await act(async () => {
      await Promise.resolve();
    });

    expect(mockSendCode).toHaveBeenCalledWith('+1234567890', '111', 'aaa');
    expect(
      await screen.findByText('Enter Verification Code'),
    ).toBeInTheDocument();
  });

  it('should navigate to step 2 with error populated if sendCode fails for a saved account', async () => {
    mockSendCode.mockResolvedValueOnce({
      success: false,
      error: 'Invalid API ID',
    });

    act(() => {
      appStore.setState({
        savedAccounts: [{ phone: '+1234567890', apiId: '111', apiHash: 'aaa' }],
      });
    });

    renderWithRouter(<LoginPage />);

    const accountRow = screen.getByText('+1234567890');
    fireEvent.click(accountRow);

    await act(async () => {
      await Promise.resolve();
    });

    expect(mockSendCode).toHaveBeenCalledWith('+1234567890', '111', 'aaa');
    expect(await screen.findByText('Invalid API ID')).toBeInTheDocument();
    expect(screen.getByDisplayValue('111')).toBeInTheDocument();
    expect(screen.getByDisplayValue('aaa')).toBeInTheDocument();
  });

  it('should remove account from Zustand when delete is clicked', () => {
    act(() => {
      appStore.setState({
        savedAccounts: [{ phone: '+1234567890', apiId: '111', apiHash: 'aaa' }],
      });
    });

    renderWithRouter(<LoginPage />);

    const deleteButton = screen.getByRole('button', { name: 'Remove Account' });
    fireEvent.click(deleteButton);

    expect(appStore.getState().savedAccounts).toEqual([]);
    expect(
      screen.getByRole('heading', { name: 'Phone Number' }),
    ).toBeInTheDocument();
  });

  it('should handle Two-Factor Authentication (2FA) flow successfully', async () => {
    mockSignIn.mockResolvedValueOnce({ success: true, next_step: 'password' });

    renderWithRouter(<LoginPage />);

    // Step 1: Submit Phone Number
    const phoneInput = screen.getByPlaceholderText(
      'Enter phone number without country code',
    );
    fireEvent.change(phoneInput, { target: { value: '5555555555' } });
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

    // Step 2: Submit API Credentials
    expect(
      await screen.findByPlaceholderText('e.g., 123456'),
    ).toBeInTheDocument();
    fireEvent.change(screen.getByPlaceholderText('e.g., 123456'), {
      target: { value: '654321' },
    });
    fireEvent.change(screen.getByPlaceholderText('e.g., d58a9e...'), {
      target: { value: 'hash_abc' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

    // Wait for sendCode
    await act(async () => {
      await Promise.resolve();
    });

    // Step 3: Enter OTP Verification Code
    expect(
      await screen.findByText('Enter Verification Code'),
    ).toBeInTheDocument();

    const codeInputs = screen.getAllByRole('textbox');
    expect(codeInputs).toHaveLength(5);

    fireEvent.change(codeInputs[0], { target: { value: '1' } });
    fireEvent.change(codeInputs[1], { target: { value: '2' } });
    fireEvent.change(codeInputs[2], { target: { value: '3' } });
    fireEvent.change(codeInputs[3], { target: { value: '4' } });
    fireEvent.change(codeInputs[4], { target: { value: '5' } });

    fireEvent.click(screen.getByRole('button', { name: 'Verify Code' }));

    // Wait for signIn response (returning next_step: 'password')
    await act(async () => {
      await Promise.resolve();
    });

    // Now it should be on Step 4 (2FA Password)
    expect(await screen.findByText('Enter 2FA Password')).toBeInTheDocument();
    const passwordInput = screen.getByPlaceholderText('Enter 2FA password');
    expect(passwordInput).toBeInTheDocument();

    // Enable fake timers for success redirect
    jest.useFakeTimers();

    // Submit Password
    fireEvent.change(passwordInput, { target: { value: 'my_2fa_password' } });
    fireEvent.click(screen.getByRole('button', { name: 'Verify Password' }));

    // Wait for checkPassword response
    await act(async () => {
      await Promise.resolve();
    });

    expect(mockCheckPassword).toHaveBeenCalledWith('my_2fa_password');

    // Success screen (Step 5) should be visible
    expect(
      await screen.findByText('Successfully configured Telegramonic.'),
    ).toBeInTheDocument();
    expect(screen.getByText('Redirecting to dashboard...')).toBeInTheDocument();

    // Advance fake timers to trigger final redirect
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    jest.useRealTimers();
  });
});

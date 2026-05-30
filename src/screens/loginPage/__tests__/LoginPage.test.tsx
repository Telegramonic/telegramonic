import React from 'react';
import { fireEvent, screen, act } from '@testing-library/react';
import LoginPage from '../LoginPage';
import { renderWithRouter } from '@testUtils';

import { appStore } from '@appStore';

// Mock framer-motion to render plain HTML elements in tests to avoid animation lag/timing issues
jest.mock('framer-motion', () => {
  const React = require('react');
  const MockDiv = React.forwardRef(({ children, ...props }: any, ref: any) => (
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

  it('should render step 1 (Phone Number) by default', () => {
    renderWithRouter(<LoginPage />);
    expect(screen.getByText('Connect Telegram Drive')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Enter phone number without country code'),
    ).toBeInTheDocument();
  });

  it('should render country select dropdown with default value +1', () => {
    renderWithRouter(<LoginPage />);
    const countrySelect = screen.getByLabelText('Select Country Code');
    expect(countrySelect).toBeInTheDocument();
    expect(countrySelect).toHaveValue('+1');
  });

  it('should prepend the dial code if the phone number does not start with +', async () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    renderWithRouter(<LoginPage />);

    const countrySelect = screen.getByLabelText('Select Country Code');
    fireEvent.change(countrySelect, { target: { value: '+91' } });

    const phoneInput = screen.getByPlaceholderText(
      'Enter phone number without country code',
    );
    fireEvent.change(phoneInput, { target: { value: '9876543210' } });

    const continueButton = screen.getByRole('button', { name: 'Continue' });
    fireEvent.click(continueButton);

    expect(logSpy).toHaveBeenCalledWith(
      'MTProto connecting with phone:',
      '+919876543210',
    );
    logSpy.mockRestore();
  });

  it('should show error when phone number is empty', async () => {
    renderWithRouter(<LoginPage />);
    const continueButton = screen.getByRole('button', { name: 'Continue' });
    fireEvent.click(continueButton);
    expect(
      await screen.findByText('Phone number is required to proceed.'),
    ).toBeInTheDocument();
  });

  it('should navigate through all steps of the login flow', async () => {
    renderWithRouter(<LoginPage />);

    // Step 1: Submit Phone Number
    const phoneInput = screen.getByPlaceholderText(
      'Enter phone number without country code',
    );
    fireEvent.change(phoneInput, { target: { value: '+15555555555' } });

    const continueButton = screen.getByRole('button', { name: 'Continue' });
    fireEvent.click(continueButton);

    // Advance fake timers to skip simulated network request
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Now it should be on Step 2 (Verification Code)
    expect(screen.getByText('Enter Verification Code')).toBeInTheDocument();
    const codeInput = screen.getByPlaceholderText('Enter 5-digit code');
    expect(codeInput).toBeInTheDocument();

    // Step 2: Submit Verification Code
    fireEvent.change(codeInput, { target: { value: '12345' } });
    const verifyButton = screen.getByRole('button', { name: 'Verify Code' });
    fireEvent.click(verifyButton);

    // Advance fake timers
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Now it should be on Step 3 (API Configuration)
    expect(screen.getByText('API Configuration')).toBeInTheDocument();
    const apiIdInput = screen.getByPlaceholderText('e.g., 123456');
    const apiHashInput = screen.getByPlaceholderText('e.g., d58a9e...');
    expect(apiIdInput).toBeInTheDocument();
    expect(apiHashInput).toBeInTheDocument();

    // Step 3: Submit API Configuration
    fireEvent.change(apiIdInput, { target: { value: '123456' } });
    fireEvent.change(apiHashInput, { target: { value: 'abcde12345' } });

    const connectButton = screen.getByRole('button', {
      name: 'Configure & Connect',
    });
    fireEvent.click(connectButton);

    // Advance fake timers for the final connect (1.5 seconds)
    act(() => {
      jest.advanceTimersByTime(1500);
    });

    // Success screen should be visible
    expect(
      screen.getByText('Connected successfully! Redirecting...'),
    ).toBeInTheDocument();

    // Advance fake timers to trigger final redirect (1.5 seconds)
    act(() => {
      jest.advanceTimersByTime(1500);
    });
  });
});

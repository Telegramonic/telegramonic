import '@testing-library/jest-dom';
import '@localization/config';
import { TextEncoder, TextDecoder } from 'util';

globalThis.TextEncoder = TextEncoder;
globalThis.TextDecoder = TextDecoder;


// Polyfill structuredClone for Jest jsdom environment (required by Chakra UI v3)
// jsdom may not expose Node's native structuredClone
if (typeof globalThis.structuredClone === 'undefined') {
  // Use a robust deep clone that handles edge cases
  globalThis.structuredClone = function structuredClone(obj) {
    if (obj === undefined || obj === null) return obj;
    try {
      return JSON.parse(JSON.stringify(obj));
    } catch {
      return obj;
    }
  };
}

// Polyfill ResizeObserver for Chakra UI v3
if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

jest.useFakeTimers();
jest.mock('zustand');

// Font source mocks.
jest.mock('@fontsource/bungee-shade', () => ({
  __esModule: true,
  default: 'bungee-shade',
}));

/**
 * Mock helmet module
 */
jest.mock('react-helmet-async', () => ({
  Helmet: jest.fn(({ children }) => <div>{children}</div>),
  HelmetProvider: () => jest.fn(),
}));

/**
 * Mock next-themes for test environment
 */
jest.mock('next-themes', () => ({
  ThemeProvider: ({ children }) => children,
  useTheme: () => ({
    resolvedTheme: 'dark',
    theme: 'dark',
    setTheme: jest.fn(),
  }),
}));

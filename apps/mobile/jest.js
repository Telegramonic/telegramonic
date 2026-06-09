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

/**
 * Mock mermaid — it is ESM-only and cannot be parsed by Jest's CommonJS runner.
 * Individual tests that need mermaid.render behaviour can override this mock.
 */
jest.mock('mermaid', () => ({
  initialize: jest.fn(),
  render: jest.fn().mockResolvedValue({
    svg: '<svg data-testid="mock-mermaid">Mock Diagram</svg>',
  }),
}));

/**
 * Mock @uiw/react-markdown-preview for test environment to avoid ESM import syntax errors.
 * Supports the `components` prop so custom renderers (e.g. mermaid) are exercised.
 */
jest.mock('@uiw/react-markdown-preview', () => {
  return jest.fn(({ source, className, style, components }) => {
    // Extract mermaid fenced code block: ```mermaid\n…\n```
    const mermaidMatch =
      typeof source === 'string' && source.match(/```mermaid\n([\s\S]*?)\n```/);
    if (mermaidMatch && components && components.code) {
      const MermaidBlock = () =>
        components.code({
          node: null,
          inline: false,
          className: 'language-mermaid',
          children: mermaidMatch[1],
        });
      return (
        <div data-testid="markdown-preview" className={className} style={style}>
          <MermaidBlock />
        </div>
      );
    }

    // Extract markdown link: [text](url)
    if (typeof source === 'string') {
      const linkMatch = source.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (linkMatch) {
        return (
          <div
            data-testid="markdown-preview"
            className={className}
            style={style}
          >
            <a href={linkMatch[2]}>{linkMatch[1]}</a>
          </div>
        );
      }
    }

    return (
      <div data-testid="markdown-preview" className={className} style={style}>
        {source}
      </div>
    );
  });
});

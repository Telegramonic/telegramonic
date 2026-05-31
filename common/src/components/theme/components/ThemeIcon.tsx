import type { SVGProps, ReactNode } from 'react';
import { useTheme } from 'next-themes';

// ── Inline SVG icons ──────────────────────────────────────────────────────────

const IconSystem = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    width="14"
    height="14"
    {...props}
  >
    <path d="M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5zm2 0v8h12V5H6zm-1 12h14a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2z" />
  </svg>
);

const IconDay = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 16 16"
    fill="currentColor"
    width="14"
    height="14"
    {...props}
  >
    <path d="M8 11a3 3 0 110-6 3 3 0 010 6zm0 1a4 4 0 100-8 4 4 0 000 8zM8 0a.5.5 0 01.5.5v2a.5.5 0 01-1 0v-2A.5.5 0 018 0zm0 13a.5.5 0 01.5.5v2a.5.5 0 01-1 0v-2A.5.5 0 018 13zm8-5a.5.5 0 01-.5.5h-2a.5.5 0 010-1h2a.5.5 0 01.5.5zM3 8a.5.5 0 01-.5.5h-2a.5.5 0 010-1h2A.5.5 0 013 8zm10.657-5.657a.5.5 0 010 .707l-1.414 1.415a.5.5 0 11-.707-.708l1.414-1.414a.5.5 0 01.707 0zm-9.193 9.193a.5.5 0 010 .707L3.05 13.657a.5.5 0 01-.707-.707l1.414-1.414a.5.5 0 01.707 0zm9.193 2.121a.5.5 0 01-.707 0l-1.414-1.414a.5.5 0 01.707-.707l1.414 1.414a.5.5 0 010 .707zM4.464 4.465a.5.5 0 01-.707 0L2.343 3.05a.5.5 0 11.707-.707l1.414 1.414a.5.5 0 010 .708z" />
  </svg>
);

const IconNight = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    width="14"
    height="14"
    {...props}
  >
    <path d="M9.57 3.38a8 8 0 0010.4 10.4 1 1 0 011.31 1.3 10 10 0 11-13-13 1 1 0 011.3 1.3zM7.1 5.04a8 8 0 1011.2 11.23A10 10 0 017.08 5.04z" />
  </svg>
);

// ── ThemeSelector ─────────────────────────────────────────────────────────────

type ThemeOption = 'system' | 'light' | 'dark';

const THEME_OPTIONS: { value: ThemeOption; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

const ICON_MAP: Record<ThemeOption, ReactNode> = {
  system: <IconSystem />,
  light: <IconDay />,
  dark: <IconNight />,
};

/**
 * ThemeSelector — a compact pill-shaped dropdown that lets the user choose
 * between System / Light / Dark colour modes.
 * Uses next-themes `theme` (not `resolvedTheme`) so "system" is a real state.
 */
const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();

  // Coerce undefined (during SSR) to 'system'
  const current: ThemeOption = (theme as ThemeOption) ?? 'system';

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 10px 4px 8px',
        borderRadius: '9999px',
        border: '1px solid var(--chakra-colors-border)',
        background: 'var(--chakra-colors-bg-panel)',
        transition: 'border-color 0.2s',
        cursor: 'pointer',
      }}
    >
      {/* Current-mode icon */}
      <span
        aria-hidden="true"
        style={{
          color: 'var(--chakra-colors-fg-muted)',
          lineHeight: 0,
          flexShrink: 0,
        }}
      >
        {ICON_MAP[current]}
      </span>

      {/* Native select — invisible over the wrapper */}
      <select
        id="theme-selector"
        aria-label="Select colour theme"
        value={current}
        onChange={(e) => setTheme(e.target.value as ThemeOption)}
        style={{
          appearance: 'none',
          WebkitAppearance: 'none',
          background: 'transparent',
          border: 'none',
          outline: 'none',
          fontSize: '11px',
          fontWeight: 600,
          fontFamily: 'inherit',
          color: 'var(--chakra-colors-fg-muted)',
          cursor: 'pointer',
          paddingRight: '14px',
          lineHeight: '1.5',
        }}
      >
        {THEME_OPTIONS.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      {/* Custom chevron indicator */}
      <svg
        viewBox="0 0 10 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        width="9"
        height="9"
        style={{
          color: 'var(--chakra-colors-fg-muted)',
          pointerEvents: 'none',
          flexShrink: 0,
          marginLeft: '-10px',
        }}
        aria-hidden="true"
      >
        <path d="M1 1l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

// Keep ThemeIcon as an alias so existing imports don't break
export { ThemeSelector };
export default ThemeSelector;

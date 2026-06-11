import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@chakra-ui/react';

interface LanguageSelectorProps {
  variant?: 'pill' | 'form';
}

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'hi', label: 'हिन्दी (Hindi)', flag: '🇮🇳' },
  { code: 'es', label: 'Español (Spanish)', flag: '🇪🇸' },
  { code: 'ru', label: 'Русский (Russian)', flag: '🇷🇺' },
  { code: 'zh', label: '中文 (Chinese)', flag: '🇨🇳' },
  { code: 'ja', label: '日本語 (Japanese)', flag: '🇯🇵' },
];

export const LanguageSelector = ({
  variant = 'pill',
}: LanguageSelectorProps) => {
  const { i18n } = useTranslation();

  const currentLang = i18n.language || 'en';

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  const currentLanguageOption =
    LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];

  if (variant === 'form') {
    return (
      <Box
        position="relative"
        display="inline-flex"
        alignItems="center"
        h="40px"
        px={3}
        bg="transparent"
        borderRadius="xl"
        border="1px solid"
        borderColor="border"
        _focusWithin={{
          borderColor: 'primary',
          ring: '1px',
          ringColor: 'primary',
        }}
        w="100%"
      >
        <select
          aria-label="Select Language"
          value={currentLang}
          onChange={handleLanguageChange}
          style={{
            appearance: 'none',
            WebkitAppearance: 'none',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            width: '100%',
            height: '100%',
            fontSize: '14px',
            fontFamily: 'inherit',
            color: 'var(--chakra-colors-fg)',
            cursor: 'pointer',
            paddingRight: '18px',
          }}
        >
          {LANGUAGES.map((l) => (
            <option
              key={l.code}
              value={l.code}
              style={{
                background: 'var(--chakra-colors-bg-panel)',
                color: 'var(--chakra-colors-fg)',
              }}
            >
              {l.flag} {l.label}
            </option>
          ))}
        </select>
        <Box
          position="absolute"
          right={3}
          pointerEvents="none"
          color="fg.muted"
          display="flex"
          alignItems="center"
        >
          <svg
            viewBox="0 0 10 6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            width="10"
            height="10"
            aria-hidden="true"
          >
            <path
              d="M1 1l4 4 4-4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Box>
      </Box>
    );
  }

  // Pill variant
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
      <span
        aria-hidden="true"
        style={{
          fontSize: '12px',
          lineHeight: 0,
          flexShrink: 0,
        }}
      >
        {currentLanguageOption.flag}
      </span>

      <select
        id="language-selector"
        aria-label="Select language"
        value={currentLang}
        onChange={handleLanguageChange}
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
        {LANGUAGES.map(({ code, label }) => (
          <option
            key={code}
            value={code}
            style={{
              background: 'var(--chakra-colors-bg-panel)',
              color: 'var(--chakra-colors-fg)',
            }}
          >
            {label}
          </option>
        ))}
      </select>

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

export default LanguageSelector;

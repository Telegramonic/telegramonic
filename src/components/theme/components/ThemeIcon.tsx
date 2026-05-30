import { IconButton } from '@chakra-ui/react';
import { useTheme } from 'next-themes';
import React from 'react';

import { ICON_SIZE_STYLE } from './constants';
import { COMMON_ICON_STYLE } from './constants';

const IconDay = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    fill="currentColor"
    viewBox="0 0 16 16"
    height="1em"
    width="1em"
    {...props}
  >
    <path d="M8 11a3 3 0 110-6 3 3 0 010 6zm0 1a4 4 0 100-8 4 4 0 000 8zM8 0a.5.5 0 01.5.5v2a.5.5 0 01-1 0v-2A.5.5 0 018 0zm0 13a.5.5 0 01.5.5v2a.5.5 0 01-1 0v-2A.5.5 0 018 13zm8-5a.5.5 0 01-.5.5h-2a.5.5 0 010-1h2a.5.5 0 01.5.5zM3 8a.5.5 0 01-.5.5h-2a.5.5 0 010-1h2A.5.5 0 013 8zm10.657-5.657a.5.5 0 010 .707l-1.414 1.415a.5.5 0 11-.707-.708l1.414-1.414a.5.5 0 01.707 0zm-9.193 9.193a.5.5 0 010 .707L3.05 13.657a.5.5 0 01-.707-.707l1.414-1.414a.5.5 0 01.707 0zm9.193 2.121a.5.5 0 01-.707 0l-1.414-1.414a.5.5 0 01.707-.707l1.414 1.414a.5.5 0 010 .707zM4.464 4.465a.5.5 0 01-.707 0L2.343 3.05a.5.5 0 11.707-.707l1.414 1.414a.5.5 0 010 .708z" />
  </svg>
);

const IconNight = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    height="1em"
    width="1em"
    {...props}
  >
    <path d="M9.57 3.38a8 8 0 0010.4 10.4 1 1 0 011.31 1.3 10 10 0 11-13-13 1 1 0 011.3 1.3zM7.1 5.04a8 8 0 1011.2 11.23A10 10 0 017.08 5.04z" />
  </svg>
);

const ThemeIcon = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const toggleColorMode = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <IconButton
      {...COMMON_ICON_STYLE}
      _hover={{ bg: 'green.900' }}
      aria-label={'toggle-color-mode'}
      onClick={toggleColorMode}
    >
      {isDark ? (
        <IconDay color={'yellow'} {...ICON_SIZE_STYLE} />
      ) : (
        <IconNight {...ICON_SIZE_STYLE} />
      )}
    </IconButton>
  );
};

export default ThemeIcon;

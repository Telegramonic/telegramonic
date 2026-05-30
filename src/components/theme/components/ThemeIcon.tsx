import { IconButton } from '@chakra-ui/react';
import { useTheme } from 'next-themes';

import { TelegramonicIcon, IconHc } from '@assets';

import { ICON_SIZE_STYLE } from './constants';
import { COMMON_ICON_STYLE } from './constants';

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
        <TelegramonicIcon
          color={'yellow'}
          icon={IconHc.DAY}
          {...ICON_SIZE_STYLE}
        />
      ) : (
        <TelegramonicIcon icon={IconHc.NIGHT} {...ICON_SIZE_STYLE} />
      )}
    </IconButton>
  );
};

export default ThemeIcon;

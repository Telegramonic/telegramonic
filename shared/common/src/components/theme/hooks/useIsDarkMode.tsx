import { useTheme } from 'next-themes';

const useIsDarkMode = () => {
  const { resolvedTheme } = useTheme();
  return resolvedTheme === 'dark';
};

export default useIsDarkMode;

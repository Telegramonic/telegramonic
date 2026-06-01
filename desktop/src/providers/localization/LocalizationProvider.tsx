import { LocalizationProviderProps } from './types';
import '@localization/config';

const LocalizationProvider = ({ children }: LocalizationProviderProps) => {
  return <>{children}</>;
};

export default LocalizationProvider;

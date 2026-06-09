import { SavedAccount } from '../../store/app/appStore/types';

export interface LoginFormValues {
  phone: string;
  code: string;
  apiId: string;
  apiHash: string;
}

export type { SavedAccount };

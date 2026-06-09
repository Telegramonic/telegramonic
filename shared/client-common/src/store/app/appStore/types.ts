import { StateCreator } from 'zustand';

export interface SavedAccount {
  phone: string;
  apiId: string;
  apiHash: string;
}

export interface AppStoreState {
  currentAccount: SavedAccount | null;
  savedAccounts: SavedAccount[];
  authError: string | null;
  setCurrentAccount: (account: SavedAccount | null) => void;
  saveAccount: (phone: string, apiId: string, apiHash: string) => void;
  removeAccount: (phone: string) => void;
  clearApiCredentials: () => void;
  setAuthError: (error: string | null) => void;
}

export type AppStoreSlice<T> = StateCreator<
  AppStoreState,
  [['zustand/immer', never]],
  [],
  T
>;

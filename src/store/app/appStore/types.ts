import { StateCreator } from 'zustand';

export interface AppStoreState {
  apiId: string | null;
  apiHash: string | null;
  setApiCredentials: (apiId: string, apiHash: string) => void;
  clearApiCredentials: () => void;
}

export type AppStoreSlice<T> = StateCreator<
  AppStoreState,
  [['zustand/immer', never]],
  [],
  T
>;

import { create } from 'zustand';

import { immer } from 'zustand/middleware/immer';
import { createJSONStorage, persist } from 'zustand/middleware';
import { AppStoreState } from './types';

export const appStore = create<AppStoreState>()(
  persist(
    immer((set) => ({
      currentAccount: null,
      savedAccounts: [],
      authError: null,
      setCurrentAccount: (account) =>
        set((state) => {
          state.currentAccount = account;
        }),
      saveAccount: (phone, apiId, apiHash) =>
        set((state) => {
          state.savedAccounts = [
            ...state.savedAccounts.filter((acc) => acc.phone !== phone),
            { phone, apiId, apiHash },
          ];
        }),
      removeAccount: (phone) =>
        set((state) => {
          state.savedAccounts = state.savedAccounts.filter(
            (acc) => acc.phone !== phone,
          );
        }),
      clearApiCredentials: () =>
        set((state) => {
          state.currentAccount = null;
        }),
      setAuthError: (error) =>
        set((state) => {
          state.authError = error;
        }),
    })),
    {
      name: 'appStore',
      storage: createJSONStorage(() => localStorage),
      merge: (persistedState, currentState) =>
        deepMerge(currentState, persistedState as AppStoreState),
      partialize: (state) => ({
        currentAccount: state.currentAccount,
        savedAccounts: state.savedAccounts,
      }),
    },
  ),
);

/**
 * Function to merge the persisted state with the current state.
 *
 * @param currentState current state
 * @param persistedState persisted state
 * @returns merged state
 */
function deepMerge(
  currentState: AppStoreState,
  persistedState: AppStoreState,
): AppStoreState {
  return {
    ...currentState,
    ...persistedState,
    currentAccount:
      persistedState?.currentAccount !== undefined
        ? persistedState.currentAccount
        : currentState.currentAccount,
    savedAccounts:
      persistedState?.savedAccounts ?? currentState.savedAccounts ?? [],
  };
}

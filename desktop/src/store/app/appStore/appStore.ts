import { create } from 'zustand';

import { immer } from 'zustand/middleware/immer';
import { createJSONStorage, persist } from 'zustand/middleware';
import { AppStoreState } from './types';

export const appStore = create<AppStoreState>()(
  persist(
    immer((set) => ({
      apiId: null,
      apiHash: null,
      setApiCredentials: (apiId, apiHash) =>
        set((state) => {
          state.apiId = apiId;
          state.apiHash = apiHash;
        }),
      clearApiCredentials: () =>
        set((state) => {
          state.apiId = null;
          state.apiHash = null;
        }),
    })),
    {
      name: 'appStore',
      storage: createJSONStorage(() => localStorage),
      merge: (persistedState, currentState) =>
        deepMerge(currentState, persistedState as AppStoreState),
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
  };
}

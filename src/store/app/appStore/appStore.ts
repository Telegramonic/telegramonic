import { create } from 'zustand';

import { immer } from 'zustand/middleware/immer';
import { createJSONStorage, persist } from 'zustand/middleware';
import { AppStoreState } from './types';

export const appStore = create<AppStoreState>()(
  persist(
    immer((..._api) => ({})),
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
 * @param _currentState current state
 * @param _persistedState persisted state
 * @returns merged state
 */
function deepMerge(
  _currentState: AppStoreState,
  _persistedState: AppStoreState,
): AppStoreState {
  return {};
}

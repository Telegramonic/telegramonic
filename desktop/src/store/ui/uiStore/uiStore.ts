import { create } from 'zustand';

import { immer } from 'zustand/middleware/immer';
import { UiStoreState } from './types';
import { createModalSlice } from '../slice/Modal';

export const uiStore = create<UiStoreState>()(
  immer((...api) => ({
    Modal: createModalSlice(...api),
  })),
);

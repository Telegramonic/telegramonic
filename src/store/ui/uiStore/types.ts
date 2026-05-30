import { StateCreator } from 'zustand';
import { ModalStateSlice } from '../slice';

export interface UiStoreState {
  Modal: ModalStateSlice;
}

export type UiStoreSlice<T> = StateCreator<
  UiStoreState,
  [['zustand/immer', never]],
  [],
  T
>;

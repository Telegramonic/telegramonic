import { StateCreator } from 'zustand';

export interface AppStoreState {}

export type AppStoreSlice<T> = StateCreator<
  AppStoreState,
  [['zustand/immer', never]],
  [],
  T
>;

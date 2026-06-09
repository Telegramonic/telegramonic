import { act } from '@testing-library/react';
import { create as createType, StateCreator } from 'zustand';

const zustand = jest.requireActual('zustand');
const actualCreate: typeof createType = zustand.create;

// a variable to hold reset functions for all stores declared in the app
const storeResetFns = new Set<() => void>();

// when creating a store, we get its initial state, create a reset function and add it in the set
const createImpl = <S>(createState: StateCreator<S>) => {
  const store = actualCreate<S>(createState);
  const initialState = store.getState();
  storeResetFns.add(() => store.setState(initialState, true));
  return store;
};

// support currying
export function create<S>(f: StateCreator<S>) {
  return f === undefined ? createImpl : createImpl(f);
}

// Reset all stores after each test run
beforeEach(() => {
  act(() => storeResetFns.forEach((resetFn) => resetFn()));
});

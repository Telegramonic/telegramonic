import { renderHook, act } from '@testing-library/react';
import { useShallow } from 'zustand/react/shallow';
import { modalDataSelector, modalSelector } from '../Modal.selector';
import { ModalID, ModalOpenState, ModalState, appStore } from '@uiStore';

describe('Modal selector', () => {
  const onModalCloseMock = jest.fn();

  it('should return modal selector state and actions', () => {
    const modal = renderHook(() => appStore(useShallow(modalSelector))).result.current;

    expect(modal).toMatchSnapshot();
  });

  it('should return modal state with initial value', () => {
    const { result } = renderHook(() => appStore(useShallow(modalSelector)));

    expect(result.current).toMatchSnapshot();
  });

  it('should return modal state on modal data set using openModal', () => {
    const { result: modalResult } = renderHook(() => appStore(useShallow(modalSelector)));
    const { result: dataResult } = renderHook(() =>
      appStore(useShallow(modalDataSelector)),
    );

    act(() => {
      modalResult.current.openModal(ModalID.SEARCH, onModalCloseMock);
    });

    expect(dataResult.current).toMatchSnapshot();
  });

  it('should reset and close modal state on modal data set using closeModal', () => {
    const modalData: ModalState = {
      modalID: ModalID.SEARCH,
      modalData: {
        onModalClose: onModalCloseMock,
      },
      modalOpenState: ModalOpenState.OPEN,
    };
    const { result: modalResult } = renderHook(() => appStore(useShallow(modalSelector)));
    const { result: dataResult } = renderHook(() =>
      appStore(useShallow(modalDataSelector)),
    );

    act(() => {
      modalResult.current.openModal(ModalID.SEARCH, onModalCloseMock);
    });

    expect(dataResult.current.modalID).toEqual(modalData.modalID);
    expect(dataResult.current.onModalClose).toEqual(
      modalData.modalData?.onModalClose,
    );

    act(() => {
      dataResult.current.resetModalState();
      jest.runAllTimers();
    });

    expect(dataResult.current.openState).toEqual(ModalOpenState.CLOSE);
    expect(dataResult.current.modalID).toEqual(ModalID.NONE);
    expect(dataResult.current.onModalClose).toEqual(undefined);
  });
});

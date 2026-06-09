import { ModalID, appStore } from '@uiStore';
import { act, renderHook } from '@testing-library/react';

describe('Modal slice', () => {
  const onModalCloseMock = jest.fn();

  it('should return modal selector state and actions', () => {
    const modal = renderHook(() => appStore()).result.current;

    expect(modal.Modal).toMatchSnapshot();
  });

  it('should return modal state with initial value', () => {
    const { result } = renderHook(() => appStore());

    expect(result.current.Modal).toMatchSnapshot();
  });

  it('should return modal state on modal data set using openModal', () => {
    const { result } = renderHook(() => appStore());

    act(() => {
      result.current.Modal.openModal(ModalID.SEARCH, onModalCloseMock);
      jest.runAllTimers();
    });

    expect(result.current.Modal).toMatchSnapshot();
  });

  it('should reset and close modal state on modal data set using closeModal', () => {
    const { result } = renderHook(() => appStore());

    act(() => {
      result.current.Modal.openModal(ModalID.SEARCH, onModalCloseMock);
    });

    expect(result.current.Modal.modalID).toEqual(ModalID.SEARCH);
    expect(result.current.Modal.modalData?.onModalClose).not.toBeUndefined();

    act(() => {
      result.current.Modal.resetModalState();
      jest.runAllTimers();
    });

    expect(result.current.Modal.modalID).toEqual(ModalID.NONE);
    expect(result.current.Modal.modalData?.onModalClose).toBeUndefined();
  });
});

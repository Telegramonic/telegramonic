import { UiStoreSlice } from '@uiStore';
import { ModalState, ModalStateSlice, ModalOpenState, ModalID } from './types';

const defaultModalState: ModalState = {
  modalID: ModalID.NONE,
  modalOpenState: ModalOpenState.CLOSE,
  modalData: undefined,
};

const createModalSlice: UiStoreSlice<ModalStateSlice> = (set) => ({
  ...defaultModalState,
  openModal: (id, onModalClose) => {
    set((state) => {
      state.Modal.modalData = { onModalClose };
      state.Modal.modalID = id;
      state.Modal.modalOpenState = ModalOpenState.OPEN;
    });
  },
  resetModalState: () => {
    setTimeout(() => {
      set((state) => {
        state.Modal.modalID = defaultModalState.modalID;
      });
    }, 200);

    set((state) => {
      state.Modal.modalOpenState = ModalOpenState.CLOSE;
      state.Modal.modalData = defaultModalState.modalData;
    });
  },
});

export default createModalSlice;

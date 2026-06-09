export enum ModalID {
  NONE = 'none',
  SEARCH = 'search',
}

export type ModalState = {
  modalID: ModalID;
  modalOpenState: ModalOpenState;
  modalData?: ModalData;
};

export type ModalData = {
  onModalClose: () => void;
};

export enum ModalOpenState {
  OPEN = 'OPEN',
  CLOSE = 'CLOSE',
}

export interface ModalStateAction {
  openModal: (id: ModalID, onModalClose: () => void) => void;
  resetModalState: () => void;
}

export type ModalStateSlice = ModalState & ModalStateAction;

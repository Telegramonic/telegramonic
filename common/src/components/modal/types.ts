import { ModalID } from '@uiStore';

export type ModalProps = {
  modalID: ModalID;
  isOpen: boolean;
  onModalClose: () => void;
};

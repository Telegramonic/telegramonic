import { Dialog } from '@chakra-ui/react';
import { ModalProps } from './types';
import { SearchModal } from './Modals';
import { ModalID } from '@uiStore';

const ModalComponent = ({ isOpen, modalID, onModalClose }: ModalProps) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(details: { open: boolean }) => { if (!details.open) onModalClose(); }}>
      <Dialog.Backdrop />
      <Dialog.Content>
        <ModalToShow modalID={modalID} />
      </Dialog.Content>
    </Dialog.Root>
  );
};

const ModalToShow = ({ modalID }: { modalID: ModalID }) => {
  switch (modalID) {
    case ModalID.SEARCH:
      return <SearchModal />;
    default:
      return <></>;
  }
};

export default ModalComponent;

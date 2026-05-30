import { useCallback, useEffect } from 'react';
import { useDisclosure } from '@chakra-ui/react';
import { ModalComponent } from '@components';
import {
  ModalOpenState,
  appStore,
  modalDataSelector,
  useShallow,
} from '@uiStore';

import { ModalProviderProps } from './types';

const ModalProvider = ({ children }: ModalProviderProps) => {
  const { open: isOpen, onOpen, onClose } = useDisclosure();
  const { openState, modalID, onModalClose, resetModalState } = appStore(
    useShallow(modalDataSelector),
  );

  const onModalCloseHandler = useCallback(() => {
    onModalClose && onModalClose();
    onClose();
    resetModalState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onModalClose]);

  useEffect(() => {
    if (openState === ModalOpenState.OPEN) {
      onOpen();
    } else {
      onModalCloseHandler();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openState]);

  return (
    <>
      <ModalComponent
        modalID={modalID}
        onModalClose={onModalCloseHandler}
        isOpen={isOpen}
      />
      {children}
    </>
  );
};

export default ModalProvider;

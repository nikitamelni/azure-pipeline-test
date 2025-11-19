import { FC } from 'react';
import { UniformSlot } from '@uniformdev/canvas-react';
import BaseModal from '@/components/ui/Modal';
import { ModalProps, ModalSlots } from '.';

const Modal: FC<ModalProps> = ({ maxWidth, backgroundColor, closeIconColor, disableCloseModalOnClickOutside }) => (
  <BaseModal
    {...{ maxWidth, backgroundColor, closeIconColor, disableCloseModalOnClickOutside }}
    trigger={<UniformSlot name={ModalSlots.Trigger} emptyPlaceholder={<div className="h-20 w-full" />} />}
    content={<UniformSlot name={ModalSlots.ModalContent} />}
    actions={<UniformSlot name={ModalSlots.ModalActions} />}
  />
);

export default Modal;

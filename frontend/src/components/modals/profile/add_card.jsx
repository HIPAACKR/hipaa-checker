
import Image from 'next/image';

import cardBankIcon from '@/../public/images/icons/card-bank.svg';
import AddCardModal from '@/components/addCardModal/addCardModal';
import { Modal, ModalBody, ModalFooter,ModalHeader } from '@/components/ui/modal';

export const AddNewCardModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader
        icon={
          <div className="w-5 h-5 flex items-center justify-center border rounded-full">
            <Image
              src={cardBankIcon}
              alt="Warning"
              width={12}
              height={12}
            />
          </div>
        }
        title="Add New Payment Card"
        subtitle="Update your card details."
        onClose={onClose}
        iconBgColor="bg-white"
        iconColor="text-gray-500"
      />
      <ModalBody>
        <AddCardModal closeModal={onClose} />
      </ModalBody>
      <ModalFooter>
      </ModalFooter>
    </Modal>
  );
};

import Image from 'next/image';

import cardBankIcon from '@/../public/images/icons/card-bank.svg';
import Button from '@/components/button';
import { Modal, ModalBody, ModalFooter,ModalHeader } from '@/components/ui/modal';

export const ChangeDefaultCard = ({ isOpen, onClose, onSetAsDefault, cardType, endWith }) => {
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
        title="Change Default Card?"
        subtitle="Update your default payment card."
        onClose={onClose}
        iconBgColor="bg-white"
        iconColor="text-gray-500"
      />
      <ModalBody>
        <p className="text-sm text-gray-600">
          Changing your default card affects all automatic payments. Confirm you want to use{' '}
          <span className="font-semibold text-gray-600">{cardType.toUpperCase()} ... {endWith}</span> {' '} moving forward.{' '} <br/> <br/>
          Would you like to {' '}<span className="font-semibold text-gray-600">continue??</span>
        </p>
      </ModalBody>
      <ModalFooter>
        <Button
          onClick={onClose}
          size="medium"
          type="danger"
          className="flex-1 !bg-white !hover:bg-gray-50 !text-[#344054] !border !border-[#D0D5DD] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05),0px_-2px_0px_0px_rgba(16,24,40,0.06)_inset,0px_0px_0px_1px_rgba(16,24,40,0.18)_inset]"
        >
          Cancel
        </Button>
          <Button
            onClick={onSetAsDefault}
            size="medium"
            type="danger"
            className="flex-1 !bg-[#0092E3] !text-white"
          >
            Set as default
          </Button>
      </ModalFooter>
    </Modal>
  );
};
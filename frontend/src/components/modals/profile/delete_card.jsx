
import Image from 'next/image';

import deleteIcon from '@/../public/images/icons/delete-icon-without-bg.svg';
import Button from '@/components/button';
import { Modal, ModalBody, ModalFooter,ModalHeader } from '@/components/ui/modal';

export const DeleteCard = ({ isOpen, onClose, onDelete }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader
        icon={
          <div className="w-5 h-5 flex items-center justify-center rounded-full">
            <Image
              src={deleteIcon}
              alt="Warning"
              width={12}
              height={12}
              style={{
                filter: 'brightness(0) saturate(100%) invert(24%) sepia(33%) saturate(6650%) hue-rotate(352deg) brightness(90%) contrast(89%)',
              }}
            />
          </div>
        }
        title="Delete Payment Card"
        subtitle="Want to delete your payment card."
        onClose={onClose}
        iconBgColor="bg-[#FEE4E2]"
        iconColor="text-red-500"
      />
      <ModalBody>
        <h3 className="font-semibold text-gray-900 mb-2">Delete your card information</h3>
        <p className="text-sm text-gray-600">
          Are you sure you want to delete this card? This action cannot be undone.
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
            onClick={onDelete}
            size="medium"
            type="danger"
            className="flex-1 !bg-red-500 !hover:bg-red-600 !text-white"
          >
            Delete
          </Button>
      </ModalFooter>
    </Modal>
  );
};
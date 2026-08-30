
import Image from 'next/image';

import crossIcon from '@/../public/images/icons/cross-icon.svg';
import Button from '@/components/button';
import { Modal, ModalBody, ModalFooter,ModalHeader } from '@/components/ui/modal';

export const UnsubscribeCurrentPlanModal = ({ isOpen, onClose, onUnsubscribe, plan }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader
        icon={
          <div className="w-5 h-5 flex items-center justify-center border border-[#D92D20] rounded-full">
            <Image
              src={crossIcon}
              alt="Warning"
              width={12}
              height={12}
              style={{
                filter: 'brightness(0) saturate(100%) invert(24%) sepia(33%) saturate(6650%) hue-rotate(352deg) brightness(90%) contrast(89%)',
              }}
              className="[&>svg]:stroke-[2px]"
            />
          </div>
        }
        title="Unsubscribe Current Plan"
        subtitle="This action will remove your subscription"
        onClose={onClose}
        iconBgColor="bg-[#FEE4E2]"
        iconColor="text-red-500"
      />
      <ModalBody>
        <h3 className="font-semibold text-gray-900 mb-2">Unsubscribe your current plan</h3>
        <p className="text-sm text-gray-600">
          You are currently on the {' '}
          <span className="font-semibold text-blue-600">{plan} Plan</span>. Are you sure you want to{' '}
          <span className="font-semibold text-gray-600">Unsubscribe?</span> this plan? This action may limit your access
          to features.
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
            onClick={onUnsubscribe}
            size="medium"
            type="danger"
            className="flex-1 !bg-red-500 !hover:bg-red-600 !text-white"
          >
            Unsubscribe Plan
          </Button>
      </ModalFooter>
    </Modal>
  );
};
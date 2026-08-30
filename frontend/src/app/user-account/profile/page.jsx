'use client';
import { useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { AlertCircle, CreditCard,X } from 'lucide-react';
import { toast } from 'react-toastify';

import stackIcon from '@/../public/images/icons/stacks.svg';
import AddCardModal from '@/components/addCardModal/addCardModal';
import Button from '@/components/button';
import Dialog from '@/components/dialog';
import Billing from '@/components/profile/billing';
import PasswordReset from '@/components/profile/password-reset';
import ProfileDetails from '@/components/profile/profile-details';
import SubscriptionPlanCard from '@/components/profile/subscription-plan-card';
import subscriptionContext from '@/context/subscriptionContext';
import { remove  } from '@/utils/api-service';

import './index.scss';

const TABS = {
  PROFILE_DETAILS: 'Profile Details',
  PASSWORD: 'Password',
  SUBSCRIPTION_PLAN: 'Subscription Plan',
  BILLING: 'Billing',
};

export default function ProfilePage() {
  const router = useRouter();
  const { userData, paymentMethods, fetchData, fetchPaymentMethods } = useContext(subscriptionContext);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [cardId, setCardId] = useState(null);
  const [deafultModalOpen, setDefaultModalOpen] = useState(false);
  const [defaultmodalError, setDefaultModalError] = useState(null);
  const [deletemodalError, setDeleteModalError] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
  const [deleteUserError, setDeleteUserError] = useState(null);
  const [activeTab, setActiveTab] = useState(TABS.PROFILE_DETAILS);

  const handleDeleteModalPopUp = (id) => {
    setCardId(id);
    setDeleteModalOpen(true);
  };

  const handleDefaultModalPopUp = (id) => {
    setCardId(id);
    setDefaultModalOpen(true);
  };

  // const handleDefaultCardSet = async () => {
  //   try {
  //     const response = await put(
  //       `${API_ENDPOINTS.PAYMENT_METHODS}/${cardId}/make_default`,
  //       {},
  //       true,
  //     );
  //     const data = await response.json();

  //     if (response.status === 500) {
  //       setDefaultModalError('Internal Server Error. Please try again later.');
  //       return;
  //     } else if (response.status >= 400 && response.status < 500) {
  //       setDefaultModalError(
  //         data?.errors[0] || 'Failed to set the card to default. Please try again.',
  //       );
  //       return;
  //     }
  //     toast.success('Successfully set the card to default');
  //     setDefaultModalOpen(false);
  //     fetchData();
  //   } catch (error) {
  //     setDefaultModalError('Failed to set the card to default. Please try again.');
  //   }
  // };

  // const handleDeleteCardSet = async () => {
  //   try {
  //     const response = await remove(`${API_ENDPOINTS.PAYMENT_METHODS}/${cardId}`, {}, true);
  //     const data = await response.json();

  //     if (response.status === 500) {
  //       setDeleteModalError('Internal Server Error. Please try again later.');
  //       return;
  //     } else if (response.status >= 400 && response.status < 500) {
  //       setDeleteModalError(data?.errors[0] || 'Failed to delete card. Please try again.');
  //       return;
  //     }
  //     toast.success('Successfully deleted the card');
  //     setDefaultModalOpen(false);
  //     fetchData();
  //   } catch (error) {
  //     setDeleteModalError('Failed to delete card. Please try again.');
  //   }
  // };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    fetchPaymentMethods();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteUser = async (id) => {
    try {
      const response = await remove(`user/0`, {}, true);

      toast.success('User deleted successfully.');
      setShowDeleteUserModal(false);
      router.push('/'); // redirect after deletion
    } catch (error) {
      if (error.response?.status === 500) {
        setDeleteUserError('Internal Server Error. Please try again later.');
      } else if (error.response?.status >= 400 && error.response?.status < 500) {
        const errorMsg =
          error.response?.data?.errors?.[0] || 'Failed to delete user. Please try again.';
        setDeleteUserError(errorMsg);
      } else {
        setDeleteUserError('Failed to delete user. Please try again.');
      }
    }
    
  };

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <>
      <div className='profile-section'>
        <div className="profile-tabs">
          <div 
            className={`profile-tabs__item ${activeTab === TABS.PROFILE_DETAILS ? 'profile-tabs--active' : ''}`}
            onClick={() => handleTabClick(TABS.PROFILE_DETAILS)}
          >
            {TABS.PROFILE_DETAILS}
          </div>
          <div
            className={`profile-tabs__item ${activeTab === TABS.PASSWORD ? 'profile-tabs--active' : ''}`}
            onClick={() => handleTabClick(TABS.PASSWORD)}
          >
            {TABS.PASSWORD}
          </div>
          {/*<div*/}
          {/*  className={`profile-tabs__item ${activeTab === TABS.SUBSCRIPTION_PLAN ? 'profile-tabs--active' : ''}`}*/}
          {/*  onClick={() => handleTabClick(TABS.SUBSCRIPTION_PLAN)}*/}
          {/*>*/}
          {/*  {TABS.SUBSCRIPTION_PLAN}*/}
          {/*</div>*/}
          {/*<div*/}
          {/*  className={`profile-tabs__item ${activeTab === TABS.BILLING ? 'profile-tabs--active' : ''}`}*/}
          {/*  onClick={() => handleTabClick(TABS.BILLING)}*/}
          {/*>*/}
          {/*  {TABS.BILLING}*/}
          {/*</div>*/}
        </div>

        {userData && activeTab === TABS.PROFILE_DETAILS && (
          <ProfileDetails />
        )}

        {userData && activeTab === TABS.PASSWORD && (
          <PasswordReset />
        )}

        {userData && activeTab === TABS.SUBSCRIPTION_PLAN && (
          <SubscriptionPlanCard />
        )}

        {userData && activeTab === TABS.BILLING && (
          <Billing />
        )}
         
      </div>



      {showDeleteUserModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='w-full max-w-sm rounded-xl bg-white px-8 py-12 shadow-lg'>
            <div className='mb-4 text-center'>
              Are you sure you want to <strong>delete your account</strong>?
            </div>
            {deleteUserError && (
              <div className='mb-4 text-center text-red-600'>{deleteUserError}</div>
            )}
            <div className='flex justify-center space-x-4'>
              <button
                className='rounded-full bg-[rgba(255,0,0,0.8)] px-10 py-2 font-semibold text-white transition-transform duration-300 hover:scale-105'
                onClick={() => handleDeleteUser((userData?.id))}
              >
                Yes, Delete
              </button>
              <button
                className='rounded-full bg-[rgba(0,0,0,0.6)] px-10 py-2 font-semibold text-white transition-transform duration-300 hover:scale-105'
                onClick={() => setShowDeleteUserModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* {deleteModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='w-full max-w-sm rounded-xl bg-white px-8 py-12 shadow-lg'>
            <div className='mb-4 text-center'>Are you Sure You Want To Delete This Card</div>
            {deletemodalError && (
              <div className='mb-4 text-center text-red-600'>{deletemodalError}</div>
            )}
            <div className='flex justify-center space-x-4'>
              <button
                className='rounded-full bg-[rgba(0,200,0,0.8)] px-10 py-2 font-semibold text-white transition-transform duration-300 hover:scale-105'
                onClick={() => handleDeleteCardSet()}
              >
                Yes
              </button>
              <button
                className='rounded-full bg-[rgba(255,0,0,0.8)] px-10 py-2 font-semibold text-white transition-transform duration-300 hover:scale-105'
                onClick={() => setDeleteModalOpen(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )} */}

      {/* {deafultModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='w-full max-w-sm rounded-xl bg-white px-8 py-12 shadow-lg'>
            <div className='mb-4 text-center'>Are you Sure You Want Set This Card To Default</div>
            {defaultmodalError && (
              <div className='mb-4 text-center text-red-600'>{defaultmodalError}</div>
            )}
            <div className='flex justify-center space-x-4'>
              <button
                className='rounded-full bg-[rgba(0,200,0,0.8)] px-10 py-2 font-semibold text-white transition-transform duration-300 hover:scale-105'
                onClick={() => handleDefaultCardSet()}
              >
                Yes
              </button>
              <button
                className='rounded-full bg-[rgba(255,0,0,0.8)] px-10 py-2 font-semibold text-white transition-transform duration-300 hover:scale-105'
                onClick={() => setDefaultModalOpen(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )} */}

      <Dialog
        isOpen={isModalOpen}
        onClose={closeModal}
        title=''
      >
        <AddCardModal closeModal={closeModal} />
      </Dialog>
    </>
  );
}


const DangerButton = ({ children, onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all bg-red-500 hover:bg-red-600 text-white ${className}`}
    >
      {children}
    </button>
  );
};

// base modal component that handles overlay and positioning
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {children}
      </div>
    </div>
  );
};

// header section with icon, title and close button
const ModalHeader = ({ icon, title, subtitle, onClose, iconBgColor = '', iconColor = 'text-blue-500' }) => {
  return (
    <div className="flex items-start justify-between p-6 pb-4 border-b">
      <div className="flex items-start gap-3 flex-1">
        {icon && (
          <div className={`${iconBgColor} p-2 border rounded-lg`}>
            <div className={iconColor}>
              {icon}
            </div>
          </div>
        )}
        <div className="flex-1">
          <h2 className="text-lg font-semibold ">{title}</h2>
          {subtitle && <p className="text-sm ">{subtitle}</p>}
        </div>
      </div>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 transition-colors ml-2"
      >
        <X size={20} />
      </button>
    </div>
  );
};

// body content area
const ModalBody = ({ children }) => {
  return <div className="p-6">{children}</div>;
};

// footer with action buttons
const ModalFooter = ({ children }) => {
  return (
    <div className="flex gap-3 p-6 pt-4 border-t">
      {children}
    </div>
  );
};

// input field component
const Input = ({ label, type = 'text', value, onChange, placeholder, icon }) => {
  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${icon ? 'pl-10' : ''}`}
        />
      </div>
    </div>
  );
};

// add payment card modal
const AddPaymentCardModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    nameOnCard: 'Baijur Rashid Sourav',
    cardNumber: '1234 1234 1234 1234',
    expiryMonth: '06',
    expiryYear: '2026',
    cvv: ''
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader
        icon={<CreditCard size={20} />}
        title="Add New Payment Card"
        subtitle="Update your card details."
        onClose={onClose}
      />
      <ModalBody>
        <Input
          label="Name on card"
          value={formData.nameOnCard}
          onChange={(e) => setFormData({ ...formData, nameOnCard: e.target.value })}
        />
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Expiry</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.expiryMonth}
                onChange={(e) => setFormData({ ...formData, expiryMonth: e.target.value })}
                placeholder="MM"
                maxLength="2"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={formData.expiryYear}
                onChange={(e) => setFormData({ ...formData, expiryYear: e.target.value })}
                placeholder="YYYY"
                maxLength="4"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <Input
            label="Card number"
            icon={<CreditCard size={16} className="text-orange-500" />}
            value={formData.cardNumber}
            onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
          />
          <Input
            label="CVV"
            type="password"
            value={formData.cvv}
            onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
            placeholder="•••••"
          />
        </div>

        <p className="text-xs text-gray-500 leading-relaxed">
          All card details are handled with industry-standard encryption. No sensitive information is stored on our servers.
        </p>
      </ModalBody>
      <ModalFooter>
        {/* replace with: <Button size="medium" type="secondary" onClick={onClose}>Cancel</Button> */}
        <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-lg font-medium transition-all bg-white hover:bg-gray-50 text-gray-700 border border-gray-300">
          Cancel
        </button>
        {/* replace with: <Button size="medium" type="primary" onClick={onSubmit}>Add New</Button> */}
        <button onClick={onSubmit} className="flex-1 px-4 py-2.5 rounded-lg font-medium transition-all bg-blue-500 hover:bg-blue-600 text-white">
          Add New
        </button>
      </ModalFooter>
    </Modal>
  );
};

// delete payment card modal
const DeletePaymentCardModal = ({ isOpen, onClose, onDelete }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader
        icon={<AlertCircle size={20} />}
        title="Delete Payment Card"
        subtitle="Want to delete your payment card."
        onClose={onClose}
        iconBgColor="bg-red-50"
        iconColor="text-red-500"
      />
      <ModalBody>
        <h3 className="font-semibold text-gray-900 mb-2">Delete your card information</h3>
        <p className="text-sm text-gray-600">
          Are you sure you want to delete this card? This action cannot be undone.
        </p>
      </ModalBody>
      <ModalFooter>
        {/* replace with: <Button size="medium" type="secondary" onClick={onClose}>Cancel</Button> */}
        <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-lg font-medium transition-all bg-white hover:bg-gray-50 text-gray-700 border border-gray-300">
          Cancel
        </button>
        <DangerButton onClick={onDelete}>Delete</DangerButton>
      </ModalFooter>
    </Modal>
  );
};

// confirm plan upgrade modal
const ConfirmPlanUpgradeModal = ({ isOpen, onClose, onUpgrade }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader
        icon={
          <Image
            src={stackIcon}
            width={24}
            height={24}
            alt="help"
          />
        }
        title="Confirm Plan Upgrade"
        subtitle="You're moving to a better plan."
        onClose={onClose}
      />
      <ModalBody>
        <p className="text-sm text-gray-600">
          You are currently on the <span className="font-semibold">Free Plan</span>. Would you like to upgrade to the{' '}
          <span className="font-semibold text-[#0092E3]">Standard Plan</span> and unlock additional features?
        </p>
      </ModalBody>
      <ModalFooter>
        <Button 
        className="flex-1 px-4 py-2.5 rounded-lg font-medium transition-all bg-white hover:bg-gray-50 border border-gray-300 hover:text-white text-gray-700"
        size="medium" type="secondary" onClick={onClose}>Cancel</Button>
        {/* <button onClick={onClose`} className="flex-1 px-4 py-2.5 rounded-lg font-medium transition-all bg-white hover:bg-gray-50 text-gray-700 border border-gray-300">
          Cancel
        </button> */}
        {/* replace with: <Button size="medium" type="primary" onClick={onUpgrade}>Upgrade now</Button> */}
        <button onClick={onUpgrade} className="flex-1 px-4 py-2.5 rounded-lg font-medium transition-all bg-blue-500 hover:bg-blue-600 text-white">
          Upgrade now
        </button>
      </ModalFooter>
    </Modal>
  );
};

// unsubscribe current plan modal
const UnsubscribeCurrentPlanModal = ({ isOpen, onClose, onUnsubscribe }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader
        icon={<AlertCircle size={20} />}
        title="Unsubscribe Current Plan"
        subtitle="This action will remove your subscription"
        onClose={onClose}
        iconBgColor="bg-red-50"
        iconColor="text-red-500"
      />
      <ModalBody>
        <h3 className="font-semibold text-gray-900 mb-2">Unsubscribe your current plan</h3>
        <p className="text-sm text-gray-600">
          This action will remove your subscription. Are you sure you want to{' '}
          <span className="font-semibold text-red-600">Unsubscribe this plan?</span> This action will remove your PRO features.
        </p>
      </ModalBody>
      <ModalFooter>
        {/* replace with: <Button size="medium" type="secondary" onClick={onClose}>Cancel</Button> */}
        <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-lg font-medium transition-all bg-white hover:bg-gray-50 text-gray-700 border border-gray-300">
          Cancel
        </button>
        <DangerButton onClick={onUnsubscribe}>Unsubscribe Plan</DangerButton>
      </ModalFooter>
    </Modal>
  );
};
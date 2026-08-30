import { useContext, useState } from 'react';
import Image from 'next/image';
import { toast } from 'react-toastify';

import masterCardIcon from '@/../public/images/icons/master_card_icon.svg';
import visaCardIcon from '@/../public/images/icons/visa_card_icon.svg';
import { AddNewCardModal,ChangeDefaultCard, DeleteCard } from '@/components/modals/profile';
import InvoiceListTable from '@/components/profile/billing/invoice-list-table';
import subscriptionContext from '@/context/subscriptionContext';
import { put, remove } from '@/utils/api-service';
import API_ENDPOINTS from '@/utils/apiEndpoints';
import useLocalStorage from '@/utils/useLocalData';

const Billing = () => {
  const [showChangeDefaultCard, setShowChangeDefaultCard] = useState(false);
  const [showDeleteCard, setShowDeleteCard] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [showAddCardModal, setShowAddCardModal] = useState(false);

  const [localData] = useLocalStorage('user');
  const { userData, paymentMethods, fetchData, fetchPaymentMethods } = useContext(subscriptionContext);

  const defaultCard = userData?.default_card ?? {};

  const getCardTypeIcon = (cardType) => {
    switch(cardType) {
      case 'visa':
        return visaCardIcon;
      case 'mastercard':
        return masterCardIcon;
      default:
        return null;
    }
  }

  const isDefaultCard = (card) => {
    return defaultCard && card?.id === defaultCard?.id;
  }

  const handleDefaultCardSet = async () => {
    if (!selectedCard?.id) return;
    if (isDefaultCard(selectedCard)) {
      setShowChangeDefaultCard(false);
      return;
    }

    try {
      await put(
        `${API_ENDPOINTS.PAYMENT_METHODS}/${selectedCard?.id}/make_default`,
        {},
        true,
      );

      toast.success('Successfully set the card to default');
      setShowChangeDefaultCard(false);
      fetchData();
    } catch (error) {
      if (error.response?.status === 500) {
        setErrorMessage('Internal Server Error. Please try again later.');
      } else if (error.response?.status >= 400 && error.response?.status < 500) {
        const errorMsg =
          error.response?.data?.errors?.[0] ||
          'Failed to set the card to default. Please try again.';
        setErrorMessage(errorMsg);
      } else {
        setErrorMessage('Failed to set the card to default. Please try again.');
      }
    }
  };

  const handleDeleteCardSet = async () => {
    if (!selectedCard?.id) return;
    if (isDefaultCard(selectedCard)) {
      setShowChangeDefaultCard(false);
      return;
    }
    try {
      const response = await remove(`${API_ENDPOINTS.PAYMENT_METHODS}/${selectedCard?.id}`, {}, true);

      toast.success('Successfully deleted the card');
      setErrorMessage(false);
      fetchData();
      fetchPaymentMethods();
      setShowDeleteCard(false);
    } catch (error) {
      if (error.response?.status === 500) {
        setErrorMessage('Internal Server Error. Please try again later.');
      } else if (error.response?.status >= 400 && error.response?.status < 500) {
        const errorMsg =
          error.response?.data?.errors?.[0] || 'Failed to delete card. Please try again.';
        setErrorMessage(errorMsg);
      } else {
        setErrorMessage('Failed to delete card. Please try again.');
      }
    }
  };


  const handleShowChangeDefaultCard = () => {
    setShowChangeDefaultCard((prev) => !prev);
  };

  const handleShowDeleteCard = () => {
    setShowDeleteCard((prev) => !prev);
  };

  const handleShowAddCardModal = () => {
    setShowAddCardModal((prev) => !prev);
  };

  return (
    <div className='profile-group'>
      <div>
        <div className='profile-group__content'>
          <div>
            <div className='profile-group__title'>Payment method</div>
            <p className='profile-group__description'>Update your billing details.</p>
          </div>
        </div>

        <div className="input-wrapper">
          <div className='input-wrapper__row'>
            <div>
              <p className="input-wrapper__label">Contact email</p>
              <p className="input-wrapper__label--secondary">Where should invoices be sent?</p>
            </div>
            <div className='input-wrapper__field-group'>
              <div className='flex items-center gap-2'>
                <input
                  type='radio'
                  checked={true}
                />
                <p className='font-medium'>Send to my account email</p>
              </div>
              <p className="ml-5">{localData?.email && localData?.email}</p>
            </div>
          </div>

          <div className='input-wrapper__row'>
            <div>
              <p className="input-wrapper__label">Card Details  <span className="input-wrapper__require">*</span></p>
              <p className="input-wrapper__label--secondary">Select default payment method. </p>
            </div>
            <div className='input-wrapper__field-group flex flex-col gap-3'>
              {paymentMethods?.payment_methods && paymentMethods?.payment_methods.length === 0 && (
                <p className="text-[#667085]">No payment methods added yet.</p>
              )}
              {paymentMethods?.payment_methods && paymentMethods?.payment_methods.length > 0 && paymentMethods?.payment_methods.map((card) => (
                  <div
                    key={card.id}
                  >
                    <div className={`flex items-start gap-2 border rounded-xl p-4 ${isDefaultCard(card) ? ' border-2 border-[#0092E3] ': ' border-[#E4E7EC] '}`}>
                      <div className="w-[46px] h-[32px] border border-[#E4E7EC] rounded-md flex justify-center items-center">
                        <Image
                          src={getCardTypeIcon(card?.card?.brand)}
                          className=''
                          alt='visa card'
                          width={31}
                          height={10}
                        />
                      </div>

                      <div className="flex-grow">
                        <div className="border-b border-[#E4E7EC] pb-4">
                          <p className="text-[#344054] font-medium">{`${card?.card?.brand.charAt(0).toUpperCase() + card?.card?.brand.slice(1)} ending in ${card?.card?.last4}`}</p>
                          <p className="font-normal">Card no: <span className="text-[#344054] font-medium">*** *** *** {card?.card?.last4}</span></p>
                          <p className="font-normal">CVC: <span className="text-[#344054] font-medium">{card?.card?.checks?.cvc_check === 'pass' ? 'Pass' : 'Fail'}</span></p>
                          <p className="font-normal">Expiry {`${card?.card?.exp_month}/${card?.card?.exp_year}`}</p>
                        </div>
                        <div className="flex mt-4">
                          <p 
                            className={`border-r border-r-2 border-[#E4E7EC] pr-4 font-semibold ${! (card) ? ' cursor-pointer ' : ''}`}
                            onClick={() => {
                              setSelectedCard(card);
                              handleShowChangeDefaultCard();
                            }}
                          >
                              {isDefaultCard(card) ? 'Default' : 'Set as Default'}
                          </p>
                          {/* <p className="border-r border-r-2 border-[#E4E7EC] px-2.5 font-semibold text-[#0092E3]">Edit</p> */}
                          <p 
                            className="cursor-pointer font-semibold px-2.5 text-[#F04438]"
                            onClick={() => {
                              setSelectedCard(card);
                              handleShowDeleteCard();
                            }}
                            >
                              Delete
                          </p>
                        </div>
                      </div>
                      <input
                        type='checkbox'
                        checked={isDefaultCard(card)}
                        className="w-[14px] h-[14px]"
                      />
                    </div>
                  </div>
                )
              )}
              <p 
                className="font-semibold text-[#0092E3] cursor-pointer"
                onClick={handleShowAddCardModal}
              >
                  + Add New Payment Method
              </p>
            </div>
            </div>
        </div>
      </div>
    
      <InvoiceListTable />

      <ChangeDefaultCard 
        isOpen={showChangeDefaultCard} 
        onClose={handleShowChangeDefaultCard} 
        onSetAsDefault={() => handleDefaultCardSet(selectedCard.id)}
        cardType={selectedCard?.card?.brand || ''} 
        endWith={selectedCard?.card?.last4 || ''}
      />

      <DeleteCard 
        isOpen={showDeleteCard} 
        onClose={handleShowDeleteCard} 
        onDelete={() => handleDeleteCardSet(selectedCard.id)}
        cardType={selectedCard?.card?.brand || ''} 
        endWith={selectedCard?.card?.last4 || ''}
      />

      <AddNewCardModal
        isOpen={showAddCardModal}
        onClose={handleShowAddCardModal}
      />

    </div>
  )
}


export default Billing;
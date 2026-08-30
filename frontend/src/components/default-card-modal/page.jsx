import { useContext, useState } from 'react';
import { toast } from 'react-toastify';

import subscriptionContext from '@/context/subscriptionContext';
import { put } from '@/utils/api-service';
import API_ENDPOINTS from '@/utils/apiEndpoints';

const DeafultCard = ({ cardId, closeModal }) => {
  const { fetchUserData } = useContext(subscriptionContext);
  const [defaultmodalError, setDefaultModalError] = useState(null);

  const handleDefaultCardSet = async () => {
    try {
      await put(
        `${API_ENDPOINTS.PAYMENT_METHODS}/${cardId}/make_default`,
        {},
        true,
      );

      toast.success('Successfully set the card to default');
      closeModal();
      fetchUserData();
    } catch (error) {
      if (error.response?.status === 500) {
        setDefaultModalError('Internal Server Error. Please try again later.');
      } else if (error.response?.status >= 400 && error.response?.status < 500) {
        const errorMsg =
          error.response?.data?.errors?.[0] ||
          'Failed to set the card to default. Please try again.';
        setDefaultModalError(errorMsg);
      } else {
        setDefaultModalError('Failed to set the card to default. Please try again.');
      }
    }
  };

  return (
    <>
      <div className='w-full rounded-xl px-8 py-12'>
        <div className='mb-4 text-center'>Are you Sure You Want To Make This Card To Default</div>
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
            onClick={() => closeModal()}
          >
            No
          </button>
        </div>
      </div>
    </>
  );
};

export default DeafultCard;

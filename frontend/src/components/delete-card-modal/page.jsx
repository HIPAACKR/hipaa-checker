import { useContext, useState } from 'react';
import { toast } from 'react-toastify';

import subscriptionContext from '@/context/subscriptionContext';
import { remove } from '@/utils/api-service';
import API_ENDPOINTS from '@/utils/apiEndpoints';

const DeleteCard = ({ cardId, closeModal }) => {
  const { fetchUserData } = useContext(subscriptionContext);
  const [deletemodalError, setDeleteModalError] = useState(null);

  const handleDeleteCardSet = async () => {
    try {
      const response = await remove(`${API_ENDPOINTS.PAYMENT_METHODS}/${cardId}`, {}, true);

      toast.success('Successfully deleted the card');
      closeModal();
      fetchUserData();
    } catch (error) {
      if (error.response?.status === 500) {
        setDeleteModalError('Internal Server Error. Please try again later.');
      } else if (error.response?.status >= 400 && error.response?.status < 500) {
        const errorMsg =
          error.response?.data?.errors?.[0] || 'Failed to delete card. Please try again.';
        setDeleteModalError(errorMsg);
      } else {
        setDeleteModalError('Failed to delete card. Please try again.');
      }
    }
  };

  return (
    <>
      <div className='w-full rounded-x px-8 py-12'>
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
            onClick={() => closeModal()}
          >
            No
          </button>
        </div>
      </div>
    </>
  );
};

export default DeleteCard;

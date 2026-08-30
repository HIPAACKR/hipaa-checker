import { useContext, useState } from 'react';
import { toast } from 'react-toastify';

import SubscriptionContext from '@/context/subscriptionContext';
import { post } from '@/utils/api-service';
import API_ENDPOINTS from '@/utils/apiEndpoints';
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Replace with your actual Stripe publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ closeModal }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const { fetchData: fetchUserData } = useContext(SubscriptionContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);
    setError(null);

    if (!stripe || !elements) {
      setError('Stripe has not loaded properly. Please try again later.');
      setProcessing(false);
      return;
    }

    const cardElement = elements.getElement(CardNumberElement);
    if (!cardElement) {
      setError('Card element not found. Please refresh the page and try again.');
      setProcessing(false);
      return;
    }

    const { error: stripeError, token } = await stripe.createToken(cardElement);

    if (stripeError) {
      setError(stripeError.message);
      setProcessing(false);
      return;
    }

    try {
      await post(
        `${API_ENDPOINTS.PAYMENT_METHODS}?card_token=${token.id}`,
        {},
        true,
      );
      fetchUserData();
      setProcessing(false);
      toast.success('Successfully Added Card!');
      closeModal();
    } catch (apiError) {
      if (apiError.response?.status === 500) {
        setError('Internal server error. Please try again later.');
      } else if (apiError.response?.status === 422) {
        const errorMsg =
          apiError.response?.data?.errors?.[0] || 'Failed to process payment. Please try again.';
        setError(errorMsg);
      } else {
        setError(apiError.message || 'An error occurred while Adding Card. Please try again.');
      }
      setProcessing(false);
    }
  };

  const cardElementStyle =
    'p-3 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500';

  return (
    <form onSubmit={handleSubmit}>
      {/* <h2 className='text-2xl font-bold mb-4'>Add a new card</h2> */}

      <div className='mb-4'>
        <label className='block text-sm font-medium text-gray-700 mb-1'>Card Number</label>
        <CardNumberElement className={cardElementStyle} />
      </div>

      <div className='grid grid-cols-2 gap-4 mb-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Expiry Date</label>
          <CardExpiryElement className={cardElementStyle} />
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>CVC</label>
          <CardCvcElement className={cardElementStyle} />
        </div>
      </div>

      {error && (
        <div className='mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md'>
          <h4 className='font-bold mb-1'>Error</h4>
          <p>{error}</p>
        </div>
      )}

      <button
        type='submit'
        disabled={!stripe || processing}
        className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition duration-150 ease-in-out'
      >
        {processing ? 'Processing...' : 'Add Card'}
      </button>
    </form>
  );
};

const AddCardModal = ({ closeModal }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm closeModal={closeModal} />
    </Elements>
  );
};

export default AddCardModal;

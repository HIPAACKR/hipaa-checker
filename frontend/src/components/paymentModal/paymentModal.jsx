import { useContext, useRef, useState } from 'react';
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
  const [discountCode, setDiscountCode] = useState('');
  const {
    selectedPlan,
    fetchData: fetchUserData,
    discount,
    verifyAndApplyDiscount,
    discountError,
  } = useContext(SubscriptionContext);

  const inputRef = useRef();
  const getPlanPrice = () => {
    if (!discount) {
      return selectedPlan.price;
    } else {
      if (discount.discount_type === 'fixed')
        return Number(selectedPlan.price) - Number(discount.discount);
      else if (discount.discount_type === 'percentage')
        return Number(selectedPlan.price) * (1 - Number(discount.discount) / 100);
    }
  };

  const handleApplyDiscount = () => {
    const discountCode = inputRef.current.value;
    verifyAndApplyDiscount(discountCode);
    inputRef.current.value = '';
    setDiscountCode('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);
    setError(null); // Clear previous errors

    if (inputRef.current.value) {
      setError('Please apply discount first or empty the discount field.');
      setProcessing(false);
      return;
    }

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

    const postData = {
      user: {
        stripe_token: token.id,
        plan_id: selectedPlan.id,
      },
      code: discount ? discount.code : '',
    };

    try {
      const response = await post(API_ENDPOINTS.SUBSCRIPTIONS, postData, true);

      fetchUserData();
      setProcessing(false);
      toast.success('Subscription successfully purchased!');
      closeModal();
    } catch (apiError) {
      if (apiError.response?.status === 500) {
        setError('Internal server error. Please try again later.');
      } else if (apiError.response?.status === 422) {
        const errorMsg =
          apiError.response?.data?.errors?.[0] || 'Failed to process payment. Please try again.';
        setError(errorMsg);
      } else {
        setError(
          apiError.message || 'An error occurred while processing your payment. Please try again.',
        );
      }
      setProcessing(false);
    }
  };

  const cardElementStyle =
    'p-3 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500';

  return (
    <form onSubmit={handleSubmit}>
      <h2 className='text-2xl font-bold mb-4'>Checkout</h2>

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

      <div className='mb-4'>
        <label className='block text-sm font-medium text-gray-700 mb-1'>Discount Code</label>
        <div className='flex rounded-md shadow-sm'>
          <input
            type='text'
            // value={discount.code}
            className='flex-grow min-w-0 block w-full px-3 py-2 rounded-l-md border border-gray-300 focus:ring-1 focus:ring-blue-50 focus:border-blue-500'
            ref={inputRef}
            onChange={(e) => setDiscountCode(e.target.value)}
          />
          <button
            onClick={handleApplyDiscount}
            disabled={!discountCode}
            className={`px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${!discountCode ? 'opacity-50 cursor-not-allowed' : ''}`}
            type='button'
          >
            Apply
          </button>
        </div>
      </div>

      <div className='mb-6 bg-gray-50 p-4 rounded-md'>
        <h3 className='text-lg font-medium text-gray-900 mb-2'>Order Summary</h3>
        <p className='text-sm text-gray-600'>Plan Name: {selectedPlan.name}</p>
        <p className='text-sm text-gray-600'>
          Subtotal:{' '}
          <span className={discount && 'line-through text-gray-500'}>${selectedPlan.price}</span>
          {discount && <span className='ml-2'>${getPlanPrice()}</span>}
        </p>

        <p className='text-sm text-gray-600'>Discount Code: {discount ? discount.code : ''}</p>
        <p className='text-sm font-medium text-gray-900 mt-1'>
          Total:{' '}
          <span className={discount && 'line-through text-gray-500'}>${selectedPlan.price}</span>
          {discount && <span className='ml-2'>${getPlanPrice()}</span>}
        </p>
      </div>

      {error && (
        <div className='mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md'>
          <h4 className='font-bold mb-1'>Error</h4>
          <p>{error}</p>
        </div>
      )}

      {discountError && (
        <div className='mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md'>
          <h4 className='font-bold mb-1'>Error</h4>
          <p>{discountError}</p>
        </div>
      )}

      <button
        type='submit'
        disabled={!stripe || processing}
        className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition duration-150 ease-in-out'
      >
        {processing ? 'Processing...' : 'Subscribe'}
      </button>
    </form>
  );
};

const PaymentModal = ({ closeModal }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm closeModal={closeModal} />
    </Elements>
  );
};

export default PaymentModal;

// import { useEffect, useState } from 'react';

// import Loader from '@/components/loader'
// import { Elements , PaymentElement, useElements,useStripe } from '@stripe/react-stripe-js';
// import { loadStripe } from '@stripe/stripe-js';

// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

// const CheckoutForm = ({ clientSecret, amount, planId }) => {
//     const stripe = useStripe();
//     const elements = useElements();
//     const [isLoading, setLoading] = useState(false);

//     const handleSubmit = async (event) => {
//         event.preventDefault();
//         if (!stripe || !elements) return;

//         setLoading(true);

//         const { error } = await stripe.confirmPayment({
//             elements,
//             confirmParams: {
//                 return_url: `${window.location.origin}/user-account/payment/success?plan_id=${planId}`,
//             },
//         });

//         if (error) {
//             console.error(error.message);
//         }
//         setLoading(false);
//     };

//     return (
//         <form onSubmit={handleSubmit}>
//             <PaymentElement />
//             <button
//                 className={`mt-5 ${
//                     isLoading || !stripe || !elements
//                         ? 'bg-gray-400 cursor-not-allowed'
//                         : 'bg-blue-500 hover:bg-blue-600'
//                 } w-full text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out`}
//                 disabled={isLoading || !stripe || !elements}
//             >
//                 {isLoading ? 'Processing...' : `Pay $${amount/1000}`}
//             </button>
//         </form>

//     );
// };

// const PaymentModal = ({ plan }) => {
//     const [clientSecret, setClientSecret] = useState('');

//     useEffect(() => {
//         const amount = parseFloat(plan.price)*1000;
//         const planId = plan.id;
//         // Fetch the client secret from your API
//         fetch('/api/create-payment-intent', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ amount }),
//         })
//             .then((res) => res.json())
//             .then((data) => setClientSecret(data.clientSecret));
//     }, [plan]);

//     return clientSecret ? (
//         <Elements stripe={stripePromise} options={{ clientSecret }}>
//             <CheckoutForm clientSecret={clientSecret} amount={parseFloat(plan.price)*1000} planId={plan.id} />
//         </Elements>
//     ) : (
//         <Loader/>
//     );
// };

// export default PaymentModal;

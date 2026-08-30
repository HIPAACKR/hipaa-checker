import { useContext, useRef } from 'react';
import { toast } from 'react-toastify';

import SubscriptionContext from '@/context/subscriptionContext';

import './index.scss';

const ConfirmPurchase = ({ onConfirm, onCancel }) => {
  const {
    selectedPlan: plan,
    discount,
    paymentError,
    isProcessingPayment,
  } = useContext(SubscriptionContext);
  const discountInputRef = useRef(null);

  const handleConfirm = () => {
    if (!plan) {
      toast.error('No plan selected');
      return;
    }
    onConfirm();
  };

  const getPlanPrice = () => {
    if (!discount) {
      return plan.price;
    } else {
      if (discount.discount_type === 'fixed') return Number(plan.price) - Number(discount.discount);
      else if (discount.discount_type === 'percentage')
        return Number(plan.price) * (1 - Number(discount.discount) / 100);
    }
  };

  const plan_category = {
    MONTHLY: 'month',
    ANNUALLY: 'year',
  };

  return (
    <div className='confirm-purchase'>
      {/*<h2 className='confirm-purchase__title'>Confirm Purchase</h2>*/}
      <p className='confirm-purchase__details'>
        You are about to subscribe to the <strong>{plan.name}</strong> plan.
      </p>

      <div className='mb-6 bg-gray-50 p-4 rounded-md'>
        <h3 className='text-lg font-medium text-gray-900 mb-2'>Order Summary</h3>
        <p className='text-sm text-gray-600'>Plan Name: {plan.name}</p>
        <p className='text-sm text-gray-600'>
          Plan Pricing: ${plan.price}/{plan.interval === plan_category.MONTHLY ? 'month' : 'year'}
        </p>
        <p className='text-sm text-gray-600'>Subtotal: ${getPlanPrice()}</p>

        {paymentError && (
          <div className='mt-3 p-2 bg-red-100 border border-red-400 text-red-700 rounded-md'>
            {/*<h4 className="font-bold mb-1">Error</h4>*/}
            <p>{paymentError}</p>
          </div>
        )}
      </div>

      <p className='confirm-purchase__price'>
        Total <strong>${getPlanPrice()}</strong>
        {plan.interval === plan_category.MONTHLY ? '/month' : '/year'}
      </p>

      <div className='confirm-purchase__actions'>
        <button
          className={`confirm-purchase__confirm-btn ${isProcessingPayment ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleConfirm}
          disabled={isProcessingPayment}
        >
          {isProcessingPayment ? 'Processing...' : 'Confirm'}
        </button>
        <button
          className='confirm-purchase__cancel-btn'
          onClick={onCancel}
          disabled={isProcessingPayment}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ConfirmPurchase;

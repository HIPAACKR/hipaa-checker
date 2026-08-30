import { useContext } from 'react';
import { toast } from 'react-toastify';

import SubscriptionContext from '@/context/subscriptionContext';

import './index.scss';

const CancelPurchase = ({ onConfirm, onCancel, isProcessing }) => {
  const { selectedPlan: plan, cancelPlanError } = useContext(SubscriptionContext);

  const handleConfirm = () => {
    if (!plan) {
      toast.error('No plan selected');
      return;
    }
    onConfirm();
  };

  return (
    <div className='confirm-purchase'>
      {/*<h2 className='confirm-purchase__title'>Confirm Purchase</h2>*/}
      <p className='confirm-purchase__details'>
        Are you sure you want to cancel <strong>{plan.name}</strong> plan.
      </p>

      {cancelPlanError && (
        <div className='mt-3 p-2 bg-red-100 border border-red-400 text-red-700 rounded-md'>
          {/*<h4 className="font-bold mb-1">Error</h4>*/}
          <p>{cancelPlanError}</p>
        </div>
      )}
      <div className='confirm-purchase__actions mt-2'>
        <button
          className='confirm-purchase__confirm-btn'
          onClick={handleConfirm}
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Confirm'}
        </button>
        <button
          className='confirm-purchase__cancel-btn'
          onClick={onCancel}
          disabled={isProcessing}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CancelPurchase;

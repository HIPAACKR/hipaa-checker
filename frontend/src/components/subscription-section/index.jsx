'use client';

import { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

import ConfirmPurchaseModal from '@/components/confirmPurchaseModal/confirmPurchaseModal';
import Dialog from '@/components/dialog';
import Loader from '@/components/loader';
import PaymentModal from '@/components/paymentModal/paymentModal';
import PlanCard from '@/components/plan-card';
import SubscriptionContext from '@/context/subscriptionContext';

import CancelPurchase from '../cancelPurchaseModal/cancelPurchaseModal';

import './index.scss';

const plan_category = {
  FREE: 'free',
  MONTHLY: 'month',
  ANNUALLY: 'year',
};

const SubscriptionSection = () => {
  const {
    plans,
    userData,
    setSelectedPlan,
    isProcessing,
    setPaymentError,
    handleConfirmPurchase,
    handleConfirmPlanCancel,
    setDiscount,
    setDiscountError,
    isLoadingData,
    isProcessingPayment,
    isProcessingCancel,
    paymentError,
    cancelPlanError,
    setCancelPlanError,
    fetchData,
  } = useContext(SubscriptionContext);
  const [billingCycle, setBillingCycle] = useState(plan_category.MONTHLY);
  const [isModalOpen, setModalOpen] = useState(false);
  const [planName, setPlanName] = useState(null);

  const router = useRouter();

  const onConfirmPurchase = () => {
    handleConfirmPurchase(closeModal);
  };

  const onConfirmPlanCancel = () => {
    handleConfirmPlanCancel(closeModal);
    fetchData();
  };

  const openModal = (planId) => {
    setDiscount(null);
    setDiscountError(null);
    setPaymentError(null);
    if (!userData) {
      router.push('/sign-in?redirect=user-account/subscription');
    }
    try {
      const plan_to_purchase = plans.find((plan) => plan.id === planId);
      setPlanName(plan_to_purchase.name);

      if (!plan_to_purchase) {
        toast.error('Selected plan not found');
      }
      setSelectedPlan(plan_to_purchase);
      setModalOpen(true);
    } catch (error) {
      toast.error(`Error selecting plan: ${error.message}`);
    }
  };

  const closeModal = () => {
    setDiscount(null);
    setDiscountError(null);
    setCancelPlanError(null);
    setPaymentError(null);
    setModalOpen(false);
  };

  const changeToMonthly = () => {
    setBillingCycle(plan_category.MONTHLY);
  };

  const changeToAnnually = () => {
    setBillingCycle(plan_category.ANNUALLY);
  };

  let plansToShow = [];
  if (plans) {
    plansToShow = plans
      .filter((plan) =>
        billingCycle === plan_category.MONTHLY
          ? plan.interval !== plan_category.ANNUALLY
          : plan.interval !== plan_category.MONTHLY,
      )
      .sort((a, b) => Number(a.price) - Number(b.price));
  }

  return (
    <div className='subscription'>
      <h1 className='subscription__title'>Purchase a subscription</h1>
      <p className='subscription__subtitle'>Choose the plan that works for you.</p>

      <div className='subscription__toggle'>
        <button
          className={`subscription__toggle-btn ${billingCycle === plan_category.MONTHLY ? 'subscription__toggle-btn--active' : ''}`}
          onClick={changeToMonthly}
        >
          Monthly
        </button>
        <button
          className={`subscription__toggle-btn ${billingCycle === plan_category.ANNUALLY ? 'subscription__toggle-btn--active' : ''}`}
          onClick={changeToAnnually}
        >
          Annually
        </button>
      </div>

      {isLoadingData ? (
        <Loader />
      ) : (
        <div className='subscription__plans'>
          {plansToShow.map((plan, index) => (
            <PlanCard
              key={index}
              plan={plan}
              openModal={openModal}
              isSelected={userData?.plan?.name === plan.name}
            />
          ))}
        </div>
      )}

      {userData?.plan?.name != planName ? (
        <Dialog
          isOpen={isModalOpen}
          onClose={closeModal}
          title='Confirm Purchase'
        >
          <ConfirmPurchaseModal
            onConfirm={onConfirmPurchase}
            isProcessing={isProcessing}
            onCancel={closeModal}
          />
        </Dialog>
      ) : (
        <Dialog
          isOpen={isModalOpen}
          onClose={closeModal}
          title='Cancel Plan'
        >
          <CancelPurchase
            onConfirm={onConfirmPlanCancel}
            isProcessing={isProcessingCancel}
            onCancel={closeModal}
          />
        </Dialog>
      )}

      {userData && !userData.plan && (
        <Dialog
          isOpen={isModalOpen}
          onClose={closeModal}
          title=''
        >
          <PaymentModal closeModal={closeModal} />
        </Dialog>
      )}

      {!isLoadingData && plans && plans.length === 0 && (
        <p className='subscription__error'>No subscription plans available at the moment.</p>
      )}
    </div>
  );
};

export default SubscriptionSection;

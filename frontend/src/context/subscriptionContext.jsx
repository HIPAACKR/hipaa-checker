'use client';

import { createContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

import { get, post, remove } from '@/utils/api-service';
import API_ENDPOINTS from '@/utils/apiEndpoints';

const SubscriptionContext = createContext(null);

export const SubscriptionProvider = ({ children }) => {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [showRoleOnHeader, setShowRoleOnHeader] = useState(false);
  const [plans, setPlans] = useState(null);
  const [promotionalCodes, setPromotionalCodes] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [discount, setDiscount] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [discountError, setDiscountError] = useState(null);
  const [paymentError, setPaymentError] = useState(null);
  const [cancelPlanError, setCancelPlanError] = useState(null);
  const [isProcessingCancel, setIsProcessingCancel] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState(null);

  const handleConfirmPurchase = async (callback) => {
    setIsProcessingPayment(true);
    try {
      const payload = {
        user: {
          plan_id: selectedPlan.id,
        },
        ...(discount?.code ? { code: discount.code } : {}),
      };
      // Add logic to process the purchase here
      const response = await post(API_ENDPOINTS.SUBSCRIPTIONS, payload, true);

      toast.success(`Successfully purchased ${selectedPlan.name} plan!`);
      setPaymentError(null);
      callback();
      await fetchData();
    } catch (error) {
      if (error.response?.status === 500) {
        setPaymentError('Internal Server Error. Please try again later.');
      } else if (error.response?.status >= 400 && error.response?.status < 500) {
        const errorMsg =
          error.response?.data?.errors?.[0] || 'Failed to process payment. Please try again.';
        setPaymentError(errorMsg);
      } else {
        setPaymentError('Failed to complete the purchase. Please try again.');
      }
    } finally {
      setIsProcessingPayment(false);
      setDiscountError(null);
    }
  };

  const handleConfirmPlanCancel = async (callback) => {
    setIsProcessingCancel(true);
    try {
      const response = await remove(API_ENDPOINTS.CANCEL, true);

      toast.success(`Successfully cancelled ${selectedPlan.name} plan!`);
      setPaymentError(null);
      callback();
    } catch (error) {
      if (error.response?.status === 500) {
        setCancelPlanError('Internal Server Error. Please try again later.');
      } else if (error.response?.status >= 400 && error.response?.status < 500) {
        const errorMsg =
          error.response?.data?.errors?.[0] || 'Failed to cancel plan. Please try again.';
        setCancelPlanError(errorMsg);
      } else {
        setCancelPlanError('Failed to cancel the purchase. Please try again.');
      }
    } finally {
      setIsProcessingCancel(false);
      setDiscountError(null);
    }
  };

  const fetchData = async () => {
    setIsLoadingData(true);
    try {
      // eslint-disable-next-line no-undef
      const [userResult, plansResult, promotionalCodesResult] = await Promise.allSettled([
        get(API_ENDPOINTS.USER, true),
        get(API_ENDPOINTS.PLANS, false),
        get(API_ENDPOINTS.PROMOTIONAL_CODES, false),
      ]);

      // if (userResult.status === 'fulfilled' && userResult.value.ok) {
      //   const userData = await userResult.value.json();
      //   setUserData(userData.user);
      // }
      if (userResult.status === 'fulfilled') {
        setUserData(userResult.value.data.user);
      } else {
        setUserData(null);
      }

      // if (plansResult.status === 'fulfilled' && plansResult.value.ok) {
      //   const plansData = await plansResult.value.json();
      //   setPlans(plansData);
      // }
      if (plansResult.status === 'fulfilled') {
        setPlans(plansResult.value.data);
      } else {
        setPlans(null);
      }

      // if (promotionalCodesResult.status === 'fulfilled' && promotionalCodesResult.value.ok) {
      //   const promotionalCodeData = await promotionalCodesResult.value.json();
      //   setPromotionalCodes(promotionalCodeData);
      // }
      if (promotionalCodesResult.status === 'fulfilled') {
        setPromotionalCodes(promotionalCodesResult.value.data);
      } else {
        setPromotionalCodes(null);
      }
    } catch (error) {
    } finally {
      setIsLoadingData(false);
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      const response = await get(API_ENDPOINTS.PAYMENT_METHODS, true);
      const data = response?.data;
      setPaymentMethods(data);
    } catch (error) {}
  };

  useEffect(() => {
    fetchData();
    fetchPaymentMethods();
  }, []);

  const verifyAndApplyDiscount = (promotionalCode) => {
    setDiscountError(null);
    const verifiedDiscount = promotionalCodes.find((el) => el.code === promotionalCode);
    if (!verifiedDiscount) {
      setDiscountError('Invalid Discount Code!');
      return;
    }
    if (verifiedDiscount) {
      setDiscount(verifiedDiscount);
      setDiscountError(null);
      toast.success('Discount Applied Successfully');
    }
  };

  return (
    <SubscriptionContext.Provider
      value={{
        fetchData,
        userData,
        setUserData,
        plans,
        setPlans,
        selectedPlan,
        setSelectedPlan,
        promotionalCodes,
        setPromotionalCodes,
        discount,
        setDiscount,
        isProcessingPayment,
        setIsProcessingPayment,
        isProcessingCancel,
        setIsProcessingCancel,
        isLoadingData,
        setIsLoadingData,
        verifyAndApplyDiscount,
        discountError,
        setDiscountError,
        paymentError,
        setPaymentError,
        cancelPlanError,
        setCancelPlanError,
        handleConfirmPurchase,
        handleConfirmPlanCancel,
        paymentMethods,
        fetchPaymentMethods,
        showRoleOnHeader,
        setShowRoleOnHeader
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export default SubscriptionContext;

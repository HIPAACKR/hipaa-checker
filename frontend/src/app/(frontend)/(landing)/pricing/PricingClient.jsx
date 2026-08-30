'use client';

import { useContext, useEffect } from 'react';

import EyeCatch from '@/components/eye-catch';
import SubscriptionSection from '@/components/subscription-section';
import subscriptionContext from '@/context/subscriptionContext';

function PricingClient() {
  const { fetchData } = useContext(subscriptionContext);
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <EyeCatch param='pricing' />
      <SubscriptionSection />
    </>
  );
}

export default PricingClient;
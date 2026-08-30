'use client';

import { useContext, useEffect } from 'react';

import SubscriptionSection from '@/components/subscription-section';
import subscriptionContext from '@/context/subscriptionContext';

export default function SubscriptionPage() {
  const { fetchData } = useContext(subscriptionContext);
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <SubscriptionSection />;
}
